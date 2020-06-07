import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationRequest } from '../../models/request/RegistrationRequest';
import { AuthorizeService, AuthenticationResultStatus } from '../authorize.service';
import { AlertMessageService } from '../../services/alert-message.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  public model: RegistrationRequest;
  public loading = false;
  public minDateOfBirthday: Date;
  public maxDateOfBirthday: Date;

  ngOnInit(): void {
    this.model = new RegistrationRequest();
    this.model.DateOfBirthday = new Date(2000, 0, 1);
    this.minDateOfBirthday = new Date(1800, 0, 1);
    this.maxDateOfBirthday = new Date();
  }

  constructor(
    private router: Router,
    private authorizeService: AuthorizeService,
    private alertMessageService: AlertMessageService) { }

  public async register() {
    this.loading = true;
    const result = await this.authorizeService.signUp(this.model);

    switch (result.status) {
      case AuthenticationResultStatus.Success:
        this.router.navigate(['/login']);
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
}
