import Image from "next/image";
import Link from "next/link";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { StoreMap } from "@/components/StoreMap";
import { Reveal } from "@/components/Reveal";
import { btnClass } from "@/lib/ui";
import { dictionaries, LOCALE_PATHS, type Locale } from "@/lib/i18n";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  images: { url: string; alt: string }[];
};

const HERO_ALT: Record<Locale, string> = {
  pt: "Boneca reborn Maternidade Encantada",
  en: "Maternidade Encantada reborn doll",
  es: "Muñeca reborn Maternidade Encantada",
};

const STORE_ALT: Record<Locale, string> = {
  pt: "Loja física da Maternidade Encantada no Shopping Iguatemi Esplanada",
  en: "Maternidade Encantada physical store at Shopping Iguatemi Esplanada",
  es: "Tienda física de Maternidade Encantada en el Shopping Iguatemi Esplanada",
};

export function HomeContent({ locale, featured }: { locale: Locale; featured: Product[] }) {
  const t = dictionaries[locale];
  const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];

  return (
    <>
      <section className="relative flex min-h-[78vh] items-center justify-center">
        <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
          <Image
            src="/products/hero-boneca.jpg"
            alt={HERO_ALT[locale]}
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
        </div>
        <div className="relative z-10 max-w-xl px-6 text-center text-white">
          <span className="mb-4 block text-xs tracking-[0.16em] uppercase opacity-90">
            {t.hero.eyebrow}
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold text-white">
            {t.hero.heading1}
            <br />
            {t.hero.heading2}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base opacity-90">{t.hero.text}</p>
          <Link href={`${base}/produtos`} className={`${btnClass("primary")} mt-8`}>
            {t.hero.cta}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-9 px-6 py-20 md:grid-cols-4">
        {[
          { title: t.whyUs.title1, text: t.whyUs.text1 },
          { title: t.whyUs.title2, text: t.whyUs.text2 },
          { title: t.whyUs.title3, text: t.whyUs.text3 },
          { title: t.whyUs.title4, text: t.whyUs.text4 },
        ].map((item, i) => (
          <Reveal key={item.title} direction="up" delay={i * 100}>
            <div className="group text-center transition-transform duration-300 hover:-translate-y-1">
              <h3 className="font-display text-base font-semibold transition-colors group-hover:text-rose-deep">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="bg-cream-2 py-20">
        <Reveal direction="left">
          <div className="mx-auto mb-11 max-w-xl px-6 text-center">
            <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
              {t.showcase.kicker}
            </span>
            <h2 className="text-3xl font-semibold">{t.showcase.title}</h2>
          </div>
        </Reveal>
        <Reveal direction="left" delay={150}>
          <FeaturedCarousel products={featured} locale={locale} />
        </Reveal>
        <Reveal direction="left" delay={250}>
          <div className="mt-10 text-center">
            <Link
              href={`${base}/produtos`}
              className={`${btnClass("outline")} transition-transform hover:-translate-y-0.5`}
            >
              {t.showcase.viewAll}
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <Reveal direction="left">
            <div className="group overflow-hidden rounded-2xl shadow-[0_20px_40px_-24px_rgba(62,39,35,0.35)]">
              <Image
                src="/loja-fisica.jpg"
                alt={STORE_ALT[locale]}
                width={800}
                height={1000}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal direction="left" delay={150}>
            <div>
              <span className="mb-3 block text-xs tracking-[0.16em] uppercase text-rose-deep">
                {t.story.kicker}
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold">{t.story.title}</h2>
              <p className="mt-5 max-w-[46ch] text-ink-soft">{t.story.text}</p>
              <div className="mt-8 flex gap-10">
                <div className="transition-transform hover:-translate-y-1">
                  <b className="font-display text-3xl text-wine">15</b>
                  <span className="mt-1 block text-xs text-ink-soft">{t.story.stat1Label}</span>
                </div>
                <div className="transition-transform hover:-translate-y-1">
                  <b className="font-display text-3xl text-wine">{t.story.stat2Value}</b>
                  <span className="mt-1 block text-xs text-ink-soft">{t.story.stat2Label}</span>
                </div>
                <div className="transition-transform hover:-translate-y-1">
                  <b className="font-display text-3xl text-wine">100%</b>
                  <span className="mt-1 block text-xs text-ink-soft">{t.story.stat3Label}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-2 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <Reveal direction="left">
              <div>
                <span className="mb-3 block text-xs tracking-[0.16em] uppercase text-rose-deep">
                  {t.artist.kicker}
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold">{t.artist.name}</h2>
                <p className="mt-2 text-sm text-ink-soft">{t.artist.role}</p>
                <p className="mt-6 max-w-[52ch] text-ink-soft">{t.artist.p1}</p>
                <p className="mt-4 max-w-[52ch] text-ink-soft">{t.artist.p2}</p>
                <blockquote className="mt-8 border-l-2 border-rose-deep/40 pl-5 font-display text-lg italic text-wine">
                  “{t.artist.quote}”
                </blockquote>
              </div>
            </Reveal>
            <Reveal direction="left" delay={150} className="md:order-last">
              <div className="group overflow-hidden rounded-2xl shadow-[0_20px_40px_-24px_rgba(62,39,35,0.35)]">
                <Image
                  src="/uploads/gabriela-salome.jpg"
                  alt={t.artist.name}
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <StoreMap locale={locale} />
    </>
  );
}
