import { db } from "@/lib/firebase-admin";
import type { WishlistRow } from "@/types/db";

const collection = db.collection("wishlists");

export const wishlistDao = {
  async findById(wishlistID: string): Promise<WishlistRow | null> {
    const doc = await collection.doc(wishlistID).get();
    if (!doc.exists) return null;
    return { ...doc.data(), wishlistID: doc.id } as WishlistRow;
  },

  async listByCustomer(customerID: string): Promise<WishlistRow[]> {
    const snapshot = await collection
      .where("customerID", "==", customerID)
      .orderBy("createdAt", "desc")
      .get();
      
    return snapshot.docs.map(doc => ({ ...doc.data(), wishlistID: doc.id } as WishlistRow));
  },

  async insert(data: { customerID: string; wishlistName?: string | null }): Promise<string> {
    const docRef = await collection.add({
      customerID: data.customerID,
      wishlistName: data.wishlistName ?? "My Wishlist",
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async updateName(wishlistID: string, wishlistName: string): Promise<void> {
    await collection.doc(wishlistID).update({ wishlistName });
  },
};