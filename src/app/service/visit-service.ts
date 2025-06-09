import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AdvertisementWithVisitsPayloadModel} from "../model/advertisement/advertisement-with-visits-payload-model";
import {VisitPayloadModel} from "../model/visit/visit-payload-model";

@Injectable({
  providedIn : 'root'
})
export class VisitService {
  private API_URL : string = environment.API_URL;
  constructor(private httpClient : HttpClient) {
  }

  public getAllVisitsByAuthorId(authorId: number) : Observable<VisitPayloadModel[]> {
    return this.httpClient.get<VisitPayloadModel[]>(`${this.API_URL}/author/${authorId}`);
  }

  public getAllVisitsForAdvertisementsByUserId(userId: number) : Observable<AdvertisementWithVisitsPayloadModel[]> {
    return this.httpClient.get<AdvertisementWithVisitsPayloadModel[]>(`${this.API_URL}/get-visits-for-advertisements-by-user-id/${userId}`);
  }
}
