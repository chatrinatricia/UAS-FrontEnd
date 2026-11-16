import { adminOnly } from "@/lib/auth";
import { json, readBody } from "@/lib/http";
import { parseMemory } from "@/lib/validators";
import { memoryFields } from "@/lib/memories";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const denied = await adminOnly();
  if (denied) return denied;
  const body = await readBody<{ status: unknown; nama: unknown; rating: unknown; cerita: unknown }>(request);
  const status = body?.status;
  if (status !== undefined && status !== "approved" && status !== "rejected" && status !== "pending") {
    return json("Status ulasan tidak valid.", 400);
  }

  const data = status === undefined ? parseMemory(body) : { status };
  if (typeof data === "string") return json(data, 400);
  const { id } = await params;
  try {
    const updated = await prisma.memory.update({ where: { id }, data, select: memoryFields });
    return Response.json({ ...updated, message: "Ulasan diperbarui." });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return json("Ulasan tidak ditemukan.", 404);
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const denied = await adminOnly();
  if (denied) return denied;
  const { id } = await params;
  const result = await prisma.memory.deleteMany({ where: { id } });
  return result.count ? json("Ulasan dihapus.", 200) : json("Ulasan tidak ditemukan.", 404);
}
