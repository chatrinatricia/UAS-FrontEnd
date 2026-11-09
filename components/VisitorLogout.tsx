"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, errorMessage } from "@/lib/api";

export default function VisitorLogout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function handleLogout() {
    setBusy(true);
    setError("");
    try {
      await api("/api/user/logout", "POST");
      router.replace("/loginuser");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" id="btn-logout-user" className="nav-link fw-semibold" disabled={busy} onClick={handleLogout}>
        {busy ? "Memproses..." : "Logout"}
      </button>
      {error && <span role="alert">{error}</span>}
    </>
  );
}
