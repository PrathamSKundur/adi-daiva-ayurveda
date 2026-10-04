// Phase 2 · Pancha Mahabhuta: one particle field that morphs through the five
// tattva yantras as the visitor scrolls (progress 0 → 4).
//   Akasha: circle / sphere · Vayu: hexagram · Agni: upward triangle · Jala: crescent · Prithvi: square
import * as THREE from 'three';
import { MAX_DPR } from '../lib/env';

const R = Math.random;
const dir = () => { const u = R() * 2 - 1, a = R() * Math.PI * 2, s = Math.sqrt(1 - u * u); return [s * Math.cos(a), u, s * Math.sin(a)]; };

function akasha(n) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const [x, y, z] = dir();
    const r = i < n * 0.78 ? 1.6 * (1 + (R() - 0.5) * 0.05) : 2.3 + R() * 2.4; // shell + distant stars
    out.set([x * r, y * r, z * r], i * 3);
  }
  return out;
}

function vayu(n) {
  const out = new Float32Array(n * 3);
  const Rr = 1.75;
  const tri = (a0) => [0, 1, 2].map((k) => { const a = a0 + (k * Math.PI * 2) / 3; return [Math.cos(a) * Rr, Math.sin(a) * Rr]; });
  const T = [tri(Math.PI / 2), tri(-Math.PI / 2)];
  for (let i = 0; i < n; i++) {
    let x, y;
    if (i < n * 0.82) {
      const t = T[i % 2], e = (R() * 3) | 0, a = t[e], b = t[(e + 1) % 3], k = R();
      x = a[0] + (b[0] - a[0]) * k + (R() - 0.5) * 0.12;
      y = a[1] + (b[1] - a[1]) * k + (R() - 0.5) * 0.12;
    } else {
      const a = R() * Math.PI * 2, r = 2.05 + (R() - 0.5) * 0.12; // the enclosing circle of the yantra
      x = Math.cos(a) * r; y = Math.sin(a) * r;
    }
    out.set([x, y, (R() - 0.5) * 0.5], i * 3);
  }
  return out;
}

function agni(n) {
  // a tetrahedron: the upward triangle given depth, apex like a flame
  const out = new Float32Array(n * 3);
  const top = [0, 1.9, 0];
  const base = [0, 1, 2].map((k) => { const a = Math.PI / 2 + (k * Math.PI * 2) / 3; return [Math.cos(a) * 1.75, -1.25, Math.sin(a) * 1.75 * 0.55]; });
  const faces = [[top, base[0], base[1]], [top, base[1], base[2]], [top, base[2], base[0]], [base[0], base[1], base[2]]];
  for (let i = 0; i < n; i++) {
    let u = R(), v = R();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const [a, b, c] = faces[i < n * 0.9 ? (R() * 3) | 0 : 3];
    const p = [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * u + (c[k] - a[k]) * v);
    const s = i < n * 0.75 ? 1 : 0.4 + R() * 0.6; // some particles fill the inside
    out.set([p[0] * s, (p[1] - 0.3) * s + 0.3, p[2] * s], i * 3);
  }
  return out;
}

function jala(n) {
  // a crescent, horns upward: inside the large circle, outside the raised small one
  const out = new Float32Array(n * 3);
  let i = 0;
  while (i < n) {
    const x = (R() * 2 - 1) * 2, y = R() * 2.8 - 2;
    const inBig = x * x + y * y < 1.85 * 1.85;
    const inSmall = x * x + (y - 0.62) * (y - 0.62) < 1.6 * 1.6;
    if (!inBig || inSmall || y > 0.9) continue;
    out.set([x, y + 0.45, (R() - 0.5) * 0.7], i * 3);
    i++;
  }
  return out;
}

function prithvi(n) {
  const out = new Float32Array(n * 3);
  const s = 1.35;
  for (let i = 0; i < n; i++) {
    let p;
    if (i < n * 0.55) {
      // the twelve edges
      const e = (R() * 12) | 0, axis = e % 3, c1 = e & 4 ? s : -s, c2 = e & 8 ? s : -s, t = (R() * 2 - 1) * s;
      p = axis === 0 ? [t, c1, c2] : axis === 1 ? [c1, t, c2] : [c1, c2, t];
      p = p.map((v) => v + (R() - 0.5) * 0.05);
    } else {
      const f = (R() * 6) | 0, a = (R() * 2 - 1) * s, b = (R() * 2 - 1) * s, side = f & 1 ? s : -s;
      p = f < 2 ? [side, a, b] : f < 4 ? [a, side, b] : [a, b, side];
    }
    out.set(p, i * 3);
  }
  return out;
}

