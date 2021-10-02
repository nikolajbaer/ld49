import { System,Not } from "ecsy"
import { Physics2dComponent } from "gokart.js/src/core/components/physics2d"

import { ActionListenerComponent } from "gokart.js/src/core/components/controls"
import { Vector2 } from "three"

export class ShipControlsSystem extends System {
  init(attributes) {
  }

  execute(delta,time){
    this.queries.ship.results.forEach( e => {
      const actions = e.getComponent(ActionListenerComponent).actions
      const body = e.getComponent(Physics2dComponent).body
      
      // on left or right, set the velocity
      const v = body.getLinearVelocity();
      if(actions['left']){
        body.setLinearVelocity({x:v.x-1,y:v.y})
      }else if(actions['right']){
        body.setLinearVelocity({x:v.x+1,y:v.y})
      }
    })
  }
}

ShipControlsSystem.queries = {
  ship: {
    components: [ActionListenerComponent,Physics2dComponent]
  }
}