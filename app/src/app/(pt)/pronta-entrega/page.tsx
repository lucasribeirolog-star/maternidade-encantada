import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Bonecas Pronta Entrega",
  description:
    "Bonecas reborn já prontas, com envio imediato. Peças exclusivas da Maternidade Encantada, feitas à mão em Sorocaba.",
  alternates: { canonical: "/pronta-entrega", languages: localeAlternates("/pronta-entrega") },
};

export default async function ProntaEntregaPage() {
  const products = await prisma.product.findMany({
    where: { active: true, readyToShip: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-xl">
        <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
          Envio imediato
        </span>
        <h1 className="text-3xl font-semibold">Bonecas Pronta Entrega</h1>
        <p className="mt-3 text-ink-soft">
          Peças já prontas no ateliê, sem espera de produção — compradas hoje, enviadas hoje.
        </p>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-ink-soft">
          Nenhuma boneca pronta entrega no momento. Confira a coleção completa.
        </p>
      )}
    </div>
  );
}
