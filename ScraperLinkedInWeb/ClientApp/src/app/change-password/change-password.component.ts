import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { ChangePasswordRequest } from "../models/request/ChangePasswordRequest";
import { AuthorizeService, AuthenticationResultStatus } from "../authorization/authorize.service";
import { AlertMessageService } from "../services/alert-message.service";
import { BaseResponse } from "../models/response/BaseResponse";

@Component({
  selector: "app-change-password-component",
  templateUrl: "./change-password.component.html",
  styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent implements OnInit {
  public model: ChangePasswordRequest;
  public loading: boolean;

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authorizeService.getToken()}`,
      'Content-Type': 'application/json',
    })
  }

  async ngOnInit() {
    this.model = new ChangePasswordRequest();
  }

  constructor(private http: HttpClient,
    private authorizeService: AuthorizeService,
    private alertMessageService: AlertMessageService) { }

  public async changePassword() {
    this.loading = true;

    try {
      await this.http.put<BaseResponse>(environment.baseServerUrl + '/api/v1/accounts/account/change-password', JSON.stringify(this.model), this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.alertMessageService.success("Password changed successfully");
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
