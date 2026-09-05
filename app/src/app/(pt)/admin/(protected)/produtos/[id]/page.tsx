import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  updateProduct,
  deleteProduct,
  syncProductStock,
  addProductImages,
  deleteProductImage,
  setMainProductImage,
} from "@/app/actions/adminProducts";
import { btnClass } from "@/lib/ui";
import { isTinyConfigured } from "@/lib/tiny";

// Salvar/editar um produto pode envolver várias chamadas em sequência (subir
// fotos, buscar/criar no Tiny, checar estoque) — o limite padrão da Vercel é
// curto demais pra isso, mesmo quando tudo é salvo com sucesso no banco.
export const maxDuration = 60;

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; tinyError?: string }>;
};

export default async function EditarProdutoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved, tinyError } = await searchParams;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { position: "asc" } } } }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);
  if (!product) notFound();
  const tinyOk = isTinyConfigured();

  const updateWithId = updateProduct.bind(null, product.id);
  const deleteWithId = deleteProduct.bind(null, product.id);
  const syncStockWithId = syncProductStock.bind(null, product.id);
  const addImagesWithId = addProductImages.bind(null, product.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">{product.name}</h1>

      {saved && (
        <div className="mt-4 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Alterações salvas com sucesso!
        </div>
      )}

      {tinyError && (
        <div className="mt-4 rounded-xl border border-rose-deep bg-rose/10 px-4 py-3 text-sm text-rose-deep">
          {tinyError}
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">Fotos</p>
        {product.images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {product.images.map((img, i) => (
              <div key={img.id} className="relative">
                <Image
                  src={img.url}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="h-24 w-24 rounded-xl object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded-full bg-wine px-2 py-0.5 text-[10px] font-medium text-white">
                    Capa
                  </span>
                )}
                <div className="mt-1 flex justify-center gap-2 text-[11px]">
                  {i !== 0 && (
                    <form action={setMainProductImage.bind(null, product.id, img.id)}>
                      <button type="submit" className="text-rose-deep underline">
                        Tornar capa
                      </button>
                    </form>
                  )}
                  {product.images.length > 1 && (
                    <form action={deleteProductImage.bind(null, product.id, img.id)}>
                      <button type="submit" className="text-ink-soft underline hover:text-rose-deep">
                        Excluir
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <form action={addImagesWithId} className="mt-3 flex flex-wrap items-center gap-3">
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            required
            className="text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-cream-2 file:px-4 file:py-2 file:text-sm file:text-ink"
          />
          <button type="submit" className={btnClass("outline")}>
            Adicionar fotos
          </button>
        </form>
      </div>

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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

        {tinyOk && (
          <div className="rounded-xl border border-line bg-cream-2 p-4">
            <p className="text-xs uppercase tracking-wide text-ink-soft">Vínculo com o Tiny</p>

            {product.tinyProductId ? (
              <>
                <p className="mt-2 text-sm font-medium">
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
              </>
            ) : (
              <p className="mt-1 text-xs text-ink-soft">Ainda não vinculado a nenhum produto no Tiny.</p>
            )}

            <label className="mt-1 mb-1 block text-xs uppercase tracking-wide text-ink-soft">
              Código (SKU) no Tiny
            </label>
            <input
              name="tinyCodigo"
              placeholder="Ex: 813"
              defaultValue={product.tinyCodigo ?? ""}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-ink-soft">
              Cole o código do produto no Tiny e salve — o site busca e vincula sozinho. Trocar o
              código refaz o vínculo; apagar o campo desvincula. Se o código existir em mais de um
              produto no Tiny, o vínculo não é feito automaticamente (evita linkar no produto
              errado) e você verá um aviso pedindo pra conferir.
            </p>

            {!product.tinyProductId && (
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" name="createInTiny" />
                Criar este produto agora no Tiny (em vez de vincular a um já existente)
              </label>
            )}
          </div>
        )}

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
