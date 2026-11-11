"""Собирает страницу фирменного стиля MELBUS (brand/brand-sheet.html) со встроенными SVG."""
import base64
B = '/home/user/moving-site/public/brand/'
def uri(name):
    return 'data:image/svg+xml;base64,' + base64.b64encode(open(B + name + '.svg', 'rb').read()).decode()

def qr(x, y, s):
    pat = '1110111100010110101011010101100011011101110100111'
    out = []
    for i, c in enumerate(pat):
        if c == '1':
            out.append(f'<rect x="{x + (i % 7) * s}" y="{y + (i // 7) * s}" width="{s}" height="{s}" fill="#10161D"/>')
    return ''.join(out)

def sticker(room, color, num):
    return (f'<rect x="0" y="0" width="150" height="64" rx="6" fill="#fff" stroke="#C9D0D8"/>'
            f'<rect x="0" y="0" width="14" height="64" rx="6" fill="{color}"/><rect x="8" y="0" width="6" height="64" fill="{color}"/>'
            f'<text x="24" y="27" font-family="Onest, sans-serif" font-weight="700" font-size="13" fill="#10161D">{room}</text>'
            f'<text x="24" y="47" font-family="Onest, sans-serif" font-size="11" fill="#5B6673">№ {num} · MELBUS</text>'
            + qr(114, 18, 4))

def box():
    lock = uri('melbus-light'); mark = uri('mark-light')
    return f'''<svg viewBox="0 0 600 520" role="img" aria-label="Белая коробка MELBUS с бирюзовым скотчем и наклейкой комнаты">
  <ellipse cx="300" cy="470" rx="230" ry="34" fill="#10161D" opacity=".10"/>
  <!-- левая грань -->
  <g transform="matrix(0.866,0.5,0,1,127,160)">
    <rect width="200" height="200" fill="#FFFFFF" stroke="#C9D0D8" stroke-width="1"/>
    <rect x="85" y="0" width="30" height="58" fill="#14DCD5"/>
    <image href="{lock}" x="22" y="118" width="156" height="32"/>
    <text x="100" y="168" text-anchor="middle" font-family="Onest, sans-serif" font-size="9" letter-spacing="1.5" fill="#5B6673">ПЕРЕЕЗДЫ · УПАКОВКА · ПЕРЕВОЗКИ</text>
  </g>
  <!-- правая грань -->
  <g transform="matrix(0.866,-0.5,0,1,300,260)">
    <rect width="200" height="200" fill="#E6EAEE" stroke="#C9D0D8" stroke-width="1"/>
    <g transform="translate(25,70)">{sticker('КУХНЯ', '#F2B705', '07')}</g>
    <image href="{mark}" x="152" y="150" width="34" height="34" opacity=".9"/>
  </g>
  <!-- верхняя грань -->
  <g transform="matrix(0.866,-0.5,0.866,0.5,127,160)">
    <rect width="200" height="200" fill="#F5F7F9" stroke="#C9D0D8" stroke-width="1"/>
    <rect x="0" y="85" width="200" height="30" fill="#14DCD5"/>
    <g fill="#0B6E6A" opacity=".55">{''.join(f'<rect x="{12 + i * 46}" y="96" width="22" height="8" rx="2"/>' for i in range(4))}</g>
  </g>
</svg>'''

rooms = [('КУХНЯ', '#F2B705'), ('СПАЛЬНЯ', '#8B6CEF'), ('ГОСТИНАЯ', '#14DCD5'), ('ВАННАЯ', '#3D8BFD'), ('ДЕТСКАЯ', '#FF7A45'), ('КАБИНЕТ', '#10161D')]
stickers = ''.join(f'<svg viewBox="-2 -2 154 68" class="stk">{sticker(r, c, f"{i + 1:02d}")}</svg>' for i, (r, c) in enumerate(rooms))

palette = [
    ('Графит', '#10161D', 'Тёмный фон, форма, текст на светлом', '#F4F6F8'),
    ('Бирюза', '#14DCD5', 'Знак, «BUS», кнопки, акценты на тёмном. Текст на кнопке — графит, 10,6:1', '#10161D'),
    ('Глубокая бирюза', '#077E79', 'Ссылки и акцентный текст на белом, 4,9:1', '#FFFFFF'),
    ('Серебро', '#DCE1E7', 'Правая половина знака на тёмном', '#10161D'),
    ('Сталь', '#8F9AA7', 'Второстепенный текст на тёмном, 6,4:1', '#10161D'),
    ('Бумага', '#F4F6F8', 'Светлые разделы сайта, фон коробки', '#10161D'),
]
pal = ''.join(f'<div class="sw"><div class="sw__c" style="background:{h};color:{t}"><b>{h}</b></div><div class="sw__t"><strong>{n}</strong><span>{u}</span></div></div>' for n, h, u, t in palette)

