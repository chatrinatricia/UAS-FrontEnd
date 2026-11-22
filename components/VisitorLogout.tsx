"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, errorMessage } from "@/lib/api";

type VisitorLogoutProps = {
  role?: "USER" | "ADMIN";
  label?: string;
  className?: string;
  id?: string;
};

// Tombol keluar. Pengunjung kembali ke halaman masuk pengunjung, admin ke halaman masuk admin.
export default function VisitorLogout({ role = "USER", label = "Keluar", className = "btn-logout", id }: VisitorLogoutProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setBusy(true);
    setError("");
    try {
      await api(role === "ADMIN" ? "/api/admin/logout" : "/api/user/logout", "POST");
      router.replace(role === "ADMIN" ? "/admin/login" : "/loginuser");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" id={id} className={className} disabled={busy} onClick={handleLogout}>
        {busy ? "Memproses..." : label}
      </button>
      {error && (
        <span role="alert" className="small text-danger ms-2">
          {error}
        </span>
      )}
    </>
  );
}
