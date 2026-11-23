import { revalidatePath } from "next/cache";
import { adminOnly } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function youtubeId(input: string) {
  const value = input.trim();
  const valid = /^[\w-]{11}$/;
  if (valid.test(value)) return value;
  try {
    const url = new URL(value);
    let id = "";
    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    if (["www.youtube.com", "youtube.com", "m.youtube.com"].includes(url.hostname)) {
      id = url.pathname === "/watch" ? url.searchParams.get("v") ?? ""
        : url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})\/?$/)?.[1] ?? "";
    }
    return valid.test(id) ? id : null;
  } catch {
    return null;
  }
}

function validSlot(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 2147483647;
}

async function mutate(request: Request) {
  const denied = await adminOnly();
  if (denied) return denied;
  const data = await request.json().catch(() => null);
  const original = data?.original;
  if (request.method !== "POST" && !validSlot(original)) {
    return Response.json({ message: "Video tidak valid." }, { status: 400 });
  }
  try {
    if (request.method === "DELETE") {
      await prisma.tutorialVideo.delete({ where: { slot: original } });
    } else {
      const title = typeof data?.title === "string" ? data.title.trim() : "";
      const id = typeof data?.url === "string" ? youtubeId(data.url) : null;
      if (!title || title.length > 150 || !id) {
        return Response.json({ message: "Periksa judul dan tautan YouTube." }, { status: 400 });
      }
      const video = { title, youtubeId: id };
      if (request.method === "POST") await prisma.$executeRaw`INSERT INTO TutorialVideo (title, youtubeId) VALUES (${title}, ${id})`;
      else await prisma.tutorialVideo.update({ where: { slot: original }, data: video });
    }
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : null;
    if (code === "P2025") return Response.json({ message: "Video sudah dihapus. Muat ulang daftar." }, { status: 404 });
    throw error;
  }
  revalidatePath("/");
  revalidatePath("/admin");
  return Response.json(await prisma.tutorialVideo.findMany({ orderBy: { slot: "asc" } }));
}

export { mutate as POST, mutate as PUT, mutate as DELETE };