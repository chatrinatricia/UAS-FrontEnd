"use client";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import type { HeroSlide } from "@/lib/types";

type HeroSectionProps = {
  slides: HeroSlide[];
};

export default function HeroSection({ slides }: HeroSectionProps) {
  if (slides.length === 0) {
    return (
      <div className="hero-slide d-flex align-items-center justify-content-center bg-dark text-white">
        <p className="mb-0">Belum ada slide. Tambahkan lewat dashboard admin.</p>
      </div>
    );
  }

  return (
    <Carousel fade interval={4500}>
      {slides.map((slide, index) => (
        <Carousel.Item key={slide.id}>
          <div className="hero-slide">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={index === 0}
              unoptimized={slide.imageUrl.startsWith("http")}
              className="hero-img"
            />
          </div>
          <Carousel.Caption className="hero-caption">
            <h1 className="display-5 fw-bold">{slide.title}</h1>
            <p className="lead">{slide.subtitle}</p>
            <Button href="#pengenalan" variant="primary" size="lg">
              Jelajahi Kelezatan &darr;
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
