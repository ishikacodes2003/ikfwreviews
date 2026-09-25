"use client";

import Link from "next/link";
import {
  ArrowUp,
  ChevronRight,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

export function WebsiteFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-16 w-full border-t border-zinc-800 bg-[#09090b] text-zinc-300">
      <div className="mx-auto w-full max-w-[1240px] px-6 py-12 sm:px-8 sm:py-16 lg:px-10">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Platform Summary (4 Cols) */}
          <div className="space-y-5 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <Link
              href="/"
              className="inline-block text-xl font-black uppercase tracking-tight text-white transition-colors hover:text-amber-400"
            >
              IKFW Reviews
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              India&apos;s independent parent community directory and rating platform for India Kids Fashion Week. Fostering transparency and helping families share honest event feedback.
            </p>

            {/* Credibility Chips */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="text-sm font-black text-white">4.8 / 5.0</span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-zinc-400">Parent Satisfaction</p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-sm font-black text-white">100% Unbiased</span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-zinc-400">Independent Reviews</p>
              </div>
            </div>

            {/* Quick Contact / Support Note */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-zinc-400">Questions or verification queries?</p>
              <a
                href="mailto:contact@ikfwreviews.com"
                className="mt-1 inline-flex items-center gap-2 text-xs font-bold text-zinc-300 transition-colors hover:text-amber-400"
              >
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                <span>contact@ikfwreviews.com</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation: Explore Reviews (3 Cols) */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Explore Reviews
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>All Parent Reviews</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/seasons"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Reviews by Season</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cities"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Reviews by City</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/write-review"
                  className="inline-flex items-center gap-1.5 font-semibold text-amber-400 transition-all duration-150 hover:translate-x-1 hover:text-amber-300"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-amber-500" />
                  <span>Share Your Experience</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Parent Guides Hub</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/is-ikfw-genuine"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Is IKFW Genuine?</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/ikfw-auditions-and-fees"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Auditions &amp; Fees</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities (3 Cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Popular Cities
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-2 gap-y-2.5 text-sm sm:grid-cols-1">
              <li>
                <Link
                  href="/cities/mumbai"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Mumbai Reviews</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cities/delhi"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Delhi NCR Reviews</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cities/bangalore"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Bangalore Reviews</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cities/hyderabad"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Hyderabad Reviews</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cities/pune"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Pune Reviews</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cities/ahmedabad"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Ahmedabad Reviews</span>
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/cities"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 transition-colors hover:text-amber-300"
                >
                  <span>View All 14+ Cities</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Policies (2 Cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Trust & Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>About Platform</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/review-policy"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Review Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-zinc-400 transition-all duration-150 hover:translate-x-1 hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-Footer: Copyright, Trust Note & Back to Top */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-8 text-xs text-zinc-400 sm:flex-row">
          <p className="text-center sm:text-left">
            © {currentYear} <strong className="font-bold text-zinc-300">IKFW Reviews</strong>. Independent parent community. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="hidden text-zinc-400 md:inline">
              Built for parent transparency across India 🇮🇳
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top of page"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-95"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

