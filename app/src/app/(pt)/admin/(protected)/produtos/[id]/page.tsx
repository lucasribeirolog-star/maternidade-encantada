import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct, deleteProduct, syncProductStock } from "@/app/actions/adminProducts";
import { btnClass } from "@/lib/ui";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditarProdutoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { position: "asc" } } } }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);
  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);
  const deleteWithId = deleteProduct.bind(null, product.id);
  const syncStockWithId = syncProductStock.bind(null, product.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">{product.name}</h1>

      {saved && (
        <div className="mt-4 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Alterações salvas com sucesso!
        </div>
      )}

      {product.images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {product.images.map((img) => (
            <Image
              key={img.id}
              src={img.url}
              alt={product.name}
              width={100}
              height={100}
              className="h-24 w-24 rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      <form action={updateWithId} className="mt-6 space-y-4">
        <input name="name" required defaultValue={product.name} className={inputClass} />
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product.description}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
              Preço (R$)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={(product.priceCents / 100).toFixed(2)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
              Categoria
            </label>
            <select name="categoryId" className={inputClass} defaultValue={product.categoryId ?? ""}>
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            Preço original (opcional — para promoção)
          </label>
          <input
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ex: 259.00"
            defaultValue={
              product.compareAtPriceCents ? (product.compareAtPriceCents / 100).toFixed(2) : ""
            }
            className={inputClass}
          />
          <p className="mt-1 text-xs text-ink-soft">
            Se preenchido, aparece riscado ao lado do preço atual, indicando promoção. Apague o
            valor pra tirar a promoção.
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">
            Peso e dimensões (usados no cálculo de frete)
          </p>
          <div className="grid grid-cols-4 gap-3">
            <input name="weightGrams" type="number" defaultValue={product.weightGrams} className={inputClass} />
            <input name="heightCm" type="number" defaultValue={product.heightCm} className={inputClass} />
            <input name="widthCm" type="number" defaultValue={product.widthCm} className={inputClass} />
            <input name="lengthCm" type="number" defaultValue={product.lengthCm} className={inputClass} />
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">
            Avaliação (mostrada nas estrelas do produto)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-ink-soft">Nota (0 a 5)</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                defaultValue={product.rating}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-soft">
                Número de avaliações
              </label>
              <input
                name="reviewCount"
                type="number"
                min="0"
                defaultValue={product.reviewCount}
                className={inputClass}
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Novo produto começa com 5,0 estrelas e 0 avaliações (o contador de avaliações não
            aparece até você preencher). Atualize aqui conforme forem chegando avaliações reais.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            ID do produto no Tiny (opcional)
          </label>
          <input
            name="tinyProductId"
            type="number"
            defaultValue={product.tinyProductId ?? ""}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-ink-soft">
            Se preenchido, os pedidos sincronizados com o Tiny vinculam esse item ao produto
            correspondente pelo ID único (não use o &quot;código&quot;/SKU — pode haver mais de um
            produto com o mesmo código no Tiny). Deixe em branco se ainda não sabe o ID.
          </p>
        </div>

        {product.tinyProductId && (
          <div className="rounded-xl border border-line bg-cream-2 p-4">
            <p className="text-xs uppercase tracking-wide text-ink-soft">Estoque no Tiny</p>
            <p className="mt-1 text-sm font-medium">
              {product.outOfStock ? "Esgotado" : "Disponível"}
              {product.stockSyncedAt && (
                <span className="ml-2 font-normal text-ink-soft">
                  (verificado em {product.stockSyncedAt.toLocaleString("pt-BR")})
                </span>
              )}
            </p>
            <form action={syncStockWithId} className="mt-2">
              <button type="submit" className="text-xs text-rose-deep underline">
                Verificar agora
              </button>
            </form>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-ink-soft">
            Trocar foto principal
          </label>
          <input name="image" type="file" accept="image/*" className={inputClass} />
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-ink-soft">
            Adicionar mais fotos à galeria
          </label>
          <input name="images" type="file" accept="image/*" multiple className={inputClass} />
          <p className="mt-1 text-xs text-ink-soft">
            Selecione uma ou mais fotos para adicionar à galeria do produto (não substitui as já
            existentes).
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product.featured} /> Mostrar na
          vitrine da home
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={product.active} /> Produto ativo
          (visível na loja)
        </label>

        <button type="submit" className={btnClass("primary")}>
          Salvar alterações
        </button>
      </form>

      <form action={deleteWithId} className="mt-4">
        <button type="submit" className="text-xs text-rose-deep underline">
          Excluir produto
        </button>
      </form>
    </div>
  );
}
