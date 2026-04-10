"use client";

import { useEffect, useState } from "react";
import NavigationBarApp from "../../components/NavigationBarApp";
import Footer from "../../components/Footer";

import { Trash2, Plus, Minus } from "lucide-react";
import carElectronicsImage from "../../public/images/categories/carElectronic.png";
import headphoneImage from "../../public/images/products/headphone.png";
import phoneImage from "../../public/images/products/phone.png";
import Image from "next/image";
type CartItem = {
  id: string,
  name: string,
  category: string,
  price: number,
  description: string,
  quantity: number,
  image: any,
  rate: number,
}

export default function CartPage() {
  // Sample cart data matching the products on the homepage
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Mapple Guard 4K",
      category: "Car Screens",
      price: 249.99,
      description: "Dual-channel dash cam",
      quantity: 3,
      image: carElectronicsImage,
      rate: 4
    },
    {
      id: "2",
      name: "Precision X1 Radar",
      category: "Audio Equipment",
      price: 299.00,
      description: "Long-range 360 radar detection",
      quantity: 10,
      image: headphoneImage,
      rate: 4.5,
    },
    {
      id: "3",
      name: "Connect Pro 10",
      category: "Phone Accessories",
      price: 299.99,
      description: "wireless smartphone integration",
      quantity: 3,
      image: phoneImage,
      rate: 4
    },
  ]);

  const updateQuantity = (cartItemID: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemID) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemID: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemID));
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
        <h1 className="mb-8 text-4xl font-extrabold" style={{ color: "#E0A800" }}>
          Your Cart
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
          <>
            {/**name table */}
            <div className="flex flex-row gap-8 w-295 h-10 bg-gray-100 ">
              <p className="text-xl text-gray-600 font-bold ml-5 w-190">Product</p>
              <p className="text-xl text-gray-600 font-bold">Quantity</p>
              <p className="text-xl text-gray-600 font-bold w-[100]px ml-7">Price</p>
              <p className="text-xl text-gray-600 font-bold w-[100]px ml-10">Total</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 w-400">
              {/* Cart Items */}
              <div className="flex-1 flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 flex items-center gap-6"
                  >
                    {/* Product image placeholder */}
                    <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Image src={item.image} alt={item.name} />
                    </div>

                    {/* Product info */}
                    <div className="w-150">
                      <h2 className="text-xl font-bold text-black">{item.name}</h2>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                      >
                        <Minus size={18} color="black" />
                      </button>
                      <span className="text-xl font-bold w-8 text-center text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-10 h-10 rounded  flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                        style={{ backgroundColor: "#E8A800" }}
                      >
                        <Plus size={18} className="font-bold" />
                      </button>
                    </div>
                    {/**item price */}
                    <div className="text-right w-[100]px">
                      <p className="text-xl font-bold text-gray-400">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    {/* Item subtotal */}
                    <div className="text-right w-[100px]">
                      <p className="text-xl font-bold text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.id)}
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
          </>
        )}
      </div>


      <Footer />
    </div>
  );
}