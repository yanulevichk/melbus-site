/**
 * ПОДСКАЗКИ ДЛЯ ГЕНЕРАЦИИ (картинки в ChatGPT / GPT Image, короткие видео в Higgsfield).
 * Подсказки — на английском: так генераторы понимают точнее. Текстов для людей тут нет — правило 4 языков не нужно.
 * Готовую картинку сохранить как marketing/stories/2026-11/gpt/<id>.jpg и запустить ./render-stories.sh — сторис пересоберутся с ней.
 * Правила: к каждой генерации прикладывать логотип (brand/export/MELBUS_logo_na_belom.png) как образец; если логотип вышел неточно —
 * на монтаже кладём настоящий. Без лиц людей (только руки). На сторис с ИИ-картинкой автоматически стоит «Визуализация».
 */
export const STYLE = 'Photorealistic, premium commercial photography, soft natural daylight, calm and tidy. Colour palette: graphite #10161D, clean white, turquoise #14DCD5 accents only on tape, stickers and details. Vertical 9:16 (1080x1920), keep the lower 40% visually calm for text. No people’s faces (hands only if needed). No text anywhere except the MELBUS logo from the attached reference image, copied exactly.';

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
  {id: 'qr', for: ['будущие сторис'], what: 'Наклейка с QR крупно, рука с телефоном',
    prompt: 'Close-up of the corner of a white moving box with a room label sticker: turquoise colour stripe, large number 07, a QR code. A hand holds a smartphone scanning the QR code, the phone screen shows a simple list. Hand only, shallow depth of field.'},
  {id: 'wardrobe', for: ['будущие сторис'], what: 'Гардеробная коробка с одеждой на вешалках',
    prompt: 'A tall white wardrobe moving box with a metal hanging rail, front open, shirts and dresses on hangers inside, standing in a bright hallway; turquoise tape on the edges, MELBUS logo on the side.'},
  {id: 'keys', for: ['будущие сторис'], what: 'Ключи от нового дома (только руки)',
    prompt: 'Close-up of one hand passing house keys on a turquoise keyring into another open hand, white moving boxes softly blurred in the background. Hands only, no faces.'},
  {id: 'van-rear', for: ['будущие сторис'], what: 'Задние двери буса: аккуратно уложенные коробки',
    prompt: 'Open rear doors of a white delivery van, inside neatly stacked white moving boxes with turquoise tape, secured with straps and moving blankets, quiet Warsaw residential street at golden hour, no people, no licence plate visible.'},
];

/** Higgsfield: короткие видео 5 с из картинок выше (старт-кадр). Цены — по тарифу на 12.11.2026, перед запуском уточнить get_cost. */
export type HfClip = {id: string; from: string; what: string; prompt: string; credits: number};
export const HF_PLAN: HfClip[] = [
  {id: 'hf-first-night', from: 'first-night', what: 'Руки в перчатках открывают коробку первой ночи и достают чайник', credits: 8.75,
    prompt: 'Hands in black gloves with turquoise cuffs open the flaps of the box and lift out the kettle, slow calm movement, top-down static camera.'},
  {id: 'hf-tape', from: 'boxes', what: 'Бирюзовый скотч запечатывает коробку (макро)', credits: 8.75,
    prompt: 'Macro: a gloved hand pulls turquoise tape across the top of a white box, sealing it in one smooth motion, camera slowly pushes in.'},
  {id: 'hf-qr', from: 'qr', what: 'Телефон сканирует QR — на экране список вещей', credits: 8.75,
    prompt: 'The phone moves closer to the QR sticker, the screen lights up with a list, gentle focus pull from sticker to screen.'},
  {id: 'hf-wardrobe', from: 'wardrobe', what: 'Одежда на вешалках «въезжает» в гардеробную коробку', credits: 8.75,
    prompt: 'Clothes on hangers slide onto the rail inside the wardrobe box one by one, static camera, soft daylight.'},
  {id: 'hf-van', from: 'van-rear', what: 'Двери буса закрываются на уложенных коробках', credits: 8.75,
    prompt: 'The rear doors of the van slowly close over the neatly stacked boxes, camera static at chest height, golden hour light.'},
];
export const HF_IMAGE_CREDITS = 0.25; // картинка GPT Image в Higgsfield
