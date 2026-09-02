import { dictionaries, type Locale } from "@/lib/i18n";
import { btnClass } from "@/lib/ui";
import { Logo } from "./Logo";
import { StarRating } from "./StarRating";
import { Reveal } from "./Reveal";

const GOOGLE_RATING = 4.8;
const GOOGLE_REVIEW_COUNT = 18;

const MAPS_QUERY = "Maternidade Encantada - Shopping Iguatemi Esplanada, Sorocaba - SP";
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY
)}&ll=-23.5336612,-47.4634434&z=16&output=embed`;
const MAPS_DIRECTIONS_URL = "https://maps.app.goo.gl/GGfbzTLz1E1xHJAo9";
const WHATSAPP_URL = "https://wa.me/5511991352246";
const WHATSAPP_DISPLAY = "+55 (11) 99135-2246";

export function StoreMap({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].location;

  return (
    <section className="bg-cream-2 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal direction="left">
          <div className="mb-11 max-w-xl">
            <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
              {t.kicker}
            </span>
            <h2 className="text-3xl font-semibold">{t.title}</h2>
            <p className="mt-3 text-ink-soft">{t.text}</p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal direction="left" delay={150}>
            <div className="overflow-hidden rounded-2xl shadow-[0_20px_40px_-24px_rgba(62,39,35,0.35)]">
              <iframe
                src={MAPS_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 340 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Maternidade Encantada — Shopping Iguatemi Esplanada, Sorocaba"
              />
            </div>
          </Reveal>

          <Reveal direction="left" delay={280}>
            <div className="flex flex-col justify-center rounded-2xl bg-white p-8 shadow-[0_20px_40px_-28px_rgba(62,39,35,0.35)] transition-shadow duration-300 hover:shadow-[0_28px_48px_-24px_rgba(62,39,35,0.45)]">
              <div className="flex items-center gap-4">
                <Logo size={64} asLink={false} />
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    Maternidade Encantada
                    <br />
                    Shopping Iguatemi Esplanada
                  </h3>
                  <div className="mt-2">
                    <StarRating
                      rating={GOOGLE_RATING}
                      count={`(${GOOGLE_REVIEW_COUNT}) ${t.reviews}`}
                    />
                  </div>
                </div>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink-soft">
                    {t.addressLabel}
                  </dt>
                  <dd className="mt-1 text-ink">
                    Av. Professora Izoraida Marques Peres, 401
                    <br />
                    Shopping Iguatemi Esplanada
                    <br />
                    Parque Campolim, Sorocaba - SP, 18048-110
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-ink-soft">
                    {t.phoneLabel}
                  </dt>
                  <dd className="mt-1 text-ink">{WHATSAPP_DISPLAY}</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnClass("primary")} transition-transform hover:-translate-y-0.5`}
                >
                  {t.directions}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnClass("outline")} transition-transform hover:-translate-y-0.5`}
                >
                  {t.call}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
