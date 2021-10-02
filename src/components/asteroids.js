import { Component,Types } from "ecsy";

export class AsteroidComponent extends Component {}
AsteroidComponent.schema = {
  speed: { type: Types.Number, default: null },
  spin: { type: Types.Number, default: 0.1 },
}