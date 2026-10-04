// Device capability checks, evaluated once in the browser.
// Safe to import during the build-time pre-render (Node), where everything is false.
const isBrowser = typeof window !== 'undefined';
const mq = (q) => isBrowser && window.matchMedia(q).matches;

export const reducedMotion = mq('(prefers-reduced-motion: reduce)');
export const finePointer = mq('(hover: hover) and (pointer: fine)');

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// Low-power phones and reduced-motion users get static images with a CSS glow instead of shaders.
export const lowPower =
  isBrowser &&
  (reducedMotion ||
    !webglOk() ||
    (navigator.deviceMemory !== undefined && navigator.deviceMemory < 3) ||
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4));

export const MAX_DPR = 1.5;
