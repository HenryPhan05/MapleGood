import { db } from "@/lib/firebase";
import { StaticImageData } from "next/image";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  setDoc,
  increment,
} from 'firebase/firestore';

export type CartItemType = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  quantity: number;
  image: string | StaticImageData;
  rate: number;
};
export const addToCart = async (userId: string, product: CartItem) => {
  const ref = doc(db, "users", userId, "carts", product.id);

  await setDoc(ref, {
    ...product,
    name: product.name,
    price: product.price ?? 0,
    quantity: increment(1),
  }, { merge: true }
  );
};


export const getCart = async (userId: string) => {
  try {
    const cartRef = collection(db, 'users', userId, 'carts');
    const snapshot = await getDocs(cartRef);
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  }
  catch (err) {
    throw err;
  }
};



export const removeFromCart = async (userId: string, productId: string) => {
  const ref = doc(db, "users", userId, "carts", productId);
  await deleteDoc(doc(db, "users", userId, "carts", productId));
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const ref = doc(db, "users", userId, "carts", productId);

  await setDoc(ref, { quantity }, { merge: true });
};
