import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-voices-coromoto",
  templateUrl: "./coromoto.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CoromotoComponent implements OnInit {
  articleID: any;
  article: any;
  url: any;
  constructor() {

  }

  ngOnInit(): void {
    const langFlag = JSON.parse(localStorage.getItem('country'));
    this.url = langFlag === "Mexico" ? "/product?collection=JACKETS&title=Dixie&group=GRP:JACKETS_1&color=VNS:HUESO&index=0" : "/product?collection=JACKETS&title=Dixie&group=GRP:JACKETS_1&color=VNM:BONE&index=0"
  }
}
