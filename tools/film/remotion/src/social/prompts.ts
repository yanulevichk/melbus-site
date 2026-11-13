/**
 * ПОДСКАЗКИ ДЛЯ ГЕНЕРАЦИИ (картинки в ChatGPT / GPT Image, короткие видео в Higgsfield).
 * Подсказки — на английском: так генераторы понимают точнее. Текстов для людей тут нет — правило 4 языков не нужно.
 * Готовую картинку сохранить как marketing/stories/2026-11/gpt/<id>.jpg и запустить ./render-stories.sh — сторис пересоберутся с ней.
 * Правила: к каждой генерации прикладывать логотип (brand/export/MELBUS_logo_na_belom.png) как образец; если логотип вышел неточно —
 * на монтаже кладём настоящий. Без лиц людей (только руки). На сторис с ИИ-картинкой автоматически стоит «Визуализация».
 * Опыт 13.11.2026 (Higgsfield, gpt_image_2_6): если написать «без текста, кроме логотипа», ИИ лепит большой логотип на пол/в небо как
 * водяной знак → в STYLE прямо сказано «логотип только напечатанный на предметах». Коробки — только белые (иначе рисует крафт).
 * Качество: quality 'medium' + resolution '2k' (1520×2688) = 1 кр.; по умолчанию (low, 1k, 752×1344) = 0,25 кр.
 */
export const STYLE = 'Photorealistic, premium commercial photography, soft natural daylight, calm and tidy. Colour palette: graphite #10161D, clean white, turquoise #14DCD5 accents only on tape, stickers and details. Vertical 9:16 (1080x1920), keep the lower 40% visually calm for text. No people’s faces (hands only if needed). All cardboard boxes are pure white (never brown or kraft). The MELBUS logo from the attached reference image may appear ONLY printed on physical objects (boxes, clothing, van), copied exactly; never as a floating overlay, watermark or graphic on the floor, wall or sky. No other text anywhere.';

export type GptPrompt = {id: string; for: string[]; what: string; prompt: string};
export const GPT_PROMPTS: GptPrompt[] = [
  {id: 'first-night', for: ['D17-1'], what: 'Коробка первой ночи (вид сверху)',
    prompt: 'Top-down flat lay of an open white cardboard moving box on a light oak floor. A strip of turquoise tape on the flap and a small room label sticker (turquoise stripe, number 01, QR code). Inside, neatly arranged: a white kettle, two mugs, tea and coffee, phone chargers with an extension lead, folded white bedding and towels, a small first-aid kit, a roll of toilet paper. The MELBUS logo printed on the box side.'},
  {id: 'uniform', for: ['D18-1'], what: 'Форма бригады (раскладка без человека)',
    prompt: 'Flat lay on dark graphite fabric: a graphite work jacket with thin turquoise piping and a small MELBUS logo on the chest, black work gloves with turquoise cuffs, a pair of graphite fabric shoe covers with a small logo, neatly folded and aligned. No person, studio light from the top left.'},
  {id: 'floor', for: ['D19-2'], what: 'Защита пола и косяков',
    prompt: 'Doorway of a bright modern flat: a grey protective runner on light parquet, transparent protective guards on the door frame and wall corners, a stack of white moving boxes sealed with turquoise tape in the background. No people.'},
  {id: 'boxes', for: ['D06-1'], what: 'Белые коробки с наклейками комнат',
    prompt: 'A neat stack of white cardboard moving boxes sealed with turquoise tape, each with a room label sticker (colour stripe, large number, QR code) and the MELBUS logo, in an empty bright living room with big windows, warm morning light on the floor.'},
  {id: 'qr', for: ['D16-1 (старт-кадр ролика)'], what: 'Наклейка с QR крупно, рука с телефоном',
    prompt: 'Close-up of the corner of a white moving box with a room label sticker: turquoise colour stripe, large number 07, a QR code. A hand holds a smartphone scanning the QR code, the phone screen shows a simple checklist made of abstract grey lines and turquoise ticks (no readable words). Hand only, shallow depth of field.'},
  {id: 'wardrobe', for: ['запас (старт-кадр ролика)'], what: 'Гардеробная коробка с одеждой на вешалках',
    prompt: 'A tall white wardrobe moving box with a metal hanging rail, front open, shirts and dresses on hangers inside, standing in a bright hallway; turquoise tape on the edges, MELBUS logo on the side.'},
  {id: 'keys', for: ['D28-3'], what: 'Ключи от нового дома (только руки)',
    prompt: 'Close-up of one hand passing house keys on a turquoise keyring into another open hand, white moving boxes with turquoise tape softly blurred in the background, bright empty new flat. Hands only, no faces.'},
  {id: 'van-rear', for: ['D28-1 (старт-кадр ролика)'], what: 'Задние двери буса: аккуратно уложенные коробки',
    prompt: 'Open rear doors of a white delivery van, inside neatly stacked white moving boxes with turquoise tape, secured with straps and moving blankets, quiet Warsaw residential street with old tenement houses and trees at golden hour, no people, no licence plate visible.'},
];

