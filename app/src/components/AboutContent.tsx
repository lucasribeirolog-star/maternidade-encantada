import Image from "next/image";
import { dictionaries, type Locale } from "@/lib/i18n";
import { StoreMap } from "./StoreMap";

export function AboutContent({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].aboutPage;

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <span className="mb-3 block text-xs tracking-[0.16em] uppercase text-rose-deep">
          {t.kicker}
        </span>
        <h1 className="text-3xl font-semibold md:text-4xl">{t.title}</h1>
        <Image
          src="/loja-fisica.jpg"
          alt="Maternidade Encantada physical store at Shopping Iguatemi Esplanada"
          width={900}
          height={600}
          className="my-8 w-full rounded-2xl object-cover"
        />
        <div className="space-y-5 text-ink-soft">
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>
            {t.p3}{" "}
            <a
              href="https://www.instagram.com/maternidadeencantadaoficial/"
              className="text-rose-deep underline"
            >
              @maternidadeencantadaoficial
            </a>
            .
          </p>
        </div>
      </div>
      <StoreMap locale={locale} />
    </>
  );
}
