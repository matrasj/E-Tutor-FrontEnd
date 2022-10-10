import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../service/user-service";
import {AuthService} from "../../../../service/auth-service";
import {UserPayloadModel} from "../../../../model/user-payload-model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  completionPercent : number = 0;
  currentUser : UserPayloadModel | null = null
  constructor(private userService : UserService,
              private authService : AuthService) { }

  ngOnInit(): void {
    this.userService.getCurrentUserById(this.authService.getCurrentUser().id)
      .subscribe((user) => {
        this.currentUser = user;

        let count : number = 0;
        for (let key in this.currentUser) {
          // @ts-ignore
          if (this.currentUser[key].length > 0) {
            count++;
          }
        }

        this.completionPercent = Math.round(count / (Object.keys(this.currentUser).length - 1) * 100);
      });

  }

}
