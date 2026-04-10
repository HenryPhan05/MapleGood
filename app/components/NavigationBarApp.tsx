"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Home,
  LayoutDashboard,
  LogIn,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import logoIcon from "../public/images/logo icon.png";
import CategoryNav from "./CategoryNav";

type Props = {
  /** Synced from `?q=` on the products page; omit on other routes */
  initialSearchQuery?: string;
};

export default function NavigationBarApp({
  initialSearchQuery = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const onContactPage = pathname === "/contact";
  const onCartPage = pathname === "/user/cart";
  const onWishlistPage = pathname === "/wishlist";
  const [search, setSearch] = useState(initialSearchQuery);
  const [authReady, setAuthReady] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name =
          user.displayName?.trim() ||
          user.email?.split("@")[0] ||
          "User";
        setDisplayName(name);
        setPhotoURL(user.photoURL);
      } else {
        setDisplayName(null);
        setPhotoURL(null);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const q = search.trim();
    const url = q ? `/products?q=${encodeURIComponent(q)}` : "/products";
    router.push(url);
  }

  return (
    <div
      style={{ backgroundColor: "#E0A800" }}
      className="flex flex-col gap-4 px-4 pb-0 pt-3 font-sans sm:px-5"
    >
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Link
          href="/products"
          className="mr-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white sm:mr-4 sm:h-20 sm:w-20"
        >
          <Image src={logoIcon} alt="Maple Goods Logo" width={56} height={56} />
        </Link>

        <Link href="/products" className="mr-2 shrink-0 leading-tight sm:mr-6">
          <p className="text-2xl font-extrabold text-black sm:text-3xl">Maple</p>
          <p className="pl-2 text-2xl font-bold text-white sm:pl-3 sm:text-3xl">
            Goods
          </p>
        </Link>

        <form
          onSubmit={onSearchSubmit}
          className="order-last flex min-h-[52px] w-full min-w-0 flex-1 items-center rounded-xl bg-white px-3 py-2 sm:order-0 sm:max-w-2xl sm:px-4"
        >
          <Search className="shrink-0 text-gray-500" size={20} aria-hidden />
          <input
            name="q"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for gadgets..."
            className="ml-2 w-full min-w-0 bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
            autoComplete="off"
          />
        </form>

        <div className="flex min-w-0 max-w-[min(100%,14rem)] shrink-0 items-center gap-2 sm:max-w-none">
          {!authReady ? (
            <div
              className="h-12 w-28 animate-pulse rounded-lg bg-black/10 sm:h-14 sm:w-36"
              aria-hidden
            />
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="group flex min-w-0 max-w-full items-center gap-1.5 rounded-xl py-1.5 pl-1 pr-2 text-left transition hover:bg-black/5 sm:gap-2 sm:pr-3"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                {displayName && photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar URLs vary by provider
                  <img
                    src={photoURL}
                    alt=""
                    width={56}
                    height={56}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover shadow-sm sm:h-14 sm:w-14"
                  />
                ) : displayName ? (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white sm:h-14 sm:w-14">
                    <User
                      size={28}
                      className="text-gray-700 sm:h-9 sm:w-9"
                      aria-hidden
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white sm:h-14 sm:w-14">
                    <User size={28} className="text-gray-700 sm:h-9 sm:w-9" />
                  </div>
                )}
                {displayName ? (
                  <span className="truncate text-lg font-semibold text-black sm:text-xl">
                    {displayName}
                  </span>
                ) : (
                  <span className="whitespace-nowrap text-lg font-semibold text-black sm:text-xl">
                    Sign in
                  </span>
                )}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-black/70 transition-transform duration-200 sm:h-6 sm:w-6 ${userMenuOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full z-200 mt-2 w-[min(100vw-2rem,16rem)] min-w-[15rem] overflow-hidden rounded-2xl border border-gray-200/80 bg-white py-1.5 shadow-lg shadow-black/10 ring-1 ring-black/5"
                  role="menu"
                >
                  {displayName ? (
                    <Link
                      href="/user"
                      role="menuitem"
                      className="mx-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Home className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                      My account
                    </Link>
                  ) : (
                    <Link
                      href="/auth/signIn"
                      role="menuitem"
                      className="mx-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                      Sign in
                    </Link>
                  )}
                  <div className="mx-2 my-1.5 h-px bg-gray-100" aria-hidden />
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    className="mx-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-amber-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-[#E0A800]" aria-hidden />
                    Admin dashboard
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2 sm:ml-0 sm:gap-3">
          <Link
            href="/wishlist"
            className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-base font-semibold transition hover:opacity-90 sm:px-8 sm:py-3.5 sm:text-lg ${
              onWishlistPage
                ? "bg-white text-black ring-2 ring-black"
                : "bg-black text-white hover:cursor-pointer hover:opacity-80"
            }`}
          >
            Wishlist
          </Link>
          <Link
            href="/contact"
            className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-base font-semibold transition hover:opacity-90 sm:px-8 sm:py-3.5 sm:text-lg ${
              onContactPage
                ? "bg-white text-black ring-2 ring-black"
                : "bg-black text-white hover:cursor-pointer hover:opacity-80"
            }`}
          >
            Contact
          </Link>

          <Link
            href="/user/cart"
            className={`flex shrink-0 items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:opacity-80 sm:gap-2.5 sm:pr-3 ${
              onCartPage ? "ring-2 ring-black ring-offset-2 ring-offset-[#E0A800]" : ""
            }`}
            aria-label="Shopping cart, 0 items"
          >
            <span className="relative inline-flex">
              <ShoppingCart
                className="h-10 w-10 text-black sm:h-12 sm:w-12"
                strokeWidth={2}
                aria-hidden
              />
              <span className="absolute -right-0.5 -top-0.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-black px-1 text-xs font-bold leading-none text-white ring-2 ring-[#E0A800]">
                0
              </span>
            </span>
            <span className="text-lg font-bold leading-none text-black sm:text-xl">
              Cart
            </span>
          </Link>
        </div>
      </div>

      <CategoryNav />
    </div>
  );
}
