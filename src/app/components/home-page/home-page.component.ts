import { Component, OnInit } from '@angular/core';
import {SubjectService} from "../../service/subject-service";
import {SubjectSearchResponseModel} from "../../model/subject/subject-search-response-model";
import {SubjectQuantityModel} from "../../model/subject/subject-quantity-model";
import {CityService} from "../../service/city-service";
import {CityQuantityModel} from "../../model/city/city-quantity-model";
import {Router} from "@angular/router";
import {AdvertisementService} from "../../service/advertisement-service";
import {AdvertisementPayloadLightModel} from "../../model/advertisement/advertisement-payload-light-model";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  subjectsWithAddsQuantities : SubjectQuantityModel[] = [];
  private RECORDS_QUANTITY: number = 16;
  citiesWithAddsQuantities: CityQuantityModel[] = [];
  showLoaderForLeft : boolean = false;
  showLoaderForRight : boolean = false;
  limit : number = 9;
  public lightAdvertisements: AdvertisementPayloadLightModel[] = [];


  constructor(private subjectService : SubjectService,
              private cityService : CityService,
              private router : Router,
              private advertisementService : AdvertisementService) { }

  ngOnInit(): void {
    this.showLoaderForLeft = true;
    this.subjectService.getSubjectsWithAddsQuantities(this.RECORDS_QUANTITY)
      .subscribe((subjectsWithQuantities) => {
        this.subjectsWithAddsQuantities = subjectsWithQuantities;
        this.showLoaderForLeft = false;
      });

    this.showLoaderForRight = true;
    this.cityService.getCitiesWithAddsQuantities(this.RECORDS_QUANTITY)
      .subscribe((citiesWithQuantities) => {
        this.citiesWithAddsQuantities = citiesWithQuantities;
        this.showLoaderForRight = false;
      });

    this.advertisementService.getLightAdvertisementsForHomePage(this.limit)
      .subscribe((lightAdvertisements) => {
        this.lightAdvertisements = lightAdvertisements;
      });
  }

  selectAdvertisementsWithFilteringBySubject(subjectName: string) {
    this.router.navigate(['/advertisements'], {
      queryParams : {
        subjectName
      }
    });
  }

  selectAdvertisementsWithFilteringByCity(cityName: string) {
    this.router.navigate(['/advertisements'], {
      queryParams : {
        cityName
      }
    });
  }


}
