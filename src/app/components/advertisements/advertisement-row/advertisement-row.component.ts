import {Component, Input, OnInit} from '@angular/core';
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement/advertisement-payload-response-model";
import {AuthService} from "../../../service/auth-service";
import {UserPayloadModel} from "../../../model/user/user-payload-model";
import {ReviewFormComponent} from "../review-form/review-form.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
//add
@Component({
  selector: 'app-advertisement-row',
  templateUrl: './advertisement-row.component.html',
  styleUrls: ['./advertisement-row.component.css']
})
export class AdvertisementRowComponent implements OnInit {
  currentUser : UserPayloadModel | any;

  @Input() advertisement : AdvertisementPayloadResponseModel | any;
  constructor(private authService : AuthService,
              private dialogRef : MatDialog,
              private router : Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  isAuthenticated() {
    return this.authService.isAuth();
  }

  onOpinionCreating() {
    this.dialogRef.open(ReviewFormComponent, {
      data : {
        userId : this.currentUser.id,
        advertisementId : this.advertisement.id
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
