import type { RowDataPacket } from "mysql2";

export interface CustomerRow extends RowDataPacket {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  password: string;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  country: string | null;
  role: string | null;
  isDeleted: number | boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryRow extends RowDataPacket {
  categoryID: number;
  categoryName: string;
  description: string | null;
  parentCategoryID: number | null;
  isDeleted: number | boolean;
  createdAt: Date;
}

export interface ProductRow extends RowDataPacket {
  productID: number;
  productName: string;
  description: string | null;
  price: string;
  stockQuantity: number;
  version: number | null;
  imageURL: string | null;
  brand: string | null;
  model: string | null;
  specifications: string | null;
  isActive: number | boolean;
  isDeleted: number | boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategoryRow extends RowDataPacket {
  id: number;
  productID: number;
  categoryID: number;
  createdAt: Date;
}

export interface OrderRow extends RowDataPacket {
  orderID: number;
  customerID: number;
  orderDate: Date;
  orderStatus: string | null;
  totalAmount: string;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
  isDeleted: number | boolean;
  version: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemRow extends RowDataPacket {
  orderItemID: number;
  orderID: number;
  productID: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  productNameSnapshot: string | null;
  createdAt: Date;
}

export interface PaymentRow extends RowDataPacket {
  paymentID: number;
  orderID: number;
  customerID: number;
  amount: string;
  paymentMethod: string | null;
  paymentStatus: string | null;
  transactionId: string | null;
  createdAt: Date;
}

export interface ShoppingCartRow extends RowDataPacket {
  cartID: number;
  customerID: number;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemRow extends RowDataPacket {
  cartItemID: number;
  cartID: number;
  productID: number;
  quantity: number;
  createdAt: Date;
}

export interface WishlistRow extends RowDataPacket {
  wishlistID: number;
  customerID: number;
  wishlistName: string | null;
  createdAt: Date;
}

export interface WishlistItemRow extends RowDataPacket {
  wishlistItemID: number;
  wishlistID: number;
  productID: number;
  createdAt: Date;
}

export interface CustomerReviewRow extends RowDataPacket {
  reviewID: number;
  customerID: number;
  productID: number;
  rating: number;
  reviewText: string | null;
  createdAt: Date;
}
