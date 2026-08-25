import { prisma } from "@/lib/prisma";
import { HomeContent } from "@/components/HomeContent";

export default async function HomePageEs() {
  const featured = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return <HomeContent locale="es" featured={featured} />;
}
