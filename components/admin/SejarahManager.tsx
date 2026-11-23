"use client";

import { useState, useEffect, useCallback } from "react";

interface SejarahItem {
  id: string;
  era: string | null;
  judul: string;
  deskripsi: string;
  gambar: string | null;
  caption: string | null;
  order: number;
}

export default function SejarahManager() {
  const [list, setList] = useState<SejarahItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State form
  const [editId, setEditId] = useState<string | null>(null);
  const [era, setEra] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState("");
  const [caption, setCaption] = useState("");
  const [order, setOrder] = useState<number>(0);

  const fetchSejarah = useCallback(async () => {
    try {
      const res = await fetch("/api/sejarah");
      if (!res.ok) throw new Error("Gagal mengambil data sejarah");
      const data = await res.json();
      setList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/sejarah")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data sejarah");
        return res.json();
      })
      .then((data) => {
        if (active) setList(data);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const resetForm = () => {
    setEditId(null);
    setEra("");
    setJudul("");
    setDeskripsi("");
    setGambar("");
    setCaption("");
    setOrder(list.length + 1);
  };

  const handleEditClick = (item: SejarahItem) => {
    setEditId(item.id);
    setEra(item.era || "");
    setJudul(item.judul);
    setDeskripsi(item.deskripsi);
    setGambar(item.gambar || "");
    setCaption(item.caption || "");
    setOrder(item.order);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      era: era.trim() || null,
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      gambar: gambar.trim() || null,
      caption: caption.trim() || null,
      order: Number(order) || 0,
    };

    try {
      const url = editId ? `/api/sejarah/${editId}` : "/api/sejarah";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal menyimpan data sejarah");
      }

      setSuccess(
        editId
          ? "Data sejarah berhasil diperbarui!"
          : "Data sejarah baru berhasil ditambahkan!"
      );
      resetForm();
      setLoading(true);
      await fetchSejarah();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data sejarah ini?")) return;

    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/sejarah/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data sejarah");

      setSuccess("Data sejarah berhasil dihapus.");
      if (editId === id) resetForm();
      setLoading(true);
      await fetchSejarah();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus.");
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#5c3317" }}>
            Kelola Sejarah & Perjalanan Kerak Telor
          </h4>
          <p className="text-muted small mb-0">
            Tambah, ubah, atau atur urutan era sejarah dan dokumentasi foto yang tampil di halaman utama.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      {/* Form Tambah / Edit */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-light fw-semibold">
          {editId ? "Edit Data Sejarah" : "Tambah Era Sejarah Baru"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Era / Tahun</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Era 1920-an"
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">
                  Judul Peristiwa <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Awal Mulai Ciptaan Tanpa Sengaja"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-semibold">Urutan Tampil</label>
                <input
                  type="number"
                  className="form-control"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold">
                  Deskripsi Sejarah <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Tuliskan penjelasan sejarah pada era ini..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">URL / Path Gambar</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: /images/sejarah1.jpg atau https://..."
                  value={gambar}
                  onChange={(e) => setGambar(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Caption Foto</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder='Contoh: "Suasana Batavia tempo dulu"'
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="col-12 d-flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn text-white px-4"
                  style={{ backgroundColor: "#6f3b18" }}
                  disabled={submitting}
                >
                  {submitting
                    ? "Menyimpan..."
                    : editId
                    ? "Simpan Perubahan"
                    : "Tambah Sejarah"}
                </button>

                {editId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Tabel Daftar Sejarah */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-light fw-semibold">
          Daftar Sejarah Tersimpan ({list.length})
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center text-muted">Memuat data sejarah...</div>
          ) : list.length === 0 ? (
            <div className="p-4 text-center text-muted">
              Belum ada data sejarah. Silakan tambahkan melalui form di atas.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "60px" }} className="text-center">Urutan</th>
                    <th style={{ width: "130px" }}>Era</th>
                    <th>Judul & Deskripsi</th>
                    <th style={{ width: "140px" }}>Foto</th>
                    <th style={{ width: "150px" }} className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center fw-bold">{item.order}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {item.era || "-"}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold">{item.judul}</div>
                        <small className="text-muted d-block">
                          {item.deskripsi.length > 100
                            ? item.deskripsi.slice(0, 100) + "..."
                            : item.deskripsi}
                        </small>
                      </td>
                      <td>
                        {item.gambar ? (
                          <div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.gambar}
                              alt={item.judul}
                              className="rounded border"
                              style={{
                                width: "100px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                            {item.caption && (
                              <small className="d-block text-muted text-truncate" style={{ maxWidth: "110px" }}>
                                {item.caption}
                              </small>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted small">Tidak ada foto</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEditClick(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}