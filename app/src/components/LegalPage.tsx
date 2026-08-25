export type LegalSection = { heading: string; text: string };

export function LegalPage({
  title,
  disclaimer,
  sections,
}: {
  title: string;
  disclaimer: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-xs text-ink-soft italic">{disclaimer}</p>

      <div className="prose-sm mt-8 space-y-6 text-ink-soft">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-lg font-semibold text-ink">{section.heading}</h2>
            <p className="mt-2">{section.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
