import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/adminAuth";

/**
 * Autoriza uploads de foto direto do navegador pro Vercel Blob (sem passar
 * pelo corpo da Server Action, que tem limite de 1MB e não comporta fotos
 * de verdade tiradas de celular/câmera).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const email = await getAdminEmail();
  if (!email) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        addRandomSuffix: true,
        maximumSizeInBytes: 20 * 1024 * 1024,
      }),
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao autorizar upload." },
      { status: 400 }
    );
  }
}
