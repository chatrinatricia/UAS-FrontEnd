// Bagian "Cara Pembuatan". Sementara masih kerangka, supaya menu di navbar sudah punya tujuan.
// TODO (anggota yang mengerjakan): ganti isi <div className="pembuatan-placeholder"> dengan video / langkah-langkah.
import Section from "@/components/Section";

export default function PembuatanSection() {
  return (
    <Section
      id="pembuatan"
      label="Langkah demi langkah"
      title="Cara Pembuatan Kerak Telor"
      description="Video dan panduan membuat kerak telor khas Betawi akan hadir di sini."
    >
      <div className="pembuatan-placeholder">
        <i className="bi bi-play-circle" aria-hidden="true" />
        <p className="mb-0">Bagian ini sedang disiapkan. Nantikan ya!</p>
      </div>
    </Section>
  );
}
