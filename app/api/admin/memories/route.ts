import { adminOnly } from "@/lib/auth";
import { memoryFields } from "@/lib/memories";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const denied = await adminOnly();
  if (denied) return denied;
  const memories = await prisma.memory.findMany({ select: memoryFields, orderBy: { tanggal: "desc" } });
  return Response.json(memories, { headers: { "Cache-Control": "private, no-store" } });
}
