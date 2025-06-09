import { Component, OnInit } from '@angular/core';
import {UserPayloadModel} from "../../../model/user/user-payload-model";
import {ActivatedRoute} from "@angular/router";
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement/advertisement-payload-response-model";
import {AdvertisementService} from "../../../service/advertisement-service";
import {ReviewService} from "../../../service/review-service";
import {ReviewPayloadModel} from "../../../model/review/review-payload-model";
import {MatDialog} from "@angular/material/dialog";
import {ReviewFormComponent} from "../review-form/review-form.component";
import {AuthService} from "../../../service/auth-service";
import {MessageFormComponent} from "../message-form/message-form.component";
import * as L from "leaflet";
import {MakeAppointmentModalComponent} from "../make-appointment-modal/make-appointment-modal.component";

@Component({
  selector: 'app-single-advertisement-view',
  templateUrl: './single-advertisement-view.component.html',
  styleUrls: ['./single-advertisement-view.component.css']
})
export class SingleAdvertisementViewComponent implements OnInit {
  currentUser : UserPayloadModel | any;
  advertisement : AdvertisementPayloadResponseModel | any;
  reviews : ReviewPayloadModel[] = [];
  isLoading: boolean = false;
  private map!: L.Map;
  private marker!: L.Marker;
  constructor(private activatedRoute : ActivatedRoute,
              private advertisementService : AdvertisementService,
              private reviewService : ReviewService,
              private dialogRef : MatDialog,
              private authService : AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.paramMap
      .subscribe((paramMap) => {
        this.advertisementService.getAdvertisementById(Number(paramMap.get('id')))
          .subscribe((advertisement) => {
            this.advertisement = advertisement;
            if (this.advertisement.latitude && this.advertisement.longitude) {
              this.initMap();
            }
            this.isLoading = false;
          });

        this.reviewService.getReviewsByAdvertisementsId(Number(paramMap.get('id')))
          .subscribe((reviews) => {
            this.reviews = reviews;
            this.isLoading = false;
          });

        this.currentUser = this.authService.getCurrentUser();
      })
  }

  private initMap(): void {
    const lat = this.advertisement.latitude;
    const lng = this.advertisement.longitude;
    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng]).addTo(this.map)
      .bindPopup("Place of tutority").openPopup();
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

  onMessageCreating() {
    this.dialogRef.open(MessageFormComponent, {
      data : {
        targetFirstName : this.advertisement?.userPayload?.firstName,
        targetLastName : this.advertisement?.userPayload?.lastName,
        authorId : this.currentUser.id,
        recipientId : this.advertisement.userPayload.id,
        advertisementId : this.advertisement.id
      }
    });
  }

  onMakingAppointment() {
    this.dialogRef.open(MakeAppointmentModalComponent, {
      data: {
        advertisement: this.advertisement
      }
    });
  }

  isAuthenticated() {
    return this.authService.isAuth();
  }
}
