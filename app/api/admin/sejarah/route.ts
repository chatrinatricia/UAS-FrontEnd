import { NextResponse } from "next/server";
import { adminOnly } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const denied = await adminOnly();
  if (denied) return denied;

  try {
    const sejarah = await prisma.sejarah.findFirst();
    return NextResponse.json(sejarah || { judul: "", deskripsi: "" });
  } catch {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

// POST: perbarui sejarah, atau buat baru kalau belum ada (khusus admin)
export async function POST(request: Request) {
  const denied = await adminOnly();
  if (denied) return denied;

  try {
    const body = await request.json();
    const judul = typeof body.judul === "string" ? body.judul.trim() : "";
    const deskripsi = typeof body.deskripsi === "string" ? body.deskripsi.trim() : "";

    if (!judul || !deskripsi) {
      return NextResponse.json({ error: "Judul dan deskripsi wajib diisi" }, { status: 400 });
    }

    const existing = await prisma.sejarah.findFirst();
    const result = existing
      ? await prisma.sejarah.update({ where: { id: existing.id }, data: { judul, deskripsi } })
      : await prisma.sejarah.create({ data: { judul, deskripsi } });

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}