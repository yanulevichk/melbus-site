# Прототипы первого экрана (18.11.2026)

Живут на сайте (скрыто от поиска): https://melbus-site.pages.dev/proto/hero/ — исходники `public/proto/hero/`.
«Свет» (слово-окно → фильм), «Кино» (то же + тёмная подача, зерно, слова из размытия — рекомендовано), «Ночь» (фильм по кругу без прокрутки).
Страница выбора 8 эффектов: https://claude.ai/artifact/Umkh6qKTYLxZtMbbQgNatq (`prototypes/hero-lab/`).

Движок v2 (`proto.js`): всё на одном canvas — кадр, кино-обработка (затемнение + виньетка) и слово MELBUS (буквы вырезаны
в заливке, увеличение от ножки M); кадры грузятся «1-й → каждый 8-й → остальные» и декодируются заранее; на склейках
соседние кадры не смешиваются. Без backdrop-filter и CSS-фильтров на весь экран — плавно на телефоне.

Кадры: фильм 10 с из кусков 0–4, 6.5–9.5, 10–11.5, 12.5–14.3 с, 24 к/с (248 кадров; склейки после 95, 167, 203):

```bash
FC="[0:v]trim=0:4,setpts=PTS-STARTPTS[a];[0:v]trim=6.5:9.5,setpts=PTS-STARTPTS[b];[0:v]trim=10:11.5,setpts=PTS-STARTPTS[c];[0:v]trim=12.5:14.3,setpts=PTS-STARTPTS[d];[a][b][c][d]concat=n=4:v=1:a=0"
ffmpeg -i public/video/film-1280.mp4 -filter_complex "$FC,scale=1280:-2[o]" -map "[o]" -c:v libwebp -quality 66 public/proto/hero/frames/d/%04d.webp
ffmpeg -i public/video/film-m.mp4 -filter_complex "$FC,scale=540:-2[o]" -map "[o]" -c:v libwebp -quality 64 public/proto/hero/frames/m/%04d.webp
```
