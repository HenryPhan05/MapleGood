import { customerDao } from "@/lib/dao/customer.dao";
import { wishlistDao } from "@/lib/dao/wishlist.dao";
import { wishlistItemDao } from "@/lib/dao/wishlist-item.dao";
import { isDuplicateEntry } from "@/lib/db-errors";
import { HttpError } from "@/lib/http-error";
import { sanitizeString } from "@/lib/validation";

export const wishlistService = {
  async listForCustomer(customerID: number) {
    const c = await customerDao.findById(customerID);
    if (!c) throw new HttpError(404, "Customer not found");
    return wishlistDao.listByCustomer(customerID);
  },

  async create(customerID: number, wishlistName?: string | null) {
    const c = await customerDao.findById(customerID);
    if (!c) throw new HttpError(404, "Customer not found");
    
    const sanitizedName = sanitizeString(wishlistName, 100) || "My Wishlist";
    
    const id = await wishlistDao.insert({ customerID, wishlistName: sanitizedName });
    const row = await wishlistDao.findById(id);
    if (!row) throw new HttpError(500, "Failed to load wishlist");
    return row;
  },

  async getWithItems(wishlistID: number, expectedCustomerID?: number) {
    const list = await wishlistDao.findById(wishlistID);
    if (!list) throw new HttpError(404, "Wishlist not found");
    if (
      expectedCustomerID !== undefined &&
      list.customerID !== expectedCustomerID
    ) {
      throw new HttpError(403, "Wishlist does not belong to this customer");
    }
    const items = await wishlistItemDao.listByWishlist(wishlistID);
    return { wishlist: list, items };
  },

  async rename(
    wishlistID: number,
    customerID: number,
    wishlistName: string
  ) {
    await this.getWithItems(wishlistID, customerID);
    
    const sanitizedName = sanitizeString(wishlistName, 100) || (() => { throw new HttpError(400, "Wishlist name cannot be empty"); })();
    
    await wishlistDao.updateName(wishlistID, sanitizedName);
    return this.getWithItems(wishlistID, customerID);
  },

  async addProduct(
    wishlistID: number,
    customerID: number,
    productID: number
  ) {
    await this.getWithItems(wishlistID, customerID);
    try {
      await wishlistItemDao.insert({ wishlistID, productID });
    } catch (e: unknown) {
      if (isDuplicateEntry(e)) {
        throw new HttpError(409, "Product already in wishlist");
      }
      throw e;
    }
    return this.getWithItems(wishlistID, customerID);
  },

  async removeProduct(
    wishlistID: number,
    customerID: number,
    productID: number
  ) {
    await this.getWithItems(wishlistID, customerID);
    await wishlistItemDao.delete(wishlistID, productID);
    return this.getWithItems(wishlistID, customerID);
  },
};

