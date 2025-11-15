import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement/advertisement-payload-response-model";
import {AuthService} from "../../../service/auth-service";
import {UserPayloadModel} from "../../../model/user/user-payload-model";
import {ReviewFormComponent} from "../review-form/review-form.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {AdvertisementService} from "../../../service/advertisement-service";
import {ToastrService} from "ngx-toastr";
//add
@Component({
  selector: 'app-advertisement-row',
  templateUrl: './advertisement-row.component.html',
  styleUrls: ['./advertisement-row.component.css']
})
export class AdvertisementRowComponent implements OnInit {
  currentUser : UserPayloadModel | any;

  @Input() advertisement : AdvertisementPayloadResponseModel | any;
  @Output() public reloadEmitter: EventEmitter<void> = new EventEmitter<void>();
  constructor(private authService : AuthService,
              private dialogRef : MatDialog,
              private router : Router,
              private advertisementService: AdvertisementService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.advertisementService.delete(this.advertisement.id).subscribe(
      () => {
        this.toastrService.success('Advertisement deleted successfully');
        this.reloadEmitter.next();
      },
      () => this.toastrService.error('An error occurred while deleting the advertisement')
    );
  }

  isAuthenticated() {
    return this.authService.isAuth();
  }

  onOpinionCreating() {
    this.dialogRef.open(ReviewFormComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: {
        userId: this.currentUser.id,
        advertisementId: this.advertisement.id
      }
    });
  }


  onAdvertisementClicking($event: any) {
    if ($event.target.closest('.send-message')) {
      this.onOpinionCreating();
    } else {
      this.router.navigate(['/advertisements', this.advertisement.id]);
    }
  }
}
