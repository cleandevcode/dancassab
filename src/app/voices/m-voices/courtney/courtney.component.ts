import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-voices-courtney",
  templateUrl: "./courtney.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CourtneyComponent implements OnInit {
  articleID: any;
  article: any;
  url: any;
  constructor() {

  }

  ngOnInit(): void {
    const langFlag = JSON.parse(localStorage.getItem('country'));
    this.url = langFlag === "Mexico" ? "/product?collection=JACKETS&title=Barbara&group=GRP:JACKETS_1&color=VNS:CAFE%20AZUL&index=0" : "/product?collection=JACKETS&title=Barbara&group=GRP:JACKETS_1&color=VNM:BROWN%20BLUE&index=0"
  }
}
