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
      <body className="grain min-h-screen">{children}</body>
    </html>
  );
}
