import { System,Not } from "ecsy"
import { Physics2dComponent } from "gokart.js/src/core/components/physics2d"

import { ActionListenerComponent } from "../../gokart.js/src/core/components/controls"

export class ShipControlsSystem extends System {
  init(attributes) {
  }

  execute(delta,time){
    this.queries.ship.results.forEach( e => {
      const actions = e.getComponent(ActionListenerComponent).actions
      const body = e.getComponent(Physics2dComponent).body

      if(actions['left']){
        body.setTransform({x:-10,y:0},0)
      }else if(actions['right']){
        body.setTransform({x:10,y:0},0)
      }else{
        body.setTransform({x:0,y:0},0)
      }
    })
  }
}

ShipControlsSystem.queries = {
  ship: {
    components: [ActionListenerComponent,Physics2dComponent]
  }
}