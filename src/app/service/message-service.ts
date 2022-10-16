import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {MessagePayloadRequestModel} from "../model/message/message-payload-request-model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {PageApiResponse} from "./advertisement-service";

@Injectable({
  providedIn : 'root'
})
export class MessageService {
  private API_URL : string = environment.API_URL;
  constructor(private httpClient : HttpClient) {
  }

  sendMessage(messagePayloadRequestModel: MessagePayloadRequestModel) : Observable<string> {
    return this.httpClient.post(`${this.API_URL}/messages`, messagePayloadRequestModel, {
      responseType : 'text'
    });
  }



}
