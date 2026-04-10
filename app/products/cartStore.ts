import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  quantity: number;
  image: any;
  rate: number;
};

type CartState = {
  cartItems: CartItem[];
  loaded: boolean;
  addToCart: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  loadCart: () => Promise<void>;
};

/* ── helpers to sync cart to Firestore ────────────────── */

function getUserId(): string | null {
  return auth.currentUser?.uid ?? null;
}

async function saveCartToFirestore(items: CartItem[]) {
  const uid = getUserId();
  if (!uid) return;
  try {
    await setDoc(doc(db, "carts", uid), { items, updatedAt: new Date() });
  } catch (err) {
    console.error("Failed to save cart:", err);
  }
}

/* ── store ────────────────────────────────────────────── */

export const UseCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  loaded: false,

  loadCart: async () => {
    const uid = getUserId();
    if (!uid) {
      set({ cartItems: [], loaded: true });
      return;
    }
    try {
      const snap = await getDoc(doc(db, "carts", uid));
      if (snap.exists()) {
        const data = snap.data();
        set({ cartItems: data.items ?? [], loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
      set({ loaded: true });
    }
  },

  addToCart: (item) => {
    set((state) => {
      const existing = state.cartItems.find((i) => i.id === item.id);
      let newItems: CartItem[];

      if (existing) {
        newItems = state.cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...state.cartItems, { ...item, quantity: 1 }];
      }

      saveCartToFirestore(newItems);
      return { cartItems: newItems };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const newItems = state.cartItems.filter((i) => i.id !== id);
      saveCartToFirestore(newItems);
      return { cartItems: newItems };
    });
  },

  updateQuantity: (id, delta) => {
    set((state) => {
      const newItems = state.cartItems.map((i) => {
        if (i.id === id) {
          const newQty = i.quantity + delta;
          return newQty < 1 ? i : { ...i, quantity: newQty };
        }
        return i;
      });
      saveCartToFirestore(newItems);
      return { cartItems: newItems };
    });
  },
}));

/* ── auto-load cart when auth state changes ───────────── */

if (typeof window !== "undefined") {
  onAuthStateChanged(auth, () => {
    UseCartStore.getState().loadCart();
  });
}