html = f'''<title>Фирменный стиль MELBUS</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap">
<style>
/* Layout: лист фирменного стиля — тёмная обложка, затем светлые разделы на утверждение. Единый вид, без смены темы. */
:root{{--graphite:#10161D;--teal:#14DCD5;--teal-deep:#077E79;--paper:#F4F6F8;--ink:#10161D;--muted:#5B6673;--line:#DDE2E7;--white:#FFFFFF;
--f:"Onest","Segoe UI",system-ui,sans-serif;--fd:"Unbounded","Arial Black",system-ui,sans-serif;color-scheme:light}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--paper);color:var(--ink);font:400 16px/1.55 var(--f)}}
.wrap{{max-width:1120px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}}
h1,h2{{font-family:var(--fd);font-weight:600;letter-spacing:-.025em;line-height:1.05;margin:0;text-wrap:balance}}
h1{{font-size:clamp(30px,6vw,64px)}}h2{{font-size:clamp(22px,3.4vw,36px)}}
.eb{{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}}
p{{margin:0;max-width:62ch}}
.cover{{background:var(--graphite);color:var(--paper);padding-block:48px 56px}}
.cover .eb{{color:#9AA5B1}}
.cover__in{{display:grid;gap:28px}}
.cover img.lk{{width:min(460px,90%);height:auto}}
.cover p{{color:#9AA5B1}}
.sec{{padding-block:48px;border-bottom:1px solid var(--line);display:grid;gap:24px}}
.grid{{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}}
.card{{border-radius:16px;padding:28px;display:grid;place-items:center;min-height:170px;border:1px solid var(--line);position:relative}}
.card img{{max-width:100%;height:auto}}
.card small{{position:absolute;left:14px;bottom:10px;font-size:11px;letter-spacing:.06em;color:inherit;opacity:.7}}
.d{{background:var(--graphite);color:#9AA5B1;border-color:var(--graphite)}}.l{{background:#fff;color:var(--muted)}}.t{{background:var(--teal);color:var(--graphite);border-color:var(--teal)}}
.sizes{{display:flex;align-items:flex-end;gap:22px;flex-wrap:wrap;background:var(--graphite);border-radius:16px;padding:24px}}
.sizes span{{display:grid;gap:6px;justify-items:center;color:#9AA5B1;font-size:11px}}
.sw{{display:grid;grid-template-rows:auto 1fr;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#fff}}
.sw__c{{height:96px;display:flex;align-items:flex-end;padding:12px;font-size:13px}}
.sw__t{{padding:12px 14px;display:grid;gap:4px;font-size:14px}}.sw__t span{{color:var(--muted);font-size:13px}}
.type{{display:grid;gap:18px}}
.type .h{{font-family:var(--fd);font-weight:600;font-size:clamp(28px,5vw,52px);letter-spacing:-.03em;line-height:1}}
.type .h em{{font-style:normal;color:var(--teal-deep)}}
.type .b{{font-size:18px;max-width:56ch}}
.type small{{color:var(--muted)}}
.boxrow{{display:grid;gap:24px;align-items:center}}
@media(min-width:860px){{.boxrow{{grid-template-columns:1.1fr 1fr}}}}
.boxrow svg{{width:100%;height:auto}}
.stks{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}}
.stk{{width:100%;height:auto}}
.tape{{height:44px;border-radius:6px;background:var(--teal);display:flex;align-items:center;gap:28px;overflow:hidden;padding-left:16px;margin-top:8px}}
.tape img{{height:22px;width:auto;flex:none}}
.tape b{{font-family:var(--fd);font-size:13px;letter-spacing:.06em;color:var(--graphite);white-space:nowrap}}
ul.rules{{margin:0;padding-left:20px;display:grid;gap:8px}}
.ask{{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px;display:grid;gap:8px}}
</style>

<header class="cover"><div class="wrap cover__in">
  <span class="eb">Фирменный стиль · версия 2 · на утверждение</span>
  <img class="lk" src="{uri('melbus-dark')}" alt="MELBUS">
  <p>Векторная версия логотипа по вашему эскизу, палитра с проверенной читаемостью, шрифты и первые фирменные предметы.</p>
</div></header>

<main class="wrap">
  <section class="sec">
    <span class="eb">01 · Логотип</span><h2>Четыре версии на все случаи</h2>
    <div class="grid">
      <div class="card d"><img src="{uri('melbus-dark')}" alt="Логотип на тёмном" width="300"><small>на тёмном</small></div>
      <div class="card l"><img src="{uri('melbus-light')}" alt="Логотип на светлом" width="300"><small>на светлом</small></div>
      <div class="card d"><img src="{uri('melbus-white')}" alt="Белый логотип в один цвет" width="300"><small>один цвет · вышивка, оклейка</small></div>
      <div class="card t"><img src="{uri('melbus-black')}" alt="Графитовый логотип на бирюзе" width="300"><small>на бирюзе</small></div>
    </div>
    <p>Надпись переведена в кривые, поэтому выглядит одинаково везде. Шрифт надписи — Krona One. Правило: «MEL» белым или графитом, «BUS» бирюзой.</p>
  </section>

  <section class="sec">
    <span class="eb">01b · Форма знака</span><h2>Два квадрата с отверстием по центру</h2>
    <div class="grid">
      <div class="card d"><img src="{uri('mark-dark')}" alt="Вариант D" width="150"><small>D — квадраты сцеплены, как в эскизе · выбран</small></div>
      <div class="card d"><img src="{uri('alt-mark-C-dark')}" alt="Вариант C" width="150"><small>C — верхний квадрат целиком поверх нижнего</small></div>
    </div>
    <p>Каждый квадрат — рамка в изометрии: задняя стенка (шеврон вверх) и передняя (V вниз), между ними сквозное отверстие. Левые стороны бирюзовые, правые серебряные, передние стенки темнее — так знак остаётся объёмным даже плоским.</p>
  </section>

  <section class="sec">
    <span class="eb">02 · Знак отдельно</span><h2>Читается от вывески до иконки 16 px</h2>
    <div class="sizes">
      {''.join(f'<span><img src="{uri("mark-dark")}" alt="" width="{s}" height="{round(s*1.0)}">{s}px</span>' for s in (160, 96, 48, 32, 16))}
      <span><img src="{uri('mark-white')}" alt="" width="48" height="48">белый</span>
    </div>
  </section>

  <section class="sec">
    <span class="eb">03 · Цвета</span><h2>Графит и бирюза</h2>
    <div class="grid">{pal}</div>
    <p>Яркая бирюза — только на тёмном фоне или как фон кнопки. Для текста на белом — глубокая бирюза: яркая на белом не читается (1,7:1).</p>
  </section>

  <section class="sec">
    <span class="eb">04 · Шрифты</span><h2>Unbounded и Onest</h2>
    <div class="type">
      <div class="h">Переезд <em>без доплат.</em><br>Przeprowadzka bez dopłat.</div>
      <p class="b">Onest — для текстов и интерфейса: спокойный, хорошо читается на телефоне, есть кириллица и польские буквы. Unbounded — для заголовков: широкий и технологичный, перекликается с надписью логотипа.</p>
      <small>Оба шрифта бесплатные (Google Fonts), подходят для сайта и печати.</small>
    </div>
  </section>

  <section class="sec">
    <span class="eb">05 · Белая коробка</span><h2>Коробка, скотч и наклейки</h2>
    <div class="boxrow">
      {box()}
      <div style="display:grid;gap:14px">
        <p>Белая гофрокоробка: логотип на длинной стороне, наклейка комнаты на короткой, бирюзовый скотч MELBUS. Цвет полосы наклейки — комната, номер — коробка, QR — список вещей.</p>
        <div class="stks">{stickers}</div>
        <div class="tape">{''.join(f'<img src="{uri("mark-black")}" alt=""><b>MELBUS</b>' for _ in range(8))}</div>
      </div>
    </div>
  </section>

  <section class="sec">
    <span class="eb">06 · Правила</span><h2>Чтобы стиль не «поплыл»</h2>
    <ul class="rules">
      <li>Вокруг логотипа свободное поле не меньше высоты буквы «M».</li>
      <li>Не растягивать, не поворачивать, не добавлять тени, обводки и градиенты.</li>
      <li>Объёмная версия знака с бликами — только для видео и «вау»-моментов на сайте, не для печати.</li>
      <li>На фотографиях и видео логотип ставится поверх готового кадра, его не генерирует ИИ.</li>
    </ul>
  </section>

  <section class="sec" style="border:0">
    <div class="ask"><strong>Что утвердить</strong><span>1 — логотип · 2 — цвета · 3 — шрифты · 4 — коробка и наклейки. Ответьте в чате: «да» или что изменить.</span></div>
  </section>
</main>
'''
open('/home/user/moving-site/brand/brand-sheet.html', 'w').write(html)
print('ok', len(html))
