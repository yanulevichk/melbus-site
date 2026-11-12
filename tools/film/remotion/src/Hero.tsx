import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {DURATION, SRC_AT, SRC_FPS, SRC_FRAMES, speedAt} from './remap';

// Исходник: кадры 1080p с поднятой резкостью, 72 к/с (между каждыми двумя настоящими кадрами — два дорисованных)
const frameSrc = (n: number) => {
  const k = Math.min(SRC_FRAMES - 1, Math.max(0, Math.round(n)));
  return staticFile(`frames72/f${String(k).padStart(5, '0')}.jpg`);
};

const LOOP_FADE = 12; // кадров мягкого перехода конца в начало (бесшовный повтор)

const layer: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'};

export const Hero: React.FC<{label?: boolean}> = ({label = true}) => {
  const f = useCurrentFrame();
  const t = SRC_AT[f];
  const v = speedAt(t);
  // На обычной и высокой скорости — только настоящие кадры (самые чёткие),
  // дорисованные кадры — только в замедлениях, где без них было бы дёргано.
  const idx = v >= 0.95 ? Math.round(t * 24) * (SRC_FPS / 24) : Math.round(t * SRC_FPS);
  const loopK = interpolate(f, [DURATION - LOOP_FADE, DURATION - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#10161D'}}>
      <Img src={frameSrc(idx)} style={layer} />
      {loopK > 0 ? <Img src={frameSrc(0)} style={{...layer, opacity: loopK}} /> : null}
      {label ? (
        <div style={{position: 'absolute', right: 34, bottom: 26, fontFamily: 'DejaVu Sans, sans-serif', fontSize: 22,
          letterSpacing: 0.3, color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>
          Wizualizacja / Визуализация
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
