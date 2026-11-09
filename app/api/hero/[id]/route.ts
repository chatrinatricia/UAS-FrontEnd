import { prisma } from "@/lib/prisma";
import { adminOnly } from "@/lib/auth";
import { json, readBody } from "@/lib/http";
import { parseHero } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const denied = await adminOnly();
  if (denied) return denied;

  const id = Number((await params).id);
  const data = parseHero(await readBody(request));
  if (typeof data === "string") return json(data, 400);

  try {
    return Response.json(await prisma.heroSlide.update({ where: { id }, data }));
  } catch {
    return json("Slide tidak ditemukan.", 404);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const denied = await adminOnly();
  if (denied) return denied;

  const id = Number((await params).id);
  try {
    await prisma.heroSlide.delete({ where: { id } });
    return Response.json({ message: "Slide dihapus." });
  } catch {
    return json("Slide tidak ditemukan.", 404);
  }
}
