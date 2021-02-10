import { Component, OnInit, OnDestroy, } from '@angular/core';
import { ShopifyService, Product} from './../shared';
import { ActivatedRoute} from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-shop-temp',
  templateUrl: './shop-temp.component.html',
  styleUrls: ['./shop-temp.component.scss']
})
export class ShopTempComponent implements OnInit {
  section: any;
  loadedSection: any;
  openCart = true;
  shopTitle: string;
  scroll: any;
  collection: string;
  // we group the items in array containg a 3 array of products for display 
  productsGroup: Array<Product[]> = [];
  products: Product[] = [];
  loading = true;
  num_products: number;
  // this array is to match the collection tag with the shopify collections we want to display
  collections = ["Spring Summer 2020", "Fall Winter 2019", "The Icons", "Tie Dye Capsule"]

  constructor(
    private shopifyService: ShopifyService,
    private route: ActivatedRoute,
  ) {
    // we get all the products for te shopty API
    $(".cart_button, .navbar_item, .navbar_item a, .navbar_logo, .navbar-mobile_item, .cart_modal-content-text, .cart_modal-content-variant, .cart_modal-content-price, .cart_modal-content-remove, .cart_modal-close").addClass('green');
    $(".ticker-wrap").css("display", "none");
    $(".cart_button").css("border", "1px solid #91FF00");
    $(".dis").css({"cursor":"not-allowed", "text-decoration":"line-through", "pointer-events": "none" });
    $(".navbar_logo").css({"cursor":"not-allowed", "pointer-events": "none"});
    $(".navbar-mobile, .navbar-mobile_content, .cart_modal-content").css({"color":"#91FF00", "background-color": "#000"});
    $(".cart_modal-content").css({"border":"1px solid #91FF00", "background-color": "#000"});
    $(".checkout_btn").css({"color":"#000", "background-color": "#91FF00"});
    this.shopifyService.setClient().then((res) => {
      this.shopifyService.getProducts().then((products) => {
        const copy = products
        this.route.paramMap.subscribe(paramMap => {
          
            products = copy;
            this.productsGroup= []
            if (paramMap.has('id')) {
              this.collection = paramMap.get('id');
            } else {
              this.collection = 'SHOPALL';
            }
            // If we want to see all the products
            products = this.filterByTag(products, 'ACT:Matrix');
            products = this.filterByTag(products, 'VCT:1');
            products.map(p => p.img_shown = p.images[0].src);
            this.products = products;
            // If its SHOPALL we order by collections
            if (this.collection === 'SHOPALL') {
              console.log(products)
              this.orderByCategory(products)
            // otherwise we filter only the desired collection
            } else {
              products = this.filterByCollection(products, this.collection);
              this.groupProducts(products);
            }

            
            this.loading = false;

             // we set a timeout to load the elemets and start the fullpage plugin
             window.setTimeout(() => {
             
              if($('html').hasClass('fp-enabled')){
                $.fn.fullpage.destroy('all');
              }
              this.initSlider();
              (<HTMLElement>document.querySelector('#fullpage')).style.overflow = 'inherit';
            }, 100)
          
        });
      }, err => alert(err));
    })
  }

  // we make sure that the nav is black 
  ngOnInit() {
    window.addEventListener("resize", (event) => {
      const prods = this.getNumProds();
      if (prods != this.num_products){
        this.num_products = prods;
        this.loading = true;
        this.productsGroup= []
        if (this.collection === 'SHOPALL') {
          this.orderByCategory(this.products)
        // otherwise we filter only the desired collection
        } else {
          this.groupProducts(this.filterByCollection( this.products, this.collection));
        }
        this.loading = false

        window.setTimeout(() => {
          if($('html').hasClass('fp-enabled')){
            $.fn.fullpage.destroy('all');
          }
          this.initSlider();
          (<HTMLElement>document.querySelector('#fullpage')).style.overflow = 'inherit';
        }, 100)
      }
    });
  }

  // function to filter all products by collectios
  filterByCollection(products: Product[], collection: string): Product[] {
    // let coll = []
    // clone objects to make them unique, in case of product in 2 collections
    const p = products.map(a => Object.assign({}, a));
    return p.filter((product) => {
      return product.tags.some((c) => {
        return c.value === 'COL:' + collection;
      });
    });
  
  }

