import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { json, readBody } from "@/lib/http";
import { parseMemory } from "@/lib/validators";
import { memoryFields } from "@/lib/memories";

export async function GET() {
  const memories = await prisma.memory.findMany({
    where: { status: "approved" }, select: memoryFields, orderBy: { tanggal: "desc" },
  });
  return Response.json(memories);
}

export async function POST(request: Request) {
  const data = parseMemory(await readBody(request));
  if (typeof data === "string") return json(data, 400);

  const session = await getSession();
  const memory = await prisma.memory.create({
    data: { ...data, userId: session?.userId, status: "pending" },
    select: memoryFields,
  });
  return Response.json(memory, { status: 201 });
}
