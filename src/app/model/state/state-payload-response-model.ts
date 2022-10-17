import {CityQuantityModel} from "../city/city-quantity-model";

export class StatePayloadResponseModel {
  constructor( public id : number,
  public name : string,
  public citiesWithQuantities : CityQuantityModel[],
  public totalAddsQuantity : number) {
  }
}
