import { useEffect, useRef, useState } from "react";
import { burst } from "@/lib/birthday/fx";
import { listenForBlow } from "@/lib/birthday/mic";
import { cn } from "@/lib/utils";
import { Balloons, FloatingDecor } from "./floating-decor";
import { NextButton } from "./next-button";

type Phase = "intro" | "count" | "listen" | "blown" | "celebrate";

export function CakeScreen({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [count, setCount] = useState(3);
  const [hint, setHint] = useState("Blow the candles in 3 seconds");
  const blown = phase === "blown" || phase === "celebrate";
  const abortRef = useRef<AbortController | null>(null);

  const extinguish = () => {
    if (blown) return;
    abortRef.current?.abort();
    setPhase("blown");
    setHint("");
    burst("fireworks");
    try {
      navigator.vibrate?.([30, 40, 30]);
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setPhase("celebrate"), 900);
  };

  useEffect(() => {
    if (phase !== "intro") return;
    const t = window.setTimeout(() => setPhase("count"), 700);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "count") return;
    if (count > 0) {
      const t = window.setTimeout(() => setCount((c) => c - 1), 1000);
      return () => window.clearTimeout(t);
    }
    setPhase("listen");
  }, [phase, count]);

  useEffect(() => {
    if (phase !== "listen") return;
    setHint("Blow into your phone…");
    const ac = new AbortController();
    abortRef.current = ac;
    let cancelled = false;

    void (async () => {
      const result = await listenForBlow(ac.signal);
      if (cancelled || ac.signal.aborted) return;
      if (result === "blown") {
        extinguish();
        return;
      }
      if (result === "denied") {
        setHint("Tap the cake to blow the candles");
      }
    })();

    const fallback = window.setTimeout(() => {
      if (!cancelled) setHint("Blow into your phone — or tap the cake");
    }, 3000);

    return () => {
      cancelled = true;
      ac.abort();
      window.clearTimeout(fallback);
    };
    // extinguish is stable enough for this screen lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <section className="scene-panel bg-cake">
      <FloatingDecor />
      <Balloons />
      <div className="scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center">
        <h1 className="font-display text-center text-[1.7rem] leading-tight font-semibold text-balance text-ink">
          HAPPY BIRTHDAY PUJA DD
        </h1>

        <button
          type="button"
          className="relative mx-auto mt-1 w-[min(88vw,340px)] bg-transparent p-0"
          onClick={() => {
            if (phase === "listen") extinguish();
          }}
          aria-label={phase === "listen" ? "Blow out the candles" : "Birthday cake"}
        >
          <span className={cn("cake-glow", blown && "off")} />
          <img
            src="/birthday/cake-lit.jpg"
            alt=""
            className={cn(
              "art-soft relative w-full transition-opacity duration-500",
              blown ? "opacity-0" : "opacity-100",
            )}
          />
          <img
            src="/birthday/cake-out.jpg"
            alt="Birthday cake"
            className={cn(
              "art-soft absolute inset-0 w-full transition-opacity duration-500",
              blown ? "opacity-100" : "opacity-0",
            )}
          />
          {phase === "count" && count > 0 && (
            <span
              key={count}
              className="count-pop font-display pointer-events-none absolute inset-0 flex items-center justify-center text-7xl font-semibold text-rose drop-shadow-[0_4px_12px_rgba(255,248,242,0.9)]"
            >
              {count}
            </span>
          )}
        </button>

        {phase !== "celebrate" && (
          <p className="mt-1 min-h-10 text-center text-sm font-semibold text-plum">{hint}</p>
        )}
        {phase === "celebrate" && (
          <div className="scene-enter flex w-full flex-col items-center">
            <img
              src="/birthday/celebrate.jpg"
              alt="Friends celebrating"
              className="art-soft h-32 w-32 object-cover"
            />
            <NextButton onClick={onNext} />
          </div>
        )}
      </div>
    </section>
  );
}
