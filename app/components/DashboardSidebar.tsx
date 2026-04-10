"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { LayoutDashboard, Package, Settings, User } from "lucide-react";

import { auth } from "@/lib/firebase";
import logoIcon from "../public/images/logo icon.png";

const ACCENT = "#E0A800";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userLabel, setUserLabel] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name =
          user.displayName?.trim() ||
          user.email?.split("@")[0] ||
          "User";
        setUserLabel(name);
        setPhotoURL(user.photoURL);
      } else {
        setUserLabel(null);
        setPhotoURL(null);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  return (
    <aside
      className="flex w-60 shrink-0 flex-col border-r border-black/10 sm:w-64"
      style={{ backgroundColor: ACCENT }}
    >
      <div className="p-5">
        <Link href="/products" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Image src={logoIcon} alt="" width={28} height={28} />
          </span>
          <span className="text-lg font-extrabold text-black">Maple Goods</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pb-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : href === "/inventory"
                ? pathname === "/inventory" ||
                  pathname.startsWith("/inventory/")
                : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-black text-white"
                  : "text-black hover:bg-black/10"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-black/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white">
            {photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element -- OAuth avatars vary by provider
              <img
                src={photoURL}
                alt=""
                width={44}
                height={44}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image src={logoIcon} alt="" width={32} height={32} />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-black">
              {!authReady ? (
                <span className="block h-4 w-28 animate-pulse rounded bg-black/10" />
              ) : userLabel ? (
                userLabel
              ) : (
                <span className="inline-flex items-center gap-1 text-black/70">
                  <User className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Not signed in
                </span>
              )}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">
              Manager
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/auth/signIn")}
          className="mt-3 w-full rounded-lg border border-black/20 bg-white/90 px-3 py-2 text-center text-xs font-semibold text-black transition hover:bg-white"
        >
          Switch admin account
        </button>
        <Link
          href="/user"
          className="mt-2 block w-full rounded-lg py-2 text-center text-xs font-medium text-black/80 underline underline-offset-2 hover:text-black"
        >
          Back to store
        </Link>
      </div>
    </aside>
  );
}
