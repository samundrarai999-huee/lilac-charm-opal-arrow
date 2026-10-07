import { Heart, Sparkle, Star } from "lucide-react";

const BITS = [
  { Icon: Star, className: "top-[8%] left-[8%] size-4", delay: "0s" },
  { Icon: Sparkle, className: "top-[12%] right-[10%] size-5", delay: "0.6s" },
  { Icon: Heart, className: "top-[28%] left-[6%] size-3.5", delay: "1.1s" },
  { Icon: Star, className: "top-[22%] right-[7%] size-3", delay: "1.8s" },
  { Icon: Sparkle, className: "bottom-[22%] left-[10%] size-4", delay: "0.4s" },
  { Icon: Heart, className: "bottom-[18%] right-[12%] size-4", delay: "1.4s" },
  { Icon: Star, className: "bottom-[8%] left-[42%] size-3", delay: "2s" },
  { Icon: Sparkle, className: "top-[48%] right-[5%] size-3.5", delay: "0.9s" },
] as const;

export function FloatingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="dot-veil" />
      {BITS.map((bit, i) => (
        <bit.Icon
          key={i}
          strokeWidth={1.75}
          className={`float-bit ${bit.className}`}
          style={{ animationDelay: bit.delay }}
        />
      ))}
    </div>
  );
}

export function Balloons() {
  return (
    <>
      <span className="balloon b-rose left-[8%] top-[16%]" style={{ animationDelay: "0.2s" }} />
      <span className="balloon b-lilac right-[10%] top-[12%]" style={{ animationDelay: "1.1s" }} />
      <span className="balloon b-gold left-[12%] bottom-[18%]" style={{ animationDelay: "0.7s" }} />
    </>
  );
}
