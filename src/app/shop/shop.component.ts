import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopifyService, Product } from "./../shared";
import { ActivatedRoute } from "@angular/router";
declare var $: any;

@Component({
  selector: "app-shop",
  templateUrl: "./shop.component.html",
  styleUrls: ["./shop.component.scss"],
})
export class ShopComponent implements OnInit, OnDestroy {
  section: any;
  loadedSection: any;
  openCart = true;
  shopTitle: string;
  scroll: any;
  collection: string;
  // we group the items in array containg a 3 array of products for display
  productsGroup: Array<Product[]> = [];
  products: Product[] = [];
  products_color: Product[] = [];
  products_swatches: Product[] = [];
  product: Product;
  loading = true;
  num_products: number;
  overlap: false;
  selectedTitle: string;
  pazURL: string;
  // this array is to match the collection tag with the shopify collections we want to display
  collections = [
    "The Icons",
    "NEWIN",
    "JACKETS",
    "TOPS",
    // "BOTTOMS",
    "Accessories",
    // "COLLAB"
  ];
  results: any;

  constructor(
    private shopifyService: ShopifyService,
    private route: ActivatedRoute
  ) {
    // we get all the products for te shopty API
    this.shopifyService.setClient().then((res) => {
      this.shopifyService.getProducts().then(
        (products) => {
          const copy = products;
          this.route.paramMap.subscribe((paramMap) => {
            if (paramMap.has("id")) {
              products = copy;
              this.productsGroup = [];
              this.collection = paramMap.get("id");
              // If we want to see all the products
              products = this.filterOutTag(products, "ACT:Matrix");
              this.products_color = products;
              // products = this.filterByTag(products, "VCT:1");
              products.map((p) => (p.img_shown = p.images && p.images.length > 0 && p.images[0].src && p.images[0].src));

              this.products = products;


              //filter by collection
              products = this.filterByCollection(products, this.collection);
              //grouping
              products = this.filterByGroup(products, this.collection);
              //order
              products = this.orderCollection(products, this.collection);
              this.products_swatches = products;

              this.results = products;

              // if (this.collection === "SHOPALL") {
              //   // this.orderByCategory(products);
              //   this.results = this.orderCollection(products, this.collection);
              //   this.results.map(
              //     (p) => (p.collection = this.collection)
              //   );
              //   console.log("reuslts->", this.results)
              //   // otherwise we filter only the desired collection
              // } else {
              //   products = this.filterByCollection(products, this.collection);
              //   this.groupProducts(products);
              //   // this.results = this.orderCollection(temp, this.collection);
              // }


              this.loading = false;

              // we set a timeout to load the elemets and start the fullpage plugin
              window.setTimeout(() => {
                if ($("html").hasClass("fp-enabled")) {
                  $.fn.fullpage.destroy("all");
                }
                this.initSlider();
                // (<HTMLElement>(
                //   document.querySelector("#fullpage1")
                // )).style.overflow = "inherit";
              }, 100);
            }
          });
        },
        (err) => alert(err)
      );
    });
  }

  // we make sure that the nav is black
  ngOnInit() {
    this.pazURL = JSON.parse(localStorage.getItem('country')) === "Mexico" ? "/product?collection=TOPS&title=Paz&group=GRP:TOPS_1&color=VNS:GRIS%20VERDE&index=0" : "/product?collection=TOPS&title=Paz&group=GRP:TOPS_1&color=VNM:GREY%20GREEN&index=0"
  }

  checkOverlap(status, title) {
    this.overlap = status;
    this.selectedTitle = title;
  }

