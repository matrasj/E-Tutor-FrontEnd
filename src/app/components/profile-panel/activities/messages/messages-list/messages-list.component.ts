import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";
import {MessagePayloadResponseModel} from "../../../../../model/message/message-payload-response-model";
import {AuthService} from "../../../../../service/auth-service";
import {MessageService} from "../../../../../service/message-service";

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {
  messages : MessagePayloadResponseModel[] = [];
  totalElements : number = 0;
  totalPages : number = 0;
  pageSize : number = 5;
  pageNumber : number = 1;
  constructor(private activatedRouter : ActivatedRoute,
              private authService : AuthService,
              private messageService : MessageService) { }

  ngOnInit(): void {
    this.activatedRouter.url
      .subscribe((res) => {
        const currentPath : string | undefined = res.at(1)?.path;
        if (currentPath === 'sent') {
          this.messageService.getSentMessagesByUserId(this.authService.getCurrentUser()?.id, this.pageNumber - 1, this.pageSize)
            .subscribe((res) => {
              this.handleResponse(res);
              console.log(this.messages)
            });
        } else if (currentPath === 'received') {
          this.messageService.getReceivedMessagesByUserId(this.authService.getCurrentUser()?.id, this.pageNumber - 1, this.pageSize)
            .subscribe((res) => {
              this.handleResponse(res);
              console.log(this.messages)
            });
        }
      });
  }

  handleResponse(data : any) {
    this.messages = data.content;
    this.totalElements = data.totalElements;
    this.totalPages = data.totalPages;
    this.pageNumber = data.number + 1;
    this.pageSize = data.size;
  }


}
