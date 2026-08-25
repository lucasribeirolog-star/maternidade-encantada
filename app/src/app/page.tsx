import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { btnClass } from "@/lib/ui";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
        <Image
          src="/products/hero-boneca.jpg"
          alt="Boneca reborn Maternidade Encantada"
          fill
          priority
          className="object-cover object-[center_30%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(63,27,39,.32) 0%, rgba(63,27,39,.58) 100%)",
          }}
        />
        <div className="relative z-10 max-w-xl px-6 text-center text-white">
          <span className="mb-4 block text-xs tracking-[0.16em] uppercase opacity-90">
            15 anos criando bebês quase reais
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold text-white">
            Bebês quase reais,
            <br />
            feitos com amor
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base opacity-90">
            Bonecas reborn pintadas e finalizadas à mão. Envio para todo o Brasil e exterior.
          </p>
          <Link href="/produtos" className={`${btnClass("primary")} mt-8`}>
            Ver coleção
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-9 px-6 py-20 md:grid-cols-4">
        {[
          { title: "Feitas à mão, com realismo", text: "Pintura em camadas e cabelo implantado fio a fio." },
          { title: "15 anos de experiência", text: "Encantando famílias colecionadoras por todo o país." },
          { title: "Envio Brasil e exterior", text: "Compra online segura, entrega onde você estiver." },
          { title: "Loja física no Iguatemi", text: "Shopping Iguatemi Esplanada, Ala Norte." },
        ].map((item) => (
          <div key={item.title} className="text-center">
            <h3 className="font-display text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-cream-2 py-20">
        <div className="mx-auto mb-11 max-w-xl px-6 text-center">
          <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
            Vitrine
          </span>
          <h2 className="text-3xl font-semibold">Bonecas em destaque</h2>
        </div>
        <FeaturedCarousel products={featured} />
        <div className="mt-10 text-center">
          <Link href="/produtos" className={btnClass("outline")}>
            Ver coleção completa
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-[0_20px_40px_-24px_rgba(62,39,35,0.35)]">
            <Image
              src="/loja-fisica.jpg"
              alt="Loja física Maternidade Encantada no Shopping Iguatemi Esplanada"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div>
            <span className="mb-3 block text-xs tracking-[0.16em] uppercase text-rose-deep">
              Nossa história
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Arte que nasce do amor pela maternidade
            </h2>
            <p className="mt-5 max-w-[46ch] text-ink-soft">
              A Maternidade Encantada nasceu do sonho de transformar o amor pela maternidade em
              arte. Há 15 anos, cada boneca reborn é criada à mão com técnicas de pintura em
              camadas, cabelos implantados fio a fio e detalhes que trazem o realismo de um bebê
              de verdade — peças únicas para colecionadoras e famílias apaixonadas.
            </p>
            <div className="mt-8 flex gap-10">
              <div>
                <b className="font-display text-3xl text-wine">15</b>
                <span className="mt-1 block text-xs text-ink-soft">anos de história</span>
              </div>
              <div>
                <b className="font-display text-3xl text-wine">46,6 mil</b>
                <span className="mt-1 block text-xs text-ink-soft">seguidores no Instagram</span>
              </div>
              <div>
                <b className="font-display text-3xl text-wine">100%</b>
                <span className="mt-1 block text-xs text-ink-soft">feitas à mão</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
