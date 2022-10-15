import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AdvertisementPayloadRequestModel} from "../model/advertisement/advertisement-payload-request-model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {AdvertisementPayloadResponseModel} from "../model/advertisement/advertisement-payload-response-model";

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

  getAdvertisementsByKeyphraseWithPagination(pageSize: number, pageNumber : number, keyPhrase : string) : Observable<PageApiResponse> {
    return this.httpClient.get<PageApiResponse>(`${this.API_URL}/advertisements/pagination/findByKeyphrase?pageNumber=${pageNumber}&pageSize=${pageSize}&keyPhrase=${keyPhrase}`);
  }

  getAdvertisementsByKeyphraseAndTypeWithPagination(pageSize: number, pageNumber: number, keyPhrase: string, type: string) : Observable<PageApiResponse> {
    return this.httpClient.get<PageApiResponse>(`${this.API_URL}/advertisements/pagination/findByKeyphraseAndType?pageNumber=${pageNumber}&pageSize=${pageSize}&keyPhrase=${keyPhrase}&type=${type}`);

  }

  getAdvertisementsBySubjectWithPagination(pageSize: number, pageNumber: number, subjectName: string) : Observable<PageApiResponse> {
    return this.httpClient.get<PageApiResponse>(`${this.API_URL}/advertisements/pagination/findBySubjectName?pageNumber=${pageNumber}&pageSize=${pageSize}&subjectName=${subjectName}`);
  }

  getAdvertisementsByCityWithPagination(pageSize: number, pageNumber: number, cityName: string) : Observable<PageApiResponse> {
    return this.httpClient.get<PageApiResponse>(`${this.API_URL}/advertisements/pagination/findByCityName?pageNumber=${pageNumber}&pageSize=${pageSize}&cityName=${cityName}`);
  }

  getAdvertisementById(advertisementId: number) : Observable<AdvertisementPayloadResponseModel> {
    return this.httpClient.get<AdvertisementPayloadResponseModel>(`${this.API_URL}/advertisements/${advertisementId}`);

  }

  getAdvertisementsByUserId(userId: number) : Observable<AdvertisementPayloadResponseModel[]> {
    return this.httpClient.get<AdvertisementPayloadResponseModel[]>(`${this.API_URL}/advertisements/findByUserId/${userId}`);
  }
}

export interface PageApiResponse {
  content : AdvertisementPayloadResponseModel[],
  totalElements : number,
  totalPages : number,
  size : number,
  number : number,
}
