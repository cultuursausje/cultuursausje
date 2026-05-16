const KEY = "cultuursausje:favorites";

export function loadFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set(arr);
  } catch {}
  return new Set();
}

export function saveFavorites(favs: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(Array.from(favs)));
  } catch {}
}
