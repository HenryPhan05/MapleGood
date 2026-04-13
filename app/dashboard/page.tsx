import {
  Package,
  ShoppingBag,
  Warehouse,
} from "lucide-react";

const ACCENT = "#E0A800";

const METRICS = [
  { label: "Total Orders Sold", value: "1,284", icon: ShoppingBag },
  { label: "Inventory In Stock", value: "4,892", icon: Warehouse },
  { label: "Products In Store", value: "3,400", icon: Package },
] as const;

const ROWS = [
  {
    id: "#MG-8291",
    product: "Ultra-HD Car Screen X1",
    customer: "Alex M.",
    date: "Oct 14, 2023",
    amount: "$1,250.00",
  },
  {
    id: "#MG-8290",
    product: "SonicBlast Gen 2 Speakers",
    customer: "Jordan K.",
    date: "Oct 13, 2023",
    amount: "$329.00",
  },
  {
    id: "#MG-8288",
    product: "4K Dash Cam Pro",
    customer: "Sam R.",
    date: "Oct 12, 2023",
    amount: "$189.00",
  },
  {
    id: "#MG-8285",
    product: "USB-C Fast Charger",
    customer: "Chris P.",
    date: "Oct 11, 2023",
    amount: "$89.00",
  },
] as const;

function donutGradient(segments: { color: string; sweepDeg: number }[]) {
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
          {legend.map((item) => (
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
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <h1
        className="text-2xl font-extrabold tracking-tight sm:text-3xl"
        style={{ color: ACCENT }}
      >
        Systems Overview
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {METRICS.map(({ label, value, icon: Icon }) => (
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
        <DonutPlaceholder
          title="Order Status"
          center="1.2k TOTAL"
          segments={[
            { color: ACCENT, sweepDeg: 216 },
            { color: "#3b82f6", sweepDeg: 90 },
            { color: "#4b5563", sweepDeg: 54 },
          ]}
          legend={[
            { label: "Delivered", pct: "60%", color: ACCENT },
            { label: "In Transit", pct: "25%", color: "#3b82f6" },
            { label: "Processing", pct: "15%", color: "#4b5563" },
          ]}
        />
        <DonutPlaceholder
          title="Inventory Health"
          center="OK"
          segments={[
            { color: ACCENT, sweepDeg: 270 },
            { color: "#3b82f6", sweepDeg: 54 },
            { color: "#ec4899", sweepDeg: 36 },
          ]}
          legend={[
            { label: "In Stock", pct: "75%", color: ACCENT },
            { label: "Low Stock", pct: "15%", color: "#3b82f6" },
            { label: "Out of Stock", pct: "10%", color: "#ec4899" },
          ]}
        />
        <DonutPlaceholder
          title="Category Mix"
          center="100%"
          segments={[
            { color: ACCENT, sweepDeg: 162 },
            { color: "#ca8a04", sweepDeg: 126 },
            { color: "#fde047", sweepDeg: 72 },
          ]}
          legend={[
            { label: "Car Screens", pct: "45%", color: ACCENT },
            { label: "Speakers", pct: "35%", color: "#ca8a04" },
            { label: "Phone Acc.", pct: "20%", color: "#fde047" },
          ]}
        />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 pr-4 font-semibold">ORDER ID</th>
                <th className="pb-3 pr-4 font-semibold">PRODUCT</th>
                <th className="pb-3 pr-4 font-semibold">CUSTOMER</th>
                <th className="pb-3 pr-4 font-semibold">DATE</th>
                <th className="pb-3 font-semibold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.id} className="border-b border-gray-100">
                  <td
                    className="py-3 pr-4 font-semibold"
                    style={{ color: ACCENT }}
                  >
                    {row.id}
                  </td>
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    {row.product}
                  </td>
                  <td className="py-3 pr-4 text-gray-700">{row.customer}</td>
                  <td className="py-3 pr-4 text-gray-600">{row.date}</td>
                  <td className="py-3 font-semibold text-gray-900">
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm text-gray-500 sm:flex-row">
          <span>SHOWING 4 OF 1,284 ENTRIES</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50"
              aria-label="Previous page"
            >
              ‹
            </button>
            <span className="px-2 font-medium text-gray-800">1</span>
            <button
              type="button"
              className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
