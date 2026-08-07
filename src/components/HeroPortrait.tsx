// @ts-nocheck
"use client";

import { useEffect, useRef } from 'react';

const HERO_IMAGE_SRC = "/harsh.png";

export default function HeroPortrait() {
  const bgCanvasRef = useRef(null);
  const glyphCanvasRef = useRef(null);
  const glyphWrapRef = useRef(null);

  useEffect(() => {
    let bgFrameId: number;
    let glyphFrameId: number;

    // ══════════════════════════════════════════════════════════════
    // PART 1: Grainient animated background (WebGL2)
    // ══════════════════════════════════════════════════════════════
    const bgCanvas = bgCanvasRef.current as HTMLCanvasElement | null;
    if (!bgCanvas) return;
    // alpha:false → browser doesn't need to composite against what's behind
    const gl = bgCanvas.getContext('webgl2', { alpha: false, antialias: false }) as WebGL2RenderingContext | null;
    if (!gl) { console.error('WebGL2 not supported'); return; }

    function resizeBg() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      if (bgCanvas.width !== w || bgCanvas.height !== h) {
        bgCanvas.width = w;
        bgCanvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    window.addEventListener('resize', resizeBg);
    resizeBg();

    const vertexSrc = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

    const fragmentSrc = `#version 300 es
precision highp float;
uniform vec2  iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2  uCenterOffset;
uniform float uZoom;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
out vec4 fragColor;

#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){ float s=sin(a),c=cos(a); return mat2(c,-s,s,c); }
vec2 hash(vec2 p){
  p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));
  return fract(sin(p)*43758.5453);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  float n=mix(
    mix(dot(-1.0+2.0*hash(i+vec2(0,0)),f-vec2(0,0)),
        dot(-1.0+2.0*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0,1)),f-vec2(0,1)),
        dot(-1.0+2.0*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
  return 0.5+0.5*n;
}
void main(){
  float t=iTime*uTimeSpeed;
  vec2 uv=gl_FragCoord.xy/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
  vec3 colLav=uColor1,colOrg=uColor2,colDark=uColor3;
  float b=uColorBalance,s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  vec3 layer1=mix(colDark,colOrg,S(-0.3-b-s,0.2-b+s,blendX));
  vec3 layer2=mix(colOrg,colLav,S(-0.3-b-s,0.2-b+s,blendX));
  vec3 col=mix(layer1,layer2,S(0.5-b+s,-0.3-b-s,tuv.y));
  vec2 spotUv=uv-vec2(0.5,-0.2);
  spotUv.x*=ratio*0.7;
  col*=pow(1.0-smoothstep(0.0,1.3,length(spotUv)),0.6);
  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5) grainUv+=vec2(iTime*0.05);
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  fragColor=vec4(clamp(col,0.0,1.0),1.0);
}`;

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexSrc));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentSrc));
    gl.linkProgram(program);
    gl.useProgram(program);

    const posAttr = gl.getAttribLocation(program, 'position');
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const U = {};
    for (const name of [
      'iTime','iResolution','uTimeSpeed','uColorBalance','uWarpStrength','uWarpFrequency',
      'uWarpSpeed','uWarpAmplitude','uBlendAngle','uBlendSoftness','uRotationAmount',
      'uNoiseScale','uGrainAmount','uGrainScale','uGrainAnimated','uContrast','uGamma',
      'uSaturation','uCenterOffset','uZoom','uColor1','uColor2','uColor3'
    ]) U[name] = gl.getUniformLocation(program, name);

    gl.uniform1f(U.uTimeSpeed, 0.2);
    gl.uniform1f(U.uColorBalance, 3);
    gl.uniform1f(U.uWarpStrength, 1.0);
    gl.uniform1f(U.uWarpFrequency, 3.0);
    gl.uniform1f(U.uWarpSpeed, 0.3);
    gl.uniform1f(U.uWarpAmplitude, 100.0);
    gl.uniform1f(U.uBlendAngle, 0.0);
    gl.uniform1f(U.uBlendSoftness, 0.3);
    gl.uniform1f(U.uRotationAmount, 40.0);
    gl.uniform1f(U.uNoiseScale, 1.9);
    gl.uniform1f(U.uGrainAmount, 0.15);
    gl.uniform1f(U.uGrainScale, 1.0);
    gl.uniform1f(U.uGrainAnimated, 1.0);
    gl.uniform1f(U.uContrast, 1.3);
    gl.uniform1f(U.uGamma, 1.0);
    gl.uniform1f(U.uSaturation, 0.0);
    gl.uniform2f(U.uCenterOffset, 0.0, 0.0);
    gl.uniform1f(U.uZoom, 0.7);
    gl.uniform3f(U.uColor3, 0.1, 0.1, 0.1);
    gl.uniform3f(U.uColor2, 0.6, 0.6, 0.6);
    gl.uniform3f(U.uColor1, 0.85, 0.85, 0.85);

    const bgT0 = performance.now();
    function bgFrame(now) {
      bgFrameId = requestAnimationFrame(bgFrame);
      resizeBg();
      gl.uniform1f(U.iTime, (now - bgT0) * 0.001);
      gl.uniform2f(U.iResolution, bgCanvas.width, bgCanvas.height);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    }
    bgFrameId = requestAnimationFrame(bgFrame);

    // ══════════════════════════════════════════════════════════════
    // PART 2: Glyph Dither
    // ══════════════════════════════════════════════════════════════
    const glyphCanvas = glyphCanvasRef.current as HTMLCanvasElement | null;
    if (!glyphCanvas) return;
    const gCtx = glyphCanvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D | null;
    if (!gCtx) return;
    const glyphWrap = glyphWrapRef.current as HTMLDivElement | null;
    if (!glyphWrap) return;
    const gdpr = Math.min(window.devicePixelRatio || 1, 2);

    const P = {
      chars: '.;:-=+*#%@', scale: 2, spacing: 0, gamma: 1, phase: 0,
      colormode: 'mono', invert: false, invertcolor: false,
      radius: 3.4, strength: 3, hardness: 26, tail: 25,
      fluidity: 39, dissipation: 37, momentum: 70,
      nscale: 4, nspeed: 160, namp: 0, parallax: 0
    };

    let gSIZE = 0, gCOLS = 0, gROWS = 0, gCW = 0, gCH = 0;
    let gCells = [], gFieldVX = null, gFieldVY = null;
    // Use window center as default so portrait is stable on load
    let gMouseX = window.innerWidth / 2;
    let gMouseY = window.innerHeight / 2;
    let gSmMX = gMouseX, gSmMY = gMouseY;
    let gPrevMX = gMouseX, gPrevMY = gMouseY;
    let gPrlxX = 0, gPrlxY = 0;
    let gImg = null;
    // Motion idle detection — skip render when nothing is moving
    let gLastMotion = performance.now();

    function ghash(x, y) {
      let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) >>> 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
      return (h ^ (h >>> 16)) / 4294967296;
    }
    function gsmoothNoise(x, y) {
      const ix = Math.floor(x), iy = Math.floor(y);
      const fx = x - ix, fy = y - iy;
      const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
      return ghash(ix,iy)*(1-ux)*(1-uy) + ghash(ix+1,iy)*ux*(1-uy) +
             ghash(ix,iy+1)*(1-ux)*uy  + ghash(ix+1,iy+1)*ux*uy;
    }
    function gfbm(x, y) {
      return gsmoothNoise(x,y)*0.5 + gsmoothNoise(x*2,y*2)*0.3 + gsmoothNoise(x*4,y*4)*0.2;
    }

    function gBuild(image) {
      const vw = window.innerWidth, vh = window.innerHeight;
      if (vw === 0 || vh === 0) return;

      const baseSize = Math.min(vw, vh);
      const minHeight = vh * 0.85;
      gSIZE = Math.round(Math.max(baseSize, minHeight));

      glyphCanvas.width  = gSIZE * gdpr;
      glyphCanvas.height = gSIZE * gdpr;
      glyphCanvas.style.width  = gSIZE + 'px';
      glyphCanvas.style.height = gSIZE + 'px';
      glyphWrap.style.width  = gSIZE + 'px';
      glyphWrap.style.height = gSIZE + 'px';

      const fontSize = Math.max(5, Math.round(P.scale * 0.13));
      const mc = document.createElement('canvas').getContext('2d');
      mc.font = 'bold ' + fontSize + 'px monospace';
      gCW = Math.ceil(mc.measureText('M').width) + P.spacing;
      gCH = fontSize + P.spacing;
      gCOLS = Math.floor(gSIZE / gCW);
      gROWS = Math.floor(gSIZE / gCH);

      const sc = document.createElement('canvas');
      sc.width = gCOLS; sc.height = gROWS;
      const sCtx = sc.getContext('2d');
      const iw = image.naturalWidth, ih = image.naturalHeight;
      let sx = 0, sy = 0, sw = iw, sh = ih;
      if (iw / ih > 1) { sw = ih; sx = (iw - sw) * 0.42; }
      else              { sh = iw; sy = (ih - sh) / 2; }
      sCtx.drawImage(image, sx, sy, sw, sh, 0, 0, gCOLS, gROWS);
      const d = sCtx.getImageData(0, 0, gCOLS, gROWS).data;

      const chars = P.chars || ' ';
      gCells = [];
      for (let r = 0; r < gROWS; r++) {
        for (let c = 0; c < gCOLS; c++) {
          const i = (r * gCOLS + c) * 4;
          const ri = d[i], gi = d[i+1], bi = d[i+2], ai = d[i+3];
          let b = (ri*0.299 + gi*0.587 + bi*0.114) / 255;
          b = Math.pow(b, P.gamma / 63);
          b += Math.sin((c + r) * 0.18 + P.phase * Math.PI / 180) * 0.04;
          b = Math.max(0, Math.min(1, b));
          if (P.invert) b = 1 - b;
          const skip = ai < 30 || (b < 0.08 && ai > 200);
          const char = skip ? ' ' : chars[Math.min(chars.length-1, Math.floor(b * chars.length))];
          gCells.push({ bx: c * gCW, by: r * gCH, char, ri, gi, bi, skip });
        }
      }

      gFieldVX = new Float32Array(gCOLS * gROWS);
      gFieldVY = new Float32Array(gCOLS * gROWS);
      // Reset mouse to canvas center on rebuild
      gMouseX = gSIZE / 2; gSmMX = gMouseX; gPrevMX = gMouseX;
      gMouseY = gSIZE / 2; gSmMY = gMouseY; gPrevMY = gMouseY;
    }

    function gUpdateTrail() {
      if (!gFieldVX || !gFieldVY) return;
      const lag = P.momentum / 100;

      if (Math.abs(gMouseX - gSmMX) > 50 || Math.abs(gMouseY - gSmMY) > 50) {
        gSmMX = gMouseX; gSmMY = gMouseY;
      }
      gSmMX += (gMouseX - gSmMX) * (1 - lag * 0.9);
      gSmMY += (gMouseY - gSmMY) * (1 - lag * 0.9);
      let mvx = gSmMX - gPrevMX, mvy = gSmMY - gPrevMY;
      gPrevMX = gSmMX; gPrevMY = gSmMY;

      const maxVel = 25;
      mvx = Math.max(-maxVel, Math.min(maxVel, mvx));
      mvy = Math.max(-maxVel, Math.min(maxVel, mvy));

      const tailDecay = 0.92 + (P.tail / 100) * 0.079;
      const velThresh = 0.05;

      if (Math.abs(mvx) > velThresh || Math.abs(mvy) > velThresh) {
        gLastMotion = performance.now();
        const fluidSmooth = P.fluidity / 100;
        const R = Math.max(2, P.radius * (gSIZE / 100) * 3.5);
        const str = P.strength * 0.25;
        const mcol = Math.floor(gSmMX / gCW), mrow = Math.floor(gSmMY / gCH);
        const ri = Math.ceil(R / gCW);

        for (let dr = -ri; dr <= ri; dr++) {
          const row = mrow + dr;
          if (row < 0 || row >= gROWS) continue;
          for (let dc = -ri; dc <= ri; dc++) {
            const col = mcol + dc;
            if (col < 0 || col >= gCOLS) continue;
            const cx = col * gCW + gCW / 2, cy = row * gCH + gCH / 2;
            const dx = cx - gSmMX, dy = cy - gSmMY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const t = dist / R;
            if (t >= 1) continue;
            const h = P.hardness / 100;
            const softFall = Math.cos(t * Math.PI) * 0.5 + 0.5;
            const hardFall = 1 - t;
            const falloff = softFall * (1-h) + hardFall * h;
            if (falloff <= 0) continue;
            const idx = row * gCOLS + col;
            const addX = mvx * falloff * str;
            const addY = mvy * falloff * str;
            gFieldVX[idx] = gFieldVX[idx] * fluidSmooth + addX * (1-fluidSmooth) + addX;
            gFieldVY[idx] = gFieldVY[idx] * fluidSmooth + addY * (1-fluidSmooth) + addY;
          }
        }
      }

      // Check if any field still has notable motion for tail decay
      let maxField = 0;
      for (let i = 0; i < gFieldVX.length; i++) {
        gFieldVX[i] *= tailDecay;
        gFieldVY[i] *= tailDecay;
        const m = Math.abs(gFieldVX[i]) + Math.abs(gFieldVY[i]);
        if (m > maxField) maxField = m;
      }
      // Keep motion timer alive while field is still decaying
      if (maxField > 0.01) gLastMotion = performance.now();
    }

    const gT0 = performance.now();
    const IDLE_MS = 500; // stop re-drawing after 500ms of no motion

    function gRender() {
      glyphFrameId = requestAnimationFrame(gRender);
      if (!gCells.length || !gFieldVX) return;

      gUpdateTrail();

      // ── IDLE SKIP: if nothing has moved recently, skip the expensive canvas repaint ──
      // (namp is 0 so there's no noise animation either, making this safe)
      if (P.namp === 0 && performance.now() - gLastMotion > IDLE_MS) return;

      const t = (performance.now() - gT0) * 0.001;
      const ns = P.nscale * 0.003;
      const spd = P.nspeed * 0.0004;
      const amp = P.namp * 0.18;

      gCtx.setTransform(gdpr, 0, 0, gdpr, 0, 0);
      gCtx.clearRect(0, 0, gSIZE, gSIZE);
      gCtx.font = 'bold ' + gCH + 'px monospace';
      gCtx.textBaseline = 'top';

      // Batch cells by color to reduce fillStyle state switches
      // Build a map: colorKey → [{ char, x, y }]
      const colorBatches: Map<string, { char: string; x: number; y: number }[]> = new Map();

      for (let i = 0; i < gCells.length; i++) {
        const cell = gCells[i];
        if (cell.skip) continue;

        const col = i % gCOLS;
        const row = Math.floor(i / gCOLS);
        const idx = row * gCOLS + col;
        const fVX = gFieldVX[idx];
        const fVY = gFieldVY[idx];

        const nx = amp > 0 ? gfbm(col * ns + t * spd, row * ns + 0.3) : 0.5;
        const ny = amp > 0 ? gfbm(col * ns + 0.7 + t * spd * 0.8, row * ns + 1.1 + t * spd * 0.6) : 0.5;
        const ndx = (nx - 0.5) * 2 * amp;
        const ndy = (ny - 0.5) * 2 * amp;

        const x = cell.bx + ndx + fVX;
        const y = cell.by + ndy + fVY;

        if (x < -gCW || x > gSIZE || y < -gCH || y > gSIZE) continue;

        // Round color to nearest 8 to reduce unique fillStyle strings
        const rr = (cell.ri >> 3) << 3;
        const gg = (cell.gi >> 3) << 3;
        const bb = (cell.bi >> 3) << 3;
        const key = `${rr},${gg},${bb}`;
        if (!colorBatches.has(key)) colorBatches.set(key, []);
        colorBatches.get(key).push({ char: cell.char, x, y });
      }

      for (const [key, items] of colorBatches) {
        gCtx.fillStyle = `rgb(${key})`;
        for (const it of items) gCtx.fillText(it.char, it.x, it.y);
      }
    }

    // ── Mouse: use raw clientX/Y since glyphWrap is now fixed full-screen ──
    function handleMouseMove(e) {
      if (Math.abs(e.movementX) === 0 && Math.abs(e.movementY) === 0) return;
      const r = glyphWrap.getBoundingClientRect();
      gMouseX = e.clientX - r.left;
      gMouseY = e.clientY - r.top;
      gLastMotion = performance.now();
    }

    let lastTouchX = 0, lastTouchY = 0;
    function handleTouchMove(e) {
      const t = e.touches[0];
      if (Math.abs(t.clientX - lastTouchX) < 1 && Math.abs(t.clientY - lastTouchY) < 1) return;
      lastTouchX = t.clientX; lastTouchY = t.clientY;
      const r = glyphWrap.getBoundingClientRect();
      gMouseX = t.clientX - r.left;
      gMouseY = t.clientY - r.top;
      gLastMotion = performance.now();
    }

    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (!isMobile) {
      glyphWrap.addEventListener('mousemove', handleMouseMove);
      glyphWrap.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    let lastWidth = window.innerWidth;
    function handleResize() {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        if (gImg) gBuild(gImg);
      }
    }
    window.addEventListener('resize', handleResize);

    async function initGlyph(img: HTMLImageElement) {
      gImg = img;
      gBuild(img);
      gRender();
    }

    let isInitialized = false;
    const heroImg = new Image();

    const handleImgSuccess = async () => {
      if (isInitialized) return;
      isInitialized = true;
      try {
        if (heroImg.decode) {
          await heroImg.decode();
        }
      } catch (e) {
        // Ignore decode error if image is already renderable
      }
      initGlyph(heroImg);
    };

    heroImg.onload = handleImgSuccess;
    heroImg.onerror = () => {
      console.warn("Hero portrait image load error, retrying...");
      const retryImg = new Image();
      retryImg.onload = () => {
        if (!isInitialized) {
          isInitialized = true;
          initGlyph(retryImg);
        }
      };
      retryImg.src = `${HERO_IMAGE_SRC}?t=${Date.now()}`;
    };

    // Set src after setting handlers so load is never missed
    heroImg.src = HERO_IMAGE_SRC;

    if (heroImg.complete && heroImg.naturalWidth > 0) {
      handleImgSuccess();
    }

    return () => {
      heroImg.onload = null;
      heroImg.onerror = null;
      cancelAnimationFrame(bgFrameId);
      cancelAnimationFrame(glyphFrameId);
      window.removeEventListener('resize', resizeBg);
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        glyphWrap?.removeEventListener('mousemove', handleMouseMove);
        glyphWrap?.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  return (
    <>
      {/* Grainient WebGL background — fixed to viewport */}
      <canvas
        ref={bgCanvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 0, willChange: 'transform' }}
      />

      {/* Glyph dither — fixed to viewport, centered horizontally, anchored to bottom */}
      <div
        ref={glyphWrapRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          pointerEvents: 'auto',
          cursor: 'none',
          willChange: 'transform',
        }}
      >
        <canvas ref={glyphCanvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>
    </>
  );
}