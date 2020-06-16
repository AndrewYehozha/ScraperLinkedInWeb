import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { AuthorizeService, AuthenticationResultStatus } from '../authorization/authorize.service';
import { AlertMessageService } from '../services/alert-message.service';
import { environment } from '../../environments/environment';
import { ImportCompaniesResponse } from '../models/response/ImportCompaniesResponse';
import { SearchSuitableProfilesResponse } from '../models/response/SearchSuitableProfilesResponse';
import { SearchSuitableProfilesViewModel } from '../models/entities/SearchSuitableProfilesViewModel';
import { SearchSuitableProfilesRequest } from '../models/request/SearchSuitableProfilesRequest';
import { ProfileStatus } from '../models/Types/ProfileStatus';
import { SortedSuitablesProfilesFieldTypes } from '../models/Types/SortedSuitablesProfilesFieldTypes';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employees-component',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements AfterViewInit, OnInit {
  public isImportFileResult: boolean = false;
  public isLoading: boolean = false;
  public displayedColumns: string[] = ['FirstName', 'LastName', 'PersonLinkedIn', 'Job', 'Company', 'Email', 'ProfileStatus', 'DateTimeCreation'];
  public dataSource: MatTableDataSource<SearchSuitableProfilesViewModel>;
  public totalCount = 0;
  public searchEmployeesRequest = new SearchSuitableProfilesRequest();
  public profileStatus = ProfileStatus;

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authorizeService.getToken()}`,
      'Content-Type': 'application/json',
    })
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private authorizeService: AuthorizeService,
    private alertMessageService: AlertMessageService,
    private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    this.searchEmployeesRequest.StartDate = new Date();
    this.searchEmployeesRequest.EndDate = new Date();
    this.searchEmployeesRequest.ProfileStatus = this.profileStatus.Any;

    let querycompanyId = this.route.snapshot.queryParams['companyId'] || '/';
    if (querycompanyId != '/' && this.isNumber(querycompanyId)) {
      this.searchEmployeesRequest.CompanyId = querycompanyId;
      await this.getEmployees();
    }
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(async () => {
          this.searchEmployeesRequest.SortedFieldType = SortedSuitablesProfilesFieldTypes[this.sort.active];
          this.searchEmployeesRequest.IsAscending = this.sort.direction == 'asc';
          this.searchEmployeesRequest.PageNumber = this.paginator.pageIndex + 1;
          this.searchEmployeesRequest.PageSize = this.paginator.pageSize;
          await this.getEmployees();
          return observableOf([]);
        }),
        map(() => { })
      ).subscribe();
  }

  public async applySearch(value: string) {
    if ((!!value && value.trim().length > 2) || value.trim().length == 0) {
      this.paginator.pageIndex = 0;
      this.searchEmployeesRequest.SortedFieldType = SortedSuitablesProfilesFieldTypes[this.sort.active];
      this.searchEmployeesRequest.IsAscending = this.sort.direction == 'asc';
      this.searchEmployeesRequest.PageNumber = this.paginator.pageIndex + 1;
      this.searchEmployeesRequest.PageSize = this.paginator.pageSize;
      await this.getEmployees();
    }
  }

  public async clearSearch() {
    this.searchEmployeesRequest.SearchValue = '';
    await this.applySearch('');
  }

  public async changeDate() {
    await this.applySearch('');
  }

  private async getEmployees() {
    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      await this.http.post<SearchSuitableProfilesResponse>(environment.baseServerUrl + '/api/v1/suitable-profiles/search', JSON.stringify(this.searchEmployeesRequest), this.httpOptions)
        .toPromise()
        .then(
          response => {
            console.log(response);
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.totalCount = response.TotalCount;
                this.dataSource = new MatTableDataSource(response.SearchSuitableProfilesViewModel);
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

    this.isLoading = false;
  }

  public async exportEmployees() {
    this.isImportFileResult = true;
    if (this.totalCount == 0) {
      this.alertMessageService.error('Table with employees is empty');
      this.isImportFileResult = false;
      return;
    }
    else if (this.totalCount > 500) {
      this.alertMessageService.error('Export limit. You are allowed to export not more than 500 employees at a time!');
      this.isImportFileResult = false;
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authorizeService.getToken()}`,
        'Content-Type': 'application/json'
      })
    }

    try {
      await this.http.post<any>(environment.baseServerUrl + '/api/v1/suitable-profiles/export', JSON.stringify(this.searchEmployeesRequest), httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                var anchor = document.createElement("a");
                anchor.download = `employees_${response.DateCreateUTC}.csv`;
                anchor.href = window.URL.createObjectURL(new Blob([response.Content], { type: response.ContentType }));
                anchor.click();
                this.alertMessageService.success(`File download with ${response.ContentEntriesCount} employees completed`);
                break;

              case AuthenticationResultStatus.Unauthorized:
              case AuthenticationResultStatus.NotFound:
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
          });
    } catch (silentError) {
      this.alertMessageService.error(silentError);
    }

    this.isImportFileResult = false;
  }

  public getProfileStatuses(): Array<string> {
    var keys = Object.keys(this.profileStatus);
    return keys.slice(keys.length / 2);
  }

  public async onProfileStatusChange(ob) {
    await this.applySearch('');
  }

  public getEmployeeByIdRoute(id) {
    return `/employee?id=${id}`;
  }

  private isNumber(value) {
    return !isNaN(parseInt(value));
  }
}
