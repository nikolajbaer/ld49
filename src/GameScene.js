import { Physics2dScene } from "gokart.js/src/scene/physics2d"
import { CameraComponent,  ModelComponent, LightComponent  } from "gokart.js/src/core/components/render"
import { Body2dComponent } from "gokart.js/src/core/components/physics2d"
import { Vector3,Vector2 } from "gokart.js/src/core/ecs_types"
import { LocRotComponent } from "gokart.js/src/core/components/position"
import { AsteroidComponent } from "./components/asteroids"
import { AsteroidsSystem } from "./systems/asteroids"
import SHIP from "./assets/spaceship.fbx"
import ASTEROID_MESH1 from "./assets/asteroids/1.fbx"
import ASTEROID_MESH2 from "./assets/asteroids/2.fbx"
import ASTEROID_MESH3 from "./assets/asteroids/3.fbx"
import THEME_MUSIC from "./assets/music/theme.mp3"
import HULLHIT_1 from "./assets/sfx/hull-a.wav"
import HULLHIT_2 from "./assets/sfx/hull-c.wav"
import HULLHIT_3 from "./assets/sfx/hull-e.wav"
import HULLHIT_4 from "./assets/sfx/hull-g.wav"
import HULLHIT_5 from "./assets/sfx/hull-a2.wav"
import EXPLOSION from "./assets/sfx/explode.wav"

import { ActionListenerComponent } from "gokart.js/src/core/components/controls"
import { ShipControlsSystem } from "./systems/ship_controls"
import { ShipComponent } from "./components/ship"

import { makeAutoObservable, runInAction } from "mobx"
import { HUDDataComponent } from "gokart.js/src/core/components/hud"
import { ShipSystem } from "./systems/ship"
import { ExplosionComponent } from "./components/explosion"
import { ExplosionSystem } from "./systems/explosion"
import { StarField } from "./util/Starfield"
import { MusicLoopComponent, SoundEffectComponent } from "gokart.js/src/core/components/sound"
import * as THREE from "three"
import { StarsComponent } from "./components/stars"
import { StarsSystem } from "./systems/stars"

class UnstableHUDState {
    health = 0
    manifold1 = 0 
    manifold2 = 0 
    manifold3 = 0 
    reactor_status = 0
    fps = 0
    coolant1 = 0
    coolant2 = 0
    coolant3 = 0
    game_over = 0

    constructor(){
        makeAutoObservable(this)
    }

}

export class GameScene extends Physics2dScene {
    init_entities(){

        const music = this.world.createEntity()
        music.addComponent(MusicLoopComponent, {volume: 0.2, sound:"theme"})

        const l2 = this.world.createEntity()
        l2.addComponent(LocRotComponent,{location: new Vector3(0,20,30),rotation: new Vector3(-Math.PI/4,0,0)})
        l2.addComponent(LightComponent,{type:"directional",cast_shadow:true,intensity:0.6})

        const c = this.world.createEntity()
        c.addComponent(CameraComponent,{lookAt: new Vector3(0,10,0),current: true, fov:60})
        c.addComponent(LocRotComponent,{location: new Vector3(0,-10,20)})

        const stars = this.world.createEntity()
        stars.addComponent(ModelComponent,{geometry:"starfield"})
        stars.addComponent(LocRotComponent, {location: new Vector3(0,0,0)})
        stars.addComponent(StarsComponent)

        const ship = this.world.createEntity()
        ship.addComponent(ModelComponent,{geometry:"ship"})
        ship.addComponent(LocRotComponent,{location: new Vector3(0,0,0),rotation: new Vector3(Math.PI/2,0,0)})
        ship.addComponent(Body2dComponent,{body_type:'kinematic',track_collisions:true})
        ship.addComponent(ActionListenerComponent)
        ship.addComponent(ShipComponent)
        ship.addComponent(HUDDataComponent)
        ship.name = "ship"
    }

    register_components(){
      super.register_components()
      this.world.registerComponent(AsteroidComponent)
      this.world.registerComponent(ShipComponent)
      this.world.registerComponent(ExplosionComponent)
      this.world.registerComponent(StarsComponent)
    }

    register_systems(){
      super.register_systems()
      this.world.registerSystem(AsteroidsSystem,{
        bounds: {x0:-20,x1:20,y0:-20,y1:100}
      })
      this.world.registerSystem(ShipControlsSystem)
      this.world.registerSystem(ShipSystem)
      this.world.registerSystem(ExplosionSystem)
      this.world.registerSystem(StarsSystem)
    }

    get_meshes_to_load(){
        return {
            "ship":{ 
                url:SHIP,
                scale: 0.005,
                offset: new Vector3(0,0,0),
            },
            "asteroid1":{
                url:ASTEROID_MESH1,
                scale: 0.005,
                offset: new Vector3(0,0,0),
            },
            "asteroid2":{
              url:ASTEROID_MESH2,
              scale: 0.003,
              offset: new Vector3(0,0,0),
            },
            "asteroid3":{
              url:ASTEROID_MESH3,
              scale: 0.003,
              offset: new Vector3(0,0,0),
            }
        }
    }

    get_mesh_functions(){
      return {
        "starfield": (entity,material,receiveShadow,castShadow) => {  
          const starfield = new StarField(1000,{x: 100, y: 100, z: 100})
          starfield.stars.rotation.x = Math.PI/2
          //starfield.warp_speed()
          return starfield
        }
      }
    }

    get_sounds_to_load() {
      return {
        "theme": {
          url:THEME_MUSIC,
          name:"theme",
          loop:true,
        },
        "hull1": {
          url:HULLHIT_1,
          name:"hull1",
        },
        "hull2": {
          url:HULLHIT_2,
          name:"hull2",
        },
        "hull3": {
          url:HULLHIT_3,
          name:"hull3",
        },
        "hull4": {
          url:HULLHIT_4,
          name:"hull4",
        },
        "hull5": {
          url:HULLHIT_5,
          name:"hull5",
        },
        "explosion": {
          url:EXPLOSION,
          name:"explosion",
        }
      }
    }
    
    init_hud_state(){
        return new UnstableHUDState()
    }
}
