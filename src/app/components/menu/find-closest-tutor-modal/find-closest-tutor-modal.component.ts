import { Component, OnInit } from '@angular/core';
import {SubjectService} from "../../../service/subject-service";
import {SubjectSearchResponseModel} from "../../../model/subject/subject-search-response-model";
import * as L from "leaflet";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AdvertisementService} from "../../../service/advertisement-service";
import {ToastrService} from "ngx-toastr";
import {AdvertisementPayloadLightModel} from "../../../model/advertisement/advertisement-payload-light-model";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
import {DialogRef} from "@angular/cdk/dialog";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-find-closest-tutor-modal',
  templateUrl: './find-closest-tutor-modal.component.html',
  styleUrls: ['./find-closest-tutor-modal.component.css']
})
export class FindClosestTutorModalComponent implements OnInit {
  private map!: L.Map;
  private marker!: L.Marker;
  private advertisementMarkers: L.Marker[] = [];
  subjectFilter = '';
  fg: FormGroup | any;
  subjects: SubjectSearchResponseModel[] = [];
  filteredSubjects: SubjectSearchResponseModel[] = [];
  isLoading: boolean = false;
  advertisements: AdvertisementPayloadLightModel[] = [];

  constructor(private subjectService: SubjectService,
              private fb: FormBuilder,
              private advertisementService: AdvertisementService,
              private toastrService: ToastrService,
              private router: Router,
              private dialogRef: DialogRef) { }

  ngOnInit(): void {
    this.fg = this.fb.group({
      subject: new FormControl(null),
      longitude: new FormControl(null),
      latitude: new FormControl(null),
    });

    this.subjectService.getAllSubjects().subscribe({
      next: (res) => {
        this.subjects = res;
        this.filterSubjects();
      }
    });
  }

  get longitude() {
    return this.fg?.get('longitude');
  }

  get latitude() {
    return this.fg?.get('latitude');
  }

  get subject() {
    return this.fg?.get('subject');
  }

  filterSubjects(): void {
    const filterValue = this.subjectFilter.toLowerCase();
    if (filterValue?.length > 0) {
      this.filteredSubjects = this.subjects.filter(subject =>
        subject.name.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredSubjects = [...this.subjects];
    }
  }

  onSubjectChange(): void {
    this.isLoading = true;
    this.advertisementService.getAdvertisementsBySubjectId(this.subject.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.advertisements = res;
          this.toastrService.success(`There are ${this.advertisements.length} with your subject`);
          this.clearAdvertisementMarkers();

          if (this.map) {
            this.renderAdvertisementsOnMap();
          } else {
            this.initMap();
          }
        },
        error: (err) => this.toastrService.error('An error occurred')
      })
  }

  private clearAdvertisementMarkers(): void {
    this.advertisementMarkers.forEach(marker => {
      this.map?.removeLayer(marker);
    });
    this.advertisementMarkers = [];
  }

  private initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.longitude.setValue(lng);
          this.latitude.setValue(lat);

          if (!this.map) {
            this.map = L.map('map').setView([lat, lng], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            }).addTo(this.map);

            this.marker = L.marker([lat, lng]).addTo(this.map)
              .bindPopup("You are here!").openPopup();
          } else {
            this.map.setView([lat, lng], 13);
            if (this.marker) {
              this.marker.setLatLng([lat, lng]);
            }
          }

          if (this.subject.value && this.advertisements?.length > 0) {
            this.renderAdvertisementsOnMap();
          }
        },
        (error) => {
          console.error("Geolokalizacja niedostępna:", error);
          this.initMapFallback();
        }
      );
    } else {
      console.warn("Geolokalizacja nieobsługiwana.");
      this.initMapFallback();
    }
  }

  private initMapFallback(): void {
    if (!this.map) {
      const defaultLatLng: L.LatLngExpression = [52.2297, 21.0122];
      this.map = L.map('map').setView(defaultLatLng, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    }
  }

  private renderAdvertisementsOnMap() {
    this.advertisements.forEach((add: AdvertisementPayloadLightModel) => {
      const advertisementId = add.id;

      const marker = L.marker([add.latitude, add.longitude]).addTo(this.map);
      this.advertisementMarkers.push(marker);

      const popupId = `popup-btn-${advertisementId}`;
      const popupContent = `
    <div class="offer-card">
        <div class="offer-header">
            <span class="subject">${add.subjectName}</span>
            <span class="author">• ${add.author}</span>
        </div>

        <div class="offer-price">
          ${add.price} zł / ${add.minutesDuration} min
        </div>

        <button class="second-btn" id="${popupId}">See advertisement</button>
    </div>
  `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        setTimeout(() => {
          const button = document.getElementById(popupId);
          if (button) {
            button.addEventListener('click', () => {
              this.dialogRef.close();
              this.router.navigate(['/advertisements', add.id]);
            });
          }
        }, 0);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
