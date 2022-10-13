import { Component, OnInit } from '@angular/core';
import {AdvertisementsComponent} from "../../profile-panel/activities/advertisements/advertisements.component";
import {AdvertisementPayloadRequestModel} from "../../../model/advertisement-payload-request-model";
import {AdvertisementService} from "../../../service/advertisement-service";
import {ActivatedRoute} from "@angular/router";
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement-payload-response-model";

@Component({
  selector: 'app-advertisements-list',
  templateUrl: './advertisements-list.component.html',
  styleUrls: ['./advertisements-list.component.css']
})
export class AdvertisementsListComponent implements OnInit {
  advertisements : AdvertisementPayloadResponseModel[] = [];
  totalElements : number = 0;
  totalPages : number = 0;
  pageSize : number = 10;
  pageNumber : number = 1;
  keyPhrase : string = '';

  constructor(private advertisementService : AdvertisementService,
              private activatedRouter : ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRouter.queryParamMap
      .subscribe((queryParamMap) => {
        if (queryParamMap.has('category') && String(queryParamMap.get('category')).length > 0
        && queryParamMap.has('keyphrase')) { // KEYPHRASE AND TYPE

          const type : string = String(queryParamMap.get('category'));
          this.advertisementService.getAdvertisementsByKeyphraseAndTypeWithPagination(this.pageSize,
            this.pageNumber - 1,
            this.keyPhrase,
            type)
            .subscribe((res) => {
              this.handleResponse(res);
            });
        }

        else if (queryParamMap.has('subjectName')) { // SUBJECT_NAME
          this.advertisementService.getAdvertisementsBySubjectWithPagination(this.pageSize,
            this.pageNumber - 1,
            String(queryParamMap.get('subjectName'))
          ) .subscribe((res) => {
            this.handleResponse(res);
          });
        }

        else if (queryParamMap.has('cityName')) { // SUBJECT_NAME
          this.advertisementService.getAdvertisementsByCityWithPagination(this.pageSize,
            this.pageNumber - 1,
            String(queryParamMap.get('cityName'))
          ) .subscribe((res) => {
            this.handleResponse(res);
          });
        }

        else { // KEYPHRASE
          this.advertisementService.getAdvertisementsByKeyphraseWithPagination(this.pageSize,
            this.pageNumber - 1,
            this.keyPhrase)
            .subscribe((res) => {
              this.handleResponse(res);
            });
        }

      })
  }

  handleResponse(data : any) {
    this.advertisements = data.content;
    this.totalElements = data.totalElements;
    this.totalPages = data.totalPages;
    this.pageNumber = data.number + 1;
    this.pageSize = data.size;
  }

}
