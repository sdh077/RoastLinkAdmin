import { HeroHighlight } from "@/components/ui/hero-highlight";

export default function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <h1
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        원두 신청이 완료되었습니다.
        <div>
          택배비 3,500원
        </div>
        <div>
          하나은행 620-189537-152 신정주 입금
        </div>
      </h1>
    </HeroHighlight>
  );
}
