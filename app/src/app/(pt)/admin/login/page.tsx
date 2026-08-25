"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/actions/adminAuth";
import { btnClass } from "@/lib/ui";
import { Logo } from "@/components/Logo";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLogin, undefined);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo size={110} />
        <p className="mt-3 text-sm text-ink-soft">Painel administrativo</p>
      </div>

      <form action={formAction} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Senha"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose"
        />
        {state?.error && <p className="text-sm text-rose-deep">{state.error}</p>}
        <button type="submit" disabled={isPending} className={`${btnClass("primary")} w-full`}>
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
