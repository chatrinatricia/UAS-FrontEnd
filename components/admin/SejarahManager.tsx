"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type SejarahItem = {
  id: number;
  era: string;
  judul: string;
  deskripsi: string;
  gambar: string | null;
  caption: string | null;
  order: number;
};

export default function SejarahManager() {
  const [dataSejarah, setDataSejarah] = useState<SejarahItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    era: "",
    judul: "",
    deskripsi: "",
    gambar: "",
    caption: "",
    order: 1,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sejarah");
      if (res.ok) {
        const json = await res.json();
        setDataSejarah(json);
      }
    } catch (error) {
      console.error("Gagal memuat data sejarah", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editId ? `/api/sejarah/${editId}` : "/api/sejarah";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ era: "", judul: "", deskripsi: "", gambar: "", caption: "", order: 1 });
        setEditId(null);
        fetchData();
        alert(editId ? "Berhasil memperbarui sejarah!" : "Berhasil menambah era sejarah!");
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (item: SejarahItem) => {
    setEditId(item.id);
    setForm({
      era: item.era,
      judul: item.judul,
      deskripsi: item.deskripsi,
      gambar: item.gambar || "",
      caption: item.caption || "",
      order: item.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus era sejarah ini?")) return;
    try {
      const res = await fetch(`/api/sejarah/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Tambah / Edit Sejarah */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#5C3A21] mb-6 border-b pb-3">
          {editId ? "Edit Sejarah" : "Tambah / Edit Sejarah"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Era / Tahun
              </label>
              <input
                type="text"
                value={form.era}
                onChange={(e) => setForm({ ...form, era: e.target.value })}
                placeholder="Contoh: Era 1920-an"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Judul Periode
              </label>
              <input
                type="text"
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Contoh: Awal Mulai Ciptaan Tanpa Sengaja"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Deskripsi Sejarah
            </label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Tuliskan cerita sejarah..."
              required
              rows={4}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                URL / Jalur Gambar
              </label>
              <input
                type="text"
                value={form.gambar}
                onChange={(e) => setForm({ ...form, gambar: e.target.value })}
                placeholder="Contoh: images/sejarah1.jpg atau https://..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Caption / Teks Gambar
              </label>
              <input
                type="text"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Contoh: Awal kreasi masyarakat Betawi Menteng..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#8B5A2B] text-white font-semibold text-sm rounded-lg hover:bg-[#6e4621] transition shadow-md"
            >
              {editId ? "Simpan Perubahan" : "Simpan ke Database"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ era: "", judul: "", deskripsi: "", gambar: "", caption: "", order: 1 });
                }}
                className="px-4 py-3 bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabel Daftar Sejarah */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-lg text-[#5C3A21]">Daftar Sejarah</h3>
          <button 
            onClick={() => {
              if (confirm("Reset data ke awal?")) {
                fetch("/api/seed", { method: "POST" }).then(() => fetchData());
              }
            }}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-100 text-gray-700 transition"
          >
            Kembalikan Data Awal
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Memuat data...</div>
        ) : dataSejarah.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2D221C] text-white text-xs uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">ID</th>
                  <th className="p-4 w-32">Gambar</th>
                  <th className="p-4 w-28">Era</th>
                  <th className="p-4">Judul & Deskripsi</th>
                  <th className="p-4 w-56">Caption Gambar</th>
                  <th className="p-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {dataSejarah.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 text-center font-medium text-gray-600">{item.id}</td>
                    <td className="p-4">
                      {item.gambar ? (
                        <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <Image
                            src={item.gambar}
                            alt={item.judul}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-bold bg-[#8B5A2B] text-white rounded-md whitespace-nowrap">
                        {item.era}
                      </span>
                    </td>
                    <td className="p-4 space-y-1">
                      <h4 className="font-bold text-[#5C3A21]">{item.judul}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {item.deskripsi}
                      </p>
                    </td>
                    <td className="p-4 text-xs italic text-gray-500">
                      {item.caption ? `"${item.caption}"` : "-"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded shadow-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-sm transition"
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
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">Belum ada data sejarah di database.</div>
        )}
      </div>
    </div>
  );
}