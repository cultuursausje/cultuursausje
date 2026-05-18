/**
 * Cultuursausje Service Worker
 *
 * Doel: de site offline-bruikbaar maken voor mensen die 'm als app op
 * hun beginscherm hebben gezet. We gebruiken een eenvoudige
 * "network-first met cache-fallback"-strategie:
 *
 *  - Online: altijd verse data van het netwerk (zodat nieuwe shows /
 *    recensies direct zichtbaar zijn). Antwoord wordt nevenbij in de
 *    cache gezet voor offline gebruik.
 *  - Offline: val terug op de laatst opgehaalde versie uit de cache.
 *
 * Verhoog CACHE_VERSION bij een grote aanpassing zodat oude caches op
 * de telefoons van bezoekers automatisch worden opgeruimd.
 */

const CACHE_VERSION = "cultuursausje-v1";
const OFFLINE_FALLBACK = "/";

self.addEventListener("install", (event) => {
  // Nieuwe SW activeert direct (geen wachten op tabs sluiten)
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.add(OFFLINE_FALLBACK))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_VERSION)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Alleen GET-verkeer cachen, geen POST/PUT/etc.
  if (request.method !== "GET") return;

  // External hosts (foto's van theaters/festivals e.d.) overlaten aan de
  // browser-cache — die hebben al hun eigen caching-headers.
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Alleen geldige antwoorden cachen
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || caches.match(OFFLINE_FALLBACK))
      )
  );
});
