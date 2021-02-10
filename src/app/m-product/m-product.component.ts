import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Product, ShopifyService, LineItem, GlobalService } from './../shared';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounce } from '../shared/decorators/debounce.decorator';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;


@Component({
  selector: 'app-m-product',
  templateUrl: './m-product.component.html',
  styleUrls: ['./m-product.component.scss']
})
export class MProductComponent implements OnInit {
  sub: any;
  title: any;
  variantSelection: string[] = []
  variantMaterial: string[] = []
  variantColor: string[] = []
  variantSize: string[] = []
  variants: Product[] = []
  productImages: any = []
  variant;
  sizeIndex = 0;
  price = '';
  compareAtPrice = '';
  loading = true;
  fullPage = false;
  productInput: Product;
  product: Product;
  products: Product[] = [];
  related_products: Product[] = [];
  sliderCursor: number = 1
  sliderPosition: string = 'translateX(0px)'
  width = 0
  filter: string;
  mobile = false;
  windowWidth: number;
  showfull = false;
  showRelated = false;
  full_img: string;
  collection: string;
  slick: any;
  des = false;

  form = new FormGroup({
    variant: new FormControl([]),
    quantity: new FormControl(1),
  });

  constructor(
    private shopifyService: ShopifyService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }


  @HostListener('wheel', ['$event'])
  @debounce()
  onWheelScroll(e: WheelEvent) {
    if (this.windowWidth > 600 && !this.showfull) {
      //slide down
      if (e.deltaY > 0) {
        if (this.showRelated) {
          this.slick.slick('slickPrev');
        } else {
          this.sliderCursor--;

          if (this.sliderCursor < 1) {
            this.sliderCursor = this.productImages.length;
          }
          this.moveSlider(this.sliderCursor);
        }
        // slide up
      } else {
        if (this.showRelated) {
          this.slick.slick('slickNext');
        } else {
          this.sliderCursor++;
          if (this.sliderCursor > this.productImages.length) {
            this.sliderCursor = 1;
          }
          this.moveSlider(this.sliderCursor);
        }
      }
    }
  }

  ngOnInit() {
    $(".cart_button, .navbar_item, .navbar_item a, .navbar_logo, .navbar-mobile_item, .cart_modal-content-text, .cart_modal-content-variant, .cart_modal-content-price, .cart_modal-content-remove, .cart_modal-close").addClass('green');
    $(".ticker-wrap").css("display", "none");
    $(".cart_button").css("border", "1px solid #91FF00");
    $(".dis").css({ "cursor": "not-allowed", "text-decoration": "line-through", "pointer-events": "none" });
    $(".navbar_logo").css({ "cursor": "not-allowed", "pointer-events": "none" });
    $(".navbar-mobile, .navbar-mobile_content, .cart_modal-content").css({ "color": "#91FF00", "background-color": "#000" });
    $(".cart_modal-content").css({ "border": "1px solid #91FF00", "background-color": "#000" });
    $(".checkout_btn").css({ "color": "#000", "background-color": "#91FF00" });
    this.reset()
    this.windowWidth = window.outerWidth;
    this.sub = this.route.params.subscribe((params) => {
      //we get the title from paramas to filter products by that title
      const title = params['title'];
      const collection = 'COL:' + params['collection'];
      this.collection = params['collection'];
      //We use the service to get products 
      this.shopifyService.setClient().then((res) => {
        this.shopifyService.getProducts().then((products) => {
          //filter by collection
          products = this.filterByTag(products, 'ACT:Matrix');
          this.products = this.filterByCollection(products, collection)
          this.setRelated([...this.products])
          //filter by name
          this.products = this.products.filter(p => p.title == title)

          // if there are no products go to home (error handeler)
          if (this.products.length == 0) {
            this.router.navigate(['/home'])
          }
          this.orderByTag();
          // we set the current product to the first one in the array 
          this.product = this.products[0];
          this.setImages(this.product)
          this.variant = this.product.variants[0]
          // form the product array we construct the variants color and materials
          this.getVariants(this.products)
          this.price = this.product.variants[0].price;
          if (this.product.variants[0].compareAtPrice) {
            this.compareAtPrice = this.product.variants[0].compareAtPrice;
          }
          this.full_img = this.productImages[0].src
          this.loading = false;

          window.setTimeout(() => {
            $(".slider").touchwipe({
              wipeLeft: () => { this.moveSlider(this.sliderCursor + 1) },
              wipeRight: () => { this.moveSlider(this.sliderCursor - 1) },
              min_move_x: 20,
              min_move_y: 20,
              preventDefaultEvents: false
            });
            if (!this.translate.currentLang || this.translate.currentLang == 'en') {
              $('.switch').addClass('switch_en');
            }
          }, 100)
        }).catch(err => console.log(err));
      });
    })
  }