const VERT = /* glsl */ `
  attribute vec3 aP0; attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3; attribute vec3 aP4;
  attribute float aRand;
  uniform float uProg; uniform float uTime; uniform float uPix;
  uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uC4;
  varying vec3 vCol; varying float vA;

  vec3 P(int i) { if (i == 0) return aP0; if (i == 1) return aP1; if (i == 2) return aP2; if (i == 3) return aP3; return aP4; }
  vec3 C(int i) { if (i == 0) return uC0; if (i == 1) return uC1; if (i == 2) return uC2; if (i == 3) return uC3; return uC4; }
  float w(float k) { return clamp(1.0 - abs(uProg - k), 0.0, 1.0); }

  void main() {
    float pr = clamp(uProg, 0.0, 4.0);
    int i = int(min(floor(pr), 3.0));
    float f = pr - float(i);
    // every particle leaves at its own moment, so the form dissolves rather than slides
    float t = smoothstep(0.0, 1.0, clamp((f - aRand * 0.35) / 0.65, 0.0, 1.0));
    vec3 p = mix(P(i), P(i + 1), t);

    // between forms the particles scatter like released breath
    float burst = sin(t * 3.14159);
    p += normalize(p + 0.0001) * burst * (0.35 + aRand * 0.6);
    p += vec3(sin(aRand * 40.0 + uTime), cos(aRand * 23.0 + uTime * 1.3), sin(aRand * 11.0 + uTime * 0.7)) * burst * 0.22;

    // each element's own life
    float breath = sin(uTime * 1.2566 + aRand * 6.2832);                  // one 5 s breath
    p *= 1.0 + w(0.0) * 0.035 * breath;                                    // Akasha: space expands and settles
    float ang = w(1.0) * (uTime * 0.35 + aRand * 0.25);                   // Vayu: the air keeps turning
    p.xy = mat2(cos(ang), sin(ang), -sin(ang), cos(ang)) * p.xy;
    p.y += w(2.0) * (fract(uTime * 0.22 + aRand) * 0.22 + sin(uTime * 5.0 + aRand * 30.0) * 0.025); // Agni flickers up
    p.y += w(3.0) * sin(p.x * 2.4 + uTime * 1.4) * 0.07;                  // Jala ripples
    p.z += w(3.0) * cos(p.x * 1.7 + uTime) * 0.05;
                                                                           // Prithvi: stillness
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPix * (0.55 + aRand * 1.1) * (5.0 / -mv.z);
    vCol = mix(C(i), C(i + 1), t);
    vA = 0.45 + 0.55 * aRand;
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vCol; varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA;
    gl_FragColor = vec4(vCol * a, a);
  }
`;

// tattva colours, tuned to glow on the night-forest ground
export const ELEMENT_COLORS = ['#C9C2F0', '#A8D5C8', '#FF8A3D', '#BFE0F0', '#E3C77E'];

export function createElementsScene(canvas, { count }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  const geo = new THREE.BufferGeometry();
  const shapes = [akasha, vayu, agni, jala, prithvi].map((fn) => fn(count));
  geo.setAttribute('position', new THREE.BufferAttribute(shapes[0], 3));
  shapes.forEach((s, k) => geo.setAttribute(`aP${k}`, new THREE.BufferAttribute(s, 3)));
  geo.setAttribute('aRand', new THREE.BufferAttribute(Float32Array.from({ length: count }, R), 1));

  const uniforms = {
    uProg: { value: 0 }, uTime: { value: 0 }, uPix: { value: (count < 10000 ? 4.2 : 3.1) * Math.min(window.devicePixelRatio, MAX_DPR) },
  };
  ELEMENT_COLORS.forEach((c, k) => { uniforms[`uC${k}`] = { value: new THREE.Color(c) }; });
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, uniforms,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  let target = 0, mx = 0, my = 0, visible = true, raf;
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // landscape: symbol sits right of the text; portrait: above it, further away
    const portrait = width / height < 0.8;
    camera.position.z = portrait ? 12 : 7.2;
    points.position.set(portrait ? 0 : width / height > 1.1 ? 1.5 : 0, portrait ? 1.6 : 0, 0);
    points.scale.setScalar(portrait ? 1 : 0.86);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);
  const onMove = (e) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
  window.addEventListener('pointermove', onMove);

  const clock = new THREE.Clock();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uProg.value += (target - uniforms.uProg.value) * 0.08;
    // the symbols are mostly flat yantras: turn gently, never edge-on
    points.rotation.y += ((Math.sin(t * 0.3) * 0.45 + mx * 0.5) - points.rotation.y) * 0.05;
    points.rotation.x += ((my * 0.3 + (uniforms.uProg.value > 3.5 ? -0.35 : 0)) - points.rotation.x) * 0.05;
    renderer.render(scene, camera);
  };
  loop();

  return {
    setProgress(p) { target = p; },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
