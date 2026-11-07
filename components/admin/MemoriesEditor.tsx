"use client";

import { useEffect, useState } from "react";
import {
  bacaMemories,
  simpanMemories,
  dengarkanMemories,
  type Memory,
  type MemoryStatus,
} from "@/lib/memories";

type Props = {
  notify?: (
    pesan: string,
    type?: "success" | "danger"
  ) => void;
};

export default function MemoriesEditor({ notify }: Props) {
  const [daftar, setDaftar] = useState<Memory[]>([]);
  const [filter, setFilter] = useState("all");
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const perbarui = () => setDaftar(bacaMemories());

    perbarui();
    return dengarkanMemories(perbarui);
  }, []);

  function tampilkanPesan(teks: string, error = false) {
    setPesan(teks);
    notify?.(teks, error ? "danger" : "success");
  }

  function ubahStatus(id: string, status: MemoryStatus) {
    try {
      const terbaru = bacaMemories().map((item) =>
        item.id === id ? { ...item, status } : item
      );

      simpanMemories(terbaru);
      tampilkanPesan("Status ulasan berhasil diperbarui.");
    } catch {
      tampilkanPesan("Gagal memperbarui status ulasan.", true);
    }
  }

  function hapusUlasan(id: string) {
    if (!window.confirm("Yakin ingin menghapus ulasan ini?")) {
      return;
    }

    try {
      const terbaru = bacaMemories().filter(
        (item) => item.id !== id
      );

      simpanMemories(terbaru);
      tampilkanPesan("Ulasan berhasil dihapus.");
    } catch {
      tampilkanPesan("Gagal menghapus ulasan.", true);
    }
  }

  const hasil = daftar.filter(
    (item) => filter === "all" || item.status === filter
  );

  const labelStatus = {
    pending: "Menunggu Persetujuan",
    approved: "Disetujui",
    rejected: "Ditolak",
  };

  return (
  <div>
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fs-4 fw-bold mb-4">
        Wall of Memories
      </h2>
      <p>Setujui, tolak, atau hapus ulasan dari pengunjung.</p>

      <div className="mb-3">
        <label htmlFor="filter-memory" className="form-label">
          Filter Status
        </label>
        <select
          id="filter-memory"
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua Ulasan</option>
          <option value="pending">Menunggu Persetujuan</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      {pesan && <p role="status">{pesan}</p>}

      {hasil.length === 0 ? (
        <p>Belum ada ulasan untuk status ini.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Rating</th>
                <th>Cerita</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {hasil.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </td>
                  <td style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                    {item.cerita}
                  </td>
                  <td>
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td>{labelStatus[item.status]}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      {item.status !== "approved" && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            ubahStatus(item.id, "approved")
                          }
                        >
                          Setujui
                        </button>
                      )}

                      {item.status !== "rejected" && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() =>
                            ubahStatus(item.id, "rejected")
                          }
                        >
                          Tolak
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => hapusUlasan(item.id)}
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
  );
}
