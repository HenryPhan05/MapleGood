"use client";

import { useEffect, useState } from "react";
import NavigationBarApp from "../../components/NavigationBarApp";
import Footer from "../../components/Footer";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItem {
  cartItemID: number;
  cartID: number;
  productID: number;
  quantity: number;
  productName: string;
  price: number;
  imageURL: string | null;
}

export default function CartPage() {
  // Sample cart data matching the products on the homepage
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemID: 1,
      cartID: 1,
      productID: 1,
      quantity: 1,
      productName: "Mapple Guard 4K",
      price: 249.99,
      imageURL: null,
    },
    {
      cartItemID: 2,
      cartID: 1,
      productID: 2,
      quantity: 2,
      productName: "Precision X1 Radar",
      price: 299.0,
      imageURL: null,
    },
    {
      cartItemID: 3,
      cartID: 1,
      productID: 3,
      quantity: 1,
      productName: "Connect Pro 10",
      price: 299.99,
      imageURL: null,
    },
  ]);

  const updateQuantity = (cartItemID: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemID === cartItemID) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemID: number) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemID !== cartItemID));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="sticky top-0 bg-white" style={{ zIndex: 1000 }}>
        <NavigationBarApp />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold mb-8" style={{ color: "#E8A800" }}>
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center">
            <p className="text-2xl text-gray-500 mb-6">Your cart is empty</p>
            <a
              href="/user"
              className="inline-block px-8 py-3 rounded-2xl text-black font-bold text-lg hover:opacity-80"
              style={{ backgroundColor: "#E8A800" }}
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemID}
                  className="bg-white rounded-2xl p-6 flex items-center gap-6"
                >
                  {/* Product image placeholder */}
                  <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-sm">Image</span>
                  </div>

                  {/* Product info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-black">{item.productName}</h2>
                    <p className="text-gray-500 mt-1">Product ID: {item.productID}</p>
                    <p className="text-2xl font-bold text-black mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.cartItemID, -1)}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-bold w-8 text-center text-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemID, 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Item subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-xl font-bold text-black">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.cartItemID)}
                    className="text-red-500 hover:text-red-700 cursor-pointer p-2"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[380px]">
              <div className="bg-white rounded-2xl p-8 sticky top-[200px]">
                <h2 className="text-2xl font-extrabold text-black mb-6">Order Summary</h2>

                <div className="flex justify-between mb-4">
                  <span className="text-gray-500 text-lg">
                    Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="text-black font-bold text-lg">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-gray-500 text-lg">Tax (13%)</span>
                  <span className="text-black font-bold text-lg">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-gray-500 text-lg">Shipping</span>
                  <span className="text-green-600 font-bold text-lg">Free</span>
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="flex justify-between mb-8">
                  <span className="text-black text-xl font-extrabold">Total</span>
                  <span className="text-black text-xl font-extrabold">${total.toFixed(2)}</span>
                </div>

                <button
                  className="w-full py-4 rounded-2xl text-black font-bold text-xl hover:opacity-80 cursor-pointer"
                  style={{ backgroundColor: "#E8A800" }}
                >
                  Proceed to Checkout
                </button>

                <a
                  href="/user"
                  className="block text-center mt-4 text-gray-500 hover:text-black underline text-lg"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
