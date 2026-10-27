/**
 * Audio engine for CodeQuest using the authentic roulette wheel sound asset.
 * Source: public/audio/roulette-spin.mp3 (7.08s authentic casino spin)
 */

let rouletteAudio: HTMLAudioElement | null = null;
let fadeInterval: number | null = null;

/**
 * Initializes and returns the shared HTMLAudioElement for the roulette spin.
 */
function getRouletteAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  if (!rouletteAudio) {
    try {
      rouletteAudio = new Audio('/audio/roulette-spin.mp3');
      rouletteAudio.preload = 'auto';
      rouletteAudio.volume = 0.85;

      // Handle loading errors gracefully so the wheel is never blocked
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

/**
 * Plays the roulette spin audio immediately in response to user click.
 * - Stops any previously running playback instance.
 * - Resets playback position to 0.
 * - Returns a clean cancellation/stop function.
 */
export function playRouletteAudio(onComplete?: () => void): () => void {
  const audio = getRouletteAudio();
  if (!audio) {
    if (onComplete) onComplete();
    return () => {};
  }

  // Clear any existing fade-out timers
  if (fadeInterval) {
    window.clearInterval(fadeInterval);
    fadeInterval = null;
  }

  try {
    // Reset position cleanly before starting
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.85;

    // Attach completion listener
    const handleEnded = () => {
      audio.removeEventListener('ended', handleEnded);
      if (onComplete) onComplete();
    };
    audio.addEventListener('ended', handleEnded, { once: true });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Autoplay policy or user gesture restriction handled gracefully
        console.warn('Audio playback prevented or interrupted:', err);
      });
    }
  } catch (err) {
    console.warn('Error starting roulette audio:', err);
  }

  // Return stop function with subtle fade-out
  return () => {
    stopRouletteAudio(200);
  };
}

/**
 * Smoothly stops the roulette audio with a short fade-out to prevent clipping.
 */
export function stopRouletteAudio(fadeDurationMs = 200) {
  const audio = rouletteAudio;
  if (!audio || audio.paused) return;

  if (fadeInterval) {
    window.clearInterval(fadeInterval);
    fadeInterval = null;
  }

  const steps = 10;
  const stepTime = fadeDurationMs / steps;
  const volumeStep = audio.volume / steps;

  fadeInterval = window.setInterval(() => {
    if (audio.volume > volumeStep) {
      audio.volume = Math.max(0, audio.volume - volumeStep);
    } else {
      audio.volume = 0;
      audio.pause();
      audio.currentTime = 0;
      if (fadeInterval) {
        window.clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }
  }, stepTime);
}
