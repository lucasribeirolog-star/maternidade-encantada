"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession, clearAdminSession } from "@/lib/adminAuth";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const INVALID_CREDENTIALS_ERROR = "E-mail ou senha inválidos.";

export async function adminLogin(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return { error: INVALID_CREDENTIALS_ERROR };
  }

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    const minutes = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000);
    return {
      error: `Muitas tentativas de login. Tente novamente em ${minutes} minuto${minutes > 1 ? "s" : ""}.`,
    };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    const failedAttempts = admin.failedAttempts + 1;
    const lockingOut = failedAttempts >= MAX_FAILED_ATTEMPTS;
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: lockingOut
        ? { failedAttempts: 0, lockedUntil: new Date(Date.now() + LOCKOUT_MS) }
        : { failedAttempts },
    });
    return { error: INVALID_CREDENTIALS_ERROR };
  }

  if (admin.failedAttempts > 0 || admin.lockedUntil) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });
  }

  await createAdminSession(admin.email);
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminSession();
  redirect("/admin/login");
}
