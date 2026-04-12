import { db } from "@/lib/firebase-admin";
import type { Product } from "@/types/db";

const collection = db.collection("products");

export const productDao = {
  async findById(productID: string): Promise<Product | null> {
    const doc = await collection.doc(productID).get();
    if (!doc.exists) return null;
    
    const data = doc.data() as Product;
    if (data.isDeleted) return null;
    
    return { ...data, id: doc.id };
  },

  async list(
    limit: number,
    offset: number, // Note: Firestore uses startAfter() for pagination, offset is inefficient
    activeOnly: boolean
  ): Promise<Product[]> {
    let query = collection.where("isDeleted", "==", false);
    
    if (activeOnly) {
      query = query.where("isActive", "==", true);
    }
    
    // Firestore pagination usually relies on cursors rather than offset.
    // For a direct translation using offset (not recommended for large datasets):
    const snapshot = await query.orderBy("createdAt", "desc").offset(offset).limit(limit).get();
    
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
  },

  async search(
    query: string,
    limit: number,
    offset: number
  ): Promise<Product[]> {
    // Firestore doesn't support LIKE queries natively.
    // Fetch active products and filter in memory.
    const snapshot = await collection
      .where("isDeleted", "==", false)
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const lowerQuery = query.toLowerCase();
    const filtered = snapshot.docs
      .map(doc => ({ ...doc.data(), id: doc.id } as Product))
      .filter(
        p =>
          p.productName?.toLowerCase().includes(lowerQuery) ||
          p.brand?.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery)
      );

    return filtered.slice(offset, offset + limit);
  },

  async insert(
    data: {
      productName: string;
      description?: string | null;
      price: string | number;
      stockQuantity?: number;
      imageURL?: string | null;
      brand?: string | null;
      model?: string | null;
      specifications?: string | null;
      isActive?: boolean;
    }
  ): Promise<string> {
    const now = new Date();
    const docRef = await collection.add({
      productName: data.productName,
      description: data.description ?? null,
      price: String(data.price),
      stockQuantity: data.stockQuantity ?? 0,
      imageURL: data.imageURL ?? null,
      brand: data.brand ?? null,
      model: data.model ?? null,
      specifications: data.specifications ?? null,
      isActive: data.isActive ?? true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  async update(productID: string, data: Partial<Product>): Promise<void> {
    const docRef = collection.doc(productID);
    await docRef.update({
      ...data,
      updatedAt: new Date(),
    });
  },

  async softDelete(productID: string): Promise<void> {
    await collection.doc(productID).update({ 
      isDeleted: true,
      updatedAt: new Date()
    });
  },

  async tryDecrementStock(productID: string, quantity: number): Promise<boolean> {
    const docRef = collection.doc(productID);
    
    try {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);
        if (!doc.exists) throw new Error("Document does not exist!");
        
        const data = doc.data() as Product;
        if (data.isDeleted || !data.isActive || data.stockQuantity < quantity) {
          throw new Error("Cannot decrement stock.");
        }
        
        transaction.update(docRef, { stockQuantity: data.stockQuantity - quantity });
      });
      return true;
    } catch (error) {
      console.error("Transaction failed: ", error);
      return false;
    }
  },
};
