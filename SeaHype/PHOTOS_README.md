# SeaHype — Real Photos (baked into the file, no external calls)

The app is **photo-ready**: it shows a real photograph for any species that has
one, and falls back to the original illustration otherwise. This adds real,
openly-licensed, **watermark-free** photos of the **exact species** and bakes
them *into the HTML* — the finished page displays them from inside itself and
never calls another site.

> **Why isn't this already done in the file Claude gave me?** The tool Claude
> builds in can't reach photo servers (iNaturalist, Wikimedia, NOAA, etc. are all
> network-blocked there) and has no image generator. The download has to run once
> somewhere with normal internet. Both options below do that for you and hand
> back a finished, self-contained file. Matching is by **scientific name** for
> accuracy.

---

## Easiest: Google Colab (no installs, runs in your browser)
1. Open **https://colab.research.google.com** -> File -> Upload notebook ->
   choose `SeaHype_bake_photos_colab.ipynb` (in this bundle).
2. Runtime -> **Run all**. When prompted, upload the
   `SeaHype-Marine-Biology-Education-FULL-BUNDLE.zip`.
3. ~10 minutes later it auto-downloads
   **`SeaHype Marine Biology Education (with photos).html`** -- one self-contained
   file with the photos baked in. Done.

## Or: one command on your computer (no Node needed)
You need Python 3 and internet. From inside the unzipped bundle folder:
```
pip install Pillow
python3 bake_photos.py
```
Out comes `SeaHype Marine Biology Education (with photos).html`. That's it --
fetch, optimize, and embed all happen in that one script.

Since this is a **free** site, the default license set (which includes CC BY-NC)
is used, so coverage is high. For a **paid** release instead, restrict to
commercial-safe licenses:
```
python3 bake_photos.py --license cc0,cc-by,cc-by-sa
```

---

## What it produces
- `SeaHype Marine Biology Education (with photos).html` -- single file, photos
  embedded as data, **zero external calls** at runtime.
- `photos/_credits.json` -- photographer + license for every image (also shown
  in-app under **Library -> Sources -> Photo credits**, which satisfies attribution).
- `photos/_missing.json` -- any species with no acceptable image; those simply
  keep their accurate illustration.

Re-running resumes (downloads are cached in `photos/`). Smaller file?
`python3 bake_photos.py --max-dim 480 --quality 72`.

## Accuracy / likeness
Photos are matched to each species by **scientific name** (the clownfish fetches
*Amphiprion ocellaris*, not the ambiguous word "clownfish"); broad common names
that aren't one species use the correct family/genus. iNaturalist's default
photos are usually an excellent likeness, but **spot-check before publishing**:
- `photos/_credits.json` shows the exact taxon matched per image.
- To override any species, drop your own image in `photos/<lesson-id>.img` and
  re-run, or edit that species' `q` in `species_queries.json` and re-run.

## Advanced (optional)
The original three-step flow still ships for folks who want a separate `photos/`
folder instead of inlining, or who use the Node build: `fetch_photos.py` ->
`embed_photos.py` (`--mode folder|inline`) -> `node build_html.js`, wrapped by
`run_photos.sh`. Most people should just use `bake_photos.py` or the Colab
notebook above.
