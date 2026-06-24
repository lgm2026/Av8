#!/usr/bin/env bash
# SeaHype — one-command real-photo build.
# Run this on a machine with normal internet access.
#
#   ./run_photos.sh                              # FREE site (default licenses)
#   ./run_photos.sh --license cc0,cc-by,cc-by-sa # commercial-safe only
#
# It fetches a real, openly-licensed, watermark-free photo of the exact species
# for each of the 444 species lessons, optimizes them, wires them into the app
# (with attribution), and rebuilds. Photos are matched by SCIENTIFIC NAME for
# accuracy. Re-running resumes where it left off.
set -e
cd "$(dirname "$0")"

echo "[1/4] Ensuring Pillow is installed..."
pip install --quiet Pillow 2>/dev/null || pip install --break-system-packages --quiet Pillow

echo "[2/4] Fetching photos from iNaturalist (~10 min, resumable, polite)..."
python3 fetch_photos.py "$@"

echo "[3/4] Optimizing + wiring photos into the app (folder mode)..."
python3 embed_photos.py

echo "[4/4] Rebuilding the single-file app..."
node build_html.js

echo ""
echo "============================================================"
echo "Done. Photos are wired in (with credits under Library > Sources)."
echo "Open: 'index.html'"
echo "Folder mode: copy  dist_photos/photos/  next to the HTML as  photos/"
echo "Spot-check likeness in  photos/_credits.json  before publishing."
echo "============================================================"
