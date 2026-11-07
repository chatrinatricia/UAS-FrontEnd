import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RecommendationSection from "@/components/RecommendationSection";
import { ABOUT } from "@/prisma/seed-data";

export default async function HomePage() {
  await connection();

  const [slides, about] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <>
      <HeroSection slides={slides} />
      <AboutSection about={about ?? ABOUT} />
      <RecommendationSection />
    </>
  );
}
