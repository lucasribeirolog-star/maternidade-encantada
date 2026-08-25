import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct, deleteProduct } from "@/app/actions/adminProducts";
import { btnClass } from "@/lib/ui";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose";

type Props = { params: Promise<{ id: string }> };

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: true } }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);
  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);
  const deleteWithId = deleteProduct.bind(null, product.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">{product.name}</h1>

      {product.images[0] && (
        <Image
          src={product.images[0].url}
          alt={product.name}
          width={160}
          height={160}
          className="mt-4 h-32 w-32 rounded-xl object-cover"
        />
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
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={(product.priceCents / 100).toFixed(2)}
            className={inputClass}
          />
          <select name="categoryId" className={inputClass} defaultValue={product.categoryId ?? ""}>
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
          <label className="mb-2 block text-xs uppercase tracking-wide text-ink-soft">
            Trocar foto principal
          </label>
          <input name="image" type="file" accept="image/*" className={inputClass} />
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
