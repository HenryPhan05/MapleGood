"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/auth/signIn");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => void logout()}
      className="rounded px-4 py-2 text-sm font-bold text-black hover:opacity-70 disabled:opacity-50"
      style={{ backgroundColor: "#E0A800" }}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
