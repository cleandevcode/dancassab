import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "app-voices-charlotte",
    templateUrl: "./charlotte.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class CharlotteComponent implements OnInit {
    articleID: any;
    article: any;
    url: any;
    constructor() {

    }

    ngOnInit(): void {
        const langFlag = JSON.parse(localStorage.getItem('country'));
        this.url = langFlag === "Mexico" ?
            "/product?collection=SHOPALL&title=Floyd&group=GRP:SHOPALL_1&color=VNS:MORADO&index=2"
            : "/product?collection=SHOPALL&title=Floyd&group=GRP:SHOPALL_1&color=VNM:PURPLE&index=2"
    }
}
