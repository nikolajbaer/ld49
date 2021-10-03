import { System,Not } from "ecsy"
import { Physics2dComponent } from "gokart.js/src/core/components/physics2d"

import { ActionListenerComponent } from "gokart.js/src/core/components/controls"
import { Vector2 } from "three"
const SHIP_ACCELERATION = 4

export class ShipControlsSystem extends System {
  init(attributes) {
    this.lastLog = 0;
    this.angle = 0;
  }

  execute(delta,time){
    this.queries.ship.results.forEach( e => {
      const actions = e.getComponent(ActionListenerComponent).actions
      const body = e.getComponent(Physics2dComponent).body

      
      // on left or right, set the velocity
      
      const v = body.getLinearVelocity();
      /*
      if(actions['left']){
        body.setLinearVelocity({x:v.x-SHIP_ACCELERATION,y:v.y})
      }else if(actions['right']){
        body.setLinearVelocity({x:v.x+SHIP_ACCELERATION,y:v.y})
      }
      */

      // Easier controls \_()o_o)_/
      if(actions['left']){
        //body.setLinearVelocity({x:-20,y:0}, 0)
        body.setLinearVelocity({x:v.x-SHIP_ACCELERATION,y:v.y})

        if (this.angle < Math.PI / 2) {
          this.angle += Math.PI * 0.01
        }
      }else if(actions['right']){
        //body.setLinearVelocity({x:20,y:0}, 0)
        body.setLinearVelocity({x:v.x+SHIP_ACCELERATION,y:v.y})

        if (this.angle > Math.PI / -2) {
          this.angle -= Math.PI * 0.01
        }
      }else{
        if (this.angle < 0.01) {
          this.angle += Math.PI * 0.04
        } else if (this.angle > 0.01) {
          this.angle -= Math.PI * 0.04
        }
        if (v.x > 0.1) {
          body.setLinearVelocity({x: v.x - SHIP_ACCELERATION, y:v.y})
        } else if (v.x < -0.1) {
          body.setLinearVelocity({x: v.x + SHIP_ACCELERATION, y:v.y})
        } else { 
          body.setLinearVelocity({x:0,y:0}, 0)
        }
      }
      body.setAngle(this.angle);


      const p = body.getPosition();

      if (p.x < -10) {
        body.setTransform({x:-10, y:p.y}, this.angle)
        body.setLinearVelocity({x: 0, y: 0})
      }

      if (p.x > 10) {
        body.setTransform({x: 10, y:p.y}, this.angle)
        body.setLinearVelocity({x: 0, y: 0})
      }

      if ((time - this.lastLog) > 1.0) {
        console.log(body.getLinearVelocity());
        console.log("ship body", body);
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