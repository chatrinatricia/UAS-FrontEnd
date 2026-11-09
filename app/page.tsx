import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RecommendationSection from "@/components/RecommendationSection";
import WallOfMemories from "@/components/WallOfMemories";
import { ABOUT } from "@/prisma/seed-data";

export default async function HomePage() {
  await connection();

  const [slides, about, memories] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
    prisma.memory.findMany({
      where: { status: "approved" },
      select: { id: true, nama: true, cerita: true, rating: true },
      orderBy: { tanggal: "desc" },
    }),
  ]);

  return (
    <>
      <HeroSection slides={slides} />
      <AboutSection about={about ?? ABOUT} />
      <RecommendationSection />
      <WallOfMemories daftar={memories} />
    </>
  );
}
