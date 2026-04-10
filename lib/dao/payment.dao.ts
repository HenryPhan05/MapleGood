import { db } from "@/lib/firebase-admin";
import type { PaymentRow } from "@/types/db";

const collection = db.collection("payments");

export const paymentDao = {
  async findById(paymentID: string): Promise<PaymentRow | null> {
    const doc = await collection.doc(paymentID).get();
    if (!doc.exists) return null;
    return { ...doc.data(), paymentID: doc.id } as PaymentRow;
  },

  async listByOrder(orderID: string): Promise<PaymentRow[]> {
    const snapshot = await collection
      .where("orderID", "==", orderID)
      .orderBy("createdAt", "desc")
      .get();
      
    return snapshot.docs.map(doc => ({ ...doc.data(), paymentID: doc.id } as PaymentRow));
  },

  async insert(data: {
    orderID: string;
    customerID: string;
    amount: string | number;
    paymentMethod?: string | null;
    paymentStatus?: string | null;
    transactionId?: string | null;
  }): Promise<string> {
    const docRef = await collection.add({
      orderID: data.orderID,
      customerID: data.customerID,
      amount: String(data.amount),
      paymentMethod: data.paymentMethod ?? null,
      paymentStatus: data.paymentStatus ?? "PENDING",
      transactionId: data.transactionId ?? null,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async updateStatus(
    paymentID: string,
    paymentStatus: string
  ): Promise<void> {
    await collection.doc(paymentID).update({ paymentStatus });
  },
};