  // function to filter all products by collectios
  filterByCollection(products: Product[], collection: string): Product[] {
    return products.filter(product => {
      return product.tags.some((c) => {
        return c.value === collection;
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


  setImages(product: Product) {
    // we remove the switch image
    this.productImages = [...product.images]
    this.productImages.pop();
  }

  orderByTag() {
    this.products.sort((a, b) => {
      let a1 = 999
      let b1 = 999
      a.tags.forEach(tag => {
        if (tag.value.substring(0, 4) == 'VCT:') {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          a1 = parseInt(tag.value.slice(4))
        }
      });

      b.tags.forEach(tag => {
        if (tag.value.substring(0, 4) == 'VCT:') {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          b1 = parseInt(tag.value.slice(4))
        }
      });
      return a1 - b1;
    })
  }

  // function to filter all products by collectios
  getVariants(products: Product[]) {
    products.forEach(product => {
      const color = product.images[product.images.length - 1].src
      this.variantColor.indexOf(color) === -1 && this.variantColor.push(color)
      product.tags.forEach(tag => {
        if (tag.value.substring(0, 3) == 'MAT') {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          const material = tag.value.substring(4)
          // if material not in array push
          this.variantMaterial.indexOf(material) === -1 && this.variantMaterial.push(material);
        }
      })
    });

    //We read the sizes form the variants in teh products
    this.product.variants.forEach(v => {
      let options = v.title.split('/', 3)
      //We push each one in a new array
      if (!this.variantSize.includes(options[0])) this.variantSize.push(options[0])
    });
    // aux from selected css class 
    this.variantSelection[0] = this.variantMaterial[0]
    this.variantSelection[1] = this.variantColor[0]
    this.variantSelection[2] = this.variantSize[0]
    //we set the variant that goes to cart to the first variant as default 
    //on current model only actual shopify variant is the size
    this.variant = this.product.variants[0]
  }

  //Function to updated the variants by user selection
  selectVariant(index, selection) {
    switch (index) {
      case 0:
        // get only the products with the material
        const filter_material = this.products.filter(p => {
          return p.tags.some(tag => tag.value == 'MAT:' + selection)
        })
        // try set new product try to match with color
        let match = false;
        filter_material.forEach(p => {
          if (p.images[p.images.length - 1].src == this.variantSelection[1]) {
            this.product = p;
            match = true;
          }
        })
        //if didnt match set to index 0 and update color
        if (!match) {
          this.product = filter_material[0]
          this.variantSelection[1] = this.product.images[this.product.images.length - 1].src
        }

        // set the sizes of new prod
        this.setMatchingsSizes()
        // for css active class
        this.variantSelection[index] = selection
        break;

      case 1:
        const filter_color = this.products.filter(p => {
          return p.images[p.images.length - 1].src == selection
        })
        // set new product try to match with MAT 
        const tag = 'MAT:' + this.variantSelection[0]
        let match2 = false;
        filter_color.forEach(p => {
          if (this.checkTag(p, tag)) {
            this.product = p;
            match2 = true
          }
        })

        //if didnt match update material 
        if (!match2) {
          this.product = filter_color[0]
          // loop tags to find the material and set our variable to that material
          this.product.tags.forEach(tag => {
            if (tag.value.substring(0, 3) == 'MAT') {
              this.variantSelection[0] = tag.value.substring(4);
            }
          })
        }

        // set the sizes of new prod
        this.setMatchingsSizes()
        // for css active class    
        this.variantSelection[index] = selection
        break;


      case 2:
        // save the size index is the only true variant
        this.sizeIndex = selection
        // for css active class
        this.variantSelection[index] = this.variantSize[this.sizeIndex]
        break;
    }
    // set the price to new product with size variant and images
    this.variant = this.product.variants[this.sizeIndex]
    this.price = this.product.variants[this.sizeIndex].price;
    if (this.product.variants[this.sizeIndex].compareAtPrice) {
      this.compareAtPrice = this.product.variants[this.sizeIndex].compareAtPrice;
    }
    this.setImages(this.product);
  }

  // function to set new product with mat and color matching
  setMatchingProduct(products: Product[], tag: string): boolean {
    // we set matching flag to false
    let match = false
    // loop the array and look for the matching tag
    for (let p of products) {

      // if we find tag set product and break
      if (this.checkTag(p, tag)) {
        this.product = p;
        match = true;
        break;
      }
    }
    // if we didnt match color and material just set to first product in array
    if (!match) {
      this.product = products[0]
    }
    // return flag to handle unmatch
    return match
  }

  // set  matching size of selected produ
  setMatchingsSizes() {
    this.variantSize = [];
    this.product.variants.forEach(v => {
      let options = v.title.split('/', 3)
      //We push each one in a new array
      if (!this.variantSize.includes(options[0])) this.variantSize.push(options[0])
    });
    if (this.sizeIndex < this.variantSize.length) {
      this.variantSelection[2] = this.variantSize[this.sizeIndex];
    } else {
      this.variantSelection[0] = this.variantSize[0];
    }
  }

  // function to open close description
  toggle() {
    this.des = !this.des
    $("p").css("color", "#91FF00")
    $("#drop").slideToggle();
    if (this.des) {
      $(".related_text").fadeToggle(100);
    } else {
      window.setTimeout(() => {
        $(".related_text").fadeToggle(100);
      }, 200);
    }
  }

  // function to open close sizes table
  toggleSizes() {
    $(".sizes_table2").slideToggle();
  }

  // init fullpage plugin
  initFullPage() {
    $('#fullpage').fullpage({
      scrollingSpeed: 1000,
      easing: 'easeInOutCubic',
      easingcss3: 'ease',
      normalScrollElements: '.cart_modal',

    });
    this.fullPage = true;
  }

  // open and close sizes modal
  openModal() {
    window.scrollTo(0, 0)
    $("body").addClass("modal-open");
    $('.modal').fadeIn();
  }

  // close modal sizes
  closeModal() {
    $('.modal').fadeOut();
    $("body").removeClass("modal-open")
  }

  // for sizes modal in and cm toggle
  toggleTable() {
    if ($('#switch-sizes').prop('checked')) {
      $('.table-cm').fadeOut(1);
      $('.table-in').fadeIn();
    } else {
      $('.table-in').fadeOut(1);
      $('.table-cm').fadeIn();
    }
  }



  // change big image on click 
  changeImage(img) {
    let prev = $('#feature_img').attr('src');
    $('#feature_img').attr('src', img.target.src)
    $(img.target).attr('src', prev);
  }




  // add item to the cart using our service
  onSubmit() {
    const lineItem = new LineItem(this.variant, 1, this.product.title, null);
    this.globalService.addToCart(lineItem);
  }


  // funtion to check if its preoder 
  checkTag(product: Product, tag: string): boolean {
    return product.tags.some((t) => {
      return t.value === tag;
    });
  }

  // for mobile we have a hidden div
  toggleRelated() {
    $(".1").fadeToggle();
    this.showRelated = !this.showRelated;
    window.setTimeout(() => {
      this.slick = $('.related_slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }]
      });
    })
  }

  setRelated(products: Product[]): void {
    this.related_products = products.filter(product => {
      return product.tags.some((c) => {
        return c.value === 'VCT:1';
      });
    });
  }

  reset() {
    this.loading = true;
    this.showRelated = false;
    $(".1").css("display", "block");
    this.products = [];
    this.variantSelection = [];
    this.variantMaterial = [];
    this.variantColor = [];
    this.variantSize = [];
    this.variants = [];
    this.productImages = [];
  };

  // function to move slider for product images
  moveSlider(position): void {
    if (position == 0) {
      position = this.productImages.length
    }
    if (position == this.productImages.length + 1) {
      position = 1
    }
    let sliderContainerWidth = document.getElementById('feature_img').offsetWidth;

    if (position > 1) {
      this.sliderPosition = `translateX(-${(position - 1) * sliderContainerWidth}px)`
    } else {
      this.sliderPosition = 'translateX(0px)'
    }
    this.full_img = this.productImages[position - 1].src;
    this.sliderCursor = position
  }

  ngOnDestroy() {

  }

}
