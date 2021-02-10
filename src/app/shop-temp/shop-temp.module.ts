import { ShopTempComponent } from './shop-temp.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    { path: '', component: ShopTempComponent },
    { path: ':id', component: ShopTempComponent },
    { path: ':id/:title', component: ShopTempComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule
  ],
  declarations: [ShopTempComponent]
})
export class ShopTempModule{}
