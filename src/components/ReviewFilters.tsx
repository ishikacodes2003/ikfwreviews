"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  SlidersHorizontal,
  ShieldCheck,
  CalendarDays,
  MapPin,
  FileText,
  ArrowRight,
  X,
} from "lucide-react";

interface ReviewFiltersProps {
  rating: string;
  sort: string;
  verifiedOnly: boolean;
  onRatingChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onVerifiedChange: (value: boolean) => void;
}

export function ReviewFilters({
  rating,
  sort,
  verifiedOnly,
  onRatingChange,
  onSortChange,
  onVerifiedChange,
}: ReviewFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <section className="mx-auto mt-5 grid w-[calc(100%-64px)] max-w-[1120px] grid-cols-4 gap-5 max-sm:mx-5 max-sm:mt-3 max-sm:w-auto max-sm:gap-2">
      {/* Filters Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`flex h-[42px] w-full items-center justify-center gap-2 rounded-[3px] border bg-white text-[13px] font-semibold transition-colors max-sm:h-[34px] max-sm:text-[11px] ${
            isOpen
              ? "border-[#19294a] bg-zinc-50 text-[#19294a] ring-1 ring-[#19294a]"
              : "border-zinc-200 text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu Overlay */}
        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-40 w-72 rounded-[8px] border border-zinc-200 bg-white p-2 shadow-xl sm:w-80">
            <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                IKFW Reviews Filter & Directory
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                aria-label="Close filters menu"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-1 py-1">
              <Link
                href="/reviews"
                onClick={() => setIsOpen(false)}
                className="group flex items-start gap-3 rounded-[6px] p-2.5 transition hover:bg-zinc-50"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-[#19294a] group-hover:text-white">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-zinc-900 group-hover:text-[#19294a]">
                      All IKFW Reviews
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-700" />
                  </div>
                  <p className="line-clamp-1 text-[11px] text-zinc-500">
                    Browse the latest parent-submitted reviews.
                  </p>
                </div>
              </Link>

              <Link
                href="/seasons"
                onClick={() => setIsOpen(false)}
                className="group flex items-start gap-3 rounded-[6px] p-2.5 transition hover:bg-zinc-50"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-[#19294a] group-hover:text-white">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-zinc-900 group-hover:text-[#19294a]">
                      IKFW Reviews by Season
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-700" />
                  </div>
                  <p className="line-clamp-1 text-[11px] text-zinc-500">
                    Compare feedback across seasons.
                  </p>
                </div>
              </Link>

              <Link
                href="/cities"
                onClick={() => setIsOpen(false)}
                className="group flex items-start gap-3 rounded-[6px] p-2.5 transition hover:bg-zinc-50"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-[#19294a] group-hover:text-white">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-zinc-900 group-hover:text-[#19294a]">
                      IKFW Reviews by City
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-700" />
                  </div>
                  <p className="line-clamp-1 text-[11px] text-zinc-500">
                    Explore city-specific parent experiences.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Sort selection */}
      <label className="relative">
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
        <select
          aria-label="Sort reviews"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-[42px] w-full appearance-none rounded-[3px] border border-zinc-200 bg-white px-3 text-center text-[13px] font-semibold outline-none max-sm:h-[34px] max-sm:text-[11px]"
        >
          <option>Most Recent</option>
          <option>Most Helpful</option>
          <option>Highest Rating</option>
          <option>Lowest Rating</option>
        </select>
      </label>

      {/* Rating filter */}
      <label className="relative">
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
        <select
          aria-label="Filter by rating"
          value={rating}
          onChange={(event) => onRatingChange(event.target.value)}
          className="h-[42px] w-full appearance-none rounded-[3px] border border-zinc-200 bg-white px-3 text-center text-[13px] font-semibold outline-none max-sm:h-[34px] max-sm:text-[11px]"
        >
          <option>All Ratings</option>
          <option>5 Stars</option>
          <option>4 Stars</option>
          <option>3 Stars</option>
          <option>2 Stars</option>
          <option>1 Star</option>
        </select>
      </label>

      {/* Verified Only button */}
      <button
        className="flex h-[42px] items-center justify-center gap-2 rounded-[3px] border border-zinc-200 bg-white text-[13px] font-semibold max-sm:h-[34px] max-sm:text-[11px]"
        onClick={() => onVerifiedChange(!verifiedOnly)}
        aria-pressed={verifiedOnly}
      >
        <ShieldCheck className="h-4 w-4" />
        Verified Only
        <span
          className={`relative h-4 w-8 rounded-full transition-colors ${
            verifiedOnly ? "bg-black" : "bg-zinc-200"
          }`}
        >
          <span
            className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
              verifiedOnly ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </span>
      </button>
    </section>
  );
}

