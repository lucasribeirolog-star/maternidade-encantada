import { dictionaries, type Locale } from "@/lib/i18n";

export function SecurityBadges({ locale = "pt" }: { locale?: Locale }) {
  const t = dictionaries[locale].security;

  const items = [
    {
      label: t.ssl,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6 21h12a1.5 1.5 0 001.5-1.5v-7.5A1.5 1.5 0 0018 10.5H6a1.5 1.5 0 00-1.5 1.5v7.5A1.5 1.5 0 006 21z"
        />
      ),
    },
    {
      label: t.data,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      ),
    },
    {
      label: t.handmade,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
        />
      ),
    },
    {
      label: t.support,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-xs text-ink-soft">
          <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-none stroke-rose-deep" strokeWidth="1.5">
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
