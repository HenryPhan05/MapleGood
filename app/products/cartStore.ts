import { create } from "zustand";

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
  addToCart: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
};

export const UseCartStore = create<CartState>((set) => ({
  cartItems: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cartItems.find((i) => i.id === item.id);

      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        cartItems: [...state.cartItems, { ...item, quantity: 1 }],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, delta) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) => {
        if (i.id === id) {
          const newQty = i.quantity + delta;
          return newQty < 1 ? i : { ...i, quantity: newQty };
        }
        return i;
      }),
    })),
}));
