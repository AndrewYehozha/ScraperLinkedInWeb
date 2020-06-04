import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthorizationRequest } from '../../models/request/AuthorizationRequest';
import { AuthorizeService, AuthenticationResultStatus } from '../authorize.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  model: AuthorizationRequest;
  loading = false;
  returnUrl: string;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorizeService: AuthorizeService) { }

  async ngOnInit() {
    this.model = new AuthorizationRequest();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public async login() {
    this.loading = true;
    const result = await this.authorizeService.signIn(this.model);

    switch (result.status) {
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.returnUrl);
        break;
      case AuthenticationResultStatus.Fail:
      case AuthenticationResultStatus.Unauthorized:
        this.errorMessage = result.message;
        break;
      default:
        this.errorMessage = `Invalid status result ${(result as any).status}.`;
        break;
    }

    this.loading = false;
  }

  private async navigateToReturnUrl(returnUrl: string) {
    await this.router.navigateByUrl(returnUrl, {
      replaceUrl: true
    });
  }
}
