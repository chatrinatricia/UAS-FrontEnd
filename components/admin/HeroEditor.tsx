"use client";
// Editor slide hero: tambah, ubah, hapus. Form terkendali (controlled input) + tabel + modal hapus.
import { useState, type FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { Notify, SetList } from "@/components/admin/types";
import { api, errorMessage } from "@/lib/api";
import type { HeroSlide } from "@/lib/types";

type HeroEditorProps = {
  slides: HeroSlide[];
  setSlides: SetList<HeroSlide>;
  notify: Notify;
};

const emptyForm = { title: "", subtitle: "", imageUrl: "/images/" };

export default function HeroEditor({ slides, setSlides, notify }: HeroEditorProps) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(s: HeroSlide) {
    setEditingId(s.id);
    setForm({ title: s.title, subtitle: s.subtitle, imageUrl: s.imageUrl });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await api<HeroSlide>(`/api/hero/${editingId}`, "PATCH", form);
        setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        notify("Slide berhasil diperbarui!");
      } else {
        const created = await api<HeroSlide>("/api/hero", "POST", form);
        setSlides((prev) => [...prev, created]);
        notify("Slide berhasil ditambahkan!");
      }
      resetForm();
    } catch (err) {
      notify(errorMessage(err), "danger");
    }
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    try {
      await api(`/api/hero/${deleteId}`, "DELETE");
      setSlides((prev) => prev.filter((s) => s.id !== deleteId));
      notify("Slide berhasil dihapus!");
    } catch (err) {
      notify(errorMessage(err), "danger");
    }
    setDeleteId(null);
  }

  return (
    <>
      <Card body className="border-0 shadow-sm mb-4">
        <h2 className="fs-5 fw-bold mb-3">{editingId ? "Edit Slide Tampilan Awal" : "Tambah Slide Tampilan Awal"}</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label className="fw-semibold">Judul</Form.Label>
              <Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-semibold">Gambar (path di folder public atau URL)</Form.Label>
              <Form.Control value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
            </Col>
            <Col xs={12}>
              <Form.Label className="fw-semibold">Teks di bawah judul</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </Col>
          </Row>
          <Button type="submit" variant="primary" className="w-100 fw-bold mt-4">
            {editingId ? "Update Slide" : "Simpan Slide"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" className="w-100 fw-bold mt-2" onClick={resetForm}>Batal Edit</Button>
          )}
        </Form>
      </Card>

      <Card body className="border-0 shadow-sm mb-4">
        <h2 className="fs-5 fw-bold mb-3">Daftar Slide ({slides.length})</h2>
        <div className="table-responsive">
          <Table striped hover className="align-middle">
            <thead className="table-dark">
              <tr><th>No</th><th>Gambar</th><th>Judul & Teks</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {slides.length === 0 && (
                <tr><td colSpan={4} className="text-center text-body-secondary">Belum ada slide.</td></tr>
              )}
              {slides.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.imageUrl} alt={s.title} className="thumb" />
                  </td>
                  <td className="cell-wrap">
                    <strong>{s.title}</strong>
                    <p className="small text-body-secondary mb-0">{s.subtitle}</p>
                  </td>
                  <td className="text-nowrap">
                    <Button size="sm" variant="warning" className="me-1" onClick={() => startEdit(s)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleteId(s.id)}>Hapus</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
      <ConfirmModal show={deleteId !== null} onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
    </>
  );
}
