"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { authClient, useAuthSession } from "@/lib/auth/client";
import { PREDEFINED_CITIES } from "@/lib/reviews/stats";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileCitiesOpen, setMobileCitiesOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = useAuthSession();

  const user = session?.user;
  const displayName = user?.name?.trim() || user?.email || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!accountOpen) return;

    function closeAccountMenu(event: MouseEvent) {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setAccountOpen(false);
    }

    document.addEventListener("mousedown", closeAccountMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeAccountMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen]);

  async function signOut() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto grid h-[70px] w-full max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center px-8 max-sm:h-[48px] max-sm:px-4">
        <div className="flex justify-start">
          <button
            aria-label="Open menu"
            className="-ml-1 inline-flex rounded-full p-1.5 hover:bg-zinc-100 transition-colors"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-6 w-6 max-sm:h-[19px] max-sm:w-[19px]" strokeWidth={2} />
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/"
            className="block whitespace-nowrap text-center text-[26px] font-black uppercase leading-none tracking-[0px] text-black max-sm:text-[15px]"
          >
            KIDS FASHION WEEK REVIEW
          </Link>
        </motion.div>

        <div className="-mr-1 flex items-center justify-end gap-3 max-sm:gap-1">
          <button
            aria-label="Search"
            className="rounded-full p-1.5"
            onClick={() => setSearchOpen((value) => !value)}
          >
            <Search className="h-7 w-7 max-sm:h-[18px] max-sm:w-[18px]" strokeWidth={2.2} />
          </button>

          <div className="max-md:hidden">
            {!isPending && !user ? (
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-full border border-black px-5 text-[13px] font-bold transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Sign in
              </Link>
            ) : null}

            {!isPending && user ? (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  aria-label={`Open account menu for ${displayName}`}
                  aria-expanded={accountOpen}
                  className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-black text-sm font-black text-white ring-offset-2 hover:ring-2 hover:ring-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  onClick={() => setAccountOpen((value) => !value)}
                >
                  <span aria-hidden="true">{initial}</span>
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="absolute inset-0 h-full w-full object-cover" src={user.image} alt="" />
                  ) : null}
                </button>

                <AnimatePresence>
                  {accountOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-12 w-56 rounded-lg border border-zinc-200 bg-white p-2 shadow-soft"
                    >
                      <div className="border-b border-zinc-100 px-2 py-2">
                        <p className="truncate text-sm font-bold">{user.name || "Your account"}</p>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">{user.email}</p>
                      </div>
                      <button
                        type="button"
                        className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold hover:bg-zinc-100"
                        onClick={signOut}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {searchOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 58, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mx-auto w-full max-w-[1180px] overflow-hidden px-8 max-sm:h-12 max-sm:px-4"
          >
            <label className="sr-only" htmlFor="review-search">
              Search reviews
            </label>
            <input
              id="review-search"
              className="h-11 w-full rounded-[3px] border border-zinc-300 px-3 text-[15px] font-medium outline-none focus:border-black max-sm:h-9 max-sm:text-[13px]"
              placeholder="Search parent reviews"
              type="search"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/25"
            onClick={() => setMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="h-full w-[260px] bg-white px-5 py-4 shadow-soft overflow-y-auto"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[15px] font-black">IKFW Reviews</p>
                <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="grid gap-4 text-[13px] font-bold">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/reviews" onClick={() => setMenuOpen(false)}>
                  All Reviews
                </Link>
                <Link href="/seasons" onClick={() => setMenuOpen(false)}>
                  Seasons
                </Link>
                <div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => setMobileCitiesOpen((value) => !value)}
                  >
                    <span>Cities</span>
                    <span className="text-xs text-zinc-500">{mobileCitiesOpen ? "−" : "+"}</span>
                  </button>
                  {mobileCitiesOpen ? (
                    <div className="mt-3 grid gap-3 pl-3 text-[12px] font-semibold text-zinc-700">
                      <Link href="/cities" onClick={() => setMenuOpen(false)}>All cities</Link>
                      {PREDEFINED_CITIES.slice(0, 8).map((city) => (
                        <Link key={city} href={`/cities/${city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`} onClick={() => setMenuOpen(false)}>
                          {city}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                <Link href="/guides/how-to-read-ikfw-reviews" onClick={() => setMenuOpen(false)}>
                  Parent Guide
                </Link>
                <Link href="/about" onClick={() => setMenuOpen(false)}>
                  About
                </Link>
                <Link href="/review-policy" onClick={() => setMenuOpen(false)}>
                  Review Policy
                </Link>
                <Link href="/terms" onClick={() => setMenuOpen(false)}>
                  Terms & Conditions
                </Link>
                <Link href="/privacy" onClick={() => setMenuOpen(false)}>
                  Privacy Policy
                </Link>
                <Link href="/write-review" onClick={() => setMenuOpen(false)}>
                  Write a Review
                </Link>
                {user ? (
                  <button type="button" className="text-left" onClick={signOut}>
                    Sign out
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    Sign in
                  </Link>
                )}
              </nav>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
