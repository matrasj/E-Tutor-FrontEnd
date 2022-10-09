import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AdvertisementPayloadRequestModel} from "../model/advertisement-payload-request-model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn : 'root'
})
export class AdvertisementService {
  private API_URL : string = environment.API_URL;
  constructor(private httpClient : HttpClient) {
  }

  public createAdvertisement(advertisementPayloadRequest : AdvertisementPayloadRequestModel) : Observable<string> {
    return this.httpClient.post(`${this.API_URL}/advertisements`, advertisementPayloadRequest, {
      responseType : 'text'
    });
  }
}
