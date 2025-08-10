import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { AuthService } from '../../../../../service/auth-service';
import { MessageService } from '../../../../../service/message-service';
import { ActivatedRoute } from '@angular/router';
import { UserPayloadModel } from '../../../../../model/user/user-payload-model';
import { MessagePayloadResponseModel } from '../../../../../model/message/message-payload-response-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessagePayloadRequestModel } from '../../../../../model/message/message-payload-request-model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../../service/user-service';
import { finalize } from 'rxjs';
import { MessageRealtimeService } from '../../../../../service/message-realtime.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-conversation-chat',
  templateUrl: './conversation-chat.component.html',
  styleUrls: ['./conversation-chat.component.css']
})
export class ConversationChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollArea') scrollArea?: ElementRef<HTMLDivElement>;

  messageFormGroup!: FormGroup;
  currentUser!: UserPayloadModel | any;
  peer: UserPayloadModel | null = null;
  targetUserId = 0;
  messages: MessagePayloadResponseModel[] | any= [];
  isLoading = false;
  sending = false;
  private realtimeSub: any;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private userService: UserService,
    private realtime: MessageRealtimeService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.messageFormGroup = this.formBuilder.group({
      subject: new FormControl('', [Validators.maxLength(150)]),
      content: new FormControl('', [Validators.required, Validators.maxLength(5000)])
    });

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const currentId = this.authService.getCurrentUser().id;
      this.userService.getCurrentUserById(currentId).subscribe((user) => {
        this.currentUser = user;
        this.targetUserId = Number(paramMap.get('id'));

        this.userService.getCurrentUserById(this.targetUserId)
          .subscribe((u) => (this.peer = u));

        this.loadMessages();
        this.connectRealtime();
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 0);
  }

  ngOnDestroy(): void {
    if (this.realtimeSub) this.realtimeSub.unsubscribe();
    this.realtime.disconnect();
  }

  private loadMessages(): void {
    this.isLoading = true;
    this.messageService
      .getMessagesForConversation(this.currentUser.id, this.targetUserId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          setTimeout(() => this.scrollToBottom(), 0);
        })
      )
      .subscribe({
        next: (res) => (this.messages = res),
        error: () => this.toastrService.error('An error occurred during fetching data')
      });
  }

  private connectRealtime(): void {
    this.realtime.connect();
    this.realtimeSub = this.realtime.incoming().subscribe((msg) => {
      const alreadyExists = this.messages.some((m: any) => m.id === msg.id);

      if (!alreadyExists &&
        ((msg.sender?.id === this.targetUserId && msg.receiver?.id === this.currentUser.id) ||
          (msg.sender?.id === this.currentUser.id && msg.receiver?.id === this.targetUserId))
      ) {
        this.messages = [...this.messages, msg];
        this.scrollToBottom();
      }
    });
  }

  get subject() {
    return this.messageFormGroup.get('subject');
  }

  get content() {
    return this.messageFormGroup.get('content');
  }

  onMessageSending() {
    if (this.messageFormGroup.invalid || this.sending) {
      this.messageFormGroup.markAllAsTouched();
      return;
    }

    this.sending = true;

    this.messageService
      .sendMessage(
        new MessagePayloadRequestModel(
          this.subject?.value || '',
          this.content?.value,
          this.currentUser.id,
          this.targetUserId
        )
      )
      .pipe(finalize(() => (this.sending = false)))
      .subscribe({
        next: (res) => {
          this.messageFormGroup.patchValue({ content: '' });
          this.toastrService.success(res);
          this.scrollToBottom();
        },
        error: () => this.toastrService.error('Failed to send message')
      });
  }

  getFormattedDate(createdAt: string) {
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month}, ${hour}:${minutes}`;
  }

  goBack() {
    this.location.back();
  }

  private scrollToBottom() {
    if (!this.scrollArea) return;
    this.scrollArea.nativeElement.scrollTop =
      this.scrollArea.nativeElement.scrollHeight;
  }
}
