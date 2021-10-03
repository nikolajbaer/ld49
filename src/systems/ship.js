import { System,Not } from "ecsy"
import { HUDDataComponent } from "gokart.js/src/core/components/hud"
import { Collision2dComponent, Physics2dComponent } from "gokart.js/src/core/components/physics2d"
import { LocRotComponent } from "gokart.js/src/core/components/position"
import { Vector3,Vector2 } from "gokart.js/src/core/ecs_types"
import { ExplosionComponent } from "../components/explosion"
import { ShipComponent } from "../components/ship"
import { MusicLoopComponent, SoundEffectComponent } from "gokart.js/src/core/components/sound"

export class ShipSystem extends System {
  init(attributes) {
    this.reactor_meltdown_time = 30  // 30 seconds til meltdown
  }

  // If manifold is enabled
  // we release coolant at the flow level 
  // if there is coolant available
  // otherwise it charges up 
  update_manifold(m,on,delta){
    let cooling = 0
    if(on && m.current > 0){
      m.current -= m.flow * delta
      if(m.current < 0){ 
        m.current =  0 
      }
      cooling = m.flow * delta
    }else{
      m.current += m.charge * delta
      if(m.current > m.max){ m.current = m.max }
    }
    return cooling
  }

  execute(delta,time){
    this.queries.ship.results.forEach( e => {
      const ship = e.getMutableComponent(ShipComponent)
      const hud = e.getMutableComponent(HUDDataComponent)

      ship.reactor_heat += delta*(1/this.reactor_meltdown_time) * 100

      // Factor in coolant flow
      let cooling = 0
      cooling += this.update_manifold(ship.manifolds[0],hud.recv.manifold1,delta)
      cooling += this.update_manifold(ship.manifolds[1],hud.recv.manifold2,delta)
      cooling += this.update_manifold(ship.manifolds[2],hud.recv.manifold3,delta)
      ship.reactor_heat -= cooling
      
      // Update HUD
      hud.data.reactor_status = ship.reactor_heat/ship.max_reactor_heat
      hud.data.coolant1 = ship.manifolds[0].current/ship.manifolds[0].max
      hud.data.coolant2 = ship.manifolds[1].current/ship.manifolds[1].max
      hud.data.coolant3 = ship.manifolds[2].current/ship.manifolds[2].max
      hud.data.health = ship.health

      if(ship.reactor_heat > ship.max_reactor_heat){
        ship.reactor_heat = ship.max_reactor_heat
      }

      if(e.hasComponent(Collision2dComponent)){
        const col = e.getComponent(Collision2dComponent)
        const pos = col.entity.getComponent(Physics2dComponent).body.getPosition()
        col.entity.remove()

        const exp = this.world.createEntity()
        exp.addComponent(ExplosionComponent,{})
        exp.addComponent(LocRotComponent,{location: new Vector3(pos.x,pos.y,0)})

          
        const hull_sound = "hull"+(Math.floor(Math.random() * 5) + 1)
        e.addComponent(SoundEffectComponent, {
          location: {x:pos.x, y:pos.y},
          sound: hull_sound,
          volume: 0.3
        })
    
        ship.health -= 20
        e.removeComponent(Collision2dComponent)
      }

      if(ship.health <= 0 || ship.reactor_heat == ship.max_reactor_heat){
        const pos = e.getComponent(Physics2dComponent).body.getPosition()
        const exp = this.world.createEntity()
        exp.addComponent(ExplosionComponent,{size:3,duration:2})
        exp.addComponent(MusicLoopComponent, {
          sound: "explosion",
          volume: 0.6,
          playing: false
        })
        exp.addComponent(LocRotComponent,{location: new Vector3(pos.x,pos.y,0)})
        e.remove() 
        console.log("Game Over!")
        hud.data.game_over = true
      }

    })
  }
}

ShipSystem.queries = {
  ship: {
    components: [ShipComponent,Physics2dComponent,HUDDataComponent]
  }
}