import { Component, OnInit } from "@angular/core";
import { AlertMessageService } from "../services/alert-message.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-alert-message-component",
  templateUrl: "./alert-message.component.html",
  styleUrls: ['./alert-message.component.css']
})

export class AlertMessageComponent implements OnInit {
  public message = new Subject<any>();
  get isDisplayMessage() { return this.alertMessageService.getIsDisplayMessage() };

  constructor(private alertMessageService: AlertMessageService) { }

  ngOnInit() {
    this.alertMessageService.getMessage().subscribe(message => { this.message = message; });
  }
}
