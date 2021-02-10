import { ShopComponent } from './shop.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '', component: ShopComponent, data: { reuse: true } },
  { path: ':id', component: ShopComponent, data: { reuse: true } },
  { path: ':id/:title', component: ShopComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule
  ],
  declarations: [ShopComponent]
})
export class ShopModule { }
