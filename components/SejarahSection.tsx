import Section from "@/components/Section";
import Image from "next/image";

type SejarahItem = {
  id: string | number;
  era: string;
  judul: string;
  deskripsi: string;
  gambar: string | null;
  caption: string | null;
  order: number;
};

type SejarahSectionProps = {
  sejarah: SejarahItem[];
};

export default function SejarahSection({ sejarah }: SejarahSectionProps) {
  // Ambil item yang punya gambar (maksimal 2 untuk kolom kanan)
  const itemsWithImages = sejarah.filter((item) => item.gambar).slice(0, 2);

  return (
    <Section
      id="sejarah"
      alt
      label="Nostalgia & Asal Usul"
      title="Sejarah & Perjalanan Kerak Telor"
    >
      {Array.isArray(sejarah) && sejarah.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start", maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* KOLOM KIRI: 3 Card Teks */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {sejarah.map((item) => (
              <div 
                key={item.id} 
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "1.75rem",
                  borderRadius: "1rem",
                  borderLeft: "4px solid #8B5A2B",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <span style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  backgroundColor: "#8B5A2B",
                  color: "#FFFFFF",
                  borderRadius: "0.375rem",
                  marginBottom: "0.75rem"
                }}>
                  {item.era}
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#5C3A21", marginBottom: "0.5rem" }}>
                  {item.judul}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#4B5563", lineHeight: "1.6" }}>
                  {item.deskripsi}
                </p>
              </div>
            ))}
          </div>

          {/* Card Gambar dengan Footer Coklat */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {itemsWithImages.map((item) => (
              <div 
                key={`img-${item.id}`} 
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ position: "relative", height: "280px", width: "100%", backgroundColor: "#F3F4F6" }}>
                  <Image
                    src={item.gambar!}
                    alt={item.judul}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {item.caption && (
                  <div style={{ backgroundColor: "#4E342E", padding: "0.875rem 1rem", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#F5EDE1", margin: 0 }}>
                      &ldquo;{item.caption}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#6B7280" }}>Belum ada data sejarah.</p>
      )}
    </Section>
  );
}