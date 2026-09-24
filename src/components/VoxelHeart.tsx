"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Açılış bölümünün arka planı: logodaki piksel kalp, voksellerden örülmüş
 * 3B bir nesne olarak. WebGL ile ızgara üzerinde ışın yürütülerek (DDA)
 * çiziliyor; her piksel en fazla ~48 hücreye bakıyor.
 *
 * Kaydırma ilerledikçe dört seviye:
 *  1. Kalp bloklardan kuruluyor, atıyor. Görüntü kaba (8-bit), renk az.
 *  2. Kalp dönüp derinliğini gösteriyor.
 *  3. Bloklar birbirinden ayrılıyor: yapı taşları.
 *  4. Kalp yeniden birleşiyor; çözünürlük ve renk derinliği en yüksekte.
 * Çözünürlük ve renk derinliği seviyeyle birlikte kademeli artıyor:
 * "8-bit'ten HD'ye" anlatısının görsel karşılığı.
 *
 * Kalbin şekli logonun kendisinden örneklendi (public/brand/mark.png,
 * 20×16 ızgara): "#" kırmızı gövde, "o" açık renkli çerçeve.
 *
 * Geri düşme: WebGL yoksa tuval kurulmaz, CSS degradesi görünür kalır.
 * Hareket azaltmada sahne tek kare çizilip durdurulur.
 */

const HEART = [
  "   ooooo    ooooo   ",
  "  oo#o#oo  oo#o#o   ",
  " oo#####oooo####ooo ",
  "oo#######oo####oo#oo",
  "oo###o########oo##oo",
  "oo###oo######ooo##oo",
  "oo####oo####oo#oo#oo",
  " oo########oo###ooo ",
  "  oo######oo####o   ",
  "   oo####oo####oo   ",
  "    oooooo####oo    ",
  "        o####oo     ",
  "        oo##oo      ",
  "        o##oo       ",
  "        oooo        ",
  "         oo         ",
];

const GRID_W = HEART[0].length;
const GRID_H = HEART.length;

/** Seviye başına piksel boyutu (CSS pikseli) ve renk kademesi */
const LEVELS = [
  { pixel: 7, colors: 12 },
  { pixel: 5, colors: 18 },
  { pixel: 3.2, colors: 30 },
  { pixel: 1.6, colors: 80 },
];

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uProg;
uniform float uIntro;
uniform float uColors;
uniform vec2  uPtr;
uniform sampler2D uMask;

const vec3 GRID = vec3(${GRID_W.toFixed(1)}, ${GRID_H.toFixed(1)}, 4.0);
const vec3 RED  = vec3(0.925, 0.122, 0.153);
const vec3 INK  = vec3(0.945, 0.925, 0.957);
const vec3 VOID = vec3(0.043, 0.039, 0.063);

float hash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

/* 4×4 Bayer eşiği: klasik sıralı titreme (ordered dithering) */
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }

/* 0 boş, 1 çerçeve (açık renk), 2 gövde (kırmızı) */
float cellType(vec3 c) {
  if (c.x < 0.0 || c.y < 0.0 || c.z < 0.0 ||
      c.x >= GRID.x || c.y >= GRID.y || c.z >= GRID.z) return 0.0;
  vec2 uv = (vec2(c.x, GRID.y - 1.0 - c.y) + 0.5) / GRID.xy;
  float m = texture2D(uMask, uv).r;
  if (m > 0.75) return 2.0;
  // Çerçeve bir kat içeride: kırmızı gövde kabartma gibi öne çıkıyor
  if (m > 0.3) return (c.z >= 1.0 && c.z <= 2.0) ? 1.0 : 0.0;
  return 0.0;
}

