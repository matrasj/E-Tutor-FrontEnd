import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";
import {MessagePayloadResponseModel} from "../../../../../model/message/message-payload-response-model";
import {AuthService} from "../../../../../service/auth-service";
import {MessageService} from "../../../../../service/message-service";
import {
  AdvertisementPayloadResponseModel
} from "../../../../../model/advertisement/advertisement-payload-response-model";

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {
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

        } else if (currentPath === 'received') {

        }
      });
  }

  handleResponse(data : any) {
    // this.advertisements = data.content;
    // this.totalElements = data.totalElements;
    // this.totalPages = data.totalPages;
    // this.pageNumber = data.number + 1;
    // this.pageSize = data.size;
  }


}
