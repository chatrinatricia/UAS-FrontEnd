import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SejarahManager from "@/components/admin/SejarahManager";

export default async function AdminSejarahPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#F5EDE1] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-[#5C3A21]">
            Kelola Sejarah Kerak Telor
          </h1>
          <a
            href="/admin"
            className="text-sm font-medium text-[#8B5A2B] hover:underline"
          >
            ← Kembali ke Dashboard
          </a>
        </div>

        {/* Panggil SejarahManager di sini agar tidak dibilang 'unused' */}
        <SejarahManager />
      </div>
    </main>
  );
}