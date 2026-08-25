const STAR_PATH =
  "M12 2.5l2.95 6.28 6.93.8-5.16 4.73 1.4 6.86L12 17.77l-6.12 3.4 1.4-6.86-5.16-4.73 6.93-.8L12 2.5z";

function Star({ fill }: { fill: number }) {
  return (
    <span className="relative inline-block h-4 w-4">
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-4 w-4 fill-ink/15">
        <path d={STAR_PATH} />
      </svg>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-gold">
          <path d={STAR_PATH} />
        </svg>
      </span>
    </span>
  );
}

export function StarRating({ rating, count }: { rating: number; count?: string }) {
  const stars = Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, rating - i)));

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} />
        ))}
      </div>
      <span className="text-sm font-medium text-ink">{rating.toLocaleString("pt-BR")}</span>
      {count && <span className="text-xs text-ink-soft">{count}</span>}
    </div>
  );
}
