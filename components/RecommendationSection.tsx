
"use client";

import { useEffect, useState } from "react";
import {
  bacaTempat,
  TEMPAT_AWAL,
  type Tempat,
} from "@/lib/recommendations";

export default function RecommendationSection() {
  const [tempat, setTempat] = useState<Tempat[]>(TEMPAT_AWAL);

  useEffect(() => {
    function muatData() {
      setTempat(bacaTempat());
    }

    muatData();

    window.addEventListener("storage", muatData);
    window.addEventListener("tempat-updated", muatData);

    return () => {
      window.removeEventListener("storage", muatData);
      window.removeEventListener("tempat-updated", muatData);
    };
  }, []);

  function formatRupiah(angka: number) {
    return "IDR " + angka.toLocaleString("id-ID");
  }

  return (
    <section id="rekomendasi" className="rekomendasi-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">
            Kuliner Betawi di Jakarta
          </span>

          <h2>Rekomendasi Tempat Kerak Telor</h2>

          <p className="section-desc">
            Beberapa tempat di Jakarta yang dapat dikunjungi
            untuk menikmati kerak telor khas Betawi.
          </p>
        </div>

        <div className="recommendation-grid">
          {tempat.length === 0 ? (
            <p>Belum ada rekomendasi tempat.</p>
          ) : (
            tempat.map((item) => (
              <div className="recommendation-card" key={item.id}>
                {item.gambar && (
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="recommendation-image"
                  />
                )}

                <span className="recommendation-area">
                  {item.area}
                </span>

                <h3>{item.nama}</h3>

                <p>
                  <strong>Alamat: </strong>
                  {item.alamat}
                </p>

                <p>
                  <strong>Range Harga: </strong>
                  {formatRupiah(item.hargaMin)} -{" "}
                  {formatRupiah(item.hargaMax)}
                </p>

                {item.maps && (
                  <a
                    href={item.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="maps-btn"
                  >
                    📍 Google Maps
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
