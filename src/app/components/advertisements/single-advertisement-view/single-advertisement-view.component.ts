import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

import { UserPayloadModel } from '../../../model/user/user-payload-model';
import { AdvertisementPayloadResponseModel } from '../../../model/advertisement/advertisement-payload-response-model';
import { ReviewPayloadModel } from '../../../model/review/review-payload-model';

import { AdvertisementService } from '../../../service/advertisement-service';
import { ReviewService } from '../../../service/review-service';
import { AuthService } from '../../../service/auth-service';

import { MatDialog } from '@angular/material/dialog';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { MessageFormComponent } from '../message-form/message-form.component';
import { MakeAppointmentModalComponent } from '../make-appointment-modal/make-appointment-modal.component';

@Component({
  selector: 'app-single-advertisement-view',
  templateUrl: './single-advertisement-view.component.html',
  styleUrls: ['./single-advertisement-view.component.css']
})
export class SingleAdvertisementViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  currentUser: UserPayloadModel | any;
  advertisement: AdvertisementPayloadResponseModel | any;
  reviews: ReviewPayloadModel[] = [];
  isLoading = false;

  private map!: L.Map;
  private marker!: L.Marker;
  private viewReady = false;
  private dataReady = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private advertisementService: AdvertisementService,
    private reviewService: ReviewService,
    private dialogRef: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const id = Number(paramMap.get('id'));

      this.advertisementService.getAdvertisementById(id).subscribe((advertisement) => {
        this.advertisement = advertisement;
        this.dataReady = true;
        this.tryInitMap();
        this.isLoading = false;
      });

      this.reviewService.getReviewsByAdvertisementsId(id).subscribe((reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      });

      this.currentUser = this.authService.getCurrentUser();
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    setTimeout(() => this.tryInitMap(), 500);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private tryInitMap(): void {
    if (!this.viewReady || !this.dataReady) return;
    const lat = this.advertisement?.latitude;
    const lng = this.advertisement?.longitude;
    if (lat == null || lng == null) return;

    const containerEl = this.mapContainer?.nativeElement;
    if (!containerEl) return;

    if ((this.map as any)?._loaded) {
      this.map.setView([lat, lng], 13);
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      }
      return;
    }

    this.map = L.map(containerEl).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng]).addTo(this.map).bindPopup('Place of tutority').openPopup();

    setTimeout(() => this.map.invalidateSize(), 0);
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
      data: {
        userId: this.currentUser?.id,
        advertisementId: this.advertisement?.id
      },
      panelClass: 'big-dialog'
    });
  }

  onMessageCreating() {
    this.dialogRef.open(MessageFormComponent, {
      data: {
        targetFirstName: this.advertisement?.userPayload?.firstName,
        targetLastName: this.advertisement?.userPayload?.lastName,
        authorId: this.currentUser?.id,
        recipientId: this.advertisement?.userPayload?.id,
        advertisementId: this.advertisement?.id
      }
    });
  }

  onMakingAppointment() {
    this.dialogRef.open(MakeAppointmentModalComponent, {
      data: {
        advertisement: this.advertisement
      },
      panelClass: 'big-dialog'
    });
  }

  isAuthenticated() {
    return this.authService.isAuth();
  }
}
