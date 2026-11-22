// Tipe dan daftar kolom Sejarah (sama polanya dengan lib/memories.ts).
// Hanya kolom ini yang dikirim ke Client Component, jadi tidak ada objek Date.
export type SejarahItem = {
  id: string;
  era: string | null;
  judul: string;
  deskripsi: string;
  gambar: string | null;
  caption: string | null;
  order: number;
};

export type SejarahInput = {
  era: string;
  judul: string;
  deskripsi: string;
  gambar: string;
  caption: string;
  order: number;
};

export const sejarahFields = {
  id: true,
  era: true,
  judul: true,
  deskripsi: true,
  gambar: true,
  caption: true,
  order: true,
} as const;
