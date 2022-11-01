import {Component, OnInit} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./service/auth-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ETutorFrontned';
  opened : boolean = false;
  isAuth : boolean = false;
  public currentUser: any;

  constructor(private authService : AuthService,
              private router : Router) {

  }

  ngOnInit(): void {
    this.authService.isAuthenticated
      .subscribe((isAuth) => {
        this.isAuth = isAuth
        if (this.isAuth) {
          this.currentUser = this.authService.getCurrentUser();
        }
      });

  }

  onNavigating(sidenav: MatSidenav, parameter : string) {
    this.router.navigate(['/advertisements'], {
      queryParams : {
        type : parameter
      }
    });

    this.opened = false;
  }


  onBasicNavigating(path : string) {
    this.router.navigate([`/${path}`]);

    this.opened = false;
  }
}
