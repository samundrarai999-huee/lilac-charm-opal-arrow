import { useEffect, useState } from "react";
import { burst } from "@/lib/birthday/fx";
import { GIFT_BUBBLE } from "@/lib/birthday/letter";
import { cn } from "@/lib/utils";
import { FloatingDecor } from "./floating-decor";
import { NextButton } from "./next-button";

type Phase = "idle" | "opening" | "open";

export function GiftScreen({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");

  const open = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    burst("confetti");
    window.setTimeout(() => setPhase("open"), 520);
  };

  useEffect(() => {
    const t = window.setTimeout(open, 1100);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="scene-panel bg-gift">
      <FloatingDecor />
      <div className="scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col items-center">
        <h1 className="font-display mt-2 text-center text-3xl font-semibold text-ink">
          A little gift
        </h1>

        <div className="flex flex-1 flex-col items-center justify-center">
          {phase !== "open" && (
            <button type="button" onClick={open} className="bg-transparent p-0" aria-label="Open gift">
              <img
                src="/birthday/gift-closed.jpg"
                alt="Gift box"
                className={cn(
                  "art-soft w-[min(70vw,260px)]",
                  phase === "idle" ? "gift-shake" : "gift-open",
                )}
              />
            </button>
          )}

          {phase === "open" && (
            <div className="scene-enter flex flex-col items-center">
              <p className="bubble mb-4 max-w-[16rem] text-center text-sm font-bold">
                {GIFT_BUBBLE}
              </p>
              <img
                src="/birthday/puppy-dance.jpg"
                alt="A puppy dancing with a flower"
                className="puppy-dance art-soft w-[min(72vw,280px)]"
              />
            </div>
          )}
        </div>

        {phase === "open" && <NextButton onClick={onNext} />}
      </div>
    </section>
  );
}
