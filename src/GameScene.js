import { Physics2dScene } from "gokart.js/src/scene/physics2d"
import { CameraComponent,  ModelComponent, LightComponent  } from "gokart.js/src/core/components/render"
import { Body2dComponent } from "gokart.js/src/core/components/physics2d"
import { Vector3,Vector2 } from "gokart.js/src/core/ecs_types"
import { LocRotComponent } from "gokart.js/src/core/components/position"
import { AsteroidComponent } from "./components/asteroids"
import { AsteroidsSystem } from "./systems/asteroids"
import SHIP_GLB from "./assets/craft_speederD.glb";
import { ActionListenerComponent } from ".gokart.js/src/core/components/controls"
import { ShipControlsSystem } from "./systems/ship_controls"
import { ShipComponent } from "./components/ship"

export class GameScene extends Physics2dScene {
    init_entities(){
        const l1 = this.world.createEntity()
        l1.addComponent(LocRotComponent,{location: new Vector3(0,0,0)})
        l1.addComponent(LightComponent,{type:"ambient",intensity:0.6})

        const l2 = this.world.createEntity()
        l2.addComponent(LocRotComponent,{location: new Vector3(0,20,30),rotation: new Vector3(-Math.PI/4,0,0)})
        l2.addComponent(LightComponent,{type:"directional",cast_shadow:true,intensity:0.6})

        const c = this.world.createEntity()
        c.addComponent(CameraComponent,{lookAt: new Vector3(0,10,0),current: true, fov:60})
        c.addComponent(LocRotComponent,{location: new Vector3(0,-10,20)})

        const ship = this.world.createEntity()
        ship.addComponent(ModelComponent,{geometry:"ship"})
        ship.addComponent(LocRotComponent,{location: new Vector3(0,0,0),rotation: new Vector3(Math.PI/2,0,0)})
        ship.addComponent(Body2dComponent,{body_type:'kinematic'})
        ship.addComponent(ActionListenerComponent)
        ship.addComponent(ShipComponent)
        ship.name = "ship"
    }

    register_components(){
      super.register_components()
      this.world.registerComponent(AsteroidComponent)
      this.world.registerComponent(ShipComponent)
    }

    register_systems(){
      super.register_systems()
      this.world.registerSystem(AsteroidsSystem,{
        bounds: {x0:-20,x1:20,y0:-20,y1:50}
      })
      this.world.registerSystem(ShipControlsSystem)
    }

    get_meshes_to_load(){
        return {
            "ship":{ 
                url:SHIP_GLB,
                scale: 1,
                offset: new Vector3(0,0,0),
            },
        }
    }
}