import { compare } from "bcryptjs";
import { createSession } from "@/lib/auth";
import { json, readBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { parseCredentials } from "@/lib/validators";

export async function POST(request: Request) {
  const data = parseCredentials(await readBody(request));
  if (typeof data === "string") return json(data, 400);
  const { username, password } = data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.role !== "USER" || !(await compare(password, user.passwordHash))) {
    return json("Username atau password salah.", 401);
  }
  await createSession({ userId: user.id, username: user.username, role: user.role });
  return json("Berhasil masuk.", 200);
}
