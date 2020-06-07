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
import { SearchCompaniesRequest } from '../models/request/SearchCompaniesRequest';
import { SortedCompaniesFieldTypes } from '../models/Types/SortedFieldTypes';
import { SearchCompaniesResponse } from '../models/response/SearchCompaniesResponse';
import { SearchCompaniesViewModel } from '../models/entities/SearchCompaniesViewModel';

@Component({
  selector: 'app-companies-component',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements AfterViewInit, OnInit {
  public isImportFileResult: boolean = false;
  public isLoading: boolean = false;
  public displayedColumns: string[] = ['OrganizationName', 'HeadquartersLocation', 'Website', 'Specialties', 'AmountEmployees', 'DateCreated', 'ExecutionStatus'];
  public dataSource: MatTableDataSource<SearchCompaniesViewModel>;
  public totalCount = 0;
  public searchCompaniesRequest = new SearchCompaniesRequest();

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.authorizeService.getToken()}`,
      'Content-Type': 'application/json',
    })
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient,
    private authorizeService: AuthorizeService,
    private alertMessageService: AlertMessageService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.searchCompaniesRequest.StartDate = new Date();
    this.searchCompaniesRequest.EndDate = new Date();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(async () => {
          this.searchCompaniesRequest.SortedFieldTypes = SortedCompaniesFieldTypes[this.sort.active];
          this.searchCompaniesRequest.IsAscending = this.sort.direction == 'asc';
          this.searchCompaniesRequest.PageNumber = this.paginator.pageIndex + 1;
          this.searchCompaniesRequest.PageSize = this.paginator.pageSize;

          await this.getCompanies();
          return observableOf([]);
        }),
        map(() => {})
    ).subscribe();
  }

  public async applySearch(value: string) {
    if ((!!value && value.trim().length > 2) || value.trim().length == 0) {
      this.paginator.pageIndex = 0;
      this.searchCompaniesRequest.SortedFieldTypes = SortedCompaniesFieldTypes[this.sort.active];
      this.searchCompaniesRequest.IsAscending = this.sort.direction == 'asc';
      this.searchCompaniesRequest.PageNumber = this.paginator.pageIndex + 1;
      this.searchCompaniesRequest.PageSize = this.paginator.pageSize;
      await this.getCompanies();
    }
  }

  public async clearSearch() {
    this.searchCompaniesRequest.SearchValue = '';
    await this.applySearch('');
  }

  public async changeDate() {
    await this.applySearch('');
  }

  private async getCompanies() {
    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      await this.http.post<SearchCompaniesResponse>(environment.baseServerUrl + '/api/v1/companies/search', JSON.stringify(this.searchCompaniesRequest) , this.httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.totalCount = response.TotalCount;
                this.dataSource = new MatTableDataSource(response.SearchCompaniesViewModel);
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

  public async importCompanies(file: any) {
    this.isImportFileResult = true;

    let fileList: FileList = file.target.files;

    if (fileList.length == 0) {
      this.alertMessageService.error('Please, select file');
      this.isImportFileResult = false;
      return;
    };

    var formData = new FormData();
    for (var x = 0; x < fileList.length; x++) {
      if (fileList[x].type != 'application/vnd.ms-excel') {
        this.alertMessageService.error('Invalid file type. Please, import the CSV file');
        this.isImportFileResult = false;
        return;
      };

      if (fileList[x].size > 2097152) {
        this.alertMessageService.error('File size should be no more than 2 MB');
        this.isImportFileResult = false;
        return;
      };

      formData.append("file" + x, fileList[x], fileList[x].type);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authorizeService.getToken()}`,
        'Accept': 'application/json'
      })
    }

    try {
      await this.http.post<ImportCompaniesResponse>(environment.baseServerUrl + '/api/v1/companies/import', formData, httpOptions)
        .toPromise()
        .then(
          response => {
            switch (response.StatusCode) {
              case AuthenticationResultStatus.Success:
                this.alertMessageService.success(`Imported ${response.ImportedCompaniesCount} companies`);
                this.applySearch('');
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
          });
    } catch (silentError) {
      this.alertMessageService.error(silentError);
    }

    this.isImportFileResult = false;
  }
}
