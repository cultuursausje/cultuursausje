import type { MetadataRoute } from "next";

/**
 * Web App Manifest — maakt Cultuursausje installeerbaar als PWA.
 * Wanneer een bezoeker de site op zijn telefoon bezoekt, krijgt hij de
 * optie "Toevoegen aan beginscherm" — daarna draait Cultuursausje als een
 * app: eigen icoon, fullscreen zonder browser-balk, eigen splash screen.
 *
 * Iconen: zie /public/icons/. We gebruiken voorlopig het bestaande
 * flesje-PNG; voor een nog mooier resultaat raden we square icons aan
 * (192x192 en 512x512). Die kun je later eenvoudig vervangen.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cultuursausje — Theateragenda Nederland",
    short_name: "Cultuursausje",
    description:
      "Theateragenda van Nederland: voorstellingen, festivals, gezelschappen en theaters op één plek.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAFAF7",
    theme_color: "#1A1A18",
    lang: "nl",
    categories: ["entertainment", "lifestyle", "events"],
    icons: [
      {
        src: "/cultuursausje-bottle.png",
        sizes: "any",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
