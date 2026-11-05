"use client";
import type { ReactNode } from "react";
import Container from "react-bootstrap/Container";

type SectionProps = {
  id: string;
  title: string;
  label?: string;
  description?: string;
  alt?: boolean;
  children: ReactNode;
};

export default function Section({ id, title, label, description, alt = false, children }: SectionProps) {
  return (
    <section id={id} className={`section ${alt ? "section-alt" : ""}`}>
      <Container>
        <div className="text-center mb-5">
          {label && <span className="section-label">{label}</span>}
          <h2 className="display-6 fw-bold">{title}</h2>
          {description && <p className="text-body-secondary mx-auto" style={{ maxWidth: 560 }}>{description}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}
