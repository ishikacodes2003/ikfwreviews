"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative h-[360px] overflow-hidden bg-black max-sm:h-[158px]">
      <Image
        src="/kids-fashion-reference.webp"
        alt="Children on a Kids Fashion Week runway"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[64%_38%] opacity-95 max-sm:object-[58%_36%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="absolute left-1/2 top-[86px] w-full max-w-[1180px] -translate-x-1/2 px-8 text-white max-sm:left-5 max-sm:top-[43px] max-sm:w-auto max-sm:max-w-[220px] max-sm:translate-x-0 max-sm:px-0"
      >
        <h1 className="max-w-[700px] text-[34px] font-bold leading-[1.25] max-sm:text-[16px] max-sm:leading-[1.45]">
          IKFW Reviews – India Kids Fashion Week Reviews
          <span className="mt-3 block text-[18px] font-medium leading-[1.45] text-white/90 max-sm:mt-1.5 max-sm:text-[10px]">
            Read parent experiences before you register. Share your experience after you participate.
          </span>
        </h1>
        <div className="mt-7 h-px w-28 bg-white max-sm:mt-3 max-sm:w-14" />
      </motion.div>
    </section>
  );
}
