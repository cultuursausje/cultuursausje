/**
 * Navigatie-links bovenaan de pagina — één label per sectie, met
 * verticale streep ertussen. Klikt naar de overeenkomstige #anchor.
 */

const NAV_ITEMS = [
  { label: "Niet te missen", anchor: "recensies" },
  { label: "Voorstellingen", anchor: "voorstellingen" },
  { label: "Festivals", anchor: "festivals" },
  { label: "Plan", anchor: "plan" },
  { label: "Voordeel", anchor: "voordeel" },
  { label: "Gezelschappen", anchor: "gezelschappen" },
  { label: "Theaters", anchor: "theaters" }
];

export function SectionNav() {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold text-ink sm:text-base sm:gap-x-4">
      {NAV_ITEMS.map((item, i) => (
        <span key={item.anchor} className="flex items-center gap-x-3 sm:gap-x-4">
          {i > 0 && (
            <span className="text-ink-faint/70" aria-hidden="true">|</span>
          )}
          <a
            href={`#${item.anchor}`}
            className="hover:underline underline-offset-4 transition-colors"
          >
            {item.label}
          </a>
        </span>
      ))}
    </nav>
  );
}
