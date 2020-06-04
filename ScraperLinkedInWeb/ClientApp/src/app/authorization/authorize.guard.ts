import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthorizeService } from './authorize.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(
    private router: Router,
    private authorizeService: AuthorizeService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isAuth: boolean;
    this.authorizeService.isAuthenticated().subscribe(x => isAuth = x);

    if (isAuth && (state.url.includes("/login") || state.url.includes("/register"))) {
      this.router.navigate(['/home']);
      return false;
    }
    else if (!isAuth && (state.url.includes("/login") || state.url.includes("/register"))) {
      return true;
    }

    if (isAuth) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
