"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type GalleryImage = { url: string; alt: string };

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [selected, setSelected] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const active = images[selected] ?? images[0];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }

  if (!active) {
    return <div className="aspect-square rounded-2xl bg-cream-2" />;
  }

  return (
    <div>
      <div
        ref={containerRef}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-cream-2 shadow-[0_20px_40px_-28px_rgba(62,39,35,0.35)]"
      >
        <Image
          src={active.url}
          alt={active.alt || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {zooming && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url(${active.url})`,
              backgroundSize: "220%",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Foto ${i + 1} de ${images.length}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === selected ? "border-rose" : "border-transparent"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
