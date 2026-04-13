"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Added LayoutDashboard to the imports
import { Search, ShoppingCart, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UseCartStore } from "@/app/products/cartStore";
import logoIcon from "../public/images/logo icon.png";
//add
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";


const CATEGORIES = [
  "Car devices",
  "Phone accessories",
  "Home security",
  "Audio equipment",
];

export default function NavigationBarApp() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayName, setDisplayName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartItems = UseCartStore((s) => s.cartItems);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // addhomepage
  const [cartCountItem, setCartCountItem] = useState(0)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || user.email || "User");
      } else {
        setDisplayName("");
        setCartCountItem(0);
        return;
      }

      const cartRef = collection(db, "users", user.uid, "carts");
      const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
        let total = 0;
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          total += data.quantity ?? 0;
        });
        setCartCountItem(total);
      });
      return () => {
        unsubscribe();
      }
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await import("firebase/auth").then(({ signOut }) => signOut(auth));
    setIsDropdownOpen(false);
    router.push("/auth/signIn");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-[#E8A800] px-5 pt-3 pb-0 font-sans flex flex-col gap-5">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex pl-22 items-center ml-4">
          <Link
            href="/user"
            className="bg-white rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0 mr-5 hover:scale-105 transition-transform"
          >
            <Image src={logoIcon} alt="Maple Goods Logo" width={60} height={60} />
          </Link>
          <Link href="/user" className="flex-shrink-0 leading-tight hover:opacity-80 transition-opacity">
            <span className="text-black font-extrabold text-3xl">Maple</span>
            <span className="text-white font-bold text-3xl pl-3">Goods</span>
          </Link>
        </div>

        <div className="flex-1 max-w-2xl px-6 hidden md:block">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-22 pr-4 py-2.5 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#E0A800] focus:border-[#E0A800] transition-all text-black"
              placeholder="Search for products, brands and more..."
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        <div className="flex items-center pr-30 gap-6 mr-4">

          <div className="relative flex items-center flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
              aria-expanded={isDropdownOpen}
            >
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                <User size={26} className="text-gray-700" />
              </div>
              <span className="ml-2 text-black font-semibold text-xl underline whitespace-nowrap hidden lg:block">
                {displayName || "Guest"}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-3 right-0 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer border-b border-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Log Out
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/dashboard");
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Admin Dashboard
                </button>
              </div>
            )}
          </div>

          <Link href="/wishlist" className="bg-black text-white rounded-xl px-6 py-3 text-lg font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm cursor-pointer hidden xl:block">
            Wishlist
          </Link>
          <Link href="/contact" className="bg-black text-white rounded-xl px-6 py-3 text-lg font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm cursor-pointer hidden xl:block">
            Contact
          </Link>

          <button
            onClick={() => router.push("/user/cart")}
            className="relative flex flex-col items-center hover:scale-105 transition-transform group cursor-pointer ml-2"
          >
            {Number(cartCount + cartCountItem) > 0 && (
              <span className="absolute -top-3 text-xl font-extrabold flex items-center justify-center text-black">
                {cartCount + cartCountItem}
              </span>
            )}
            <ShoppingCart size={40} className="text-black group-hover:text-gray-800 transition-colors mt-2" />
            <span className="text-lg font-bold text-black group-hover:text-gray-800 transition-colors">
              Cart
            </span>
          </button>

        </div>
      </div>

      <div className="flex gap-7 pl-22 pt-2.5 pb-3">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            className="flex items-center gap-1 text-black font-semibold text-2xl cursor-pointer hover:text-white transition-colors group"
          >
            {item}
            <ChevronDown size={30} strokeWidth={2.5} className="group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>
    </nav>
  );
}
