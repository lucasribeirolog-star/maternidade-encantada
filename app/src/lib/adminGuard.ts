import { redirect } from "next/navigation";
import { getAdminEmail } from "./adminAuth";

export async function requireAdmin(): Promise<string> {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");
  return email;
}
