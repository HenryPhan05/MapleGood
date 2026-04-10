import { db } from "@/lib/firebase-admin";
import type { WishlistItemRow } from "@/types/db";

const collection = db.collection("wishlist_items");

export const wishlistItemDao = {
  async listByWishlist(wishlistID: string): Promise<WishlistItemRow[]> {
    const snapshot = await collection
      .where("wishlistID", "==", wishlistID)
      .orderBy("createdAt", "asc")
      .get();
      
    return snapshot.docs.map(doc => ({ ...doc.data(), wishlistItemID: doc.id } as WishlistItemRow));
  },

  async insert(data: { wishlistID: string; productID: string }): Promise<string> {
    const docRef = await collection.add({
      wishlistID: data.wishlistID,
      productID: data.productID,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async delete(wishlistID: string, productID: string): Promise<void> {
    const snapshot = await collection
      .where("wishlistID", "==", wishlistID)
      .where("productID", "==", productID)
      .get();
      
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  },
};