"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import RBNavbar from "react-bootstrap/Navbar";
import VisitorLogout from "@/components/VisitorLogout";

type Menu = { id: string; label: string };

// id harus sama dengan id section di halaman utama
const menus: Menu[] = [
  { id: "pengenalan", label: "Pengenalan" },
  { id: "sejarah", label: "Sejarah" },
  { id: "pembuatan", label: "Cara Pembuatan" },
  { id: "rekomendasi", label: "Rekomendasi Tempat" },
  { id: "memories", label: "Wall of Memories" },
];

const HIDDEN_ON = ["/login", "/loginuser", "/register", "/admin"];

export default function Navbar({ role }: { role?: "ADMIN" | "USER" }) {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  // Scroll-spy (seperti di modul): tandai menu sesuai section yang sedang tampil
  useEffect(() => {
    if (pathname !== "/") return;

    function onScroll() {
      let current = "";
      for (const menu of menus) {
        const el = document.getElementById(menu.id);
        if (el && el.getBoundingClientRect().top <= 120) current = menu.id;
      }
      // Mentok di dasar halaman: section terakhir dianggap aktif
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = menus[menus.length - 1].id;
      }
      setActive(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

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
              <Nav.Link
                as={Link}
                href={`/#${menu.id}`}
                key={menu.id}
                active={active === menu.id}
                className="site-nav-link"
              >
                {menu.label}
              </Nav.Link>
            ))}
            <Nav.Item className="nav-logout ms-lg-3">
              {role === "USER" ? (
                <VisitorLogout />
              ) : role === "ADMIN" ? (
                <Nav.Link as={Link} href="/admin" className="fw-semibold">
                  Dashboard admin
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} href="/loginuser" className="fw-semibold">
                  Masuk
                </Nav.Link>
              )}
            </Nav.Item>
          </Nav>