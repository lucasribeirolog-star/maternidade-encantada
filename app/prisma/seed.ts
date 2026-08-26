import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.upsert({
    where: { slug: "bonecas-reborn" },
    update: {},
    create: { name: "Bonecas Reborn", slug: "bonecas-reborn", position: 1 },
  });

  await prisma.category.upsert({
    where: { slug: "kits-e-enxoval" },
    update: {},
    create: { name: "Kits & Enxoval", slug: "kits-e-enxoval", position: 2 },
  });

  await prisma.category.upsert({
    where: { slug: "cursos" },
    update: {},
    create: { name: "Cursos", slug: "cursos", position: 3 },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@maternidadeencantada.com.br";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "trocar-esta-senha";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });

  console.log("Seed concluído (categorias + admin).");
  console.log(`Admin: ${adminEmail} / senha inicial: ${adminPassword}`);
  console.log("Produtos reais devem ser cadastrados pelo painel admin em /admin/produtos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
