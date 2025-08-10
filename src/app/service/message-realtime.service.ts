import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MessagePayloadResponseModel } from '../model/message/message-payload-response-model';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class MessageRealtimeService {
  private client: Client;
  private incoming$ = new Subject<MessagePayloadResponseModel>();

  constructor(private authService: AuthService) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.API_URL}/ws`),
      reconnectDelay: 3000
    });
  }

  connect() {
    const token = this.authService.getJwtToken() as string;
    this.client.connectHeaders = { Authorization: `Bearer ${token}` };

    this.client.onConnect = () => {
      this.client.subscribe('/queue/messages', (msg: IMessage) => {
        this.incoming$.next(JSON.parse(msg.body));
      });
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  incoming(): Observable<MessagePayloadResponseModel> {
    return this.incoming$.asObservable();
  }
}
