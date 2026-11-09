
export type Tempat = {
  id: number;
  area: string;
  nama: string;
  alamat: string;
  hargaMin: number;
  hargaMax: number;
  maps: string;
  gambar: string;
};

export const TEMPAT_AWAL: Tempat[] = [
  {
    id: 1,
    area: "Jakarta Pusat",
    nama: "Kerak Telor Bang Doel",
    alamat: "Jl. Pintu Air Raya No. 68, Ps. Baru, Sawah Besar, Jakarta Pusat",
    hargaMin: 25000,
    hargaMax: 50000,
    maps: "https://maps.app.goo.gl/smi1s7XqWWG4ocah7",
    gambar: "/images/bangdoel.jpg",
  },
  {
    id: 2,
    area: "Jakarta Pusat",
    nama: "Kerak Telor Depan Ragusa",
    alamat: "Jl. Veteran I (Depan Es Krim Ragusa), Gambir, Jakarta Pusat",
    hargaMin: 25000,
    hargaMax: 35000,
    maps: "https://maps.app.goo.gl/U2TgYS2ZHMKHGdrE9",
    gambar: "/images/depanragusa.jpg",
  },
  {
    id: 3,
    area: "Jakarta Utara",
    nama: "Kerak Telor Bang Roy Ancol",
    alamat: "Pantai Lagoon, Jl. Lodan Timur, Ancol, Pademangan, Jakarta Utara",
    hargaMin: 25000,
    hargaMax: 35000,
    maps: "https://maps.app.goo.gl/VhAMieMQVxdy9vAe8",
    gambar: "/images/bangroyancol.jpg",
  },
  {
    id: 4,
    area: "Jakarta Utara",
    nama: "Kerak Telor Bang Ade (Koja)",
    alamat: "Jl. Labu No. 9, Lagoa, Koja, Jakarta Utara",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/Yh5aP4ArXKjHErvT9",
    gambar: "/images/bangadekoja.webp",
  },
  {
    id: 5,
    area: "Jakarta Selatan",
    nama: "Kerak Telor Bang Dhory",
    alamat: "Jl. Letjen M.T. Haryono Kav. 30, Tebet Timur, Tebet, Jakarta Selatan",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/bQ1nGFBhXjkx38Hy9",
    gambar: "/images/bangdhory.webp",
  },
  {
    id: 6,
    area: "Jakarta Selatan",
    nama: "Kerak Telor Khas Betawi Al Aziz",
    alamat: "Jl. Tebet Barat Dalam Raya (Depan SMK 32), Tebet, Jakarta Selatan",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/cu76vjQxFyHBXG1bA",
    gambar: "/images/alaziz.png",
  },
  {
    id: 7,
    area: "Jakarta Barat",
    nama: "Kerak Telor Tunas Betawi",
    alamat: "Jl. H. Nasir No. 28C, Srengseng, Kembangan, Jakarta Barat",
    hargaMin: 25000,
    hargaMax: 50000,
    maps: "https://maps.app.goo.gl/uQow7vqjmVRhGP8w8",
    gambar: "/images/tunasbetawi.png",
  },
  {
    id: 8,
    area: "Jakarta Timur",
    nama: "Kerak Telor Bang Ade (Ujung Menteng)",
    alamat: "Jl. Satria I No. 261, Ujung Menteng, Cakung, Jakarta Timur",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/XGkqXB5PVtWgj5Yt9",
    gambar: "/images/bangadeujungmenteng.webp",
  },
  {
    id: 9,
    area: "Jakarta Timur",
    nama: "Kerak Telor Bang Roy (Pulo Gebang)",
    alamat: "Jl. Swadaya Pos, Pulo Gebang, Cakung, Jakarta Timur",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/veDRPJ5MpzqxyEjc7",
    gambar: "/images/bangroypulogebang.webp",
  },
  {
    id: 10,
    area: "Jakarta Timur",
    nama: "Kerak Telor Mpok Ayu",
    alamat: "Jl. Prumpung Barat, Rawa Bunga, Jatinegara, Jakarta Timur",
    hargaMin: 20000,
    hargaMax: 30000,
    maps: "https://maps.app.goo.gl/Bq6LDs3RguAvUEhC9",
    gambar: "/images/mpokayu.webp",
  },
];

export const KUNCI_TEMPAT = "kt_tempat";

export function bacaTempat(): Tempat[] {
  if (typeof window === "undefined") return TEMPAT_AWAL;

  try {
    const data = localStorage.getItem(KUNCI_TEMPAT);
    return data === null ? TEMPAT_AWAL : JSON.parse(data);
  } catch {
    return TEMPAT_AWAL;
  }
}

export function simpanTempat(data: Tempat[]) {
  localStorage.setItem(KUNCI_TEMPAT, JSON.stringify(data));
  window.dispatchEvent(new Event("tempat-updated"));
}
