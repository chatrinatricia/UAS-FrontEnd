"use client";
import { useState, type FormEvent } from "react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { Notify } from "@/components/admin/types";
import { saveSejarah, deleteSejarah } from "@/lib/sejarah-actions";
import type { SejarahInput, SejarahItem } from "@/lib/sejarah";

type Props = {
  initialSejarah: SejarahItem[];
  notify: Notify;
};

const urutkan = (items: SejarahItem[]) => [...items].sort((a, b) => a.order - b.order);

// Nomor urutan berikutnya = urutan terbesar yang ada + 1
const urutanBerikut = (items: SejarahItem[]) => items.reduce((max, item) => Math.max(max, item.order), 0) + 1;

const formBaru = (items: SejarahItem[]): SejarahInput => ({
  era: "",
  judul: "",
  deskripsi: "",
  gambar: "",
  caption: "",
  order: urutanBerikut(items),
});

export default function SejarahManager({ initialSejarah, notify }: Props) {
  const [daftar, setDaftar] = useState(() => urutkan(initialSejarah));
  const [form, setForm] = useState<SejarahInput>(() => formBaru(initialSejarah));
  const [editId, setEditId] = useState<string | null>(null);
  const [hapusId, setHapusId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateForm<K extends keyof SejarahInput>(key: K, value: SejarahInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(formBaru(daftar));
    setEditId(null);
  }

  function mulaiEdit(item: SejarahItem) {
    setEditId(item.id);
    setForm({
      era: item.era ?? "",
      judul: item.judul,
      deskripsi: item.deskripsi,
      gambar: item.gambar ?? "",
      caption: item.caption ?? "",
      order: item.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function simpan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;

    if (form.gambar && !/^(?:\/images\/|https:\/\/)/.test(form.gambar.trim())) {
      notify("Gambar harus diawali /images/ atau https://", "danger");
      return;
    }

    setSaving(true);
    try {
      const saved = await saveSejarah(editId, form);
      const berikut = urutkan(
        editId === null ? [...daftar, saved] : daftar.map((item) => (item.id === saved.id ? saved : item))
      );
      setDaftar(berikut);
      notify(editId === null ? "Sejarah berhasil ditambahkan." : "Sejarah berhasil diperbarui.");
      setForm(formBaru(berikut));
      setEditId(null);
    } catch {
      notify("Gagal menyimpan ke database.", "danger");
    } finally {
      setSaving(false);
    }
  }

  async function konfirmasiHapus() {
    if (hapusId === null) return;
    const id = hapusId;
    setHapusId(null);
    try {
      await deleteSejarah(id);
      setDaftar((items) => items.filter((item) => item.id !== id));
      if (editId === id) resetForm();
      notify("Sejarah berhasil dihapus.");
    } catch {
      notify("Gagal menghapus data.", "danger");
    }
  }

  return (
    <div>
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h2 className="fs-4 fw-bold mb-4">{editId === null ? "Tambah Era Sejarah" : "Edit Era Sejarah"}</h2>

        <form onSubmit={simpan}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Era / Tahun</label>
              <input
                className="form-control"
                placeholder="Contoh: Era 1920-an"
                value={form.era}
                onChange={(e) => updateForm("era", e.target.value)}
                maxLength={60}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Judul Periode</label>
              <input
                className="form-control"
                placeholder="Contoh: Awal Mula Ciptaan Tanpa Sengaja"
                value={form.judul}
                onChange={(e) => updateForm("judul", e.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Urutan</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.order}
                onChange={(e) => updateForm("order", Number(e.target.value))}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Deskripsi</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Tuliskan cerita sejarahnya..."
                value={form.deskripsi}
                onChange={(e) => updateForm("deskripsi", e.target.value)}
                maxLength={2000}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Gambar (opsional)</label>
              <input
                className="form-control"
                placeholder="/images/nama-file.jpg atau https://..."
                value={form.gambar}
                onChange={(e) => updateForm("gambar", e.target.value)}
                maxLength={500}
              />
              <small className="text-muted">Gambar lokal ada di folder public/images.</small>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Caption Gambar (opsional)</label>
              <input
                className="form-control"
                placeholder="Contoh: Suasana Batavia tempo dulu"
                value={form.caption}
                onChange={(e) => updateForm("caption", e.target.value)}
                maxLength={255}
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary w-100 mt-4">
            {saving ? "Menyimpan..." : editId === null ? "Simpan Sejarah" : "Update Sejarah"}
          </button>
          {editId !== null && (
            <button type="button" className="btn btn-secondary w-100 mt-2" onClick={resetForm}>
              Batal Edit
            </button>
          )}
        </form>
      </div>

      <div className="card shadow-sm border-0 p-4">
        <h2 className="fs-5 fw-bold mb-3">Daftar Sejarah ({daftar.length})</h2>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Urutan</th>
                <th>Gambar</th>
                <th>Era</th>
                <th>Judul &amp; Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((item) => (
                <tr key={item.id}>
                  <td>{item.order}</td>
                  <td>
                    {item.gambar ? (
                      <img src={item.gambar} alt={item.judul} className="thumb" />
                    ) : (
                      <span className="text-muted small">-</span>
                    )}
                  </td>
                  <td className="text-nowrap">{item.era ?? "-"}</td>
                  <td className="cell-wrap">
                    <strong>{item.judul}</strong>
                    <div className="small text-muted">{item.deskripsi.slice(0, 110)}{item.deskripsi.length > 110 ? "..." : ""}</div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-warning btn-sm" onClick={() => mulaiEdit(item)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => setHapusId(item.id)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {daftar.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Belum ada data sejarah.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        show={hapusId !== null}
        message="Yakin ingin menghapus era sejarah ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={konfirmasiHapus}
        onCancel={() => setHapusId(null)}
      />
    </div>
  );
}
