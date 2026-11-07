"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import RBNavbar from "react-bootstrap/Navbar";
import VisitorLogout from "@/components/VisitorLogout";

type Menu = { href: string; label: string };

const menus: Menu[] = [
  { href: "/#pengenalan", label: "Pengenalan" },
  { href: "/#sejarah", label: "Sejarah" },
  { href: "/#pembuatan", label: "Cara Pembuatan" },
  { href: "/#rekomendasi", label: "Rekomendasi Tempat" },
  { href: "/#memories", label: "Wall of Memories" },
];

const HIDDEN_ON = ["/login", "/loginuser", "/register", "/admin"];

export default function Navbar() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <RBNavbar expand="lg" sticky="top" collapseOnSelect className="site-navbar">
      <Container>
        <RBNavbar.Brand as={Link} href="/" className="d-flex align-items-center gap-2">
          <Image src="/images/logo.jpeg" alt="Logo Kerak Telor" width={42} height={42} className="brand-logo" />
          <span>
            <span className="brand-title">Kerak Telor</span>
            <span className="brand-subtitle">Legenda Betawi</span>
          </span>
        </RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="menu-utama" />
        <RBNavbar.Collapse id="menu-utama">
          <Nav className="ms-auto align-items-lg-center">
            {menus.map((menu) => (
              <Nav.Link as={Link} href={menu.href} key={menu.href} className="fw-semibold">
                {menu.label}
              </Nav.Link>
            ))}
            <Nav.Item className="ms-lg-3">
              <VisitorLogout />
            </Nav.Item>
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
}
