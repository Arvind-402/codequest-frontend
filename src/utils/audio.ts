/**
 * Audio synthesis engine for CodeQuest spinning wheel.
 * Uses the Web Audio API for zero-dependency, zero-latency realistic mechanical clicks and chimes.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Synthesizes a single crisp mechanical peg/flapper tick.
 */
export function playWheelTick(pitch = 1.0, volume = 0.35) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Transient click (mechanical wood/plastic pin impact)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Rapid pitch drop to simulate pin impact deflection
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1100 * pitch, now);
  osc.frequency.exponentialRampToValueAtTime(180 * pitch, now + 0.022);

  // Sharp attack and quick exponential decay
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

  // 2. High-frequency snap (flapper scrape)
  const bufferSize = ctx.sampleRate * 0.015; // 15ms buffer
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3200 * pitch, now);
  filter.Q.setValueAtTime(3.0, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.7, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

  // Connect routing
  osc.connect(gain);
  gain.connect(ctx.destination);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  // Trigger
  osc.start(now);
  osc.stop(now + 0.025);

  noise.start(now);
  noise.stop(now + 0.02);
}

/**
 * Plays a full decelerating wheel spin sound sequence.
 * Matches the CSS cubic-bezier(0.12, 0.8, 0.22, 1) timing.
 */
export function startWheelSpinSound(durationMs = 4200, onComplete?: () => void): () => void {
  const timeouts: number[] = [];
  let isCancelled = false;

  // Generate tick timestamps that emulate realistic rotational deceleration
  // Physics: angular velocity omega(t) decreases smoothly from high speed to 0.
  const timestamps: number[] = [];
  let currentTime = 15; // First tick after 15ms

  // Initial rapid tick interval (ms)
  let currentInterval = 28;

  while (currentTime < durationMs - 40) {
    timestamps.push(currentTime);

    // Progress from 0 to 1
    const progress = currentTime / durationMs;

    // Cubic deceleration rate: interval widens dramatically towards the end
    // Easing curves: early on intervals are 28ms-40ms, later 80ms, 160ms, 300ms, 480ms
    const decelerationFactor = Math.pow(progress, 2.6);
    currentInterval = 28 + decelerationFactor * 520;

    currentTime += currentInterval;
  }

  // Schedule each tick
  timestamps.forEach((time, index) => {
    const timerId = window.setTimeout(() => {
      if (isCancelled) return;
      // Slight pitch variation for organic mechanical feel
      const pitchVariation = 0.95 + (index % 3) * 0.05 - (time / durationMs) * 0.15;
      const volumeFade = Math.max(0.2, 0.38 - (time / durationMs) * 0.12);
      playWheelTick(pitchVariation, volumeFade);
    }, time);
    timeouts.push(timerId);
  });

  // End chime when wheel locks into place
  const endTimerId = window.setTimeout(() => {
    if (!isCancelled) {
      playWheelWinChime();
      if (onComplete) onComplete();
    }
  }, durationMs);
  timeouts.push(endTimerId);

  // Return cancel function
  return () => {
    isCancelled = true;
    timeouts.forEach((id) => clearTimeout(id));
  };
}

/**
 * Celebratory chime when the wheel lands on the selected wedge.
 */
export function playWheelWinChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 harmonic arpeggio

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    const noteTime = now + idx * 0.06;
    gain.gain.setValueAtTime(0.001, noteTime);
    gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.5);
  });
}
