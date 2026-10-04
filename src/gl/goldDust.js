// Phase 3.3 · falling gold dust (#D4AF37) with real depth, gathering behind the
// focused Swarna Prashana image. World units = CSS pixels at z = 0.
import * as THREE from 'three';
import { MAX_DPR } from '../lib/env';

const R = Math.random;

const VERT = /* glsl */ `
  attribute float aLife; attribute float aSize;
  uniform float uPix;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPix * (900.0 / -mv.z);
    vA = sin(3.14159 * aLife);
  }
`;
const FRAG = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    vec3 gold = mix(vec3(0.83, 0.69, 0.22), vec3(1.0, 0.93, 0.7), smoothstep(0.25, 0.0, d));
    gl_FragColor = vec4(gold * core * vA, core * vA);
  }
`;

export function createGoldDust(canvas, count = 520) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 1, 5000);

  const pos = new Float32Array(count * 3);
  const life = new Float32Array(count);
  const size = new Float32Array(count);
  const vel = new Float32Array(count);
  const phase = new Float32Array(count);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aLife', new THREE.BufferAttribute(life, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uPix: { value: Math.min(window.devicePixelRatio, MAX_DPR) } },
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  let w = 1, h = 1, emitter = null, raf, visible = true;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width || 1; h = r.height || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = h / 2 / Math.tan(THREE.MathUtils.degToRad(20)); // 1 unit = 1 px at z = 0
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const spawn = (k, anywhere) => {
    let x, y;
    if (emitter && R() < 0.9) {
      x = emitter.x - w / 2 + (R() - 0.5) * emitter.w * 1.25;
      y = h / 2 - emitter.y + R() * 60;
    } else {
      x = (R() - 0.5) * w;
      y = anywhere ? (R() - 0.5) * h : h / 2 + R() * 40;
    }
    pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = (R() - 0.5) * 500;
    vel[k] = 0.35 + R() * 1.1;
    life[k] = anywhere ? R() : 0;
    size[k] = 1.5 + R() * 3.5;
    phase[k] = R() * 6.28;
  };
  for (let k = 0; k < count; k++) spawn(k, true);

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);
  const clock = new THREE.Clock();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const rate = emitter ? 0.008 : 0.0035; // more, shorter-lived dust while an image is in focus
    for (let k = 0; k < count; k++) {
      life[k] += rate * (0.6 + vel[k] * 0.5);
      if (life[k] >= 1) { spawn(k, false); continue; }
      pos[k * 3] += Math.sin(t * 0.8 + phase[k]) * 0.25;
      pos[k * 3 + 1] -= vel[k];
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aLife.needsUpdate = true;
    renderer.render(scene, camera);
  };
  loop();

  return {
    /** rect in canvas pixels {x (centre), y (top), w}, or null for ambient dust */
    setEmitter(rect) { emitter = rect; },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); geo.dispose(); mat.dispose(); renderer.dispose(); },
  };
}
