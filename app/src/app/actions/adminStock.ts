"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { syncAllProductStock } from "@/lib/tiny";

export async function syncStockAction() {
  await requireAdmin();

  const result = await syncAllProductStock();

  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");

  redirect(`/admin?stockSynced=1&checked=${result.checked}&outOfStock=${result.outOfStock}`);
}
