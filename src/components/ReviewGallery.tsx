import Image from "next/image";
import { cn } from "@/lib/utils";

export function ReviewGallery({ images }: { images: string[] }) {
  return (
    <div className="mt-2 flex gap-2">
      {images.map((image, index) => (
        <div key={`${image}-${index}`} className="relative h-[96px] w-[156px] overflow-hidden rounded-[3px] bg-zinc-100 max-sm:h-[67px] max-sm:w-[108px]">
          <Image
            src={image}
            alt="Review uploaded event moment"
            fill
            sizes="(max-width: 640px) 108px, 156px"
            className={cn("object-cover", index % 2 === 0 ? "object-[50%_35%]" : "object-[50%_35%]")}
          />
        </div>
      ))}
    </div>
  );
}
