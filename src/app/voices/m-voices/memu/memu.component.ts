import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-voices-memu",
  templateUrl: "./memu.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class MemuComponent implements OnInit {
  articleID: any;
  article: any;
  url: any;
  constructor() {

  }

  ngOnInit(): void {
    const langFlag = JSON.parse(localStorage.getItem('country'));
    this.url = langFlag === "Mexico" ? "/product?collection=JACKETS&title=Earth&group=GRP:JACKETS_1&color=VNS:VERDE%20METALICO&index=0" : "/product?collection=JACKETS&title=Earth&group=GRP:JACKETS_1&color=VNM:METALLIC%20MINT%20GREEN&index=0"
  }
}
