import { System,Not } from "ecsy"
import { Body2dComponent, Physics2dComponent } from "gokart.js/src/core/components/physics2d"
import { LocRotComponent } from "gokart.js/src/core/components/position"
import { ModelComponent } from "gokart.js/src/core/components/render"
import { Vector3,Vector2 } from "gokart.js/src/core/ecs_types"
import { AsteroidComponent } from "../components/asteroids"

export class AsteroidsSystem extends System {
  init(attributes) {
    this.bounds = attributes.bounds
    this.max_asteroids = 10 
    this.level = 1
    this.asteroid_freq = 0.95
  }

  start_pos(){
    return new Vector3(
      Math.random()* (this.bounds.x1-this.bounds.x0)+this.bounds.x0,
      0,
      this.bounds.z1
    )
  }

  spawn_asteroid(){
    const e = this.world.createEntity()
    e.addComponent(Body2dComponent,{body_type:'kinematic'})
    e.addComponent(ModelComponent,{geometry:'box'})
    e.addComponent(LocRotComponent,{location:this.start_pos()})
    e.addComponent(AsteroidComponent,{
      speed:Math.random()*this.level + 0.25,
      spin:Math.random()/100
    })
    console.log("spawned asteroid")
  }

  respawn_asteroid(e){
    console.log("respawning")
    const l = e.getMutableComponent(LocRotComponent)
    l.location = this.start_pos()
    const a = e.getMutableComponent(AsteroidComponent)
    e.speed = Math.random() * this.level
    e.spin = Math.random() * this.level

    const b = e.getComponent(Physics2dComponent).body
    b.setLinearVelocity({x:0,y:-a.speed}) 
    b.setAngularVelocity(a.spin) 

    // TODO vary scale?
  }

  execute(delta,time){
    if(this.queries.asteroids.results.length < this.max_asteroids){
      if(Math.random() > this.asteroid_freq){
        this.spawn_asteroid()
      }
    }

    this.queries.asteroids.added.forEach( e => {
      const b = e.getComponent(Physics2dComponent).body
      const a = e.getComponent(AsteroidComponent)
      b.setLinearVelocity({x:0,y:-a.speed}) 
      b.setAngularVelocity(a.spin) 
    })

    this.queries.asteroids.results.forEach( e => {
      const l = e.getComponent(LocRotComponent)
      if(l.location.z < this.bounds.z0){
        // wait?
        this.respawn_asteroid(e)
      }
    })
  }
}
AsteroidsSystem.queries = {
  asteroids: {
    components: [AsteroidComponent,Physics2dComponent],
    listen: {
      added: true
    }
  }
}