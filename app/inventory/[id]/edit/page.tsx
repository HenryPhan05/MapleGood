"use client";

import { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ImagePlus } from "lucide-react";

const ACCENT = "#E0A800";

const CIRCUIT_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08c6c6d1?w=400&q=80",
] as const;

const TECH_COPY = `The Vortex ECU Pro-X features a dual-core 400MHz processor with deterministic fuel and ignition mapping, wideband lambda control, and onboard data logging. Supports CAN bus integration, flex-fuel blending, and knock-aware timing strategies. Designed for high-performance street and track applications with sealed automotive-grade connectors and extended temperature range (-40°C to +105°C).`;

export default function EditProductPage() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Inventory &gt; ECU Units &gt;{" "}
            <span style={{ color: ACCENT }}>Edit Product</span>
          </p>
          <h1 className="mt-2 text-3xl font-bold text-black">
            Vortex ECU Pro-X
          </h1>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/inventory"
            className="rounded-xl border-2 bg-white px-5 py-2.5 text-sm font-bold transition hover:bg-gray-50"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="edit-product-form"
            className="rounded-xl px-6 py-2.5 text-sm font-bold text-black transition hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            Update Product
          </button>
        </div>
      </div>

      <form id="edit-product-form" onSubmit={onSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-gray-800">
              Product Specifications
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="edit-productName"
                  className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                >
                  Product Name
                </label>
                <input
                  id="edit-productName"
                  name="productName"
                  type="text"
                  defaultValue="Vortex ECU Pro-X"
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-category"
                  className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                >
                  Category
                </label>
                <div className="relative">
                  <select
                    id="edit-category"
                    name="category"
                    defaultValue="ecu"
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 pr-10 text-black outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="ecu">Engine Control Units</option>
                    <option value="car-screens">Car Screens</option>
                    <option value="speakers">Speakers</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600"
                    aria-hidden
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-sku"
                  className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                >
                  SKU ID
                </label>
                <input
                  id="edit-sku"
                  name="sku"
                  type="text"
                  defaultValue="MG-ECU-990-PX"
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-price"
                    className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                  >
                    Unit Price (USD)
                  </label>
                  <div className="flex rounded-xl border border-gray-200 bg-gray-100">
                    <span className="flex items-center pl-4 text-gray-600">
                      $
                    </span>
                    <input
                      id="edit-price"
                      name="unitPrice"
                      type="text"
                      inputMode="decimal"
                      defaultValue="1249.00"
                      className="w-full rounded-r-xl bg-transparent py-3 pr-4 text-black outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="edit-stock"
                    className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                  >
                    Stock Level
                  </label>
                  <div className="flex rounded-xl border border-gray-200 bg-gray-100">
                    <input
                      id="edit-stock"
                      name="stockLevel"
                      type="number"
                      min={0}
                      defaultValue={42}
                      className="min-w-0 flex-1 rounded-l-xl bg-transparent px-4 py-3 text-black outline-none"
                    />
                    <span className="flex items-center pr-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-800">
              <ImagePlus className="h-5 w-5" style={{ color: ACCENT }} />
              Visual Assets
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {CIRCUIT_IMAGES.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={src}
                    alt={`Product asset ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition hover:border-gray-400 hover:bg-gray-100">
              <input type="file" accept="image/*" className="sr-only" />
              <ImagePlus className="h-10 w-10 text-gray-400" strokeWidth={1.25} />
              <span className="mt-2 text-xs font-bold uppercase tracking-wide text-gray-600">
                Upload new file
              </span>
            </label>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
            Technical Description
          </h2>
          <textarea
            name="description"
            rows={8}
            defaultValue={TECH_COPY}
            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none focus:ring-2 focus:ring-black/10"
          />
        </section>
      </form>
    </div>
  );
}
