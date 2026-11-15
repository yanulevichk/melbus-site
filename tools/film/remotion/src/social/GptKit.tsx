// Посты и сторис из картинок ChatGPT (банк подсказок — gptbank.ts). Картинка: public/gpt/<id>.jpg (копирует render-gpt.sh из marketing/gpt/).
// Пост 4:5 (1080×1350) и сторис 9:16 (1080×1920, «Новый пост») — тексты на 4 языках, пометка «Визуализация».
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {AiLabel, C, DISPLAY, loadBrandFonts, Logo, TEXT} from './brand';
import {type Lang} from './texts';
import {fitWrap} from './fit';
import {GPT_POSTS, GPT_RUBRICS, NEW_POST, type GptPost} from './gptbank';
import media from './gpt-media.json';

loadBrandFonts();

/** готовые (есть картинка) — в порядке банка; если ни одной — первая запись как образец */
export const GPT_READY: GptPost[] = GPT_POSTS.filter((p) => (media.ready as string[]).includes(p.id));
const list = GPT_READY.length ? GPT_READY : GPT_POSTS.slice(0, 1);
const img = (p: GptPost) => ((media.ready as string[]).includes(p.id) ? staticFile(`gpt/${p.id}.jpg`) : null);

const Photo: React.FC<{p: GptPost; pos: string}> = ({p, pos}) => {
  const src = img(p);
  return src ? <Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
    : <AbsoluteFill style={{background: '#1B2530', alignItems: 'center', justifyContent: 'center', fontFamily: TEXT, fontSize: 36, color: 'rgba(255,255,255,.5)'}}>{`gpt/${p.id}.jpg`}</AbsoluteFill>;
};

export const GptPostCard: React.FC<{p: GptPost; lang: Lang}> = ({p, lang}) => (
  <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff', fontFamily: TEXT}}>
    <Photo p={p} pos="50% 40%" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,22,29,.55) 0%, rgba(16,22,29,0) 20%, rgba(16,22,29,0) 44%, rgba(16,22,29,.9) 76%, rgba(16,22,29,.96) 100%)'}} />
    <div style={{position: 'absolute', left: 72, right: 72, top: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Logo width={230} />
      <div style={{fontSize: 28, color: 'rgba(255,255,255,.85)', textShadow: '0 2px 12px rgba(0,0,0,.6)'}}>{GPT_RUBRICS[p.rubric][lang]}</div>
    </div>
    <div style={{position: 'absolute', left: 72, right: 72, bottom: 120}}>
      <div style={{width: 120, height: 5, background: C.tape, marginBottom: 34}} />
      <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: fitWrap(p.title[lang], 96, 936, 3, 0.66), letterSpacing: '-0.05em', lineHeight: 0.98}}>{p.title[lang]}</div>
      <div style={{fontSize: 36, lineHeight: 1.4, color: 'rgba(255,255,255,.85)', marginTop: 24, maxWidth: 900}}>{p.sub[lang]}</div>
    </div>
    <AiLabel lang={lang} style={{position: 'absolute', right: 72, bottom: 56, fontSize: 22}} />
  </AbsoluteFill>
);

export const GptStoryCard: React.FC<{p: GptPost; lang: Lang}> = ({p, lang}) => (
  <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff', fontFamily: TEXT}}>
    <Photo p={p} pos="50% 50%" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,22,29,.7) 0%, rgba(16,22,29,0) 18%, rgba(16,22,29,0) 50%, rgba(16,22,29,.9) 72%, rgba(16,22,29,.96) 100%)'}} />
    <div style={{position: 'absolute', left: 84, right: 84, top: 232, display: 'flex', justifyContent: 'space-between', fontSize: 30, color: 'rgba(255,255,255,.85)', textShadow: '0 2px 12px rgba(0,0,0,.7)'}}>
      <span>{GPT_RUBRICS[p.rubric][lang]}</span><span style={{color: C.tape}}>{NEW_POST[lang]}</span>
    </div>
    <div style={{position: 'absolute', left: 84, top: 288, width: 120, height: 4, background: C.tape}} />
    <div style={{position: 'absolute', left: 84, right: 84, bottom: 390}}>
      <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: fitWrap(p.title[lang], 96, 912, 3, 0.66), letterSpacing: '-0.05em', lineHeight: 1}}>{p.title[lang]}</div>
      <div style={{fontSize: 38, lineHeight: 1.42, color: 'rgba(255,255,255,.85)', marginTop: 28}}>{p.sub[lang]}</div>
    </div>
    <Logo width={190} style={{position: 'absolute', left: 84, bottom: 300}} />
    <AiLabel lang={lang} style={{position: 'absolute', right: 84, bottom: 304, fontSize: 24}} />
  </AbsoluteFill>
);

export const GPT_COUNT = list.length;
export const GptPosts: React.FC<{lang: Lang}> = ({lang}) => <GptPostCard p={list[Math.min(useCurrentFrame(), list.length - 1)]} lang={lang} />;
export const GptStories: React.FC<{lang: Lang}> = ({lang}) => <GptStoryCard p={list[Math.min(useCurrentFrame(), list.length - 1)]} lang={lang} />;
