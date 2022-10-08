import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SubjectSearchResponseModel} from "../model/subject-search-response-model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn : 'root'
})
export class SubjectService {
  API_URL : string = environment.API_URL;
  constructor(private httpClient : HttpClient) {
  }

  public getAllSubjects() : Observable<SubjectSearchResponseModel[]> {
    return this.httpClient.get<SubjectSearchResponseModel[]>(`${this.API_URL}/subjects`)
  }
}
