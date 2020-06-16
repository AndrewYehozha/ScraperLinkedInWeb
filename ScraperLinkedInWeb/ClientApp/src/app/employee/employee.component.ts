import { OnInit, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlertMessageService } from "../services/alert-message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthorizeService, AuthenticationResultStatus } from "../authorization/authorize.service";
import { SuitableProfileResponse } from "../models/response/SuitableProfileResponse";
import { SuitableProfileViewModel } from "../models/entities/SuitableProfileViewModel";
import { ProfileStatus } from "../models/Types/ProfileStatus";

@Component({
  selector: 'app-employee-component',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
  public model: SuitableProfileViewModel;
  public loading = false;
  public profileStatus: string = '';
  private queryId: any;

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authorizeService.getToken()}`,
      'Content-Type': 'application/json',
    })
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authorizeService: AuthorizeService,
    private alertMessageService: AlertMessageService) { }

  async ngOnInit() {
    this.model = new SuitableProfileViewModel();
    this.queryId = this.route.snapshot.queryParams['id'] || '/';
    if (this.queryId == '/' || !this.isNumber(this.queryId)) {
      this.alertMessageService.error("Invalid query parameters");
    }
    else {
      await this.loadEmployee();
    }
  }


  private async loadEmployee() {
    this.loading = true;

    try {
      await this.http.get<SuitableProfileResponse>(environment.baseServerUrl + '/api/v1/suitable-profiles/suitable-profile?id=' + this.queryId, this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                if (response.SuitableProfileViewModel != null) {
                  this.model = response.SuitableProfileViewModel;
                  this.profileStatus = response.SuitableProfileViewModel.ProfileStatus == ProfileStatus.Chief ? "Chief" : "Developer";
                }
                else {
                  this.alertMessageService.error("Employee not found");
                }
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
            this.alertMessageService.error(error.message);
          })
        .catch(
          error => {
            console.log(error.message);
            this.alertMessageService.error("Server is not available");
          });
    } catch (silentError) {
      this.alertMessageService.error(silentError);
    }

    this.loading = false;
  }

  private isNumber(value) {
    return !isNaN(parseInt(value));
  }
}
