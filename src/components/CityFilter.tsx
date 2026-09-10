"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Check,
  LayoutGrid,
  Sliders,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type { CityStat, Season } from "@/lib/reviews/types";

interface CityFilterProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  cities: CityStat[];
  selectedSeason?: string;
  onSelectSeason?: (season: string) => void;
  seasons?: Season[];
}

const cityIconPaths: Record<string, string[]> = {
  "All Cities": [
    "M4 28h32",
    "M8 28V11l9 3v14",
    "M17 28V7l11 4v17",
    "M28 28V15h6v13",
    "M12 16h2M12 20h2M21 14h2M21 18h2M21 22h2",
  ],
  Mumbai: [
    "M7 28h26",
    "M10 28V15l10-8 10 8v13",
    "M14 28V17h12v11",
    "M17 20h6M17 24h6",
    "M13 15h14",
  ],
  Delhi: [
    "M8 28h24",
    "M11 28V13l9-6 9 6v15",
    "M16 28v-8h8v8",
    "M15 15h10",
    "M20 7v6",
    "M14 20h-3M29 20h-3",
  ],
  Hyderabad: [
    "M7 28h26",
    "M12 28v-8a8 8 0 0 1 16 0v8",
    "M20 28V8",
    "M17 11h6",
    "M15 16c-3 0-5 2-5 5M25 16c3 0 5 2 5 5",
    "M20 5v3",
  ],
  Bangalore: [
    "M6 28h28",
    "M10 28V17h6v11",
    "M16 28V9l8-4 8 4v19",
    "M21 12h2M21 16h2M21 20h2M27 12h2M27 16h2M27 20h2",
  ],
  Pune: [
    "M7 28h26",
    "M10 28V18h20v10",
    "M12 18l8-7 8 7",
    "M16 28v-6h8v6",
    "M20 8v3",
    "M9 20h22",
  ],
  Ahmedabad: [
    "M7 28h26",
    "M10 28V18a5 5 0 0 1 10 0v10",
    "M20 28V11l7-6 7 6v17",
    "M25 15h4M25 19h4M25 23h4",
    "M13 20h4",
  ],
  Chandigarh: [
    "M7 28h26",
    "M12 28v-7a8 8 0 0 1 16 0v7",
    "M20 28V8",
    "M17 11h6",
    "M10 24c3-2 6-2 10 0M20 24c4-2 7-2 10 0",
  ],
  Kolkata: [
    "M8 28h24",
    "M11 28V15l9-7 9 7v13",
    "M14 28v-9h12v9",
    "M20 8v20",
    "M12 15h16",
    "M28 17l4 2v9",
  ],
  Jaipur: [
    "M7 28h26",
    "M10 28V17l10-8 10 8v11",
    "M15 28v-7a5 5 0 0 1 10 0v7",
    "M14 17h12",
    "M17 13h6",
    "M10 20h-2M32 20h-2",
  ],
  Chennai: [
    "M6 28h28",
    "M11 28V15l9-8 9 8v13",
    "M14 28v-9h12v9",
    "M16 11h8",
    "M18 6h4",
    "M14 19h12",
  ],
  Lucknow: [
    "M6 28h28",
    "M10 28V16a10 10 0 0 1 20 0v12",
    "M15 28v-7a5 5 0 0 1 10 0v7",
    "M20 6v4",
    "M13 14c2-2 5-3 7-3s5 1 7 3",
  ],
  Indore: [
    "M7 28h26",
    "M10 28V12h20v16",
    "M13 12V8l7-4 7 4v4",
    "M15 28v-8h10v8",
    "M14 18h4M22 18h4",
    "M14 22h4M22 22h4",
  ],
  Surat: [
    "M6 28h28",
    "M12 28V14l8-7 8 7v14",
    "M16 28v-8h8v8",
    "M10 18h4M26 18h4",
    "M15 11h10",
  ],
  Goa: [
    "M6 28h28",
    "M11 28V14l9-7 9 7v14",
    "M16 28v-9h8v9",
    "M20 7v4",
    "M8 20c4-1 6-4 6-7",
    "M32 20c-4-1-6-4-6-7",
  ],
};

