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
 * Seviyeyle birlikte görüntü hafifçe keskinleşiyor, zemindeki renk
 * derinliği artıyor; kalbin kendisi her seviyede net.
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

/**
 * Seviye başına piksel boyutu (cihaz pikseli) ve zemindeki renk kademesi.
 *
 * Kalbin kendisi zaten piksel sanatı: her voksel bir piksel. Önceden tuval
 * ekranın 1/7'si ile 1/1,6'sı arasında çiziliyordu ve Retina ekranda en net
 * seviye bile bulanık kalıyordu. Artık cihaz çözünürlüğüne yakın çiziliyor;
 * seviye atlama yalnızca hafif bir keskinleşme olarak hissediliyor.
 */
const LEVELS = [
  { pixel: 2, colors: 24 },
  { pixel: 1.5, colors: 36 },
  { pixel: 1.25, colors: 64 },
  { pixel: 1, colors: 128 },
];

/** Tuvalin en fazla piksel sayısı: ızgara yürütme piksel başına pahalı */
const MAX_PIXELS_DESKTOP = 2_600_000;
const MAX_PIXELS_MOBILE = 900_000;

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
uniform float uNarrow;
uniform sampler2D uMask;
uniform vec3  uBg;
uniform vec3  uFrame;
uniform vec3  uStar;
uniform vec3  uTint;
uniform float uGlow;
uniform float uVig;
uniform float uScale;
uniform vec3  uGridCol;
uniform float uGridA;

const vec3 GRID = vec3(${GRID_W.toFixed(1)}, ${GRID_H.toFixed(1)}, 4.0);
const vec3 RED  = vec3(0.925, 0.122, 0.153);

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
   * Geniş ekranda (≥1024px) metin solda, kalp sağda: kalp ekran
   * genişliğinin ~%36'sını kaplıyor ve sağ kenara yaslanıyor, böylece
   * 1024px'lik bir ekranda da başlığa binmiyor. Daha dar ekranlarda metin
   * alt yarıda, kalp üstte ve ekran genişliğinin ~%75'i kadar.
   *
   * 7.6: kalbin genişliği (20 voksel) ile izdüşüm katsayısının çarpımı;
   * voksel boyutu × 7.6 = ekrandaki genişlik (uv birimi).
   */
  float en = uRes.x / uRes.y;
  float narrow = uNarrow;
  float halfW = 0.5 * en;
  float vsWide = clamp(en * 0.36 / 7.6, 0.05, 0.084);
  // Dar ama yatay ekranda (küçük tablet, yatay telefon) yükseklik kısıtlı:
  // kalp biraz küçülüp yukarı çıkıyor ki başlığa değmesin.
  float landscape = step(1.0, en);
  float vsNarrow = clamp(en * 0.75 / 7.6, 0.03, 0.047) * mix(1.0, 0.8, landscape);
  float vsBase = mix(vsWide, vsNarrow, narrow);
  vec2 suv = uv;
  suv.x -= mix(halfW - 3.8 * vsWide - 0.06 * halfW, 0.0, narrow);
  suv.y -= narrow * mix(0.25, 0.3, landscape);

  // Zemin: gece, altta hafif mor ışık, kalbin arkasında kırmızı hale
  vec3 col = uBg + uTint * smoothstep(0.6, -0.7, uv.y);
  float halo = exp(-dot(suv, suv) * 4.2);
  col += RED * halo * uGlow;

  // Piksel yıldızlar: çözünürlükten bağımsız, ekran yüksekliğine göre
  // sabit bir ızgarada (~200 satır); her yıldız birkaç piksellik bir blok.
  vec2 cell2 = floor(gl_FragCoord.xy / (uRes.y / 200.0));
  float star = step(0.9965, hash2(cell2));
  float tw = 0.5 + 0.5 * sin(uTime * 2.0 + hash2(cell2 + 3.1) * 40.0);
  col = mix(col, uStar, star * tw * (1.0 - halo) * 0.8);

  // Kalp atışı: "lub-dub"
  float ph = mod(uTime, 1.15);
  float beat = exp(-ph * 10.0) + 0.55 * exp(-max(ph - 0.24, 0.0) * 10.0) * step(0.24, ph);
  float vs = vsBase * (1.0 + 0.03 * beat * uIntro);

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
    vec3 base = hitType > 1.5 ? RED : uFrame;
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
  col *= 1.0 - uVig * dot(uv * vec2(0.8, 1.0), uv * vec2(0.8, 1.0));

  /*
   * Seviye editörü ızgarası: sayfanın zemindeki ızgarayla aynı (48px karo,
   * her 4 karede bir +). CSS pikseline göre, tuvalin çözünürlüğünden
   * bağımsız; çizgi en az 1 tuval pikseli kalınlığında.
   */
  if (!hit) {
    vec2 css = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
    float lw = max(1.0, 1.0 / uScale);
    vec2 cell = mod(css, 48.0);
    float line = step(cell.x, lw) + step(cell.y, lw);
    vec2 q = mod(css + 96.0, 192.0) - 96.0;
    float plus = step(abs(q.y), 0.5 * lw + 0.5) * step(abs(q.x), 5.5)
               + step(abs(q.x), 0.5 * lw + 0.5) * step(abs(q.y), 5.5);
    col = mix(col, uGridCol, clamp(line, 0.0, 1.0) * uGridA);
    col = mix(col, uGridCol, clamp(plus, 0.0, 1.0) * uGridA * 4.5);
  }

  // Renk derinliği: yalnızca zeminde, Bayer titremesiyle (retro doku).
  // Kalbin yüzleri titremesiz: düz, net renk bloklar.
  if (!hit) {
    float d = bayer4(gl_FragCoord.xy) - 0.5;
    col = floor(col * uColors + d + 0.5) / uColors;
  }

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

