"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UseCartStore } from "@/app/products/cartStore";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Check, Star, ChevronLeft } from "lucide-react";
import NavigationBarApp from "../../components/NavigationBarApp";
import Footer from "../../components/Footer";

const ACCENT = "#E0A800";

/* ── types ───────────────────────────────────────────── */

type Product = {
  id: string;
  productName: string;
  description: string | null;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  imageURL: string | null;
  brand: string | null;
  model: string | null;
  specifications: string | null;
  rating: number;
};

type Review = {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  verified: boolean;
};

/* ── helpers ─────────────────────────────────────────── */

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-[#E0A800] text-[#E0A800]" : "text-gray-300"}
        />
      ))}
    </span>
  );
}

function parseFeatures(specs: string | null): string[] {
  if (!specs) return [];
  try {
    const parsed = JSON.parse(specs);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "object") return Object.values(parsed).map(String);
  } catch {
    return specs.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/* ── page ────────────────────────────────────────────── */

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = UseCartStore((s) => s.addToCart);

  /* fetch product */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "products", productId));
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        const d = snap.data();
        setProduct({
          id: snap.id,
          productName: d.productName ?? "",
          description: d.description ?? null,
          price: Number(d.price ?? 0),
          originalPrice: d.originalPrice ? Number(d.originalPrice) : undefined,
          stockQuantity: Number(d.stockQuantity ?? 0),
          imageURL: d.imageURL ?? null,
          brand: d.brand ?? null,
          model: d.model ?? null,
          specifications: d.specifications ?? null,
          rating: Number(d.rating ?? 0),
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  /* fetch reviews */
  useEffect(() => {
    async function loadReviews() {
      try {
        const q = query(collection(db, "reviews"), where("productID", "==", productId));
        const snap = await getDocs(q);
        setReviews(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              customerName: data.customerName ?? "Anonymous",
              rating: Number(data.rating ?? 5),
              reviewText: data.reviewText ?? "",
              createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
              verified: data.verified ?? true,
            };
          })
        );
      } catch {
        /* reviews are optional */
      }
    }
    loadReviews();
  }, [productId]);

  /* add to cart handler */
  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.productName,
      category: product.brand ?? "",
      price: product.price,
      description: product.description ?? "",
      quantity: 1,
      image: product.imageURL ?? "/images/products/placeholder.png",
      rate: product.rating,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  /* derived values */
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product?.rating ?? 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { star, pct };
  });

  const images = product?.imageURL
    ? [product.imageURL, product.imageURL, product.imageURL, product.imageURL]
    : ["/images/products/placeholder.png"];

  const features = parseFeatures(product?.specifications ?? null);

  /* ── loading state ─────────────────────────────────── */

  if (loading) {
    return (
      <>
        <div className="sticky top-0 z-50"><NavigationBarApp /></div>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#E0A800]" />
        </div>
      </>
    );
  }

  /* ── not found ─────────────────────────────────────── */

  if (notFound || !product) {
    return (
      <>
        <div className="sticky top-0 z-50"><NavigationBarApp /></div>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
          <p className="text-2xl font-bold text-gray-800">Product Not Found</p>
          <p className="text-gray-500">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-black transition hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <ChevronLeft size={20} /> Back to Products
          </Link>
        </div>
      </>
    );
  }

  /* ── main render ───────────────────────────────────── */

  return (
    <>
      <div className="sticky top-0 z-50"><NavigationBarApp /></div>

      <main className="min-h-screen bg-gray-50 pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

          {/* ── Product Hero ─────────────────────────── */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

            {/* Images */}
            <div>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white border border-gray-200">
                <Image
                  src={images[selectedImage]}
                  alt={product.productName}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-white transition ${
                      selectedImage === i ? "border-[#E0A800]" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-contain p-1" sizes="80px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              <span className="w-fit rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-[#E74C3C]">
                New Release
              </span>

              <h1 className="text-3xl font-extrabold text-black sm:text-4xl">{product.productName}</h1>

              {product.description && (
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              )}

              {/* Price row */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-black">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                <span className={`ml-auto inline-flex items-center gap-1 text-sm font-semibold ${product.stockQuantity > 0 ? "text-green-600" : "text-red-500"}`}>
                  {product.stockQuantity > 0 ? (<><Check size={16} /> In Stock</>) : "Out of Stock"}
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3.5 text-base font-bold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: addedToCart ? "#16a34a" : ACCENT }}
                >
                  <ShoppingCart size={20} />
                  {addedToCart ? "Added!" : "Add to Cart"}
                </button>
                <button className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3.5 font-bold text-gray-700 transition hover:border-gray-400">
                  <Heart size={20} /> Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* ── Product Details Tab ──────────────────── */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <button className="pb-3 text-base font-bold border-b-2" style={{ color: ACCENT, borderColor: ACCENT }}>
                Product Details
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-xl bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-4">Unprecedented Performance</h2>
                {product.description && (
                  <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                )}
                {features.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={18} className="text-blue-500 flex-shrink-0" />
                        <span className="text-gray-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* right placeholder for product image / spec image */}
              <div className="hidden lg:block rounded-xl bg-gray-200 border border-gray-200" />
            </div>
          </div>

          {/* ── Customer Reviews ─────────────────────── */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-black">Customer Reviews</h2>
              <button className="rounded-lg border-2 px-5 py-2.5 text-sm font-bold transition hover:opacity-90" style={{ borderColor: ACCENT, color: ACCENT }}>
                Write a Review
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Rating summary */}
              <div className="flex flex-col items-center gap-3 rounded-xl bg-white border border-gray-200 p-8 shadow-sm">
                <span className="text-5xl font-extrabold text-black">{avgRating.toFixed(1)}</span>
                <StarDisplay rating={avgRating} size={24} />
                <p className="text-sm text-gray-500">
                  {reviews.length > 0 ? `${reviews.length.toLocaleString()} verified review${reviews.length !== 1 ? "s" : ""}` : "No reviews yet"}
                </p>
                <div className="w-full space-y-2 mt-2">
                  {ratingBreakdown.map(({ star, pct }) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3 font-medium text-gray-700">{star}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACCENT }} />
                      </div>
                      <span className="w-10 text-right text-gray-500">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-xl bg-white border border-gray-200 p-8 text-center shadow-sm">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
                            {r.customerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-black">{r.customerName}</p>
                            <div className="flex items-center gap-2">
                              <StarDisplay rating={r.rating} size={14} />
                              <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        {r.verified && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                            <Check size={14} /> Verified Buyer
                          </span>
                        )}
                      </div>
                      {r.reviewText && <p className="mt-3 text-gray-600 leading-relaxed">{r.reviewText}</p>}
                    </div>
                  ))
                )}
                {reviews.length > 2 && (
                  <p className="mt-4 cursor-pointer text-center text-sm font-bold hover:underline" style={{ color: ACCENT }}>
                    View All {reviews.length.toLocaleString()} Reviews
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
