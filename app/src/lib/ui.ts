export function btnClass(variant: "primary" | "outline" | "outline-light" = "primary") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors";
  if (variant === "primary") {
    return `${base} bg-rose text-white hover:bg-rose-deep`;
  }
  if (variant === "outline-light") {
    return `${base} border border-white/60 text-white hover:bg-white/10`;
  }
  return `${base} border border-line text-wine hover:bg-cream-2`;
}
