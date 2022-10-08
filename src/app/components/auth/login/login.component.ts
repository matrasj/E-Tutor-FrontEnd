import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth-service";
import {LoginPayloadRequestModel} from "../../../model/login-payload-request-model";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup : FormGroup | any;
  hide : boolean = true;
  constructor(private formBuilder : FormBuilder,
              private authService : AuthService,
              private toastrService : ToastrService,
              private router : Router) {
  }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      username : new FormControl('', [Validators.required, Validators.minLength(4)]),
      password : new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  get username() {
    return this.loginFormGroup.get('username');
  }

  get password() {
    return this.loginFormGroup.get('password');
  }

  public login() {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
    } else {
      this.authService.login(
        new LoginPayloadRequestModel(
          this.username.value,
          this.password.value
        )
      ).subscribe((res) => {
        this.authService.setCurrentUser(res.userAuthPayloadResponse);
          this.authService.setToken(res.jwtToken);


          this.router.navigate(['/']);
          this.toastrService.success("Successfully logged in!")
          this.loginFormGroup.reset();
      }, (error) => {
        this.toastrService.error("Something went wrong")
      })
    }
  }

}
