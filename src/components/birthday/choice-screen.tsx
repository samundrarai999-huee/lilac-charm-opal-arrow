import { FloatingDecor } from "./floating-decor";

export function ChoiceScreen({
  onLetter,
  onGift,
}: {
  onLetter: () => void;
  onGift: () => void;
}) {
  return (
    <section className="scene-panel bg-choice">
      <FloatingDecor />
      <div className="scene-enter relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 md:max-w-2xl">
        <h1 className="font-display mb-1 text-center text-3xl font-semibold text-ink">
          Pick one
        </h1>
        <p className="mb-1 text-center text-sm font-semibold text-plum">
          A letter, or a little gift.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <button type="button" className="choice-card rounded-xl p-3 text-left" onClick={onLetter}>
            <div className="flex items-center gap-3 md:flex-col md:text-center">
              <img
                src="/birthday/envelope.jpg"
                alt=""
                className="size-24 rounded-lg object-cover md:size-36"
              />
              <div>
                <p className="font-display text-2xl font-semibold text-ink">Letter</p>
                <p className="mt-1 text-sm font-semibold text-plum">A note written just for you</p>
              </div>
            </div>
          </button>

          <button type="button" className="choice-card rounded-xl p-3 text-left" onClick={onGift}>
            <div className="flex items-center gap-3 md:flex-col md:text-center">
              <img
                src="/birthday/gift-closed.jpg"
                alt=""
                className="size-24 rounded-lg object-cover md:size-36"
              />
              <div>
                <p className="font-display text-2xl font-semibold text-ink">Gift Box</p>
                <p className="mt-1 text-sm font-semibold text-plum">Tap to unwrap a surprise</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
