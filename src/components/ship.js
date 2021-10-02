import { Component,Types } from "ecsy";


export class ShipComponent extends Component {}
ShipComponent.schema = {
  health: { type: Types.Number,default: 100},
  max_health: { type:Types.Number,default: 100}
}