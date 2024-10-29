import { HeroHighlight } from "@/components/ui/hero-highlight";

export default function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <h1
        className="text-md px-4 md:text-xl lg:text-2xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        테이스팅 예약이 완료되었습니다.
        <div>
          확인 후 연락드리겠습니다
        </div>
      </h1>
    </HeroHighlight>
  );
}
