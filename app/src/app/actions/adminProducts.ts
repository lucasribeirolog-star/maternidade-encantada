"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

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

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return `/uploads/${filename}`;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = Math.round(Number(formData.get("price") ?? 0) * 100);
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const weightGrams = Number(formData.get("weightGrams") ?? 500);
  const heightCm = Number(formData.get("heightCm") ?? 20);
  const widthCm = Number(formData.get("widthCm") ?? 20);
  const lengthCm = Number(formData.get("lengthCm") ?? 20);
  const featured = formData.get("featured") === "on";
  const imageFile = formData.get("image") as File | null;

  if (!name || !description || !priceCents) {
    throw new Error("Preencha nome, descrição e preço.");
  }

  const imageUrl = imageFile ? await saveUploadedImage(imageFile) : null;

  const product = await prisma.product.create({
    data: {
      name,
      slug: `${slugify(name)}-${randomUUID().slice(0, 6)}`,
      description,
      priceCents,
      categoryId,
      weightGrams,
      heightCm,
      widthCm,
      lengthCm,
      featured,
      images: imageUrl ? { create: [{ url: imageUrl, alt: name, position: 0 }] } : undefined,
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect(`/admin/produtos/${product.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = Math.round(Number(formData.get("price") ?? 0) * 100);
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const weightGrams = Number(formData.get("weightGrams") ?? 500);
  const heightCm = Number(formData.get("heightCm") ?? 20);
  const widthCm = Number(formData.get("widthCm") ?? 20);
  const lengthCm = Number(formData.get("lengthCm") ?? 20);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  const rating = Math.max(0, Math.min(5, Number(formData.get("rating") ?? 5)));
  const reviewCount = Math.max(0, Number(formData.get("reviewCount") ?? 0));
  const tinySku = String(formData.get("tinySku") ?? "").trim() || null;
  const imageFile = formData.get("image") as File | null;

  const imageUrl = imageFile ? await saveUploadedImage(imageFile) : null;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      priceCents,
      categoryId,
      weightGrams,
      heightCm,
      widthCm,
      lengthCm,
      featured,
      active,
      rating,
      reviewCount,
      tinySku,
      ...(imageUrl
        ? { images: { create: [{ url: imageUrl, alt: name, position: 0 }] } }
        : {}),
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect("/admin/produtos");
}
