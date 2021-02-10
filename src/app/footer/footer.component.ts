import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $:any
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  year :any
  constructor() { }

  ngOnInit() {
    this.year = (new Date()).getFullYear();
  }

  ngOnDestroy(){
    $('.navbar').fadeIn(400);
  }

}
