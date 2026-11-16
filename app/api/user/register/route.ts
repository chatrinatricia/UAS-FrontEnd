import { hash } from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import { json, readBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { parseCredentials } from "@/lib/validators";

export async function POST(request: Request) {
  const data = parseCredentials(await readBody(request));
  if (typeof data === "string") return json(data, 400);
  const { username, password } = data;
  if (password.length < 3) return json("Password minimal 3 karakter.", 400);
  const passwordHash = await hash(password, 12);
  try {
    await prisma.user.create({ data: { username, passwordHash, role: "USER" } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return json("Username sudah digunakan.", 409);
    }
    throw error;
  }
  return json("Akun berhasil dibuat. Silakan masuk.", 201);
}
