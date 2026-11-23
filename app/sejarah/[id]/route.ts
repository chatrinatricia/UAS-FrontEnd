import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.sejarah.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Berhasil menghapus data" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { era, judul, deskripsi, gambar, caption, order } = body;

    const updated = await prisma.sejarah.update({
      where: { id },
      data: {
        era,
        judul,
        deskripsi,
        gambar: gambar || null,
        caption: caption || null,
        order: Number(order) || 1,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate data" }, { status: 500 });
  }
}