import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../service/auth-service";
import {UserPayloadModel} from "../../../../model/user/user-payload-model";
import {UserService} from "../../../../service/user-service";
import {AdvertisementService} from "../../../../service/advertisement-service";
import {AdvertisementPayloadResponseModel} from "../../../../model/advertisement/advertisement-payload-response-model";

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {
  currentUser : UserPayloadModel | any;
  studentAdvertisements: AdvertisementPayloadResponseModel[] = [];
  tutorAdvertisements: AdvertisementPayloadResponseModel[] = [];
  constructor(private authService : AuthService,
              private userService: UserService,
              private advertisementService: AdvertisementService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userService.getCurrentUserById(this.authService.getCurrentUser().id)
      .subscribe((user) => {
        this.currentUser = user;
        let count : number = 0;
        for (let key in this.currentUser) {

          // @ts-ignore
          if (this.currentUser[key]?.length > 0
            && key !== 'id'
            && key !== 'username'
            && key !== 'profileImagePath') {
            count++;
          }
        }

        this.advertisementService.getAdvertisementsByUserId(this.currentUser.id)
          .subscribe((advertisements) => {
            this.tutorAdvertisements = advertisements.filter(a => a.advertisementType === 'LOOKING_FOR_STUDENT');
            this.studentAdvertisements = advertisements.filter(a => a.advertisementType === 'LOOKING_FOR_TUTOR');
          });
      });
  }

}
