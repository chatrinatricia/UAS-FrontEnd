// POST /api/hero -> tambah slide hero (admin)
import { prisma } from "@/lib/prisma";
import { adminOnly } from "@/lib/auth";
import { json, readBody } from "@/lib/http";
import { parseHero } from "@/lib/validators";

export async function POST(request: Request) {
  const denied = await adminOnly();
  if (denied) return denied;

  const data = parseHero(await readBody(request));
  if (typeof data === "string") return json(data, 400);

  const terakhir = await prisma.heroSlide.aggregate({ _max: { sortOrder: true } });
  const slide = await prisma.heroSlide.create({
    data: { ...data, sortOrder: (terakhir._max.sortOrder ?? 0) + 1 },
  });
  return Response.json(slide, { status: 201 });
}
