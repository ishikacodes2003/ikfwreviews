import { CheckCircle2, ShieldCheck, Star, Users } from "lucide-react";

interface TrustSectionProps {
  totalReviews?: number;
}

const items = [
  {
    icon: ShieldCheck,
    title: "Verified Parents",
    copy: "Reviews are checked for authenticity before they are highlighted.",
  },
  {
    icon: Star,
    title: "Season-Wise Ratings",
    copy: "Parents can compare experiences across India Kids Fashion Week seasons.",
  },
  {
    icon: Users,
    title: "City Coverage",
    copy: "Feedback is grouped across Mumbai, Delhi, Bangalore, Hyderabad, Pune, and more.",
  },
];

export function TrustSection({ totalReviews = 25 }: TrustSectionProps) {
  return (
    <section className="mx-[7vw] mt-8 border-t border-zinc-200 py-8 max-sm:mx-5 max-sm:mt-4 max-sm:py-5">
      <div className="mb-5 flex items-end justify-between gap-5 max-sm:block">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.08em] text-zinc-500">Parent-first review platform</p>
          <h2 className="mt-1 text-[26px] font-black leading-tight max-sm:text-[18px]">Know the experience before registration</h2>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-bold text-zinc-700 max-sm:mt-3">
          <CheckCircle2 className="h-4 w-4" />
          {totalReviews} public reviews
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-[4px] border border-zinc-200 bg-white p-5 max-sm:p-4">
              <Icon className="h-6 w-6" />
              <h3 className="mt-4 text-[16px] font-black max-sm:text-[14px]">{item.title}</h3>
              <p className="mt-2 text-[13px] font-medium leading-[1.45] text-zinc-600 max-sm:text-[12px]">{item.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
