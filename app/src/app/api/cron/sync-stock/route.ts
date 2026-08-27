import { NextRequest, NextResponse } from "next/server";
import { syncAllProductStock } from "@/lib/tiny";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const result = await syncAllProductStock();
  return NextResponse.json({ ok: true, ...result });
}
