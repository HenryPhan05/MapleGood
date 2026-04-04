import { cartItemDao } from "@/lib/dao/cart-item.dao";
import { customerDao } from "@/lib/dao/customer.dao";
import { shoppingCartDao } from "@/lib/dao/shopping-cart.dao";
import { isDuplicateEntry } from "@/lib/db-errors";
import { HttpError } from "@/lib/http-error";
import { validateQuantity } from "@/lib/validation";

export const cartService = {
  async getOrCreateForCustomer(customerID: number) {
    const customer = await customerDao.findById(customerID);
    if (!customer) throw new HttpError(404, "Customer not found");

    let cart = await shoppingCartDao.findByCustomer(customerID);
    if (!cart) {
      const cartID = await shoppingCartDao.insert({ customerID });
      cart = await shoppingCartDao.findById(cartID);
    }
    if (!cart) throw new HttpError(500, "Failed to load cart");

    const items = await cartItemDao.listByCart(cart.cartID);
    return { cart, items };
  },

  async getCartById(cartID: number, expectedCustomerID?: number) {
    const cart = await shoppingCartDao.findById(cartID);
    if (!cart) throw new HttpError(404, "Cart not found");
    if (
      expectedCustomerID !== undefined &&
      cart.customerID !== expectedCustomerID
    ) {
      throw new HttpError(403, "Cart does not belong to this customer");
    }
    const items = await cartItemDao.listByCart(cartID);
    return { cart, items };
  },

  async addItem(
    cartID: number,
    customerID: number,
    productID: number,
    quantity = 1
  ) {
    validateQuantity(quantity);
    await this.getCartById(cartID, customerID);

    const existing = await cartItemDao.findByCartAndProduct(cartID, productID);
    if (existing) {
      await cartItemDao.updateQuantity(
        existing.cartItemID,
        existing.quantity + quantity
      );
    } else {
      try {
        await cartItemDao.insert({ cartID, productID, quantity });
      } catch (e: unknown) {
        if (isDuplicateEntry(e)) {
          throw new HttpError(409, "Item already in cart");
        }
        throw e;
      }
    }
    return this.getCartById(cartID, customerID);
  },

  async setItemQuantity(
    cartID: number,
    customerID: number,
    cartItemID: number,
    quantity: number
  ) {
    validateQuantity(quantity);
    const { cart, items } = await this.getCartById(cartID, customerID);
    const item = items.find((i) => i.cartItemID === cartItemID);
    if (!item || item.cartID !== cart.cartID) {
      throw new HttpError(404, "Cart item not found");
    }
    await cartItemDao.updateQuantity(cartItemID, quantity);
    return this.getCartById(cartID, customerID);
  },

  async removeItem(
    cartID: number,
    customerID: number,
    cartItemID: number
  ) {
    const { cart, items } = await this.getCartById(cartID, customerID);
    const item = items.find((i) => i.cartItemID === cartItemID);
    if (!item || item.cartID !== cart.cartID) {
      throw new HttpError(404, "Cart item not found");
    }
    await cartItemDao.delete(cartItemID);
    return this.getCartById(cartID, customerID);
  },
};

