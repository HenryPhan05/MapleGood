"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type CategoryItem = {
  id: string;
  label: string;
  subcategories: string[];
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "car",
    label: "Car devices",
    subcategories: ["Car screens", "OBD adapters", "Bluetooth kits"],
  },
  {
    id: "phone",
    label: "Phone accessories",
    subcategories: ["Mounts", "Cables", "Chargers"],
  },
  {
    id: "home",
    label: "Home security",
    subcategories: ["IP cameras", "Door sensors", "Alarms"],
  },
  {
    id: "audio",
    label: "Audio equipment",
    subcategories: [
      "4 channel audio mixer",
      "5 channel audio mixer",
      "7 channel audio mixer",
    ],
  },
];

type Props = {
  categories?: CategoryItem[];
};

export default function CategoryNav({ categories = DEFAULT_CATEGORIES }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-wrap gap-4 border-t border-black/10 pt-2.5 pb-3 sm:gap-7"
    >
      {categories.map((cat) => {
        const open = openId === cat.id;
        return (
          <div key={cat.id} className="relative">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : cat.id)}
              className="flex items-center gap-1 text-lg font-semibold text-black hover:opacity-80 sm:text-2xl"
              aria-expanded={open}
              aria-haspopup="true"
            >
              {cat.label}
              <ChevronDown
                className={`h-7 w-7 shrink-0 transition-transform sm:h-8 sm:w-8 ${open ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {open && cat.subcategories.length > 0 && (
              <ul
                className="absolute left-0 top-full z-60 mt-1 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
                role="menu"
              >
                {cat.subcategories.map((sub) => (
                  <li key={sub} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className="mx-1 w-[calc(100%-0.5rem)] rounded-md px-3 py-2.5 text-left text-base text-black hover:bg-gray-50 hover:ring-1 hover:ring-black"
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
