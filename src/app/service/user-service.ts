import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserPayloadModel} from "../model/user/user-payload-model";
import {environment} from "../../environments/environment";
import {PageApiResponse} from "./advertisement-service";

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

  updateProfileImage(userId : number, profileImageFile: File) : Observable<string> {
    const formData = new FormData();
    formData.append("imageFile", profileImageFile)
    return this.httpClient.post(`${this.API_URL}/users/${userId}/profile-image`, formData, {
      responseType : 'text'
    });

  }

  removeProfileImageByUserId(userId : number) : Observable<string> {
    return this.httpClient.delete(`${this.API_URL}/users/${userId}/profile-image`, {
      responseType : 'text'
    });
  }


  getUsersForConversations(userId : number, pageSize : number, pageNumber : number) : Observable<PageApiResponse> {
    return this.httpClient.get<PageApiResponse>(`${this.API_URL}/users/conversations-list/${userId}?pageSize=${pageSize}&pageNumber=${pageNumber}`);
  }
}
