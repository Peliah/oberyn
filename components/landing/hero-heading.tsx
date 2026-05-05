import { OberynWordmark } from "@/components/brand/oberyn-wordmark";

export function HeroHeading() {
  return (
    <h1 className="w-full max-w-xl">
      <OberynWordmark priority className="max-h-14 w-auto sm:max-h-[4.25rem] lg:max-h-[5rem]" />
    </h1>
  );
}
