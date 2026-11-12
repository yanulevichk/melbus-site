// Картинка-превью для ссылок на сайт (Open Graph 1200×630): бус MELBUS + заголовок.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {AiLabel, C, DISPLAY, loadBrandFonts, Logo, TEXT} from './brand';

loadBrandFonts();

export const OgCard: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.graphite, color: '#fff'}}>
    {/* бус справа: логотип на борту виден рядом с заголовком, слева — графитовая панель под текст */}
    <Img src={staticFile('stills/van.jpg')} style={{position: 'absolute', top: 0, left: 470, height: '100%', width: 1126, objectFit: 'cover'}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(16,22,29,1) 0%, rgba(16,22,29,1) 40%, rgba(16,22,29,.6) 46%, rgba(16,22,29,0) 56%)'}} />
    <div style={{position: 'absolute', left: 64, top: 64, bottom: 64, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <Logo width={280} />
      <div>
        <div style={{fontFamily: DISPLAY, fontWeight: 200, fontSize: 80, letterSpacing: '-0.055em', lineHeight: 0.95}}>Переезд<br />без доплат</div>
        <div style={{width: 200, height: 4, background: C.tape, margin: '34px 0 26px'}} />
        <div style={{fontFamily: TEXT, fontSize: 28, lineHeight: 1.4, color: 'rgba(255,255,255,.84)', maxWidth: 500}}>Цена по видео — окончательная.<br />Варшава, Польша, Европа.</div>
      </div>
    </div>
    <AiLabel style={{position: 'absolute', right: 32, bottom: 24, fontSize: 16}} />
  </AbsoluteFill>
);
