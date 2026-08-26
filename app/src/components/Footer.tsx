import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Logo";
import { dictionaries, LOCALE_PATHS, type Locale } from "@/lib/i18n";

export function Footer({ locale = "pt" }: { locale?: Locale }) {
  const t = dictionaries[locale];
  const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];

  return (
    <footer className="relative mt-24 overflow-hidden text-cream/90">
      <Image
        src="/footer-bg.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(63,27,39,.88) 0%, rgba(63,27,39,.94) 100%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/10 pt-10">
          <div className="col-span-2 md:col-span-1">
            <Logo size={72} />
            <p className="mt-4 text-sm text-cream/70 max-w-[32ch]">{t.footer.tagline}</p>
          </div>
          <div>
            <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">{t.footer.shop}</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href={`${base}/produtos`} className="hover:text-white">{t.footer.products}</Link></li>
              <li><Link href="/carrinho" className="hover:text-white">{t.footer.cart}</Link></li>
              <li><Link href={`${base}/lista-de-desejos`} className="hover:text-white">{t.wishlist.navLabel}</Link></li>
              <li><Link href={`${base}/sobre`} className="hover:text-white">{t.footer.story}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">{t.footer.support}</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href={`${base}/trocas-e-devolucoes`} className="hover:text-white">{t.footer.returns}</Link></li>
              <li><Link href={`${base}/politica-de-privacidade`} className="hover:text-white">{t.footer.privacy}</Link></li>
              <li><Link href={`${base}/termos-de-uso`} className="hover:text-white">{t.footer.terms}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">{t.footer.visit}</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://maps.app.goo.gl/GGfbzTLz1E1xHJAo9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {t.footer.store}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/maternidadeencantadaoficial/"
                  className="hover:text-white"
                >
                  @maternidadeencantadaoficial
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-cream/40">
          © {new Date().getFullYear()} Maternidade Encantada. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
