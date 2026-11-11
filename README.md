# MELBUS — сайт переездов

Astro + Tailwind, Lenis + GSAP (ScrollTrigger, SplitText), Vanta. Языки: RU (черновик) → PL (основной), UA, EN.

## Запуск
```bash
npm install
npm run dev      # разработка
npm run build    # сборка в dist/
```

## Где что лежит
- `src/config/brand.ts` — название, контакты, реквизиты (TODO: заменить заглушки)
- `src/styles/global.css` — фирменные цвета и шрифты
- `src/i18n/routes.ts` — адреса страниц на всех языках
- `src/data/services.ts` — услуги
- `src/components/SceneSlot.astro` — слот сцены «под скролл» (кадры кладутся в `public/scenes/<id>/`)
- `src/components/VideoSlot.astro` — слот видео (файлы в `public/video/`)
- `src/scripts/motion.ts` — движок анимаций
- `brand/` — логотип: исходники, генераторы SVG, PNG-экспорт, лист фирменного стиля
- `prototypes/` — демо анимаций и лист стиля
