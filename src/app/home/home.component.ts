import { Component, OnInit, OnDestroy, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from "../shared";
import { DeviceDetectorService } from 'ngx-device-detector';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  shopTitle: string;
  year: any
  loading = true
  bannerImg: string
  dianaURL: string
  angelaURL: string
  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    public globalService: GlobalService,
    private deviceService: DeviceDetectorService
  ) {
    this.bannerImg = this.deviceService.isMobile() ? "../../assets/img/newBackM.jpg" : "../../assets/img/newBackD.jpg";
  }

  ngOnInit() {
    this.loading = false;
    window.setTimeout(() => {
      this.initFullPage();
    }, 100)
    this.year = (new Date()).getFullYear();
    $(".navbar").css("background-color", "unset");
    const langFlag = JSON.parse(localStorage.getItem('country'));

    this.dianaURL = langFlag === "Mexico" ? "/product?collection=SHOPALL&title=Diana&group=GRP:SHOPALL_1&color=VNS:CAFE%20NEGRO&index=0" :
      "/product?collection=SHOPALL&title=Diana&group=GRP:SHOPALL_1&color=VNM:BROWN%20BLACK&index=0";
    this.angelaURL = langFlag === "Mexico" ? "/product?collection=SHOPALL&title=Angela&group=GRP:SHOPALL_1&color=VNS:MULTICOLOR&index=0" :
      "/product?collection=SHOPALL&title=Angela&group=GRP:SHOPALL_1&color=VNM:MULTICOLORED&index=0";

  }

  initFullPage() {
  }

  showModal(id: string) {
    const lang = this.translate.currentLang ? this.translate.currentLang : 'en';
    this.http.get(`assets/files/${id}-${lang}.txt`, { responseType: 'text' }).subscribe(data => {
      $("#modal-content").text(data)
      $(".modal").fadeIn();
    })
  }

  closeModal(id: string) {
    $(".modal").fadeOut();
  }


  ngOnDestroy() {
  }

}
