import { customerDao } from "@/lib/dao/customer.dao";
import { customerReviewDao } from "@/lib/dao/customer-review.dao";
import { productDao } from "@/lib/dao/product.dao";
import { HttpError } from "@/lib/http-error";
import { sanitizeString, validateRating } from "@/lib/validation";

export const reviewService = {
  async listByProduct(productID: number, limit: number, offset: number) {
    const p = await productDao.findById(productID);
    if (!p) throw new HttpError(404, "Product not found");
    return customerReviewDao.listByProduct(productID, limit, offset);
  },

  async upsert(data: {
    customerID: number;
    productID: number;
    rating: number;
    reviewText?: string | null;
  }) {
    validateRating(data.rating);
    
    const c = await customerDao.findById(data.customerID);
    if (!c) throw new HttpError(404, "Customer not found");
    const p = await productDao.findById(data.productID);
    if (!p) throw new HttpError(404, "Product not found");

    const sanitizedData = {
      customerID: data.customerID,
      productID: data.productID,
      rating: data.rating,
      reviewText: sanitizeString(data.reviewText, 1000),
    };

    await customerReviewDao.upsert(sanitizedData);
    const row = await customerReviewDao.findByCustomerAndProduct(
      data.customerID,
      data.productID
    );
    if (!row) throw new HttpError(500, "Failed to load review");
    return row;
  },
};
