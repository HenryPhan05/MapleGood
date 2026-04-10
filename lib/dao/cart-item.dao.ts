import { db } from "@/lib/firebase-admin";
import type { CartItemRow } from "@/types/db";

const collection = db.collection("cart_items");

export const cartItemDao = {
  async listByCart(cartID: string): Promise<CartItemRow[]> {
    const snapshot = await collection
      .where("cartID", "==", cartID)
      .orderBy("createdAt", "asc")
      .get();
      
    return snapshot.docs.map(doc => ({ ...doc.data(), cartItemID: doc.id } as CartItemRow));
  },

  async findByCartAndProduct(cartID: string, productID: string): Promise<CartItemRow | null> {
    const snapshot = await collection
      .where("cartID", "==", cartID)
      .where("productID", "==", productID)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    return { ...snapshot.docs[0].data(), cartItemID: snapshot.docs[0].id } as CartItemRow;
  },

  async insert(data: { cartID: string; productID: string; quantity?: number }): Promise<string> {
    const docRef = await collection.add({
      cartID: data.cartID,
      productID: data.productID,
      quantity: data.quantity ?? 1,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async updateQuantity(cartItemID: string, quantity: number): Promise<void> {
    await collection.doc(cartItemID).update({ quantity });
  },

  async delete(cartItemID: string): Promise<void> {
    await collection.doc(cartItemID).delete();
  },
};