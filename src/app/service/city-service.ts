import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {SubjectQuantityModel} from "../model/subject-quantity-model";
import {CityQuantityModel} from "../model/city-quantity-model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn : 'root'
})
export class CityService {
  API_URL : string = environment.API_URL;

  constructor(private httpClient : HttpClient) {
  }

  getCitiesWithAddsQuantities(recordsQuantity : number) : Observable<CityQuantityModel[]> {
    return this.httpClient.get<CityQuantityModel[]>(`${this.API_URL}/cities/cities-quantities?recordsQuantity=${recordsQuantity}`);
  }


}
