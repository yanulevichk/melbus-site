# Фильм первого экрана MELBUS — бриф для генерации (Higgsfield)

Утверждено с заказчиком 11.11.2026. Превиз (движение камеры и тайминг): `tools/blender/previz_hero.py`, 42 с, 24 к/с.

## Решения
- **Реализм:** как настоящее кино, реальный масштаб. Фотореализм, кинооптика, глубина резкости, естественные материалы.
- **Свет:** золотой час. Низкое тёплое солнце, длинные тени, тёплые блики на стекле и металле, лёгкая дымка в воздухе.
- **Откуда — куда:** современная квартира в новостройке Варшавы → дом с садом за городом.
- **Бус:** высокий цельнометаллический белый фургон (силуэт как у Mercedes Sprinter), **без значков и надписей производителя**. Оклейка MELBUS:
  - логотип на бортах и задних дверях;
  - бирюзовая полоса `#14DCD5` вдоль низа бортов;
  - графитовые колёсные диски.
- **Коробки:** белый гофрокартон, логотип MELBUS, бирюзовый скотч `#14DCD5`, наклейка комнаты (цветная полоса, номер, QR).
- **Люди:** в фильме их нет (вещи «волшебно» складываются в коробку). Если понадобятся — только руки или силуэты в форме бригады, без лиц.
- **Логотип:** ИИ рисует его примерно на 90% точно. На крупных планах накладываем настоящий логотип при монтаже.
- **Пометка:** в углу ролика «Wizualizacja / Визуализация».

## Общие правила для подсказок (добавлять к каждой)
```
Photorealistic cinematic film, real-world scale, golden hour sunlight, warm low sun, long soft shadows,
subtle atmospheric haze, shallow depth of field, anamorphic lens look, natural materials, high-end commercial.
Keep exactly the camera path, framing, timing and object motion of the reference video.
Do not copy the grey untextured look of the reference — it is only a layout/motion guide.
No text, no brand badges other than the MELBUS logo, no people, no faces.
```

## Куски для Seedance 2.5 (по превизу, каждый ≤ 10 с)
Режим: `omni_reference`. Кусок превиза идёт как `video_references`, кадр стиля — как `image_references`. Сначала черновик 480p (`draft: true`), после утверждения — финал 1080p.

| № | Время | Что в кадре | Ключ подсказки |
|---|---|---|---|
| 1 | 0–11 с | Влёт с высоты над новым жилым комплексом Варшавы, пролёт низко по светлой современной квартире (паркет, большие окна, мебель), вид сверху на плоскую белую заготовку MELBUS, которая складывается в коробку | modern Warsaw residential complex at golden hour, bright minimalist apartment interior, oak floor, large windows, a flat white MELBUS cardboard box blank on the floor folds itself into a box |
| 2 | 11–18,5 с | Вид сверху: мебель по очереди уменьшается и ложится на дно открытой белой коробки | top-down view, furniture magically shrinks and settles inside an open white MELBUS moving box, the box fills up with miniature bed, sofa, fridge, table, bookcase, TV, armchair, rug, lamp, plant |
| 3 | 18,5–25,8 с | Клапаны закрываются, рулон бирюзового скотча обматывает коробку, общий план: белый бус задом к дому, задние двери открыты, пандус, коробка заезжает в кузов, двери закрываются | turquoise tape roll seals the white box, white high-roof panel van with MELBUS livery parked at the curb, rear doors open, loading ramp, the box slides up the ramp into the empty cargo area, doors close |
| 4 | 25,8–32 с | Камера отъезжает за бус, бус трогается, камера ныряет под днище (кардан, мост, выхлоп, рессоры), вылетает вперёд, поднимается, бус проезжает под ней; город сменяется пригородом | low tracking shot, camera flies under the moving van revealing detailed chassis, driveshaft, rear axle, exhaust, suspension, then rises above the street as the van drives below; city turns into green suburbs |
| 5 | 32–42 с | Бус у дома с садом, двери, пандус, коробка запрыгивает в дом; сверху коробка раскрывается, вещи вырастают и встают по местам; спираль камеры в общий план | suburban house with a garden, lawn and hedge at golden hour, the box unpacks itself, furniture grows back to full size and lands in place in a warm modern living room, camera spirals up to a wide establishing shot |

## Кадры стиля (картинки, до видео)
По одному на кусок. Модель `gpt_image_2_6`, около 0,25 кредита за кадр. Источник — кадр превиза (`image_references`) и логотип MELBUS (media_id `8babc37b-e5c9-40e0-94c3-ea502fd1b05d`). Задача кадра — утвердить вид: свет, материалы, бус, квартиры. После утверждения кадр стиля идёт образцом в видео.

## Цены (проверено 11.11.2026)
- Картинка — 0,25 кр.
- Seedance 2.5: 8 с черновик 480p — 24 кр., 1080p — 128 кр.
- Перед каждой генерацией называем цену и ждём «да».
