"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import type { Notify, SetList } from "@/components/admin/types";
import { api, errorMessage } from "@/lib/api";
import type { Memory, MemoryStatus } from "@/lib/memories";

type MemoriesEditorProps = {
  memories: Memory[];
  setMemories: SetList<Memory>;
  notify: Notify;
};

const emptyForm = { nama: "", rating: 1, cerita: "" };
const labelStatus: Record<string, string> = {
  pending: "Menunggu Persetujuan",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export default function MemoriesEditor({ memories, setMemories, notify }: MemoriesEditorProps) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const requestNumber = useRef(0);

  useEffect(() => {
    let active = true;

    function refresh() {
      const request = ++requestNumber.current;
      api<Memory[]>("/api/admin/memories").then((items) => {
        if (active && request === requestNumber.current) {
          setMemories(items);
          setLoadError("");
        }
      }).catch((err) => {
        if (active && request === requestNumber.current) setLoadError(errorMessage(err));
      });
    }

    refresh();
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
    };
  }, [setMemories]);

  function startEdit(item: Memory) {
    setEditingId(item.id);
    setForm({ nama: item.nama, rating: item.rating, cerita: item.cerita });
  }

  async function updateMemory(id: string, data: typeof emptyForm | { status: MemoryStatus }) {
    if (busy) return;
    setBusy(true);
    try {
      const updated = await api<Memory>(`/api/admin/memories/${encodeURIComponent(id)}`, "PATCH", data);
      requestNumber.current++;
      setMemories((prev) => prev.map((item) => item.id === updated.id ? updated : item));
      setEditingId(null);
      notify("Ulasan berhasil diperbarui.");
    } catch (err) {
      notify(errorMessage(err), "danger");
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId) void updateMemory(editingId, form);
  }

  async function deleteMemory(id: string) {
    if (busy) return;
    setBusy(true);
    try {
      await api(`/api/admin/memories/${encodeURIComponent(id)}`, "DELETE");
      requestNumber.current++;
      setMemories((prev) => prev.filter((item) => item.id !== id));
      notify("Ulasan berhasil dihapus.");
    } catch (err) {
      notify(errorMessage(err), "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card body className="shadow-sm border-0 p-4">
      <h2 className="fs-4 fw-bold mb-4">Wall of Memories</h2>
      {loadError && <p role="alert">{loadError}</p>}
      {editingId && (
        <Form onSubmit={handleSubmit} className="border rounded p-3 mb-3">
          <h3 className="fs-5">Edit ulasan</h3>
          <Form.Group className="mb-2" controlId="edit-nama">
            <Form.Label>Nama</Form.Label>
            <Form.Control value={form.nama} maxLength={100} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2" controlId="edit-rating">
            <Form.Label>Rating</Form.Label>
            <Form.Select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} bintang</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="edit-cerita">
            <Form.Label>Cerita</Form.Label>
            <Form.Control as="textarea" value={form.cerita} maxLength={1000} required onChange={(e) => setForm({ ...form, cerita: e.target.value })} />
          </Form.Group>
          <Button type="submit" className="me-2" disabled={busy}>Simpan</Button>
          <Button variant="outline-secondary" disabled={busy} onClick={() => setEditingId(null)}>Batal</Button>
        </Form>
      )}
      {memories.length === 0 ? <p>Belum ada ulasan.</p> : (
        <Table responsive bordered className="align-middle">
          <thead>
            <tr><th>No</th><th>Nama</th><th>Rating</th><th>Cerita</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {memories.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama}</td>
                <td>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</td>
                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{item.cerita}</td>
                <td>{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                <td>{labelStatus[item.status] ?? item.status}</td>
                <td>
                  <fieldset disabled={busy || editingId !== null} className="d-flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline-primary" onClick={() => startEdit(item)}>Edit</Button>
                    {item.status !== "approved" && (
                      <Button size="sm" variant="success" onClick={() => updateMemory(item.id, { status: "approved" })}>Setujui</Button>
                    )}
                    {item.status !== "rejected" && (
                      <Button size="sm" variant="secondary" onClick={() => updateMemory(item.id, { status: "rejected" })}>Tolak</Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => deleteMemory(item.id)}>Hapus</Button>
                  </fieldset>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
