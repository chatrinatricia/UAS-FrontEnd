import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ===== Data awal (berdiri sendiri, tidak mengimpor file lain) =====
const HERO_SLIDES = [
  {
    title: "Kelezatan Otentik Kerak Telor Betawi",
    subtitle: "Menyusuri jejak aroma arang, gurihnya kelapa sangrai, dan kehangatan tradisi kuliner tempo doeloe.",
    imageUrl: "/images/hero-bg.jpg",
    sortOrder: 1,
  },
  {
    title: "Dimasak di Atas Bara Arang",
    subtitle: "Dibalik di atas bara tanpa minyak hingga kerak ketan matang dan harum.",
    imageUrl: "/images/masak-kerak-telor-bang.jpeg",
    sortOrder: 2,
  },
  {
    title: "Jajanan Legendaris Jakarta",
    subtitle: "Temukan penjaja kerak telor terbaik di lima wilayah Jakarta.",
    imageUrl: "/images/bangdoel.jpg",
    sortOrder: 3,
  },
];

const ABOUT = {
  id: 1,
  title: "Apa itu Kerak Telor?",
  heading: "Mahakarya Kuliner Tradisional Asli Jakarta",
  paragraph:
    "Kerak Telor adalah makanan asli daerah Jakarta (Betawi), yang terbuat dari bahan-bahan utama beras ketan putih, telur ayam atau bebek, ebi (udang kering yang diasinkan dan disangrai kering), ditambah bawang merah goreng, lalu diberi bumbu halus khusus.",
  quote: "Perpaduan sempurna ketan putih, telur bebek, ebi gurih, dan serundeng kelapa khas.",
  image: "/images/kerak-telor-utama.jpeg",
  feature1Title: "Beras Ketan Berkualitas",
  feature1Text: "Dimasak pulen di atas wajan khusus tanpa minyak.",
  feature2Title: "Serundeng & Ebi",
  feature2Text: "Memberikan aroma harum khas yang menggugah selera.",
};

const SEJARAH = [
  {
    era: "Era 1920-an",
    judul: "Awal Mulai Ciptaan Tanpa Sengaja",
    deskripsi:
      "Kerak telor lahir dari kreativitas masyarakat Betawi di kawasan Menteng, Batavia pada tahun 1920-an. Warga memanfaatkan melimpahnya kelapa dan beras ketan, lalu memasaknya di atas wajan tanpa minyak.",
    gambar: "/images/kerak-telor-utama.jpeg",
    caption: "Suasana Batavia tempo dulu",
    order: 1,
  },
  {
    era: "Era 1970-an",
    judul: "Menjadi Hidangan Mewah & Ikonik",
    deskripsi:
      "Pada masa kepemimpinan Gubernur Ali Sadikin, kerak telor mulai diangkat dan dipromosikan sebagai identitas budaya Betawi.",
    gambar: "/images/masak-kerak-telor-bang.jpeg",
    caption: "Abang penjual kerak telor tradisional",
    order: 2,
  },
  {
    era: "Masa Kini",
    judul: "Warisan Budaya yang Tetap Abadi",
    deskripsi:
      "Kerak telor bukan sekadar kuliner lezat, tetapi juga lambang hangatnya budaya Batavia yang terus dilestarikan.",
    gambar: "/images/kerak-telor-abang.jpeg",
    caption: "Penyajian kerak telor modern",
    order: 3,
  },
];

