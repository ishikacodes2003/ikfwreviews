import { ChevronRight, Shield } from "lucide-react";
import Link from "next/link";

export function ReviewPolicy() {
  return (
    <section id="policy" className="mx-auto mt-8 flex w-[calc(100%-64px)] max-w-[1120px] items-center gap-5 rounded-[4px] bg-zinc-50 px-6 py-5 max-sm:mx-5 max-sm:mt-3 max-sm:w-auto max-sm:gap-3 max-sm:px-3 max-sm:py-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center max-sm:h-9 max-sm:w-9">
        <Shield className="h-10 w-10 max-sm:h-8 max-sm:w-8" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-[16px] font-extrabold max-sm:text-[12px]">We work hard to keep reviews genuine.</h2>
        <p className="mt-1 text-[13px] font-medium leading-[1.35] text-zinc-700 max-sm:mt-0.5 max-sm:text-[10.5px]">
          Our team verifies and removes fake, spam, and misleading reviews to help parents make informed decisions.
        </p>
      </div>
      <Link href="/review-policy" className="flex shrink-0 items-center gap-2 text-[14px] font-bold text-[#19294a] max-sm:text-[11px]">
        Read More
        <ChevronRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
