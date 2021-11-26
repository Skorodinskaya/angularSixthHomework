import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataTransferService} from "./data-transfer.service";
import {IAuth, IToken} from "../interfaces";
import {Observable} from "rxjs";
import {urls} from "../configs";
import {tap} from "rxjs/operators";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accessTokenKey = 'access';
  private refreshTokenKey = 'refresh';

  constructor(private httpClient: HttpClient, private transferService: DataTransferService, private userService: UserService) {
  }

  login(user: IAuth): Observable<IToken> {
    return this.httpClient.post<IToken>(urls.auth, user)
      .pipe(
        tap((tokens: IToken) => {
          this.userService.getMe().subscribe(me => {
            this.transferService.currentUserSubject.next(me)
          })
          this.setTokens(tokens)
        })
      )
  }

  refreshToken(): Observable<IToken> {
    return this.httpClient.post<IToken>(`${urls.auth}/refresh`, {refresh: this.getRefreshToken()})
      .pipe(
        tap((tokens: IToken) => {
          this.setTokens(tokens)
        })
      )
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  };

  private setAccessToken(access: string): void {
    localStorage.setItem(this.accessTokenKey, access)
  };

  private setRefreshToken(refresh: string): void {
    localStorage.setItem(this.refreshTokenKey, refresh)
  };

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey)
  };

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey)
  };

  private setTokens(token: IToken): void {
    let {access, refresh} = token;
    this.setAccessToken(access);
    this.setRefreshToken(refresh);
  }
}
