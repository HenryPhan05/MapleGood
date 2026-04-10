import { db } from "@/lib/firebase-admin";
import type { CustomerRow } from "@/types/db";

const collection = db.collection("customers");

export const customerDao = {
  async findById(customerID: string): Promise<CustomerRow | null> {
    const doc = await collection.doc(customerID).get();
    if (!doc.exists) return null;
    
    const data = doc.data() as CustomerRow;
    if (data.isDeleted) return null;
    
    return { ...data, customerID: doc.id };
  },

  async findByEmail(email: string): Promise<CustomerRow | null> {
    const snapshot = await collection
      .where("email", "==", email)
      .where("isDeleted", "==", false)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { ...doc.data(), customerID: doc.id } as CustomerRow;
  },

  async list(limit: number, offset: number): Promise<CustomerRow[]> {
    const snapshot = await collection
      .where("isDeleted", "==", false)
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(limit)
      .get();
      
    return snapshot.docs.map(doc => ({ ...doc.data(), customerID: doc.id } as CustomerRow));
  },

  async insert(data: Partial<CustomerRow>): Promise<string> {
    const now = new Date();
    const docRef = await collection.add({
      ...data,
      country: data.country ?? "Canada",
      role: data.role ?? "CUSTOMER",
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  async update(customerID: string, data: Partial<CustomerRow>): Promise<void> {
    await collection.doc(customerID).update({
      ...data,
      updatedAt: new Date()
    });
  },

  async softDelete(customerID: string): Promise<void> {
    await collection.doc(customerID).update({ 
      isDeleted: true,
      updatedAt: new Date()
    });
  },
};