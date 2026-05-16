"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Check } from "lucide-react";
import type { Theater, Gezelschap } from "@/types";

interface Props {
  favoritesActive: boolean;
  favoritesCount: number;
  onToggleFavoritesFilter: () => void;
  theaters: Theater[];
  selectedTheaters: Set<string>;
  onToggleTheater: (id: string) => void;
  onClearTheaters: () => void;
  gezelschappen: Gezelschap[];
  selectedGezelschappen: Set<string>;
  onToggleGezelschap: (id: string) => void;
  onClearGezelschappen: () => void;
}

type Panel = "theaters" | "gezelschappen" | null;

export function FilterSidebar(props: Props) {
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // Sluit panel bij klik buiten
  useEffect(() => {
    if (!openPanel) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (sidebarRef.current?.contains(target)) return;
      setOpenPanel(null);
    };
    // delay binding zodat de open-klik 'm niet meteen sluit
    const t = setTimeout(() => document.addEventListener("click", handler), 0);
    return () => { clearTimeout(t); document.removeEventListener("click", handler); };
  }, [openPanel]);

  // Escape sluit panel
  useEffect(() => {
    if (!openPanel) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenPanel(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPanel]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 bg-white rounded-2xl border border-line p-2 shadow-sm"
      >
        {/* Favorites */}
        <button
          onClick={props.onToggleFavoritesFilter}
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
            props.favoritesActive ? "bg-[#FFE5EF]" : "hover:bg-[#F8F6EF]"
          }`}
          aria-label="Toon alleen favorieten"
          title="Favorieten"
        >
          <Heart
            size={20}
            className={
              props.favoritesActive
                ? "fill-[#FF3D8B] stroke-[#FF3D8B]"
                : "stroke-ink-soft"
            }
          />
          {props.favoritesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white border border-[#FF3D8B] px-1 text-[9px] font-bold text-[#FF3D8B]">
              {props.favoritesCount}
            </span>
          )}
        </button>

        {/* Theaters */}
        <button
          onClick={() =>
            setOpenPanel(openPanel === "theaters" ? null : "theaters")
          }
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-xl leading-none transition-colors ${
            openPanel === "theaters" || props.selectedTheaters.size > 0
              ? "bg-[#E5EBFF]"
              : "hover:bg-[#F8F6EF]"
          }`}
          aria-label="Filter op theater"
          title="Theaters"
        >
          <span aria-hidden="true">🏛️</span>
          {props.selectedTheaters.size > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#2D4DEB] px-1 text-[9px] font-bold text-white">
              {props.selectedTheaters.size}
            </span>
          )}
        </button>

        {/* Gezelschappen */}
        <button
          onClick={() =>
            setOpenPanel(openPanel === "gezelschappen" ? null : "gezelschappen")
          }
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-xl leading-none transition-colors ${
            openPanel === "gezelschappen" || props.selectedGezelschappen.size > 0
              ? "bg-[#FFE5EF]"
              : "hover:bg-[#F8F6EF]"
          }`}
          aria-label="Filter op gezelschap"
          title="Gezelschappen"
        >
          <span aria-hidden="true">👥</span>
          {props.selectedGezelschappen.size > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF3D8B] px-1 text-[9px] font-bold text-white">
              {props.selectedGezelschappen.size}
            </span>
          )}
        </button>
      </aside>

      {openPanel && (
        <div
          ref={panelRef}
          className="hidden md:flex fixed left-[5.5rem] top-1/2 -translate-y-1/2 z-40 w-72 max-h-[70vh] flex-col rounded-2xl border border-line bg-white shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
            <h3 className="text-xs font-medium uppercase tracking-widest text-ink-muted">
              {openPanel === "theaters" ? "🏛️ Theater" : "👥 Gezelschap"}
            </h3>
            {((openPanel === "theaters" && props.selectedTheaters.size > 0) ||
              (openPanel === "gezelschappen" &&
                props.selectedGezelschappen.size > 0)) && (
              <button
                onClick={
                  openPanel === "theaters"
                    ? props.onClearTheaters
                    : props.onClearGezelschappen
                }
                className="text-xs text-ink-muted hover:text-ink"
              >
                Wis
              </button>
            )}
          </div>
          <div className="overflow-y-auto p-2 flex-1">
            {(openPanel === "theaters" ? props.theaters : props.gezelschappen).map(
              (item) => {
                const isSelected =
                  openPanel === "theaters"
                    ? props.selectedTheaters.has(item.id)
                    : props.selectedGezelschappen.has(item.id);
                const onClick =
                  openPanel === "theaters"
                    ? () => props.onToggleTheater(item.id)
                    : () => props.onToggleGezelschap(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={onClick}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      isSelected
                        ? "bg-[#F1EFE8] text-ink font-medium"
                        : "text-ink-soft hover:bg-[#F8F6EF]"
                    }`}
                  >
                    <span>{item.naam}</span>
                    {isSelected && <Check size={14} className="text-ink shrink-0" />}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
}
