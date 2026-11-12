// Короткий Reels 9:16 из одного ролика: заголовок, ролик, три строки по очереди, финальная карточка с логотипом.
import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AiLabel, C, DISPLAY, EASE, fadeOut, loadBrandFonts, Logo, rise, Tape, TEXT} from './brand';

loadBrandFonts();

export type ReelClipProps = {
  clip: string;            // файл в public/clips
  square: boolean;         // квадратный ролик (иначе 16:9)
  title: [string, string]; // заголовок в две строки
  lines: string[];         // три строки по очереди
  endTitle: string;
};
export const CLIP_FRAMES = 150; // ролик 5 с, замедлен до ~6,3 с (0,8×)
export const CLIP_END = 66;

export const ReelClip: React.FC<ReelClipProps> = ({clip, square, title, lines, endTitle}) => {
  const f = useCurrentFrame();
  const W = square ? 960 : 1080, H = square ? 960 : 608;
  const top = square ? 560 : 680;
  const endK = interpolate(f, [CLIP_FRAMES - 6, CLIP_FRAMES + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
  const per = Math.floor((CLIP_FRAMES - 16) / lines.length); // строка: появление, показ, исчезновение, пауза
  return (
    <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff'}}>
      <div style={{position: 'absolute', left: 72, right: 72, top: 200, opacity: 1 - endK}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: 100, letterSpacing: '-0.055em', lineHeight: 0.95, ...rise(f, 2)}}>{title[0]}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: 100, letterSpacing: '-0.055em', lineHeight: 0.95, marginTop: 6, ...rise(f, 8)}}>{title[1]}</div>
        <Tape frame={f} from={14} width={300} style={{marginTop: 36}} />
      </div>
      <div style={{position: 'absolute', left: (1080 - W) / 2, top, width: W, height: H, overflow: 'hidden', opacity: 1 - endK,
        scale: `${interpolate(f, [0, CLIP_FRAMES], [1, 1.04])}`}}>
        <Sequence durationInFrames={CLIP_FRAMES + CLIP_END}>
          <OffthreadVideo src={staticFile('clips/' + clip)} playbackRate={0.8} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>
      </div>
      {lines.map((ln, i) => {
        const a = 16 + i * per, b = a + per - 14; // гаснет за 10 кадров до появления следующей
        if (f < a - 2 || f > b + 12) return null;
        return (
          <div key={ln} style={{position: 'absolute', left: 72, right: 72, top: top + H + 80, opacity: i === lines.length - 1 ? 1 - endK : fadeOut(f, b, 10)}}>
            <div style={{fontFamily: TEXT, fontSize: 30, color: C.tape, letterSpacing: 1, ...rise(f, a)}}>{`0${i + 1}`}</div>
            <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: 58, letterSpacing: '-0.045em', lineHeight: 1.08, marginTop: 18, maxWidth: 930, ...rise(f, a + 3)}}>{ln}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 1 - endK}}>
        <Logo width={300} />
        <AiLabel />
      </div>
      {f >= CLIP_FRAMES - 6 ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 72px', opacity: endK}}>
          <Logo width={520} style={{...rise(f, CLIP_FRAMES)}} />
          <Tape frame={f} from={CLIP_FRAMES + 8} width={420} style={{marginTop: 64}} />
          <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: 100, letterSpacing: '-0.055em', lineHeight: 0.98, marginTop: 64, maxWidth: 940, ...rise(f, CLIP_FRAMES + 10)}}>{endTitle}</div>
          <div style={{fontFamily: TEXT, fontSize: 40, lineHeight: 1.4, color: 'rgba(255,255,255,.82)', marginTop: 44, ...rise(f, CLIP_FRAMES + 18)}}>Переезд без доплат.<br />Ссылка в профиле.</div>
          <AiLabel style={{position: 'absolute', right: 72, bottom: 96}} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