  orderByTag(products: Product[], collection: string) {
    let colLen = collection.length;
    return products.sort((a, b) => {
      let a1 = 999;
      let b1 = 999;
      a.tags.forEach((tag) => {
        if (tag.value.substring(0, 5 + colLen) == ("VCT:" + this.collection + "_")) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          a1 = parseInt(tag.value.slice(5 + colLen));
        }
      });

      b.tags.forEach((tag) => {
        if (tag.value.substring(0, 5 + colLen) == ("VCT:" + this.collection + "_")) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          b1 = parseInt(tag.value.slice(5 + colLen));
        }
      });
      return a1 - b1;
    });
  }

  orderByCollectionTag(products: Product[], collection: string) {
    return products.sort((a, b) => {
      let a1 = 999;
      let b1 = 999;
      a.tags.forEach((tag) => {
        if (tag.value.substring(0, 4 + collection.length) == "VCT:" + collection) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          a1 = parseInt(tag.value.slice(collection.length + 5));
        }
      });

      b.tags.forEach((tag) => {
        if (tag.value.substring(0, 4 + collection.length) == "VCT:" + collection) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          b1 = parseInt(tag.value.slice(collection.length + 5));
        }
      });
      return a1 - b1;
    });
  }

  getVariants(product: Product[]) {
    let result = [];
    let tempo = [];
    const title = product["title"];
    const collection = "COL:" + product["collection"];

    let temp = collection === "COL:SHOPALL" ? this.products_color : this.filterByCollection_color(this.products_color, collection);

    let temp_products = temp.filter((p) => p.title == title);
    tempo = this.orderByTag(temp_products, this.collection);
    // temp.sort(function (a: any, b: any) {
    //   return a.id - b.id;
    // });
    tempo.forEach((product) => {
      // if (result.length > 2) return false;
      const color = product.images[product.images.length - 1].src;
      result.indexOf(color) === -1 && result.push(color);
    });
    return {
      products: temp_products,
      colors: result,
    };
  }

  getSwatches(product: Product) {
    let tag = "";
    let results = [];
    product.tags.forEach((c) => {
      if (c.value.includes("GRP:" + this.collection + "_")) {
        tag = c.value
      }
    })
    this.products_swatches.forEach((p) => {
      p.tags.some((c) => {
        if (c.value == tag && product.title == p.title) {
          const color = p.images[p.images.length - 1].src;
          results.indexOf(color) === -1 && results.push(color);
        }
      })
    });
    return results;
  }

  getTag(product: Product, tagName: string, index: number) {
    let result = "";
    product.tags.forEach((tag) => {
      if (tag.value.substring(0, index) === tagName) {
        result = tag.value.slice(index)
      }
    })
    return result
  }

  // function to filter all products by collectios
  filterByCollection(products: Product[], collection: string): Product[] {
    // let coll = []
    // clone objects to make them unique, in case of product in 2 collections
    products.forEach((p) => (p.collection = this.collection));
    const p = products.map((a) => Object.assign({}, a));
    return p.filter((product) => {
      return product.tags.some((c) => {
        // if (c.value.substring(0, 4) === 'COL:'){
        //   if (coll.indexOf(c.value) == -1 ){
        //     coll.push(c.value)
        //   }
        // }
        return c.value === "COL:" + collection;
      });
    });
  }

  getProductColor(product: Product) {
    let index = JSON.parse(localStorage.getItem('country')) === "Mexico" ? "VNS:" : "VNM:";
    let temp = "";
    product.tags.forEach((el) => {
      if (el.value.indexOf(index) > -1) {
        temp = el.value
      }
    })
    return temp;
  }

  //filter by group
  filterByGroup(products: Product[], collection: string) {

    let resultPro = [];
    let result = products.reduce(function (r, a) {
      r[a.title] = r[a.title] || [];
      r[a.title].push(a);
      return r;
    }, Object.create(null));
    const groupProducts = Object.values(result)
    let col = "GRP:" + collection + "_";
    groupProducts.forEach((products: any) => {
      const arrGrp = [];
      const arrSwatches = [];
      const tempProductIndex = [];
      let loop = 0;
      products = this.orderByTag(products, this.collection)
      products.forEach((product: any) => {
        product.tags.forEach((c) => {
          if (c.value.includes(col)) {
            arrSwatches.push({
              "grp": c.value,
              "src": product.images[product.images.length - 1].src,
              "vnm": this.getProductColor(product)
            })
            if (!arrGrp.includes(c.value)) {
              arrGrp.push(c.value);
              tempProductIndex.push({ "grp": c.value, "index": loop });
            }
          }
        })
        loop++;
      })
      for (const indexObj of tempProductIndex) {
        const insertProduct = products[indexObj.index];
        insertProduct.swatches = arrSwatches.filter(item => item.grp == indexObj.grp);
        resultPro.push(insertProduct);
      }
    })
    return resultPro;
  }

  filterByCollection_color(products: Product[], collection: string): Product[] {
    return products.filter((product) => {
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
        return t.value === tag;
      });
    });
    return products_tagged;
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

  // function to group collections
  orderByCategory(products: Product[]): void {
    // than we group each collection a a 3 array grid
    let temp = [];
    const col_count = this.collections.length;
    let collections = this.collections.length;
    for (let i = 0; i < collections; i++) {
      // we filter by collection and oder by tag number from shopy
      this.productsGroup[i] = this.filterByCollection(
        products,
        this.collections[i + col_count - collections]
      );
      this.productsGroup[i] = this.orderCollection(
        this.productsGroup[i],
        this.collections[i + col_count - collections]
      );
      this.productsGroup[i].map(
        (p) => (p.collection = this.collections[i + col_count - collections])
      );
      // in Tie dye we dont want to show campaign photos
      // if (this.collections[i + col_count - collections] == "Tie Dye Capsule" || this.collections[i + col_count - collections] == "Sample Sale"){
      //   this.productsGroup[i].map(p => p.not_campaign = true);
      // }
      this.num_products = this.getNumProds();
      // with products filter by collection and order by tag number we create 3 products array
      while (this.productsGroup[i].length > this.num_products) {
        // we put products starting from 4-7 ( 0-3) already in place in the new gruop
        this.productsGroup[i + 1] = this.productsGroup[i].splice(
          this.num_products,
          this.productsGroup[i].length
        );
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
    this.productsGroup.forEach((element) => {
      element.forEach((res) => {
        temp.push(res);
      })
    })
    console.log("000->", temp);
    let result = temp.reduce((unique, o) => {
      if (!unique.some(obj => obj.productType === o.productType && obj.title === o.title)) {
        unique.push(o);
      }
      return unique;
    }, []);
    console.log("111->", result);

    this.results = result;
  }

  // function to create 3 grid array for single collection
  groupProducts(products: Product[]): void {
    let temp = [];
    // in Tie dye we dont want to show campaign photos
    // if (this.collection == "Tie Dye Capsule" || this.collection == "Sample Sale"){
    //   products.map(p => p.not_campaign = true);
    // }
    // if there's no campaign we need 6 products en each group, otherwise 3

    this.num_products = this.getNumProds();
    // than we gruop each collection a a 3 array grid
    let size = products.length / this.num_products;
    products.forEach((p) => (p.collection = this.collection));
    let p = this.orderCollection(products, this.collection);
    for (let i = 0; i < size; i++) {
      // we splice the first 3 elements still remaing in the array
      this.productsGroup[i] = p.splice(0, this.num_products);
    }

    // later addition if last gruop has two products make then 2 gruops of one products
    // const last = this.productsGroup.length -1
    // if (this.productsGroup[last].length == 2 && !this.productsGroup[last][0].not_campaign){
    //   this.productsGroup[last+1] = this.productsGroup[last].splice(1, this.productsGroup[last].length)
    // }
    this.productsGroup.forEach((element) => {
      element.forEach((res) => {
        temp.push(res);
      })
    })

    let result = temp.reduce((unique, o) => {
      if (!unique.some(obj => obj.productType === o.productType && obj.title === o.title)) {
        unique.push(o);
      }
      return unique;
    }, []);

    this.results = result;
  }

  getNumProds(): number {
    if (screen.width > 1200) return 8;
    if (screen.width > 760) return 6;
    return 3;
  }

  // function to order products by the tag number in shopty
  orderCollection(products: Product[], collection: string): Product[] {
    return products.sort((a, b) => {
      let a1 = 999;
      let b1 = 999;
      a.tags.forEach((tag) => {
        if (
          tag.value.substring(0, 4 + collection.length) ==
          "DSP:" + collection
        ) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          a1 = parseInt(tag.value.slice(collection.length + 5));
        }
      });

      b.tags.forEach((tag) => {
        if (
          tag.value.substring(0, 4 + collection.length) ==
          "DSP:" + collection
        ) {
          // most parse the 5th letter (contains the index) to int and deduct 1 (count starts from 1)
          b1 = parseInt(tag.value.slice(collection.length + 5));
        }
      });
      return a1 - b1;
    });
  }

  // function to init full page slider and move to routed collection
  initSlider() {
    // $("#fullpage1").fullpage({
    //   scrollingSpeed: 1000,
    //   easing: "easeInOutCubic",
    //   easingcss3: "ease",
    //   normalScrollElements: ".cart_modal",
    // });

    $(".fp-tableCell").css("vertical-align", "top");
  }

  getDiscount(full_price: number, price: number): number {
    return Math.floor((1 - price / full_price) * 100);
  }

  // make sure to kill fullpage slider
  ngOnDestroy() {
    $.fn.fullpage.destroy("all");
  }

  scrollTo(numOne) {
    $.fn.fullpage.moveTo(numOne);
  }
}
