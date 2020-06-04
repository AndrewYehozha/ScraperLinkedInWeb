import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../authorize.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit {

  async ngOnInit() {
  }

  constructor(
    private router: Router,
    private authorizeService: AuthorizeService,
  ) { }

  get isAuthenticated() {
    return this.authorizeService.isAuthenticated()
      .pipe(
        tap((isAuth: boolean) => {
          if (this.authorizeService.isAuthCheck && !isAuth) {
            this.authorizeService.isAuthCheck = false;
            this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } });
          }
        }));
  }
  get userName() { return this.authorizeService.getUserName() }
}
