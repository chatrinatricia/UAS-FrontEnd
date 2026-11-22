"use client";

import { useState } from "react";
import type { Tempat } from "@/lib/recommendations";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function RecommendationSection({ tempat }: { tempat: Tempat[] }) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const groups = new Map<string, Tempat[]>();
  for (const item of tempat) {
    const area = item.area.trim() || "Area lainnya";
    const group = groups.get(area);
    if (group) group.push(item);
    else groups.set(area, [item]);
  }

  const areas = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b, "id"));
  const activeArea = selectedArea && groups.has(selectedArea) ? selectedArea : null;
  const visibleAreas = activeArea ? [activeArea] : areas;

  return (
    <section id="rekomendasi" className="rekomendasi-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">Kuliner Betawi di Jakarta</span>
          <h2>Rekomendasi Tempat Kerak Telor</h2>
          {areas.length > 0 && (
            <div className="recommendation-filters" role="group" aria-label="Filter wilayah">
              {[null, ...areas].map((area) => (
                <button key={area ?? ""} type="button"
                  aria-pressed={activeArea === area} aria-controls="daftar-rekomendasi"
                  onClick={() => setSelectedArea(area)}>
                  {area ?? "Semua"}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="recommendation-list" id="daftar-rekomendasi">
          {tempat.length === 0 && <p>Belum ada rekomendasi tempat.</p>}
          {visibleAreas.map((area) => (
            <section className="recommendation-group" key={area}>
              <h3>{area}</h3>
              <ul>
                {groups.get(area)?.map((item) => (
                  <li key={item.id}>
                    {item.gambar && (
                      <img src={item.gambar} alt="" loading="lazy" />
                    )}
                    <div>
                      <h4>{item.nama}</h4>
                      <p className="place-price">
                        {rupiah.format(item.hargaMin)}–{rupiah.format(item.hargaMax)}
                      </p>
                      <p>{item.alamat}</p>
                      {item.maps && (
                        <a className="place-map-link" href={item.maps} target="_blank" rel="noopener noreferrer"
                          aria-label={`Lihat ${item.nama} di Google Maps`}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          Lihat di Maps
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
