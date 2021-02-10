import { Component, ViewChild} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './shared';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import {DialogMaterial} from '../app/dialog-mat'
import { CartComponent } from './cart/cart.component';


declare var $: any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(CartComponent, { static: false })
  private cart: CartComponent;
  dialogMatRef: MatDialogRef<DialogMaterial>;
  tries = 0;

  constructor(
    public toastr: ToastrService,
    private translate: TranslateService,
    private cartService: GlobalService,
    private dialog: MatDialog) {
      translate.addLangs(['en', 'es']);
      translate.setDefaultLang('en');
          // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      // We listen to the resize event
      window.addEventListener('resize', () => {
        // We execute the same script as before
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
      this.checkCountry();
      
      // // get last time modal was shown
      // let time = localStorage.getItem('time');
      // //  if its more than 6000000ms (10 minutes) show modal store new time
      // if(!time || +new Date - parseInt(time) > 600000){
      //   localStorage.setItem('time', (+new Date).toString());
      //   this.openDialog();
      // }
    }

  checkCart(country:string){
    const prev_country= JSON.parse(localStorage.getItem('country')) || '';
    if (prev_country && prev_country != country){
      this.cartService.cleanLocalCart()
    }
  }

  checkCountry() {
      window.setTimeout(() => {
        $.ajax({
          url: 'https://geolocation-db.com/jsonp',
          dataType: 'jsonp',
          jsonpCallback: "callback",
          success: (res) => {
            this.updateTranslate(res.country_name);
          }, 
          error: (err) => {
            console.log(err)
            if (this.tries++ < 5){
              window.setTimeout(() => this.checkCountry(), 500)
            }
          }
      });
    }, 100)
  }

  updateTranslate(country:string) {
      if (country === "Mexico") {
          this.checkCart(country)
          localStorage.setItem('country', JSON.stringify(country));
          this.translate.use('es');
      } else  {
          this.checkCart(country)
          localStorage.setItem('country', JSON.stringify(country));
          this.translate.use('en');
      }
  }


      // FUNCION PARA ENSEÑAR MODAL
  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '780px'
    dialogConfig.closeOnNavigation = true;
    this.dialogMatRef = this.dialog.open(DialogMaterial, dialogConfig)
  }

  receiveMessage(e){
    this.cart.openModal();
  }




  onActivate(event) {
    window.scroll(0,0);
  }
}
