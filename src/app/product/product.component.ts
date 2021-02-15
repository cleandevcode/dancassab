import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Location } from "@angular/common"
import { Product, ShopifyService, LineItem, GlobalService, Stock } from "./../shared";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { debounce } from "../shared/decorators/debounce.decorator";
import { TranslateService } from "@ngx-translate/core";
import * as moment from 'moment';
import { decode } from 'js-base64';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit, OnDestroy {
  sub: any;
  title: any;
  variantSelection: string[] = [];
  variantMaterial: string[] = [];
  variantColor: string[] = [];
  variantSize: string[] = [];
  variantSizeFlag: any[] = [];
  variants: Product[] = [];
  productImages: any = [];
  variant;
  sizeIndex = 0;
  price = "";
  compareAtPrice = "";
  loading = true;
  fullPage = false;
  productInput: Product;
  product: Product;
  products: Product[] = [];
  related_products: Product[] = [];
  sliderCursor: number = 1;
  sliderPosition: string = "translateX(0px)";
  width = 0;
  filter: string;
  mobile = false;
  windowWidth: number;
  showfull = false;
  chartModal = false;
  stockModal = false;
  showRelated = false;
  full_img: string;
  collection: string;
  slick: any;
  des = false;
  preorder: any;
  productColor: any;
  productMat: any;
  stock: boolean;
  s_variants: any;
  s_p_id: string;
  s_v_id: string;
  s_email = '';
  s_error = false;
  s_text: any;
  s_quantity: any;
  s_res: any;
  s_add_mailing = true;
  stockLoading = false;
  browser: any;
  colorIdx = 0;
  colorVNM: string;
  grpCol: string;
  sku: string;
  sizeData: any;
  sizeResult: any;
  sizeChartsData: any;
  countryInfo: any;
  err_message: any;

  slideConfig = {
    "slidesToShow": 1, "slidesToScroll": 1, "dots": true, "infinite": true, "prevArrow": false,
    "nextArrow": false
  };
  form = new FormGroup({
    variant: new FormControl([]),
    quantity: new FormControl(1),
  });

  constructor(
    private shopifyService: ShopifyService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private deviceService: DeviceDetectorService,
    private location: Location,
    private http: HttpClient,
  ) {
    let country = this.translate.store.currentLang;
    if (country == undefined) {
      country = 'es'
    }
    this.countryInfo = JSON.parse(localStorage.getItem('country'));

    moment.locale(country);
    this.stock = true;
    this.s_text = '';
    let temp = this.deviceService.os;
    if (temp === 'iOS') {
      this.browser = true;
    } else if (temp === 'Mac') {
      this.browser = true
    } else {
      this.browser = false
    }

    this.err_message = "";
    this.http.get('https://dancassabpublicassets.s3.amazonaws.com/sizingChart.csv', { responseType: 'text' }).subscribe(res => {
      if (res) {
        this.sizeData = this.toJson(res);
      }
    }, error => {
      this.err_message = JSON.parse(localStorage.getItem('country')) === "Mexico" ? "Error de lectura. Informaci&oacute;n de tallas no disponible." : "Read error. Size information not available.";
    })
  }

  @HostListener("wheel", ["$event"])
  @debounce()
  onWheelScroll(e: WheelEvent) {
    if (this.windowWidth > 600 && !this.showfull) {
      //slide down
      if (e.deltaY > 0) {
        if (this.showRelated) {
          this.slick.slick("slickPrev");
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
          this.slick.slick("slickNext");
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
    this.reset();
    this.windowWidth = window.outerWidth;
    this.sub = this.route.queryParams.subscribe((params) => {
      //we get the title from paramas to filter products by that title
      this.title = params["title"];
      const collection = "COL:" + params["collection"];
      this.grpCol = params["group"];
      this.colorVNM = params["color"];
      this.colorIdx = params["index"];
      this.collection = params["collection"];
      //We use the service to get products
      this.shopifyService.setClient().then((res) => {
        this.shopifyService
          .getProducts()
          .then((products) => {
            //filter by collection

            products = this.filterOutTag(products, "ACT:Matrix");
            if (params["collection"] === "SHOPALL") {
              let temp = products.filter((p) => p.title == this.title)[0];
              this.products = this.filterByCollection(products, temp.tags[0].value)
            } else {
              this.products = this.filterByCollection(products, collection);
            }
            this.setRelated([...this.products]);
            //filter by name
            this.products = this.products.filter((p) => p.title == this.title);

            // if there are no products go to home (error handeler)
            if (this.products.length == 0) {
              this.router.navigate(["/home"]);
            }
            // we set the current product to the first one in the array
            if (this.grpCol === undefined) this.grpCol = 'GRP:SHOPALL_1'
            this.products = this.filterByTags(this.products, this.grpCol);
            this.products = this.orderByTag(this.products, params["collection"])
            let temp = this.filterByTags(this.products, this.colorVNM);

            this.product = temp[0];
            if (this.err_message == '') {
              this.sizeChartsData = this.getKeyByMultiValue(this.sizeData, this.product);
              this.setSizeChartData(0);
            }

            this.getVariantsByID(this.product);
            this.productColor = this.getProductColor(this.product);
            this.productMat = this.getProductMat(this.product)
            this.preorder = this.getPreorderDate(this.product);

            this.getVariants(this.products);

            this.setImages(this.product);
            this.variant = this.product.variants[0];
            // form the product array we construct the variants color and materials
            this.price = this.product.variants[0].price;
            if (this.product.variants[0].compareAtPrice) {
              this.compareAtPrice = this.product.variants[0].compareAtPrice;
            }
            this.full_img = this.productImages[0].src;
            this.loading = false;

            // window.setTimeout(() => {
            //   $(".main-slider").touchwipe({
            //     wipeLeft: () => {
            //       this.moveSlider(this.sliderCursor + 1);
            //     },
            //     wipeRight: () => {
            //       this.moveSlider(this.sliderCursor - 1);
            //     },
            //     min_move_x: 20,
            //     min_move_y: 20,
            //     preventDefaultEvents: false,
            //   });
            // }, 100);
          })
          .catch((err) => console.log(err));
      });
    });
    $(".main_slider").slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: false,
      nextArrow: false
    });
  }
  slickInit(e) {
    console.log('slick initialized');
  }

  toJson(csv: any) {
    const lines = csv.split('\n')
    const result = []
    const headers = lines[0].split(',')

    lines.map(l => {
      const obj = {}
      const line = l.split(',')

      headers.map((h, i) => {
        obj[h] = line[i]
      })

      result.push(obj)
    })
    // console.log("#####->", this.sizeData)

    return result;
  }
  // function to filter all products by collectios
  filterByCollection(products: Product[], collection: string): Product[] {
    return products.filter((product) => {
      return product.tags.some((c) => {
        return c.value == collection;
      });
    });
  }

  orderByTag(products: Product[], collection: string): Product[] {
    let colLen = collection.length;
    return products.sort((a, b) => {
      let a1 = 999;
      let b1 = 999;
      a.tags.forEach((tag) => {
        if (tag.value.substring(0, 4 + colLen) == "VCT:" + collection) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          a1 = parseInt(tag.value.slice(5 + colLen));
        }
      });

      b.tags.forEach((tag) => {
        if (tag.value.substring(0, 4 + colLen) == "VCT:" + collection) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          b1 = parseInt(tag.value.slice(5 + colLen));
        }
      });
      return a1 - b1;
    });
  }

  filterByTags(products: Product[], collection: string) {
    const p = products.map((a) => Object.assign({}, a));
    return p.filter((product) => {
      return product.tags.some((c) => {
        return c.value === collection
      })
    })
  }

  setImages(product: Product) {
    // we remove the switch image
    this.productImages = [...product.images];
    this.productImages.pop();
  }

  // functiont o filter by tag like visble tag
  filterOutTag(products: Product[], tag: string): Product[] {
    // filter by tag
    const products_tagged = products.filter((product) => {
      let found = false;
      product.tags.forEach((t) => {
        if (t.value === tag) found = true;
      });
      return !found;
    });
    return products_tagged;
  }


  setSizeUnit(string: string) {
    return string.split("-")[1];
  }

  setSizeChartData(selection: any) {
    this.sku = this.product.variants[selection].sku;
    this.sizeResult = this.getKeyByValue(this.sizeData, this.sku);
  }

  ngAfterContentChecked() {
    let country = this.translate.store.currentLang;
    moment.locale(country);
  }

  getPreorderDate(product: Product) {
    let temp = "";
    product.tags.forEach((tag) => {
      if (tag.value.substring(0, 9) == "PREORDER:") {
        temp = tag.value.slice(9)
      }
    })
    let date_temp = temp.substring(0, 4) + "-" + temp.substring(4, 6) + "-" + temp.substring(6, 8);
    console.log(date_temp);

    var date = moment(date_temp).format('MMMM D, YYYY');
    return temp.substring(0, 4) === "NULL" ? null : date;
  }

  getProductColor(product: Product) {
    let index = JSON.parse(localStorage.getItem('country')) === "Mexico" ? "VNS:" : "VNM:";
    let temp = "";
    product.tags.forEach((el) => {
      if (el.value.indexOf(index) > -1) {
        temp = el.value
      }
    })
    return temp.substring(4)
  }

  setProductColor(color: string) {
    let index = JSON.parse(localStorage.getItem('country')) === "Mexico" ? "VNS:" : "VNM:";
    return index + color
  }

  getKeyByValue(object: any, value: any) {
    let result: any;
    object.forEach(element => {
      if (element.SKU == value) {
        result = element;
      }
    });
    return result;
  }

  getKeyByMultiValue(object: any, value: Product) {
    let result = [];
    value.variants.map(ele => {
      object.map(element => {
        if (element.SKU == ele.sku) {
          result.push(element);
        }
      });
    });
    return result;
  }

  getProductMat(product: Product) {
    let index = JSON.parse(localStorage.getItem('country')) === "Mexico" ? "MTS:" : "MAT:";
    let temp = "";
    product.tags.forEach((el) => {
      if (el.value.indexOf(index) > -1) {
        temp = el.value
      }
    })
    return temp.substring(4)
  }

  // function to filter all products by collectios
  getVariants(products: Product[]) {
    let index = JSON.parse(localStorage.getItem('country')) === "Mexico" ? "MTS:" : "MAT:";
    products.forEach((product) => {
      const color = product.images[product.images.length - 1].src;
      this.variantColor.indexOf(color) === -1 && this.variantColor.push(color);
      product.tags.forEach((tag) => {
        if (tag.value.substring(0, 3) == index) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          const material = tag.value.substring(4);
          // if material not in array push
          this.variantMaterial.indexOf(material) === -1 &&
            this.variantMaterial.push(material);
        }
      });
    });

    //We read the sizes form the variants in teh products
    this.product.variants.forEach((v) => {
      let options = v.title.split("/", 3);
      //We push each one in a new array
      if (!this.variantSize.includes(options[0]))
        this.variantSize.push(options[0]);
    });
    // aux from selected css class
    this.variantSelection[0] = this.variantMaterial[0];
    this.variantSelection[1] = this.variantColor[this.colorIdx];
    this.variantSelection[2] = this.variantSize[0];
    for (let index = 0; index < 5 - this.variantSize.length; index++) {
      this.variantSizeFlag.push(index)
    }
    //we set the variant that goes to cart to the first variant as default
    //on current model only actual shopify variant is the size
    this.variant = this.product.variants[0];
  }

  //Function to updated the variants by user selection
  selectVariant(index, selection, variantIdx) {
    let indexLang = JSON.parse(localStorage.getItem('country')) === "Mexico" ? "MTS:" : "MAT:";
    switch (index) {
      case 0:
        // get only the products with the material
        const filter_material = this.products.filter((p) => {
          return p.tags.some((tag) => tag.value == indexLang + selection);
        });
        // try set new product try to match with color
        let match = false;
        filter_material.forEach((p) => {
          if (p.images[p.images.length - 1].src == this.variantSelection[1]) {
            this.product = p;
            match = true;
          }
        });
        //if didnt match set to index 0 and update color
        if (!match) {
          this.product = filter_material[0];
          this.variantSelection[1] = this.product.images[
            this.product.images.length - 1
          ].src;
        }

        // set the sizes of new prod
        this.setMatchingsSizes();
        // for css active class
        this.variantSelection[index] = selection;
        break;

      case 1:
        const filter_color = this.products.filter((p) => {
          return p.images[p.images.length - 1].src == selection;
        });
        this.product = filter_color[0];
        this.getVariantsByID(this.product);
        // set new product try to match with MAT
        // const tag = "MAT:" + this.variantSelection[0];
        // let match2 = false;
        // filter_color.forEach((p) => {
        //   if (this.checkTag(p, tag)) {
        //     this.product = p;
        //     match2 = true;
        //   }
        // });
        this.productColor = this.getProductColor(this.product)
        this.productMat = this.getProductMat(this.product)
        //if didnt match update material
        // if (!match2) {
        //   this.product = filter_color[0];
        //   // loop tags to find the material and set our variable to that material
        //   this.product.tags.forEach((tag) => {
        //     if (tag.value.substring(0, 3) == "MAT") {
        //       this.variantSelection[0] = tag.value.substring(4);
        //     }
        //   });
        // }

        // set the sizes of new prod
        this.setMatchingsSizes();
        // for css active class
        this.variantSelection[index] = selection;
        this.colorIdx = variantIdx;
        this.colorVNM = this.setProductColor(this.productColor)

        this.location.go(`/product?collection=${this.collection}&title=${this.title}&group=${this.grpCol}&color=${this.colorVNM}&index=${this.colorIdx}`)
        break;

      case 2:
        // save the size index is the only true variant
        this.sizeIndex = selection;
        this.setSizeChartData(selection);
        // for css active class
        this.variantSelection[index] = this.variantSize[this.sizeIndex];
        break;
    }
    // set the price to new product with size variant and images
    this.variant = this.product.variants[this.sizeIndex];
    this.price = this.product.variants[this.sizeIndex].price;
    if (this.product.variants[this.sizeIndex].compareAtPrice) {
      this.compareAtPrice = this.product.variants[
        this.sizeIndex
      ].compareAtPrice;
    } else {
      this.compareAtPrice = '';
    }
    this.setImages(this.product);
  }

  // function to set new product with mat and color matching
  setMatchingProduct(products: Product[], tag: string): boolean {
    // we set matching flag to false
    let match = false;
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
      this.product = products[0];
    }
    // return flag to handle unmatch
    return match;
  }

  // set  matching size of selected produ
  setMatchingsSizes() {
    this.variantSize = [];
    this.product.variants.forEach((v) => {
      let options = v.title.split("/", 3);
      //We push each one in a new array
      if (!this.variantSize.includes(options[0]))
        this.variantSize.push(options[0]);
    });
    if (this.sizeIndex < this.variantSize.length) {
      this.variantSelection[2] = this.variantSize[this.sizeIndex];
    } else {
      this.variantSelection[0] = this.variantSize[0];
    }
  }

  // function to open close description
  toggle() {
    this.des = !this.des;
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
    if (
      !this.translate.store.currentLang ||
      this.translate.store.currentLang == "en"
    ) {
      $(".switch").addClass(" switch_en");
    }
    $(".sizes_table2").slideToggle();
  }

  // init fullpage plugin
  initFullPage() {
    $("#fullpage").fullpage({
      scrollingSpeed: 1000,
      easing: "easeInOutCubic",
      easingcss3: "ease",
      normalScrollElements: ".cart_modal",
    });
    this.fullPage = true;
  }

  // open and close sizes modal
  openModal() {
    window.scrollTo(0, 0);
    $("body").addClass("modal-open");
    $(".modal").fadeIn();
  }

  // close modal sizes
  closeModal() {
    $(".modal").fadeOut();
    $("body").removeClass("modal-open");
  }

  // for sizes modal in and cm toggle
  toggleTable() {
    if ($("#switch-sizes").prop("checked")) {
      $(".table-cm").fadeOut(1);
      $(".table-in").fadeIn();
    } else {
      $(".table-in").fadeOut(1);
      $(".table-cm").fadeIn();
    }
  }

  // change big image on click
  changeImage(img) {
    let prev = $("#feature_img").attr("src");
    $("#feature_img").attr("src", img.target.src);
    $(img.target).attr("src", prev);
  }

  // add item to the cart using our service
  onSubmit() {
    const lineItem = new LineItem(this.variant, 1, this.product.title, this.preorder);
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
      this.slick = $(".related_slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    });
  }

  setRelated(products: Product[]): void {
    this.related_products = products.filter((product) => {
      return product.tags.some((c) => {
        return c.value === "VCT:1";
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
  }

  // function to move slider for product images
  moveSlider(position): void {
    if (position == 0) {
      position = this.productImages.length;
    }
    if (position == this.productImages.length + 1) {
      position = 1;
    }
    let sliderContainerWidth = document.getElementById("feature_img")
      .offsetWidth;

    if (position > 1) {
      this.sliderPosition = `translateX(-${(position - 1) * sliderContainerWidth
        }px)`;
    } else {
      this.sliderPosition = "translateX(0px)";
    }
    this.full_img = this.productImages[position - 1].src;
    this.sliderCursor = position;
  }

  getDecodedID(ID: any) {
    const temp = decode(ID).split("/");
    return temp[temp.length - 1];
  }

  getVariantsByID(product: Product) {
    this.stockLoading = true;
    this.s_variants = this.product.variants;
    this.s_p_id = this.getDecodedID(product.id)

    if (this.s_variants[0].available === false) {
      this.s_quantity = 0;
      this.stock = false;
    } else {
      this.stock = true;
    }
    this.s_v_id = this.getDecodedID(this.s_variants[0].id);

    this.stockLoading = false;

  }

  notifyMe() {
    this.s_error = false;
    this.s_text = '';
    console.log("productID->", this.s_p_id);
    console.log('Variant ID->', this.s_v_id);
    console.log("email->", this.s_email);
    console.log("mailing->", this.s_add_mailing)
    this.shopifyService.notifyMe(this.s_p_id, this.s_v_id, this.s_email, this.s_add_mailing).subscribe((res) => {
      this.s_res = res;
      if (this.s_res.status === "Error") {
        this.s_error = true
        this.s_text = Object.values(this.s_res.errors)[0]
      } else if (this.s_res.status === "OK") {
        this.s_error = false;
        this.s_text = this.s_res.message;
      }
    }, error => {
      console.log("notify error->", error)
    })
  }

  changeVariant(e: any) {
    this.s_v_id = e;
  }

  changeVariantMail(e: any) {
    this.s_add_mailing = e;
  }

  onChangeEmail(e: any) {
    console.log("on change email->", e)
    this.s_email = e.target.value
  }

  ngOnDestroy() { }
}
