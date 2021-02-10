import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-voices-hannah",
  templateUrl: "./hannah.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class HannahComponent implements OnInit {
  articleID: any;
  article: any;
  url: any;
  constructor() {

  }

  ngOnInit(): void {
    const langFlag = JSON.parse(localStorage.getItem('country'));
    this.url = langFlag === "Mexico" ? "/product?collection=JACKETS&title=Loretta&group=GRP:JACKETS_3&color=VNS:AZUL&index=0" : "/product?collection=JACKETS&title=Loretta&group=GRP:JACKETS_3&color=VNM:BLUE&index=0"
  }
}
