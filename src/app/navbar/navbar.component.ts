import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GlobalService } from '../shared';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations'
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('openClose', [
      state('true', style({ height: '100vh' })),
      state('false', style({ height: '0px' })),
      transition('false <=> true', [animate(200)])
    ])
  ]
})
export class NavbarComponent implements OnInit {
  @Output() myEvent = new EventEmitter();
  collection = true;
  year: any
  matrix = false;
  isOpen = false;
  constructor(
    public globalService: GlobalService,
    private http: HttpClient,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.year = (new Date()).getFullYear();
    this.activatedRoute.url.subscribe(activeUrl => {
      const routes = window.location.pathname.split('/')
      if (routes.length > 1) {
        if (routes[1] == 'm-product' || routes[1] == 'shop-temp' || routes[1] == 'enterhere') {
          this.matrix = true;
        } else {
          this.matrix = false;
        }
      } else {
        this.matrix = false;
      }
    });
  }

  handleMenu() {
    this.isOpen = !this.isOpen;
  }

  openCart() {
    this.myEvent.emit(null)
  }

  toggleNav() {
    $('.navbar-mobile_content').fadeToggle();
  }

  showModal(id: string) {
    $('.navbar-mobile_content').fadeOut();
    const lang = this.translate.currentLang ? this.translate.currentLang : 'en';
    window.setTimeout(() => {
      this.http.get(`assets/files/${id}-${lang}.txt`, { responseType: 'text' }).subscribe(data => {
        $("#modal-content").text(data)
        $(".modal").fadeIn();

      })
    }, 500)
  }

  toggleShop() {
    if (this.collection) {
      $(".social").hide()
    } else {
      $(".social").show()
    }
    this.collection = !this.collection;
    $('.shop').slideToggle();
  }

  toggleCollections() {
    if (this.collection) {
      $(".social").hide()
    } else {
      $(".social").show()
    }
    this.collection = !this.collection;
    $('.collections').slideToggle();
  }

}
