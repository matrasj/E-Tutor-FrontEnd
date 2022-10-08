import {AuthService} from "../service/auth-service";
import {Router} from "@angular/router";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn : 'root'
})
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService : AuthService,
              private router : Router) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("api/v1/auth")) {
      return next.handle(req.clone());
    }

    const jwtToken = this.authService.getJwtToken();
    const requestWithJwtToken = AuthInterceptor.addToken(req, jwtToken);

    return next.handle(requestWithJwtToken).pipe(
      catchError(
        err => {
          if (err.status === 401 || err.status === 403) {
            this.router.navigate(['/login']);
          }

          return throwError("Something went wrong");
        }
      )
    )
  }


  private static addToken(req : HttpRequest<any>, jwtToken : any) {
    return req.clone({
      setHeaders : {
        Authorization : 'Bearer ' + jwtToken
      }
    })
  }
}
