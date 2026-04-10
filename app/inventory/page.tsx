"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ImagePlus, Loader2 } from "lucide-react";

const ACCENT = "#E0A800";

export default function InventoryProductRegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Extract data from the form
    const formData = new FormData(e.currentTarget);
    const productName = formData.get("productName") as string;
    const unitPrice = formData.get("unitPrice") as string;
    const stockLevel = formData.get("stockLevel") as string;
    const description = formData.get("description") as string;
    
    // Note: If you want to use the category later, you can extract it like this:
    // const category = formData.get("category") as string;

    if (!productName || !unitPrice || !stockLevel) {
      setError("Please fill out all required fields (Name, Price, Stock).");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          price: unitPrice, 
          stockQuantity: Number(stockLevel),
          description,
          isActive: true, // Assuming new products are active by default
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      // Success! Redirect back to inventory list
      router.push("/inventory");
      router.refresh(); 
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Inventory &gt; Add Product
          </p>
          <h1 className="mt-2 text-3xl font-bold text-black">
            Product Registration
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Demo:{" "}
            <Link
              href="/inventory/vortex-ecu-pro-x/edit"
              className="font-medium underline underline-offset-2"
              style={{ color: ACCENT }}
            >
              Open edit product page
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border-2 bg-white px-5 py-2.5 text-sm font-bold transition hover:bg-gray-50"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-registration-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <strong>Error: </strong> {error}
        </div>
      )}

      <form id="product-registration-form" onSubmit={onSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-gray-800">
              Product Specifications
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="productName"
                  className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                >
                  Product Name
                </label>
                <input
                  id="productName"
                  name="productName"
                  required
                  type="text"
                  placeholder="e.g., MK-II Precision Oscilloscope"
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                >
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    defaultValue=""
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 pr-10 text-black outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="" disabled>
                      Select Hardware Class
                    </option>
                    <option value="car-screens">Car Screens</option>
                    <option value="speakers">Speakers</option>
                    <option value="phone-acc">Phone Accessories</option>
                    <option value="dash">Dash Cams</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="unitPrice"
                    className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                  >
                    Unit Price (CAD)
                  </label>
                  <div className="flex rounded-xl border border-gray-200 bg-gray-100 focus-within:ring-2 focus-within:ring-black/10">
                    <span className="flex items-center pl-4 text-gray-600">
                      $
                    </span>
                    <input
                      id="unitPrice"
                      name="unitPrice"
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full rounded-r-xl bg-transparent py-3 pr-4 text-black outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="stockLevel"
                    className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                  >
                    Stock Level
                  </label>
                  <input
                    id="stockLevel"
                    name="stockLevel"
                    required
                    type="number"
                    min={0}
                    defaultValue={0}
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                >
                  Technical Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Detail the operational parameters, voltage requirements, and integration guidelines..."
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>
          </section>

          <section className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-800">
              <ImagePlus className="h-5 w-5" style={{ color: ACCENT }} />
              Visual Assets
            </h2>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-14 transition hover:border-gray-400 hover:bg-gray-100">
              <input type="file" accept="image/png,image/jpeg,.raw" className="sr-only" />
              <ImagePlus className="h-12 w-12 text-gray-400" strokeWidth={1.25} />
              <span className="mt-4 text-center font-semibold text-gray-800">
                Upload Schematic Image
              </span>
              <span className="mt-1 text-center text-sm text-gray-500">
                PNG, JPG or RAW (Max 10MB)
              </span>
            </label>
          </section>
        </div>
      </form>
    </div>
  );
}