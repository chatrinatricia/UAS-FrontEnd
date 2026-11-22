import Section from "@/components/Section";
import type { SejarahItem } from "@/lib/sejarah";

type SejarahSectionProps = {
  sejarah: SejarahItem[];
};

export default function SejarahSection({ sejarah }: SejarahSectionProps) {
  // Foto di kolom kanan: hanya item yang punya gambar
  const photos = sejarah.filter((item) => item.gambar);

  return (
    <Section id="sejarah" alt label="Nostalgia & Asal Usul" title="Sejarah & Perjalanan Kerak Telor">
      {sejarah.length === 0 ? (
        <p className="text-center text-body-secondary">Belum ada data sejarah.</p>
      ) : (
        <div className="sejarah-layout">
          <div className="sejarah-list">
            {sejarah.map((item) => (
              <article className="sejarah-card" key={item.id}>
                {item.era && <span className="sejarah-era">{item.era}</span>}
                <h3>{item.judul}</h3>
                <p>{item.deskripsi}</p>
              </article>
            ))}
          </div>

          {photos.length > 0 && (
            <div className="sejarah-gallery">
              {photos.map((item) => (
                <figure className="sejarah-photo" key={item.id}>
                  <img src={item.gambar!} alt={item.judul} />
                  {item.caption && <figcaption>&ldquo;{item.caption}&rdquo;</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
