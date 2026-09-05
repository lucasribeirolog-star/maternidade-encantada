"use server";

import { randomUUID } from "crypto";
import path from "path";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";
import { getTinyStock, searchTinyProductsByCode, createTinyProduct, isTinyConfigured } from "@/lib/tiny";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Resolve o vínculo com o Tiny a partir do que o admin preencheu no formulário:
 * ou cria o produto direto no Tiny (createInTiny), ou busca pelo código/SKU
 * informado. Nunca vincula "no chute" quando o código bate com mais de um
 * produto — isso já causou pedido linkado ao item errado no passado.
 */
async function resolveTinyLink({
  createInTiny,
  tinyCodigo,
  name,
  priceCents,
}: {
  createInTiny: boolean;
  tinyCodigo: string;
  name: string;
  priceCents: number;
}): Promise<{
  tinyProductId: number | null;
  tinyCodigo: string | null;
  outOfStock: boolean | null;
  tinyError: string | null;
}> {
  if (!isTinyConfigured() || (!createInTiny && !tinyCodigo)) {
    return { tinyProductId: null, tinyCodigo: null, outOfStock: null, tinyError: null };
  }

  try {
    if (createInTiny) {
      const created = await createTinyProduct({ name, priceCents });
      return { tinyProductId: created.id, tinyCodigo: created.codigo || null, outOfStock: false, tinyError: null };
    }

    const matches = await searchTinyProductsByCode(tinyCodigo);
    if (matches.length === 0) {
      return {
        tinyProductId: null,
        tinyCodigo: null,
        outOfStock: null,
        tinyError: `Código "${tinyCodigo}" não encontrado no Tiny. Confira e tente novamente.`,
      };
    }
    if (matches.length > 1) {
      return {
        tinyProductId: null,
        tinyCodigo: null,
        outOfStock: null,
        tinyError: `Código "${tinyCodigo}" encontrado em mais de um produto no Tiny (${matches
          .map((m) => m.nome)
          .join(", ")}). Confira no Tiny e ajuste o código pra ser único, ou vincule manualmente.`,
      };
    }
    const match = matches[0];
    const saldo = await getTinyStock(match.id);
    return {
      tinyProductId: match.id,
      tinyCodigo: match.codigo,
      outOfStock: saldo !== null ? saldo <= 0 : null,
      tinyError: null,
    };
  } catch (err) {
    return {
      tinyProductId: null,
      tinyCodigo: null,
      outOfStock: null,
      tinyError: err instanceof Error ? err.message : "Erro ao vincular com o Tiny.",
    };
  }
}

