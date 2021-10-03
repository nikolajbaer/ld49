import { Component,Types } from "ecsy";


export class ShipComponent extends Component {}
ShipComponent.schema = {
  health: { type: Types.Number,default: 100},
  max_health: { type:Types.Number,default: 100},
  reactor_heat: { type:Types.Number,default: 0 },
  max_reactor_heat: { type:Types.Number,default: 10000},

  manifolds: { type:Types.Array, default: [
    {current:50,max:50,flow:1,charge:0.5},
    {current:35,max:35,flow:4,charge:0.3},
    {current:20,max:20,flow:6,charge:0.1},
  ] },

}