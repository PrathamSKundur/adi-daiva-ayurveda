import { useEffect, useRef } from 'react';
import { lowPower, MAX_DPR } from '../lib/env';

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

// Shared helpers prepended to every fragment shader.
const COMMON = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uImg;
  uniform vec2 uFocus;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;

  // object-fit: cover with a focal point
  vec2 coverUv(vec2 uv) {
    float rs = uRes.x / uRes.y, ri = uImg.x / uImg.y;
    vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
    return (uv - 0.5) * s + 0.5 + (uFocus - 0.5) * (1.0 - s);
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`;

/**
 * An image rendered through a fragment shader. The plain <img> (children) is
 * always rendered underneath, so the picture is visible immediately and stays
 * as the fallback on low-power devices or if WebGL fails.
 *
 * Pointer (mouse or finger) position arrives as uMouse in canvas uv, y up.
 */
export default function ShaderImage({
  texture,
  fragment,
  focus = [0.5, 0.5],
  uniforms: extra = {},
  className = '',
  pointerTarget,
  mouseEase = 0.08,
  mouseRef,
  children,
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (lowPower) return undefined;
    let cleanup = () => {};
    let cancelled = false;
    // three.js and the texture are fetched only once the page has finished loading
    // and this image is near the viewport, so they never compete with the first paint
    const afterLoad = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })))
      .then(() => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 1500 }) : setTimeout(r, 300))));
    const nearView = new Promise((r) => {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); r(); } }, { rootMargin: '500px 0px' });
      io.observe(wrapRef.current);
      cleanup = () => io.disconnect();
    });
    Promise.all([afterLoad, nearView])
      .then(() => import('three'))
      .then((THREE) => { if (!cancelled) cleanup = start(THREE) || cleanup; });
    return () => { cancelled = true; cleanup(); };

    function start(THREE) {
    const wrap = wrapRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
    renderer.domElement.className = 'shader-canvas';
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTex: { value: null },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImg: { value: new THREE.Vector2(1, 1) },
      uFocus: { value: new THREE.Vector2(...focus) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
    };
    // plain arrays become vectors, so callers don't need to import three.js
    const toUniform = (v) => (Array.isArray(v) ? (v.length === 3 ? new THREE.Vector3(...v) : new THREE.Vector2(...v)) : v);
    for (const [k, v] of Object.entries(extra)) uniforms[k] = { value: toUniform(v) };

    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: COMMON + fragment, uniforms });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let ready = false;
    new THREE.TextureLoader().load(texture, (tex) => {
      // raw sRGB in, raw sRGB out: shaders grade in display space so colours match the CSS around them
      tex.colorSpace = THREE.NoColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      uniforms.uTex.value = tex;
      uniforms.uImg.value.set(tex.image.width, tex.image.height);
      ready = true;
      // first frame before revealing, so there is no flash
      renderer.render(scene, camera);
      wrap.classList.add('gl-ready');
    });

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      uniforms.uRes.value.set(width, height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const target = pointerTarget?.current || wrap;
    const mouse = new THREE.Vector2(0.5, 0.5);
    let hoverTarget = 0;
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      mouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      hoverTarget = 1;
    };
    const onLeave = (e) => { if (e.pointerType === 'mouse') hoverTarget = 0; };
    const onUp = (e) => { if (e.pointerType !== 'mouse') setTimeout(() => { hoverTarget = 0; }, 900); };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerdown', onMove);
    target.addEventListener('pointerleave', onLeave);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);

    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '80px' });
    io.observe(wrap);

    const clock = new THREE.Clock();
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || !ready) return;
      uniforms.uTime.value = clock.getElapsedTime();
      // an external source (e.g. scroll on touch devices) can drive the pointer instead
      if (mouseRef?.current) mouse.set(mouseRef.current.x, mouseRef.current.y);
      uniforms.uMouse.value.lerp(mouse, mouseEase);
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.05;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerdown', onMove);
      target.removeEventListener('pointerleave', onLeave);
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointercancel', onUp);
      uniforms.uTex.value?.dispose();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      wrap.classList.remove('gl-ready');
    };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texture, fragment]);

  return (
    <div ref={wrapRef} className={`shader-image ${className}`}>
      {children}
    </div>
  );
}
