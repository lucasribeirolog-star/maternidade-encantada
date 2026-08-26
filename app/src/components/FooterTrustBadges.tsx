const chipBase = "flex h-8 items-center justify-center rounded-md px-2.5 text-[11px] font-bold tracking-wide";

function VisaBadge() {
  return <span className={`${chipBase} bg-[#1A1F71] text-white italic`}>VISA</span>;
}

function MastercardBadge() {
  return (
    <span className={`${chipBase} bg-white gap-0`} aria-label="Mastercard">
      <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
      <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B] mix-blend-multiply" />
    </span>
  );
}

function EloBadge() {
  return (
    <span className={`${chipBase} bg-white text-ink border border-line`}>
      <span className="text-[#FFCB05]">e</span>
      <span className="text-[#00A4E0]">l</span>
      <span className="text-[#EF4123]">o</span>
    </span>
  );
}

function AmexBadge() {
  return <span className={`${chipBase} bg-[#2E77BC] text-white`}>AMEX</span>;
}

function HipercardBadge() {
  return <span className={`${chipBase} bg-[#A6192E] text-white`}>Hipercard</span>;
}

function BoletoBadge() {
  return (
    <span className={`${chipBase} gap-1.5 bg-white text-ink border border-line`}>
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
        <rect x="0" y="1" width="1.5" height="14" />
        <rect x="2.5" y="1" width="1" height="14" />
        <rect x="4.5" y="1" width="2" height="14" />
        <rect x="7.5" y="1" width="1" height="14" />
        <rect x="9.5" y="1" width="1.5" height="14" />
        <rect x="12" y="1" width="1" height="14" />
        <rect x="14" y="1" width="2" height="14" />
      </svg>
      Boleto
    </span>
  );
}

function PixBadge() {
  return (
    <span className={`${chipBase} gap-1 bg-white text-[#32BCAD] border border-line`}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M12 2.5c1.1 0 2.16.44 2.94 1.22l3.5 3.5c.3.3.3.78 0 1.08l-1.08 1.08c-.3.3-.78.3-1.08 0l-3.1-3.1a1.72 1.72 0 0 0-2.44 0l-3.13 3.13c-.3.3-.78.3-1.08 0L5.55 8.32c-.3-.3-.3-.78 0-1.08l3.5-3.5A4.14 4.14 0 0 1 12 2.5ZM4.3 9.6l1.08-1.08c.3-.3.78-.3 1.08 0l3.13 3.13c.68.68 1.77.68 2.44 0l3.1-3.1c.3-.3.78-.3 1.08 0l1.08 1.08c.3.3.3.78 0 1.08l-3.5 3.5a4.14 4.14 0 0 1-5.88 0l-3.5-3.5a.76.76 0 0 1 0-1.08Zm14.15 2.83 1.25 1.25c.3.3.3.78 0 1.08l-3.5 3.5a4.14 4.14 0 0 1-5.88 0l-3.5-3.5c-.3-.3-.3-.78 0-1.08l1.25-1.25c.3-.3.78-.3 1.08 0l3.1 3.1c.68.68 1.77.68 2.44 0l3.1-3.1c.3-.3.78-.3 1.08 0Z" />
      </svg>
      Pix
    </span>
  );
}

function CorreiosBadge() {
  return <span className={`${chipBase} bg-[#00308F] text-[#FFCC29]`}>Correios</span>;
}

function SedexBadge() {
  return <span className={`${chipBase} bg-[#003DA5] text-white`}>SEDEX</span>;
}

function PacBadge() {
  return <span className={`${chipBase} bg-white text-[#003DA5] border border-line`}>PAC</span>;
}

export function FooterTrustBadges({
  paymentLabel,
  shippingLabel,
  securityLabel,
  sslLabel,
}: {
  paymentLabel: string;
  shippingLabel: string;
  securityLabel: string;
  sslLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
      <div>
        <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">{paymentLabel}</h5>
        <div className="flex flex-wrap gap-2">
          <VisaBadge />
          <MastercardBadge />
          <EloBadge />
          <AmexBadge />
          <HipercardBadge />
          <BoletoBadge />
          <PixBadge />
        </div>
      </div>
      <div>
        <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">{shippingLabel}</h5>
        <div className="flex flex-wrap gap-2">
          <CorreiosBadge />
          <SedexBadge />
          <PacBadge />
        </div>
      </div>
      <div>
        <h5 className="text-xs tracking-wider uppercase text-cream/50 mb-4">{securityLabel}</h5>
        <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-cream/80">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-400" fill="currentColor">
            <path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Zm-1.2 13.6L7 11.8l1.4-1.4 2.4 2.4 4.8-4.8 1.4 1.4-6.2 6.2Z" />
          </svg>
          {sslLabel}
        </div>
      </div>
    </div>
  );
}
