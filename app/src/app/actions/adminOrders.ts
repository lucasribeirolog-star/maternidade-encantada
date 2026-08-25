"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";
import type { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, formData: FormData) {
  await requireAdmin();

  const status = String(formData.get("status") ?? "") as OrderStatus;
  const trackingCode = String(formData.get("trackingCode") ?? "").trim();

  await prisma.order.update({
    where: { id: orderId },
    data: { status, trackingCode: trackingCode || null },
  });

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
}
