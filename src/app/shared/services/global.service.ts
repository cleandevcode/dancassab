import {Injectable} from '@angular/core';
import {Cart,LineItem,} from './../../shared/models';
import {BehaviorSubject} from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Injectable()

export class GlobalService {

  cartObs: BehaviorSubject < Cart > = new BehaviorSubject(new Cart);
  lineItemsObs: BehaviorSubject < LineItem[] > = new BehaviorSubject([]);
  newlineItemObs: BehaviorSubject < LineItem > = new BehaviorSubject(null);
  cartOpenCloseObs: BehaviorSubject < boolean > = new BehaviorSubject(true);
  navbarCartCount = 0;

  constructor(
      public toastr: ToastrService, 
      private translate: TranslateService
    ) {
    let cart = new Cart;
    this.cartObs.next(cart);
    this.calculateLocalCartProdCounts();
  }
  

  addToCart(data: LineItem): void {
    let a: LineItem[];
    let newItem = false;
    let lineItem = this.getLocalCartProducts()
    a = JSON.parse(localStorage.getItem('avct_item')) || [];

    a.push(data);
    setTimeout(() => {
      localStorage.setItem('avct_item', JSON.stringify(a));
      this.toastr.success(this.translate.instant('toastr.add'));
      this.calculateLocalCartProdCounts();
    }, 500);
  }

  // Removing cart from local
  removeLocalCartProduct(product: LineItem) {
    const products: LineItem[] = JSON.parse(localStorage.getItem('avct_item'));

    for (let i = 0; i < products.length; i++) {
      if (products[i].variantId === product.variantId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem('avct_item', JSON.stringify(products));

    this.calculateLocalCartProdCounts();
  }

  cleanLocalCart() {
    const products = []
    localStorage.setItem('avct_item', JSON.stringify(products));

    this.calculateLocalCartProdCounts();
  }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): LineItem[] {
    const products: LineItem[] = JSON.parse(localStorage.getItem('avct_item')) || [];
    return products;
  }

  // returning LocalCarts Product Count
  calculateLocalCartProdCounts() {
    this.navbarCartCount = this.getLocalCartProducts().length;
  }
}
