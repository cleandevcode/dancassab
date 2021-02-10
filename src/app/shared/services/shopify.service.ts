import GraphQLJSClient from "graphql-js-client";
import typeBundle from "./types";
import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { Product } from "./../../shared";
import { HttpClient } from "@angular/common/http";
import { variable } from "@angular/compiler/src/output/output_ast";

declare var $: any;
@Injectable()
export class ShopifyService {
  constructor(private http: HttpClient) { }
  private cache$: any;
  client: any;
  private country: string;
  get products() {
    if (!this.cache$) {
      this.cache$ = this.getProducts()
    }
    console.log("111->", this.cache$)
    return this.cache$;
  }

  getClient(): any {
    return this.client;
  }

  setClient(): Promise<GraphQLJSClient> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        $.ajax({
          url: "https://geolocation-db.com/jsonp",
          dataType: "jsonp",
          jsonpCallback: "callback",

          success: (response) => {
            if (response.country_name === "Mexico") {
              this.country = "Mexico";
              this.client = new GraphQLJSClient(typeBundle, {
                url: environment.urlMx,
                fetcherOptions: {
                  headers: {
                    "X-Shopify-Storefront-Access-Token":
                      environment.shopifyaccesstokenmx,
                  },
                },
              });
            } else {
              this.country = "Other"
              this.client = new GraphQLJSClient(typeBundle, {
                url: environment.urlInt,
                fetcherOptions: {
                  headers: {
                    "X-Shopify-Storefront-Access-Token":
                      environment.shopifyaccesstoken,
                  },
                },
              });
            }
            resolve(response.country_name);
          },
          error: (err) => {
            this.client = new GraphQLJSClient(typeBundle, {
              url: environment.urlInt,
              fetcherOptions: {
                headers: {
                  "X-Shopify-Storefront-Access-Token":
                    environment.shopifyaccesstoken,
                },
              },
            });
            resolve("error");
          },
        });
      }, 500);
    });
  }

  getCurrentShop(): Promise<any> {
    let client = this.client;

    let query = client.query((root) => {
      root.add("shop", (shop) => {
        shop.add("name");
      });
    });
    return client.send(query);
  }

  getProductById(_id): Promise<Product> {
    let query = this.client.query((root) => {
      root.add("node", { args: { id: _id }, alias: "product" }, (node) => {
        node.addInlineFragmentOn("Product", (Product) => {
          Product.add("title");
          Product.add("createdAt");
          Product.add("description");
          Product.add("descriptionHtml");
          Product.add("productType");
          Product.add("publishedAt");
          Product.add("tags");
          Product.add("options");
          Product.add("updatedAt");
          Product.add("vendor");
          Product.addConnection(
            "images",
            { args: { first: 250 } },
            (images) => {
              images.add("src");
              images.add("id");
              images.add("altText");
            }
          );
          Product.addConnection(
            "collections",
            { args: { first: 250 } },
            (collection) => {
              collection.add("title");
            }
          );
          Product.addConnection(
            "variants",
            { args: { first: 250 } },
            (variants) => {
              variants.add("id");
              variants.add("sku");
              variants.add("product");
              variants.add("title");
              variants.add("compareAtPrice");
              variants.add("price");
              variants.add("image", (image) => {
                image.add("src");
                image.add("id");
                image.add("altText");
              });
            }
          );
        });
      });
    });

    return this.client.send(query).then(({ model, data }) => {
      console.log(model);
      return this.client.fetchAllPages(model.product, { pageSize: 250 });
    });
  }

  getProducts(): Promise<Product[]> {
    let query = this.client.query((root) => {
      root.add("shop", (shop) => {
        shop.addConnection("products", { args: { first: 250 } }, (Products) => {
          Products.add("title");
          Products.add("createdAt");
          Products.add("description");
          Products.add("descriptionHtml");
          Products.add("productType");
          Products.add("publishedAt");
          Products.add("tags");
          Products.add("options");
          Products.add("updatedAt");
          Products.add("vendor");
          Products.addConnection(
            "images",
            { args: { first: 250 } },
            (images) => {
              images.add("src");
              images.add("id");
              images.add("altText");
            }
          );
          Products.addConnection(
            "collections",
            { args: { first: 250 } },
            (collection) => {
              collection.add("title");
            }
          );
          Products.addConnection(
            "variants",
            { args: { first: 250 } },
            (variants) => {
              variants.add("id");
              variants.add("sku");
              variants.add("product");
              variants.add("compareAtPrice");
              variants.add("title");
              variants.add("price");
              variants.add('available');
              variants.add("image", (image) => {
                image.add("src");
                image.add("id");
                image.add("altText");
              });
            }
          );
        });
      });
    });

    return this.client.send(query).then(({ model, data }) => {
      return this.client.fetchAllPages(model.shop.products, { pageSize: 20 });
    });
  }

  createCheckout(_lineItems): Promise<any> {
    const _lineItemsForCheckout = _lineItems.map((item) => {
      return { variantId: item.variantId, quantity: item.quantity };
    });

    const input = this.client.variable("input", "CheckoutCreateInput!");

    const mutation = this.client.mutation("myMutation", [input], (root) => {
      root.add("checkoutCreate", { args: { input } }, (checkoutCreate) => {
        checkoutCreate.add("userErrors", (userErrors) => {
          userErrors.add("message"), userErrors.add("field");
        });
        checkoutCreate.add("checkout", (checkout) => {
          checkout.add("id"),
            checkout.add("webUrl"),
            checkout.addConnection(
              "lineItems",
              { args: { first: 250 } },
              (lineItems) => {
                lineItems.add("variant", (variant) => {
                  variant.add("title");
                }),
                  lineItems.add("quantity");
              }
            );
        });
      });
    });
    return this.client.send(mutation, {
      input: { lineItems: _lineItemsForCheckout },
    });
  }

  fetchCheckout(_checkoutid): Promise<any> {
    const id = this.client.variable("checkoutId", "ID!");

    let query = this.client.query((root) => {
      root.add(
        "node",
        { args: { id: _checkoutid }, alias: "checkout" },
        (node) => {
          node.add("id");
          node.addInlineFragmentOn("Checkout", (Checkout) => {
            Checkout.add("webUrl");
            Checkout.add("subtotalPrice"),
              Checkout.add("totalTax"),
              Checkout.add("totalPrice"),
              Checkout.addConnection(
                "lineItems",
                { args: { first: 250 } },
                (lineItems) => {
                  lineItems.add("variant", (variant) => {
                    variant.add("title"),
                      variant.add("image", (image) => image.add("src")),
                      variant.add("price");
                  }),
                    lineItems.add("quantity");
                }
              );
          });
        }
      );
    });

    return this.client.send(query, { checkoutId: _checkoutid });
  }

  addVariantsToCheckout(_checkoutid, _lineItems): Promise<any> {
    const checkoutId = this.client.variable("checkoutId", "ID!");
    const _lineItemsForCheckout = _lineItems.map((item) => {
      return {
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
      };
    });
    const lineItems = this.client.variable(
      "lineItems",
      "[CheckoutLineItemInput!]!"
    );

    const mutation = this.client.mutation(
      "myMutation",
      [checkoutId, lineItems],
      (root) => {
        root.add(
          "checkoutLineItemsAdd",
          { args: { checkoutId, lineItems } },
          (checkoutLineItemsAdd) => {
            checkoutLineItemsAdd.add("userErrors", (userErrors) => {
              userErrors.add("message"), userErrors.add("field");
            });

            checkoutLineItemsAdd.add("checkout", (checkout) => {
              checkout.add("webUrl"),
                checkout.add("subtotalPrice"),
                checkout.add("totalTax"),
                checkout.add("totalPrice"),
                checkout.addConnection(
                  "lineItems",
                  { args: { first: 250 } },
                  (lineItems) => {
                    lineItems.add("variant", (variant) => {
                      variant.add("title"),
                        variant.add("image", (image) => image.add("src")),
                        variant.add("price");
                    }),
                      lineItems.add("quantity");
                  }
                );
            });
          }
        );
      }
    );

    return this.client.send(mutation, {
      checkoutId: _checkoutid,
      lineItems: _lineItemsForCheckout,
    });
  }

  removeLineItem(_checkoutid, _lineItemId): Promise<any> {
    const checkoutId = this.client.variable("checkoutId", "ID!");
    const lineItemIds = this.client.variable("lineItemIds", "[ID!]!");

    const mutation = this.client.mutation(
      "myMutation",
      [checkoutId, lineItemIds],
      (root) => {
        root.add(
          "checkoutLineItemsRemove",
          { args: { checkoutId, lineItemIds } },
          (checkoutLineItemsRemove) => {
            checkoutLineItemsRemove.add("userErrors", (userErrors) => {
              userErrors.add("message"), userErrors.add("field");
            }),
              checkoutLineItemsRemove.add("checkout", (checkout) => {
                checkout.add("webUrl"),
                  checkout.add("subtotalPrice"),
                  checkout.add("totalTax"),
                  checkout.add("totalPrice"),
                  checkout.addConnection(
                    "lineItems",
                    { args: { first: 250 } },
                    (lineItems) => {
                      lineItems.add("variant", (variant) => {
                        variant.add("title"),
                          variant.add("image", (image) => image.add("src")),
                          variant.add("price");
                      }),
                        lineItems.add("quantity");
                    }
                  );
              });
          }
        );
      }
    );

    return this.client.send(mutation, {
      checkoutId: _checkoutid,
      lineItemIds: [_lineItemId],
    });
  }

  updateLineItem(_checkoutid, _lineItems): Promise<any> {
    const _lineItemsForCheckout = _lineItems.map((item) => {
      return {
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
      };
    });

    const checkoutId = this.client.variable("checkoutId", "ID!");
    const lineItems = this.client.variable(
      "lineItems",
      "[CheckoutLineItemUpdateInput!]!"
    );

    const mutation = this.client.mutation(
      "myMutation",
      [checkoutId, lineItems],
      (root) => {
        root.add(
          "checkoutLineItemsUpdate",
          { args: { checkoutId, lineItems } },
          (checkoutLineItemsUpdate) => {
            checkoutLineItemsUpdate.add("userErrors", (userErrors) => {
              userErrors.add("message"), userErrors.add("field");
            });

            checkoutLineItemsUpdate.add("checkout", (checkout) => {
              checkout.add("webUrl"),
                checkout.add("subtotalPrice"),
                checkout.add("totalTax"),
                checkout.add("totalPrice"),
                checkout.addConnection(
                  "lineItems",
                  { args: { first: 250 } },
                  (lineItems) => {
                    lineItems.add("variant", (variant) => {
                      variant.add("title"),
                        variant.add("image", (image) => image.add("src")),
                        variant.add("price");
                    }),
                      lineItems.add("quantity");
                  }
                );
            });
          }
        );
      }
    );

    return this.client.send(mutation, {
      checkoutId: _checkoutid,
      lineItems: _lineItemsForCheckout,
    });
  }

  getVariants(productID: string) {
    return this.http.get('/varients', { params: { productID: productID } });
  }

  notifyMe(productID: string, variantID: string, email: string, mailing: boolean) {
    let url = this.country === 'Mexico' ? 'dancassabmx.myshopify.com' : 'dancassab-intl.myshopify.com';
    return this.http.get(`https://app.backinstock.org/stock_notification/create.json?shop=${url}&notification[email]=${email}&notification[product_no]=${productID}&notification[quantity_required]=1&notification[accepts_marketing]=${mailing}&notification[customer_utc_offset]=10800&variant[variant_no]=${variantID}`)
  }
}
