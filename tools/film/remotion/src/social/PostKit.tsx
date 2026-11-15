// Посты для заполнения профиля (13.11.2026): обложки Reels (единый стиль сетки) и карусель «Мы не продаём часы».
// Тексты — texts.ts (HOURS, названия роликов) и src/content/prices.ts (noHours — тот же блок, что на сайте).
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AiLabel, C, DISPLAY, loadBrandFonts, Logo, TEXT} from './brand';
import {CLIP_REELS, COMMON, FILM, fitSize, HOURS, type L, type Lang} from './texts';
import {noHours} from '../../../../../src/content/prices';
import {fitWrap} from './fit';
import {COVER_BG, COVERS, coverTitle, type CoverId} from './postdata';
export {COVERS};

loadBrandFonts();

// ---------- обложки Reels 1080×1920: всё важное — в середине 1080×1440 (так сетка профиля режет 3:4) ----------
export const ReelCover: React.FC<{id: CoverId; lang: Lang}> = ({id, lang}) => {
  const bg = COVER_BG[id];
  const t = coverTitle(id).map((x) => x[lang]);
  const size = fitSize(t, 120, 936);
  return (
    <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff'}}>
      {bg.img ? <Img src={staticFile(bg.img)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: bg.pos ?? '50% 50%'}} />
        : <OffthreadVideo src={staticFile('clips/' + bg.clip)} startFrom={Math.round(bg.at * 24)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,22,29,.35) 0%, rgba(16,22,29,0) 22%, rgba(16,22,29,0) 40%, rgba(16,22,29,.86) 62%, rgba(16,22,29,.96) 100%)'}} />
      <div style={{position: 'absolute', left: 72, right: 72, top: 1090}}>
        <div style={{width: 160, height: 5, background: C.tape, marginBottom: 40}} />
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: size, letterSpacing: '-0.055em', lineHeight: 0.95}}>{t[0]}<br />{t[1]}</div>
      </div>
      <Logo width={240} style={{position: 'absolute', left: 72, top: 1560}} />
      <AiLabel lang={lang} style={{position: 'absolute', right: 72, top: 1572, fontSize: 24}} />
    </AbsoluteFill>
  );
};

/** все 8 обложек одной последовательностью (кадр i = COVERS[i]); композиция 24 к/с, чтобы секунды кадра ролика считались верно */
export const ReelCovers: React.FC<{lang: Lang}> = ({lang}) => {
  const i = Math.min(useCurrentFrame(), COVERS.length - 1);
  return <Sequence from={i} durationInFrames={1}><ReelCover id={COVERS[i]} lang={lang} /></Sequence>;
};

// ---------- карусель «Мы не продаём часы» 1080×1350: обложка, 3 сравнения, призыв ----------
export const HOURS_SLIDES = 2 + noHours.rows.length;
export const CarouselHours: React.FC<{lang: Lang}> = ({lang}) => {
  const i = Math.min(useCurrentFrame(), HOURS_SLIDES - 1);
  const n = HOURS_SLIDES;
  const row = i >= 1 && i <= noHours.rows.length ? noHours.rows[i - 1] : null;
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 60% at 88% 0%, #16303A 0%, ${C.graphite} 62%)`, color: '#fff', fontFamily: TEXT}}>
      <div style={{position: 'absolute', left: 72, right: 72, top: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Logo width={230} />
        <div style={{fontSize: 28, color: 'rgba(255,255,255,.7)'}}>{i + 1} / {n}</div>
      </div>
      {i === 0 && (
        <div style={{position: 'absolute', left: 72, right: 72, top: 330}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: fitWrap(noHours.h2[lang], 150, 936, 3, 0.66), letterSpacing: '-0.06em', lineHeight: 0.95}}>{noHours.h2[lang]}</div>
          <div style={{width: 300, height: 5, background: C.tape, marginTop: 56}} />
          <div style={{fontSize: 40, lineHeight: 1.45, color: 'rgba(255,255,255,.84)', marginTop: 48, maxWidth: 900}}>{noHours.lead[lang]}</div>
          <div style={{fontSize: 30, color: C.tape, marginTop: 56}}>{COMMON.swipe[lang]}</div>
        </div>
      )}
      {row && (
        <div style={{position: 'absolute', left: 72, right: 72, top: 300}}>
          <div style={{fontSize: 30, color: 'rgba(255,255,255,.55)', letterSpacing: 0.5}}>{noHours.them[lang]}</div>
          <div style={{fontSize: 52, lineHeight: 1.3, color: 'rgba(255,255,255,.5)', marginTop: 22, textDecoration: 'line-through', textDecorationColor: 'rgba(143,154,167,.7)', textDecorationThickness: 3}}>{row[0][lang]}</div>
          <div style={{height: 1, background: '#2A3540', margin: '72px 0'}} />
          <div style={{fontSize: 30, color: C.tape, letterSpacing: 0.5}}>{noHours.us[lang]}</div>
          <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: fitWrap(row[1][lang], 84, 936, 4, 0.66), letterSpacing: '-0.045em', lineHeight: 1.05, marginTop: 26}}>{row[1][lang]}</div>
        </div>
      )}
      {i === n - 1 && (
        <div style={{position: 'absolute', left: 72, right: 72, top: 330}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: fitWrap(HOURS.ctaTitle[lang], 92, 936, 4, 0.66), letterSpacing: '-0.055em', lineHeight: 1}}>{HOURS.ctaTitle[lang]}</div>
          <div style={{width: 300, height: 5, background: C.tape, marginTop: 56}} />
          <div style={{fontSize: 40, lineHeight: 1.45, color: 'rgba(255,255,255,.84)', marginTop: 48, maxWidth: 900}}>{HOURS.ctaText[lang]}</div>
        </div>
      )}
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 64, fontSize: 26, color: 'rgba(255,255,255,.55)'}}>{COMMON.noExtras[lang]}</div>
    </AbsoluteFill>
  );
};
