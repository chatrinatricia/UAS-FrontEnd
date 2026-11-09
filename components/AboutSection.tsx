"use client";
// Bagian "Pengenalan": Row + Col md={...} membagi layar jadi 2 (seperti bagian About Us di modul).
import Image from "next/image";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Section from "@/components/Section";
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
    <Section id="pengenalan" title={about.title}>
      <Row className="align-items-center g-5">
        <Col md={5}>
          <Image
            src={about.image}
            alt={about.title}
            width={910}
            height={1281}
            unoptimized={about.image.startsWith("http")}
            className="about-img"
          />
        </Col>
        <Col md={7}>
          <h3 className="mb-3">{about.heading}</h3>
          <p>{about.paragraph}</p>
          {about.quote && <p className="fst-italic">&ldquo;{about.quote}&rdquo;</p>}
          {features.length > 0 && (
            <Row className="g-3 mt-2">
              {features.map((f) => (
                <Col sm={6} key={f.title}>
                  <Card body className="h-100">
                    <Card.Title as="h4" className="fs-5">{f.title}</Card.Title>
                    <Card.Text>{f.text}</Card.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Section>
  );
}
