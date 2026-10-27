/**
 * Precision audio engine for CodeQuest Roulette Wheel.
 * Source: public/audio/roulette-spin.mp3
 *
 * Guarantees:
 * 1. Sound starts immediately on user spin action.
 * 2. Sound duration is synchronized with wheel animation.
 * 3. Sound stops immediately or fades cleanly when wheel stops (never continues playing).
 * 4. Prevents overlapping audio instances on repeated or rapid user clicks.
 * 5. Handles playback failure and browser autoplay restrictions gracefully.
 * 6. Clean lifecycle cleanup on component unmount or sound toggle.
 */

let rouletteAudio: HTMLAudioElement | null = null;
let fadeIntervalId: number | null = null;
let autoStopTimeoutId: number | null = null;
let activePlayPromise: Promise<void> | null = null;

const DEFAULT_VOLUME = 0.85;

/**
 * Lazily creates and configures the singleton roulette audio element.
 */
function getRouletteAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  if (!rouletteAudio) {
    try {
      rouletteAudio = new Audio('/audio/roulette-spin.mp3');
      rouletteAudio.preload = 'auto';
      rouletteAudio.volume = DEFAULT_VOLUME;

      // Handle loading failure gracefully without breaking the wheel
      rouletteAudio.addEventListener('error', (e) => {
        console.warn('Roulette audio load error (wheel will continue without sound):', e);
      });
    } catch (err) {
      console.warn('Failed to initialize Audio element:', err);
      return null;
    }
  }

  return rouletteAudio;
}

export interface PlayRouletteAudioOptions {
  durationMs?: number;
  onComplete?: () => void;
}

/**
 * Initiates the roulette audio playback in response to user click.
 * - Stops any currently running playback or fade.
 * - Resets playback position to 0.
 * - Schedules auto-stop if durationMs is provided.
 * - Returns a cancellation function that halts audio immediately.
 */
export function playRouletteAudio(
  optionsOrCallback?: PlayRouletteAudioOptions | (() => void)
): () => void {
  const options: PlayRouletteAudioOptions =
    typeof optionsOrCallback === 'function'
      ? { onComplete: optionsOrCallback }
      : optionsOrCallback || {};

  const audio = getRouletteAudio();
  if (!audio) {
    if (options.onComplete) options.onComplete();
    return () => {};
  }

  // Clear any existing fade intervals and auto-stop timers
  stopRouletteAudio(0);

  try {
    audio.currentTime = 0;
    audio.volume = DEFAULT_VOLUME;

    // Attach completion listener if the audio naturally ends before spin finishes
    const handleEnded = () => {
      audio.removeEventListener('ended', handleEnded);
      if (options.onComplete) options.onComplete();
    };
    audio.addEventListener('ended', handleEnded, { once: true });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      activePlayPromise = playPromise;
      playPromise
        .then(() => {
          activePlayPromise = null;
        })
        .catch((err) => {
          activePlayPromise = null;
          console.warn('Roulette audio playback prevented or interrupted:', err);
        });
    }
  } catch (err) {
    console.warn('Error starting roulette audio:', err);
  }

  // If a maximum duration is specified, schedule an authoritative stop
  if (options.durationMs && options.durationMs > 0) {
    autoStopTimeoutId = window.setTimeout(() => {
      autoStopTimeoutId = null;
      stopRouletteAudio(100);
      if (options.onComplete) options.onComplete();
    }, options.durationMs);
  }

  // Return cancel/stop function
  return () => {
    stopRouletteAudio(80);
  };
}

/**
 * Stops the roulette audio cleanly.
 * If fadeDurationMs > 0, performs a rapid micro fade-out to prevent audio pops.
 * If fadeDurationMs === 0, stops immediately.
 */
export function stopRouletteAudio(fadeDurationMs = 100): void {
  // Clear any pending auto-stop timer
  if (autoStopTimeoutId !== null) {
    window.clearTimeout(autoStopTimeoutId);
    autoStopTimeoutId = null;
  }

  // Clear any in-progress fade interval
  if (fadeIntervalId !== null) {
    window.clearInterval(fadeIntervalId);
    fadeIntervalId = null;
  }

  const audio = rouletteAudio;
  if (!audio) return;

  const immediatePauseAndReset = () => {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = DEFAULT_VOLUME;
    } catch {
      // Safe fallback if pause was called while promise pending
    }
  };

  // If already paused or immediate stop requested
  if (audio.paused || fadeDurationMs <= 0 || audio.volume <= 0.05) {
    if (activePlayPromise) {
      activePlayPromise
        .then(() => immediatePauseAndReset())
        .catch(() => immediatePauseAndReset());
    } else {
      immediatePauseAndReset();
    }
    return;
  }

  // Smooth micro-fade to avoid popping
  const steps = 6;
  const stepTime = Math.max(10, Math.floor(fadeDurationMs / steps));
  const volumeStep = audio.volume / steps;

  fadeIntervalId = window.setInterval(() => {
    if (audio.volume > volumeStep) {
      audio.volume = Math.max(0, audio.volume - volumeStep);
    } else {
      if (fadeIntervalId !== null) {
        window.clearInterval(fadeIntervalId);
        fadeIntervalId = null;
      }
      immediatePauseAndReset();
    }
  }, stepTime);
}
