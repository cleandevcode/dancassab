import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalService } from "../shared"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() myEvent = new EventEmitter();
  collection = true;
  constructor(public globalService: GlobalService,) { }

  ngOnInit(): void {
  }

  openCart() {
    this.myEvent.emit(null)
  }
}
