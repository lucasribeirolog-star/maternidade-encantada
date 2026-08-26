import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminEmail } from "@/lib/adminAuth";
import { exchangeTinyCode } from "@/lib/tiny";

export async function GET(req: NextRequest) {
  const email = await getAdminEmail();
  if (!email) return NextResponse.redirect(new URL("/admin/login", req.url));

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const store = await cookies();
  const expectedState = store.get("tiny_oauth_state")?.value;
  store.delete("tiny_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(
      new URL("/admin?tinyError=" + encodeURIComponent("Falha na verificação de segurança (state). Tente conectar novamente."), req.url)
    );
  }

  try {
    await exchangeTinyCode(code);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao conectar com o Tiny.";
    return NextResponse.redirect(new URL("/admin?tinyError=" + encodeURIComponent(message), req.url));
  }

  return NextResponse.redirect(new URL("/admin?tinyConnected=1", req.url));
}