float cellScale(vec3 c) {
  float h = hash(c + 7.0);
  // Açılış: bloklar aşağıdan yukarı, hafif rastgele sırayla yerine oturuyor
  float order = (c.y / GRID.y) * 0.55 + h * 0.35;
  float intro = smoothstep(order, order + 0.16, uIntro);
  // 3. seviye: bloklar birbirinden ayrılıp yapı taşlarına dönüşüyor
  float apart = smoothstep(0.44, 0.6, uProg) * (1.0 - smoothstep(0.76, 0.9, uProg));
  float s = mix(1.0, 0.46 + 0.32 * h, apart);
  return s * intro;
}

bool boxHit(vec3 ro, vec3 rd, vec3 bmin, vec3 bmax, out float tN, out vec3 n) {
  vec3 inv = 1.0 / rd;
  vec3 t0 = (bmin - ro) * inv;
  vec3 t1 = (bmax - ro) * inv;
  vec3 tmin = min(t0, t1);
  vec3 tmax = max(t0, t1);
  tN = max(max(tmin.x, tmin.y), tmin.z);
  float tF = min(min(tmax.x, tmax.y), tmax.z);
  n = vec3(0.0);
  if (tF < max(tN, 0.0)) return false;
  if (tN == tmin.x) n.x = -sign(rd.x);
  else if (tN == tmin.y) n.y = -sign(rd.y);
  else n.z = -sign(rd.z);
  return true;
}

