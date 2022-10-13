import { Component, OnInit } from '@angular/core';
import {SubjectService} from "../../service/subject-service";
import {SubjectSearchResponseModel} from "../../model/subject-search-response-model";
import {SubjectQuantityModel} from "../../model/subject-quantity-model";
import {CityService} from "../../service/city-service";
import {CityQuantityModel} from "../../model/city-quantity-model";

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


  constructor(private subjectService : SubjectService,
              private cityService : CityService) { }

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
      })
  }
}
