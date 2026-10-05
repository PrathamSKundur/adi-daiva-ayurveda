// Phase 3.5 · a minimalist anatomical figure in forest-green wireframe.
// The body is one smooth signed-distance sculpture (blended head, torso, tapered
// limbs), meshed once with marching cubes and drawn as surface contour lines.
import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { MAX_DPR } from '../lib/env';

// --- signed distance helpers (body space: y up, about -0.92 … 0.92) ---
const len = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
function ellipsoid(px, py, pz, c, r) {
  const qx = (px - c[0]) / r[0], qy = (py - c[1]) / r[1], qz = (pz - c[2]) / r[2];
  const k0 = len(qx, qy, qz), k1 = len(qx / r[0], qy / r[1], qz / r[2]);
  return (k0 * (k0 - 1)) / (k1 || 1e-6);
}
function limb(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2];
  const ax = px - a[0], ay = py - a[1], az = pz - a[2];
  const h = Math.max(0, Math.min(1, (ax * bx + ay * by + az * bz) / (bx * bx + by * by + bz * bz)));
  return len(ax - bx * h, ay - by * h, az - bz * h) - (ra + (rb - ra) * h);
}
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };

function bodySDF(x, y, z) {
  const ax = Math.abs(x); // the body is symmetric
  // head: skull plus a tapered jaw, a little forward of the spine
  let d = ellipsoid(x, y, z, [0, 0.81, 0.008], [0.082, 0.106, 0.093]);
  d = smin(d, ellipsoid(x, y, z, [0, 0.752, 0.028], [0.058, 0.066, 0.066]), 0.035);
  d = smin(d, limb(x, y, z, [0, 0.705, -0.004], [0, 0.63, -0.006], 0.04, 0.046), 0.04); // neck
  // torso: chest, waist and hips with a real taper between them
  let t = ellipsoid(x, y, z, [0, 0.485, 0], [0.158, 0.15, 0.088]); // ribcage
  t = smin(t, ellipsoid(x, y, z, [0, 0.31, 0.002], [0.118, 0.12, 0.074]), 0.08); // waist
  t = smin(t, ellipsoid(x, y, z, [0, 0.13, -0.004], [0.148, 0.105, 0.092]), 0.07); // hips
  t = smin(t, ellipsoid(ax, y, z, [0.1, 0.645, -0.006], [0.095, 0.038, 0.06]), 0.06); // trapezius slope
  t = smin(t, ellipsoid(ax, y, z, [0.2, 0.595, 0], [0.05, 0.056, 0.052]), 0.05); // shoulder
  d = smin(d, t, 0.05);
  // arms hang slightly clear of the body
  let l = limb(ax, y, z, [0.205, 0.595, 0], [0.24, 0.37, 0.004], 0.043, 0.034); // upper arm
  l = smin(l, limb(ax, y, z, [0.24, 0.37, 0.004], [0.275, 0.13, 0.022], 0.034, 0.024), 0.025); // forearm
  l = smin(l, ellipsoid(ax, y, z, [0.288, 0.065, 0.026], [0.02, 0.05, 0.015]), 0.02); // hand
  // legs: full thigh, defined knee, calf bulge, narrow ankle
  l = smin(l, limb(ax, y, z, [0.088, 0.07, 0], [0.092, -0.4, 0.006], 0.071, 0.045), 0.03); // thigh
  l = smin(l, ellipsoid(ax, y, z, [0.092, -0.405, 0.012], [0.046, 0.05, 0.05]), 0.03); // knee
  l = smin(l, limb(ax, y, z, [0.092, -0.42, 0.004], [0.086, -0.84, -0.01], 0.043, 0.026), 0.025); // shin
  l = smin(l, ellipsoid(ax, y, z, [0.092, -0.56, -0.016], [0.042, 0.1, 0.048]), 0.04); // calf
  l = smin(l, limb(ax, y, z, [0.086, -0.865, -0.012], [0.094, -0.895, 0.08], 0.028, 0.022), 0.02); // foot
  return smin(d, l, 0.035);
}

