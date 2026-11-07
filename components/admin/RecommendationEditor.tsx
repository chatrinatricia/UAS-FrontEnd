
"use client";

import { useEffect, useState } from "react";
import {
  bacaTempat,
  simpanTempat,
  type Tempat,
} from "@/lib/recommendations";

type Props = {
  notify: (text: string, type?: "success" | "danger") => void;
};

type FormTempat = Omit<Tempat, "id">;

const formKosong: FormTempat = {
  area: "Jakarta Pusat",
  nama: "",
  alamat: "",
  hargaMin: 0,
  hargaMax: 0,
  maps: "",
  gambar: "",
};

export default function RecommendationEditor({ notify }: Props) {
  const [daftar, setDaftar] = useState<Tempat[]>([]);
  const [form, setForm] = useState<FormTempat>(formKosong);
  const [editId, setEditId] = useState<number | null>(null);
  const [pencarian, setPencarian] = useState("");

  useEffect(() => {
    setDaftar(bacaTempat());
  }, []);

  function updateForm<K extends keyof FormTempat>(
    key: K,
    value: FormTempat[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({ ...formKosong });
    setEditId(null);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const format = ["image/jpeg", "image/png", "image/webp"];

    if (!format.includes(file.type)) {
      notify("Format harus JPG, PNG, atau WebP.", "danger");
      e.target.value = "";
      return;
    }

    if (file.size > 200 * 1024) {
      notify("Ukuran gambar maksimal 200 KB.", "danger");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateForm("gambar", reader.result);
      }
    };

    reader.onerror = () => {
      notify("Gagal membaca gambar.", "danger");
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function simpan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nama.trim() || !form.alamat.trim()) {
      notify("Nama dan alamat harus diisi.", "danger");
      return;
    }

    if (
      !Number.isFinite(form.hargaMin) ||
      !Number.isFinite(form.hargaMax) ||
      form.hargaMin < 0 ||
      form.hargaMax < form.hargaMin
    ) {
      notify("Range harga tidak valid.", "danger");
      return;
    }

    if (form.maps) {
      try {
        const url = new URL(form.maps);

        if (url.protocol !== "https:") {
          throw new Error("URL tidak valid");
        }
      } catch {
        notify("Link Google Maps harus URL HTTPS.", "danger");
        return;
      }
    }

    if (
      form.gambar &&
      !form.gambar.startsWith("/images/") &&
      !form.gambar.startsWith("https://") &&
      !/^data:image\/(jpeg|png|webp);base64,/.test(form.gambar)
    ) {
      notify("Format gambar tidak valid.", "danger");
      return;
    }

    const dataForm: FormTempat = {
      ...form,
      nama: form.nama.trim(),
      alamat: form.alamat.trim(),
      maps: form.maps.trim(),
      gambar: form.gambar.trim(),
    };

    let hasil: Tempat[];

    if (editId !== null) {
      hasil = daftar.map((item) =>
        item.id === editId ? { ...item, ...dataForm } : item
      );
    } else {
      const idBaru =
        daftar.length > 0
          ? Math.max(...daftar.map((item) => item.id)) + 1
          : 1;

      hasil = [...daftar, { id: idBaru, ...dataForm }];
    }

    try {
      simpanTempat(hasil);
      setDaftar(hasil);

      notify(
        editId !== null
          ? "Rekomendasi berhasil diperbarui."
          : "Rekomendasi berhasil ditambahkan."
      );

      resetForm();
    } catch {
      notify(
        "Gagal menyimpan. Penyimpanan browser mungkin penuh.",
        "danger"
      );
    }
  }

  function editTempat(item: Tempat) {
    setEditId(item.id);

    setForm({
      area: item.area,
      nama: item.nama,
      alamat: item.alamat,
      hargaMin: item.hargaMin,
      hargaMax: item.hargaMax,
      maps: item.maps || "",
      gambar: item.gambar || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function hapusTempat(id: number) {
    if (!window.confirm("Yakin ingin menghapus tempat ini?")) {
      return;
    }

    const hasil = daftar.filter((item) => item.id !== id);

    try {
      simpanTempat(hasil);
      setDaftar(hasil);

      if (editId === id) resetForm();

      notify("Rekomendasi berhasil dihapus.");
    } catch {
      notify("Gagal menghapus data.", "danger");
    }
  }


  const hasilPencarian = daftar.filter((item) =>
    `${item.nama} ${item.area} ${item.alamat}`
      .toLowerCase()
      .includes(pencarian.toLowerCase())
  );

  const rupiah = (angka: number) =>
    "Rp " + angka.toLocaleString("id-ID");

  return (
    <div>
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h2 className="fs-4 fw-bold mb-4">
          {editId !== null
            ? "Edit Tempat"
            : "Tambah Tempat Baru"}
        </h2>

        <form onSubmit={simpan}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Area
              </label>

              <select
                className="form-select"
                value={form.area}
                onChange={(e) =>
                  updateForm("area", e.target.value)
                }
                required
              >
                {[
                  "Jakarta Pusat",
                  "Jakarta Utara",
                  "Jakarta Selatan",
                  "Jakarta Barat",
                  "Jakarta Timur",
                ].map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-8">
              <label className="form-label fw-semibold">
                Nama Tempat
              </label>

              <input
                className="form-control"
                value={form.nama}
                onChange={(e) =>
                  updateForm("nama", e.target.value)
                }
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                Alamat
              </label>

              <input
                className="form-control"
                value={form.alamat}
                onChange={(e) =>
                  updateForm("alamat", e.target.value)
                }
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Harga Minimal (Rp)
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={form.hargaMin}
                onChange={(e) =>
                  updateForm(
                    "hargaMin",
                    Number(e.target.value)
                  )
                }
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Harga Maksimal (Rp)
              </label>

              <input
                type="number"
                min="0"
                className="form-control"
                value={form.hargaMax}
                onChange={(e) =>
                  updateForm(
                    "hargaMax",
                    Number(e.target.value)
                  )
                }
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Link Google Maps
              </label>

              <input
                type="url"
                className="form-control"
                placeholder="https://maps.app.goo.gl/..."
                value={form.maps}
                onChange={(e) =>
                  updateForm("maps", e.target.value)
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Upload Gambar Tempat
              </label>

              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpload}
              />

              <small className="text-muted">
                JPG, PNG, WebP. Maksimal 200 KB.
              </small>

              {form.gambar && (
                <div className="mt-3">
                  <img
                    src={form.gambar}
                    alt="Preview Tempat"
                    style={{
                      width: "200px",
                      height: "130px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
          >
            {editId !== null
              ? "Update Tempat"
              : "Simpan Tempat"}
          </button>

          {editId !== null && (
            <button
              type="button"
              className="btn btn-secondary w-100 mt-2"
              onClick={resetForm}
            >
              Batal Edit
            </button>
          )}
        </form>
      </div>

      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <h2 className="fs-5 fw-bold m-0">
            Daftar Tempat ({daftar.length})
          </h2>

          <input
            className="form-control"
            style={{ maxWidth: 250 }}
            placeholder="Cari tempat..."
            value={pencarian}
            onChange={(e) =>
              setPencarian(e.target.value)
            }
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Area</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {hasilPencarian.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.area}</td>
                  <td>{item.nama}</td>
                  <td>{item.alamat}</td>
                  <td>
                    {rupiah(item.hargaMin)} -{" "}
                    {rupiah(item.hargaMax)}
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => editTempat(item)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          hapusTempat(item.id)
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {hasilPencarian.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-muted"
                  >
                    Tidak ada tempat ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
