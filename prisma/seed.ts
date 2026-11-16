import "dotenv/config";
import { TEMPAT_AWAL } from "../lib/recommendations";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { HERO_SLIDES, ABOUT } from "./seed-data";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SEJARAH_DATA = [
  {
    era: "Era 1920-an",
    judul: "Awal Mulai Ciptaan Tanpa Sengaja",
    deskripsi: "Kerak telor lahir dari kreativitas masyarakat Betawi di kawasan Menteng, Batavia pada tahun 1920-an.",
    gambar: "/images/kerak-telor-utama.jpeg",
    caption: "Suasana Batavia tempo dulu",
    order: 1,
  },
  {
    era: "Era 1970-an",
    judul: "Menjadi Hidangan Mewah & Ikonik",
    deskripsi: "Pada masa kepemimpinan Gubernur Ali Sadikin, kerak telor mulai diangkat dan dipromosikan sebagai identitas budaya Betawi.",
    gambar: "/images/masak-kerak-telor-bang.jpeg",
    caption: "Abang penjual kerak telor tradisional",
    order: 2,
  },
  {
    era: "Masa Kini",
    judul: "Warisan Budaya yang Tetap Abadi",
    deskripsi: "Kerak telor bukan sekadar kuliner lezat, tetapi juga lambang hangatnya budaya Batavia yang terus dilestarikan.",
    gambar: "/images/kerak-telor-abang.jpeg",
    caption: "Penyajian kerak telor modern",
    order: 3,
  },
];

async function main() {
  if (await prisma.place.count() === 0) {
    await prisma.place.createMany({ data: TEMPAT_AWAL });
  }

  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({ data: HERO_SLIDES });

  await prisma.aboutContent.upsert({ where: { id: 1 }, update: ABOUT, create: ABOUT });

await prisma.sejarah.deleteMany();
  await prisma.sejarah.createMany({ data: SEJARAH_DATA });

  const username = (process.env.ADMIN_USERNAME ?? "admin").toLowerCase();
  const passwordHash = await hash(process.env.ADMIN_PASSWORD ?? "admin123", 10);
  await prisma.user.upsert({
    where: { username },
    update: { passwordHash, role: "ADMIN" },
    create: { username, passwordHash, role: "ADMIN" },
  });
  console.log(`Seeding selesai: ${HERO_SLIDES.length} slide hero, 1 pengenalan, sejarah, admin "${username}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());