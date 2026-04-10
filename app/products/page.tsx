"use client";

import { Filter, ChevronDown } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import NavigationBarApp from "../components/NavigationBarApp";
import ProductCard, { type ProductCardProps } from "../components/ProductCard";

const ACCENT = "#E0A800";

const DEMO_PRODUCTS: ProductCardProps[] = [
  {
    id: "1",
    categoryLabel: "CAR SCREENS",
    title:
      'Ultra-HD 10" Wireless Apple CarPlay & Android Auto touchscreen receiver',
    price: 249.99,
    rating: 4.9,
    imageSrc:
      "https://images.unsplash.com/photo-1619400139519-43d8f8f5e0c0?w=800&q=80",
    imageAlt: "Car touchscreen display",
  },
  {
    id: "2",
    categoryLabel: "SPEAKERS",
    title: 'Premium 6.5" Component Speaker System - 300W Peak',
    price: 129.5,
    rating: 4.7,
    imageSrc:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    imageAlt: "Car speakers",
  },
  {
    id: "3",
    categoryLabel: "CAR SCREENS",
    title: "Toyota Matrix 2003 - 2008 dash kit & screen bundle",
    price: 189.0,
    rating: 4.8,
    imageSrc:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
    imageAlt: "Car interior screen",
  },
  {
    id: "4",
    categoryLabel: "DASH CAMS",
    title: "4K Front & Rear Dash Cam with Night Vision & GPS",
    price: 189.0,
    rating: 4.8,
    imageSrc:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
    imageAlt: "Dash camera",
  },
];

function ProductsListingContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q")?.trim() ?? "";
  const resultLabel = queryParam || "Car Electronics";

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("rating");

  const filtered = useMemo(() => {
    const min = minPrice === "" ? null : Number(minPrice.replace(/[^0-9.]/g, ""));
    const max = maxPrice === "" ? null : Number(maxPrice.replace(/[^0-9.]/g, ""));
    let list = [...DEMO_PRODUCTS];
    if (min !== null && Number.isFinite(min)) {
      list = list.filter((p) => p.price >= min);
    }
    if (max !== null && Number.isFinite(max)) {
      list = list.filter((p) => p.price <= max);
    }
    if (sort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [minPrice, maxPrice, sort]);

  return (
    <>
      <div className="sticky top-0 z-50">
        <NavigationBarApp initialSearchQuery={queryParam} />
      </div>

      <main className="min-h-screen bg-gray-50 pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <h1
            className="mb-2 text-2xl font-bold sm:text-3xl"
            style={{ color: ACCENT }}
          >
            Result for: {resultLabel}
          </h1>
          <section
            className="mb-10 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
            aria-label="Filters"
          >
            <div className="flex flex-1 flex-col gap-2 sm:min-w-[180px]">
              <label className="text-xs font-bold text-black">SORT</label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-black outline-none focus:border-gray-500"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price Low - High</option>
                  <option value="price_desc">Price High - Low</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600"
                  aria-hidden
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:min-w-[140px]">
              <label className="text-xs font-bold text-black">MIN PRICE</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="$ 0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black outline-none focus:border-gray-500"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:min-w-[140px]">
              <label className="text-xs font-bold text-black">MAX PRICE</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="$ 100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black outline-none focus:border-gray-500"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-2.5 font-bold text-black transition hover:opacity-90 sm:mb-0.5"
              style={{ backgroundColor: ACCENT }}
            >
              <Filter className="h-5 w-5" aria-hidden />
              Find
            </button>
          </section>

          {filtered.length === 0 ? (
            <p className="rounded-lg bg-gray-100 p-6 text-center text-gray-700">
              No products match your filters. Try adjusting min/max price.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <li key={product.id}>
                  <ProductCard {...product} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

function ProductsFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="px-4 py-3"
        style={{ backgroundColor: "#E0A800" }}
        aria-hidden
      >
        <div className="mx-auto h-24 max-w-7xl animate-pulse rounded-lg bg-white/30" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="mb-4 h-9 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function ProductsListingPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsListingContent />
    </Suspense>
  );
}
