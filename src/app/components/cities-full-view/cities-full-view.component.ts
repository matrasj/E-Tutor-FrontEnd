import { Component, OnInit } from '@angular/core';
import {StateService} from "../../service/state-service";
import {StatePayloadResponseModel} from "../../model/state/state-payload-response-model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cities-full-view',
  templateUrl: './cities-full-view.component.html',
  styleUrls: ['./cities-full-view.component.css']
})
export class CitiesFullViewComponent implements OnInit {
  statesWithCitiesAndQuantities : StatePayloadResponseModel[] = [];
  constructor(private stateService : StateService,
              private router : Router) { }

  ngOnInit(): void {
    this.stateService.getStatesWithCitiesAndQuantities()
      .subscribe((states) => this.statesWithCitiesAndQuantities = states);
  }

  onAdvertisementsFilteringByCity(cityName: string) {
    this.router.navigate(['/advertisements'], {
      queryParams : {
        cityName
      }
    })
  }
}
