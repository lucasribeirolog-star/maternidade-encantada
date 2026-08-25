import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
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
            <p className="mt-4 text-sm text-cream/70 max-w-[32ch]">
              Bonecas reborn feitas à mão, com realismo e carinho.
            </p>
          </div>
          <div>
            <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">Loja</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/produtos" className="hover:text-white">Bonecas</Link></li>
              <li><Link href="/carrinho" className="hover:text-white">Carrinho</Link></li>
              <li><Link href="/sobre" className="hover:text-white">Nossa história</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">Atendimento</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/trocas-e-devolucoes" className="hover:text-white">Trocas e devoluções</Link></li>
              <li><Link href="/politica-de-privacidade" className="hover:text-white">Política de privacidade</Link></li>
              <li><Link href="/termos-de-uso" className="hover:text-white">Termos de uso</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">Visite</h5>
            <ul className="space-y-2 text-sm">
              <li>Shopping Iguatemi Esplanada</li>
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
          © {new Date().getFullYear()} Maternidade Encantada. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
