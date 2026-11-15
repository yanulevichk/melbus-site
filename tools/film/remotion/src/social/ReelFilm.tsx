// Reels/TikTok 9:16: фильм «вся квартира в одной коробке» в кадре-полосе, крупная типографика сверху и снизу.
// Все тексты — из texts.ts (сразу на 4 языках).
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Hero} from '../Hero';
import {DURATION} from '../remap';
import {AiLabel, C, DISPLAY, EASE, fadeOut, loadBrandFonts, Logo, rise, Tape, TEXT} from './brand';
import {COMMON, FILM, fitSize, HEADLINE, type Lang, PRICE_FINAL} from './texts';

loadBrandFonts();

export const FILM_FRAMES = 540; // без петли в конце
export const END_FRAMES = 72;
const BAND_TOP = 660, BAND_H = 608;

export const ReelFilm: React.FC<{lang?: Lang}> = ({lang = 'ru'}) => {
  const f = useCurrentFrame();
  const endK = interpolate(f, [FILM_FRAMES - 6, FILM_FRAMES + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
  const hook = FILM.hook.map((l) => l[lang]);
  const hookSize = fitSize(hook, 104, 936);
  const head = HEADLINE.map((l) => l[lang]);
  const headSize = fitSize(head, 112, 936);
  return (
    <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff'}}>
      {/* заголовок-крючок */}
      <div style={{position: 'absolute', left: 72, right: 72, top: 230, opacity: 1 - endK}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: hookSize, letterSpacing: '-0.055em', lineHeight: 0.95, ...rise(f, 2)}}>{hook[0]}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: hookSize, letterSpacing: '-0.055em', lineHeight: 0.95, marginTop: 6, ...rise(f, 8)}}>{hook[1]}</div>
        <Tape frame={f} from={16} width={360} style={{marginTop: 40}} />
      </div>
      {/* фильм */}
      <div style={{position: 'absolute', left: 0, top: BAND_TOP, width: 1080, height: BAND_H, overflow: 'hidden', opacity: 1 - endK}}>
        <Sequence durationInFrames={DURATION}>
          <Hero label={false} />
        </Sequence>
      </div>
      <div style={{position: 'absolute', left: 0, top: BAND_TOP + BAND_H, width: 1080, height: 4, background: 'rgba(255,255,255,.12)', opacity: 1 - endK}}>
        <div style={{height: 4, background: C.tape, transformOrigin: '0 50%', scale: `${Math.min(1, f / FILM_FRAMES)} 1`}} />
      </div>
      {/* подписи по ходу фильма */}
      {FILM.caps.map(([a, b, title, sub]) => {
        const fa = a * 24, fb = b * 24;
        if (f < fa - 2 || f > fb + 14) return null;
        return (
          <div key={a} style={{position: 'absolute', left: 72, right: 72, top: BAND_TOP + BAND_H + 90, opacity: fadeOut(f, fb)}}>
            <Tape frame={f} from={fa} width={96} />
            <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: fitSize([title[lang]], 76, 936), letterSpacing: '-0.05em', lineHeight: 1, marginTop: 30, ...rise(f, fa + 2)}}>{title[lang]}</div>
            <div style={{fontFamily: TEXT, fontSize: 36, lineHeight: 1.45, color: 'rgba(255,255,255,.8)', marginTop: 22, maxWidth: 880, ...rise(f, fa + 6)}}>{sub[lang]}</div>
          </div>
        );
      })}
      {/* низ: логотип и пометка */}
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 1 - endK}}>
        <Logo width={300} />
        <AiLabel lang={lang} />
      </div>
      {/* финальная карточка */}
      {f >= FILM_FRAMES - 6 ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 72px', opacity: endK}}>
          <Logo width={520} style={{...rise(f, FILM_FRAMES)}} />
          <Tape frame={f} from={FILM_FRAMES + 8} width={420} style={{marginTop: 64}} />
          <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: headSize, letterSpacing: '-0.055em', lineHeight: 0.95, marginTop: 64, ...rise(f, FILM_FRAMES + 10)}}>{head[0]}<br />{head[1]}</div>
          <div style={{fontFamily: TEXT, fontSize: 40, lineHeight: 1.4, color: 'rgba(255,255,255,.82)', marginTop: 44, maxWidth: 860, ...rise(f, FILM_FRAMES + 18)}}>{PRICE_FINAL[lang]}<br />{COMMON.linkInBio[lang]}</div>
          <AiLabel lang={lang} style={{position: 'absolute', right: 72, bottom: 96}} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
