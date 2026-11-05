"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import type { Notify } from "@/components/admin/types";
import { api, errorMessage } from "@/lib/api";
import type { AboutContent } from "@/lib/types";

type AboutEditorProps = {
  initialAbout: AboutContent;
  notify: Notify;
};

type Field = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export default function AboutEditor({ initialAbout, notify }: AboutEditorProps) {
  const [form, setForm] = useState(initialAbout);
  const [saving, setSaving] = useState(false);

  // Satu handler untuk semua kolom
  function handleChange(e: Field) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await api<AboutContent>("/api/about", "PUT", form);
      setForm(saved);
      notify("Bagian Pengenalan berhasil disimpan!");
    } catch (err) {
      notify(errorMessage(err), "danger");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card body className="border-0 shadow-sm">
      <h2 className="fs-5 fw-bold mb-3">Edit Pengenalan Kerak Telor</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Label className="fw-semibold">Judul Section</Form.Label>
            <Form.Control name="title" value={form.title} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold">Sub-judul</Form.Label>
            <Form.Control name="heading" value={form.heading} onChange={handleChange} required />
          </Col>
          <Col xs={12}>
            <Form.Label className="fw-semibold">Paragraf</Form.Label>
            <Form.Control as="textarea" rows={4} name="paragraph" value={form.paragraph} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold">Kutipan (boleh kosong)</Form.Label>
            <Form.Control name="quote" value={form.quote} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold">Gambar (path di folder public atau URL)</Form.Label>
            <Form.Control name="image" value={form.image} onChange={handleChange} required />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold">Kartu 1: Judul</Form.Label>
            <Form.Control name="feature1Title" value={form.feature1Title} onChange={handleChange} />
            <Form.Label className="fw-semibold mt-2">Kartu 1: Isi</Form.Label>
            <Form.Control name="feature1Text" value={form.feature1Text} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold">Kartu 2: Judul</Form.Label>
            <Form.Control name="feature2Title" value={form.feature2Title} onChange={handleChange} />
            <Form.Label className="fw-semibold mt-2">Kartu 2: Isi</Form.Label>
            <Form.Control name="feature2Text" value={form.feature2Text} onChange={handleChange} />
          </Col>
        </Row>
        <Button type="submit" variant="primary" className="w-100 fw-bold mt-4" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Pengenalan"}
        </Button>
      </Form>
    </Card>
  );
}
