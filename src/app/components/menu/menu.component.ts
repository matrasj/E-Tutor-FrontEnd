import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";
import {LoginUserPayloadResponseModel} from "../../model/login-user-payload-response-model";
import {AuthService} from "../../service/auth-service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  selectedCategory : string = '';
  shouldBeHeaderVisible = true;
  isAuthenticated : boolean = false;
  shouldBeSearchFormVisible : boolean = true;
  currentUser : LoginUserPayloadResponseModel | any = null;
  constructor(private router : Router,
              private authService : AuthService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.isAuthenticated = isAuthenticated;
          this.currentUser = this.authService.getCurrentUser();
        }
      });

    this.router.events
      .subscribe(
        (event : any) => {
          if(event instanceof NavigationStart) {
            event.url === '/' ?  this.shouldBeHeaderVisible = true : this.shouldBeHeaderVisible = false;
            event.url.includes("profile") ? this.shouldBeSearchFormVisible = false : this.shouldBeSearchFormVisible = true;
          }
        });
  }

  onCategorySelecting() {
    console.log(this.selectedCategory)
  }

  logout() {
    this.authService.logout();
  }
}
