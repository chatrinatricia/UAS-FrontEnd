"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  username: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const nama = username.trim();

    if (!nama) {
      setError("Username tidak boleh kosong.");
      return;
    }

    if (password.length < 3) {
      setError("Password minimal 3 karakter.");
      return;
    }

    try {
      const data = localStorage.getItem("kt_user");
      const parsed: unknown = data ? JSON.parse(data) : [];
      const daftarUser: User[] = Array.isArray(parsed) ? parsed : [];

      const sudahAda = daftarUser.some(
        (user) =>
          user.username.toLowerCase() === nama.toLowerCase()
      );

      if (sudahAda) {
        setError("Username sudah digunakan.");
        return;
      }

      const idBaru =
        daftarUser.length > 0
          ? Math.max(...daftarUser.map((user) => user.id)) + 1
          : 1;

      const userBaru: User = {
        id: idBaru,
        username: nama,
        password,
      };

      localStorage.setItem(
        "kt_user",
        JSON.stringify([...daftarUser, userBaru])
      );

      setSuccess("Akun berhasil dibuat! Silakan login.");
      setUsername("");
      setPassword("");

      router.push("/loginuser");
    } catch {
      setError("Gagal menyimpan akun. Silakan coba lagi.");
    }
  }

  return (
    <main
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: "#F9F6F0" }}
    >
      <form
        id="form-register-user"
        onSubmit={handleRegister}
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
          Daftar Akun
        </h1>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success py-2" role="status">
            {success}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="register-username" className="form-label fw-semibold">
            Username
          </label>
          <input
            id="register-username"
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
          <label htmlFor="register-password" className="form-label fw-semibold">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            className="form-control"
            autoComplete="new-password"
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
          Daftar
        </button>

        <p className="text-center mt-3 mb-0">
          Sudah punya akun?{" "}
          <Link href="/loginuser" className="fw-semibold text-decoration-none">
            Masuk di sini
          </Link>
        </p>
      </form>
    </main>
  );
}
