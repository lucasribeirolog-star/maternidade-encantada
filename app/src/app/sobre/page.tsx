import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nossa história" };

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="mb-3 block text-xs tracking-[0.16em] uppercase text-rose-deep">
        Nossa história
      </span>
      <h1 className="text-3xl font-semibold md:text-4xl">
        Arte que nasce do amor pela maternidade
      </h1>
      <Image
        src="/loja-fisica.jpg"
        alt="Loja física Maternidade Encantada no Shopping Iguatemi Esplanada"
        width={900}
        height={600}
        className="my-8 w-full rounded-2xl object-cover"
      />
      <div className="space-y-5 text-ink-soft">
        <p>
          A Maternidade Encantada nasceu do sonho de transformar o amor pela maternidade em arte.
          Há 15 anos, criamos bonecas reborn feitas à mão, com técnicas de pintura em camadas,
          cabelos implantados fio a fio e detalhes que trazem o realismo de um bebê de verdade.
        </p>
        <p>
          Cada peça é única, pensada para colecionadoras e famílias apaixonadas — um processo
          artesanal que une técnica, paciência e muito carinho.
        </p>
        <p>
          Além da loja online, você pode conhecer nossas bonecas pessoalmente na loja física no
          Shopping Iguatemi Esplanada, e acompanhar novidades no Instagram
          {" "}
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
  );
}
