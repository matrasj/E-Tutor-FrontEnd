import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../service/user-service";
import {AuthService} from "../../../../service/auth-service";
import {UserPayloadModel} from "../../../../model/user-payload-model";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css']
})
export class CompleteProfileComponent implements OnInit {
  public userFormGroup : FormGroup | any;
  currentUserModel : UserPayloadModel | any;
  constructor(private formBuilder : FormBuilder,
              private userService : UserService,
              private authService : AuthService,
              private router : Router,
              private toastrService : ToastrService) { }

  ngOnInit(): void {
    this.userFormGroup = this.formBuilder.group({
      user : this.formBuilder.group({
        firstName : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2500)]),
        lastName : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2500)]),
        email : new FormControl('', [Validators.required, Validators.pattern(`^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`)]),
        phoneNumber : new FormControl('',  [Validators.pattern("^\\d{9}$")]),
        address : new FormControl('', [Validators.maxLength(1000)]),
        city : new FormControl('', [Validators.maxLength(85)])
      })
    });

    this.userService.getCurrentUserById(this.authService.getCurrentUser().id)
      .subscribe((user) => {
        this.currentUserModel = user;
        this.firstName.setValue(this.currentUserModel.firstName);
        this.lastName.setValue(this.currentUserModel.lastName);
        this.email.setValue(this.currentUserModel.email);
        this.phoneNumber.setValue(this.currentUserModel.phoneNumber);
        this.address.setValue(this.currentUserModel.address);
        this.city.setValue(this.currentUserModel.city);
      });
  }

  get firstName() {
    return this.userFormGroup.get('user').get('firstName');
  };

  get lastName() {
    return this.userFormGroup.get('user').get('lastName');
  };

  get email() {
    return this.userFormGroup.get('user').get('email');
  };

  get phoneNumber() {
    return this.userFormGroup.get('user').get('phoneNumber');
  };

  get address() {
    return this.userFormGroup.get('user').get('address');
  };

  get city() {
    return this.userFormGroup.get('user').get('city');
  };

  onChangesSaving() {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched();
    } else {
      this.copyFieldsToCurrentUser();

      this.userService.updateUserById(this.currentUserModel)
        .subscribe((res) => {
          this.userFormGroup.reset();
          this.router.navigate(["/profile"]);
          this.toastrService.success(res);
        })
    }
  }

  private copyFieldsToCurrentUser() {
    this.currentUserModel.firstName = this.firstName.value;
    this.currentUserModel.lastName = this.lastName.value;
    this.currentUserModel.email = this.email.value;
    this.currentUserModel.phoneNumber = this.phoneNumber.value;
    this.currentUserModel.address = this.address.value;
    this.currentUserModel.city = this.city.value;
  }

}
