import { System,Not } from "ecsy"
import { ModelComponent, Obj3dComponent } from "gokart.js/src/core/components/render"
import { StarsComponent } from "../components/stars"

export class StarsSystem extends System {
  execute(delta,time){
    this.queries.starfield.results.forEach( e => {
      e.getComponent(Obj3dComponent).obj.update(delta)
    })
  }
}
StarsSystem.queries = {
  starfield: {
    components: [StarsComponent,Obj3dComponent]
  }
}