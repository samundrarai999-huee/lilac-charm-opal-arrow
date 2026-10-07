import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Delete, i as Heart, n as Star, o as Camera, r as Sparkle, s as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BYFpUUyF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var listener = null;
function setFxListener(next) {
	listener = next;
}
function burst(kind = "confetti") {
	listener?.(kind);
}
async function listenForBlow(signal) {
	if (!navigator.mediaDevices?.getUserMedia) return "denied";
	let stream;
	try {
		stream = await navigator.mediaDevices.getUserMedia({ audio: {
			echoCancellation: false,
			noiseSuppression: false,
			autoGainControl: false
		} });
	} catch {
		return "denied";
	}
	const ctx = new (window.AudioContext || window.webkitAudioContext)();
	if (ctx.state === "suspended") try {
		await ctx.resume();
	} catch {
		stream.getTracks().forEach((t) => t.stop());
		return "denied";
	}
	const source = ctx.createMediaStreamSource(stream);
	const analyser = ctx.createAnalyser();
	analyser.fftSize = 1024;
	analyser.smoothingTimeConstant = .18;
	source.connect(analyser);
	const time = new Uint8Array(analyser.fftSize);
	const freq = new Uint8Array(analyser.frequencyBinCount);
	const cleanup = () => {
		stream.getTracks().forEach((t) => t.stop());
		ctx.close();
	};
	return new Promise((resolve) => {
		let settled = false;
		let baseline = 0;
		let samples = 0;
		const start = performance.now();
		const finish = (result) => {
			if (settled) return;
			settled = true;
			signal.removeEventListener("abort", onAbort);
			cleanup();
			resolve(result);
		};
		const onAbort = () => finish("aborted");
		if (signal.aborted) {
			finish("aborted");
			return;
		}
		signal.addEventListener("abort", onAbort);
		const tick = () => {
			if (settled) return;
			analyser.getByteTimeDomainData(time);
			analyser.getByteFrequencyData(freq);
			let sum = 0;
			for (let i = 0; i < time.length; i++) {
				const v = (time[i] - 128) / 128;
				sum += v * v;
			}
			const rms = Math.sqrt(sum / time.length);
			let low = 0;
			const n = Math.min(48, freq.length);
			for (let i = 1; i < n; i++) low += freq[i];
			low /= n * 255;
			if (performance.now() - start < 260) {
				samples += 1;
				baseline += (rms - baseline) / samples;
				requestAnimationFrame(tick);
				return;
			}
			if (rms > Math.max(.065, baseline * 3.4) || rms > .048 && low > .2) {
				finish("blown");
				return;
			}
			requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var BITS = [
	{
		Icon: Star,
		className: "top-[8%] left-[8%] size-4",
		delay: "0s"
	},
	{
		Icon: Sparkle,
		className: "top-[12%] right-[10%] size-5",
		delay: "0.6s"
	},
	{
		Icon: Heart,
		className: "top-[28%] left-[6%] size-3.5",
		delay: "1.1s"
	},
	{
		Icon: Star,
		className: "top-[22%] right-[7%] size-3",
		delay: "1.8s"
	},
	{
		Icon: Sparkle,
		className: "bottom-[22%] left-[10%] size-4",
		delay: "0.4s"
	},
	{
		Icon: Heart,
		className: "bottom-[18%] right-[12%] size-4",
		delay: "1.4s"
	},
	{
		Icon: Star,
		className: "bottom-[8%] left-[42%] size-3",
		delay: "2s"
	},
	{
		Icon: Sparkle,
		className: "top-[48%] right-[5%] size-3.5",
		delay: "0.9s"
	}
];
function FloatingDecor() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dot-veil" }), BITS.map((bit, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(bit.Icon, {
			strokeWidth: 1.75,
			className: `float-bit ${bit.className}`,
			style: { animationDelay: bit.delay }
		}, i))]
	});
}
function Balloons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "balloon b-rose left-[8%] top-[16%]",
			style: { animationDelay: "0.2s" }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "balloon b-lilac right-[10%] top-[12%]",
			style: { animationDelay: "1.1s" }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "balloon b-gold left-[12%] bottom-[18%]",
			style: { animationDelay: "0.7s" }
		})
	] });
}
function NextButton({ onClick, label = "Next" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "next-glow mx-auto mt-4 flex h-12 min-w-40 items-center justify-center gap-2 rounded-full px-7 text-base font-bold tracking-wide transition-transform duration-150 ease-out active:scale-[0.96]",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
			className: "size-5",
			strokeWidth: 2.4
		})]
	});
}
function CakeScreen({ onNext }) {
	const [phase, setPhase] = (0, import_react.useState)("intro");
	const [count, setCount] = (0, import_react.useState)(3);
	const [hint, setHint] = (0, import_react.useState)("Blow the candles in 3 seconds");
	const blown = phase === "blown" || phase === "celebrate";
	const abortRef = (0, import_react.useRef)(null);
	const extinguish = () => {
		if (blown) return;
		abortRef.current?.abort();
		setPhase("blown");
		setHint("");
		burst("fireworks");
		try {
			navigator.vibrate?.([
				30,
				40,
				30
			]);
		} catch {}
		window.setTimeout(() => setPhase("celebrate"), 900);
	};
	(0, import_react.useEffect)(() => {
		if (phase !== "intro") return;
		const t = window.setTimeout(() => setPhase("count"), 700);
		return () => window.clearTimeout(t);
	}, [phase]);
	(0, import_react.useEffect)(() => {
		if (phase !== "count") return;
		if (count > 0) {
			const t = window.setTimeout(() => setCount((c) => c - 1), 1e3);
			return () => window.clearTimeout(t);
		}
		setPhase("listen");
	}, [phase, count]);
	(0, import_react.useEffect)(() => {
		if (phase !== "listen") return;
		setHint("Blow into your phone…");
		const ac = new AbortController();
		abortRef.current = ac;
		let cancelled = false;
		(async () => {
			const result = await listenForBlow(ac.signal);
			if (cancelled || ac.signal.aborted) return;
			if (result === "blown") {
				extinguish();
				return;
			}
			if (result === "denied") setHint("Tap the cake to blow the candles");
		})();
		const fallback = window.setTimeout(() => {
			if (!cancelled) setHint("Blow into your phone — or tap the cake");
		}, 3e3);
		return () => {
			cancelled = true;
			ac.abort();
			window.clearTimeout(fallback);
		};
	}, [phase]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "scene-panel bg-cake",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingDecor, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Balloons, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-center text-[1.7rem] leading-tight font-semibold text-balance text-ink",
						children: "HAPPY BIRTHDAY PUJA DD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "relative mx-auto mt-1 w-[min(88vw,340px)] bg-transparent p-0",
						onClick: () => {
							if (phase === "listen") extinguish();
						},
						"aria-label": phase === "listen" ? "Blow out the candles" : "Birthday cake",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("cake-glow", blown && "off") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/birthday/cake-lit.jpg",
								alt: "",
								className: cn("art-soft relative w-full transition-opacity duration-500", blown ? "opacity-0" : "opacity-100")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/birthday/cake-out.jpg",
								alt: "Birthday cake",
								className: cn("art-soft absolute inset-0 w-full transition-opacity duration-500", blown ? "opacity-100" : "opacity-0")
							}),
							phase === "count" && count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "count-pop font-display pointer-events-none absolute inset-0 flex items-center justify-center text-7xl font-semibold text-rose drop-shadow-[0_4px_12px_rgba(255,248,242,0.9)]",
								children: count
							}, count)
						]
					}),
					phase !== "celebrate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 min-h-10 text-center text-sm font-semibold text-plum",
						children: hint
					}),
					phase === "celebrate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "scene-enter flex w-full flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/birthday/celebrate.jpg",
							alt: "Friends celebrating",
							className: "art-soft h-32 w-32 object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextButton, { onClick: onNext })]
					})
				]
			})
		]
	});
}
function ChoiceScreen({ onLetter, onGift }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "scene-panel bg-choice",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingDecor, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scene-enter relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 md:max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mb-1 text-center text-3xl font-semibold text-ink",
					children: "Pick one"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-center text-sm font-semibold text-plum",
					children: "A letter, or a little gift."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "choice-card rounded-xl p-3 text-left",
						onClick: onLetter,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 md:flex-col md:text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/birthday/envelope.jpg",
								alt: "",
								className: "size-24 rounded-lg object-cover md:size-36"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-semibold text-ink",
								children: "Letter"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold text-plum",
								children: "A note written just for you"
							})] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "choice-card rounded-xl p-3 text-left",
						onClick: onGift,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 md:flex-col md:text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/birthday/gift-closed.jpg",
								alt: "",
								className: "size-24 rounded-lg object-cover md:size-36"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-semibold text-ink",
								children: "Gift Box"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold text-plum",
								children: "Tap to unwrap a surprise"
							})] })]
						})
					})]
				})
			]
		})]
	});
}
var PALETTE = [
	"#C97B9A",
	"#F4C4D4",
	"#E8C56B",
	"#DCC6EA",
	"#FF8FA3",
	"#FFF8F2",
	"#FF6B4A"
];
function spawnConfetti(w, h, count) {
	const out = [];
	for (let i = 0; i < count; i++) {
		const kind = Math.random() > .78 ? "circle" : "rect";
		out.push({
			x: Math.random() * w,
			y: -20 - Math.random() * 80,
			vx: (Math.random() - .5) * 6,
			vy: 2 + Math.random() * 5,
			w: kind === "circle" ? 7 : 8 + Math.random() * 7,
			h: kind === "circle" ? 7 : 4 + Math.random() * 6,
			rot: Math.random() * Math.PI,
			vr: (Math.random() - .5) * .25,
			color: PALETTE[Math.random() * PALETTE.length | 0],
			life: 0,
			max: 90 + Math.random() * 50,
			kind,
			g: .08 + Math.random() * .06
		});
	}
	return out;
}
function spawnHearts(w, h, count) {
	const out = [];
	for (let i = 0; i < count; i++) out.push({
		x: Math.random() * w,
		y: h + 10 + Math.random() * 40,
		vx: (Math.random() - .5) * 1.2,
		vy: -(1.4 + Math.random() * 2.2),
		w: 10 + Math.random() * 10,
		h: 10,
		rot: 0,
		vr: (Math.random() - .5) * .04,
		color: PALETTE[Math.random() * 3 | 0],
		life: 0,
		max: 110 + Math.random() * 40,
		kind: "heart",
		g: -.01
	});
	return out;
}
function spawnFireworks(w, h) {
	const out = [];
	const bursts = 3;
	for (let b = 0; b < bursts; b++) {
		const cx = w * (.2 + Math.random() * .6);
		const cy = h * (.22 + Math.random() * .28);
		const n = 36;
		const color = PALETTE[Math.random() * PALETTE.length | 0];
		for (let i = 0; i < n; i++) {
			const a = i / n * Math.PI * 2 + Math.random() * .2;
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
				g: .06
			});
		}
	}
	return out;
}
function drawHeart(ctx, x, y, s) {
	ctx.beginPath();
	ctx.moveTo(x, y + s * .3);
	ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s * .3);
	ctx.bezierCurveTo(x - s / 2, y + s * .65, x, y + s * .9, x, y + s);
	ctx.bezierCurveTo(x, y + s * .9, x + s / 2, y + s * .65, x + s / 2, y + s * .3);
	ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s * .3);
	ctx.fill();
}
function ConfettiCanvas() {
	const ref = (0, import_react.useRef)(null);
	const parts = (0, import_react.useRef)([]);
	const raf = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
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
			const next = [];
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
				if (p.kind === "rect") ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
				else if (p.kind === "circle" || p.kind === "spark") {
					ctx.beginPath();
					ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
					ctx.fill();
				} else drawHeart(ctx, 0, -p.w / 2, p.w);
				ctx.restore();
				if (p.life < p.max && p.y < window.innerHeight + 40) next.push(p);
			}
			ctx.globalAlpha = 1;
			parts.current = next;
			raf.current = requestAnimationFrame(loop);
		};
		raf.current = requestAnimationFrame(loop);
		const onBurst = (kind) => {
			const w = window.innerWidth;
			const h = window.innerHeight;
			const mobile = w < 480;
			if (kind === "confetti") parts.current.push(...spawnConfetti(w, h, mobile ? 70 : 110));
			else if (kind === "fireworks") {
				parts.current.push(...spawnFireworks(w, h));
				parts.current.push(...spawnConfetti(w, h, mobile ? 50 : 80));
			} else parts.current.push(...spawnHearts(w, h, mobile ? 18 : 28));
		};
		setFxListener(onBurst);
		return () => {
			setFxListener(null);
			cancelAnimationFrame(raf.current);
			window.removeEventListener("resize", resize);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "fx-canvas",
		"aria-hidden": "true"
	});
}
var LETTER_TEXT = `Happy Birthday to YOU..
PUJA DD..🥳🎂
Tpi ko din haru sbb special hoss..
Vagawan jo kripa sadhai tpi ma rahi rahos..
Tpi ko life ma sadhai positive vibes rww joy bhari rahos..
I wish whatever YOU(PUJA DD) dream of, may it slowly come true
May this new age bring more happiness, good health and beautiful moments…
And once again many many returns of the day happy birthday to YOU PUJA DD..🎊💐`;
var FINAL_TEXT = "I hope u did like this small present from ur Samundra Vai…🙆‍♂️";
function FinalScreen() {
	(0, import_react.useEffect)(() => {
		burst("hearts");
		const t = window.setInterval(() => burst("hearts"), 2800);
		return () => window.clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "scene-panel bg-final",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingDecor, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/birthday/puppy-flowers.jpg",
				alt: "",
				className: "mb-6 h-36 w-36 rounded-full object-cover shadow-[0_16px_32px_rgba(74,53,80,0.16)]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-[1.45rem] leading-snug font-semibold text-balance text-ink",
				children: FINAL_TEXT
			})]
		})]
	});
}
function GiftScreen({ onNext }) {
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const open = () => {
		if (phase !== "idle") return;
		setPhase("opening");
		burst("confetti");
		window.setTimeout(() => setPhase("open"), 520);
	};
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(open, 1100);
		return () => window.clearTimeout(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "scene-panel bg-gift",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingDecor, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-center text-3xl font-semibold text-ink",
					children: "A little gift"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center justify-center",
					children: [phase !== "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: open,
						className: "bg-transparent p-0",
						"aria-label": "Open gift",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/birthday/gift-closed.jpg",
							alt: "Gift box",
							className: cn("art-soft w-[min(70vw,260px)]", phase === "idle" ? "gift-shake" : "gift-open")
						})
					}), phase === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "scene-enter flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "bubble mb-4 max-w-[16rem] text-center text-sm font-bold",
							children: "Happy Birthday to you Puja DD..🥳"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/birthday/puppy-dance.jpg",
							alt: "A puppy dancing with a flower",
							className: "puppy-dance art-soft w-[min(72vw,280px)]"
						})]
					})]
				}),
				phase === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextButton, { onClick: onNext })
			]
		})]
	});
}
function graphemes(text) {
	try {
		return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)].map((s) => s.segment);
	} catch {
		return Array.from(text);
	}
}
function LetterScreen({ onNext }) {
	const chars = (0, import_react.useMemo)(() => graphemes(LETTER_TEXT), []);
	const [shown, setShown] = (0, import_react.useState)(0);
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const done = shown >= chars.length;
	(0, import_react.useEffect)(() => {
		if (done) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShown(chars.length);
			return;
		}
		const ch = chars[shown] ?? "";
		const delay = ch === "\n" ? 180 : ch === " " ? 18 : 28;
		const t = window.setTimeout(() => setShown((n) => n + 1), delay);
		return () => window.clearTimeout(t);
	}, [
		shown,
		done,
		chars
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "scene-panel bg-letter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingDecor, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "letter-sheet flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl px-5 pt-4 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto h-36 w-36 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/birthday/floral-wreath.jpg",
							alt: "",
							className: "h-full w-full rounded-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							className: "photo-hole absolute inset-[22%] overflow-hidden rounded-full",
							"aria-label": "Add a photo",
							children: photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: photo,
								alt: "Your photo",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex h-full w-full flex-col items-center justify-center text-rose",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
									className: "size-5",
									strokeWidth: 1.8
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 text-[0.65rem] font-bold tracking-wide",
									children: "Photo"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								const reader = new FileReader();
								reader.onload = () => setPhoto(String(reader.result));
								reader.readAsDataURL(file);
							}
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 flex-1 overflow-auto text-[0.95rem] leading-relaxed font-semibold text-pretty text-ink",
					children: [chars.slice(0, shown).join(""), !done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "caret",
						children: "|"
					})]
				})]
			}), done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextButton, { onClick: onNext })]
		})]
	});
}
var KEYS = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
];
var PASSWORD = "0621";
function LockScreen({ onUnlock }) {
	const [pin, setPin] = (0, import_react.useState)("");
	const [shake, setShake] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const commit = (next) => {
		if (busy || shake) return;
		setPin(next);
		if (next.length < 4) return;
		if (next === PASSWORD) {
			setBusy(true);
			burst("confetti");
			try {
				navigator.vibrate?.(40);
			} catch {}
			window.setTimeout(onUnlock, 520);
			return;
		}
		setShake(true);
		try {
			navigator.vibrate?.(80);
		} catch {}
		window.setTimeout(() => {
			setShake(false);
			setPin("");
		}, 480);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "scene-panel bg-lock",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingDecor, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scene-enter relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-center text-[1.55rem] leading-tight font-semibold text-balance text-ink",
					children: "Who's birthday is today..???"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "portrait-frame",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/birthday/puppy-flowers.jpg",
							alt: "A little puppy holding flowers"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("mt-5 flex justify-center gap-3", shake && "pin-shake"),
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-3.5 rounded-full border-2 transition-colors duration-150", i < pin.length ? "border-rose bg-rose" : "border-lilac-deep bg-paper/70") }, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-3 gap-2.5",
					children: [
						KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "keypad-key",
							onClick: () => commit(pin.length >= 4 ? pin : pin + k),
							children: k
						}, k)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "keypad-key",
							onClick: () => commit(pin.length >= 4 ? pin : pin + "0"),
							children: "0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "keypad-key flex items-center justify-center",
							"aria-label": "Delete",
							onClick: () => setPin((p) => p.slice(0, -1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, {
								className: "size-6",
								strokeWidth: 2
							})
						})
					]
				})
			]
		})]
	});
}
function BirthdayExperience() {
	const [screen, setScreen] = (0, import_react.useState)("lock");
	const [seenLetter, setSeenLetter] = (0, import_react.useState)(false);
	const [seenGift, setSeenGift] = (0, import_react.useState)(false);
	const afterLetter = (0, import_react.useCallback)(() => {
		setSeenLetter(true);
		setScreen(seenGift ? "final" : "gift");
	}, [seenGift]);
	const afterGift = (0, import_react.useCallback)(() => {
		setSeenGift(true);
		setScreen(seenLetter ? "final" : "letter");
	}, [seenLetter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "scene-root",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfettiCanvas, {}),
			screen === "lock" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockScreen, { onUnlock: () => setScreen("cake") }),
			screen === "cake" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CakeScreen, { onNext: () => setScreen("choice") }),
			screen === "choice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceScreen, {
				onLetter: () => setScreen("letter"),
				onGift: () => setScreen("gift")
			}),
			screen === "letter" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterScreen, { onNext: afterLetter }),
			screen === "gift" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftScreen, { onNext: afterGift }),
			screen === "final" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalScreen, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirthdayExperience, {});
}
//#endregion
export { Home as component };
