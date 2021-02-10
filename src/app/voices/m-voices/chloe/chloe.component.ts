import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "app-voices-chloe",
    templateUrl: "./chloe.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ChloeComponent implements OnInit {
    articleID: any;
    article: any;
    url: any;
    constructor() {

    }

    ngOnInit(): void {
        const langFlag = JSON.parse(localStorage.getItem('country'));
        this.url = langFlag === "Mexico" ? "/product?collection=JACKETS&title=Queen&group=GRP:JACKETS_1&color=VNS:CAFE%20BLANCO&index=0" : "/product?collection=JACKETS&title=Queen&group=GRP:JACKETS_1&color=VNM:BROWN%20WHITE&index=0"
    }
}
