"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "react-bootstrap/Container";
import "bootstrap-icons/font/bootstrap-icons.css";

const HIDDEN_ON = ["/login", "/register", "/admin"];

// ====== BAGIAN YANG BOLEH DIEDIT KELOMPOK ======
const ORGANISASI = "Kelompok 10 - Makanan Nusantara";

// Isi `akun` dengan nama akun asli. Isi `url` dengan link profilnya supaya bisa diklik
// (kalau url dikosongkan, hanya tampil sebagai teks).
const SOSMED = [
  { nama: "Instagram", akun: "@kelompok10", ikon: "bi-instagram", url: "" },
  { nama: "TikTok", akun: "@kelompok10", ikon: "bi-tiktok", url: "" },
  { nama: "YouTube", akun: "Kelompok 10", ikon: "bi-youtube", url: "" },
];

export default function Footer() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer id="footer" className="site-footer mt-auto">
      <Container>
        <div className="footer-main">
          <div>
            <Link href="/" className="footer-brand">
              <Image src="/images/logo.jpeg" alt="Logo Kerak Telor" width={36} height={36} className="brand-logo" />
              <span className="footer-brand-name">Kerak Telor</span>
            </Link>
            <p className="footer-org">
              Dikelola oleh <strong>{ORGANISASI}</strong>
            </p>
          </div>

          <div>
            <p className="footer-social-title">Ikuti Kami</p>
            <ul className="footer-social">
              {SOSMED.map((s) => {
                const isi = (
                  <>
                    <i className={`bi ${s.ikon}`} aria-hidden="true" />
                    <span className="footer-social-name">{s.nama}</span>
                    <span className="footer-social-handle">{s.akun}</span>
                  </>
                );
                return (
                  <li key={s.nama}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {isi}
                      </a>
                    ) : (
                      <span className="footer-social-item">{isi}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} {ORGANISASI}. Seluruh hak cipta dilindungi.
        </p>
      </Container>
    </footer>
  );
}
