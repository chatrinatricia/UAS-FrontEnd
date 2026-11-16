import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sejarah = await prisma.sejarah.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(sejarah);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { era, judul, deskripsi, gambar, caption, order } = body;

    const newSejarah = await prisma.sejarah.create({
      data: {
        era,
        judul,
        deskripsi,
        gambar: gambar || null,
        caption: caption || null,
        order: Number(order) || 1,
      },
    });

    return NextResponse.json(newSejarah, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}