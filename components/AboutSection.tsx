"use client";
// Bagian "Pengenalan": foto di kiri, teks di kanan (Row + Col seperti di modul).
import Image from "next/image";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import type { AboutContent } from "@/lib/types";

type AboutSectionProps = {
  about: AboutContent;
};

export default function AboutSection({ about }: AboutSectionProps) {
  const features = [
    { title: about.feature1Title, text: about.feature1Text },
    { title: about.feature2Title, text: about.feature2Text },
  ].filter((f) => f.title);

  return (
    <section id="pengenalan" className="about-section">
      <Container>
        <h2 className="about-title">{about.title}</h2>

        <Row className="align-items-center g-4 g-lg-5">
          <Col lg={5}>
            <div className="about-photo">
              <Image
                src={about.image}
                alt={about.title}
                fill
                sizes="(min-width: 992px) 40vw, 100vw"
                unoptimized={about.image.startsWith("http")}
                className="about-photo-img"
              />
            </div>
          </Col>

          <Col lg={7}>
            <h3 className="about-heading">{about.heading}</h3>
            <p className="about-text">{about.paragraph}</p>
            {about.quote && (
              <blockquote className="about-quote">&ldquo;{about.quote}&rdquo;</blockquote>
            )}

            {features.length > 0 && (
              <Row className="g-3">
                {features.map((f) => (
                  <Col sm={6} key={f.title}>
                    <Card body className="about-feature h-100">
                      <Card.Title as="h4">{f.title}</Card.Title>
                      <Card.Text>{f.text}</Card.Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}