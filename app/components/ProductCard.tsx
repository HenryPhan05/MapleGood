"use client";

import { Star } from "lucide-react";
import Image from "next/image";

const ACCENT = "#E0A800";

export type ProductCardProps = {
  id: string;
  categoryLabel: string;
  title: string;
  price: number;
  rating: number;
  imageSrc: string;
  imageAlt: string;
};

export default function ProductCard({
  categoryLabel,
  title,
  price,
  rating,
  imageSrc,
  imageAlt,
}: ProductCardProps) {
  return (
    <article className="flex flex-col rounded-xl bg-white shadow-md overflow-hidden border border-gray-100">
      <div className="relative aspect-4/3 w-full bg-gray-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div
          className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md bg-white/95 px-2 py-1 text-sm font-semibold text-black shadow-sm"
          aria-label={`Rating ${rating}`}
        >
          <Star
            className="h-4 w-4 fill-[#E0A800] text-[#E0A800]"
            aria-hidden
          />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: ACCENT }}
        >
          {categoryLabel}
        </p>
        <h3 className="line-clamp-2 min-h-10 text-base font-bold text-black">
          {title}
        </h3>
        <p className="text-lg font-bold text-black">
          ${price.toFixed(2)}
        </p>
        <button
          type="button"
          className="mt-auto w-full rounded-lg py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          add to cart
        </button>
      </div>
    </article>
  );
}
