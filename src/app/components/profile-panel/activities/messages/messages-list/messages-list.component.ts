import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";
import {MessagePayloadResponseModel} from "../../../../../model/message/message-payload-response-model";
import {AuthService} from "../../../../../service/auth-service";
import {MessageService} from "../../../../../service/message-service";
import {
  AdvertisementPayloadResponseModel
} from "../../../../../model/advertisement/advertisement-payload-response-model";
import {UserPayloadModel} from "../../../../../model/user/user-payload-model";
import {UserService} from "../../../../../service/user-service";

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {
  currentUser : UserPayloadModel | any;
  userConversations : UserPayloadModel[] = [];
  totalElements : number = 0;
  totalPages : number = 0;
  pageSize : number = 1;
  pageNumber : number = 1;
  constructor(private activatedRouter : ActivatedRoute,
              private authService : AuthService,
              private messageService : MessageService,
              private userService : UserService) { }

  ngOnInit(): void {
    this.fetchProductsData();
  }

  handleResponse(data : any) {
    this.userConversations = data.content;
    this.totalElements = data.totalElements;
    this.totalPages = data.totalPages;
    this.pageNumber = data.number + 1;
    this.pageSize = data.size;
  }

  fetchProductsData() {
    this.currentUser = this.authService.getCurrentUser();
    this.userService.getUsersForConversations(this.currentUser.id, this.pageSize, this.pageNumber - 1)
      .subscribe((userConversations) => {
        this.handleResponse(userConversations);
      });
  }


}
