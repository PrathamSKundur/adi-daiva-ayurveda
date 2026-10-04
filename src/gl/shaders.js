// Fragment shaders; ShaderImage prepends the shared helpers.

// Phase 3.1 · Akasha: 2.5D depth on the clinic desk photo, washed towards parchment.
// Hand-authored depth field: desk front and desk-top objects near, shelves mid, wall far.
export const DESK_FRAG = /* glsl */ `
  uniform vec3 uCream;
  float blob(vec2 t, vec2 c, vec2 r) { vec2 d = (t - c) / r; return exp(-dot(d, d) * 2.0); }

  float depthAt(vec2 uv) {
    vec2 t = vec2(uv.x, 1.0 - uv.y);                          // top-left origin
    float desk = smoothstep(0.5, 0.86, t.y);                    // desk top → desk front
    float shelves = blob(t, vec2(0.16, 0.63), vec2(0.14, 0.07)) * 0.35 + blob(t, vec2(0.75, 0.6), vec2(0.06, 0.09)) * 0.35;
    float plant = blob(t, vec2(0.71, 0.74), vec2(0.07, 0.07)) * 0.3;   // the money plant
    float steth = blob(t, vec2(0.77, 0.71), vec2(0.06, 0.05)) * 0.25;  // stethoscope beside the plant
    float calendar = blob(t, vec2(0.26, 0.73), vec2(0.06, 0.07)) * 0.25;
    return clamp(desk + shelves + plant + steth + calendar, 0.0, 1.0);
  }

  void main() {
    vec2 uv = (coverUv(vUv) - 0.5) * 0.94 + 0.5;               // overscan hides displaced edges
    vec2 pull = (uMouse - 0.5) * vec2(-0.03, -0.018);
    uv += pull * (depthAt(uv) - 0.2);
    vec3 col = texture2D(uTex, uv).rgb;
    // washed, faded print: lift towards cream, soften contrast (as in the clinic flyer)
    float l = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(l), 0.25);
    col = mix(col, uCream, 0.42);
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Chapter 2 · Agni: heat shimmer over the kunda; the flame is the only light.
export const HOMA_FRAG = /* glsl */ `
  uniform vec3 uNight;

  float fireMask(vec3 c) {
    return smoothstep(0.05, 0.45, c.r - c.b) * smoothstep(0.45, 0.85, c.r);
  }

  void main() {
    // landscape canvas: fit the portrait photo by height and let night fill the sides
    float rs = uRes.x / uRes.y, ri = uImg.x / uImg.y;
    vec2 uv;
    if (rs > ri) {
      float scale = 1.08;
      uv = vec2((vUv.x - 0.5) * rs / ri / scale + 0.5, (vUv.y - 0.5) / scale + 0.47);
    } else {
      uv = coverUv(vUv);
    }
    float t = uTime;

    vec2 q = vec2(uv.x * 5.0, uv.y * 3.5 - t * 0.9);
    vec2 n = vec2(fbm(q), fbm(q + vec2(5.2, 1.3) + t * 0.15));
    float lowerThird = smoothstep(0.55, 0.05, uv.y);
    float heatBelow = fireMask(texture2D(uTex, clamp(uv - vec2(0.0, 0.05), 0.0, 1.0)).rgb);
    float nearHand = exp(-pow(distance(vUv, uMouse) * 4.0, 2.0)) * uHover;
    float strength = lowerThird * 0.9 + heatBelow * 0.6 + nearHand * 0.5;
    vec2 suv = clamp(uv + (n - 0.5) * 0.022 * strength, 0.0, 1.0);

    vec3 col = texture2D(uTex, suv).rgb;
    float fire = fireMask(col);
    col *= 1.0 + fire * (fbm(vec2(uv.x * 8.0, uv.y * 6.0 - t * 2.4)) - 0.45) * 0.45;

    // everything that is not flame falls into shadow
    vec3 shadow = col * vec3(0.4, 0.31, 0.26);
    col = mix(shadow, col * 1.06, clamp(fire * 1.25, 0.0, 1.0));

    // burn the photo's edges into the night
    float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    // an oval, like lamplight, rather than the photo's rectangle
    float oval = length((uv - vec2(0.5, 0.44)) * vec2(2.05, 1.18));
    float edge = smoothstep(1.0, 0.45, oval);
    vec2 p = vUv - 0.5; p.x *= rs;
    float vig = smoothstep(1.1, 0.25, length(p));
    // and always dissolve into the night at the top and bottom of the frame
    float frame = smoothstep(1.0, 0.8, vUv.y) * smoothstep(0.0, 0.1, vUv.y);
    float keep = inside * frame * max(edge * vig, fire * edge * edge);
    col = mix(uNight, col, keep);

    // ember light spilling into the dark, close to the flame only
    float glow = exp(-pow(length((vUv - vec2(0.5, 0.32)) * vec2(rs, 1.0)) * 2.2, 2.0));
    col += vec3(0.78, 0.31, 0.12) * glow * 0.14 * (0.75 + 0.25 * sin(t * 1.2566));
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Chapter 3 · Jala: warm oil that ripples under a cursor or finger and catches light.
export const OIL_FRAG = /* glsl */ `
  uniform vec2 uOilA;
  uniform vec2 uOilB;
  uniform float uOilR;

  void main() {
    vec2 uv = coverUv(vUv);
    float t = uTime;
    vec2 m = coverUv(uMouse);
    vec2 ia = vec2(uImg.x / uImg.y, 1.0);

    float oilA = smoothstep(uOilR, uOilR * 0.35, distance(uv * ia, uOilA * ia));
    float oilB = smoothstep(uOilR, uOilR * 0.35, distance(uv * ia, uOilB * ia));
    float oil = max(oilA, oilB);

    vec2 d = (uv - m) * ia;
    float dist = length(d);
    float wave = sin(dist * 90.0 - t * 5.0) * exp(-dist * 9.0) * uHover;
    float idle = sin(length((uv - uOilA) * ia) * 140.0 - t * 2.2) * oilA
               + sin(length((uv - uOilB) * ia) * 140.0 - t * 2.0) * oilB;
    float ripple = wave * mix(0.15, 1.0, oil) + idle * 0.35;

    vec2 disp = normalize(d + 1e-4) * ripple * 0.006 + vec2(0.0, idle * 0.0015);
    vec3 col = texture2D(uTex, uv + disp / ia).rgb;

    float crest = pow(max(ripple, 0.0), 3.0);
    float glint = exp(-pow(dist * 10.0, 2.0)) * uHover;
    col += vec3(1.0, 0.8, 0.5) * (crest * 0.45 + glint * 0.2) * oil;
    col = mix(col, col * vec3(1.1, 1.02, 0.86), oil * 0.45);
    gl_FragColor = vec4(col, 1.0);
  }
`;
