import { useCallback, useState } from "react";
import { CakeScreen } from "./cake-screen";
import { ChoiceScreen } from "./choice-screen";
import { ConfettiCanvas } from "./confetti-canvas";
import { FinalScreen } from "./final-screen";
import { GiftScreen } from "./gift-screen";
import { LetterScreen } from "./letter-screen";
import { LockScreen } from "./lock-screen";

type Screen = "lock" | "cake" | "choice" | "letter" | "gift" | "final";

export function BirthdayExperience() {
  const [screen, setScreen] = useState<Screen>("lock");
  const [seenLetter, setSeenLetter] = useState(false);
  const [seenGift, setSeenGift] = useState(false);

  const afterLetter = useCallback(() => {
    setSeenLetter(true);
    setScreen(seenGift ? "final" : "gift");
  }, [seenGift]);

  const afterGift = useCallback(() => {
    setSeenGift(true);
    setScreen(seenLetter ? "final" : "letter");
  }, [seenLetter]);

  return (
    <main className="scene-root">
      <ConfettiCanvas />
      {screen === "lock" && <LockScreen onUnlock={() => setScreen("cake")} />}
      {screen === "cake" && <CakeScreen onNext={() => setScreen("choice")} />}
      {screen === "choice" && (
        <ChoiceScreen
          onLetter={() => setScreen("letter")}
          onGift={() => setScreen("gift")}
        />
      )}
      {screen === "letter" && <LetterScreen onNext={afterLetter} />}
      {screen === "gift" && <GiftScreen onNext={afterGift} />}
      {screen === "final" && <FinalScreen />}
    </main>
  );
}