function CityIcon({ city, isSelected }: { city: string; isSelected: boolean }) {
  const paths = cityIconPaths[city] || cityIconPaths["All Cities"];
  return (
    <svg
      viewBox="0 0 40 34"
      aria-hidden="true"
      className={`mb-2.5 h-8 w-8 transition-transform duration-200 max-sm:mb-1.5 max-sm:h-6 max-sm:w-6 ${
        isSelected ? "scale-110 text-[#19294a]" : "text-zinc-800"
      }`}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          d={path}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

export function CityFilter({
  selectedCity,
  onSelectCity,
  cities,
  selectedSeason = "All Seasons",
  onSelectSeason,
  seasons,
}: CityFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Seasons list fallback if not supplied
  const displaySeasons: Season[] = useMemo(() => {
    if (seasons && seasons.length > 0) return seasons;
    return Array.from({ length: 13 }).map((_, index) => {
      const num = 13 - index;
      return {
        id: `season-${num}`,
        name: `India Kids Fashion Week - Season ${num}`,
        shortName: `Season ${num}`,
        active: true,
        sortOrder: num,
      };
    });
  }, [seasons]);

  // Filter cities based on search/type-in query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    const query = searchQuery.toLowerCase().trim();
    return cities.filter((item) => item.city.toLowerCase().includes(query));
  }, [searchQuery, cities]);

  // Duplicate items for endless seamless loop in carousel mode
  const carouselItems = useMemo(() => {
    if (filteredCities.length <= 1) return filteredCities;
    return [...filteredCities, ...filteredCities];
  }, [filteredCities]);

  // Update scroll states & horizontal progress bar
  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll > 0 && el.scrollLeft < maxScroll - 4);

    const singleSetWidth = el.scrollWidth / 2;
    if (singleSetWidth > 0) {
      const currentPos = el.scrollLeft % singleSetWidth;
      const progress = Math.min(1, Math.max(0, currentPos / (singleSetWidth - el.clientWidth || singleSetWidth)));
      setScrollProgress(progress);
    } else if (maxScroll > 0) {
      setScrollProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
    } else {
      setScrollProgress(0);
    }
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [filteredCities, viewMode, updateScrollState]);

  // Continuous Smooth Marquee Rotation
  useEffect(() => {
    if (viewMode !== "carousel" || isHovered || isDragging || filteredCities.length <= 1) {
      return;
    }

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 70; // ~3 seconds per city card (208px / 3s)

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const el = carouselRef.current;
      if (el) {
        const singleSetWidth = el.scrollWidth / 2;
        if (singleSetWidth > 0) {
          let nextScroll = el.scrollLeft + speed * delta;
          if (nextScroll >= singleSetWidth) {
            nextScroll -= singleSetWidth;
          }
          el.scrollLeft = nextScroll;
          updateScrollState();
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewMode, isHovered, isDragging, filteredCities.length, updateScrollState]);

  // Handle manual Carousel Sliding via arrow buttons
  const slide = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;

    const scrollAmount = Math.max(260, el.clientWidth * 0.75);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Mouse Drag to slide support
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setStartScrollLeft(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    let next = startScrollLeft - walk;
    const singleSetWidth = carouselRef.current.scrollWidth / 2;
    if (singleSetWidth > 0) {
      if (next >= singleSetWidth) next -= singleSetWidth;
      if (next < 0) next += singleSetWidth;
    }
    carouselRef.current.scrollLeft = next;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Type-in search submission (press Enter to pick top matching city)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredCities.length > 0) {
      onSelectCity(filteredCities[0].city);
    } else if (e.key === "Escape") {
      setSearchQuery("");
    }
  };

  return (
    <section
      className="mx-auto mt-8 w-[calc(100%-64px)] max-w-[1120px] max-sm:mx-4 max-sm:mt-4 max-sm:w-auto"
      id="cities"
    >
      {/* Header & Controls Bar: All on one clean line */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left Side: Title and Badge */}
        <div className="flex items-center gap-2.5">
          <h2 className="text-[24px] font-extrabold tracking-tight text-zinc-900 max-sm:text-[18px]">
            Filter by City
          </h2>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[12px] font-semibold text-zinc-600 max-sm:text-[10px]">
            {cities.length} Cities
          </span>
        </div>

        {/* Right Side: Season selector, City Search & Controls in one line */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Season Selector Dropdown */}
          <div className="relative min-w-[160px] flex-1 sm:w-48 sm:flex-initial">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 max-sm:h-3.5 max-sm:w-3.5" />
            <select
              aria-label="Filter by season"
              value={selectedSeason || "All Seasons"}
              onChange={(e) => onSelectSeason?.(e.target.value)}
              className="h-10 w-full appearance-none rounded-[6px] border border-zinc-200 bg-white pl-9 pr-8 text-[13px] font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 focus:border-[#19294a] focus:outline-none focus:ring-1 focus:ring-[#19294a] max-sm:h-8 max-sm:pl-8 max-sm:text-[11px]"
            >
              <option value="All Seasons">All Seasons (S1–S13)</option>
              {displaySeasons.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.shortName || s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Type-in Search Input */}
          <div className="relative min-w-[150px] flex-1 sm:w-56 sm:flex-initial">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 max-sm:h-3.5 max-sm:w-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Type city name..."
              className="h-10 w-full rounded-[6px] border border-zinc-200 bg-white pl-9 pr-8 text-[13px] font-medium text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-[#19294a] focus:outline-none focus:ring-1 focus:ring-[#19294a] max-sm:h-8 max-sm:pl-8 max-sm:text-[11px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear city search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Carousel Left/Right Sliding Navigation Arrows */}
          {viewMode === "carousel" && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => slide("left")}
                disabled={!canScrollLeft}
                aria-label="Slide left"
                className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-30 max-sm:h-8 max-sm:w-8"
              >
                <ChevronLeft className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
              </button>
              <button
                onClick={() => slide("right")}
                disabled={!canScrollRight}
                aria-label="Slide right"
                className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-30 max-sm:h-8 max-sm:w-8"
              >
                <ChevronRight className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
              </button>
            </div>
          )}

          {/* View All / Carousel Toggle */}
          <button
            onClick={() => setViewMode((curr) => (curr === "carousel" ? "grid" : "carousel"))}
            className="flex h-10 items-center gap-1.5 rounded-[6px] border border-zinc-200 bg-white px-3 text-[13px] font-bold text-[#19294a] shadow-sm transition hover:bg-zinc-50 max-sm:h-8 max-sm:px-2.5 max-sm:text-[11px]"
          >
            {viewMode === "carousel" ? (
              <>
                <LayoutGrid className="h-4 w-4 max-sm:h-3.5 max-sm:w-3.5" />
                <span>View All</span>
              </>
            ) : (
              <>
                <Sliders className="h-4 w-4 max-sm:h-3.5 max-sm:w-3.5" />
                <span>Carousel</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected City & Season Status Banner */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-zinc-600 max-sm:text-[11px]">
          <span>Currently Selected:</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#19294a]/10 px-2.5 py-0.5 font-bold text-[#19294a]">
            <Check className="h-3.5 w-3.5" />
            {selectedCity}
          </span>
          {selectedSeason && selectedSeason !== "All Seasons" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-0.5 text-[11px] font-bold text-white">
              <CalendarDays className="h-3 w-3" />
              {selectedSeason}
              <button
                onClick={() => onSelectSeason?.("All Seasons")}
                className="ml-1 rounded-full p-0.5 hover:bg-zinc-700"
                aria-label="Clear season filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {(selectedCity !== "All Cities" || (selectedSeason && selectedSeason !== "All Seasons")) && (
            <button
              onClick={() => {
                onSelectCity("All Cities");
                onSelectSeason?.("All Seasons");
              }}
              className="text-[11px] font-semibold text-zinc-500 underline hover:text-zinc-900"
            >
              Reset Filters
            </button>
          )}
        </div>

        {searchQuery && (
          <span className="text-[12px] text-zinc-500 max-sm:text-[10px]">
            Found {filteredCities.length} {filteredCities.length === 1 ? "city" : "cities"} matching &quot;{searchQuery}&quot;
          </span>
        )}
      </div>

      {/* Main Cities Display Area */}
      {viewMode === "carousel" ? (
        <div
          className="group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle edge fades for smooth sliding indicator */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-white to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />
          )}

          {/* Sliding Carousel Track Container (Continuous gliding ticker) */}
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={() => {
              setIsHovered(true);
              if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
            }}
            onTouchEnd={() => {
              touchTimeoutRef.current = setTimeout(() => setIsHovered(false), 2500);
            }}
            className={`flex gap-3 overflow-x-auto no-scrollbar py-2 ${
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
          >
            <AnimatePresence>
              {carouselItems.map((item, index) => {
                const isSelected = selectedCity === item.city;
                return (
                  <motion.button
                    layout
                    key={`${item.city}-${index}`}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectCity(item.city)}
                    className={`relative flex h-[146px] w-[196px] min-w-[196px] shrink-0 flex-col items-center justify-center rounded-[8px] border p-3 text-center transition-all duration-200 max-sm:h-[98px] max-sm:w-[132px] max-sm:min-w-[132px] max-sm:rounded-[6px] max-sm:p-1.5 ${
                      isSelected
                        ? "border-[#19294a] bg-zinc-50 shadow-[0_4px_12px_rgba(25,41,74,0.08)] ring-1 ring-[#19294a]"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 shadow-sm"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#19294a] text-white max-sm:right-1 max-sm:top-1 max-sm:h-3.5 max-sm:w-3.5">
                        <Check className="h-2.5 w-2.5 max-sm:h-2 max-sm:w-2" strokeWidth={3} />
                      </div>
                    )}

                    <CityIcon city={item.city} isSelected={isSelected} />

                    <span
                      className={`text-[13px] font-bold leading-snug px-1 max-sm:text-[10px] max-sm:leading-tight ${
                        isSelected ? "text-[#19294a]" : "text-zinc-900"
                      }`}
                    >
                      {item.city === "All Cities" ? (
                        <span>All Cities</span>
                      ) : (
                        <>
                          <span className="block whitespace-nowrap">IKFW Reviews in</span>
                          <span className="block">{item.city}</span>
                        </>
                      )}
                    </span>

                    <span className="mt-1 text-[12px] font-medium text-zinc-500 max-sm:mt-0.5 max-sm:text-[9px]">
                      ({item.count})
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>

            {filteredCities.length === 0 && (
              <div className="flex h-[138px] w-full flex-col items-center justify-center rounded-[8px] border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-zinc-500">
                <p className="text-[14px] font-semibold text-zinc-700">
                  No cities found matching &quot;{searchQuery}&quot;
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-[12px] font-bold text-[#19294a] underline"
                >
                  Clear search to view all cities
                </button>
              </div>
            )}
          </div>

          {/* Horizontal Sliding Progress Sidebar Track */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => slide("left")}
              disabled={!canScrollLeft}
              aria-label="Slide Left"
              className="text-zinc-400 hover:text-zinc-800 disabled:opacity-20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Sliding Progress Indicator Track */}
            <div
              className="relative h-1.5 w-48 max-w-full cursor-pointer overflow-hidden rounded-full bg-zinc-200"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                if (carouselRef.current) {
                  const maxScroll =
                    carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
                  carouselRef.current.scrollTo({
                    left: ratio * maxScroll,
                    behavior: "smooth",
                  });
                }
              }}
            >
              <div
                className="h-full rounded-full bg-[#19294a] transition-all duration-150"
                style={{
                  width: "35%",
                  transform: `translateX(${scrollProgress * 185}%)`,
                }}
              />
            </div>

            <button
              onClick={() => slide("right")}
              disabled={!canScrollRight}
              aria-label="Slide Right"
              className="text-zinc-400 hover:text-zinc-800 disabled:opacity-20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Grid Mode (When "View All" is active) */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 max-sm:gap-2">
          {filteredCities.map((item) => {
            const isSelected = selectedCity === item.city;
            return (
              <motion.button
                layout
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                key={item.city}
                onClick={() => {
                  onSelectCity(item.city);
                  setViewMode("carousel");
                }}
                className={`relative flex min-h-[142px] flex-col items-center justify-center rounded-[8px] border p-3 text-center transition-all duration-150 max-sm:min-h-[88px] max-sm:rounded-[4px] max-sm:p-1.5 ${
                  isSelected
                    ? "border-[#19294a] bg-zinc-50 ring-1 ring-[#19294a] shadow-sm"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 shadow-sm"
                }`}
              >
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#19294a] text-white max-sm:right-1 max-sm:top-1 max-sm:h-3.5 max-sm:w-3.5">
                    <Check className="h-2.5 w-2.5 max-sm:h-2 max-sm:w-2" strokeWidth={3} />
                  </div>
                )}
                <CityIcon city={item.city} isSelected={isSelected} />
                <span
                  className={`text-[13px] font-bold leading-snug px-1 max-sm:text-[10px] max-sm:leading-tight ${
                    isSelected ? "text-[#19294a]" : "text-zinc-900"
                  }`}
                >
                  {item.city === "All Cities" ? (
                    <span>All Cities</span>
                  ) : (
                    <>
                      <span className="block whitespace-nowrap">IKFW Reviews in</span>
                      <span className="block">{item.city}</span>
                    </>
                  )}
                </span>
                <span className="mt-1 text-[12px] font-medium text-zinc-500 max-sm:mt-0.5 max-sm:text-[9px]">
                  ({item.count})
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </section>
  );
}


