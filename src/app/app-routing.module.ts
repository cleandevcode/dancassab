import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductComponent } from "./product/product.component";
import { MProductComponent } from "./m-product/m-product.component";
import { HomeComponent } from "./home/home.component";
import { CartComponent } from "./cart/cart.component";
import { StoryComponent } from "./story/story.component";
import { StockistComponent } from "./stockist/stockist.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { VoicesComponent } from "./voices/voices.component";
import { MemuComponent } from "./voices/m-voices/memu/memu.component"
import { CoromotoComponent } from "./voices/m-voices/coromoto/coromoto.component"
import { CourtneyComponent } from "./voices/m-voices/courtney/courtney.component"
import { HannahComponent } from "./voices/m-voices/hannah/hannah.component";
import { ChloeComponent } from "./voices/m-voices/chloe/chloe.component";
import { CharlotteComponent } from "./voices/m-voices/charlotte/charlotte.component";
import { LookbookComponent } from "./lookbook/lookbook.component";
import { AboutComponent } from "./about/about.component";
import { TermsComponent } from "./terms/terms.component"
import { PrivacyComponent } from "./privacy/privacy.component"
const routes: Routes = [
  // { path: "product/:id", component: ProductComponent, data: { reuse: true } },
  // { path: "product/:collection/:title", component: ProductComponent },
  // { path: "product/:collection/:title/:grp/:vnm", component: ProductComponent },
  { path: "product", component: ProductComponent },
  { path: "m-product/:collection/:title", component: MProductComponent },
  { path: "home", component: HomeComponent },
  { path: "voices", component: VoicesComponent },
  { path: "voices/memu", component: MemuComponent },
  { path: "voices/coromoto", component: CoromotoComponent },
  { path: "voices/courtney", component: CourtneyComponent },
  { path: "voices/hannah", component: HannahComponent },
  { path: "voices/chloe", component: ChloeComponent },
  { path: "voices/charlotte", component: CharlotteComponent },
  { path: "cart", component: CartComponent },
  { path: "story", component: StoryComponent },
  { path: "lookbook", component: LookbookComponent },
  { path: "about", component: AboutComponent },
  { path: "terms", component: TermsComponent },
  { path: "privacy", component: PrivacyComponent },
  {
    path: "press",
    loadChildren: () =>
      import("./press/press.module").then((mod) => mod.PressModule),
  },
  { path: "stockist", component: StockistComponent },
  {
    path: "collections",
    loadChildren: () =>
      import("./collections/collections.module").then(
        (mod) => mod.CollectionModule
      ),
  },
  {
    path: "shop",
    loadChildren: () =>
      import("./shop/shop.module").then((mod) => mod.ShopModule),
  },
  // {path: 'shop-temp', loadChildren: () => import('./shop-temp/shop-temp.module').then(mod => mod.ShopTempModule) },
  // {path: 'enterhere', redirectTo: '/shop-temp', pathMatch: 'full'},
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
