// Фирменные элементы для соцсетей: шрифты сайта, цвета, логотип, лента скотча, пометка «Визуализация».
import React from 'react';
import {continueRender, delayRender, Easing, Img, interpolate, staticFile} from 'remotion';

export const C = {
  graphite: '#10161D',
  tape: '#14DCD5',
  deep: '#077E79',
  silver: '#DCE1E7',
  steel: '#8F9AA7',
  paper: '#F4F6F8',
};
export const DISPLAY = 'Unbounded, sans-serif';
export const TEXT = 'Onest, sans-serif';
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// шрифты с сайта (кириллица + латиница), рендер ждёт их загрузки
const faces: [string, string, string][] = [];
for (const fam of ['unbounded', 'onest']) {
  const name = fam === 'unbounded' ? 'Unbounded' : 'Onest';
  faces.push([name, `${fam}-latin-wght-normal.woff2`, 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD']);
  faces.push([name, `${fam}-latin-ext-wght-normal.woff2`, 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF']);
  faces.push([name, `${fam}-cyrillic-wght-normal.woff2`, 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116']);
  faces.push([name, `${fam}-cyrillic-ext-wght-normal.woff2`, 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F']);
}
let fontsReady = false;
export const loadBrandFonts = () => {
  if (fontsReady || typeof document === 'undefined') return;
  fontsReady = true;
  const handle = delayRender('Шрифты MELBUS');
  const css = faces.map(([n, f, r]) => `@font-face{font-family:'${n}';src:url('${staticFile('fonts/' + f)}') format('woff2');font-weight:100 900;font-display:block;unicode-range:${r};}`).join('');
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
  const probe = 'Переезд MELBUS Wizualizacja ąęł 0123';
  Promise.all([200, 300, 400].map((w) => document.fonts.load(`${w} 40px Unbounded`, probe)).concat(
    [400, 500].map((w) => document.fonts.load(`${w} 40px Onest`, probe)),
  )).then(() => continueRender(handle)).catch(() => continueRender(handle));
};

export const Logo: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => (
  <Img src={staticFile('brand/melbus-white.svg')} style={{width, height: width / 4.606, ...style}} />
);

export const AiLabel: React.FC<{style?: React.CSSProperties}> = ({style}) => (
  <div style={{fontFamily: TEXT, fontSize: 22, color: 'rgba(255,255,255,.6)', letterSpacing: 0.3, ...style}}>Визуализация</div>
);

// бирюзовая «лента скотча»: протягивается слева направо
export const Tape: React.FC<{frame: number; from: number; width: number; style?: React.CSSProperties}> = ({frame, from, width, style}) => (
  <div style={{width, height: 4, background: C.tape, transformOrigin: '0 50%',
    scale: `${interpolate(frame, [from, from + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE})} 1`, ...style}} />
);

// плавное появление снизу (заголовки, строки)
export const rise = (frame: number, from: number, dur = 18) => ({
  opacity: interpolate(frame, [from, from + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE}),
  translate: `0 ${interpolate(frame, [from, from + dur], [36, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE})}px`,
});
export const fadeOut = (frame: number, from: number, dur = 12) =>
  interpolate(frame, [from, from + dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
