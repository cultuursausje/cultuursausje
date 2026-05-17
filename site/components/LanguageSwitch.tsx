"use client";

import { useLang } from "@/lib/i18n";

export function LanguageSwitch() {
  const { lang, setLang } = useLang();

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white p-0.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => setLang("nl")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "nl" ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
        }`}
        aria-pressed={lang === "nl"}
      >
        NL
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "en" ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
