import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../../service/auth-service";
import {MessageService} from "../../../../../service/message-service";
import {ActivatedRoute} from "@angular/router";
import {UserPayloadModel} from "../../../../../model/user/user-payload-model";
import {MessagePayloadResponseModel} from "../../../../../model/message/message-payload-response-model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MessagePayloadRequestModel} from "../../../../../model/message/message-payload-request-model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-conversation-chat',
  templateUrl: './conversation-chat.component.html',
  styleUrls: ['./conversation-chat.component.css']
})
export class ConversationChatComponent implements OnInit {
  messageFormGroup : FormGroup | any;
  currentUser : UserPayloadModel | any;
  targetUserId : number = 0;
  messages : MessagePayloadResponseModel[] = [];
  constructor(private authService : AuthService,
              private messageService : MessageService,
              private activatedRoute : ActivatedRoute,
              private formBuilder : FormBuilder,
              private toastrService : ToastrService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.messageFormGroup = this.formBuilder.group({
      message : this.formBuilder.group({
        subject : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
        content : new FormControl('', [Validators.required, Validators.maxLength(5000)])
      })
    });

    this.activatedRoute.paramMap
      .subscribe((paramMap) => {
        this.targetUserId = Number(paramMap.get('id'));
        this.messageService.getMessagesForConversation(this.currentUser.id, this.targetUserId)
          .subscribe((messages) =>  this.messages = messages);
      })
  }

  get subject() {
    return this.messageFormGroup.get('message').get('subject');
  }

  get content() {
    return this.messageFormGroup.get('message').get('content');
  }

  onMessageSending() {
    if (this.messageFormGroup.invalid) {
      this.messageFormGroup.markAllAsTouched();
    } else {
      this.messageService.sendMessage(
        new MessagePayloadRequestModel(
          this.subject.value,
          this.content.value,
          this.currentUser.id,
          this.targetUserId
        )
      ).subscribe((res) => {
        this.messageFormGroup.reset();
        location.reload();
        this.toastrService.success(res);

      })
    }
  }

  getFormattedDate(createdAt: string | any) {
    const date = new Date(createdAt);

    const dayNumber : number = date.getDate();
    const monthName : string = date.toLocaleString('default', { month: 'long' });
    const year : number = date.getFullYear();
    const hour : string = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + '';
    const minutes : string = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + '';

    return `${dayNumber} ${monthName}, godz ${hour}:${minutes}`;
  }
}
