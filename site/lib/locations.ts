/**
 * Cultuursausje richt zich op het Nederlandse theaterlandschap. Steden in
 * België (en eventueel andere landen) worden uit de stad-dropdowns en de
 * Theaters-sectie gefilterd.
 *
 * Buitenlandse theaters mogen wel in de data blijven omdat ze relevant
 * kunnen zijn als context bij gezelschappen of festivals — ze verschijnen
 * alleen niet als selecteerbare stad in de UI.
 */
const BELGIAN_CITIES = new Set<string>([
  "Antwerpen",
  "Brussel",
  "Brussels",
  "Gent",
  "Brugge",
  "Leuven",
  "Mechelen",
  "Hasselt",
  "Charleroi",
  "Luik",
  "Liège",
  "Oostende",
  "Kortrijk"
]);

export function isBelgianCity(stad: string): boolean {
  return BELGIAN_CITIES.has(stad.trim());
}

export function isNotBelgianCity(stad: string): boolean {
  return !isBelgianCity(stad);
}
