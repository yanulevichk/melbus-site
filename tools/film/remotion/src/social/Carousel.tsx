// Карусель 4:5 (Instagram/Facebook): обложка + 6 шагов переезда. Кадры — из нашего фильма (1080p, с резкостью).
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {AiLabel, C, DISPLAY, loadBrandFonts, Logo, TEXT} from './brand';

loadBrandFonts();

const shot = (t: number) => staticFile(`frames72/f${String(Math.round(t * 72)).padStart(5, '0')}.jpg`);

// [время кадра в исходном фильме, сдвиг кадрирования по горизонтали %, номер, заголовок, текст]
const SLIDES: [number, number, string, string, string][] = [
  [12.4, 50, '', 'Переезд\nза 6 шагов', 'От видео на телефоне до последней собранной полки.'],
  [6.2, 55, '1', 'Видео', 'Снимаете квартиру на телефон: две-три минуты, комната за комнатой.'],
  [18.1, 50, '2', 'Цена', 'В течение двух часов днём присылаем окончательную цену и список вещей.'],
  [24.45, 50, '3', 'Бронь', 'Подтверждаете предоплатой BLIK или картой — дата закреплена за вами.'],
  [20.0, 35, '4', 'Упаковка', 'Бригада в форме, перчатках и бахилах упаковывает всё по комнатам.'],
  [26.6, 50, '5', 'Дорога', 'Бус MELBUS везёт только ваши вещи, без перегрузок по пути.'],
  [41.7, 50, '6', 'Новый дом', 'Заносим, собираем мебель и расставляем всё по местам.'],
];
export const SLIDE_COUNT = SLIDES.length;

export const Carousel: React.FC = () => {
  const i = useCurrentFrame();
  const [t, x, n, title, text] = SLIDES[Math.min(i, SLIDES.length - 1)];
  const cover = n === '';
  return (
    <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff'}}>
      <Img src={shot(t)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${x}% 50%`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,22,29,.55) 0%, rgba(16,22,29,0) 26%, rgba(16,22,29,0) 42%, rgba(16,22,29,.92) 82%)'}} />
      <div style={{position: 'absolute', left: 64, right: 64, top: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Logo width={250} />
        <div style={{fontFamily: TEXT, fontSize: 28, color: 'rgba(255,255,255,.75)'}}>{i + 1} / {SLIDES.length}</div>
      </div>
      <div style={{position: 'absolute', left: 64, right: 64, bottom: 110}}>
        {!cover && <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: 220, lineHeight: 0.8, letterSpacing: '-0.06em', marginBottom: 28}}>{n}</div>}
        <div style={{width: cover ? 300 : 120, height: 4, background: C.tape, marginBottom: 34}} />
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: cover ? 116 : 84, letterSpacing: '-0.055em', lineHeight: 0.95, whiteSpace: 'pre-line'}}>{title}</div>
        <div style={{fontFamily: TEXT, fontSize: 36, lineHeight: 1.45, color: 'rgba(255,255,255,.84)', marginTop: 28, maxWidth: 860}}>{text}</div>
        {cover && <div style={{fontFamily: TEXT, fontSize: 30, color: C.tape, marginTop: 40}}>Листайте</div>}
      </div>
      <AiLabel style={{position: 'absolute', right: 64, bottom: 48, fontSize: 20}} />
    </AbsoluteFill>
  );
};
