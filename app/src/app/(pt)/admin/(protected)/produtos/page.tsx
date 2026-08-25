import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { btnClass } from "@/lib/ui";

export default async function AdminProdutosPage() {
  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <Link href="/admin/produtos/novo" className={btnClass("primary")}>
          + Novo produto
        </Link>
      </div>

      <div className="mt-6 divide-y divide-line rounded-xl border border-line">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/produtos/${product.id}`}
            className="flex items-center gap-4 p-4 hover:bg-cream-2"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-2">
              {product.images[0] && (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-ink-soft">{formatCents(product.priceCents)}</p>
            </div>
            {!product.active && (
              <span className="rounded-full bg-cream-2 px-3 py-1 text-xs text-ink-soft">
                Inativo
              </span>
            )}
          </Link>
        ))}
        {products.length === 0 && (
          <p className="p-6 text-sm text-ink-soft">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
