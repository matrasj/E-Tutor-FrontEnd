import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SubjectSearchResponseModel} from "../model/subject/subject-search-response-model";
import {environment} from "../../environments/environment";
import {SubjectQuantityModel} from "../model/subject/subject-quantity-model";

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

  getSubjectsWithAddsQuantities(recordsQuantity : number) : Observable<SubjectQuantityModel[]> {
    return this.httpClient.get<SubjectQuantityModel[]>(`${this.API_URL}/subjects/subjects-quantities?recordsQuantity=${recordsQuantity}`);
  }
}
