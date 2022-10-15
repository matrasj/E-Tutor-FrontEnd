import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../service/user-service";
import {AuthService} from "../../../../service/auth-service";
import {UserPayloadModel} from "../../../../model/user/user-payload-model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {AdvertisementService} from "../../../../service/advertisement-service";
import {AdvertisementPayloadResponseModel} from "../../../../model/advertisement/advertisement-payload-response-model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  completionPercent : number = 0;
  currentUser : UserPayloadModel | null = null
  advertisements : AdvertisementPayloadResponseModel[] = [];
  private USER_INFO_FIELDS_QUANTITY: number = 6;
  constructor(private userService : UserService,
              private authService : AuthService,
              private sanitizer : DomSanitizer,
              private advertisementService : AdvertisementService) { }

  ngOnInit(): void {

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
        this.completionPercent = Math.round((count / this.USER_INFO_FIELDS_QUANTITY) * 100) ;

        this.advertisementService.getAdvertisementsByUserId(this.currentUser.id)
          .subscribe((advertisements) => {
            this.advertisements = advertisements;
          });
      });

  }

  public sanitizerPhoto(url : any) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
