import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Bonecas para Encomenda",
  description:
    "Bonecas reborn feitas sob encomenda, com fabricação de 15 a 30 dias. Peças exclusivas da Maternidade Encantada, feitas à mão em Sorocaba.",
  alternates: { canonical: "/encomenda", languages: localeAlternates("/encomenda") },
};

export default async function EncomendaPage() {
  const products = await prisma.product.findMany({
    where: { active: true, madeToOrder: true, outOfStock: false },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-xl">
        <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
          Feito sob encomenda
        </span>
        <h1 className="text-3xl font-semibold">Bonecas para Encomenda</h1>
        <p className="mt-3 text-ink-soft">
          Peças exclusivas, feitas à mão especialmente pra você — com prazo de fabricação de 15 a
          30 dias antes do envio.
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
          Nenhuma boneca para encomenda no momento. Confira a coleção completa.
        </p>
      )}
    </div>
  );
}
