import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertMessageService {
  private subject = new Subject<any>();
  private isDisplayMessage: boolean;
  private keepAfterNavigationChange: boolean = false;
  private showTimeOutMessages: NodeJS.Timeout;
  private hideTimeOutMessages: NodeJS.Timeout;

  constructor(private router: Router) {
    // clear alert message on route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  public success(message: string, keepAfterNavigationChange = false) {
    this.stopTimeOutMessages();
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
    this.startTimeOutMessages();
    this.goToTopElem();
  }

  public error(message: string, keepAfterNavigationChange = false) {
    this.stopTimeOutMessages();
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
    this.startTimeOutMessages();
    this.goToTopElem();
  }

  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  public getIsDisplayMessage(): Observable<boolean> {
    return Observable.create(observer => {
      observer.next(!!this.isDisplayMessage);
      observer.complete();
    });
  }

  private goToTopElem() {
    document.getElementById('topElem').scrollIntoView({ block: "center", behavior: "smooth" });
  }

  private startTimeOutMessages() {
    this.showTimeOutMessages = setTimeout(() => {
      this.isDisplayMessage = false;
    }, 5000);

    this.hideTimeOutMessages = setTimeout(() => {
      this.subject.next();
    }, 5500);
  }

  private stopTimeOutMessages() {
    clearTimeout(this.showTimeOutMessages);
    clearTimeout(this.hideTimeOutMessages);
    this.isDisplayMessage = true;
    this.subject.next();
  }
}