/** Higgsfield: короткие видео 5 с из картинок выше (старт-кадр), kling3_0 mode 'pro', sound 'off', 9:16. Цена проверена get_cost 13.11.2026.
 *  Готовые ролики: marketing/stories/2026-11/hf/<id>.mp4 (в git не кладём), в сторис — public/stories/<id>.mp4 через render-stories.sh. */
export type HfClip = {id: string; from: string; what: string; use: string; prompt: string; credits: number};
export const HF_PLAN: HfClip[] = [
  {id: 'hf-first-night', from: 'first-night', what: 'Руки в перчатках достают чайник из коробки первой ночи', use: 'D21-1', credits: 8.75,
    prompt: 'Top-down static camera. Two hands in black work gloves with turquoise cuffs enter the frame from the bottom and calmly lift the white kettle out of the open moving box, then lift one mug. Slow, careful, smooth movement. Soft daylight. No faces, only gloved hands and forearms. Everything else stays still; the MELBUS logo on the box stays unchanged.'},
  {id: 'hf-tape', from: 'boxes', what: 'Рука в перчатке приглаживает бирюзовый скотч, камера наезжает', use: 'запас', credits: 8.75,
    prompt: 'Camera slowly pushes in towards the stack of white moving boxes in the bright empty living room. A hand in a black work glove with a turquoise cuff enters from the right and firmly smooths down the turquoise tape on the top box, then leaves the frame. Warm morning sunbeams with gentle dust particles. No faces. Logos and stickers on the boxes stay unchanged and sharp.'},
  {id: 'hf-qr', from: 'qr', what: 'Телефон сканирует QR — на экране список вещей', use: 'D16-1', credits: 8.75,
    prompt: 'The hand slowly brings the smartphone a little closer to the QR code sticker on the white box, a soft turquoise scanning glow passes over the sticker, and one more turquoise tick appears on the checklist on the phone screen. Gentle focus pull from the sticker to the phone screen. Calm daylight, shallow depth of field. Hand only, no faces. The MELBUS logo on the box stays unchanged; no readable words appear.'},
  {id: 'hf-wardrobe', from: 'wardrobe', what: 'Рука вешает рубашку в гардеробную коробку', use: 'запас', credits: 8.75,
    prompt: 'Static camera, soft daylight in a bright hallway. A hand in a black work glove with a turquoise cuff enters from the right and hangs one more white shirt on a hanger onto the metal rail inside the open wardrobe moving box; the other hangers sway gently and settle. No faces. The MELBUS logo on the box stays unchanged.'},
  {id: 'hf-van', from: 'van-rear', what: 'Двери буса закрываются на уложенных коробках', use: 'D28-1', credits: 8.75,
    prompt: 'Static camera at chest height behind the white van on a quiet Warsaw street at golden hour. The two rear doors of the van slowly and smoothly swing closed over the neatly strapped white boxes, the left door first, then the right, and click shut. Leaves move slightly in a light breeze, warm sunlight flickers. No people. No licence plate. Logos on the boxes stay unchanged.'},
];
export const HF_IMAGE_CREDITS = 0.25; // картинка GPT Image в Higgsfield (low, 1k); medium 2k — 1 кр.

/** Что сделано 13.11.2026 (Higgsfield, тариф Ultra) — для README и отчёта. */
export const HF_DONE = {
  date: '13.11.2026',
  spent: 59.5,
  lines: [
    '8 картинок GPT Image (0,25 кр.) — 2 кр.',
    '4 картинки переделаны в 2K (1 кр.): ИИ поставил логотип «водяным знаком» на пол/небо (floor, qr, keys, van-rear) — 4 кр.',
    'keys ещё раз (1 кр.): в фоне была коричневая коробка — 1 кр.',
    '5 роликов Kling 3.0 pro, 5 с, без звука (8,75 кр.) — 43,75 кр.',
    'hf-first-night ещё раз (8,75 кр.): ИИ дорисовал вторую пару рук — 8,75 кр.',
    'hf-van: выдуманный номер «MELBUS» и надпись-эмблема размыты монтажом (бесплатно, tools: OpenCV-трекинг).',
  ],
};
