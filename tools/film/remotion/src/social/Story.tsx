// Сторис 1080×1920: шаблоны «Дневника запуска». Тексты и порядок — stories.ts.
// Безопасные зоны Instagram: сверху ~250 px (имя профиля), снизу ~300 px (поле ответа).
// Для опросов/викторин/вопросов оставлено чистое место (y ≈ 1080–1500) — туда ставится стикер в приложении.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {AiLabel, C, DISPLAY, EASE, loadBrandFonts, Logo, rise, TEXT} from './brand';
import {COMMON, type Lang, type L} from './texts';
import {DAY_WORD, PAIR_LABELS, RUBRICS, STILLS, type Story} from './stories';
import {noHours} from '../../../../../src/content/prices';
import media from './stories-media.json';
import {fitWrap} from './fit';

loadBrandFonts();

const W = 1080, PADX = 84, TEXT_W = W - PADX * 2;
const INTERACTIVE = new Set(['poll', 'quiz', 'question', 'slider']);

export {fitWrap};

/** фон: своё фото команды или картинка ChatGPT, если их положили; иначе — запасная картинка */
const bgOf = (s: Story): {src?: string; ai: boolean} => {
  if (s.real && (media.real as string[]).includes(s.id)) return {src: `stories/real/${s.id}.jpg`, ai: false};
  if (s.gpt && (media.gpt as string[]).includes(s.gpt)) return {src: `stories/gpt/${s.gpt}.jpg`, ai: true};
  return {src: s.img, ai: !!s.ai};
};

const Frame: React.FC<{s: Story; lang: Lang; children: React.ReactNode; ai?: boolean; dark?: boolean}> = ({s, lang, children, ai}) => (
  <AbsoluteFill style={{background: `radial-gradient(90% 55% at 88% 0%, #16303A 0%, ${C.graphite} 62%)`, color: '#fff', fontFamily: TEXT}}>
    {children}
    <div style={{position: 'absolute', left: PADX, right: PADX, top: 232, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 30, color: 'rgba(255,255,255,.78)', textShadow: '0 2px 12px rgba(0,0,0,.6)'}}>
      <span>{RUBRICS[s.rubric][lang]}</span>
      <span style={{fontVariantNumeric: 'tabular-nums'}}>{DAY_WORD[lang]} {s.day}</span>
    </div>
    <div style={{position: 'absolute', left: PADX, top: 288, width: 120, height: 4, background: C.tape}} />
    <Logo width={190} style={{position: 'absolute', left: PADX, bottom: 300}} />
    {ai && <AiLabel lang={lang} style={{position: 'absolute', right: PADX, bottom: 304, fontSize: 24}} />}
  </AbsoluteFill>
);

const Title: React.FC<{text: string; max?: number; lines?: number; style?: React.CSSProperties}> = ({text, max = 104, lines = 5, style}) => (
  <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: fitWrap(text, max, TEXT_W, lines, 0.66), letterSpacing: '-0.045em', lineHeight: 1.02, ...style}}>{text}</div>
);
const Body: React.FC<{text?: string; style?: React.CSSProperties}> = ({text, style}) => text ? (
  <div style={{fontSize: fitWrap(text, 42, TEXT_W, 5, 0.52, 30), lineHeight: 1.45, color: 'rgba(255,255,255,.82)', marginTop: 36, ...style}}>{text}</div>
) : null;

/** блок текста над логотипом: обычно начинается с top; длинный текст поднимается (до top − lift), но не заходит на логотип (низ — 390 px от края) */
const TextBlock: React.FC<{top: number; lift: number; children: React.ReactNode}> = ({top, lift, children}) => (
  <div style={{position: 'absolute', left: PADX, right: PADX, top: top - lift, bottom: 390, display: 'flex', flexDirection: 'column'}}>
    <div style={{flex: `0 1 ${lift}px`, minHeight: 0}} />
    <div>{children}</div>
  </div>
);

const Bullets: React.FC<{items: string[]; compact?: boolean}> = ({items, compact}) => (
  <div style={{display: 'grid', gap: compact ? 22 : 34, marginTop: compact ? 36 : 56}}>
    {items.map((t) => (
      <div key={t} style={{display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'baseline', fontSize: fitWrap(t, 46, TEXT_W - 56, 2, 0.52, 32), lineHeight: 1.35}}>
        <span style={{width: 34, height: 4, background: C.tape, display: 'block', transform: 'translateY(-10px)'}} />
        <span>{t}</span>
      </div>
    ))}
  </div>
);

