import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

export default function PtLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header locale="pt" />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer locale="pt" />
      <CookieConsent locale="pt" />
    </>
  );
}
