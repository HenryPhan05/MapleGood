"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Warehouse,
  Loader2,
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

const ACCENT = "#E0A800";

function donutGradient(segments: { color: string; sweepDeg: number }[]) {
  if (!segments || segments.length === 0) return "conic-gradient(#f3f4f6 0deg 360deg)"; 
  let angle = 0;
  const stops = segments.map((s) => {
    const from = angle;
    angle += s.sweepDeg;
    return `${s.color} ${from}deg ${angle}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function DonutPlaceholder({
  title,
  center,
  legend,
  segments,
}: {
  title: string;
  center: string;
  legend: { label: string; pct: string; color: string }[];
  segments: { color: string; sweepDeg: number }[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div
          className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full p-2"
          style={{ background: donutGradient(segments) }}
        >
          <div className="flex h-22 w-22 items-center justify-center rounded-full bg-white text-center text-[11px] font-bold leading-tight text-gray-700 sm:text-xs">
            {center}
          </div>
        </div>
        <ul className="w-full space-y-2 text-sm">
          {legend.length > 0 ? (
            legend.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2 text-gray-700">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
                <span className="font-semibold text-gray-900">{item.pct}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic">No data available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  
  // State for dynamically loaded top-level data
  const [metrics, setMetrics] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState<any>({ center: "0", segments: [], legend: [] });
  const [inventoryHealth, setInventoryHealth] = useState<any>({ center: "0", segments: [], legend: [] });
  const [categoryMix, setCategoryMix] = useState<any>({ center: "0", segments: [], legend: [] });
  
  // State for Inventory Management
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ price: 0, stockQuantity: 0 });

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDashboardData() {
    try {
      const ordersRef = collection(db, "orders");
      const productsRef = collection(db, "products");

      const [ordersSnap, productsSnap] = await Promise.all([
        getDocs(ordersRef),
        getDocs(productsRef)
      ]);

      const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Save products to inventory state
      setInventoryItems(products);

      const totalOrders = orders.length;
      const totalProducts = products.length;
      const inventoryInStock = products.reduce((acc, p) => acc + (p.stockQuantity ?? p.stock ?? 0), 0);

      setMetrics([
        { label: "Total Orders Sold", value: totalOrders.toLocaleString(), icon: ShoppingBag },
        { label: "Inventory In Stock", value: inventoryInStock.toLocaleString(), icon: Warehouse },
        { label: "Products In Store", value: totalProducts.toLocaleString(), icon: Package },
      ]);

      // Helper to format Donut chart data
      const createDonutData = (counts: number[], colors: string[], labels: string[], total: number) => {
        let segments: any[] = [];
        let legend: any[] = [];
        counts.forEach((count, i) => {
          if (count > 0 && total > 0) {
            const pct = (count / total) * 100;
            segments.push({ color: colors[i], sweepDeg: (pct / 100) * 360 });
            legend.push({ label: labels[i], pct: `${Math.round(pct)}%`, color: colors[i] });
          }
        });
        return { segments, legend };
      };

      // Order Status Donut
      let delivered = 0, inTransit = 0, processing = 0;
      orders.forEach(o => {
        const status = (o.status || "").toLowerCase();
        if (status === "delivered") delivered++;
        else if (status === "in transit") inTransit++;
        else processing++;
      });

      const orderData = createDonutData(
        [delivered, inTransit, processing],
        [ACCENT, "#3b82f6", "#4b5563"],
        ["Delivered", "In Transit", "Processing"],
        totalOrders
      );
      
      setOrderStatus({
        center: totalOrders > 0 ? `${totalOrders >= 1000 ? (totalOrders/1000).toFixed(1) + 'k' : totalOrders} TOTAL` : "0",
        ...orderData
      });

      // Inventory Health Donut
      let inStock = 0, lowStock = 0, outOfStock = 0;
      products.forEach(p => {
        const stock = p.stockQuantity ?? p.stock ?? 0;
        if (stock === 0) outOfStock++;
        else if (stock <= 10) lowStock++; 
        else inStock++;
      });

      const healthData = createDonutData(
        [inStock, lowStock, outOfStock],
        [ACCENT, "#3b82f6", "#ec4899"],
        ["In Stock", "Low Stock", "Out of Stock"],
        totalProducts
      );

      setInventoryHealth({
        center: outOfStock > 0 ? "ATTENTION" : "OK",
        ...healthData
      });

      // Category Mix Donut
      const categoryCounts: Record<string, number> = {};
      products.forEach(p => {
        const cat = p.category || "Other";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      
      const sortedCats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
      const catColors = [ACCENT, "#ca8a04", "#fde047"];
      let catSegments: any[] = [];
      let catLegend: any[] = [];
      
      sortedCats.forEach(([label, count], i) => {
        const pct = (count / totalProducts) * 100;
        catSegments.push({ color: catColors[i], sweepDeg: (pct / 100) * 360 });
        catLegend.push({ label, pct: `${Math.round(pct)}%`, color: catColors[i] });
      });

      setCategoryMix({
        center: totalProducts > 0 ? "100%" : "0%",
        segments: catSegments,
        legend: catLegend
      });

    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  }

  // --- INVENTORY MANAGEMENT ACTIONS ---

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      price: product.price || 0,
      stockQuantity: product.stockQuantity ?? product.stock ?? 0
    });
  };

  const saveEdit = async (id: string) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        price: Number(editForm.price),
        stockQuantity: Number(editForm.stockQuantity)
      });
      
      setInventoryItems(prev => prev.map(p => 
        p.id === id ? { ...p, price: Number(editForm.price), stockQuantity: Number(editForm.stockQuantity) } : p
      ));
      setEditingId(null);
      
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      await deleteDoc(doc(db, "products", id));
      setInventoryItems(prev => prev.filter(p => p.id !== id));
      
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-10 w-10 animate-spin text-[#E0A800]" />
          <p className="mt-4 text-sm font-medium">Loading systems overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <h1
        className="text-2xl font-extrabold tracking-tight sm:text-3xl"
        style={{ color: ACCENT }}
      >
        Systems Overview
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${ACCENT}33` }}
            >
              <Icon className="h-6 w-6 text-black" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {label}
              </p>
              <p className="text-2xl font-bold text-black">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <DonutPlaceholder title="Order Status" {...orderStatus} />
        <DonutPlaceholder title="Inventory Health" {...inventoryHealth} />
        <DonutPlaceholder title="Category Mix" {...categoryMix} />
      </div>

      {/* --- MANAGE INVENTORY SECTION --- */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Manage Inventory</h2>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {inventoryItems.length} Products
          </span>
        </div>
        
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 pr-4 font-semibold">PRODUCT ID</th>
                <th className="pb-3 pr-4 font-semibold">NAME / CATEGORY</th>
                <th className="pb-3 pr-4 font-semibold">PRICE</th>
                <th className="pb-3 pr-4 font-semibold">STOCK QUANTITY</th>
                <th className="pb-3 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.length > 0 ? (
                inventoryItems.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-semibold" style={{ color: ACCENT }}>
                      #{product.id.substring(0, 6).toUpperCase()}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900">{product.name || product.productName || "Unnamed Product"}</p>
                      <p className="text-xs text-gray-500">{product.category || "Uncategorized"}</p>
                    </td>
                    <td className="py-3 pr-4">
                      {editingId === product.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            className="w-20 rounded border text-gray-600 border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#E0A800]"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value)})}
                          />
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          ${Number(product.price || 0).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          className="w-20 rounded border text-gray-600 border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#E0A800]"
                          value={editForm.stockQuantity}
                          onChange={(e) => setEditForm({ ...editForm, stockQuantity: parseInt(e.target.value)})}
                        />
                      ) : (
                        <span className={`font-semibold ${
                          (product.stockQuantity ?? product.stock ?? 0) <= 5 ? "text-red-500" : "text-gray-900"
                        }`}>
                          {product.stockQuantity ?? product.stock ?? 0}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {editingId === product.id ? (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => saveEdit(product.id)} 
                            className="text-green-600 hover:text-green-800 font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)} 
                            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => startEdit(product)} 
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="text-red-600 hover:text-red-800 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No products found in the inventory system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}