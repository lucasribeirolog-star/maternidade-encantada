import Image from "next/image";
import Link from "next/link";

function LogoImage({ size }: { size: number }) {
  return (
    <Image
      src="/logo.jpg"
      alt="Maternidade Encantada"
      width={size}
      height={size}
      priority
      className="rounded-2xl object-contain shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ size = 92, asLink = true }: { size?: number; asLink?: boolean }) {
  if (!asLink) return <LogoImage size={size} />;

  return (
    <Link href="/" className="shrink-0">
      <LogoImage size={size} />
    </Link>
  );
}
