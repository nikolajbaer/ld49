
import world_svg from "./assets/world.svg";

const countries = []

function init(){
  // load map
  document.getElementById("world").innerHTML = world_svg;

  for( let c of document.getElementsByTagName("path")){
    if(c.id){
      countries.push( {id:c.id,name:c.getAttribute("name")} )
    }
  }
  // get countries
  console.log(countries)
}

init()