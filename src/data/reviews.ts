import type { Review, RatingValue } from "@/lib/reviews/types";

export function extractSeasonId(seasonStr?: string | null): string {
  if (!seasonStr) return "season-13";
  const match = seasonStr.match(/Season\s*(\d+)/i);
  if (match) {
    return `season-${match[1]}`;
  }
  return "season-13";
}

/**
 * 25 Handcrafted parent reviews replacing previously hardcoded reviews.
 * Includes:
 * - 10 Detailed reviews (1-10) with title highlights & photo references
 * - 10 Medium reviews (11-20)
 * - 5 Short reviews (21-25)
 */
const rawReviews: {
  id: string;
  name: string;
  city: string;
  rating: RatingValue;
  season: string;
  highlight?: string;
  text: string;
  helpfulCount: number;
  verified: boolean;
  createdAt: string;
  images?: string[];
}[] = [
  // --- Detailed Reviews (1 - 10) ---
  {
    id: "rev-1",
    name: "Priya Sharma",
    city: "Mumbai",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Audition to Finale",
    text: `Our experience with India Kids Fashion Week was really nice. It was the first time our daughter was taking part in something like this, so obviously we were a little worried in the beginning.

At the audition she was quite nervous, but the people there made her comfortable. Once her turn was over, she was actually very happy with herself.

The finale was even more exciting for her. She enjoyed getting ready, meeting the other kids and doing the photography. She kept talking about the stage and lights even before the show started.

As parents, we were also comfortable because the team was guiding the children backstage. Watching our daughter walk on the stage with so much confidence was honestly the best part for us.

Overall, a very good experience and we are happy we let her participate.`,
    helpfulCount: 24,
    verified: true,
    createdAt: "2026-08-14T10:30:00Z",
    images: ["/kids-fashion-reference.png"],
  },
  {
    id: "rev-2",
    name: "Rahul Verma",
    city: "Delhi",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Confidence Building",
    text: `My son is normally a little shy, especially when there are many people around. So we were not sure how he would react at the audition.

He was nervous in the beginning but slowly became comfortable. After the audition, he was actually excited about the finale.

The finale was a great experience for him. He enjoyed the backstage activities, photography and meeting the other kids. By the time he had to walk on the runway, he looked much more confident than he did during the audition.

For us, that was the biggest thing. He got confidence from the whole experience. We were happy seeing that change in him.`,
    helpfulCount: 18,
    verified: true,
    createdAt: "2026-08-12T14:20:00Z",
    images: [],
  },
  {
    id: "rev-3",
    name: "Ritika Sen",
    city: "Kolkata",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "First Fashion Event",
    text: `This was our daughter's first fashion event, so everything was new for her as well as for us.

She was a little scared before the audition but after completing it she was very excited. She loved the photography part and was very happy getting ready for the finale.

There were lots of children backstage and she made some new friends too. The whole atmosphere was quite exciting for her.

The final walk was definitely our favourite moment. She came back home very tired but kept talking about the show. Overall, we had a really good experience with IKFW.`,
    helpfulCount: 17,
    verified: true,
    createdAt: "2026-08-10T11:15:00Z",
    images: ["/kids-fashion-reference.png"],
  },
  {
    id: "rev-4",
    name: "Sunitha Reddy",
    city: "Hyderabad",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Parent Experience",
    text: `As parents, our main concern was how the children would be managed during the event. There were quite a lot of kids, so we were wondering how everything would happen.

But our daughter seemed comfortable throughout. During the audition she was nervous at first, but the team helped her settle down.

She really enjoyed the finale, specially the getting ready and photography part. We also liked that the kids were being guided backstage instead of being left on their own.

The runway walk was a very proud moment for us. She looked much more confident than we expected.

Overall, a good experience for our family.`,
    helpfulCount: 15,
    verified: true,
    createdAt: "2026-08-08T09:40:00Z",
    images: ["/kids-fashion-reference.png"],
  },
  {
    id: "rev-5",
    name: "Ananya Sharma",
    city: "Bangalore",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "Complete Journey",
    text: `Our daughter was not very confident about performing in front of so many people before this. The audition was her first proper experience of performing in front of a jury.

She was nervous, but after it was done she was very happy. By the time of the finale, she was much more excited than nervous.

She enjoyed the backstage preparation and taking photographs. She also liked meeting the other children.

The stage, music and lights made the final walk really special. We were sitting in the audience and cheering for her like any parent would.

Very happy with the overall experience.`,
    helpfulCount: 21,
    verified: true,
    createdAt: "2026-08-06T16:00:00Z",
    images: ["/kids-fashion-reference.png", "/kids-fashion-reference.png"],
  },
  {
    id: "rev-6",
    name: "Vikram Mehta",
    city: "Pune",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "Backstage Experience",
    text: `Our son has always been interested in fashion and stage activities, so we thought of giving IKFW a try.

The audition went well. He was nervous before going but once he finished, he was quite happy.

What he enjoyed most was the finale. He liked being backstage, seeing everyone getting ready and doing the photography. He was also excited to meet the other kids.

We could see the team coordinating with the children and telling them when they had to get ready. That made things easier for us too.

Seeing him walk on the runway confidently was a really nice moment for us.`,
    helpfulCount: 14,
    verified: true,
    createdAt: "2026-08-03T13:30:00Z",
    images: [],
  },
  {
    id: "rev-7",
    name: "Manisha Kulkarni",
    city: "Nagpur",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Confidence & Learning",
    text: `We noticed a good change in our daughter's confidence after participating in IKFW.

She is usually a little shy, so the audition itself was a big thing for her. She was nervous but managed to perform.

After that she became very excited about the finale. She enjoyed the photography, getting ready and meeting the other kids.

On the final day, she was much more comfortable on stage. We were honestly surprised to see how confidently she walked.

For us, that was more important than anything else. She got a new experience and became more confident.`,
    helpfulCount: 16,
    verified: true,
    createdAt: "2026-07-31T10:15:00Z",
    images: ["/kids-fashion-reference.png"],
  },
  {
    id: "rev-8",
    name: "Deepak Sundaram",
    city: "Chennai",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Finale Day",
    text: `Our daughter enjoyed the whole IKFW experience. The audition was a little stressful for her because she had never performed in front of a jury before.

But after that she was looking forward to the finale.

She loved the photography and getting ready backstage. There was a lot happening around her, but she seemed to enjoy it rather than getting nervous.

The final runway was the highlight. Seeing her walk under the lights in front of everyone was a very proud moment for us.

We were happy with the way everything was coordinated and most importantly, our daughter enjoyed it.`,
    helpfulCount: 19,
    verified: true,
    createdAt: "2026-07-28T15:45:00Z",
    images: ["/kids-fashion-reference.png"],
  },
  {
    id: "rev-9",
    name: "Kavita Rao",
    city: "Ahmedabad",
    rating: 5,
    season: "India Kids Fashion Week - Season 11",
    highlight: "Photography & Runway",
    text: `Our daughter loves dressing up and taking pictures, so she was very excited when we told her about IKFW.

The audition was a new experience for her. She was nervous initially, but she got comfortable after speaking with the team.

She probably enjoyed the photography session the most. She was also very excited about walking on the runway.

The final show looked really nice with the lights and music. As parents, it was a proud feeling to see her walking so confidently.

She enjoyed the whole thing and is already asking when she can do something like this again.`,
    helpfulCount: 12,
    verified: true,
    createdAt: "2026-07-25T11:00:00Z",
    images: [],
  },
  {
    id: "rev-10",
    name: "Simran Kaur",
    city: "Chandigarh",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "From Audition to Final Walk",
    text: `Our daughter had an interest in modelling but had never actually participated in a fashion event before.

The audition gave her a chance to experience what it is actually like. She was nervous in the beginning but became comfortable after a while.

The finale was much more fun for her. She enjoyed getting ready, taking photographs and spending time with the other kids.

We were also happy with the coordination backstage. We could sit and watch the show without constantly worrying about where she was.

The final walk was a very proud moment for us. She came out looking much more confident than she was when we first started this journey.`,
    helpfulCount: 22,
    verified: true,
    createdAt: "2026-07-21T09:30:00Z",
    images: ["/kids-fashion-reference.png"],
  },

  // --- Medium Reviews (11 - 20) ---
  {
    id: "rev-11",
    name: "Rohit Malhotra",
    city: "Mumbai",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Audition & Runway",
    text: "We had a really nice experience with IKFW. Our daughter was nervous during the audition, but she became comfortable soon. She especially enjoyed the photography and final runway. Seeing her walk confidently on stage was a very proud moment for us.",
    helpfulCount: 11,
    verified: true,
    createdAt: "2026-07-17T14:10:00Z",
  },
  {
    id: "rev-12",
    name: "Suman Joshi",
    city: "Delhi",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Confidence Boost",
    text: "My son really enjoyed participating in IKFW. He was shy at first but slowly became more comfortable. He loved the finale and meeting the other children. We could actually see a difference in his confidence by the end.",
    helpfulCount: 9,
    verified: true,
    createdAt: "2026-07-13T10:00:00Z",
  },
  {
    id: "rev-13",
    name: "Alok Mukherjee",
    city: "Kolkata",
    rating: 5,
    season: "India Kids Fashion Week - Season 11",
    highlight: "Audition & Finale",
    text: "We had checked a few India Kids Fashion Week reviews before deciding to participate. Now we can share our own experience. Our daughter enjoyed both the audition and finale, especially the photography. Overall, we were quite happy with the experience.",
    helpfulCount: 8,
    verified: true,
    createdAt: "2026-07-09T16:20:00Z",
  },
  {
    id: "rev-14",
    name: "Tanvi Deshmukh",
    city: "Hyderabad",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "Stage Experience",
    text: "Our daughter had a good experience with IKFW. She was nervous at the audition but became much more confident later. The finale was fun for her and she really enjoyed getting ready and walking on the stage.",
    helpfulCount: 10,
    verified: true,
    createdAt: "2026-07-05T12:00:00Z",
  },
  {
    id: "rev-15",
    name: "Pallavi Nambiar",
    city: "Bangalore",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "Runway & Mentors",
    text: "Really enjoyed the IKFW experience. Our son was quite nervous initially but by the finale he was much more comfortable. He enjoyed the stage, photography and meeting the other kids. Happy we gave him this opportunity.",
    helpfulCount: 13,
    verified: true,
    createdAt: "2026-07-01T15:30:00Z",
  },
  {
    id: "rev-16",
    name: "Arjun Singhania",
    city: "Pune",
    rating: 5,
    season: "India Kids Fashion Week - Season 11",
    highlight: "Runway Confidence",
    text: "Our daughter had a great time at IKFW. She enjoyed the audition and was very excited for the finale. The photography and runway were her favourite parts. We were very happy seeing her confidence improve.",
    helpfulCount: 7,
    verified: true,
    createdAt: "2026-06-27T11:45:00Z",
  },
  {
    id: "rev-17",
    name: "Sanjay Tijare",
    city: "Nagpur",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "Jury & Runway",
    text: "We had a good experience with India Kids Fashion Week. Our son got a chance to perform in front of a jury and later walk on the runway. He enjoyed the whole experience and came back much more confident.",
    helpfulCount: 11,
    verified: true,
    createdAt: "2026-06-23T14:00:00Z",
  },
  {
    id: "rev-18",
    name: "Suresh Pillai",
    city: "Chennai",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "Backstage & Runway",
    text: "Our daughter really enjoyed the event. She liked the backstage experience and photography, but the final runway was definitely her favourite. The team was helpful and we were happy with how the event went.",
    helpfulCount: 9,
    verified: true,
    createdAt: "2026-06-19T09:15:00Z",
  },
  {
    id: "rev-19",
    name: "Sunita Agarwal",
    city: "Ahmedabad",
    rating: 5,
    season: "India Kids Fashion Week - Season 10",
    highlight: "Photography Session",
    text: "Really happy with our IKFW experience. Our daughter loves photography so she enjoyed that part a lot. She was also very excited about the runway. Overall, it was a nice experience for both of us.",
    helpfulCount: 6,
    verified: true,
    createdAt: "2026-06-15T13:40:00Z",
  },
  {
    id: "rev-20",
    name: "Nitin Bhasin",
    city: "Chandigarh",
    rating: 5,
    season: "India Kids Fashion Week - Season 11",
    highlight: "Stage Confidence",
    text: "Our daughter was quite shy when she started, but by the finale she was walking confidently on stage. She enjoyed meeting the other kids and being part of the show. We are happy with the overall experience.",
    helpfulCount: 10,
    verified: true,
    createdAt: "2026-06-11T17:00:00Z",
  },

  // --- Short Reviews (21 - 25) ---
  {
    id: "rev-21",
    name: "Sara Khan",
    city: "Mumbai",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Ramp Walk",
    text: "Really nice experience with IKFW. Our daughter enjoyed the whole event and loved walking on the runway.",
    helpfulCount: 8,
    verified: true,
    createdAt: "2026-06-07T10:30:00Z",
  },
  {
    id: "rev-22",
    name: "Varun Chopra",
    city: "Delhi",
    rating: 5,
    season: "India Kids Fashion Week - Season 12",
    highlight: "Confidence Growth",
    text: "Very good experience. My son was nervous in the beginning but became much more confident by the finale.",
    helpfulCount: 7,
    verified: true,
    createdAt: "2026-06-03T16:15:00Z",
  },
  {
    id: "rev-23",
    name: "Abhishek Dutta",
    city: "Kolkata",
    rating: 5,
    season: "India Kids Fashion Week - Season 10",
    highlight: "Photography & Finale",
    text: "Our daughter had a great time at IKFW. She especially loved the photography and final show.",
    helpfulCount: 5,
    verified: true,
    createdAt: "2026-05-30T11:00:00Z",
  },
  {
    id: "rev-24",
    name: "Divya Reddy",
    city: "Hyderabad",
    rating: 5,
    season: "India Kids Fashion Week - Season 13",
    highlight: "Guided Backstage",
    text: "Good experience overall. The children were well guided and our daughter really enjoyed the finale.",
    helpfulCount: 9,
    verified: true,
    createdAt: "2026-05-26T14:45:00Z",
  },
  {
    id: "rev-25",
    name: "Kiran Mazumdar",
    city: "Bangalore",
    rating: 5,
    season: "India Kids Fashion Week - Season 11",
    highlight: "Fun & Friends",
    text: "Loved the IKFW experience. Our child had fun, made new friends and came back much more confident.",
    helpfulCount: 12,
    verified: true,
    createdAt: "2026-05-22T09:20:00Z",
  },
];

/**
 * Unified 25 parent reviews collection
 */
export const reviews: Review[] = rawReviews.map((r) => ({
  id: r.id,
  parentName: r.name,
  name: r.name,
  initial: r.name.charAt(0).toUpperCase(),
  city: r.city,
  rating: r.rating,
  eventName: "India Kids Fashion Week",
  seasonId: extractSeasonId(r.season),
  season: r.season,
  childExperienceHighlight: r.highlight || null,
  reviewText: r.text,
  text: r.text,
  helpfulCount: r.helpfulCount,
  verified: r.verified,
  createdAt: r.createdAt,
  images: r.images || [],
  status: "published" as const,
}));
