import {Component, Input, OnInit} from '@angular/core';
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement/advertisement-payload-response-model";

@Component({
  selector: 'app-advertisement-row',
  templateUrl: './advertisement-row.component.html',
  styleUrls: ['./advertisement-row.component.css']
})
export class AdvertisementRowComponent implements OnInit {
  @Input() advertisement : AdvertisementPayloadResponseModel | any;
  constructor() { }

  ngOnInit(): void {
  }

}
