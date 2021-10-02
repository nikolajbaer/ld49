import { System,Not } from "ecsy"
import { HUDDataComponent } from "gokart.js/src/core/components/hud"
import { Physics2dComponent } from "gokart.js/src/core/components/physics2d"
import { Vector2 } from "three"
import { ShipComponent } from "../components/ship"

export class ShipSystem extends System {
  init(attributes) {
    this.reactor_meltdown_time = 30  // 30 seconds til meltdown
  }

  update_manifold(m,on,delta){
    let cooling = 0
    if(on && m.current > 0){
      console.log("Manifold on!")
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
      if(ship.health <= 0 || ship.reactor_heat == ship.max_reactor_heat){
        //e.remove() 
        // Add explosion?
      }

    })
  }
}

ShipSystem.queries = {
  ship: {
    components: [ShipComponent,Physics2dComponent,HUDDataComponent]
  }
}