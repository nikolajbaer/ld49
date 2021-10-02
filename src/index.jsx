import * as React from 'react'
import ReactDOM from "react-dom"
import { GameComponent } from "gokart.js/src/core/ui_components/GameComponent.jsx"
import { HUDView } from "gokart.js/src/core/ui_components/HUDView.jsx"
import { MobileStick } from "gokart.js/src/core/ui_components/MobileStick.jsx"
import { GameScene }  from "./GameScene"

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

    render(){
        if(this.state.playing){
            return  (
            <div>
                <GameComponent className="screen" scene={this.state.scene}>
                	{hudState => (
                        <HUDView hudState={hudState}>
                	    {hudState => (
                            <div className="overlay">
                        		<h1>Example</h1>
                                <p>{hudState?hudState.fps.toFixed(1):"-"} fps</p>
                                <p><input type="checkbox" checked={this.state.fullscreen} onChange={this.handleFullscreen} /> Fullscreen</p>
                        	</div>

                        )} 
                        </HUDView>
                   )}
                </GameComponent>
                <div className="control">
                    <button>Toggle Coolant 1</button>
                    <button>Toggle Coolant 2</button>
                    <button>Toggle Coolant 3</button>
                </div>
            </div>
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
