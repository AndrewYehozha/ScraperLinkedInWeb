import { OnInit, Component } from "@angular/core";
import { CompanyResponse } from "../models/response/CompanyResponse";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertMessageService } from "../services/alert-message.service";
import { ExecutionStatus } from "../models/Types/ExecutionStatus";
import { CompanyViewModel } from "../models/entities/CompanyViewModel";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthorizeService, AuthenticationResultStatus } from "../authorization/authorize.service";

@Component({
  selector: 'app-company-component',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  public model: CompanyViewModel;
  public loading = false;
  public executionStatus = ExecutionStatus;
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
    this.model = new CompanyViewModel();
    this.queryId = this.route.snapshot.queryParams['id'] || '/';

    if (this.queryId == '/' || !this.isNumber(this.queryId)) {
      this.alertMessageService.error("Invalid query parameters");
    }

    this.model.ExecutionStatus = ExecutionStatus.Created;
    await this.loadCompany();
  }


  private async loadCompany() {
    this.loading = true;

    try {
      await this.http.get<CompanyResponse>(environment.baseServerUrl + '/api/v1/companies/company?id=' + this.queryId, this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                if (response.CompanyViewModel != null) {
                  this.model = response.CompanyViewModel;
                }
                else {
                  this.alertMessageService.error("Company not found");
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


  private isNumber(value) {
    return !isNaN(parseInt(value));
  }
}
