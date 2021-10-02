import * as React from 'react'
import ReactDOM from "react-dom"
import { GameComponent } from "gokart.js/src/core/ui_components/GameComponent.jsx"
import { HUDView } from "gokart.js/src/core/ui_components/HUDView.jsx"
import { GameScene }  from "./GameScene"
import { HUDSystem } from 'gokart.js/src/core/systems/hud'

class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = { 
            playing: false,
            loading: false,
            scene: null,
            fullscreen: false,
        }
        this.handleFullscreen = this.handleFullscreen.bind(this)
    }

    handleFullscreen(event){
        const showFullscreen = event.target.checked
        if (!document.fullscreenElement && showFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen && !showFullscreen) {
                document.exitFullscreen();
            }
        }
        this.setState({fullscreen:showFullscreen})
    }

    startLoading(selected_scene){
        this.setState({loading:true}) 
        let scene = null
        scene = new GameScene() 
        scene.load().then( () => {
            this.setState({playing:true,loading:false})
        })
        this.setState({scene:scene})
    } 

    toggle_coolant(num,hudState){
        console.log("Toggling manifold "+num)
        hudState.manifold1 = num == 1
        hudState.manifold2 = num == 2
        hudState.manifold3 = num == 3
    }

    render(){
        if(this.state.playing){
            return  (
            <GameComponent className="screen" scene={this.state.scene}>
                {hudState => (
                    <div className="panel">
                        <HUDView hudState={hudState}>
                        {hudState => (
                        <div className="control">
                            <p><input type="checkbox" checked={this.state.fullscreen} onChange={this.handleFullscreen} /> Fullscreen</p>
                            <div className="coolant progress">
                                <div style={hudState?{width:(hudState.coolant1*100)+"%"}:{width:"1%"}}></div>
                            </div>
                            <button onClick={() => this.toggle_coolant(1,hudState)}>Toggle Coolant 1 {(hudState && hudState.manifold1)?"*":""}</button>
                            <div className="coolant progress">
                                <div style={hudState?{width:(hudState.coolant2*100)+"%"}:{width:"1%"}}></div>
                            </div>
                            <button onClick={() => this.toggle_coolant(2,hudState)}>Toggle Coolant 2 {(hudState && hudState.manifold2)?"*":""}</button>
                            <div className="coolant progress">
                                <div style={hudState?{width:(hudState.coolant3*100)+"%"}:{width:"1%"}}></div>
                            </div>
                            <button onClick={() => this.toggle_coolant(3,hudState)}>Toggle Coolant 3 {(hudState && hudState.manifold3)?"*":""}</button>

                            <p>Reactor Status</p>
                            <div className="reactor progress">
                                <div style={hudState?{width:(hudState.reactor_status*100)+"%"}:{width:"1%"}}></div>
                            </div>
                            <p>Ship Hull Status</p>
                            <div className="hull progress">
                                <div style={hudState?{width:(hudState.health)+"%"}:{width:"100%"}}></div>
                            </div>
                        </div>
                        )} 
                        </HUDView>
                    </div>
                )}
            </GameComponent>
            )
        }else if(this.state.loading){
            return (
                <div className="menu">
                    <p>LOADING ASSETS..</p>
                </div>
            )
        }else{
            return (
                <div className="menu">
                    <h1>Unstable Reactor Space Game - LD49</h1> 
                    <button onClick={() => this.startLoading()}>Start Game!</button>
                </div>
            )
        }
    }
}
ReactDOM.render( <Game />, document.getElementById("app"))
