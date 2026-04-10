import { db } from "@/lib/firebase-admin";
import type { ShoppingCartRow } from "@/types/db";

const collection = db.collection("shopping_carts");

export const shoppingCartDao = {
  async findByCustomer(customerID: string): Promise<ShoppingCartRow | null> {
    const snapshot = await collection
      .where("customerID", "==", customerID)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    return { ...snapshot.docs[0].data(), cartID: snapshot.docs[0].id } as ShoppingCartRow;
  },

  async findById(cartID: string): Promise<ShoppingCartRow | null> {
    const doc = await collection.doc(cartID).get();
    if (!doc.exists) return null;
    return { ...doc.data(), cartID: doc.id } as ShoppingCartRow;
  },

  async insert(data: { customerID: string; expiresAt?: Date | null }): Promise<string> {
    const docRef = await collection.add({
      customerID: data.customerID,
      expiresAt: data.expiresAt ?? null,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async updateExpiresAt(cartID: string, expiresAt: Date | null): Promise<void> {
    await collection.doc(cartID).update({ expiresAt });
  },
};
