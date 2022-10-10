import {HttpClient} from "@angular/common/http";
import {RegisterPayloadRequestModel} from "../model/register-payload-request-model";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Environment} from "@angular/cli/lib/config/workspace-schema";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {LoginPayloadRequestModel} from "../model/login-payload-request-model";
import {UserPayloadModel} from "../model/user-payload-model";


interface AuthenticationResponse {
  jwtToken : string,
  userPayload : UserPayloadModel
}

@Injectable({
  providedIn : 'root'
})
export class AuthService {
  private API_URL : string = environment.API_URL;
  isAuthenticated : BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(private httpClient : HttpClient) {
    if (localStorage.getItem('jwtToken') !== null) {
      this.isAuthenticated.next(true);
    }
  }

  public registerAccount(registrationRequest : RegisterPayloadRequestModel) : Observable<any>{
    return this.httpClient.post<any>(`${this.API_URL}/auth/registration`, registrationRequest);
  }

  public login(loginPayloadRequest : LoginPayloadRequestModel) : Observable<AuthenticationResponse> {
    return this.httpClient.post<AuthenticationResponse>(`${this.API_URL}/auth/login`, loginPayloadRequest);
  }

  setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
    this.isAuthenticated.next(true);
  }

  setCurrentUser(userPayload: UserPayloadModel) {
    localStorage.setItem('currentUser', JSON.stringify(userPayload));
  }

  getCurrentUser() {
    // @ts-ignore
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  getJwtToken() {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.clear();
    this.isAuthenticated.next(false);
    window.location.reload();
  }
}


