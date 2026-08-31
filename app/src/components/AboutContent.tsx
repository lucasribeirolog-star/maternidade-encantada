import Image from "next/image";
import { dictionaries, type Locale } from "@/lib/i18n";
import { StoreMap } from "./StoreMap";

const STORE_ALT: Record<Locale, string> = {
  pt: "Loja física da Maternidade Encantada no Shopping Iguatemi Esplanada",
  en: "Maternidade Encantada physical store at Shopping Iguatemi Esplanada",
  es: "Tienda física de Maternidade Encantada en el Shopping Iguatemi Esplanada",
};

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
          alt={STORE_ALT[locale]}
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