const TEMPAT = [
  {
    area: "Jakarta Pusat",
    nama: "Kerak Telor Bang Doel",
    alamat: "Jl. Pintu Air Raya No. 68, Ps. Baru, Sawah Besar, Jakarta Pusat",
    hargaMin: 25000,
    hargaMax: 50000,
    maps: "https://maps.app.goo.gl/smi1s7XqWWG4ocah7",
    gambar: "/images/bangdoel.jpg",
  },
  {
    area: "Jakarta Pusat",
    nama: "Kerak Telor Depan Ragusa",
    alamat: "Jl. Veteran I (Depan Es Krim Ragusa), Gambir, Jakarta Pusat",
    hargaMin: 25000,
    hargaMax: 35000,
    maps: "https://maps.app.goo.gl/U2TgYS2ZHMKHGdrE9",
    gambar: "/images/depanragusa.jpg",
  },
  {
    area: "Jakarta Utara",
    nama: "Kerak Telor Bang Roy Ancol",
    alamat: "Pantai Lagoon, Jl. Lodan Timur, Ancol, Pademangan, Jakarta Utara",
    hargaMin: 25000,
    hargaMax: 35000,
    maps: "https://maps.app.goo.gl/VhAMieMQVxdy9vAe8",
    gambar: "/images/bangroyancol.jpg",
  },
  {
    area: "Jakarta Utara",
    nama: "Kerak Telor Bang Ade (Koja)",
    alamat: "Jl. Labu No. 9, Lagoa, Koja, Jakarta Utara",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/Yh5aP4ArXKjHErvT9",
    gambar: "/images/bangadekoja.webp",
  },
  {
    area: "Jakarta Selatan",
    nama: "Kerak Telor Bang Dhory",
    alamat: "Jl. Letjen M.T. Haryono Kav. 30, Tebet Timur, Tebet, Jakarta Selatan",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/bQ1nGFBhXjkx38Hy9",
    gambar: "/images/bangdhory.webp",
  },
  {
    area: "Jakarta Selatan",
    nama: "Kerak Telor Khas Betawi Al Aziz",
    alamat: "Jl. Tebet Barat Dalam Raya (Depan SMK 32), Tebet, Jakarta Selatan",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/cu76vjQxFyHBXG1bA",
    gambar: "/images/alaziz.png",
  },
  {
    area: "Jakarta Barat",
    nama: "Kerak Telor Tunas Betawi",
    alamat: "Jl. H. Nasir No. 28C, Srengseng, Kembangan, Jakarta Barat",
    hargaMin: 25000,
    hargaMax: 50000,
    maps: "https://maps.app.goo.gl/uQow7vqjmVRhGP8w8",
    gambar: "/images/tunasbetawi.png",
  },
  {
    area: "Jakarta Timur",
    nama: "Kerak Telor Bang Ade (Ujung Menteng)",
    alamat: "Jl. Satria I No. 261, Ujung Menteng, Cakung, Jakarta Timur",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/XGkqXB5PVtWgj5Yt9",
    gambar: "/images/bangadeujungmenteng.webp",
  },
  {
    area: "Jakarta Timur",
    nama: "Kerak Telor Bang Roy (Pulo Gebang)",
    alamat: "Jl. Swadaya Pos, Pulo Gebang, Cakung, Jakarta Timur",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/veDRPJ5MpzqxyEjc7",
    gambar: "/images/bangroypulogebang.webp",
  },
  {
    area: "Jakarta Timur",
    nama: "Kerak Telor Mpok Ayu",
    alamat: "Jl. Prumpung Barat, Rawa Bunga, Jatinegara, Jakarta Timur",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/Bq6LDs3RguAvUEhC9",
    gambar: "/images/mpokayu.webp",
  },
];

async function main() {
  // Tabel konten hanya diisi kalau masih kosong, jadi hasil edit di dashboard tidak tertimpa.
  if ((await prisma.heroSlide.count()) === 0) await prisma.heroSlide.createMany({ data: HERO_SLIDES });
  if ((await prisma.sejarah.count()) === 0) await prisma.sejarah.createMany({ data: SEJARAH });
  if ((await prisma.place.count()) === 0) await prisma.place.createMany({ data: TEMPAT });
  await prisma.aboutContent.upsert({ where: { id: 1 }, update: {}, create: ABOUT });

  const username = (process.env.ADMIN_USERNAME ?? "admin").toLowerCase();
  const passwordHash = await hash(process.env.ADMIN_PASSWORD ?? "admin123", 10);
  await prisma.user.upsert({
    where: { username },
    update: { passwordHash, role: "ADMIN" },
    create: { username, passwordHash, role: "ADMIN" },
  });

  console.log(`Seeding selesai. Akun admin: "${username}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
