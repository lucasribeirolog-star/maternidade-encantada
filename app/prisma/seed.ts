import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const bonecas = await prisma.category.upsert({
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

  const products = [
    {
      slug: "boneca-reborn-ana",
      name: "Boneca Reborn Ana",
      image: "/products/produto-1.jpg",
      priceCents: 189000,
    },
    {
      slug: "boneca-reborn-luiza",
      name: "Boneca Reborn Luiza",
      image: "/products/produto-2.jpg",
      priceCents: 219000,
    },
    {
      slug: "boneca-reborn-sofia",
      name: "Boneca Reborn Sofia",
      image: "/products/produto-3.jpg",
      priceCents: 199000,
    },
    {
      slug: "boneca-reborn-helena",
      name: "Boneca Reborn Helena",
      image: "/products/produto-4.jpg",
      priceCents: 229000,
    },
    {
      slug: "boneca-reborn-alice",
      name: "Boneca Reborn Alice",
      image: "/products/produto-5.jpg",
      priceCents: 209000,
    },
  ];

  for (const [index, p] of products.entries()) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        description:
          "Boneca reborn feita à mão com técnica de pintura em camadas e cabelo implantado fio a fio, trazendo o realismo de um bebê de verdade. Peça exclusiva e colecionável. Preço e disponibilidade sujeitos a confirmação no cadastro final do produto.",
        priceCents: p.priceCents,
        weightGrams: 1800,
        heightCm: 45,
        widthCm: 25,
        lengthCm: 15,
        featured: index < 4,
        categoryId: bonecas.id,
      },
    });

    await prisma.productImage.upsert({
      where: { id: `${product.id}-seed-img` },
      update: {},
      create: {
        id: `${product.id}-seed-img`,
        productId: product.id,
        url: p.image,
        alt: p.name,
        position: 0,
      },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@maternidadeencantada.com.br";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "trocar-esta-senha";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });

  console.log("Seed concluído.");
  console.log(`Admin: ${adminEmail} / senha inicial: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
