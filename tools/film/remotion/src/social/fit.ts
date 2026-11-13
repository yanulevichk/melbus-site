// Общая оценка размера шрифта (сторис в Remotion и выгрузка в Figma считают одинаково)
/** размер шрифта, чтобы текст поместился в maxLines строк ширины width (оценка по словам) */
export const fitWrap = (text: string, max: number, width: number, maxLines: number, k = 0.6, min = 34) => {
  for (let size = max; size > min; size -= 2) {
    const cpl = Math.floor(width / (k * size));
    let lines = 1, cur = 0;
    for (const w of text.split(/\s+/)) {
      if (w.length > cpl) { lines = 99; break; }
      if (cur === 0) cur = w.length; else if (cur + 1 + w.length <= cpl) cur += 1 + w.length; else { lines++; cur = w.length; }
    }
    if (lines <= maxLines) return size;
  }
  return min;
};
