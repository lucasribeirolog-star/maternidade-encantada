"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function updateTinySettings(formData: FormData) {
  await requireAdmin();

  const vendedorId = Number(formData.get("vendedorId"));
  const depositoId = Number(formData.get("depositoId"));

  await prisma.tinyIntegration.update({
    where: { id: "singleton" },
    data: {
      vendedorId: Number.isFinite(vendedorId) && vendedorId > 0 ? vendedorId : null,
      depositoId: Number.isFinite(depositoId) && depositoId > 0 ? depositoId : null,
    },
  });

  revalidatePath("/admin/tiny");
  revalidatePath("/admin");
}
