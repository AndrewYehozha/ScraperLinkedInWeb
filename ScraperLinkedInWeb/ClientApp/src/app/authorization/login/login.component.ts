import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthorizationRequest } from '../../models/request/AuthorizationRequest';
import { AuthorizeService, AuthenticationResultStatus } from '../authorize.service';
import { AlertMessageService } from '../../services/alert-message.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public model: AuthorizationRequest;
  public loading = false;
  private returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorizeService: AuthorizeService,
    private alertMessageService: AlertMessageService) { }

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
        this.alertMessageService.error(result.message);
        break;
      default:
        this.alertMessageService.error(`Invalid status result ${(result as any).status}.`);
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
