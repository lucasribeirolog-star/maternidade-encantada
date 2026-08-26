import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/adminAuth";
import { getTinyAuthUrl, TinyNotConfiguredError } from "@/lib/tiny";

export async function GET() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");

  const state = randomBytes(16).toString("hex");
  const store = await cookies();
  store.set("tiny_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });

  let authUrl: string;
  try {
    authUrl = getTinyAuthUrl(state);
  } catch (err) {
    if (err instanceof TinyNotConfiguredError) {
      redirect("/admin?tinyError=" + encodeURIComponent(err.message));
    }
    throw err;
  }

  redirect(authUrl);
}
