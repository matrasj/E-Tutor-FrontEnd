import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../service/auth-service";
import {MessageService} from "../../../../service/message-service";
import {MessagePayloadResponseModel} from "../../../../model/message/message-payload-response-model";
import {UserService} from "../../../../service/user-service";
import {UserPayloadModel} from "../../../../model/user/user-payload-model";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }





}
