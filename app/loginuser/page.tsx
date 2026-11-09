import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import UserLoginForm from "@/components/UserLoginForm";

export default async function LoginUserPage() {
  if ((await getSession())?.role === "USER") redirect("/");
  return <UserLoginForm />;
}
