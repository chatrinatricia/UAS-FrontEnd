"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VisitorLogout from "@/components/VisitorLogout";
import { api, errorMessage } from "@/lib/api";

type Status = { type: "success" | "danger"; text: string } | null;

export default function AccountSettings({ username }: { username: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ username, currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);

  const onChange = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setStatus({ type: "danger", text: "Konfirmasi password baru tidak sama." });
      return;
    }

    setSaving(true);
    try {
      await api("/api/user/account", "PATCH", {
        username: form.username,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setStatus({ type: "success", text: "Perubahan berhasil disimpan." });
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      router.refresh();
    } catch (err) {
      setStatus({ type: "danger", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-5 akun-wrap">
      <div className="card shadow-sm border-0 p-4">
        <h1 className="fs-3 fw-bold mb-1">Pengaturan Akun</h1>
        <p className="text-body-secondary">
          Masuk sebagai <strong>{username}</strong>
        </p>

        {status && (
          <div className={`alert alert-${status.type} py-2`} role="alert">
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="akun-username" className="form-label fw-semibold">
              Username
            </label>
            <input
              id="akun-username"
              className="form-control"
              autoComplete="username"
              maxLength={100}
              value={form.username}
              onChange={onChange("username")}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="akun-password-baru" className="form-label fw-semibold">
              Password baru <span className="fw-normal text-body-secondary">(kosongkan jika tidak diganti)</span>
            </label>
            <input
              id="akun-password-baru"
              type="password"
              className="form-control"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={onChange("newPassword")}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="akun-konfirmasi" className="form-label fw-semibold">
              Ulangi password baru
            </label>
            <input
              id="akun-konfirmasi"
              type="password"
              className="form-control"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
            />
          </div>

          <hr />

          <div className="mb-3">
            <label htmlFor="akun-password-lama" className="form-label fw-semibold">
              Password saat ini <span className="fw-normal text-body-secondary">(wajib untuk menyimpan)</span>
            </label>
            <input
              id="akun-password-lama"
              type="password"
              className="form-control"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={onChange("currentPassword")}
              required
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary w-100 fw-bold">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        <hr className="my-4" />

        <h2 className="fs-6 fw-bold">Ganti akun</h2>
        <p className="text-body-secondary small">Keluar dari akun ini lalu masuk dengan akun lain.</p>
        <div className="d-flex flex-wrap gap-2">
          <VisitorLogout role="USER" label="Ganti Akun" className="btn btn-outline-secondary" />
          <Link href="/" className="btn btn-link text-decoration-none">
            &larr; Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