const Compare: React.FC<{lang: Lang}> = ({lang}) => (
  <div style={{marginTop: 64, borderTop: '1px solid #2A3540'}}>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, padding: '22px 0', fontSize: 28, color: 'rgba(255,255,255,.62)', borderBottom: '1px solid #2A3540'}}>
      <span>{noHours.them[lang]}</span><span style={{color: '#fff', fontWeight: 600}}>{noHours.us[lang]}</span>
    </div>
    {noHours.rows.map(([a, b]) => (
      <div key={a[lang]} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, padding: '28px 0', borderBottom: '1px solid #2A3540', fontSize: 34, lineHeight: 1.35}}>
        <span style={{color: 'rgba(255,255,255,.55)', textDecoration: 'line-through', textDecorationColor: 'rgba(143,154,167,.7)'}}>{a[lang]}</span>
        <span style={{fontWeight: 500}}>{b[lang]}</span>
      </div>
    ))}
  </div>
);

/** одна сторис-картинка */
export const StoryCard: React.FC<{s: Story; lang: Lang}> = ({s, lang}) => {
  const t = s.title[lang], b = s.body?.[lang];
  const sticky = s.sticker && INTERACTIVE.has(s.sticker.t);
  const bg = bgOf(s);

  if (s.kind === 'photo' || ((s.kind === 'text' || s.kind === 'list') && bg.src && (s.real || s.gpt) && bg.src !== s.img)) {
    return (
      <Frame s={s} lang={lang} ai={bg.ai}>
        {bg.src && <Img src={staticFile(bg.src)} style={{position: 'absolute', left: 0, top: 0, width: W, height: 1180, objectFit: 'cover'}} />}
        <AbsoluteFill style={{background: s.kind === 'list'
          ? 'linear-gradient(180deg, rgba(16,22,29,.92) 0%, rgba(16,22,29,.55) 14%, rgba(16,22,29,0) 28%, rgba(16,22,29,0) 36%, rgba(16,22,29,1) 51%)'
          : 'linear-gradient(180deg, rgba(16,22,29,.92) 0%, rgba(16,22,29,.55) 14%, rgba(16,22,29,0) 30%, rgba(16,22,29,0) 46%, rgba(16,22,29,1) 61%)'}} />
        {/* текст начинается с 1080, а если длинный — поднимается (список — выше), чтобы не задеть логотип */}
        <TextBlock top={1080} lift={s.kind === 'list' ? 280 : 200}>
          <Title text={t} max={90} lines={3} />
          {s.kind === 'list' && s.items ? <Bullets items={s.items.map((x) => x[lang])} compact /> : <Body text={b} style={{marginTop: 28}} />}
        </TextBlock>
      </Frame>
    );
  }
  if (s.kind === 'number') {
    const big = s.big![lang];
    return (
      <Frame s={s} lang={lang} ai={false}>
        <div style={{position: 'absolute', left: PADX, right: PADX, top: 520}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: Math.min(300, Math.floor(TEXT_W / (0.7 * big.length))), letterSpacing: '-0.06em', lineHeight: 1, color: '#fff'}}>{big}</div>
          <div style={{fontFamily: DISPLAY, fontWeight: 300, fontSize: fitWrap(t, 64, TEXT_W, 2, 0.66), letterSpacing: '-0.03em', marginTop: 28, color: C.tape}}>{t}</div>
          <Body text={b} style={{marginTop: 48}} />
        </div>
      </Frame>
    );
  }
  if (s.kind === 'shot' || s.kind === 'pair') {
    return (
      <Frame s={s} lang={lang} ai={s.kind === 'pair'}>
        <div style={{position: 'absolute', left: PADX, right: PADX, top: 360}}>
          <Title text={t} max={74} lines={3} />
          {b && <Body text={b} style={{fontSize: 34, marginTop: 22}} />}
        </div>
        {s.kind === 'shot' ? (
          <div style={{position: 'absolute', left: (W - 720) / 2, top: b ? 800 : 700, width: 720, height: sticky ? 560 : b ? 680 : 760, borderRadius: 36, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.55)', border: '1px solid #2A3540', background: '#fff'}}>
            <Img src={staticFile(`stories/shots/${s.shot}-${lang}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
          </div>
        ) : (
          <div style={{position: 'absolute', left: PADX, right: PADX, top: 690, display: 'grid', gap: 26}}>
            {s.pair!.map((src, i) => (
              <div key={src} style={{position: 'relative', height: 410, borderRadius: 18, overflow: 'hidden', border: i === 1 ? `2px solid ${C.tape}` : '1px solid #2A3540'}}>
                <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <span style={{position: 'absolute', left: 18, top: 16, padding: '6px 14px', borderRadius: 4, fontSize: 26, background: i === 1 ? C.tape : 'rgba(16,22,29,.75)', color: i === 1 ? C.graphite : '#fff', fontWeight: 600}}>{PAIR_LABELS[i][lang]}</span>
              </div>
            ))}
          </div>
        )}
      </Frame>
    );
  }
  if (s.kind === 'logo') {
    return (
      <Frame s={s} lang={lang}>
        <Img src={staticFile('brand/mark-white.svg')} style={{position: 'absolute', left: (W - 460) / 2, top: 470, width: 460, height: 460 * 657 / 672}} />
        <div style={{position: 'absolute', left: PADX, right: PADX, top: 1060}}>
          <Title text={t} max={86} lines={2} />
          <Body text={b} />
        </div>
      </Frame>
    );
  }
  // text / list / compare
  return (
    <Frame s={s} lang={lang}>
      <div style={{position: 'absolute', left: PADX, right: PADX, top: sticky ? 400 : s.kind === 'text' && !s.items ? 560 : 420}}>
        <Title text={t} max={sticky ? 92 : 108} lines={sticky ? 4 : 5} />
        {s.kind === 'compare' && <Compare lang={lang} />}
        {s.kind === 'list' && s.items && <><Body text={b} style={{marginTop: 26, color: C.tape}} /><Bullets items={s.items.map((x) => x[lang])} /></>}
        {s.kind === 'text' && <Body text={b} />}
      </div>
    </Frame>
  );
};

/** все картинки-сторис: кадр № i = STILLS[i] (рендер одной последовательностью) */
export const StoryStills: React.FC<{lang: Lang}> = ({lang}) => {
  const i = useCurrentFrame();
  return <StoryCard s={STILLS[Math.min(i, STILLS.length - 1)]} lang={lang} />;
};

/** видео-сторис: ролик + подпись (8 с) */
export const StoryVideo: React.FC<{s: Story; lang: Lang; from?: number; vertical?: boolean}> = ({s, lang, from = 0, vertical = false}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = s.title[lang], b = s.body?.[lang];
  const fadeIn = interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [durationInFrames - 12, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.graphite, color: '#fff', fontFamily: TEXT, opacity: Math.min(fadeIn, fadeOut)}}>
      {vertical ? (
        <>
          <OffthreadVideo src={staticFile(s.video!)} startFrom={Math.round(from * fps)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,22,29,.7) 0%, rgba(16,22,29,0) 20%, rgba(16,22,29,0) 55%, rgba(16,22,29,.92) 80%)'}} />
        </>
      ) : (
        <>
          <OffthreadVideo src={staticFile(s.video!)} startFrom={Math.round(from * fps)} muted style={{position: 'absolute', left: 0, top: 330, width: W, height: W, objectFit: 'cover'}} />
          <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.graphite} 0%, rgba(16,22,29,0) 22%, rgba(16,22,29,0) 48%, rgba(16,22,29,.85) 60%, ${C.graphite} 70%)`}} />
        </>
      )}
      <div style={{position: 'absolute', left: PADX, right: PADX, top: 232, display: 'flex', justifyContent: 'space-between', fontSize: 30, color: 'rgba(255,255,255,.75)'}}>
        <span>{RUBRICS[s.rubric][lang]}</span><span>{DAY_WORD[lang]} {s.day}</span>
      </div>
      <div style={{position: 'absolute', left: PADX, top: 288, width: 120, height: 4, background: C.tape, transformOrigin: '0 50%', scale: `${interpolate(f, [6, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE})} 1`}} />
      <TextBlock top={1180} lift={220}>
        <div style={rise(f, 12, 20)}><Title text={t} max={88} lines={3} /></div>
        {b && <div style={rise(f, 24, 20)}><Body text={b} style={{marginTop: 24}} /></div>}
      </TextBlock>
      <Logo width={190} style={{position: 'absolute', left: PADX, bottom: 300}} />
      {s.ai && <AiLabel lang={lang} style={{position: 'absolute', right: PADX, bottom: 304, fontSize: 24}} />}
    </AbsoluteFill>
  );
};

export const STORY_VIDEO = {fps: 30, seconds: 8};
export {COMMON};
export type {L};