type RGB = [number, number, number];

/** "#a1b2c3" → [0..1, 0..1, 0..1]. Beklenmedik biçimde siyaha düşer. */
function hexToRgb(value: string): RGB {
  const hex = value.trim().replace("#", "");
  if (hex.length !== 6) return [0, 0, 0];
  const n = parseInt(hex, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
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
    const uNarrow = u("uNarrow");
    const uBg = u("uBg");
    const uFrame = u("uFrame");
    const uStar = u("uStar");
    const uTint = u("uTint");
    const uGlow = u("uGlow");
    const uVig = u("uVig");
    const uScale = u("uScale");
    const uGridCol = u("uGridCol");
    const uGridA = u("uGridA");

    /*
     * Renkler CSS tokenlarından (--void, --scene-frame, --scene-star).
     * Gündüzde zemin açık, çerçeve vokselleri koyu: kalp logonun orijinal
     * renkleriyle görünüyor. Açık zeminde kenar kararması ve kırmızı hale
     * hafifletiliyor, yoksa zemin grileşiyordu.
     */
    const readPalette = () => {
      const style = getComputedStyle(document.documentElement);
      const bg = hexToRgb(style.getPropertyValue("--void"));
      const light = (bg[0] + bg[1] + bg[2]) / 3 > 0.5;
      gl.uniform3fv(uBg, bg);
      gl.uniform3fv(uFrame, hexToRgb(style.getPropertyValue("--scene-frame")));
      gl.uniform3fv(uStar, hexToRgb(style.getPropertyValue("--scene-star")));
      gl.uniform3fv(uTint, light ? [-0.03, -0.03, -0.018] : [0.035, 0.028, 0.06]);
      gl.uniform1f(uGlow, light ? 0.07 : 0.16);
      gl.uniform1f(uVig, light ? 0.08 : 0.28);
      // Izgara: sayfa zeminindekiyle aynı renk ve yoğunluk (--grid-line)
      gl.uniform3fv(uGridCol, hexToRgb(style.getPropertyValue("--ink")));
      gl.uniform1f(uGridA, light ? 0.075 : 0.06);
    };
    gl.uniform1i(u("uMask"), 0);

    let width = 0;
    let height = 0;
    let level = -1;
    let cssW = 0;
    let cssH = 0;
    // Dokunmatik cihaz: adres çubuğu yalnızca yüksekliği oynatıyor
    const touch = window.matchMedia("(pointer: coarse)").matches;

    /*
     * Tuval cihaz çözünürlüğüne yakın çiziliyor; piksel bütçesini aşarsa
     * orantılı küçültülüp CSS (image-rendering: pixelated) ile keskin
     * büyütülüyor.
     */
    /** Boyut ya da seviye değiştiyse tuvali yeniden kurar; değiştiyse true. */
    const resize = (nextLevel: number): boolean => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      /*
       * Telefonda kaydırırken adres çubuğu küçülüp büyüyor; genişlik aynı,
       * yükseklik birkaç yüz piksele kadar oynuyor. Bu değişimlerde tuval
       * yeniden kurulmuyor (GPU belleği baştan ayrılıp kalp yeniden
       * çiziliyor, kaydırma takılıyordu). Tuval CSS ile hafifçe esniyor;
       * iOS'ta 100lvh sayesinde zaten esnemiyor.
       */
      if (
        touch &&
        nextLevel === level &&
        Math.round(rect.width) === cssW &&
        Math.abs(rect.height - cssH) / cssH < 0.25
      ) {
        return false;
      }
      // Cihaz çözünürlüğü (en fazla 2x), seviyenin piksel boyutu ve piksel
      // bütçesiyle sınırlanıyor.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let scale = dpr / LEVELS[nextLevel].pixel;
      const budget = rect.width < 768 ? MAX_PIXELS_MOBILE : MAX_PIXELS_DESKTOP;
      const raw = rect.width * rect.height * scale * scale;
      if (raw > budget) scale *= Math.sqrt(budget / raw);
      const w = Math.max(1, Math.round(rect.width * scale));
      const h = Math.max(1, Math.round(rect.height * scale));
      if (w === width && h === height && nextLevel === level) return false;
      width = w;
      height = h;
      level = nextLevel;
      cssW = Math.round(rect.width);
      cssH = rect.height;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uScale, w / rect.width);
      // Metin düzeniyle aynı eşik (TitleStory ve .story-veil: 1024px)
      gl.uniform1f(uNarrow, rect.width < 1024 ? 1 : 0);
      gl.uniform1f(uColors, LEVELS[nextLevel].colors);
      return true;
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

    readPalette();
    canvas.classList.add("is-live");

    // Tema değişince (buton ya da sistem ayarı) renkleri yeniden oku
    const themeObserver = new MutationObserver(() => {
      readPalette();
      draw(performance.now(), reduced ? 1.2 : Math.min(1.2, (performance.now() - start) / 1700));
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    if (reduced) {
      // Tek kare: kalp kurulmuş, hareketsiz
      shown = 0;
      draw(start + 400, 1.2);
      // Yalnızca boyut gerçekten değiştiyse yeniden çiz (adres çubuğu
      // kaydırırken resize olayı sürekli geliyor ama tuval boyutu sabit)
      const onResize = () => {
        if (resize(levelFor(0))) draw(start + 400, 1.2);
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        themeObserver.disconnect();
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
      themeObserver.disconnect();
      release();
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="story-canvas" aria-hidden="true" />;
}