const VERT = /* glsl */ `
  varying vec3 vPos; varying vec3 vN; varying vec3 vView;
  void main() {
    vPos = position;
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vPos; varying vec3 vN; varying vec3 vView;
  float grid(float v, float density) {
    float x = v * density;
    return 1.0 - clamp(abs(fract(x - 0.5) - 0.5) / fwidth(x), 0.0, 1.0);
  }
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vView))), 2.2);
    float rings = grid(vPos.y, 48.0);                        // horizontal contours, like an anatomical scan
    float slices = grid(vPos.x, 30.0) * 0.55;                // vertical meridians
    float scanY = mod(uTime * 0.18, 2.4) - 1.2;              // a slow gold scan passes over the body
    float scan = smoothstep(0.035, 0.0, abs(vPos.y - scanY));
    vec3 forest = vec3(0.106, 0.263, 0.196);
    vec3 gold = vec3(0.83, 0.69, 0.22);
    float a = 0.05 + fres * 0.55 + max(rings, slices) * 0.6 + scan * 0.5;
    gl_FragColor = vec4(mix(forest, gold, scan * 0.85), clamp(a, 0.0, 0.95));
  }
`;

export function createBodyScene(canvas, { hotspots, resolution, onFrame }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.05, 4.3);

  const uniforms = { uTime: { value: 0 } };
  const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: true });

  // build the surface once
  const mc = new MarchingCubes(resolution, material, false, false, 160000);
  mc.isolation = 0;
  mc.reset();
  const n = mc.size, half = n / 2;
  for (let zi = 0; zi < n; zi++) {
    const z = (zi - half) / half;
    if (Math.abs(z) > 0.2) continue; // nothing of the body lives out here
    for (let yi = 0; yi < n; yi++) {
      const y = (yi - half) / half;
      for (let xi = 0; xi < n; xi++) {
        const x = (xi - half) / half;
        if (Math.abs(x) > 0.36) continue;
        mc.field[zi * n * n + yi * n + xi] = -bodySDF(x, y, z) * 40;
      }
    }
  }
  // cells we skipped stay "outside"
  for (let i = 0; i < mc.field.length; i++) if (mc.field[i] === 0) mc.field[i] = -10;
  mc.update();
  mc.frustumCulled = false; // bounds are not computed by MarchingCubes

  const body = new THREE.Group();
  body.add(mc);
  scene.add(body);

  // hotspots: small gold beads with a halo
  const beadGeo = new THREE.SphereGeometry(0.022, 16, 16);
  const beads = hotspots.map((h) => {
    const m = new THREE.Mesh(beadGeo, new THREE.MeshBasicMaterial({ color: 0xc5a059, transparent: true, depthTest: false }));
    m.position.set(...h.pos);
    m.userData.key = h.key;
    m.renderOrder = 2;
    body.add(m);
    return m;
  });

  let w = 1, h = 1, raf, visible = true, active = null;
  const spin = { a: 0.5, v: 0, dragging: false };
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width || 1; h = r.height || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 0.62 ? 5.0 : 4.1;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);

  const v = new THREE.Vector3();
  const clock = new THREE.Clock();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    uniforms.uTime.value = t;
    spin.v *= 0.93;
    spin.a += spin.v + (spin.dragging ? 0 : dt * 0.35); // the model rotates
    body.rotation.y = spin.a;
    body.position.y = Math.sin((t * Math.PI * 2) / 5) * 0.008; // breathing, 5 s
    const out = beads.map((b) => {
      const k = b.userData.key;
      const s = (k === active ? 1.9 : 1) * (1 + Math.sin((t * Math.PI * 2) / 5) * 0.15);
      b.scale.setScalar(s);
      b.material.color.set(k === active ? 0xe3c77e : 0xc5a059);
      b.getWorldPosition(v);
      const facing = v.z > -0.02; // in front of the body's centre
      b.material.opacity = facing ? 1 : 0.25;
      v.project(camera);
      return { key: k, x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, facing };
    });
    onFrame?.(out);
    renderer.render(scene, camera);
  };
  loop();

  return {
    setActive(k) { active = k; },
    drag: spin,
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      mc.geometry.dispose(); material.dispose(); beadGeo.dispose(); beads.forEach((b) => b.material.dispose()); renderer.dispose();
    },
  };
}
