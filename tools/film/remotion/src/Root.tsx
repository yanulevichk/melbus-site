import React from 'react';
import {Composition} from 'remotion';
import {Hero} from './Hero';
import {DURATION, FPS} from './remap';
import {ReelFilm, FILM_FRAMES, END_FRAMES} from './social/ReelFilm';
import {ReelClip, CLIP_FRAMES, CLIP_END} from './social/ReelClip';
import {Carousel, SLIDE_COUNT} from './social/Carousel';
import {OgCard} from './social/OgCard';
import {Avatar, CoverFB, Highlight, HIGHLIGHTS, HighlightV2, HIGHLIGHTS_V2} from './social/ProfileKit';
import {StoryStills, StoryVideo, STORY_VIDEO} from './social/Story';
import {CarouselHours, COVERS, HOURS_SLIDES, ReelCovers} from './social/PostKit';
import {STILLS, VIDEOS, VIDEO_OPTS} from './social/stories';

import {LANGS} from './social/texts';

export const Root: React.FC = () => (
  <>
    {/* Первый экран сайта: короткая динамичная версия, бесшовно повторяется */}
    <Composition id="Hero" component={Hero} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{label: true}} />
    {/* То же без надписи — если пометку «Визуализация» ставит сам сайт */}
    <Composition id="HeroClean" component={Hero} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{label: false}} />
    {/* ---------- соцсети: каждый формат сразу на всех языках из texts.ts (ID: <формат>-<язык>) ---------- */}
    {LANGS.map((lang) => (
      <React.Fragment key={lang}>
        <Composition id={`ReelFilm-${lang}`} component={ReelFilm} durationInFrames={FILM_FRAMES + END_FRAMES} fps={24} width={1080} height={1920} defaultProps={{lang}} />
        {(['Price', 'Care', 'Van', 'Seal', 'Qr', 'FirstNight', 'Wardrobe'] as const).map((reel) => (
          <Composition key={reel} id={`Reel${reel}-${lang}`} component={ReelClip} durationInFrames={CLIP_FRAMES + CLIP_END} fps={24} width={1080} height={1920} defaultProps={{reel, lang}} />
        ))}
        <Composition id={`Carousel-${lang}`} component={Carousel} durationInFrames={SLIDE_COUNT} fps={1} width={1080} height={1350} defaultProps={{lang}} />
        {/* посты для профиля (13.11.2026): обложки всех Reels и карусель «Мы не продаём часы» */}
        <Composition id={`ReelCovers-${lang}`} component={ReelCovers} durationInFrames={COVERS.length} fps={24} width={1080} height={1920} defaultProps={{lang}} />
        <Composition id={`CarouselHours-${lang}`} component={CarouselHours} durationInFrames={HOURS_SLIDES} fps={1} width={1080} height={1350} defaultProps={{lang}} />
        <Composition id={`OgCard-${lang}`} component={OgCard} durationInFrames={1} fps={1} width={1200} height={630} defaultProps={{lang}} />
        <Composition id={`CoverFB-${lang}`} component={CoverFB} durationInFrames={1} fps={1} width={1640} height={624} defaultProps={{lang}} />
        {/* сторис «Дневник запуска» (stories.ts): все картинки — одной последовательностью, видео — по одному */}
        <Composition id={`Stories-${lang}`} component={StoryStills} durationInFrames={STILLS.length} fps={1} width={1080} height={1920} defaultProps={{lang}} />
        {VIDEOS.map((s) => (
          <Composition key={s.id} id={`Story-${s.id}-${lang}`} component={StoryVideo} durationInFrames={Math.round(STORY_VIDEO.fps * (VIDEO_OPTS[s.id]?.seconds ?? STORY_VIDEO.seconds))} fps={STORY_VIDEO.fps} width={1080} height={1920} defaultProps={{s, lang, ...VIDEO_OPTS[s.id]}} />
        ))}
      </React.Fragment>
    ))}
    {/* оформление профиля */}
    <Composition id="Avatar" component={Avatar} durationInFrames={1} fps={1} width={1080} height={1080} />
    <Composition id="Highlights" component={Highlight} durationInFrames={HIGHLIGHTS.length} fps={1} width={1080} height={1920} />
    <Composition id="HighlightsV2" component={HighlightV2} durationInFrames={HIGHLIGHTS_V2.length} fps={1} width={1080} height={1920} />
  </>
);
