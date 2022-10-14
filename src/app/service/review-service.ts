import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ReviewPayloadModel} from "../model/review-payload-model";
import {environment} from "../../environments/environment";
import {ReviewPayloadRequestModel} from "../model/review-payload-request-model";

@Injectable({
  providedIn : 'root'
})
export class ReviewService {
  private API_URL : string = environment.API_URL;

  constructor(private httpClient : HttpClient) {
  }

  public getReviewsByAdvertisementsId(advertisementId : number) : Observable<ReviewPayloadModel[]> {
    return this.httpClient.get<ReviewPayloadModel[]>(`${this.API_URL}/reviews/advertisement/${advertisementId}`);
  }

  createReviewForAdvertisement(reviewPayloadRequestModel: ReviewPayloadRequestModel) : Observable<string>{
    return this.httpClient.post(`${this.API_URL}/reviews`, reviewPayloadRequestModel, {
      responseType : 'text'
    });
  }
}