async function saveUploadedImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = path.extname(file.name) || ".jpg";
  const filename = `uploads/${randomUUID()}${ext}`;
  const blob = await put(filename, file, { access: "public" });

  return blob.url;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = Math.round(Number(formData.get("price") ?? 0) * 100);
  const compareAtPriceRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const compareAtPriceCents = compareAtPriceRaw ? Math.round(Number(compareAtPriceRaw) * 100) : null;
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const weightGrams = Number(formData.get("weightGrams") ?? 500);
  const heightCm = Number(formData.get("heightCm") ?? 20);
  const widthCm = Number(formData.get("widthCm") ?? 20);
  const lengthCm = Number(formData.get("lengthCm") ?? 20);
  const featured = formData.get("featured") === "on";
  const imageFile = formData.get("image") as File | null;
  const galleryFiles = formData.getAll("images") as File[];
  const createInTiny = formData.get("createInTiny") === "on";
  const tinyCodigo = String(formData.get("tinyCodigo") ?? "").trim();

  if (!name || !description || !priceCents) {
    throw new Error("Preencha nome, descrição e preço.");
  }

  // Sobe as fotos e resolve o vinculo com o Tiny em paralelo — isso ajuda a
  // ficar dentro do tempo limite da funcao quando ha varias fotos + chamadas
  // ao Tiny (ver maxDuration no page.tsx desta rota).
  const [imageUrl, galleryUrls, tinyLink] = await Promise.all([
    imageFile ? saveUploadedImage(imageFile) : Promise.resolve(null),
    Promise.all(galleryFiles.map((file) => saveUploadedImage(file))).then((urls) =>
      urls.filter((url): url is string => Boolean(url))
    ),
    resolveTinyLink({ createInTiny, tinyCodigo, name, priceCents }),
  ]);

  const imagesToCreate = [
    ...(imageUrl ? [{ url: imageUrl, alt: name, position: 0 }] : []),
    ...galleryUrls.map((url, i) => ({ url, alt: name, position: i + 1 })),
  ];

  const product = await prisma.product.create({
    data: {
      name,
      slug: `${slugify(name)}-${randomUUID().slice(0, 6)}`,
      description,
      priceCents,
      compareAtPriceCents,
      categoryId,
      weightGrams,
      tinyProductId: tinyLink.tinyProductId,
      tinyCodigo: tinyLink.tinyCodigo,
      outOfStock: tinyLink.outOfStock ?? false,
      stockSyncedAt: tinyLink.tinyProductId ? new Date() : null,
      heightCm,
      widthCm,
      lengthCm,
      featured,
      images: imagesToCreate.length > 0 ? { create: imagesToCreate } : undefined,
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  const errorParam = tinyLink.tinyError ? `&tinyError=${encodeURIComponent(tinyLink.tinyError)}` : "";
  redirect(`/admin/produtos/${product.id}?saved=1${errorParam}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = Math.round(Number(formData.get("price") ?? 0) * 100);
  const compareAtPriceRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const compareAtPriceCents = compareAtPriceRaw ? Math.round(Number(compareAtPriceRaw) * 100) : null;
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const weightGrams = Number(formData.get("weightGrams") ?? 500);
  const heightCm = Number(formData.get("heightCm") ?? 20);
  const widthCm = Number(formData.get("widthCm") ?? 20);
  const lengthCm = Number(formData.get("lengthCm") ?? 20);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  const rating = Math.max(0, Math.min(5, Number(formData.get("rating") ?? 5)));
  const reviewCount = Math.max(0, Number(formData.get("reviewCount") ?? 0));
  const createInTiny = formData.get("createInTiny") === "on";
  const tinyCodigoInput = String(formData.get("tinyCodigo") ?? "").trim();

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { tinyCodigo: true },
  });

  let tinyUpdate: {
    tinyProductId?: number | null;
    tinyCodigo?: string | null;
    outOfStock?: boolean;
    stockSyncedAt?: Date | null;
  } = {};
  let tinyError: string | null = null;

  if (createInTiny) {
    const link = await resolveTinyLink({ createInTiny: true, tinyCodigo: "", name, priceCents });
    if (link.tinyError) tinyError = link.tinyError;
    else {
      tinyUpdate = {
        tinyProductId: link.tinyProductId,
        tinyCodigo: link.tinyCodigo,
        outOfStock: link.outOfStock ?? false,
        stockSyncedAt: new Date(),
      };
    }
  } else if (tinyCodigoInput && tinyCodigoInput !== (existing?.tinyCodigo ?? "")) {
    const link = await resolveTinyLink({ createInTiny: false, tinyCodigo: tinyCodigoInput, name, priceCents });
    if (link.tinyError) tinyError = link.tinyError;
    else {
      tinyUpdate = {
        tinyProductId: link.tinyProductId,
        tinyCodigo: link.tinyCodigo,
        outOfStock: link.outOfStock ?? false,
        stockSyncedAt: new Date(),
      };
    }
  } else if (!tinyCodigoInput && existing?.tinyCodigo) {
    tinyUpdate = { tinyProductId: null, tinyCodigo: null };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      priceCents,
      compareAtPriceCents,
      categoryId,
      weightGrams,
      heightCm,
      widthCm,
      lengthCm,
      featured,
      active,
      rating,
      reviewCount,
      ...tinyUpdate,
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  const errorParam = tinyError ? `&tinyError=${encodeURIComponent(tinyError)}` : "";
  redirect(`/admin/produtos/${productId}?saved=1${errorParam}`);
}

export async function syncProductStock(productId: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product?.tinyProductId) return;

  const saldo = await getTinyStock(product.tinyProductId);
  if (saldo === null) return;

  await prisma.product.update({
    where: { id: productId },
    data: { outOfStock: saldo <= 0, stockSyncedAt: new Date() },
  });

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");
}

/** Adiciona uma ou mais fotos à galeria de um produto já cadastrado, sem mexer no resto dos dados. */
export async function addProductImages(productId: string, formData: FormData) {
  await requireAdmin();

  const files = formData.getAll("images") as File[];
  const urls = (await Promise.all(files.map((file) => saveUploadedImage(file)))).filter(
    (url): url is string => Boolean(url)
  );
  if (urls.length === 0) return;

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { name: true } });
  const lastImage = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { position: "desc" },
  });
  const nextPosition = (lastImage?.position ?? -1) + 1;

  await prisma.productImage.createMany({
    data: urls.map((url, i) => ({
      productId,
      url,
      alt: product?.name ?? "",
      position: nextPosition + i,
    })),
  });

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");
}

/** Remove uma foto da galeria do produto (não pode ser a única foto restante). */
export async function deleteProductImage(productId: string, imageId: string) {
  await requireAdmin();

  const count = await prisma.productImage.count({ where: { productId } });
  if (count <= 1) return;

  await prisma.productImage.delete({ where: { id: imageId } });

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");
}

/** Promove uma foto da galeria a foto principal (posição 0), reordenando as demais. */
export async function setMainProductImage(productId: string, imageId: string) {
  await requireAdmin();

  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { position: "asc" },
  });
  const chosen = images.find((img) => img.id === imageId);
  if (!chosen) return;

  const rest = images.filter((img) => img.id !== imageId);
  await prisma.$transaction([
    prisma.productImage.update({ where: { id: chosen.id }, data: { position: 0 } }),
    ...rest.map((img, i) =>
      prisma.productImage.update({ where: { id: img.id }, data: { position: i + 1 } })
    ),
  ]);

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect("/admin/produtos");
}
