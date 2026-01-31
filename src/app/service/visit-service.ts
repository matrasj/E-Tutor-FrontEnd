import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {VisitPayloadModel} from "../model/visit/visit-payload-model";

@Injectable({
  providedIn : 'root'
})
export class VisitService {
  private API_URL : string = environment.API_URL;

  constructor(private httpClient : HttpClient) {
  }

  public makeAppointment(payload: VisitPayloadModel): Observable<VisitPayloadModel> {
    return this.httpClient.post<VisitPayloadModel>(`${this.API_URL}/visits`, payload);
  }

  public getAllVisitRequestsAsStudent(userId: number) : Observable<VisitPayloadModel[]> {
    return this.httpClient.get<VisitPayloadModel[]>(`${this.API_URL}/visits/as-student/${userId}`);
  }

  public getAllVisitRequestsAsTutor(userId: number) : Observable<VisitPayloadModel[]> {
    return this.httpClient.get<VisitPayloadModel[]>(`${this.API_URL}/visits/as-tutor/${userId}`);
  }

  public getAllAcceptedVisitConnectedToUser(userId: number) : Observable<VisitPayloadModel[]> {
    return this.httpClient.get<VisitPayloadModel[]>(`${this.API_URL}/visits/accepted/${userId}`);
  }

  public getAllRejectedVisitConnectedToUser(userId: number) : Observable<VisitPayloadModel[]> {
    return this.httpClient.get<VisitPayloadModel[]>(`${this.API_URL}/visits/rejected/${userId}`);
  }

  public approveVisit(visitId: number) : Observable<VisitPayloadModel> {
    return this.httpClient.patch<VisitPayloadModel>(`${this.API_URL}/visits/approve/${visitId}`, {});
  }

  public rejectVisit(visitId: number) : Observable<void> {
    return this.httpClient.patch<void>(`${this.API_URL}/visits/reject/${visitId}`, {});
  }
}
