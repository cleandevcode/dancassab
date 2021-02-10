import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShopifyService, LineItem, GlobalService } from './../shared';
declare var $: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit, OnDestroy {

  lineItems: LineItem[];
  cartId: string;
  cartOpen: boolean;
  location = "Mexico";
  constructor(
    private shopifyService: ShopifyService,
    public globalService: GlobalService,
  ) {

  }

  ngOnInit() {
    this.lineItems = this.globalService.getLocalCartProducts();
  }

  // open and clode cart modal
  openModal() {
    this.lineItems = this.globalService.getLocalCartProducts();
    $('.cart_bag').css('display', 'none');
    $('.cart_modal').fadeIn();
  }


  closeModal() {
    $('.cart_modal').fadeOut();
    // $('.cart_bag').css('display', 'block');
  }


  createUpdateCheckout() {
    if (!this.cartId) {
      this.shopifyService.createCheckout(this.lineItems).then(
        ({ model, data }) => {
          if (!data.checkoutCreate.userErrors.length) {
            this.cartId = data.checkoutCreate.checkout.id;
            this.openCheckout(data.checkoutCreate.checkout);
            let i = 0;
            data.checkoutCreate.checkout.lineItems.edges.forEach(edge => {
              this.lineItems[i].id = edge.node.id;
              i++;
            });
          } else {
            data.checkoutCreate.userErrors.forEach(error => {
              alert(JSON.stringify(error));
            });
          }
        }, err => alert(err)
      );
    } else {
      this.shopifyService.fetchCheckout(this.cartId).then(
        ({ model, data }) => {
          this.openCheckout(data.checkout);
        }, err => alert(err)
      )
    }

  }

  ngOnDestroy() {

  }

  addItem(lineItem: LineItem) {
    if (this.cartId) {
      this.shopifyService.addVariantsToCheckout(this.cartId, [lineItem]).then(
        ({ model, data }) => {
          if (!data.checkoutLineItemsAdd.userErrors.length) {
            this.lineItems.push(lineItem);
            let i = 0;
            data.checkoutLineItemsAdd.checkout.lineItems.edges.forEach(edge => {
              if (edge.node.variant.id = lineItem.variantId) {
                this.lineItems[i].id = edge.node.id;
              }
              i++;
            });
          } else {
            data.checkoutLineItemsAdd.userErrors.forEach(error => {
              alert(JSON.stringify(error));
            });
          }
        }, err => alert(err)
      )
    } else {
      this.lineItems.push(lineItem)
    }
  }

  removeItem(lineItem: LineItem) {
    this.globalService.removeLocalCartProduct(lineItem);
    this.lineItems = this.globalService.getLocalCartProducts()
  }


  increaseQuantity(lineItem: LineItem) {
    lineItem.quantity++;
    if (this.cartId) {
      this.updateItemQuantity().then(
        quantityUpdated => {
          if (!quantityUpdated) {
            lineItem.quantity--;
          }
        }, err => alert(err)
      )
    }
  }

  decreaseQuantity(lineItem: LineItem) {
    if (lineItem.quantity > 1)
      lineItem.quantity--;
    if (this.cartId) {
      this.updateItemQuantity().then(
        quantityUpdated => {
          if (!quantityUpdated) {
            lineItem.quantity++;
          }
        }, err => alert(err)
      )
    }
  }

  updateItemQuantity(): Promise<boolean> {
    return this.shopifyService.updateLineItem(this.cartId, this.lineItems).then(
      ({ model, data }) => {
        if (!data.checkoutLineItemsUpdate.userErrors.length) {
          return true;
        } else {
          data.checkoutLineItemsUpdate.userErrors.forEach(error => {
            alert(JSON.stringify(error));
          });
          return false;
        }
      }, err => false
    )
  }

  get total(): number {
    this.location = JSON.parse(localStorage.getItem('country'));
    if (this.lineItems.length)
      return this.lineItems.map(lineItem => lineItem.quantity * (+lineItem.variant.price)).reduce((prev, next) => prev + next);
    else return 0;
  }


  openCheckout(checkout) {
    window.location.replace(checkout.webUrl);
  }


}
