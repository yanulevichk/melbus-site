import React from 'react';
import {Composition} from 'remotion';
import {Hero} from './Hero';
import {DURATION, FPS} from './remap';

export const Root: React.FC = () => (
  <>
    {/* Первый экран сайта: короткая динамичная версия, бесшовно повторяется */}
    <Composition id="Hero" component={Hero} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{label: true}} />
    {/* То же без надписи — если пометку «Визуализация» ставит сам сайт */}
    <Composition id="HeroClean" component={Hero} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{label: false}} />
  </>
);
