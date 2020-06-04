import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthorizeInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    //let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //if (currentUser && currentUser.token) {
    //  request = request.clone({
    //    setHeaders: {
    //      Authorization: 'Bearer ${currentUser.token}'
    //    }
    //  });
    //}

    return next.handle(request);
  }
}
