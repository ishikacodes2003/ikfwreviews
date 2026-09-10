"use client";

import { CalendarDays, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import type { Season } from "@/lib/reviews/types";

interface SeasonSectionProps {
  selectedSeason?: string;
  onSelectSeason?: (season: string) => void;
  seasons?: Season[];
}

export function SeasonSection({
  selectedSeason = "All Seasons",
  onSelectSeason,
  seasons,
}: SeasonSectionProps) {
  const [open, setOpen] = useState(false);

  // If no seasons passed, generate fallback list 13 to 1
  const displaySeasons: Season[] = seasons && seasons.length > 0
    ? seasons
    : Array.from({ length: 13 }).map((_, index) => {
        const num = 13 - index;
        return {
          id: `season-${num}`,
          name: `India Kids Fashion Week - Season ${num}`,
          shortName: `Season ${num}`,
          active: true,
          sortOrder: num,
        };
      });

  const handleSeasonClick = (season: Season) => {
    if (!onSelectSeason) return;
    if (selectedSeason === season.name || selectedSeason === season.id) {
      onSelectSeason("All Seasons");
    } else {
      onSelectSeason(season.name);
    }
  };

  const highestSeason = displaySeasons[0]?.shortName || "Season 13";
  const lowestSeason = displaySeasons[displaySeasons.length - 1]?.shortName || "Season 1";

  return (
    <section className="mx-auto mt-8 w-[calc(100%-64px)] max-w-[1120px] overflow-hidden rounded-[4px] border border-zinc-200 bg-white max-sm:mx-[17px] max-sm:mt-3 max-sm:w-auto">
      <button
        className="flex h-[78px] w-full items-center justify-between px-8 max-sm:h-[47px] max-sm:px-4"
        onClick={() => setOpen((value) => !value)}
      >
        <div className="flex min-w-0 items-center gap-5 max-sm:gap-3">
          <CalendarDays className="h-8 w-8 shrink-0 max-sm:h-[18px] max-sm:w-[18px]" />
          <div className="text-left">
            <h2 className="truncate text-[22px] font-bold max-sm:text-[12px]">
              India Kids Fashion Week ({lowestSeason} to {highestSeason})
            </h2>
            {selectedSeason !== "All Seasons" ? (
              <p className="text-[12px] font-semibold text-[#233653] max-sm:text-[10px]">
                Showing reviews for: {selectedSeason}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedSeason !== "All Seasons" && onSelectSeason ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelectSeason("All Seasons");
              }}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-700 hover:bg-zinc-200"
            >
              Clear Filter <X className="h-3 w-3" />
            </span>
          ) : null}
          <ChevronDown
            className={`h-6 w-6 transition-transform max-sm:h-4 max-sm:w-4 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      {open ? (
        <div className="grid grid-cols-4 gap-2 border-t border-zinc-100 p-3 text-[11px] font-bold sm:grid-cols-7">
          {displaySeasons.map((season) => {
            const isSelected =
              selectedSeason === season.name || selectedSeason === season.id;
            const shortLabel = season.shortName
              ? season.shortName.replace(/^Season\s*/i, "S")
              : season.name;

            return (
              <button
                key={season.id}
                onClick={() => handleSeasonClick(season)}
                className={`h-8 rounded-[3px] border transition-colors ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
