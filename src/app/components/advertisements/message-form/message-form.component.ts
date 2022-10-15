import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {MessageService} from "../../../service/message-service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MessagePayloadRequestModel} from "../../../model/message/message-payload-request-model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.css']
})
export class MessageFormComponent implements OnInit {
  messageFormGroup : FormGroup | any;
  targetFirstName : string = '';
  targetLastName : string = '';
  authorId : number = 0;
  recipientId : number = 0;
  advertisementId : number = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data : any,
              private messageService : MessageService,
              private formBuilder : FormBuilder,
              private toastrService : ToastrService,
              private dialogRef : MatDialog) {
    this.targetFirstName = data.targetFirstName;
    this.targetLastName = data.targetLastName;
    this.authorId = data.authorId;
    this.recipientId = data.recipientId;
    this.advertisementId = data.advertisementId;
  }

  ngOnInit(): void {
    this.messageFormGroup = this.formBuilder.group({
      message : this.formBuilder.group({
        subject : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
        content : new FormControl('', [Validators.required, Validators.maxLength(5000)])
      })
    });
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
          this.authorId,
          this.recipientId,
          this.advertisementId
        )
      ).subscribe((res) => {
        this.messageFormGroup.reset();
        this.dialogRef.closeAll();
        this.toastrService.success(res);
      })
    }
  }


}
