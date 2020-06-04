import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationRequest } from '../../models/request/RegistrationRequest';
import { AuthorizeService, AuthenticationResultStatus } from '../authorize.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  model: RegistrationRequest;
  loading = false;
  minDateOfBirthday: Date;
  maxDateOfBirthday: Date;
  errorMessage: string;

  ngOnInit(): void {
    this.model = new RegistrationRequest();
    this.model.DateOfBirthday = new Date(2000, 0, 1);
    this.minDateOfBirthday = new Date(1800, 0, 1);
    this.maxDateOfBirthday = new Date();
  }

  constructor(
    private router: Router,
    private authorizeService: AuthorizeService,
    private viewportScroller: ViewportScroller
  ) { }

  public async register() {
    this.loading = true;
    const result = await this.authorizeService.signUp(this.model);

    switch (result.status) {
      case AuthenticationResultStatus.Success:
        this.router.navigate(['/login']);
        break;
      case AuthenticationResultStatus.Fail:
      case AuthenticationResultStatus.Unauthorized:
        this.errorMessage = result.message;
        break;
      default:
        this.errorMessage = `Invalid status result ${(result as any).status}.`;
        break;
    }

    document.getElementById('topElem').scrollIntoView({ block: "center", behavior: "smooth" });
    this.loading = false;
  }

  isNullOrEmpty(value: string) {
    return value == undefined || value == null || value.trim() == '';
  }
}
