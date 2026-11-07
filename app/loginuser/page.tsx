
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  username: string;
  password: string;
};

export default function LoginUserPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("kt_user_login") === "ya") {
      router.replace("/");
    }
  }, [router]);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const data = localStorage.getItem("kt_user");
      const parsed: unknown = data ? JSON.parse(data) : [];
      const daftarUser: User[] = Array.isArray(parsed) ? parsed : [];

      const userDitemukan = daftarUser.find(
        (user) =>
          user.username === username &&
          user.password === password
      );

      if (!userDitemukan) {
        setError("Username atau password salah.");
        return;
      }

      sessionStorage.setItem("kt_user_login", "ya");
      sessionStorage.setItem(
        "kt_user_aktif",
        JSON.stringify(userDitemukan)
      );

      router.replace("/");
    } catch {
      setError("Gagal membaca data akun. Silakan coba lagi.");
    }
  }

  return (
    <main
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: "#F9F6F0" }}
    >
      <form
        id="form-login-user"
        onSubmit={handleLogin}
        className="card shadow border-0 p-4"
        style={{ width: 340, maxWidth: "100%" }}
      >
        <Image
          src="/images/logo.jpeg"
          alt="Logo Kerak Telor"
          width={64}
          height={64}
          className="d-block mx-auto mb-3 rounded-circle"
          style={{
            objectFit: "cover",
            border: "3px solid #D4AF37",
          }}
        />

        <h1
          className="fs-4 fw-bold text-center mb-4"
          style={{ color: "#5C2C16" }}
        >
          Hi! Selamat Datang
        </h1>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="login-username" className="form-label fw-semibold">
            Username
          </label>
          <input
            id="login-username"
            type="text"
            className="form-control"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label htmlFor="login-password" className="form-label fw-semibold">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn w-100 fw-bold"
          style={{ backgroundColor: "#8B4513", color: "white" }}
        >
          Masuk
        </button>

        <p className="text-center mt-3 mb-0">
          Belum punya akun?{" "}
          <Link href="/register" className="fw-semibold text-decoration-none">
            Daftar di sini
          </Link>
        </p>
      </form>
    </main>
  );
}
