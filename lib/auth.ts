import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { json } from "@/lib/http";

const COOKIE_NAME = "kt_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari (detik)

export type Session = { userId: number; username: string; role: "USER" | "ADMIN" };

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET belum diatur (minimal 32 karakter) di file .env");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(session: Session) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      userId: Number(payload.userId),
      username: String(payload.username),
      role: payload.role === "ADMIN" ? "ADMIN" : "USER",
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function adminOnly(): Promise<Response | null> {
  const session = await getSession();
  if (!session) return json("Silakan login terlebih dahulu.", 401);
  if (session.role !== "ADMIN") return json("Hanya admin yang boleh melakukan ini.", 403);
  return null;
}
