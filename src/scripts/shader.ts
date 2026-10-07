// ヒーロー背景の WebGL シェーダー。マウス位置で流体のような模様が歪む。
// WebGL が使えない環境では何もせず、CSS のグラデーション背景がそのまま残る。

const VERTEX = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;
uniform float t;
uniform vec2 m;

float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), u.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * n(p); p *= 2.02; a *= .5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = (gl_FragCoord.xy - .5 * r) / r.y;
  vec2 mm = (m - .5) * vec2(r.x / r.y, 1.);
  float d = length(p - mm);

  vec2 q = vec2(fbm(p * 1.4 + t * .05), fbm(p * 1.4 + vec2(5.2, 1.3) - t * .04));
  vec2 w = vec2(fbm(p * 1.4 + 3. * q + vec2(1.7, 9.2) + t * .07), fbm(p * 1.4 + 3. * q + vec2(8.3, 2.8) - t * .06));
  float f = fbm(p * 1.4 + 3. * w + .8 * exp(-d * 3.));

  vec3 col = mix(vec3(.02, .02, .05), vec3(.22, .15, .82), smoothstep(.25, .75, f));
  col = mix(col, vec3(.95, .34, .3), smoothstep(.6, .98, length(q) * f * 1.1) * .85);
  col = mix(col, vec3(.36, .88, 1.), smoothstep(.74, 1., w.x) * .55);
  col += .2 * exp(-d * 4.) * vec3(.5, .8, 1.);
  col *= 1. - .5 * length(uv - .5);
  col += (h(gl_FragCoord.xy + fract(t)) - .5) * .04;
  gl_FragColor = vec4(col, 1.);
}`;

interface Options {
  /** ポインター位置（0〜1、左上原点）が更新されるたびに呼ばれる */
  onPointer?: (x: number, y: number) => void;
}

export function initShader(canvas: HTMLCanvasElement, { onPointer }: Options = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return;

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  // 画面全体を覆う大きな三角形
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'r');
  const uTime = gl.getUniformLocation(program, 't');
  const uMouse = gl.getUniformLocation(program, 'm');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = canvas.parentElement ?? canvas;
  // シェーダー座標は左下原点
  let target = [0.68, 0.55];
  const current = [...target];
  let raf = 0;
  let visible = true;

  host.addEventListener(
    'pointermove',
    (e) => {
      const b = host.getBoundingClientRect();
      target = [(e.clientX - b.left) / b.width, 1 - (e.clientY - b.top) / b.height];
    },
    { passive: true },
  );

  const draw = (time: number) => {
    current[0] += (target[0] - current[0]) * 0.06;
    current[1] += (target[1] - current[1]) * 0.06;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time / 1000);
    gl.uniform2f(uMouse, current[0], current[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    onPointer?.(current[0], 1 - current[1]);
  };

  const resize = () => {
    // スマホでは描画解像度を落として負荷を抑える
    const scale = Math.min(devicePixelRatio || 1, 1.5) * (innerWidth < 768 ? 0.6 : 1);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (reduce) draw(12000);
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  canvas.classList.add('is-ready');

  // 動きを減らす設定の人には静止画のまま
  if (reduce) return;

  const loop = (time: number) => {
    draw(time);
    raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const shouldRun = visible && !document.hidden;
    if (shouldRun && !raf) raf = requestAnimationFrame(loop);
    if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  // 画面外やタブが非表示のときは描画を止める
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(canvas);
  document.addEventListener('visibilitychange', sync);
  canvas.addEventListener('webglcontextlost', () => {
    visible = false;
    sync();
  });
}
