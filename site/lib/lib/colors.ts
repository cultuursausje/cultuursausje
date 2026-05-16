export interface AccentColor {
  bg: string;     // pill achtergrond
  text: string;   // pill tekst
  name: string;
}

const ACCENTS: AccentColor[] = [
  { name: "cobalt",  bg: "#2D4DEB", text: "#FFFFFF" },
  { name: "pink",    bg: "#FF3D8B", text: "#FFFFFF" },
  { name: "mustard", bg: "#E5B53A", text: "#3D2F0A" },
  { name: "orange",  bg: "#FF6B35", text: "#FFFFFF" },
  { name: "lime",    bg: "#9BD43F", text: "#1A3D08" }
];

/**
 * Deterministisch een accentkleur kiezen op basis van het show-id,
 * zodat dezelfde voorstelling altijd dezelfde kleur krijgt.
 */
export function accentForShow(showId: string): AccentColor {
  let hash = 0;
  for (let i = 0; i < showId.length; i++) {
    hash = (hash << 5) - hash + showId.charCodeAt(i);
    hash |= 0;
  }
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}

const PHOTO_BGS = ["#1B2A4E", "#5A1F2E", "#1F3B2B", "#6B4E1A", "#2B2B28", "#3A2A1F", "#1F3B4E"];

/**
 * Donkere "poster" achtergrondkleur voor shows zonder foto.
 */
export function photoBgForShow(showId: string): string {
  let hash = 0;
  for (let i = 0; i < showId.length; i++) {
    hash = (hash << 5) - hash + showId.charCodeAt(i);
    hash |= 0;
  }
  return PHOTO_BGS[Math.abs(hash) % PHOTO_BGS.length];
}
