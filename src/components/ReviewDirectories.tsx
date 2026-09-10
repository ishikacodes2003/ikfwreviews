import Link from "next/link";

export function ReviewDirectories() {
  return (
    <section
      className="mx-auto mt-6 grid w-[calc(100%-64px)] max-w-[1120px] gap-4 sm:grid-cols-3 max-sm:mx-5 max-sm:mt-3 max-sm:w-auto"
      aria-label="IKFW review directories"
    >
      <Link
        href="/reviews"
        className="rounded border border-zinc-200 bg-white p-5 hover:border-black"
      >
        <h2 className="font-black">All IKFW Reviews</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Browse the latest parent-submitted reviews.
        </p>
      </Link>
      <Link
        href="/seasons"
        className="rounded border border-zinc-200 bg-white p-5 hover:border-black"
      >
        <h2 className="font-black">IKFW Reviews by Season</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Compare feedback across seasons.
        </p>
      </Link>
      <Link
        href="/cities"
        className="rounded border border-zinc-200 bg-white p-5 hover:border-black"
      >
        <h2 className="font-black">IKFW Reviews by City</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Explore city-specific parent experiences.
        </p>
      </Link>
    </section>
  );
}
