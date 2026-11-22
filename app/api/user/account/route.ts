// PATCH /api/user/account  -> pengunjung mengganti username dan/atau password
import { compare, hash, truncates } from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import { createSession, getSession } from "@/lib/auth";
import { json, readBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type AccountBody = { username: string; currentPassword: string; newPassword: string };

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "USER") return json("Silakan masuk terlebih dahulu.", 401);

  const body = await readBody<AccountBody>(request);
  const username = (typeof body.username === "string" ? body.username : "").trim().toLowerCase();
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!username || username.length > 100) return json("Username wajib diisi (maksimal 100 karakter).", 400);
  if (!currentPassword) return json("Masukkan password saat ini untuk menyimpan perubahan.", 400);
  if (newPassword && (newPassword.length < 3 || truncates(newPassword))) {
    return json("Password baru minimal 3 karakter dan maksimal 72 byte.", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !(await compare(currentPassword, user.passwordHash))) {
    return json("Password saat ini salah.", 403);
  }

  const data: { username?: string; passwordHash?: string } = {};
  if (username !== user.username) data.username = username;
  if (newPassword) data.passwordHash = await hash(newPassword, 12);
  if (Object.keys(data).length === 0) return json("Tidak ada perubahan untuk disimpan.", 400);

  try {
    const updated = await prisma.user.update({ where: { id: user.id }, data });
    // Perbarui cookie login supaya nama baru langsung dipakai
    await createSession({ userId: updated.id, username: updated.username, role: "USER" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return json("Username sudah digunakan.", 409);
    }
    throw error;
  }
  return json("Perubahan berhasil disimpan.", 200);
}
