// PUT /api/about -> simpan isi bagian Pengenalan (admin). Hanya ada 1 baris (id = 1).
import { prisma } from "@/lib/prisma";
import { adminOnly } from "@/lib/auth";
import { json, readBody } from "@/lib/http";
import { parseAbout } from "@/lib/validators";

export async function PUT(request: Request) {
  const denied = await adminOnly();
  if (denied) return denied;

  const data = parseAbout(await readBody(request));
  if (typeof data === "string") return json(data, 400);

  const about = await prisma.aboutContent.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return Response.json(about);
}
