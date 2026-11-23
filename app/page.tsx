import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sejarahFields } from "@/lib/sejarah";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SejarahSection from "@/components/SejarahSection";
import PembuatanSection from "@/components/PembuatanSection";
import RecommendationSection from "@/components/RecommendationSection";
import WallOfMemories from "@/components/WallOfMemories";
import { ABOUT } from "@/prisma/seed-data";

export default async function HomePage() {
  await connection();

  // Website ini khusus pengunjung yang sudah punya akun: belum login -> ke halaman masuk
  const session = await getSession();
  if (!session) redirect("/loginuser");

  // Urutan nama di kiri HARUS sama dengan urutan query di kanan
  const [slides, about, sejarah, tempat, memories] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
    prisma.sejarah.findMany({ orderBy: { order: "asc" }, select: sejarahFields }),
    prisma.place.findMany({ orderBy: { id: "asc" } }),
    prisma.memory.findMany({
      where: { status: "approved" },
      select: { id: true, nama: true, cerita: true, rating: true },
      orderBy: { tanggal: "desc" },
      take: 10,
    }),
  ]);

  // Latar selang-seling: Pengenalan (polkadot) -> Sejarah (polos) -> Cara Pembuatan (polkadot)
  // -> Rekomendasi (polos) -> Wall of Memories (polkadot)
  return (
    <>
      <HeroSection slides={slides} />
      <AboutSection about={about ?? ABOUT} />
      <SejarahSection sejarah={sejarah} />
      <PembuatanSection />
      <RecommendationSection tempat={tempat} />
      <WallOfMemories daftar={memories} />
    </>
  );
}
