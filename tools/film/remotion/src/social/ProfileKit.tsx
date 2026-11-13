// Оформление профиля: аватар, обложки «Актуального» (значки линиями, без текста), обложка Facebook.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {AiLabel, C, DISPLAY, loadBrandFonts, Logo, TEXT} from './brand';
import {COVER_LINE, fitSize, HEADLINE, type Lang} from './texts';

loadBrandFonts();

export const Avatar: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(60% 60% at 50% 45%, #1B2A33 0%, ${C.graphite} 70%)`, justifyContent: 'center', alignItems: 'center'}}>
    <Img src={staticFile('brand/mark-white.svg')} style={{width: 520, height: 520 * 657 / 672}} />
  </AbsoluteFill>
);

// значки «Актуального»: тонкая бирюзовая линия, как «скотч» на сайте
const S = {fill: 'none', stroke: C.tape, strokeWidth: 9, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
const ICONS: Record<string, React.ReactNode> = {
  price: (<g {...S}><rect x="118" y="40" width="164" height="320" rx="26" /><path d="M170 72h60" /><circle cx="200" cy="232" r="38" /><circle cx="200" cy="232" r="12" fill={C.tape} stroke="none" /><path d="M150 140h100" opacity=".5" /></g>),
  box: (<g {...S}><path d="M200 60 340 130 200 200 60 130Z" /><path d="M60 130v150l140 70 140-70V130" /><path d="M200 200v150" /><path d="M130 95l140 70v60" /></g>),
  care: (<g {...S}><path d="M200 50 320 96v96c0 80-52 136-120 160C132 328 80 272 80 192V96Z" /><path d="M140 200l44 44 80-92" /></g>),
  van: (<g {...S}><path d="M40 270V120c0-16 12-28 28-28h186c12 0 22 6 28 16l52 78 30 14v70" /><path d="M40 270h324" /><circle cx="110" cy="290" r="30" /><circle cx="300" cy="290" r="30" /><path d="M256 110v80h86" /><path d="M60 230h300" opacity=".5" /></g>),
  faq: (<g {...S}><circle cx="200" cy="200" r="150" /><path d="M150 160c0-30 22-52 52-52s50 20 50 46c0 34-46 40-46 76" /><circle cx="206" cy="282" r="8" fill={C.tape} stroke="none" /></g>),
  // v2: как работаем (телефон с кнопкой «видео»), пакеты (три коробки по росту), районы (метка на карте), дневник (блокнот со «скотчем»)
  how: (<g {...S}><rect x="122" y="40" width="156" height="320" rx="26" /><path d="M176 74h48" /><path d="M178 168v84l70-42Z" /></g>),
  packages: (<g {...S}><rect x="34" y="236" width="96" height="104" rx="6" /><rect x="150" y="186" width="110" height="154" rx="6" /><rect x="280" y="126" width="88" height="214" rx="6" /><path d="M34 268h96M150 222h110M280 162h88" opacity=".5" /><path d="M82 236v32M205 186v36M324 126v36" /></g>),
  // ценник с отверстием и «zł»-полосками (вместо телефона — понятнее как «Цена»)
  tag: (<g {...S}><path d="M200 50h120a30 30 0 0 1 30 30v120L190 360a30 30 0 0 1-42 0L60 272a30 30 0 0 1 0-42Z" /><circle cx="292" cy="108" r="20" /><path d="M150 230l60-60M180 260l40-40" opacity=".6" /></g>),
  areas: (<g {...S}><path d="M200 360s-110-110-110-190a110 110 0 0 1 220 0c0 80-110 190-110 190Z" /><circle cx="200" cy="170" r="40" /><path d="M60 360h280" opacity=".5" /></g>),
  diary: (<g {...S}><path d="M90 60h200a20 20 0 0 1 20 20v260H110a20 20 0 0 1-20-20Z" /><path d="M90 320a20 20 0 0 1 20-20h200" /><path d="M150 130h110M150 180h110M150 230h70" opacity=".6" /><path d="M250 40l40 40" strokeWidth={14} /></g>),
};
export const HIGHLIGHTS = ['price', 'box', 'care', 'van', 'faq'];
/** v2 (12.11): порядок в профиле — дневник, цена, пакеты, как работаем, коробки, аккуратность, бусы, районы, вопросы */
export const HIGHLIGHTS_V2 = ['diary', 'tag', 'packages', 'how', 'box', 'care', 'van', 'areas', 'faq'];
export const HighlightV2: React.FC = () => {
  const i = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.graphite, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 760, height: 760, borderRadius: '50%', background: 'radial-gradient(closest-side, #18242C, #10161D)', display: 'grid', placeItems: 'center'}}>
        <svg viewBox="0 0 400 400" width={420} height={420}>{ICONS[HIGHLIGHTS_V2[Math.min(i, HIGHLIGHTS_V2.length - 1)]]}</svg>
      </div>
    </AbsoluteFill>
  );
};
export const Highlight: React.FC = () => {
  const i = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.graphite, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 760, height: 760, borderRadius: '50%', background: 'radial-gradient(closest-side, #18242C, #10161D)', display: 'grid', placeItems: 'center'}}>
        <svg viewBox="0 0 400 400" width={420} height={420}>{ICONS[HIGHLIGHTS[Math.min(i, HIGHLIGHTS.length - 1)]]}</svg>
      </div>
    </AbsoluteFill>
  );
};

// обложка Facebook (1640×624, безопасная зона по центру)
export const CoverFB: React.FC<{lang?: Lang}> = ({lang = 'ru'}) => (
  <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff'}}>
    <Img src={staticFile('stills/van.jpg')} style={{position: 'absolute', top: 0, left: 600, height: '100%', width: 1116, objectFit: 'cover'}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(16,22,29,1) 0%, rgba(16,22,29,1) 36%, rgba(16,22,29,.55) 44%, rgba(16,22,29,0) 56%)'}} />
    <div style={{position: 'absolute', left: 110, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Logo width={260} />
      <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: fitSize(HEADLINE.map((l) => l[lang]), 76, 520), letterSpacing: '-0.055em', lineHeight: 0.95, marginTop: 44}}>
        {HEADLINE[0][lang]}<br />{HEADLINE[1][lang]}
      </div>
      <div style={{width: 180, height: 4, background: C.tape, margin: '30px 0 24px'}} />
      <div style={{fontFamily: TEXT, fontSize: 26, lineHeight: 1.45, color: 'rgba(255,255,255,.84)'}}>
        {COVER_LINE[lang]}
      </div>
    </div>
    <AiLabel lang={lang} style={{position: 'absolute', right: 28, bottom: 20, fontSize: 16}} />
  </AbsoluteFill>
);
