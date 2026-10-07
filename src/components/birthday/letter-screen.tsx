import { useEffect, useMemo, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { LETTER_TEXT } from "@/lib/birthday/letter";
import { FloatingDecor } from "./floating-decor";
import { NextButton } from "./next-button";

function graphemes(text: string) {
  try {
    return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)].map(
      (s) => s.segment,
    );
  } catch {
    return Array.from(text);
  }
}

export function LetterScreen({ onNext }: { onNext: () => void }) {
  const chars = useMemo(() => graphemes(LETTER_TEXT), []);
  const [shown, setShown] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const done = shown >= chars.length;

  useEffect(() => {
    if (done) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(chars.length);
      return;
    }
    const ch = chars[shown] ?? "";
    const delay = ch === "\n" ? 180 : ch === " " ? 18 : 28;
    const t = window.setTimeout(() => setShown((n) => n + 1), delay);
    return () => window.clearTimeout(t);
  }, [shown, done, chars]);

  return (
    <section className="scene-panel bg-letter">
      <FloatingDecor />
      <div className="scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col">
        <div className="letter-sheet flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl px-5 pt-4 pb-5">
          <div className="relative mx-auto h-36 w-36 shrink-0">
            <img
              src="/birthday/floral-wreath.jpg"
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="photo-hole absolute inset-[22%] overflow-hidden rounded-full"
              aria-label="Add a photo"
            >
              {photo ? (
                <img src={photo} alt="Your photo" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full flex-col items-center justify-center text-rose">
                  <Camera className="size-5" strokeWidth={1.8} />
                  <span className="mt-1 text-[0.65rem] font-bold tracking-wide">Photo</span>
                </span>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setPhoto(String(reader.result));
                reader.readAsDataURL(file);
              }}
            />
          </div>

          <p className="mt-3 flex-1 overflow-auto text-[0.95rem] leading-relaxed font-semibold text-pretty text-ink">
            {chars.slice(0, shown).join("")}
            {!done && <span className="caret">|</span>}
          </p>
        </div>
        {done && <NextButton onClick={onNext} />}
      </div>
    </section>
  );
}
