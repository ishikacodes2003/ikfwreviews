"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Star, ShieldCheck, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Review } from "@/lib/reviews/types";

interface ParentTestimonialsProps {
  reviews?: Review[];
}

const fallbackTestimonials = [
  {
    id: "test-1",
    parentName: "Priya Sharma",
    city: "Mumbai",
    season: "India Kids Fashion Week - Season 13",
    rating: 5,
    highlight: "Audition to Finale",
    reviewText:
      "Our experience with India Kids Fashion Week was really nice. Watching our daughter walk on the stage with so much confidence was honestly the best part for us.",
    verified: true,
  },
  {
    id: "test-2",
    parentName: "Rahul Verma",
    city: "Delhi",
    season: "India Kids Fashion Week - Season 13",
    rating: 5,
    highlight: "Confidence Building",
    reviewText:
      "The finale was a great experience for him. By the time he had to walk on the runway, he looked much more confident than he did during the audition.",
    verified: true,
  },
  {
    id: "test-3",
    parentName: "Ritika Sen",
    city: "Kolkata",
    season: "India Kids Fashion Week - Season 12",
    rating: 5,
    highlight: "First Fashion Event",
    reviewText:
      "This was our daughter's first fashion event. The final walk was definitely our favourite moment. Overall, we had a really good experience with IKFW.",
    verified: true,
  },
  {
    id: "test-4",
    parentName: "Sunitha Reddy",
    city: "Hyderabad",
    season: "India Kids Fashion Week - Season 13",
    rating: 5,
    highlight: "Parent Experience",
    reviewText:
      "We liked that the kids were being guided backstage instead of being left on their own. The runway walk was a very proud moment for us.",
    verified: true,
  },
  {
    id: "test-5",
    parentName: "Ananya Sharma",
    city: "Bangalore",
    season: "India Kids Fashion Week - Season 12",
    rating: 5,
    highlight: "Complete Journey",
    reviewText:
      "The stage, music and lights made the final walk really special. We were sitting in the audience and cheering for her like any parent would.",
    verified: true,
  },
  {
    id: "test-6",
    parentName: "Vikram Mehta",
    city: "Pune",
    season: "India Kids Fashion Week - Season 12",
    rating: 5,
    highlight: "Backstage Experience",
    reviewText:
      "We could see the team coordinating with the children and telling them when they had to get ready. Seeing him walk on the runway confidently was a really nice moment for us.",
    verified: true,
  },
];

export function ParentTestimonials({ reviews = [] }: ParentTestimonialsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract top 5-star parent reviews or use fallback
  const topReviews = useMemo(() => {
    const published5Stars = reviews
      .filter((r) => r.rating === 5 && r.reviewText && r.reviewText.length > 30)
      .slice(0, 6);

    if (published5Stars.length >= 4) {
      return published5Stars.map((r) => ({
        id: r.id,
        parentName: r.parentName || "Verified Parent",
        city: r.city || "India",
        season: r.season || "India Kids Fashion Week",
        rating: r.rating,
        highlight: r.childExperienceHighlight || "Parent Experience",
        reviewText: r.reviewText,
        verified: r.verified,
      }));
    }

    return fallbackTestimonials;
  }, [reviews]);

  // Duplicate list items for seamless infinite gliding loop
  const displayTestimonials = useMemo(() => {
    return [...topReviews, ...topReviews];
  }, [topReviews]);

  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll > 0 && el.scrollLeft < maxScroll - 4);
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
  }, [updateScrollState]);

  // Continuous Smooth Marquee Auto-Rotation
  useEffect(() => {
    if (isHovered || isDragging || topReviews.length <= 1) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 120; // ~3 seconds per testimonial card (361px / 3s)

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
  }, [isHovered, isDragging, topReviews.length, updateScrollState]);

  // Manual Left/Right navigation
  const slide = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = Math.max(320, el.clientWidth * 0.7);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Mouse Drag support
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

  return (
    <section
      aria-label="Parent Testimonials"
      className="mx-auto mt-8 w-[calc(100%-64px)] max-w-[1120px] max-sm:mx-4 max-sm:mt-5 max-sm:w-auto"
    >
      {/* Header & Controls */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[22px] font-extrabold tracking-tight text-zinc-900 max-sm:text-[16px]">
            Parent Testimonials
          </h2>
          <span className="rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 max-sm:text-[9px]">
            ★ 5.0 Star Parent Stories
          </span>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => slide("left")}
            disabled={!canScrollLeft}
            aria-label="Previous testimonial"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-30 max-sm:h-7 max-sm:w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => slide("right")}
            disabled={!canScrollRight}
            aria-label="Next testimonial"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-30 max-sm:h-7 max-sm:w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Testimonials Slider Track */}
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Edge gradient fades */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-6 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />

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
          className={`flex gap-4 overflow-x-auto no-scrollbar py-1 ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          {displayTestimonials.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              whileHover={{ y: -3 }}
              className="relative flex h-[190px] w-[345px] min-w-[345px] shrink-0 flex-col justify-between rounded-[8px] border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md max-sm:h-[160px] max-sm:w-[275px] max-sm:min-w-[275px] max-sm:p-3"
            >
              <div>
                {/* Stars and Quote mark */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current max-sm:h-3 max-sm:w-3" strokeWidth={0} />
                    ))}
                  </div>
                  <Quote className="h-4 w-4 text-zinc-300 max-sm:h-3.5 max-sm:w-3.5" />
                </div>

                {/* Testimonial Quote Text */}
                <p className="mt-2 text-[13px] font-medium leading-relaxed text-zinc-700 line-clamp-3 max-sm:text-[11px] max-sm:leading-snug">
                  &ldquo;{item.reviewText}&rdquo;
                </p>
              </div>

              {/* Parent Author Details */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 max-sm:pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#19294a] text-[11px] font-bold text-white max-sm:h-6 max-sm:w-6 max-sm:text-[10px]">
                    {item.parentName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] font-bold text-zinc-900 max-sm:text-[11px]">
                        {item.parentName}
                      </span>
                      {item.verified && (
                        <ShieldCheck className="h-3.5 w-3.5 fill-[#19294a] text-white" strokeWidth={2.5} />
                      )}
                    </div>
                    <span className="block text-[11px] text-zinc-500 max-sm:text-[9px]">
                      {item.city}
                    </span>
                  </div>
                </div>

                <span className="rounded-[4px] bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 max-sm:text-[9px]">
                  {item.season.replace(/^India Kids Fashion Week - /i, "")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
