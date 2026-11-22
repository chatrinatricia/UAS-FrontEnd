"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sejarahFields, type SejarahInput, type SejarahItem } from "@/lib/sejarah";

async function requireAdmin() {
  if ((await getSession())?.role !== "ADMIN") throw new Error("Login admin diperlukan.");
}

// Gambar boleh kosong, path lokal ("/images/...") atau URL https
const gambarValid = (url: string) => url === "" || /^(?:\/images\/|https:\/\/)/.test(url);

export async function saveSejarah(id: string | null, form: SejarahInput): Promise<SejarahItem> {
  await requireAdmin();

  const era = String(form.era ?? "").trim();
  const judul = String(form.judul ?? "").trim();
  const deskripsi = String(form.deskripsi ?? "").trim();
  const gambar = String(form.gambar ?? "").trim();
  const caption = String(form.caption ?? "").trim();
  const order = form.order;

  if (
    !judul || judul.length > 150 ||
    !deskripsi || deskripsi.length > 2000 ||
    era.length > 60 || caption.length > 255 ||
    gambar.length > 500 || !gambarValid(gambar) ||
    !Number.isInteger(order) || order < 0 || order > 9999
  ) {
    throw new Error("Data sejarah tidak valid.");
  }

  const data = {
    era: era || null,
    judul,
    deskripsi,
    gambar: gambar || null,
    caption: caption || null,
    order,
  };

  if (id === null) return prisma.sejarah.create({ data, select: sejarahFields });
  return prisma.sejarah.update({ where: { id }, data, select: sejarahFields });
}

export async function deleteSejarah(id: string) {
  await requireAdmin();
  await prisma.sejarah.delete({ where: { id } });
}
