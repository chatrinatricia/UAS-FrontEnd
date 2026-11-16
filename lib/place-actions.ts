"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Tempat } from "@/lib/recommendations";

async function requireAdmin() {
  if ((await getSession())?.role !== "ADMIN") throw new Error("Login admin diperlukan.");
}

export async function savePlace(id: number | null, form: Omit<Tempat, "id">) {
  await requireAdmin();
  const { area, nama, alamat, hargaMin, hargaMax, maps, gambar } = form;
  if (![area, nama, alamat].every(value => typeof value === "string" && value.trim()) ||
      ![hargaMin, hargaMax].every(value => Number.isInteger(value) && value >= 0 && value <= 2147483647) ||
      hargaMax < hargaMin || typeof maps !== "string" || (maps && new URL(maps).protocol !== "https:") ||
      typeof gambar !== "string" || gambar.length > 280000 ||
      (gambar && !/^(?:\/images\/|https:\/\/|data:image\/(?:jpeg|png|webp);base64,)/.test(gambar))) {
    throw new Error("Data tempat tidak valid.");
  }
  const data = { area: area.trim(), nama: nama.trim(), alamat: alamat.trim(), hargaMin, hargaMax, maps, gambar };
  if (id === null) return prisma.place.create({ data });
  return prisma.place.update({ where: { id }, data });
}

export async function deletePlace(id: number) {
  await requireAdmin();
  await prisma.place.delete({ where: { id } });
}
