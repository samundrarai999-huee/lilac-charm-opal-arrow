import { useEffect } from "react";
import { burst } from "@/lib/birthday/fx";
import { FINAL_TEXT } from "@/lib/birthday/letter";
import { FloatingDecor } from "./floating-decor";

export function FinalScreen() {
  useEffect(() => {
    burst("hearts");
    const t = window.setInterval(() => burst("hearts"), 2800);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="scene-panel bg-final">
      <FloatingDecor />
      <div className="scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center text-center">
        <img
          src="/birthday/puppy-flowers.jpg"
          alt=""
          className="mb-6 h-36 w-36 rounded-full object-cover shadow-[0_16px_32px_rgba(74,53,80,0.16)]"
        />
        <p className="font-display text-[1.45rem] leading-snug font-semibold text-balance text-ink">
          {FINAL_TEXT}
        </p>
      </div>
    </section>
  );
}
