"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Memory } from "@/lib/memories";
import { api, errorMessage } from "@/lib/api";

type Props = { daftar: Pick<Memory, "id" | "nama" | "cerita" | "rating">[] };

export default function WallOfMemories({ daftar }: Props) {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [rating, setRating] = useState(0);
  const [cerita, setCerita] = useState("");
  const [pesan, setPesan] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const perbarui = () => router.refresh();
    window.addEventListener("focus", perbarui);
    return () => window.removeEventListener("focus", perbarui);
  }, [router]);

  async function kirimUlasan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    if (rating === 0) {
      setPesan("Silakan pilih rating terlebih dahulu.");
      return;
    }

    if (!cerita.trim()) {
      setPesan("Ulasan harus diisi.");
      return;
    }

    setBusy(true);
    setPesan("");
    try {
      await api("/api/memories", "POST", { nama, rating, cerita });
      setNama("");
      setRating(0);
      setCerita("");
      setPesan("Ulasan berhasil dikirim dan menunggu persetujuan admin.");
    } catch (err) {
      setPesan(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
  <section id="memories">
        <div className="container">
            <div className="section-heading">
                <h2>Wall of Memories</h2>
            <p className="section-desc">
            Bagikan cerita dan pengalamanmu menikmati Kerak Telor khas Betawi.
            </p>
        </div>

        <div className="memory-layout">
          <div className="memory-form-card">
            <h3>Bagikan Kenanganmu</h3>

            <div className="rating-area">
              <p className="rating-question">
                Bagaimana pengalamanmu menikmati Kerak Telor?
              </p>

              <div className="rating-stars" role="group" aria-label="Pilih rating">
                {[1, 2, 3, 4, 5].map((nilai) => (
                  <button
                    key={nilai}
                    type="button"
                    className={`rating-button ${nilai <= rating ? "selected" : ""}`}
                    aria-label={`${nilai} bintang`}
                    aria-pressed={rating === nilai}
                    onClick={() => {
                      setRating(nilai);
                      setPesan("");
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {rating > 0 && (
              <form id="storyForm" onSubmit={kirimUlasan}>
                <label htmlFor="memoryName">
                  Nama (Opsional)
                  <input
                    id="memoryName"
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan nama"
                    maxLength={100}
                  />
                </label>

                <label htmlFor="memoryStory">
                  Cerita Pengalaman
                  <textarea
                    id="memoryStory"
                    rows={4}
                    value={cerita}
                    onChange={(e) => setCerita(e.target.value)}
                    placeholder="Ceritakan pengalamanmu menikmati Kerak Telor..."
                    maxLength={1000}
                    required
                  />
                </label>

                <button type="submit" disabled={busy} className="memory-submit">
                  {busy ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </form>
            )}

            {pesan && (
              <p id="memoryStatus" role="status">
                {pesan}
              </p>
            )}
          </div>

          <div className="memory-list-area">
            <h3>Kenangan Pengunjung</h3>

            {daftar.length === 0 ? (
              <p className="empty-memory">
                Belum ada ulasan yang ditampilkan.
              </p>
            ) : (
              <div className="memory-list">
                {daftar.map((item) => (
                  <div className="memory-note" key={item.id}>
                    <h4>{item.nama}</h4>
                    <p className="story-rating">
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
                    </p>
                    <p className="story-text">{item.cerita}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
