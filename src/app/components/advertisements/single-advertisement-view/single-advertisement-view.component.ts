import { Component, OnInit } from '@angular/core';
import {UserPayloadModel} from "../../../model/user-payload-model";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../service/user-service";
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement-payload-response-model";
import {AdvertisementService} from "../../../service/advertisement-service";

@Component({
  selector: 'app-single-advertisement-view',
  templateUrl: './single-advertisement-view.component.html',
  styleUrls: ['./single-advertisement-view.component.css']
})
export class SingleAdvertisementViewComponent implements OnInit {
  currentUser : UserPayloadModel | any;
  advertisement : AdvertisementPayloadResponseModel | any;
  constructor(private activatedRoute : ActivatedRoute,
              private advertisementService : AdvertisementService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .subscribe((paramMap) => {
        this.advertisementService.getAdvertisementById(Number(paramMap.get('id')))
          .subscribe((advertisement) => {
            this.advertisement = advertisement;
            console.log(this.advertisement)
          })
      })
  }

}
