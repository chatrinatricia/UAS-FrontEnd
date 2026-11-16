import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await prisma.sejarah.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Berhasil menghapus data" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
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
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data" }, { status: 500 });
  }
}