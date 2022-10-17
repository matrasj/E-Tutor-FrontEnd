import {Component, Input, OnInit} from '@angular/core';
import {AdvertisementPayloadResponseModel} from "../../../model/advertisement/advertisement-payload-response-model";
import {AuthService} from "../../../service/auth-service";
import {UserPayloadModel} from "../../../model/user/user-payload-model";

@Component({
  selector: 'app-advertisement-row',
  templateUrl: './advertisement-row.component.html',
  styleUrls: ['./advertisement-row.component.css']
})
export class AdvertisementRowComponent implements OnInit {
  currentUser : UserPayloadModel | any;

  @Input() advertisement : AdvertisementPayloadResponseModel | any;
  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  isAuthenticated() {
    return this.authService.isAuth();
  }



}
