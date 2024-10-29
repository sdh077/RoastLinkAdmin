import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

export default function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <h1
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        원두 신청이 완료되었습니다.
        <Highlight className="text-black dark:text-white">
          감사합니다
        </Highlight>
      </h1>
    </HeroHighlight>
  );
}
