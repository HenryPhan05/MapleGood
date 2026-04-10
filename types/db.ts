
export interface CustomerRow {
  customerID?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  password?: string; // Often handled externally by Firebase Auth
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  country: string | null;
  role: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryRow {
  categoryID?: string;
  categoryName: string;
  description: string | null;
  parentCategoryID: string | null;
  isDeleted: boolean;
  createdAt: Date;
}

export interface ProductRow {
  productID?: string;
  productName: string;
  description: string | null;
  price: string;
  stockQuantity: number;
  version: number | null;
  imageURL: string | null;
  brand: string | null;
  model: string | null;
  specifications: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategoryRow {
  id?: string;
  productID: string;
  categoryID: string;
  createdAt: Date;
}

export interface OrderRow {
  orderID?: string;
  customerID: string;
  orderDate: Date;
  orderStatus: string | null;
  totalAmount: string;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
  isDeleted: boolean;
  version: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemRow {
  orderItemID?: string;
  orderID: string;
  productID: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  productNameSnapshot: string | null;
  createdAt: Date;
}

export interface PaymentRow {
  paymentID?: string;
  orderID: string;
  customerID: string;
  amount: string;
  paymentMethod: string | null;
  paymentStatus: string | null;
  transactionId: string | null;
  createdAt: Date;
}

export interface ShoppingCartRow {
  cartID?: string;
  customerID: string;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemRow {
  cartItemID?: string;
  cartID: string;
  productID: string;
  quantity: number;
  createdAt: Date;
}

export interface WishlistRow {
  wishlistID?: string;
  customerID: string;
  wishlistName: string | null;
  createdAt: Date;
}

export interface WishlistItemRow {
  wishlistItemID?: string;
  wishlistID: string;
  productID: string;
  createdAt: Date;
}

// Note: Ensure the ID name here matches what you return in the DAO
// (In my previous DAO example I mapped doc.id to 'id', so you can use reviewID or id)
export interface CustomerReviewRow {
  reviewID?: string; 
  id?: string;
  customerID: string;
  productID: string;
  rating: number;
  reviewText: string | null;
  createdAt: Date;
}
