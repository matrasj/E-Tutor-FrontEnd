import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StatePayloadResponseModel} from "../model/state/state-payload-response-model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn : 'root'
})
export class StateService {
  private API_URL : string = environment.API_URL;
  constructor(private httpClient : HttpClient) {
  }

  public getStatesWithCitiesAndQuantities() : Observable<StatePayloadResponseModel[]> {
    return this.httpClient.get<StatePayloadResponseModel[]>(`${this.API_URL}/states/states-cities-quantities`);
  }
}
