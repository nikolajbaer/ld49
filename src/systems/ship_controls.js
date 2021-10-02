import { System,Not } from "ecsy"
import { Physics2dComponent } from "gokart.js/src/core/components/physics2d"

import { ActionListenerComponent } from "gokart.js/src/core/components/controls"
import { Vector2 } from "three"
const SHIP_ACCELERATION = 2

export class ShipControlsSystem extends System {
  init(attributes) {
    this.lastLog = 0;
  }

  execute(delta,time){
    this.queries.ship.results.forEach( e => {
      const actions = e.getComponent(ActionListenerComponent).actions
      const body = e.getComponent(Physics2dComponent).body
      
      // on left or right, set the velocity
      const v = body.getLinearVelocity();
      if(actions['left']){
        body.setLinearVelocity({x:v.x-SHIP_ACCELERATION,y:v.y})
      }else if(actions['right']){
        body.setLinearVelocity({x:v.x+SHIP_ACCELERATION,y:v.y})
      }

      const p = body.getPosition();

      if (p.x < -10) {
        body.setTransform({x:-10, y:p.y}, 0)
        body.setLinearVelocity({x: 0, y: 0})
      }
      
      if (p.x > 10) {
        body.setTransform({x: 10, y:p.y}, 0)
        body.setLinearVelocity({x: 0, y: 0})
      }

      if ((time - this.lastLog) > 1.0) {
        console.log(body.getLinearVelocity());
        this.lastLog = time;
      }

    })
  }
}

ShipControlsSystem.queries = {
  ship: {
    components: [ActionListenerComponent,Physics2dComponent]
  }
}