import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ABOUT } from "@/prisma/seed-data";

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/admin/login");

  const [slides, about] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
  ]);

  return <AdminDashboard username={session.username} initialSlides={slides} initialAbout={about ?? ABOUT} />;
}
