import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { SettingsResponse } from "../models/response/SettingsResponse";
import { SettingsViewModel } from "../models/entities/SettingsViewModel";
import { AuthorizeService, AuthenticationResultStatus } from "../authorization/authorize.service";
import { SettingsRequest } from "../models/request/SettingsRequest";
import { AlertMessageService } from "../services/alert-message.service";

@Component({
  selector: "app-settings-component",
  templateUrl: "./settings.component.html",
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  public model: SettingsViewModel;
  public loading: boolean;

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authorizeService.getToken()}`,
      'Content-Type': 'application/json',
    })
  }

  async ngOnInit() {
    this.model = new SettingsViewModel();
    await this.loadSettings();
  }

  constructor(private http: HttpClient,
    private authorizeService: AuthorizeService,
    private alertMessageService: AlertMessageService) { }

  private async loadSettings() {
    this.loading = true;

    try {
      await this.http.get<SettingsResponse>(environment.baseServerUrl + '/api/v1/settings/setting', this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.model = response.SettingsViewModel;
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

  public async saveSettings() {
    this.loading = true;

    try {
      let request = new SettingsRequest();
      request.SettingViewModel = this.model;

      await this.http.put<SettingsResponse>(environment.baseServerUrl + '/api/v1/settings/setting', JSON.stringify(request), this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.alertMessageService.success("Settings saved successfully");
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
