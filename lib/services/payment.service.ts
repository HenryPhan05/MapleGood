import { customerDao } from "@/lib/dao/customer.dao";
import { orderDao } from "@/lib/dao/order.dao";
import { paymentDao } from "@/lib/dao/payment.dao";
import { HttpError } from "@/lib/http-error";

export const paymentService = {
  async listByOrder(orderID: number) {
    const order = await orderDao.findById(orderID);
    if (!order) throw new HttpError(404, "Order not found");
    return paymentDao.listByOrder(orderID);
  },

  async getById(paymentID: number) {
    const row = await paymentDao.findById(paymentID);
    if (!row) throw new HttpError(404, "Payment not found");
    return row;
  },

  async create(data: {
    orderID: number;
    customerID: number;
    amount: string | number;
    paymentMethod?: string | null;
    paymentStatus?: string | null;
    transactionId?: string | null;
  }) {
    const order = await orderDao.findById(data.orderID);
    if (!order) throw new HttpError(404, "Order not found");
    if (order.customerID !== data.customerID) {
      throw new HttpError(400, "Customer does not match order");
    }
    const customer = await customerDao.findById(data.customerID);
    if (!customer) throw new HttpError(404, "Customer not found");

    const id = await paymentDao.insert(data);
    const row = await paymentDao.findById(id);
    if (!row) throw new HttpError(500, "Failed to load payment");
    return row;
  },

  async updateStatus(paymentID: number, paymentStatus: string) {
    const row = await paymentDao.findById(paymentID);
    if (!row) throw new HttpError(404, "Payment not found");
    await paymentDao.updateStatus(paymentID, paymentStatus);
    const next = await paymentDao.findById(paymentID);
    if (!next) throw new HttpError(500, "Failed to load payment");
    return next;
  },
};
