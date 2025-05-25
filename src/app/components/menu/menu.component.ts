import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {AuthService} from "../../service/auth-service";
import {UserPayloadModel} from "../../model/user/user-payload-model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UserService} from "../../service/user-service";
import {AdvertisementService} from "../../service/advertisement-service";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {MatDialog} from "@angular/material/dialog";
import {ReviewFormComponent} from "../advertisements/review-form/review-form.component";
import {FindClosestTutorModalComponent} from "./find-closest-tutor-modal/find-closest-tutor-modal.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Output() responsiveNavOpen : EventEmitter<any> = new EventEmitter<any>();
  showHamburgerIcon : boolean = false;
  opened : boolean = false;
  selectedCategory : string = '';
  shouldBeHeaderVisible = true;
  isAuthenticated : boolean = false;
  shouldBeSearchFormVisible : boolean = true;
  currentUser : UserPayloadModel | any = null;
  keyPhrase : string = '';
  public totalAdvertisementsQuantity: number = 0;

  constructor(private router : Router,
              private dialogRef : MatDialog,
              private authService : AuthService,
              private sanitizer : DomSanitizer,
              private userService : UserService,
              private advertisementService : AdvertisementService,
              public breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 1000px)'])
      .subscribe((state: BreakpointState) => {
        state.matches ? this.showHamburgerIcon = true : this.showHamburgerIcon = false;
      });

    this.authService.isAuthenticated
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.isAuthenticated = isAuthenticated;
          this.userService.getCurrentUserById(this.authService.getCurrentUser().id)
            .subscribe((user) => this.currentUser = user);
        }
      });

    this.advertisementService.getTotalAdvertisementsQuantity().subscribe((quantity) => {
      this.totalAdvertisementsQuantity = quantity;
    })

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

  onAdvertisementsSearching(event?: SubmitEvent) {
    event?.preventDefault();
    this.router.navigate(['/advertisements'], {
        queryParams : {
          keyphrase : this.keyPhrase,
          category : this.selectedCategory ? this.selectedCategory : ''
        }
      });
  }

  onFindClosestTutorClick() {
    this.dialogRef.open(FindClosestTutorModalComponent);
  }

  onAdvertisementsForCategorySearching(type : string) {
    this.router.navigate(['/advertisements'], {
      queryParams : {
        type
      }
    })
  }

  onMenuOpening() {
    this.responsiveNavOpen.emit();
  }
}
