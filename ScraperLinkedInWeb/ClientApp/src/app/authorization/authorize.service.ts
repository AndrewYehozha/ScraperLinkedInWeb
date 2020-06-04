import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthorizationRequest } from '../models/Request/AuthorizationRequest';
import { RegistrationRequest } from '../models/Request/RegistrationRequest';
import { environment } from '../../environments/environment';
import { AuthorizationResponse } from '../models/response/AuthorizationResponse';
import { Observable } from 'rxjs/internal/Observable';

export type IAuthenticationResult =
  SuccessAuthenticationResult |
  FailureAuthenticationResult |
  UnauthorizedAuthenticationResult;

export interface SuccessAuthenticationResult {
  status: AuthenticationResultStatus.Success;
}

export interface FailureAuthenticationResult {
  status: AuthenticationResultStatus.Fail;
  message: string;
}

export interface UnauthorizedAuthenticationResult {
  status: AuthenticationResultStatus.Unauthorized;
  message: string;
}

export enum AuthenticationResultStatus {
  Success = 200,
  Unauthorized = 401,
  Fail
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  public isAuthCheck: boolean;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  constructor(private http: HttpClient,
    private cookieService: CookieService,
    private router: Router) { }

  public async signIn(authorizationRequest: AuthorizationRequest): Promise<IAuthenticationResult> {
    try {
      return this.http.post<AuthorizationResponse>(environment.baseServerUrl + '/api/v1/accounts/signin', JSON.stringify(authorizationRequest), this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.cookieService.set("token", response.Token, new Date(response.TokenExpires));
                this.cookieService.set("userName", response.Account.FirstName);
                this.isAuthCheck = true;
                return this.success();

              case AuthenticationResultStatus.Unauthorized:
                return this.unauthorized(response.ErrorMessage);

              default:
                return this.error("Invalid result status");
            }
          })
        .catch(
          error => {
            return this.error("Server is not available");
          });
    } catch (silentError) {
      return this.error(silentError);
    }
  }

  public async signUp(registrationRequest: RegistrationRequest): Promise<IAuthenticationResult> {
    try {
      return this.http.post<AuthorizationResponse>(environment.baseServerUrl + '/api/v1/accounts/signup', JSON.stringify(registrationRequest), this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                return this.success();

              case AuthenticationResultStatus.Unauthorized:
                return this.unauthorized(response.ErrorMessage);

              default:
                return this.error("Invalid result status");
            }
          })
        .catch(
          error => {
            return this.error("Server is not available");
          });
    } catch (silentError) {
      return this.error(silentError);
    }
  }

  public logout(): void {
    this.cookieService.deleteAll();
    this.isAuthCheck = false;
    this.router.navigate(["/home"]);
  }

  public isAuthenticated(): Observable<boolean> {
    return Observable.create(observer => {
      observer.next(!!this.cookieService.get("token"));
      observer.complete();
    });
  }

  public getUserName(): Observable<string> {
    return Observable.create(observer => {
      observer.next(this.cookieService.get("userName"));
      observer.complete();
    });
  }

  private success(): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Success };
  }

  private unauthorized(message: string): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Unauthorized, message };
  }

  private error(message: string): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Fail, message };
  }
}
