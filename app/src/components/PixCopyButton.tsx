"use client";

import { useState } from "react";
import { btnClass } from "@/lib/ui";

export function PixCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={`${btnClass("primary")} w-full`}>
      {copied ? "Código copiado!" : "Copiar código Pix"}
    </button>
  );
}
