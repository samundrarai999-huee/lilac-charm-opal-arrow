import { ArrowRight } from "lucide-react";

export function NextButton({ onClick, label = "Next" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="next-glow mx-auto mt-4 flex h-12 min-w-40 items-center justify-center gap-2 rounded-full px-7 text-base font-bold tracking-wide transition-transform duration-150 ease-out active:scale-[0.96]"
    >
      {label}
      <ArrowRight className="size-5" strokeWidth={2.4} />
    </button>
  );
}
