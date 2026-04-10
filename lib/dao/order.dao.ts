import { db } from "@/lib/firebase-admin";
import type { OrderRow } from "@/types/db";

const collection = db.collection("orders");

export const orderDao = {
  async findById(orderID: string): Promise<OrderRow | null> {
    const doc = await collection.doc(orderID).get();
    if (!doc.exists) return null;
    
    const data = doc.data() as OrderRow;
    if (data.isDeleted) return null;
    
    return { ...data, orderID: doc.id };
  },

  async listByCustomer(
    customerID: string,
    limit: number,
    offset: number
  ): Promise<OrderRow[]> {
    const snapshot = await collection
      .where("customerID", "==", customerID)
      .where("isDeleted", "==", false)
      .orderBy("createdAt", "desc") // Replacing orderID DESC with a timestamp
      .offset(offset)
      .limit(limit)
      .get();
      
    return snapshot.docs.map(doc => ({ ...doc.data(), orderID: doc.id } as OrderRow));
  },

  async insert(data: {
    customerID: string;
    totalAmount: string | number;
    orderStatus?: string | null;
    shippingAddress?: string | null;
    shippingCity?: string | null;
    shippingProvince?: string | null;
    shippingPostalCode?: string | null;
    shippingCountry?: string | null;
  }): Promise<string> {
    const docRef = await collection.add({
      customerID: data.customerID,
      totalAmount: String(data.totalAmount),
      orderStatus: data.orderStatus ?? "PENDING",
      shippingAddress: data.shippingAddress ?? null,
      shippingCity: data.shippingCity ?? null,
      shippingProvince: data.shippingProvince ?? null,
      shippingPostalCode: data.shippingPostalCode ?? null,
      shippingCountry: data.shippingCountry ?? "Canada",
      isDeleted: false,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async update(
    orderID: string,
    data: Partial<{
      orderStatus: string | null;
      totalAmount: string | number;
      version: number;
      shippingAddress: string | null;
      shippingCity: string | null;
      shippingProvince: string | null;
      shippingPostalCode: string | null;
      shippingCountry: string | null;
    }>
  ): Promise<void> {
    if (Object.keys(data).length === 0) return;
    
    // Ensure totalAmount is a string if present
    const updateData = { ...data };
    if (updateData.totalAmount !== undefined) {
      updateData.totalAmount = String(updateData.totalAmount);
    }

    await collection.doc(orderID).update(updateData);
  },

  async softDelete(orderID: string): Promise<void> {
    await collection.doc(orderID).update({ isDeleted: true });
  },
};