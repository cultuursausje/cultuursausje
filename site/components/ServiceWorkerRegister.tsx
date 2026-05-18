"use client";

import { useEffect } from "react";

/**
 * Registreert de service worker (public/sw.js) zodra de pagina geladen
 * is. Wordt eenmaal in de RootLayout gerenderd. In ontwikkeling slaan we
 * registratie over zodat hot-reload niet door de cache wordt verstoord.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(err => console.warn("[sw] registratie mislukt", err));
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return null;
}
