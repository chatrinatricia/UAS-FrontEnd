// POST /api/admin/logout  -> menghapus cookie sesi
import { destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();
  return Response.json({ message: "Berhasil keluar." });
}
