import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CityQuantityModel} from "../model/city/city-quantity-model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CityPayloadModel} from "../model/city/city-payload-model";

@Injectable({
  providedIn : 'root'
})
export class CityService {
  private API_URL : string = environment.API_URL;
  constructor(private httpClient : HttpClient) {
  }

  getAllCities() : Observable<CityPayloadModel[]>{
    return this.httpClient.get<CityPayloadModel[]>(`${this.API_URL}/cities`);
  }

  getCitiesWithAddsQuantities(RECORDS_QUANTITY: number) : Observable<CityQuantityModel[]> {
    return this.httpClient.get<CityQuantityModel[]>(`${this.API_URL}/cities/cities-quantities?recordsQuantity=${RECORDS_QUANTITY}`);
  }
}
