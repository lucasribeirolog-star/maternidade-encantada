"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "left" | "right" | "up";

const OFFSET: Record<Direction, string> = {
  left: "-translate-x-12",
  right: "translate-x-12",
  up: "translate-y-10",
};

export function Reveal({
  children,
  direction = "left",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!translate-x-0 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${OFFSET[direction]}`
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
