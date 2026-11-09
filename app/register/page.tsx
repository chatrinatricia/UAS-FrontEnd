import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import UserRegisterForm from "@/components/UserRegisterForm";

export default async function RegisterPage() {
  if ((await getSession())?.role === "USER") redirect("/");
  return <UserRegisterForm />;
}