  // functiont o filter by tag like visble tag
  filterByTag(products: Product[], tag: string): Product[] {
    // filter by tag
    const products_tagged = products.filter((product) => {
      return product.tags.some((t) => {
        console.log(t.value === tag)
        return t.value === tag;
      });
    });
    return products_tagged;
  }

  // function to group collections 
  orderByCategory(products: Product[]):void{
    // than we group each collection a a 3 array grid
    const col_count = this.collections.length;
    let collections = this.collections.length;
    for (let i = 0; i < collections; i++) {
      // we filter by collection and oder by tag number from shopy
      this.productsGroup[i] = this.filterByCollection(products, this.collections[i + col_count - collections]);
      this.productsGroup[i] = this.orderCollection(this.productsGroup[i], this.collections[i + col_count - collections]);
      this.productsGroup[i].map(p => p.collection = this.collections[i + col_count - collections]);
      // in Tie dye we dont want to show campaign photos
      if (this.collections[i + col_count - collections] == "Tie Dye Capsule" || this.collections[i + col_count - collections] == "Sample Sale"){
        this.productsGroup[i].map(p => p.not_campaign = true);
      }
       // if there's no campaign we need 6 products en each group, otherwise 3
      
      this.num_products = this.getNumProds(); 
      // with products filter by collection and order by tag number we create 3 products array
      while (this.productsGroup[i].length > this.num_products) {
        // we put products starting from 4-7 ( 0-3) already in place in the new gruop
        this.productsGroup[i + 1] = this.productsGroup[i].splice(this.num_products, this.productsGroup[i].length);
        i++;
        collections++;
      }

      // // later addition if last gruop has two products make then 2 gruops of one products
      // if (this.productsGroup[i].length == 2 && !this.productsGroup[i][0].not_campaign){
      //   this.productsGroup[i + 1] = this.productsGroup[i].splice(1, this.productsGroup[i].length)
      //   i++;
      //   collections++;
      // }
    }
  }

  // function to create 3 grid array for single collection
  groupProducts(products: Product[]):void{
    // in Tie dye we dont want to show campaign photos
    if (this.collection == "Tie Dye Capsule" || this.collection == "Sample Sale"){
      products.map(p => p.not_campaign = true);
    }
    // if there's no campaign we need 6 products en each group, otherwise 3
    this.num_products = this.getNumProds();
    // than we gruop each collection a a 3 array grid
    let size = products.length/this.num_products;
    products.forEach(p => p.collection = this.collection);
    let p = this.orderCollection(products, this.collection)
    for (let i = 0; i < size; i++) {
      // we splice the first 3 elements still remaing in the array
      this.productsGroup[i] = p.splice(0, this.num_products);
    }

    // later addition if last gruop has two products make then 2 gruops of one products
    // const last = this.productsGroup.length -1
    // if (this.productsGroup[last].length == 2 && !this.productsGroup[last][0].not_campaign){
    //   this.productsGroup[last+1] = this.productsGroup[last].splice(1, this.productsGroup[last].length)
    // }
  }

  getNumProds(): number{
    if (screen.width > 1200)
      return 8
    if (screen.width > 760)
      return 6
    return 3
  }
 
  

  // function to order products by the tag number in shopty
  orderCollection(products: Product[], collection:string): Product[] {
    return products.sort((a,b ) => {
      let a1 = 999
      let b1 = 999
      a.tags.forEach(tag => {
        if (tag.value.substring(0, 4 + collection.length) == 'DSP:' + collection){
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          a1 = parseInt(tag.value.slice(collection.length +5)) 
        }
      });

      b.tags.forEach(tag => {
        if (tag.value.substring(0, 4 + collection.length) == 'DSP:' + collection){
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          b1 = parseInt(tag.value.slice(collection.length +5)) 
        }
      });
      return a1 - b1;
    })
  }

  // function to init full page slider and move to routed collection
  initSlider() {
    
    $('#fullpage').fullpage({
      scrollingSpeed: 1000,
      easing: 'easeInOutCubic',
      easingcss3: 'ease',
      normalScrollElements: '.cart_modal',
    });

    $('.fp-tableCell').css('vertical-align', 'top')
    
  }

  getDiscount(full_price:number, price:number ): number{
    return Math.floor((1 - (price/ full_price)) * 100);
  }

  // make sure to kill fullpage slider
  ngOnDestroy() {
    $.fn.fullpage.destroy('all');
  }

  scrollTo(numOne) {
      $.fn.fullpage.moveTo(numOne)
  }
}
