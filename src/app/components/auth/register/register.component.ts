import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth-service";
import {RegisterPayloadRequestModel} from "../../../model/auth/register-payload-request-model";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFormGroup : FormGroup | any;
  hide : boolean = true;
  constructor(private formBuilder : FormBuilder,
              private authService : AuthService,
              private toastrService : ToastrService,
              private router : Router) { }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({
      firstName : new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName : new FormControl('', [Validators.required, Validators.minLength(2)]),
      username : new FormControl('', [Validators.required, Validators.minLength(4)]),
      password : new FormControl('', [Validators.required, Validators.minLength(4)]),
      email : new FormControl('', [Validators.required, Validators.pattern(`^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`)]),
    })
  }

  get firstName() {
    return this.registerFormGroup.get('firstName');
  }

  get lastName() {
    return this.registerFormGroup.get('lastName');
  }

  get username() {
    return this.registerFormGroup.get('username');
  }

  get password() {
    return this.registerFormGroup.get('password');
  }

  get email() {
    return this.registerFormGroup.get('email');
  }

  onCreatingAccount() {
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
    } else {
      this.authService.registerAccount(
        new RegisterPayloadRequestModel(
          this.firstName.value,
          this.lastName.value,
          this.username.value,
          this.password.value,
          this.email.value
        )
      ).subscribe(() => {
        this.router.navigate(['/']);
        this.toastrService.success("Check your email address");
        this.registerFormGroup.reset();

      });
    }
  }







}
