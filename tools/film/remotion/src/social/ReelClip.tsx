// Короткий Reels 9:16 из одного ролика: заголовок, ролик, три строки по очереди, финальная карточка с логотипом.
import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AiLabel, C, DISPLAY, EASE, fadeOut, loadBrandFonts, Logo, rise, Tape, TEXT} from './brand';
import {CLIP_REELS, COMMON, fitSize, type Lang} from './texts';

loadBrandFonts();

export type ReelClipProps = {reel: keyof typeof CLIP_REELS; lang?: Lang};
export const CLIP_FRAMES = 150; // ролик 5 с, замедлен до ~6,3 с (0,8×)
export const CLIP_END = 66;

export const ReelClip: React.FC<ReelClipProps> = ({reel, lang = 'ru'}) => {
  const f = useCurrentFrame();
  const R = CLIP_REELS[reel];
  const {clip, square, vertical} = R;
  const title = R.title.map((l) => l[lang]);
  const lines = R.lines.map((l) => l[lang]);
  const endTitle = R.endTitle[lang];
  const tSize = fitSize(title, 100, 936);
  const W = square ? 880 : 1080, H = square ? 880 : vertical ? 1920 : 608;
  const top = square ? 520 : vertical ? 0 : 680;
  const linesTop = vertical ? 1250 : top + H + 70; // вертикальный ролик — на весь экран, строки внизу поверх затемнения
  const endK = interpolate(f, [CLIP_FRAMES - 6, CLIP_FRAMES + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
  const per = Math.floor((CLIP_FRAMES - 16) / lines.length); // строка: появление, показ, исчезновение, пауза
  return (
    <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff'}}>
      <div style={{position: 'absolute', left: (1080 - W) / 2, top, width: W, height: H, overflow: 'hidden', opacity: 1 - endK,
        scale: `${interpolate(f, [0, CLIP_FRAMES], [1, 1.04])}`}}>
        <Sequence durationInFrames={CLIP_FRAMES + CLIP_END}>
          <OffthreadVideo src={staticFile('clips/' + clip)} playbackRate={0.8} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>
      </div>
      {vertical && <AbsoluteFill style={{opacity: 1 - endK, background: 'linear-gradient(180deg, rgba(16,22,29,.88) 0%, rgba(16,22,29,.55) 16%, rgba(16,22,29,0) 30%, rgba(16,22,29,0) 52%, rgba(16,22,29,.8) 64%, rgba(16,22,29,.95) 80%)'}} />}
      <div style={{position: 'absolute', left: 72, right: 72, top: 200, opacity: 1 - endK}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: tSize, letterSpacing: '-0.055em', lineHeight: 0.95, ...rise(f, 2)}}>{title[0]}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: tSize, letterSpacing: '-0.055em', lineHeight: 0.95, marginTop: 6, ...rise(f, 8)}}>{title[1]}</div>
        <Tape frame={f} from={14} width={300} style={{marginTop: 36}} />
      </div>
      {lines.map((ln, i) => {
        const a = 16 + i * per, b = a + per - 14; // гаснет за 10 кадров до появления следующей
        if (f < a - 2 || f > b + 12) return null;
        return (
          <div key={ln} style={{position: 'absolute', left: 72, right: 72, top: linesTop, opacity: i === lines.length - 1 ? 1 - endK : fadeOut(f, b, 10)}}>
            <div style={{fontFamily: TEXT, fontSize: 30, color: C.tape, letterSpacing: 1, ...rise(f, a)}}>{`0${i + 1}`}</div>
            <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: ln.length > 40 ? 50 : 58, letterSpacing: '-0.045em', lineHeight: 1.1, marginTop: 18, maxWidth: 930, ...rise(f, a + 3)}}>{ln}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 1 - endK}}>
        <Logo width={300} />
        <AiLabel lang={lang} />
      </div>
      {f >= CLIP_FRAMES - 6 ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 72px', opacity: endK}}>
          <Logo width={520} style={{...rise(f, CLIP_FRAMES)}} />
          <Tape frame={f} from={CLIP_FRAMES + 8} width={420} style={{marginTop: 64}} />
          <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: Math.min(100, fitSize(endTitle.split(' — '), 100, 936)), letterSpacing: '-0.055em', lineHeight: 0.98, marginTop: 64, maxWidth: 940, ...rise(f, CLIP_FRAMES + 10)}}>{endTitle}</div>
          <div style={{fontFamily: TEXT, fontSize: 40, lineHeight: 1.4, color: 'rgba(255,255,255,.82)', marginTop: 44, ...rise(f, CLIP_FRAMES + 18)}}>{COMMON.noExtras[lang]}<br />{COMMON.linkInBio[lang]}</div>
          <AiLabel lang={lang} style={{position: 'absolute', right: 72, bottom: 96}} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
