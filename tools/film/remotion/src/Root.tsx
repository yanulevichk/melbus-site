import React from 'react';
import {Composition} from 'remotion';
import {Hero} from './Hero';
import {DURATION, FPS} from './remap';
import {ReelFilm, FILM_FRAMES, END_FRAMES} from './social/ReelFilm';
import {ReelClip, CLIP_FRAMES, CLIP_END} from './social/ReelClip';
import {Carousel, SLIDE_COUNT} from './social/Carousel';
import {OgCard} from './social/OgCard';

export const Root: React.FC = () => (
  <>
    {/* Первый экран сайта: короткая динамичная версия, бесшовно повторяется */}
    <Composition id="Hero" component={Hero} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{label: true}} />
    {/* То же без надписи — если пометку «Визуализация» ставит сам сайт */}
    <Composition id="HeroClean" component={Hero} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{label: false}} />
    {/* ---------- соцсети ---------- */}
    <Composition id="ReelFilm" component={ReelFilm} durationInFrames={FILM_FRAMES + END_FRAMES} fps={24} width={1080} height={1920} />
    <Composition id="ReelPrice" component={ReelClip} durationInFrames={CLIP_FRAMES + CLIP_END} fps={24} width={1080} height={1920}
      defaultProps={{clip: 'phone.mp4', square: true, title: ['Цена', 'по видео'], endTitle: 'Цена, которая не изменится',
        lines: ['Снимите квартиру на телефон — две-три минуты', 'Получите окончательную цену в течение двух часов днём', 'В день переезда — никаких доплат']}} />
    <Composition id="ReelCare" component={ReelClip} durationInFrames={CLIP_FRAMES + CLIP_END} fps={24} width={1080} height={1920}
      defaultProps={{clip: 'gloves.mp4', square: true, title: ['Аккуратность,', 'которую видно'], endTitle: 'Вещи клиента — как свои',
        lines: ['Чистые перчатки и бахилы — до порога', 'Посуда — в бумагу, коробки — с перегородками', 'Каждая коробка подписана: комната и номер']}} />
    <Composition id="ReelVan" component={ReelClip} durationInFrames={CLIP_FRAMES + CLIP_END} fps={24} width={1080} height={1920}
      defaultProps={{clip: 'van.mp4', square: false, title: ['Только', 'ваши вещи'], endTitle: 'Бус MELBUS — только для вас',
        lines: ['Без перегрузок и попутных грузов', 'Варшава и 150 км вокруг — 7 дней в неделю', 'Польша и Европа — по запросу']}} />
    <Composition id="Carousel" component={Carousel} durationInFrames={SLIDE_COUNT} fps={1} width={1080} height={1350} />
    <Composition id="OgCard" component={OgCard} durationInFrames={1} fps={1} width={1200} height={630} />
  </>
);
