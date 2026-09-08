"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

/**
 * Sobe fotos direto do navegador pro Vercel Blob (não passa pelo corpo da
 * Server Action, que tem limite de 1MB) e guarda as URLs resultantes em
 * inputs escondidos, pra ação do servidor ler como texto normal.
 */
export function ImageUploadField({
  name,
  multiple = false,
  inputClassName,
}: {
  name: string;
  multiple?: boolean;
  inputClassName: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/admin/blob-upload",
          })
        )
      );
      const newUrls = uploaded.map((u) => u.url);
      setUrls((prev) => (multiple ? [...prev, ...newUrls] : newUrls));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar foto. Tente novamente.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
        disabled={uploading}
        className={inputClassName}
      />
      {uploading && <p className="mt-1 text-xs text-ink-soft">Enviando foto…</p>}
      {error && <p className="mt-1 text-xs text-rose-deep">{error}</p>}
      {urls.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {urls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ))}
        </div>
      )}
      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}
    </div>
  );
}
