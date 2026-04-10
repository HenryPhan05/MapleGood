import { db } from "@/lib/firebase-admin";
import type { CategoryRow } from "@/types/db"; // You may want to rename 'CategoryRow' to 'Category' in your types

const collection = db.collection("categories");

export const categoryDao = {
  async findById(categoryID: string): Promise<CategoryRow | null> {
    const doc = await collection.doc(categoryID).get();
    if (!doc.exists) return null;
    
    const data = doc.data() as CategoryRow;
    if (data.isDeleted) return null;
    
    return { ...data, categoryID: doc.id };
  },

  async list(limit: number, offset: number): Promise<CategoryRow[]> {
    const snapshot = await collection
      .where("isDeleted", "==", false)
      // Note: Firestore string sorting is lexicographical
      .orderBy("__name__", "asc") 
      .offset(offset)
      .limit(limit)
      .get();
      
    return snapshot.docs.map(doc => ({ ...doc.data(), categoryID: doc.id } as CategoryRow));
  },

  async insert(data: {
    categoryName: string;
    description?: string | null;
    parentCategoryID?: string | null;
  }): Promise<string> {
    const docRef = await collection.add({
      categoryName: data.categoryName,
      description: data.description ?? null,
      parentCategoryID: data.parentCategoryID ?? null,
      isDeleted: false,
    });
    return docRef.id;
  },

  async update(
    categoryID: string,
    data: Partial<{
      categoryName: string;
      description: string | null;
      parentCategoryID: string | null;
    }>
  ): Promise<void> {
    if (Object.keys(data).length === 0) return;
    
    await collection.doc(categoryID).update(data);
  },

  async softDelete(categoryID: string): Promise<void> {
    await collection.doc(categoryID).update({ isDeleted: true });
  },
};
