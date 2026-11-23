import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SejarahSection from "@/components/SejarahSection";
import RecommendationSection from "@/components/RecommendationSection";
import WallOfMemories from "@/components/WallOfMemories";
import { ABOUT } from "@/prisma/seed-data";

export default async function HomePage() {
  await connection();

  const [slides, about, sejarah, tempat, memories] = await Promise.all([
    prisma.heroSlide.findMany(),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
    prisma.sejarah.findMany({ orderBy: { order: "asc" } }),
    prisma.place.findMany(),
    prisma.memory.findMany({
      where: { status: "approved" },
      select: { id: true, nama: true, cerita: true, rating: true },
      orderBy: { tanggal: "desc" },
    }),
  ]);

  return (
    <>
      <HeroSection slides={slides ?? []} />
      <AboutSection about={about ?? ABOUT} />
      <SejarahSection sejarah={sejarah ?? []} />
      <RecommendationSection tempat={tempat ?? []} /> 
      <WallOfMemories daftar={memories ?? []} />
    </>
  );
}