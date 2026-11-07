"use client";

import { useRouter } from "next/navigation";

export default function VisitorLogout() {
  const router = useRouter();

  function handleLogout() {
    sessionStorage.removeItem("kt_user_login");
    sessionStorage.removeItem("kt_user_aktif");
    sessionStorage.removeItem("kt_user_name");

    router.replace("/loginuser");
  }

  return (
    <button
      type="button"
      id="btn-logout-user"
      className="nav-link fw-semibold"
      onClick={handleLogout}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
