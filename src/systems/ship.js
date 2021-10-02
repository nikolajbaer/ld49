import { System,Not } from "ecsy"
import { HUDDataComponent } from "gokart.js/src/core/components/hud"
import { Physics2dComponent } from "gokart.js/src/core/components/physics2d"
import { Vector2 } from "three"
import { ShipComponent } from "../components/ship"

export class ShipSystem extends System {
  init(attributes) {
    this.reactor_meltdown_time = 30  // 30 seconds til meltdown
  }

  execute(delta,time){
    this.queries.ship.results.forEach( e => {
      const ship = e.getMutableComponent(ShipComponent)
      ship.reactor_heat += delta*(1/this.reactor_meltdown_time) * 100
      // Factor in coolant flow?
      // Recharge Coolant Manifolds?

      // Update HUD
      const hud_data = e.getComponent(HUDDataComponent).data
      hud_data.reactor_status = ship.reactor_heat/ship.max_reactor_heat
      hud_data.health = ship.health/ship.max_health

      /*
      if(ship.health <= 0 || ship.reactor_heat > ship.max_reactor_heat){
        e.remove() 
        // Add explosion?
      }*/

    })
  }
}

ShipSystem.queries = {
  ship: {
    components: [ShipComponent,Physics2dComponent,HUDDataComponent]
  }
}