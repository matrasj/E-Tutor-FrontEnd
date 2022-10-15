import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";
import {AuthService} from "../../service/auth-service";
import {UserPayloadModel} from "../../model/user/user-payload-model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UserService} from "../../service/user-service";

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
  currentUser : UserPayloadModel | any = null;
  keyPhrase : string = '';

  constructor(private router : Router,
              private authService : AuthService,
              private sanitizer : DomSanitizer,
              private userService : UserService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.isAuthenticated = isAuthenticated;
          this.userService.getCurrentUserById(this.authService.getCurrentUser().id)
            .subscribe((user) => this.currentUser = user);
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

  public sanitizerPhoto(url : string) : SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  logout() {
    this.authService.logout();
  }

  onAdvertisementsSearching(event: SubmitEvent) {
    event.preventDefault();

    this.router.navigate(['/advertisements'], {
        queryParams : {
          keyphrase : this.keyPhrase,
          category : this.selectedCategory ? this.selectedCategory : ''
        }
      });



  }
}
