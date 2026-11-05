"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const HIDDEN_ON = ["/login", "/register", "/admin"];

export default function Footer() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer id="footer" className="pt-md-5 pb-md-2 py-4 mt-auto">
      <Container>
        <Row>
          <Col md={5} className="mb-3">
            <h3>Kerak Telor</h3>
            <p className="mb-0">
              Website edukasi dan promosi kuliner Betawi. Mengenal asal-usul, cara pembuatan,
              dan tempat terbaik menikmati kerak telor di Jakarta.
            </p>
          </Col>
          <Col md={3} className="mb-3">
            <h4 className="fs-5">Tautan Cepat</h4>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/#pengenalan">Pengenalan</Link></li>
              <li className="mb-2"><Link href="/#sejarah">Sejarah</Link></li>
              <li className="mb-2"><Link href="/#rekomendasi">Rekomendasi Tempat</Link></li>
              <li className="mb-2"><Link href="/#memories">Wall of Memories</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h4 className="fs-5">Tentang Proyek</h4>
            <ul className="list-unstyled">
              <li className="mb-2"><i className="bi bi-people-fill me-2"></i>Kelompok 10 - Makanan Nusantara</li>
              <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>Jakarta, Indonesia</li>
              <li className="mb-2"><i className="bi bi-code-slash me-2"></i>Dibuat dengan Next.js</li>
            </ul>
          </Col>
        </Row>
        <p className="text-center small mb-0 pt-2 border-top border-secondary-subtle">
          &copy; {new Date().getFullYear()} Kerak Telor - Legenda Betawi
        </p>
      </Container>
    </footer>
  );
}
