"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";

import Footer from "../components/Footer";
import NavigationBarApp from "../components/NavigationBarApp";
import carImage from "../public/images/categories/carElectronic.png";

const ACCENT = "#E0A800";

const WISHLIST_ITEMS: {
  id: string;
  stock: "in" | "limited" | "out";
}[] = [
  { id: "1", stock: "in" },
  { id: "2", stock: "limited" },
  { id: "3", stock: "out" },
  { id: "4", stock: "in" },
];

function StockBadge({ stock }: { stock: "in" | "limited" | "out" }) {
  if (stock === "in") {
    return (
      <span className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs bg-green-600">
        In Stock
      </span>
    );
  }
  if (stock === "limited") {
    return (
      <span className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs bg-orange-500">
        Limited Stock
      </span>
    );
  }
  return (
    <span className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs bg-red-600">
      Out of Stock
    </span>
  );
}

export default function WishlistPage() {
  const count = WISHLIST_ITEMS.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <NavigationBarApp />
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1
              className="text-3xl font-extrabold sm:text-4xl"
              style={{ color: ACCENT }}
            >
              Your Wishlist
            </h1>
            <p className="mt-2 text-gray-500">
              You have {count} premium items saved for later.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-black shadow-sm transition hover:opacity-90 sm:shrink-0"
            style={{ backgroundColor: ACCENT }}
          >
            <ShoppingCart
              className="h-5 w-5 text-white"
              strokeWidth={2}
              aria-hidden
            />
            Add All to Cart
          </button>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WISHLIST_ITEMS.map((item) => (
            <li key={item.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-4/3 w-full bg-gray-100">
                  <Image
                    src={carImage}
                    alt="Toyota Matrix 2003–2008 head unit"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute left-2 top-2">
                    <StockBadge stock={item.stock} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-black">
                      Toyota Matrix
                    </h2>
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm"
                      aria-label="Remove from wishlist"
                    >
                      <Heart
                        className="h-5 w-5 fill-red-500 text-red-500"
                        aria-hidden
                      />
                    </button>
                  </div>
                  <p className="text-xl font-bold text-black">$199.99</p>
                  <button
                    type="button"
                    disabled={item.stock === "out"}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-black transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <ShoppingCart
                      className="h-4 w-4 text-white"
                      strokeWidth={2}
                      aria-hidden
                    />
                    Add to Cart
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
}
