import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.setTimeout(function() {
      location.href = document.getElementsByClassName("notfound")[0].getElementsByTagName("a")[0].href;
      }, 2000);
  }



}