vec3 rotY(vec3 p, float a) {
  float c = cos(a), s = sin(a);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

vec3 rotX(vec3 p, float a) {
  float c = cos(a), s = sin(a);
  return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  /*
   * Geniş ekranda metin solda, kalp sağda. Telefonda metin alt yarıda,
   * kalp üstte ve biraz daha küçük.
   */
  float en = uRes.x / uRes.y;
  float narrow = 1.0 - smoothstep(0.75, 1.25, en);
  vec2 suv = uv;
  suv.x -= mix(0.47, 0.0, narrow);
  suv.y -= narrow * 0.25;

  // Zemin: gece, altta hafif mor ışık, kalbin arkasında kırmızı hale
  vec3 col = VOID + vec3(0.035, 0.028, 0.06) * smoothstep(0.6, -0.7, uv.y);
  float halo = exp(-dot(suv, suv) * 4.2);
  col += RED * halo * 0.16;

  // Piksel yıldızlar
  vec2 cell2 = floor(gl_FragCoord.xy);
  float star = step(0.9965, hash2(cell2));
  float tw = 0.5 + 0.5 * sin(uTime * 2.0 + hash2(cell2 + 3.1) * 40.0);
  col += vec3(0.75, 0.72, 0.85) * star * tw * (1.0 - halo) * 0.8;

  // Kalp atışı: "lub-dub"
  float ph = mod(uTime, 1.15);
  float beat = exp(-ph * 10.0) + 0.55 * exp(-max(ph - 0.24, 0.0) * 10.0) * step(0.24, ph);
  // Telefonda kalp ekran genişliğinin ~3/4'ü: başlığın üstünde, taşmadan
  float vs = 0.084 * (1.0 + 0.03 * beat * uIntro) * mix(1.0, 0.56, narrow);

  // Nesne dönüşü (ışına tersi uygulanıyor)
  // Seviye 2'de ~30° sağa, 3'te ~30° sola, 4'te yeniden önden; hiçbir
  // çapada tam yandan görünmüyor (yandan kalp ince bir şeride dönüşüyor).
  float yaw = 0.22 * sin(uTime * 0.35) + 0.62 * sin(uProg * 6.2831) + uPtr.x * 0.5;
  float pitch = 0.12 * sin(uTime * 0.27) + uPtr.y * 0.3 - 0.08;

  vec3 ro = vec3(0.0, 0.0, 4.6);
  vec3 rd = normalize(vec3(suv, -1.75));
  vec3 lro = rotX(rotY(ro, -yaw), -pitch);
  vec3 lrd = rotX(rotY(rd, -yaw), -pitch);
  lrd = sign(lrd) * max(abs(lrd), vec3(1e-5));

  // Dünya → ızgara uzayı
  vec3 gro = lro / vs + GRID * 0.5;
  vec3 grd = lrd;

  float tN;
  vec3 n;
  bool hit = false;
  float hitType = 0.0;
  vec3 hitN = vec3(0.0);
  vec3 hitQ = vec3(0.0);

  if (boxHit(gro, grd, vec3(0.0), GRID, tN, n)) {
    float t = max(tN, 0.0) + 1e-4;
    vec3 p = gro + grd * t;
    vec3 cell = clamp(floor(p), vec3(0.0), GRID - 1.0);
    vec3 stepv = sign(grd);
    vec3 tDelta = abs(1.0 / grd);
    vec3 tMax = (cell + max(stepv, 0.0) - gro) / grd;

    for (int i = 0; i < 48; i++) {
      float type = cellType(cell);
      if (type > 0.0) {
        float s = cellScale(cell);
        if (s > 0.02) {
          vec3 c = cell + 0.5;
          vec3 hs = vec3(0.5 * s);
          float th;
          vec3 nh;
          if (boxHit(gro, grd, c - hs, c + hs, th, nh)) {
            hit = true;
            hitType = type;
            hitN = nh;
            hitQ = (gro + grd * th - c) / max(s, 1e-3);
            break;
          }
        }
      }
      if (tMax.x < tMax.y && tMax.x < tMax.z) { cell.x += stepv.x; tMax.x += tDelta.x; }
      else if (tMax.y < tMax.z) { cell.y += stepv.y; tMax.y += tDelta.y; }
      else { cell.z += stepv.z; tMax.z += tDelta.z; }
      if (cell.x < 0.0 || cell.y < 0.0 || cell.z < 0.0 ||
          cell.x >= GRID.x || cell.y >= GRID.y || cell.z >= GRID.z) break;
    }
  }

  if (hit) {
    // Normali dünyaya geri çevir
    vec3 nw = rotY(rotX(hitN, pitch), yaw);
    vec3 L = normalize(vec3(-0.4, 0.6, 0.85));
    float dif = max(dot(nw, L), 0.0);
    // Kameraya bakan yüz en parlak: kalp önden logonun rengini koruyor
    float front = max(nw.z, 0.0);
    vec3 base = hitType > 1.5 ? RED : INK;
    vec3 sh = base * (0.3 + 0.45 * dif + 0.35 * front);
    // Arka kenar ışığı: kırmızı zeminde siluet okunsun
    float rim = pow(1.0 - max(dot(nw, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    sh += vec3(0.55, 0.35, 0.75) * rim * 0.22;

    // Blok kenarı: yüzün kenarına yakın pikseller koyulaşıyor (piksel çizgi)
    vec3 aq = abs(hitQ);
    vec3 mask = 1.0 - abs(hitN);
    float edge = max(max(aq.x * mask.x, aq.y * mask.y), aq.z * mask.z);
    sh *= mix(1.0, 0.62, step(0.41, edge));
    col = sh;
  }

  // Kenar kararması
  col *= 1.0 - 0.28 * dot(uv * vec2(0.8, 1.0), uv * vec2(0.8, 1.0));

  // Renk derinliği: seviyeye göre kademeli, Bayer titremesiyle
  float d = bayer4(gl_FragCoord.xy) - 0.5;
  col = floor(col * uColors + d + 0.5) / uColors;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("VoxelHeart shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function maskData(): Uint8Array {
  const data = new Uint8Array(GRID_W * GRID_H);
  HEART.forEach((row, y) => {
    for (let x = 0; x < GRID_W; x++) {
      const ch = row[x];
      data[y * GRID_W + x] = ch === "#" ? 255 : ch === "o" ? 128 : 0;
    }
  });
  return data;
}

/**
 * İlerlemeye göre seviye (0–3). Paneller 0, 1/3, 2/3 ve 1'de duruyor;
 * seviye iki panelin tam ortasında değişiyor, yani hangi panel okunuyorsa
 * sahne de onun seviyesinde.
 */
export function levelFor(progress: number): number {
  const last = LEVELS.length - 1;
  return Math.min(last, Math.max(0, Math.round(progress * last)));
}

export function VoxelHeart({
  progressRef,
}: {
  /** 0–1 arası kaydırma ilerlemesi; sahne buna doğru yumuşayarak gider. */
  progressRef: RefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl || gl.isContextLost()) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Kalp maskesi: 20×16 tek kanallı doku, en yakın komşu örnekleme
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, GRID_W, GRID_H, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, maskData());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uProg = u("uProg");
    const uIntro = u("uIntro");
    const uColors = u("uColors");
    const uPtr = u("uPtr");
    gl.uniform1i(u("uMask"), 0);

    let width = 0;
    let height = 0;
    let level = -1;

    /*
     * Tuval ekran çözünürlüğünde değil, seviyenin piksel boyutunda çiziliyor;
     * CSS (image-rendering: pixelated) keskin biçimde büyütüyor. Kaba
     * seviyeler bu yüzden hem daha "8-bit" hem de çok daha ucuz.
     */
    const resize = (nextLevel: number) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Dar ekranda kalp küçük; aynı piksel boyutu orada fazla kaba kalıyor
      const pixel = LEVELS[nextLevel].pixel * (rect.width < 768 ? 0.6 : 1);
      const w = Math.max(1, Math.round(rect.width / pixel));
      const h = Math.max(1, Math.round(rect.height / pixel));
      if (w === width && h === height && nextLevel === level) return;
      width = w;
      height = h;
      level = nextLevel;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uColors, LEVELS[nextLevel].colors);
    };

    let ptrX = 0;
    let ptrY = 0;
    let sx = 0;
    let sy = 0;
    const onPointer = (event: PointerEvent) => {
      ptrX = event.clientX / window.innerWidth - 0.5;
      ptrY = event.clientY / window.innerHeight - 0.5;
    };

    let shown = progressRef.current ?? 0;
    let frame = 0;
    let running = false;
    const start = performance.now();

    const draw = (now: number, intro: number) => {
      const target = Math.min(1, Math.max(0, progressRef.current ?? 0));
      const diff = target - shown;
      shown += Math.abs(diff) > 0.3 ? diff : diff * 0.1;
      sx += (ptrX - sx) * 0.06;
      sy += (ptrY - sy) * 0.06;

      resize(levelFor(target));
      gl.uniform1f(uProg, shown);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uIntro, intro);
      gl.uniform2f(uPtr, sx, sy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const render = (now: number) => {
      frame = 0;
      const rect = canvas.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      draw(now, Math.min(1.2, (now - start) / 1700));
      frame = requestAnimationFrame(render);
    };

    const kick = () => {
      if (running || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(render);
    };

    /*
     * Temizlikte bağlam kapatılmıyor (loseContext yok): React geliştirme
     * modunda efekti iki kez çalıştırıyor ve aynı tuvalde kapatılmış bağlam
     * geri geliyor; sahne beyaz kalıyordu. Kaynaklar serbest bırakılıyor,
     * bağlamın kendisi tuvalle birlikte gidiyor.
     */
    const release = () => {
      canvas.classList.remove("is-live");
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };

    canvas.classList.add("is-live");

    if (reduced) {
      // Tek kare: kalp kurulmuş, hareketsiz
      shown = 0;
      draw(start + 400, 1.2);
      const onResize = () => {
        width = 0;
        draw(start + 400, 1.2);
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        release();
      };
    }

    // İlk kare her durumda çizilir: sekme arka planda açılsa da tuval boş
    // kalmasın; döngü sekme görünür olunca başlar.
    draw(performance.now(), 0);
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", kick);

    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", kick);
      if (frame) cancelAnimationFrame(frame);
      release();
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="story-canvas" aria-hidden="true" />;
}
