"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import AboutEditor from "@/components/admin/AboutEditor";
import HeroEditor from "@/components/admin/HeroEditor";
import { api } from "@/lib/api";
import type { AboutContent, HeroSlide } from "@/lib/types";

type AdminDashboardProps = {
  username: string;
  initialSlides: HeroSlide[];
  initialAbout: AboutContent;
};

type Toast = { text: string; type: "success" | "danger" };

export default function AdminDashboard({ username, initialSlides, initialAbout }: AdminDashboardProps) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [toast, setToast] = useState<Toast | null>(null);

  // Pesan sukses/gagal yang hilang sendiri setelah 3 detik
  function notify(text: string, type: "success" | "danger" = "success") {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleLogout() {
    await api("/api/admin/logout", "POST");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Tab.Container defaultActiveKey="tampilan">
      <Row className="g-0 min-vh-100">
        <Col md={3} lg={2} className="admin-sidebar p-3 d-flex flex-column">
          <Image src="/images/logo.jpeg" alt="Logo Kerak Telor" width={64} height={64} className="auth-logo" />
          <h2 className="text-center fs-5 fw-bold text-white mb-1">Admin Kerak Telor</h2>
          <p className="text-center small mb-4 opacity-75">Masuk sebagai {username}</p>
          <Nav variant="pills" className="flex-column mb-auto gap-1">
            <Nav.Item><Nav.Link eventKey="tampilan">Tampilan Awal & Pengenalan</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="sejarah">Kelola Sejarah</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="video">Kelola Video</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="tempat">Kelola Tempat</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="ulasan">Moderasi Ulasan</Nav.Link></Nav.Item>
          </Nav>
          <Button variant="outline-light" size="sm" className="mt-3" onClick={handleLogout}>Keluar</Button>
        </Col>

        <Col md={9} lg={10} className="p-4 bg-light overflow-auto">
          <Tab.Content>
            <Tab.Pane eventKey="tampilan">
              <h1 className="fs-3 fw-bold mb-4">Tampilan Awal & Pengenalan</h1>
              <HeroEditor slides={slides} setSlides={setSlides} notify={notify} />
              <AboutEditor initialAbout={initialAbout} notify={notify} />
            </Tab.Pane>

            <Tab.Pane eventKey="sejarah"><p>sejarah.</p></Tab.Pane>
            <Tab.Pane eventKey="video"><p>cara pembuatan (video).</p></Tab.Pane>
            <Tab.Pane eventKey="tempat"><p>rekomendasi tempat.</p></Tab.Pane>
            <Tab.Pane eventKey="ulasan"><p>Wall of Memories.</p></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>

      {toast && (
        <Alert variant={toast.type} className="position-fixed top-0 end-0 m-4 shadow" style={{ zIndex: 1100 }}>
          {toast.text}
        </Alert>
      )}
    </Tab.Container>
  );
}
