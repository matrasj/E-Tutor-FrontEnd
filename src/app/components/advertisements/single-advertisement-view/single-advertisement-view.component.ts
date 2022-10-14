import { Component, OnInit } from '@angular/core';
import {UserPayloadModel} from "../../../model/user-payload-model";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../service/user-service";
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement-payload-response-model";
import {AdvertisementService} from "../../../service/advertisement-service";
import {ReviewService} from "../../../service/review-service";
import {ReviewPayloadModel} from "../../../model/review-payload-model";
import {MatDialog} from "@angular/material/dialog";
import {ReviewFormComponent} from "../review-form/review-form.component";
import {AuthService} from "../../../service/auth-service";

@Component({
  selector: 'app-single-advertisement-view',
  templateUrl: './single-advertisement-view.component.html',
  styleUrls: ['./single-advertisement-view.component.css']
})
export class SingleAdvertisementViewComponent implements OnInit {
  currentUser : UserPayloadModel | any;
  advertisement : AdvertisementPayloadResponseModel | any;
  reviews : ReviewPayloadModel[] = [];
  constructor(private activatedRoute : ActivatedRoute,
              private advertisementService : AdvertisementService,
              private reviewService : ReviewService,
              private dialogRef : MatDialog,
              private authService : AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .subscribe((paramMap) => {
        this.advertisementService.getAdvertisementById(Number(paramMap.get('id')))
          .subscribe((advertisement) => {
            this.advertisement = advertisement;
          });

        this.reviewService.getReviewsByAdvertisementsId(Number(paramMap.get('id')))
          .subscribe((reviews) => {
            this.reviews = reviews;
          });

        this.currentUser = this.authService.getCurrentUser();
      })
  }

  getFormattedDate(createdAt: any) {
    const date = new Date(createdAt);

    const dayNumber = date.getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${dayNumber} ${monthName} ${year}`;
  }

  onOpinionCreating() {
    this.dialogRef.open(ReviewFormComponent, {
      data : {
        userId : this.currentUser.id,
        advertisementId : this.advertisement.id
      }
    });
  }
}
