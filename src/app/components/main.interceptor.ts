import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from "../services";
import {catchError, switchMap} from "rxjs/operators";
import {IToken} from "../interfaces";
import {Router} from "@angular/router";

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): any {
    const isAuthenticated = this.authService.isAuthenticated();
    if(isAuthenticated) {
      request = this.addToken(request, this.authService.getAccessToken())
    }

    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        if(res && res.error) {
          return this.handle401Error(request, next)
        }
        if(res.status == 401) {
          this.router.navigate(['login'], {
            queryParams: {
              sessionFile: true
            }
          })
        }
      })
    )
  }

  addToken(request: HttpRequest<any>, token: string | null){
    return request.clone({
      setHeaders: {Authorization: `Bearer${token}`}
    })
  }

  private handle401Error(request:HttpRequest<any>, next: HttpHandler):any {
    return this.authService.refreshToken().pipe(
      switchMap((tokens: IToken) => {
        return next.handle(this.addToken(request, tokens.access))
      })
    )
  }
}
