"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/money";
import { btnClass } from "@/lib/ui";
import { lookupShipping, createOrder, type ShippingLookupResult } from "@/app/actions/checkout";
import type { ShippingOption } from "@/lib/melhorEnvio";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose";

export function CheckoutForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [shippingState, setShippingState] = useState<ShippingLookupResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [cepLookupState, setCepLookupState] = useState<"idle" | "loading" | "error">("idle");

  async function handleCepBlur(event: React.FocusEvent<HTMLInputElement>) {
    const cep = event.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setCepLookupState("loading");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepLookupState("error");
        return;
      }

      const form = formRef.current;
      if (!form) return;
      const setField = (name: string, value: string) => {
        const el = form.elements.namedItem(name) as HTMLInputElement | null;
        if (el && !el.value) el.value = value;
      };
      setField("shippingStreet", data.logradouro ?? "");
      setField("shippingNeighborhood", data.bairro ?? "");
      setField("shippingCity", data.localidade ?? "");
      setField("shippingState", data.uf ?? "");
      setCepLookupState("idle");
    } catch {
      setCepLookupState("error");
    }
  }

  function handleLookupShipping() {
    const zip = formRef.current?.elements.namedItem("shippingZip") as HTMLInputElement | null;
    setSelectedOption(null);
    setFormError(null);
    startTransition(async () => {
      const result = await lookupShipping(zip?.value ?? "");
      setShippingState(result);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!selectedOption) {
      setFormError("Escolha uma opção de frete antes de continuar.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const orderId = await createOrder({
          customerName: String(formData.get("customerName") ?? ""),
          customerEmail: String(formData.get("customerEmail") ?? ""),
          customerPhone: String(formData.get("customerPhone") ?? ""),
          customerDocument: String(formData.get("customerDocument") ?? ""),
          shippingZip: String(formData.get("shippingZip") ?? ""),
          shippingStreet: String(formData.get("shippingStreet") ?? ""),
          shippingNumber: String(formData.get("shippingNumber") ?? ""),
          shippingComplement: String(formData.get("shippingComplement") ?? ""),
          shippingNeighborhood: String(formData.get("shippingNeighborhood") ?? ""),
          shippingCity: String(formData.get("shippingCity") ?? ""),
          shippingState: String(formData.get("shippingState") ?? ""),
          shippingMethodName: `${selectedOption.company} ${selectedOption.name}`,
          shippingCostCents: selectedOption.priceCents,
        });
        router.push(`/checkout/pagamento/${orderId}`);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Erro ao criar pedido.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="font-display text-lg font-semibold">Seus dados</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="customerName" required placeholder="Nome completo" className={`${inputClass} sm:col-span-2`} />
          <input name="customerEmail" type="email" required placeholder="E-mail" className={inputClass} />
          <input name="customerPhone" required placeholder="Telefone / WhatsApp" className={inputClass} />
          <input name="customerDocument" required placeholder="CPF" className={inputClass} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold">Endereço de entrega</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <input
            name="shippingZip"
            required
            placeholder="CEP"
            inputMode="numeric"
            onBlur={handleCepBlur}
            className={inputClass}
          />
          <input name="shippingStreet" required placeholder="Rua" className={`${inputClass} sm:col-span-2`} />
          <input name="shippingNumber" required placeholder="Número" className={inputClass} />
          <input name="shippingComplement" placeholder="Complemento" className={inputClass} />
          <input name="shippingNeighborhood" required placeholder="Bairro" className={inputClass} />
          <input name="shippingCity" required placeholder="Cidade" className={inputClass} />
          <input name="shippingState" required placeholder="UF" maxLength={2} className={inputClass} />
        </div>
        {cepLookupState === "loading" && (
          <p className="mt-2 text-xs text-ink-soft">Buscando endereço pelo CEP...</p>
        )}
        {cepLookupState === "error" && (
          <p className="mt-2 text-xs text-rose-deep">
            CEP não encontrado — preencha o endereço manualmente.
          </p>
        )}
        <button
          type="button"
          disabled={isPending}
          onClick={handleLookupShipping}
          className={`${btnClass("outline")} mt-4`}
        >
          Calcular frete
        </button>

        {shippingState && !shippingState.ok && (
          <p className="mt-3 text-sm text-rose-deep">
            {shippingState.error}
            {!shippingState.configured && " Assim que a chave da Melhor Envio for configurada, essa etapa funciona automaticamente."}
          </p>
        )}

        {shippingState?.ok && (
          <div className="mt-4 space-y-2">
            {shippingState.options.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                  selectedOption?.id === option.id ? "border-rose bg-cream-2" : "border-line"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingOption"
                    checked={selectedOption?.id === option.id}
                    onChange={() => setSelectedOption(option)}
                  />
                  {option.company} — {option.name}
                  {option.deliveryDays && (
                    <span className="text-ink-soft">({option.deliveryDays} dias úteis)</span>
                  )}
                </span>
                <span className="font-medium">{formatCents(option.priceCents)}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {formError && <p className="text-sm text-rose-deep">{formError}</p>}

      <button type="submit" disabled={isPending} className={btnClass("primary")}>
        {isPending ? "Processando..." : "Ir para pagamento"}
      </button>
    </form>
  );
}
