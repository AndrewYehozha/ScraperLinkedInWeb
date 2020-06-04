import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizeService } from '../authorize.service';

@Component({
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
  constructor(
    private authorizeService: AuthorizeService) { }

  async ngOnInit() {
    await this.logout();
  }

  private async logout(): Promise<void> {
    this.authorizeService.logout();
  }
}
