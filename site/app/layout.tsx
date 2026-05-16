import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cultuursausje — Theateragenda Amsterdam",
  description:
    "Het complete overzicht van theatervoorstellingen in Amsterdam. Maandelijks bijgewerkt."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="grain min-h-screen">
        <div className="disco-projection" aria-hidden="true" />
        <div className="disco-ball" aria-hidden="true" />
        <div className="disco-ball-small" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
