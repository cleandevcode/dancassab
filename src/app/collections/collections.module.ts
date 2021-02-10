import { CollectionsComponent } from './collections.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



const routes: Routes = [
    { path: '', component: CollectionsComponent },
    { path: ':id', component: CollectionsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  declarations: [CollectionsComponent]
})
export class CollectionModule{}
