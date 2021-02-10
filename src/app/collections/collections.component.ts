import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})


export class CollectionsComponent implements OnInit{
  loading = true;
  loading2 = true;
  collection = '';
  images: Array <number>
  constructor(
    private route: ActivatedRoute
  ) {}


  ngOnInit(){
    const mobile = screen.width > 1023 ? false : true;
		// Make the class full height (fix for the scrolling problem in safari and chorme with 100vh)
		$('.content-container').css('height', $(window).height());

    this.route.params.subscribe((params) => {
    //we get the id from the link and add the =, every product in shopify end with =
    this.collection = params['id'] ? params['id'] : 'FW20';
    let images_ammount;
    // depending on the collection we show different ammount of images
    if(this.collection == 'FW20') images_ammount = mobile  ? 12:  27;
    if(this.collection == 'SS20') images_ammount =  mobile ? 14:  28;
    if(this.collection == 'FW19') images_ammount = mobile  ? 11:  24;
    if(this.collection == 'PF19') images_ammount =  mobile ? 5:  11;
    if(this.collection == 'SS19') images_ammount =  mobile ? 5:  11;
    // make array form 0 to images ammount for *ngFor
    this.images = Array(images_ammount).fill(0).map((x,i)=> ++i);
    this.loading = false;
    window.setTimeout(()=>{ this.loading2=false;}, 1000)
    });
  }

}
