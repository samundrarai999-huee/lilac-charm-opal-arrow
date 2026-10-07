import { useEffect, useRef } from "react";
import { setFxListener, type BurstKind } from "@/lib/birthday/fx";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
  max: number;
  kind: "rect" | "circle" | "spark" | "heart";
  g: number;
};

const PALETTE = ["#C97B9A", "#F4C4D4", "#E8C56B", "#DCC6EA", "#FF8FA3", "#FFF8F2", "#FF6B4A"];

function spawnConfetti(w: number, h: number, count: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const kind = Math.random() > 0.78 ? "circle" : "rect";
    out.push({
      x: Math.random() * w,
      y: -20 - Math.random() * 80,
      vx: (Math.random() - 0.5) * 6,
      vy: 2 + Math.random() * 5,
      w: kind === "circle" ? 7 : 8 + Math.random() * 7,
      h: kind === "circle" ? 7 : 4 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      color: PALETTE[(Math.random() * PALETTE.length) | 0],
      life: 0,
      max: 90 + Math.random() * 50,
      kind,
      g: 0.08 + Math.random() * 0.06,
    });
  }
  return out;
}

function spawnHearts(w: number, h: number, count: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: Math.random() * w,
      y: h + 10 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(1.4 + Math.random() * 2.2),
      w: 10 + Math.random() * 10,
      h: 10,
      rot: 0,
      vr: (Math.random() - 0.5) * 0.04,
      color: PALETTE[(Math.random() * 3) | 0],
      life: 0,
      max: 110 + Math.random() * 40,
      kind: "heart",
      g: -0.01,
    });
  }
  return out;
}

function spawnFireworks(w: number, h: number): Particle[] {
  const out: Particle[] = [];
  const bursts = 3;
  for (let b = 0; b < bursts; b++) {
    const cx = w * (0.2 + Math.random() * 0.6);
    const cy = h * (0.22 + Math.random() * 0.28);
    const n = 36;
    const color = PALETTE[(Math.random() * PALETTE.length) | 0];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.2;
      const sp = 2.2 + Math.random() * 3.4;
      out.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        w: 3 + Math.random() * 3,
        h: 3,
        rot: a,
        vr: 0,
        color: i % 3 === 0 ? "#FFF8F2" : color,
        life: 0,
        max: 42 + Math.random() * 18,
        kind: "spark",
        g: 0.06,
      });
    }
  }
  return out;
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s * 0.3);
  ctx.bezierCurveTo(x - s / 2, y + s * 0.65, x, y + s * 0.9, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.9, x + s / 2, y + s * 0.65, x + s / 2, y + s * 0.3);
  ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s * 0.3);
  ctx.fill();
}

export function ConfettiCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Particle[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const next: Particle[] = [];
      for (const p of parts.current) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.g;
        p.rot += p.vr;
        const alpha = Math.max(0, 1 - p.life / p.max);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.kind === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.kind === "circle" || p.kind === "spark") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawHeart(ctx, 0, -p.w / 2, p.w);
        }
        ctx.restore();
        if (p.life < p.max && p.y < window.innerHeight + 40) next.push(p);
      }
      ctx.globalAlpha = 1;
      parts.current = next;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    const onBurst = (kind: BurstKind) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 480;
      if (kind === "confetti") {
        parts.current.push(...spawnConfetti(w, h, mobile ? 70 : 110));
      } else if (kind === "fireworks") {
        parts.current.push(...spawnFireworks(w, h));
        parts.current.push(...spawnConfetti(w, h, mobile ? 50 : 80));
      } else {
        parts.current.push(...spawnHearts(w, h, mobile ? 18 : 28));
      }
    };
    setFxListener(onBurst);

    return () => {
      setFxListener(null);
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="fx-canvas" aria-hidden="true" />;
}
