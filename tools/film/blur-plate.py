# Размыть выдуманный номер машины (и надпись-эмблему) в ИИ-ролике, где дверь с номером движется.
# Шаблон «ниша ручки + номер» берётся с последнего кадра (дверь закрыта) и ищется в каждом кадре с
# разным сжатием по ширине (дверь поворачивается). Координаты TX/PL/BD — под ролик hf-van (13.11.2026).
# pip install opencv-python-headless; python3 -I tools/film/blur-plate.py вход.mp4 выход.mp4 <с какого кадра> отладка.jpg
import sys, cv2, subprocess, numpy as np
src, out, start, dbg = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
v = cv2.VideoCapture(src); fr = []
while True:
    ok, f = v.read()
    if not ok: break
    fr.append(f)
H, W = fr[0].shape[:2]; n = len(fr)
# шаблон: ниша ручки + номер на последнем кадре (дверь закрыта)
TX0, TY0, TX1, TY1 = 300, 845, 500, 928
T = cv2.cvtColor(fr[-1][TY0:TY1, TX0:TX1], cv2.COLOR_BGR2GRAY)
PL = (318-TX0, 879-TY0, 486-TX0, 924-TY0)   # номер внутри шаблона
BD = (292-TX0, 812-TY0, 398-TX0, 830-TY0)   # эмблема (над шаблоном, слева)
boxes = {}
for i in range(start, n):
    g = cv2.cvtColor(fr[i], cv2.COLOR_BGR2GRAY)[TY0-30:TY1+30, 0:760]
    best = (-1, 0, 0, 1.0)
    for sx in np.linspace(0.12, 1.0, 45):
        t = cv2.resize(T, (max(8, int(T.shape[1]*sx)), T.shape[0]))
        r = cv2.matchTemplate(g, t, cv2.TM_CCOEFF_NORMED)
        _, sc, _, loc = cv2.minMaxLoc(r)
        if sc > best[0]: best = (sc, loc[0], loc[1] + TY0 - 30, sx)
    sc, x, y, sx = best
    boxes[i] = (x, y, sx, sc)
tiles = []
p = subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r','24','-i','-',
                      '-c:v','libx264','-crf','16','-preset','slow','-pix_fmt','yuv420p','-movflags','+faststart',out], stdin=subprocess.PIPE)
for i, f in enumerate(fr):
    if i in boxes:
        x, y, sx, sc = boxes[i]
        m = np.zeros((H, W), np.float32)
        for (a, b, c, d), pad in ((PL, 7), (BD, 6)):
            cv2.rectangle(m, (int(x + a*sx) - pad, y + b - pad), (int(x + c*sx) + pad, y + d + pad), 1, -1)
        m = cv2.GaussianBlur(m, (0, 0), 4)[..., None]
        bl = cv2.GaussianBlur(f, (0, 0), 9)
        f = (f * (1 - m) + bl * m).astype(np.uint8)
        if i % 4 == 0 and i <= 88:
            tiles.append(cv2.resize(f[700:1050, 100:700], (300, 175)))
            print(i, boxes[i][:3], round(sc, 3))
    p.stdin.write(f.tobytes())
p.stdin.close(); p.wait()
rows = [np.hstack(tiles[k:k+4]) for k in range(0, len(tiles) - len(tiles) % 4, 4)]
cv2.imwrite(dbg, np.vstack(rows))
