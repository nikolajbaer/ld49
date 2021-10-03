import { System,Not } from "ecsy"
import { Body2dComponent, Physics2dComponent } from "gokart.js/src/core/components/physics2d"
import { LocRotComponent } from "gokart.js/src/core/components/position"
import { ModelComponent } from "gokart.js/src/core/components/render"
import { Vector3,Vector2 } from "gokart.js/src/core/ecs_types"
import { AsteroidComponent } from "../components/asteroids"
//import SHIP_GLB from "./assets/craft_speederD.glb";
import { LogLuvEncoding } from "three"


export class AsteroidsSystem extends System {
  init(attributes) {
    this.bounds = attributes.bounds
    this.max_asteroids = 100
    this.level = 1
    this.speed = 5
    this.asteroid_freq = 0.5
  }

  start_pos(){
    return new Vector3(
      Math.random()* (this.bounds.x1-this.bounds.x0)+this.bounds.x0,
      this.bounds.y1,
      0
    )
  }

  spawn_asteroid(){
    const e = this.world.createEntity()
    const pos = this.start_pos()
    e.addComponent(Body2dComponent,{body_type:'dynamic'})
    const geo = "asteroid" + (Math.floor(Math.random() * 3) + 1);
    console.log("geo", geo);
    e.addComponent(ModelComponent,{geometry:geo})
    e.addComponent(LocRotComponent,{location:pos})
    e.addComponent(AsteroidComponent, {
      speed:Math.random()*this.level*2*this.speed + 0.25,
      spin: Math.random() - 1.0
    })
    console.log("spawned asteroid at ",pos)
  }

  respawn_asteroid(e){
    const pos = this.start_pos()
    console.log("respawning at ", pos)
    const a = e.getMutableComponent(AsteroidComponent)
    e.speed = Math.random() * this.level
    e.spin = Math.random() * this.level

    const b = e.getComponent(Physics2dComponent).body
    b.setTransform({x:pos.x,y:pos.y},b.getAngle())
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
      if(l.location.y < this.bounds.y0){
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