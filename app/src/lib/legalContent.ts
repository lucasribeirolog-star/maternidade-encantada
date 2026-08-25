import type { Locale } from "./i18n";
import type { LegalSection } from "@/components/LegalPage";

type LegalPageContent = { title: string; disclaimer: string; sections: LegalSection[] };
type LegalContent = { privacy: LegalPageContent; terms: LegalPageContent; returns: LegalPageContent };

export const legalContent: Record<Locale, LegalContent> = {
  pt: {
    privacy: {
      title: "Política de Privacidade",
      disclaimer: "Texto-modelo — revise com um advogado antes de publicar a loja.",
      sections: [
        {
          heading: "1. Dados que coletamos",
          text: "Ao fazer uma compra, coletamos nome, e-mail, telefone, CPF e endereço de entrega, necessários para processar seu pedido, calcular o frete e emitir a nota fiscal.",
        },
        {
          heading: "2. Como usamos seus dados",
          text: "Usamos seus dados exclusivamente para processar pedidos, calcular frete (via Melhor Envio), processar pagamentos (via Mercado Pago) e para comunicação sobre o status da sua compra. Não vendemos seus dados a terceiros.",
        },
        {
          heading: "3. Compartilhamento com terceiros",
          text: "Compartilhamos apenas os dados estritamente necessários com nossos parceiros de pagamento (Mercado Pago) e logística (Melhor Envio), para viabilizar sua compra e entrega.",
        },
        {
          heading: "4. Seus direitos (LGPD)",
          text: "Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais a qualquer momento, entrando em contato pelos canais informados no rodapé do site.",
        },
        {
          heading: "5. Cookies",
          text: "Usamos um cookie técnico essencial para manter os itens do seu carrinho entre páginas. Ele não é usado para rastreamento ou publicidade.",
        },
      ],
    },
    terms: {
      title: "Termos de Uso",
      disclaimer: "Texto-modelo — revise com um advogado antes de publicar a loja.",
      sections: [
        {
          heading: "1. Sobre a loja",
          text: "Este site é operado pela Maternidade Encantada, especializada na venda de bonecas reborn artesanais.",
        },
        {
          heading: "2. Pedidos e pagamento",
          text: "Os pedidos são confirmados após a aprovação do pagamento, processado com segurança pelo Mercado Pago. Aceitamos cartão de crédito, Pix e boleto.",
        },
        {
          heading: "3. Frete e prazos",
          text: "O valor e o prazo de entrega são calculados no checkout de acordo com o seu CEP, através da Melhor Envio. Prazos são estimativas da transportadora.",
        },
        {
          heading: "4. Peças artesanais",
          text: "Cada boneca reborn é feita à mão — pequenas variações entre a foto e a peça final fazem parte da natureza artesanal do produto.",
        },
      ],
    },
    returns: {
      title: "Trocas e Devoluções",
      disclaimer: "Texto-modelo — revise com um advogado antes de publicar a loja.",
      sections: [
        {
          heading: "Direito de arrependimento (7 dias)",
          text: "Conforme o Código de Defesa do Consumidor (art. 49), você pode desistir da compra em até 7 dias corridos após o recebimento do produto, sem precisar justificar o motivo. O valor pago é reembolsado integralmente, incluindo o frete.",
        },
        {
          heading: "Produto com defeito",
          text: "Se sua boneca reborn chegar com algum defeito de fabricação, entre em contato pelos canais informados no rodapé em até 7 dias após o recebimento, com fotos do problema, para avaliarmos troca ou reembolso.",
        },
        {
          heading: "Como solicitar",
          text: "Envie um e-mail com o número do pedido explicando o motivo da troca/devolução. Vamos te orientar sobre o envio de volta e o reembolso.",
        },
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      disclaimer: "Template text — have a lawyer review this before launching the store.",
      sections: [
        {
          heading: "1. Data we collect",
          text: "When you place an order, we collect your name, email, phone number, tax ID (CPF), and delivery address, needed to process your order, calculate shipping, and issue the invoice.",
        },
        {
          heading: "2. How we use your data",
          text: "We use your data solely to process orders, calculate shipping (via Melhor Envio), process payments (via Mercado Pago), and to communicate about your order status. We do not sell your data to third parties.",
        },
        {
          heading: "3. Sharing with third parties",
          text: "We share only the data strictly necessary with our payment (Mercado Pago) and shipping (Melhor Envio) partners, to enable your purchase and delivery.",
        },
        {
          heading: "4. Your rights",
          text: "You may request access to, correction of, or deletion of your personal data at any time, by contacting us through the channels listed in the footer.",
        },
        {
          heading: "5. Cookies",
          text: "We use one essential technical cookie to keep the items in your cart across pages. It is not used for tracking or advertising.",
        },
      ],
    },
    terms: {
      title: "Terms of Use",
      disclaimer: "Template text — have a lawyer review this before launching the store.",
      sections: [
        {
          heading: "1. About the store",
          text: "This website is operated by Maternidade Encantada, specialized in handmade reborn dolls.",
        },
        {
          heading: "2. Orders and payment",
          text: "Orders are confirmed after payment approval, processed securely through Mercado Pago. We accept credit card, Pix, and boleto.",
        },
        {
          heading: "3. Shipping and delivery times",
          text: "The shipping cost and delivery estimate are calculated at checkout based on your postal code, via Melhor Envio. Delivery times are estimates provided by the carrier.",
        },
        {
          heading: "4. Handmade pieces",
          text: "Each reborn doll is handmade — small variations between the photo and the final piece are part of the handmade nature of the product.",
        },
      ],
    },
    returns: {
      title: "Returns & Exchanges",
      disclaimer: "Template text — have a lawyer review this before launching the store.",
      sections: [
        {
          heading: "Right of withdrawal (7 days)",
          text: "Under Brazilian consumer protection law (CDC, art. 49), you may cancel your purchase within 7 calendar days of receiving the product, with no need to state a reason. The amount paid is refunded in full, including shipping.",
        },
        {
          heading: "Defective product",
          text: "If your reborn doll arrives with a manufacturing defect, contact us through the channels listed in the footer within 7 days of receiving it, with photos of the issue, so we can arrange an exchange or refund.",
        },
        {
          heading: "How to request one",
          text: "Send us an email with your order number explaining the reason for the exchange/return. We'll guide you through sending the item back and the refund.",
        },
      ],
    },
  },
  es: {
    privacy: {
      title: "Política de Privacidad",
      disclaimer: "Texto de plantilla — revísalo con un abogado antes de publicar la tienda.",
      sections: [
        {
          heading: "1. Datos que recopilamos",
          text: "Al realizar una compra, recopilamos nombre, correo electrónico, teléfono, identificación fiscal (CPF) y dirección de entrega, necesarios para procesar tu pedido, calcular el envío y emitir la factura.",
        },
        {
          heading: "2. Cómo usamos tus datos",
          text: "Usamos tus datos exclusivamente para procesar pedidos, calcular el envío (vía Melhor Envio), procesar pagos (vía Mercado Pago) y comunicarnos sobre el estado de tu compra. No vendemos tus datos a terceros.",
        },
        {
          heading: "3. Compartir con terceros",
          text: "Compartimos solo los datos estrictamente necesarios con nuestros socios de pago (Mercado Pago) y logística (Melhor Envio), para hacer posible tu compra y entrega.",
        },
        {
          heading: "4. Tus derechos",
          text: "Puedes solicitar acceso, corrección o eliminación de tus datos personales en cualquier momento, contactándonos por los canales indicados en el pie de página.",
        },
        {
          heading: "5. Cookies",
          text: "Usamos una cookie técnica esencial para mantener los artículos de tu carrito entre páginas. No se usa para rastreo ni publicidad.",
        },
      ],
    },
    terms: {
      title: "Términos de Uso",
      disclaimer: "Texto de plantilla — revísalo con un abogado antes de publicar la tienda.",
      sections: [
        {
          heading: "1. Sobre la tienda",
          text: "Este sitio es operado por Maternidade Encantada, especializada en la venta de muñecas reborn artesanales.",
        },
        {
          heading: "2. Pedidos y pago",
          text: "Los pedidos se confirman tras la aprobación del pago, procesado de forma segura por Mercado Pago. Aceptamos tarjeta de crédito, Pix y boleto.",
        },
        {
          heading: "3. Envío y plazos",
          text: "El costo y el plazo de entrega se calculan en el checkout según tu código postal, a través de Melhor Envio. Los plazos son estimaciones de la transportadora.",
        },
        {
          heading: "4. Piezas artesanales",
          text: "Cada muñeca reborn está hecha a mano — pequeñas variaciones entre la foto y la pieza final forman parte de la naturaleza artesanal del producto.",
        },
      ],
    },
    returns: {
      title: "Cambios y Devoluciones",
      disclaimer: "Texto de plantilla — revísalo con un abogado antes de publicar la tienda.",
      sections: [
        {
          heading: "Derecho de arrepentimiento (7 días)",
          text: "De acuerdo con el Código de Defensa del Consumidor de Brasil (art. 49), puedes desistir de la compra dentro de los 7 días corridos posteriores a la recepción del producto, sin necesidad de justificar el motivo. El valor pagado se reembolsa íntegramente, incluido el envío.",
        },
        {
          heading: "Producto con defecto",
          text: "Si tu muñeca reborn llega con algún defecto de fabricación, contáctanos por los canales indicados en el pie de página dentro de los 7 días posteriores a la recepción, con fotos del problema, para evaluar el cambio o reembolso.",
        },
        {
          heading: "Cómo solicitarlo",
          text: "Envíanos un correo con el número de pedido explicando el motivo del cambio/devolución. Te orientaremos sobre el envío de vuelta y el reembolso.",
        },
      ],
    },
  },
};
