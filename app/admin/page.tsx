import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryFields } from "@/lib/memories";
import { ABOUT } from "@/prisma/seed-data";

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/admin/login");

  const [slides, about, memories] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
    prisma.memory.findMany({ select: memoryFields, orderBy: { tanggal: "desc" } }),
  ]);

  return (
    <AdminDashboard
      username={session.username}
      initialSlides={slides}
      initialAbout={about ?? ABOUT}
      initialMemories={memories.map((item) => ({ ...item, tanggal: item.tanggal.toISOString() }))}
    />
  );
}
