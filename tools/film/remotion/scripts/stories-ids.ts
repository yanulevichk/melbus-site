// Порядок сторис для переименования кадров рендера: «still <номер> <id>» и «video <id>»
import {STILLS, VIDEOS} from '../src/social/stories';
STILLS.forEach((s, i) => console.log(`still ${i} ${s.id}`));
VIDEOS.forEach((s) => console.log(`video ${s.id}`));
