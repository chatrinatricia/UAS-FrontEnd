import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AccountSettings from "@/components/AccountSettings";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Pengaturan Akun" };

export default async function AkunPage() {
  const session = await getSession();
  if (!session) redirect("/loginuser");
  if (session.role === "ADMIN") redirect("/admin");
  return <AccountSettings username={session.username} />;
}
