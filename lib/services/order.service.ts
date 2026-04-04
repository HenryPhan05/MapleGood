import { transaction } from "@/db/mysql";
import { customerDao } from "@/lib/dao/customer.dao";
import { orderDao } from "@/lib/dao/order.dao";
import { orderItemDao } from "@/lib/dao/order-item.dao";
import { productDao } from "@/lib/dao/product.dao";
import { HttpError } from "@/lib/http-error";
import { sanitizeString, validateQuantity } from "@/lib/validation";

async function getOrderWithItems(orderID: number) {
  const order = await orderDao.findById(orderID);
  if (!order) throw new HttpError(404, "Order not found");
  const items = await orderItemDao.listByOrder(orderID);
  return { order, items };
}

export const orderService = {
  async listByCustomer(customerID: number, limit: number, offset: number) {
    const c = await customerDao.findById(customerID);
    if (!c) throw new HttpError(404, "Customer not found");
    return orderDao.listByCustomer(customerID, limit, offset);
  },

  getById: getOrderWithItems,

  async create(input: {
    customerID: number;
    items: { productID: number; quantity: number }[];
    shipping?: {
      shippingAddress?: string | null;
      shippingCity?: string | null;
      shippingProvince?: string | null;
      shippingPostalCode?: string | null;
      shippingCountry?: string | null;
    };
  }) {
    if (!input.items.length) {
      throw new HttpError(400, "Order must contain at least one line item");
    }

    const customer = await customerDao.findById(input.customerID);
    if (!customer) throw new HttpError(404, "Customer not found");

    const lines: {
      productID: number;
      quantity: number;
      unitPrice: string;
      subtotal: string;
      productNameSnapshot: string;
    }[] = [];

    let total = 0;
    for (const line of input.items) {
      validateQuantity(line.quantity);
      
      const product = await productDao.findById(line.productID);
      if (!product) throw new HttpError(404, `Product ${line.productID} not found`);
      const active = Boolean(product.isActive);
      if (!active) {
        throw new HttpError(400, `Product ${line.productID} is not active`);
      }
      if (product.stockQuantity < line.quantity) {
        throw new HttpError(400, `Insufficient stock for product ${line.productID}`);
      }
      const unit = Number(product.price);
      const sub = unit * line.quantity;
      total += sub;
      lines.push({
        productID: line.productID,
        quantity: line.quantity,
        unitPrice: product.price,
        subtotal: sub.toFixed(2),
        productNameSnapshot: product.productName,
      });
    }

    const orderID = await transaction(async (conn) => {
      const sanitizedShipping = input.shipping ? {
        shippingAddress: sanitizeString(input.shipping.shippingAddress, 255),
        shippingCity: sanitizeString(input.shipping.shippingCity, 100),
        shippingProvince: sanitizeString(input.shipping.shippingProvince, 50),
        shippingPostalCode: sanitizeString(input.shipping.shippingPostalCode, 10),
        shippingCountry: sanitizeString(input.shipping.shippingCountry, 50) || "Canada",
      } : {};

      const oid = await orderDao.insert(
        {
          customerID: input.customerID,
          totalAmount: total.toFixed(2),
          ...sanitizedShipping,
        },
        conn
      );

      for (const line of lines) {
        const ok = await productDao.tryDecrementStock(
          line.productID,
          line.quantity,
          conn
        );
        if (!ok) {
          throw new HttpError(409, `Could not reserve stock for product ${line.productID}`);
        }
        await orderItemDao.insert(
          {
            orderID: oid,
            productID: line.productID,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            subtotal: line.subtotal,
            productNameSnapshot: line.productNameSnapshot,
          },
          conn
        );
      }

      return oid;
    });

    return getOrderWithItems(orderID);
  },

  async updateStatus(orderID: number, orderStatus: string) {
    const order = await orderDao.findById(orderID);
    if (!order) throw new HttpError(404, "Order not found");
    
    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    const sanitizedStatus = sanitizeString(orderStatus, 20);
    
    if (!sanitizedStatus || !validStatuses.includes(sanitizedStatus.toUpperCase())) {
      throw new HttpError(400, "Invalid order status");
    }
    
    await orderDao.update(orderID, { orderStatus: sanitizedStatus.toUpperCase() });
    return getOrderWithItems(orderID);
  },

  async softDelete(orderID: number) {
    const order = await orderDao.findById(orderID);
    if (!order) throw new HttpError(404, "Order not found");
    await orderDao.softDelete(orderID);
  },
};
