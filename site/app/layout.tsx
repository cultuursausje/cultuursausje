import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Cultuursausje — Theateragenda Nederland",
  description:
    "Theateragenda van Nederland: voorstellingen, festivals, gezelschappen en theaters op één plek.",
  // PWA: vertelt iOS Safari dat dit een app-style site is
  appleWebApp: {
    capable: true,
    title: "Cultuursausje",
    statusBarStyle: "default"
  },
  // App-icon voor iOS home-screen (Apple gebruikt geen manifest) +
  // favicon voor het browser-tabblad
  icons: {
    icon: "/cultuursausje-icon.png",
    shortcut: "/cultuursausje-icon.png",
    apple: "/cultuursausje-icon.png"
  },
  // Optimalisatie voor formaat-deteccie op iOS
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  themeColor: "#1A1A18",
  width: "device-width",
  initialScale: 1,
  // PWA fullscreen-bezoekers krijgen geen plek voor pinch-zoom maar wel
  // zoom-uit (toegankelijkheid)
  maximumScale: 5
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="grain min-h-screen">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
