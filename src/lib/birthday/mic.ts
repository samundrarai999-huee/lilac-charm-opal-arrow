export async function listenForBlow(
  signal: AbortSignal,
): Promise<"blown" | "denied" | "aborted"> {
  if (!navigator.mediaDevices?.getUserMedia) return "denied";

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  } catch {
    return "denied";
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      stream.getTracks().forEach((t) => t.stop());
      return "denied";
    }
  }

  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.18;
  source.connect(analyser);

  const time = new Uint8Array(analyser.fftSize);
  const freq = new Uint8Array(analyser.frequencyBinCount);

  const cleanup = () => {
    stream.getTracks().forEach((t) => t.stop());
    void ctx.close();
  };

  return new Promise((resolve) => {
    let settled = false;
    let baseline = 0;
    let samples = 0;
    const start = performance.now();

    const finish = (result: "blown" | "denied" | "aborted") => {
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

      const elapsed = performance.now() - start;
      if (elapsed < 260) {
        samples += 1;
        baseline += (rms - baseline) / samples;
        requestAnimationFrame(tick);
        return;
      }

      const threshold = Math.max(0.065, baseline * 3.4);
      if (rms > threshold || (rms > 0.048 && low > 0.2)) {
        finish("blown");
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
