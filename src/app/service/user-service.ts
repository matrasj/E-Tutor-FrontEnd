import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserPayloadModel} from "../model/user-payload-model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn : 'root'
})
export class UserService {
  private API_URL : string = environment.API_URL;
  constructor(private httpClient : HttpClient) {
  }

  public getCurrentUserById(userId : number) : Observable<UserPayloadModel> {
    return this.httpClient.get<UserPayloadModel>(`${this.API_URL}/users/${userId}`)
  }

  public updateUserById(userPayload : UserPayloadModel) : Observable<string> {
    return this.httpClient.put(`${this.API_URL}/users/${userPayload.id}`, userPayload, {
      responseType : 'text'
    });
  }

}
