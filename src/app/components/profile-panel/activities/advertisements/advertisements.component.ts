import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../service/auth-service";
import {UserPayloadModel} from "../../../../model/user/user-payload-model";

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {
  currentUser : UserPayloadModel | any;
  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

}
