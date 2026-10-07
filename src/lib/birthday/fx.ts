export type BurstKind = "confetti" | "fireworks" | "hearts";

type Listener = (kind: BurstKind) => void;

let listener: Listener | null = null;

export function setFxListener(next: Listener | null) {
  listener = next;
}

export function burst(kind: BurstKind = "confetti") {
  listener?.(kind);
}
