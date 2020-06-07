import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { AuthorizeService, AuthenticationResultStatus } from "../authorization/authorize.service";
import { AccountRequest } from "../models/request/AccountRequest";
import { AccountResponse } from "../models/response/AccountResponse";
import { AccountViewModel } from "../models/entities/AccountViewModel";
import { CookieService } from "ngx-cookie-service";
import { AlertMessageService } from "../services/alert-message.service";

@Component({
  selector: "app-profile-component",
  templateUrl: "./profile.component.html",
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  public model: AccountViewModel;
  public loading: boolean;
  public minDateOfBirthday: Date;
  public maxDateOfBirthday: Date;

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authorizeService.getToken()}`,
      'Content-Type': 'application/json',
    })
  }

  async ngOnInit() {
    this.model = new AccountViewModel();
    this.model.DateOfBirthday = new Date(2000, 0, 1);
    this.minDateOfBirthday = new Date(1800, 0, 1);
    this.maxDateOfBirthday = new Date();
    await this.loadProfile();
  }

  constructor(private http: HttpClient,
    private authorizeService: AuthorizeService,
    private cookieService: CookieService,
    private alertMessageService: AlertMessageService) { }

  private async loadProfile() {
    this.loading = true;

    try {
      await this.http.get<AccountResponse>(environment.baseServerUrl + '/api/v1/accounts/account', this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.model = response.AccountViewModel;
                break;

              case AuthenticationResultStatus.Unauthorized:
              case AuthenticationResultStatus.Fail:
                this.alertMessageService.error(response.ErrorMessage);
                break;

              default:
                this.alertMessageService.error("Invalid result status");
                break;
            }
          },
          error => {
            this.alertMessageService.error(error);
          })
        .catch(
          error => {
            this.alertMessageService.error("Server is not available");
          });
    } catch (silentError) {
      this.alertMessageService.error(silentError);
    }

    this.loading = false;
  }

  public async saveProfile() {
    this.loading = true;

    try {
      let request = new AccountRequest();
      request.AccountViewModel = this.model;

      await this.http.put<AccountResponse>(environment.baseServerUrl + '/api/v1/accounts/account', JSON.stringify(request), this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.cookieService.set("userName", this.model.FirstName, new Date(2999, 0, 1));
                this.alertMessageService.success("Profile saved successfully");
                break;

              case AuthenticationResultStatus.Unauthorized:
              case AuthenticationResultStatus.Fail:
                this.alertMessageService.error(response.ErrorMessage);
                break;

              default:
                this.alertMessageService.error("Invalid result status");
            }
          })
        .catch(
          error => {
            this.alertMessageService.error(error.statusText);
            console.error(error);
          });
    } catch (silentError) {
      this.alertMessageService.error(silentError);
    }

    this.loading = false;
  }
}
