import { Physics2dScene } from "gokart.js/src/scene/physics2d"
import { CameraComponent,  ModelComponent, LightComponent  } from "gokart.js/src/core/components/render"
import { Body2dComponent } from "gokart.js/src/core/components/physics2d"
import { Vector3,Vector2 } from "gokart.js/src/core/ecs_types"
import { LocRotComponent } from "gokart.js/src/core/components/position"

export class GameScene extends Physics2dScene {
    init_entities(){
        const l1 = this.world.createEntity()
        l1.addComponent(LocRotComponent,{location: new Vector3(0,0,0)})
        l1.addComponent(LightComponent,{type:"ambient",intensity:0.6})

        const l2 = this.world.createEntity()
        l2.addComponent(LocRotComponent,{location: new Vector3(0,30,20),rotation: new Vector3(-Math.PI/4,0,0)})
        l2.addComponent(LightComponent,{type:"directional",cast_shadow:true,intensity:0.6})

        const c = this.world.createEntity()
        c.addComponent(CameraComponent,{lookAt: new Vector3(0,0,20),current: true, fov:60})
        c.addComponent(LocRotComponent,{location: new Vector3(0,20,-15)})

        const box = this.world.createEntity()
        box.addComponent(ModelComponent,{})
        box.addComponent(LocRotComponent,{location: new Vector3(0,0,0)})
        //box.addComponent(Body2dComponent,{})
        box.name = "ship"
    }
}