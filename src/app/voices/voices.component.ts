import { Component, OnInit, ViewEncapsulation } from "@angular/core";
@Component({
  selector: "app-voices",
  templateUrl: "./voices.component.html",
  styleUrls: ["./voices.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VoicesComponent implements OnInit {
  articles: any[];
  create_at: any;
  constructor() { }

  ngOnInit(): void {

  }
}
