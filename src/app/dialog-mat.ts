import { Component } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    template: `


<div class='mat-dialog-content'>
    <div class='row'>
      <div class='column'>
        <div class='blue-column'>
          <img class="img-size web" src="assets/images/pop.jpg" alt="">
          <img class="img-size mobile" src="assets/images/pop-mobile.jpg" alt="">
        </div>
      </div>
      <div class='column'>
        <div class='green-column'>
            <p  class="text-center text-mob text">
            {{ 'pop.1' | translate }} <br> <br> {{ 'pop.3' | translate }}
            </p>
            <button style="border: none;
            display: block;
            background-color: black;
            color: white;
            width: 113px;
            font-size: 14px;
            font-family: inherit;
            height: 44px;
            margin: 3rem auto;
            margin-left: auto;
            border-radius: 0;
            cursor:pointer;" [routerLink]="['/shop/Sample Sale']" (click)="closeDialog()">{{ 'pop.4' | translate }}</button>
        </div>
      </div>
    </div>
  </div>

  <style>

.text{
  text-transform: uppercase; padding: 2rem; line-height: 23px;
}

  .some-page-wrapper {
    margin: 15px;
  }
  
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
  
  .column {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
  }
  

  .img-size{
    width: auto;
    height: auto;
    max-width: 100%;
  }
  .mobile{
    display:none;
  }

  hr{
        margin: 0px 27px;
  }
  @media only screen and (max-width: 600px){
    .web{
      display: none;
    }
    .mobile{
      display:block;
    }
    .mat-dialog-content{
      width: 90vw !important;
    }
    .img-size{
      max-height: 20rem;
      width: 90vw;
      object-fit: cover;
      object-position: center;
    }

    .row{
      flex-direction: column;
    }
}
  </style>

  `
})



export class DialogMaterial {

    dialogMatRef: MatDialogRef<DialogMaterial>;

    constructor(private dialog: MatDialog){}

    closeDialog() {

        this.dialog.closeAll()

      }
}