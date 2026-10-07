import { useState } from "react";
import { Delete } from "lucide-react";
import { burst } from "@/lib/birthday/fx";
import { cn } from "@/lib/utils";
import { FloatingDecor } from "./floating-decor";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const PASSWORD = "0621";

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);

  const commit = (next: string) => {
    if (busy || shake) return;
    setPin(next);
    if (next.length < 4) return;
    if (next === PASSWORD) {
      setBusy(true);
      burst("confetti");
      try {
        navigator.vibrate?.(40);
      } catch {
        /* ignore */
      }
      window.setTimeout(onUnlock, 520);
      return;
    }
    setShake(true);
    try {
      navigator.vibrate?.(80);
    } catch {
      /* ignore */
    }
    window.setTimeout(() => {
      setShake(false);
      setPin("");
    }, 480);
  };

  return (
    <section className="scene-panel bg-lock">
      <FloatingDecor />
      <div className="scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <h1 className="font-display text-center text-[1.55rem] leading-tight font-semibold text-balance text-ink">
          Who's birthday is today..???
        </h1>

        <div className="mx-auto mt-5">
          <div className="portrait-frame">
            <img src="/birthday/puppy-flowers.jpg" alt="A little puppy holding flowers" />
          </div>
        </div>

        <div className={cn("mt-5 flex justify-center gap-3", shake && "pin-shake")}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-3.5 rounded-full border-2 transition-colors duration-150",
                i < pin.length
                  ? "border-rose bg-rose"
                  : "border-lilac-deep bg-paper/70",
              )}
            />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className="keypad-key"
              onClick={() => commit(pin.length >= 4 ? pin : pin + k)}
            >
              {k}
            </button>
          ))}
          <span />
          <button
            type="button"
            className="keypad-key"
            onClick={() => commit(pin.length >= 4 ? pin : pin + "0")}
          >
            0
          </button>
          <button
            type="button"
            className="keypad-key flex items-center justify-center"
            aria-label="Delete"
            onClick={() => setPin((p) => p.slice(0, -1))}
          >
            <Delete className="size-6" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
