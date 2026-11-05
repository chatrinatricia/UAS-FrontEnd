"use client";
// Form login dashboard admin. Mengirim data ke POST /api/admin/login.
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { api, errorMessage } from "@/lib/api";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await api("/api/admin/login", "POST", { username, password });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-body">
      <Card body className="shadow border-0" style={{ width: 340, maxWidth: "100%" }}>
        <Form onSubmit={handleSubmit} noValidate>
          <Image src="/images/logo.jpeg" alt="Logo Kerak Telor" width={64} height={64} className="auth-logo" priority />
          <h1 className="fs-4 fw-bold text-center mb-4">Admin Kerak Telor</h1>

          {error && <Alert variant="danger" className="py-2">{error}</Alert>}

          <Form.Group className="mb-3" controlId="username">
            <Form.Label className="fw-semibold">Username</Form.Label>
            <Form.Control type="text" autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
