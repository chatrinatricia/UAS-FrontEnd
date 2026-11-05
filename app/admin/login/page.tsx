// Route "/admin/login"
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") redirect("/admin"); // sudah login -> langsung ke dashboard
  return <AdminLoginForm />;
}
