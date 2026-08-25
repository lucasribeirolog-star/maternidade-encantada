import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = { title: "Bonecas Reborn" };

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-xl">
        <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
          Coleção
        </span>
        <h1 className="text-3xl font-semibold">Bonecas Reborn</h1>
        <p className="mt-3 text-ink-soft">
          Peças exclusivas, feitas à mão com realismo e carinho.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-ink-soft">Nenhum produto cadastrado ainda.</p>
      )}
    </div>
  );
}
