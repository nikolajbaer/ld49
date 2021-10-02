import { Component,Types } from "ecsy";


export class ShipComponent extends Component {}
ShipComponent.schema = {
  health: { type: Types.Number,default: 100},
  max_health: { type:Types.Number,default: 100},
  reactor_heat: { type:Types.Number,default: 0 },
  max_reactor_heat: { type:Types.Number,default: 100},
}