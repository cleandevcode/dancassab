import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  HttpClient,
  HttpClientModule,
  HttpClientJsonpModule,
} from "@angular/common/http";

import { ToastrModule } from "ngx-toastr";
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { MaterialModule } from "./material.module";
import { StoryComponent } from "./story/story.component";
import { ShopifyService, ProductService, GlobalService } from "./shared";
import { ProductComponent } from "./product/product.component";
import { MProductComponent } from "./m-product/m-product.component";
import { CartComponent } from "./cart/cart.component";
import { FooterComponent } from "./footer/footer.component";
import { StockistComponent } from "./stockist/stockist.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { DialogMaterial } from "./dialog-mat";
import { VoicesComponent } from "./voices/voices.component";
import { HannahComponent } from "./voices/m-voices/hannah/hannah.component";
import { CoromotoComponent } from "./voices/m-voices/coromoto/coromoto.component";
import { CourtneyComponent } from "./voices/m-voices/courtney/courtney.component";
import { MemuComponent } from "./voices/m-voices/memu/memu.component";
import { ChloeComponent } from "./voices/m-voices/chloe/chloe.component";
import { CharlotteComponent } from "./voices/m-voices/charlotte/charlotte.component"
import { HeaderComponent } from './header/header.component';
import { NavDesktopComponent } from './nav-desktop/nav-desktop.component';
import { LookbookComponent } from './lookbook/lookbook.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { AboutComponent } from './about/about.component';

//Route Reuse Strategy
import { RouteReuseStrategy } from "@angular/router";
import { RouteReuseService } from './RouteReuseService';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    ProductComponent,
    MProductComponent,
    StockistComponent,
    StoryComponent,
    NavbarComponent,
    FooterComponent,
    NotfoundComponent,
    DialogMaterial,
    VoicesComponent,
    HannahComponent,
    CoromotoComponent,
    CourtneyComponent,
    MemuComponent,
    ChloeComponent,
    CharlotteComponent,
    HeaderComponent,
    NavDesktopComponent,
    LookbookComponent,
    PrivacyComponent,
    TermsComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: "toast-top-left",
    }),
    SlickCarouselModule,
    HttpClientModule,
    HttpClientJsonpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [ShopifyService, ProductService, GlobalService, {
    provide: RouteReuseStrategy,
    useClass: RouteReuseService
  }],
  bootstrap: [AppComponent],
  entryComponents: [DialogMaterial],
})
export class AppModule { }
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
