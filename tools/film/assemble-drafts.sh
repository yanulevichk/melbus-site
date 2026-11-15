#!/bin/bash
# склейка фильма MELBUS из черновиков Seedance: файл:сколько_кадров (с начала)
# usage: assemble.sh N4 N5   (кадров из кусков 4 и 5)
set -e
S=${FILM_DIR:-$(pwd)}   # папка с draft1.mp4 … draft5.mp4
cd $S
N4=${1:-153}; N5=${2:-240}
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
ffmpeg -loglevel error -y -i draft1.mp4 -i draft2b.mp4 -i draft3.mp4 -i draft4.mp4 -i draft5.mp4 -filter_complex "\
[0]trim=end_frame=182,setpts=PTS-STARTPTS[a];\
[1]trim=end_frame=262,setpts=PTS-STARTPTS[b];\
[2]trim=end_frame=171,setpts=PTS-STARTPTS[c];\
[3]trim=end_frame=$N4,setpts=PTS-STARTPTS[d];\
[4]trim=end_frame=$N5,setpts=PTS-STARTPTS[e];\
[a][b][c][d][e]concat=n=5:v=1,fps=24,format=yuv420p[v]" -map "[v]" -c:v libx264 -crf 14 -preset slow raw_joined.mp4
# версия для просмотра/сайта: 1280x720, лёгкая резкость, пометка «Wizualizacja / Визуализация», плавный вход/выход
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 raw_joined.mp4)
ffmpeg -loglevel error -y -i raw_joined.mp4 -vf "scale=1280:720:flags=lanczos,unsharp=5:5:0.6:5:5:0.0,\
drawtext=fontfile=$FONT:text='Wizualizacja / Визуализация':x=w-tw-22:y=h-th-18:fontsize=17:fontcolor=white@0.72:shadowcolor=black@0.5:shadowx=1:shadowy=1,\
fade=t=in:st=0:d=0.6,fade=t=out:st=$(echo "$D-0.8" | bc):d=0.8" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -movflags +faststart melbus-film-draft-720p.mp4
ls -la raw_joined.mp4 melbus-film-draft-720p.mp4; echo "duration $D"
