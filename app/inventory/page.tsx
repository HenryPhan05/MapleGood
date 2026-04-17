"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ImagePlus, Loader2, X } from "lucide-react";

const ACCENT = "#E0A800";

export default function InventoryProductRegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault(); 
    setImageFile(null);
    setImagePreview(null);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const productName = formData.get("productName") as string;
    const unitPrice = formData.get("unitPrice") as string;
    const stockLevel = formData.get("stockLevel") as string;
    const description = formData.get("description") as string;

    if (!productName || !unitPrice || !stockLevel) {
      setError("Please fill out all required fields (Name, Price, Stock).");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageURL = null;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Failed to upload the image.");
        }

        imageURL = uploadData.url;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          price: unitPrice, 
          stockQuantity: Number(stockLevel),
          description,
          imageURL, 
          isActive: true, 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      form.reset();
      
      setImageFile(null);
      setImagePreview(null);
      setSuccessMessage("Product added successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      router.refresh(); 
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
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

      {/* Success Message Display */}
      {successMessage && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <strong>Success: </strong> {successMessage}
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
            
            {imagePreview ? (
              <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                <button
                  onClick={removeImage}
                  className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imagePreview} 
                  alt="Product Preview" 
                  className="max-h-[250px] rounded-lg object-contain"
                />
                <span className="mt-3 truncate px-4 text-sm font-medium text-gray-600">
                  {imageFile?.name}
                </span>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-14 transition hover:border-gray-400 hover:bg-gray-100">
                <input 
                  type="file" 
                  accept="image/png,image/jpeg,image/webp" 
                  className="sr-only" 
                  onChange={handleImageChange}
                />
                <ImagePlus className="h-12 w-12 text-gray-400" strokeWidth={1.25} />
                <span className="mt-4 text-center font-semibold text-gray-800">
                  Upload Product Image
                </span>
                <span className="mt-1 text-center text-sm text-gray-500">
                  PNG, JPG or WEBP (Max 10MB)
                </span>
              </label>
            )}
          </section>
        </div>
      </form>
    </div>
  );
}