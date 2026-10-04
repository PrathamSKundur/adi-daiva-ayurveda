// Device capability checks, evaluated once.
const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches;

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
  reducedMotion ||
  !webglOk() ||
  (navigator.deviceMemory !== undefined && navigator.deviceMemory < 3) ||
  (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4);

export const MAX_DPR = 1.5;
