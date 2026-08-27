"use server";

import { randomUUID } from "crypto";
import path from "path";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";
import { getTinyStock } from "@/lib/tiny";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

  if (!name || !description || !priceCents) {
    throw new Error("Preencha nome, descrição e preço.");
  }

  const imageUrl = imageFile ? await saveUploadedImage(imageFile) : null;
  const galleryUrls = (
    await Promise.all(galleryFiles.map((file) => saveUploadedImage(file)))
  ).filter((url): url is string => Boolean(url));

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
      heightCm,
      widthCm,
      lengthCm,
      featured,
      images: imagesToCreate.length > 0 ? { create: imagesToCreate } : undefined,
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect(`/admin/produtos/${product.id}?saved=1`);
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
  const tinyProductIdRaw = String(formData.get("tinyProductId") ?? "").trim();
  const tinyProductId = tinyProductIdRaw ? Number(tinyProductIdRaw) : null;
  const imageFile = formData.get("image") as File | null;
  const galleryFiles = formData.getAll("images") as File[];

  const imageUrl = imageFile ? await saveUploadedImage(imageFile) : null;
  const galleryUrls = (
    await Promise.all(galleryFiles.map((file) => saveUploadedImage(file)))
  ).filter((url): url is string => Boolean(url));

  let nextPosition = 0;
  if (galleryUrls.length > 0) {
    const lastImage = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { position: "desc" },
    });
    nextPosition = (lastImage?.position ?? -1) + 1;
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
      tinyProductId: tinyProductId && Number.isFinite(tinyProductId) ? tinyProductId : null,
      ...((imageUrl || galleryUrls.length > 0) && {
        images: {
          create: [
            ...(imageUrl ? [{ url: imageUrl, alt: name, position: 0 }] : []),
            ...galleryUrls.map((url, i) => ({ url, alt: name, position: nextPosition + i })),
          ],
        },
      }),
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  redirect(`/admin/produtos/${productId}?saved=1`);
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

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect("/admin/produtos");
}
