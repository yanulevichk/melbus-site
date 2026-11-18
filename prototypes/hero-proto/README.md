# Прототипы первого экрана (18.11.2026)

Артефакт: https://claude.ai/artifact/BxitvRvMTBgp4pRpRtQ6pQ — «Свет» (слово-окно → фильм), «Кино» (то же + тёмная подача, зерно, слова из размытия — рекомендовано), «Ночь» (фильм по кругу без прокрутки).
Страница выбора 8 эффектов: https://claude.ai/artifact/Umkh6qKTYLxZtMbbQgNatq (`prototypes/hero-lab/`).

Кадры (в git не кладём, собираются командой из корня проекта), фильм 10 с из кусков 0–4, 6.5–9.5, 10–11.5, 12.5–14.3 с, 15 к/с:

```bash
FC="[0:v]trim=0:4,setpts=PTS-STARTPTS[a];[0:v]trim=6.5:9.5,setpts=PTS-STARTPTS[b];[0:v]trim=10:11.5,setpts=PTS-STARTPTS[c];[0:v]trim=12.5:14.3,setpts=PTS-STARTPTS[d];[a][b][c][d]concat=n=4:v=1:a=0,fps=15"
ffmpeg -i public/video/film-1280.mp4 -filter_complex "$FC,scale=1280:-2[o]" -map "[o]" -c:v libwebp -quality 70 prototypes/hero-proto/frames/d/%04d.webp
ffmpeg -i public/video/film-m.mp4 -filter_complex "$FC,scale=540:-2[o]" -map "[o]" -c:v libwebp -quality 68 prototypes/hero-proto/frames/m/%04d.webp
```
