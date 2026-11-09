// POST /api/admin/login  -> login khusus admin
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { json, readBody } from "@/lib/http";

export async function POST(request: Request) {
  const body = await readBody<{ username: string; password: string }>(request);
  const username = body.username?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  const user = await prisma.user.findUnique({ where: { username } });
  const passwordBenar = user ? await compare(password, user.passwordHash) : false;

  if (!user || !passwordBenar) return json("Username atau password salah.", 401);
  if (user.role !== "ADMIN") return json("Akun ini bukan akun admin.", 403);

  await createSession({ userId: user.id, username: user.username, role: user.role });
  return Response.json({ role: user.role });
}
