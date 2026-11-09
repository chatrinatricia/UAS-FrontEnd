import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { HERO_SLIDES, ABOUT } from "./seed-data";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({ data: HERO_SLIDES });

  await prisma.aboutContent.upsert({ where: { id: 1 }, update: ABOUT, create: ABOUT });

  const username = (process.env.ADMIN_USERNAME ?? "admin").toLowerCase();
  const passwordHash = await hash(process.env.ADMIN_PASSWORD ?? "admin123", 10);
  await prisma.user.upsert({
    where: { username },
    update: { passwordHash, role: "ADMIN" },
    create: { username, passwordHash, role: "ADMIN" },
  });

  console.log(`Seeding selesai: ${HERO_SLIDES.length} slide hero, 1 pengenalan, admin "${username}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
