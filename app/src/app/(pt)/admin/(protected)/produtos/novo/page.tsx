import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/actions/adminProducts";
import { btnClass } from "@/lib/ui";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose";

export default async function NovoProdutoPage() {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Novo produto</h1>

      <form action={createProduct} className="mt-6 space-y-4">
        <input name="name" required placeholder="Nome" className={inputClass} />
        <textarea
          name="description"
          required
          placeholder="Descrição"
          rows={4}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="Preço (R$)"
            className={inputClass}
          />
          <select name="categoryId" className={inputClass} defaultValue="">
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
            <input name="weightGrams" type="number" defaultValue={500} placeholder="Peso (g)" className={inputClass} />
            <input name="heightCm" type="number" defaultValue={20} placeholder="Altura (cm)" className={inputClass} />
            <input name="widthCm" type="number" defaultValue={20} placeholder="Largura (cm)" className={inputClass} />
            <input name="lengthCm" type="number" defaultValue={20} placeholder="Comp. (cm)" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-ink-soft">
            Foto principal
          </label>
          <input name="image" type="file" accept="image/*" className={inputClass} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" /> Mostrar na vitrine da home
        </label>

        <button type="submit" className={btnClass("primary")}>
          Criar produto
        </button>
      </form>
    </div>
  );
}
