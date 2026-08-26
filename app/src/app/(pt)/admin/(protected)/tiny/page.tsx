import { prisma } from "@/lib/prisma";
import { isTinyConfigured, listTinyVendedores, listTinyDepositos } from "@/lib/tiny";
import { updateTinySettings } from "@/app/actions/tinySettings";
import { btnClass } from "@/lib/ui";

const selectClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose";

export default async function TinySettingsPage() {
  if (!isTinyConfigured()) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold">Tiny ERP</h1>
        <p className="mt-4 text-sm text-ink-soft">
          Configure <code>TINY_CLIENT_ID</code>, <code>TINY_CLIENT_SECRET</code> e{" "}
          <code>TINY_REDIRECT_URI</code> no <code>.env</code> antes de conectar.
        </p>
      </div>
    );
  }

  const integration = await prisma.tinyIntegration.findUnique({ where: { id: "singleton" } });

  if (!integration) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold">Tiny ERP</h1>
        <p className="mt-4 text-sm text-ink-soft">Sua conta Tiny ainda não está conectada.</p>
        <a href="/api/tiny/connect" className={`${btnClass("primary")} mt-6 inline-flex`}>
          Conectar com o Tiny
        </a>
      </div>
    );
  }

  const [vendedores, depositos] = await Promise.all([listTinyVendedores(), listTinyDepositos()]);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Tiny ERP</h1>
      <p className="mt-2 text-sm text-emerald-700">Conectado com sucesso.</p>
      <p className="mt-4 text-sm text-ink-soft">
        Escolha o vendedor e o depósito que serão usados ao criar os pedidos no Tiny. Pedidos só
        são sincronizados automaticamente depois que o pagamento é aprovado, e apenas para
        produtos com o código do Tiny preenchido (na edição de cada produto).
      </p>

      <form action={updateTinySettings} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            Vendedor
          </label>
          <select name="vendedorId" defaultValue={integration.vendedorId ?? ""} className={selectClass}>
            <option value="">Selecione...</option>
            {vendedores.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            Depósito
          </label>
          <select name="depositoId" defaultValue={integration.depositoId ?? ""} className={selectClass}>
            <option value="">Selecione...</option>
            {depositos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={btnClass("primary")}>
          Salvar
        </button>
      </form>
    </div>
  );
}
