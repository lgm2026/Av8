#!/usr/bin/env python3
"""
bake_photos.py — ONE step, no Node needed.

Fetches a real, openly-licensed, watermark-free photo of the exact species for
each of the 444 species lessons, then bakes them directly into the SeaHype HTML
file. The result is a single self-contained file that displays the photos from
inside itself — it never calls any other site.

Needs:  Python 3  +  Pillow  (pip install Pillow)  +  internet access.

    python3 bake_photos.py                         # free site (default licenses)
    python3 bake_photos.py --license cc0,cc-by,cc-by-sa   # commercial-safe only
    python3 bake_photos.py --limit 30              # quick test (first 30)

Re-running resumes (it caches downloads in photos/). Output:
    "SeaHype Marine Biology Education (with photos).html"
    photos/_credits.json   (photographer + license per image; also shown in-app)
    photos/_missing.json   (species with no acceptable image -> keep illustration)

Likeness is matched by SCIENTIFIC NAME from species_queries.json. iNaturalist's
default photos are usually an excellent likeness; skim _credits.json and swap any
you don't like (drop your own image in photos/<id>.img and re-run).
"""
import json, os, sys, time, argparse, urllib.request, urllib.parse, ssl, base64, glob
from io import BytesIO
try:
    from PIL import Image
except ImportError:
    raise SystemExit("Pillow is required:  pip install Pillow")

API = "https://api.inaturalist.org/v1/taxa"
UA = "SeaHype-Education/1.0 (offline study app; photo sourcing)"
HERE = os.path.dirname(os.path.abspath(__file__))
PHOTODIR = os.path.join(HERE, "photos")
LICENSE_LABEL = {"cc0": "CC0 (public domain)", "cc-by": "CC BY", "cc-by-sa": "CC BY-SA",
    "cc-by-nc": "CC BY-NC", "cc-by-nc-sa": "CC BY-NC-SA", "cc-by-nd": "CC BY-ND",
    "cc-by-nc-nd": "CC BY-NC-ND"}
CTX = ssl.create_default_context()

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
        return json.loads(r.read().decode("utf-8"))

def fetch_bytes(url):
    url = url.replace("/square.", "/medium.").replace("/small.", "/medium.")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        data = r.read()
    if not (data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n"
            or data[:6] in (b"GIF87a", b"GIF89a") or data[8:12] == b"WEBP"):
        raise ValueError("not an image")
    return data

def best_taxon(query, results):
    ql = query.strip().lower(); scored = []
    for t in results:
        if not t.get("is_active", True):
            continue
        dp = t.get("default_photo")
        if not dp or not dp.get("medium_url"):
            continue
        name = (t.get("name") or "").lower(); common = (t.get("preferred_common_name") or "").lower()
        s = 0
        if ql == common or ql == name: s += 100
        if ql in common or ql in name or common in ql or name in ql: s += 30
        if t.get("rank") == "species": s += 10
        elif t.get("rank") == "genus": s += 5
        s += min(int(t.get("observations_count", 0)) ** 0.5, 60) / 12.0
        scored.append((s, t))
    if not scored:
        return None
    scored.sort(key=lambda x: x[0], reverse=True)
    return scored[0][1]

def optimize(raw, max_dim, quality):
    im = Image.open(BytesIO(raw))
    if im.mode != "RGB":
        im = im.convert("RGB")
    w, h = im.size
    sc = min(1.0, float(max_dim) / float(max(w, h)))
    if sc < 1.0:
        im = im.resize((max(1, int(w * sc)), max(1, int(h * sc))), Image.LANCZOS)
    buf = BytesIO()
    im.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
    return buf.getvalue()

def find_html():
    cands = [p for p in glob.glob(os.path.join(HERE, "*.html"))
             if "with photos" not in p.lower() and "SeaHype" in os.path.basename(p)]
    if not cands:
        cands = [p for p in glob.glob(os.path.join(HERE, "*.html")) if "with photos" not in p.lower()]
    return cands[0] if cands else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--license", default="cc0,cc-by,cc-by-sa,cc-by-nc,cc-by-nc-sa")
    ap.add_argument("--max-dim", type=int, default=640)
    ap.add_argument("--quality", type=int, default=78)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--sleep", type=float, default=1.2)
    ap.add_argument("--html", default=None)
    args = ap.parse_args()
    allowed = set(x.strip() for x in args.license.split(",") if x.strip())

    qpath = os.path.join(HERE, "species_queries.json")
    if not os.path.exists(qpath):
        raise SystemExit("species_queries.json not found (it ships in the bundle).")
    queries = json.load(open(qpath, encoding="utf-8"))
    html_path = args.html or find_html()
    if not html_path or not os.path.exists(html_path):
        raise SystemExit("Could not find the SeaHype HTML. Pass it with --html '<file>'.")
    os.makedirs(PHOTODIR, exist_ok=True)

    cpath = os.path.join(PHOTODIR, "_credits.json")
    credits = {c["id"]: c for c in json.load(open(cpath, encoding="utf-8"))} if os.path.exists(cpath) else {}
    missing = []
    ids = list(queries.keys())
    if args.limit:
        ids = ids[:args.limit]

    # ---- 1) fetch (resumable) ----
    print("Fetching photos for %d species (resumable)..." % len(ids))
    for i, lid in enumerate(ids):
        raw_path = os.path.join(PHOTODIR, lid + ".img")
        if os.path.exists(raw_path) and lid in credits:
            continue
        q = (queries[lid].get("q") or queries[lid].get("title") or "").strip()
        title = queries[lid].get("title", lid)
        if not q:
            continue
        try:
            data = get_json(API + "?" + urllib.parse.urlencode({"q": q, "per_page": 8}))
            t = best_taxon(title, data.get("results", [])) or best_taxon(q, data.get("results", []))
            if not t:
                missing.append({"id": lid, "title": title, "reason": "no taxon match"})
            else:
                dp = t["default_photo"]; lic = dp.get("license_code")
                if lic not in allowed:
                    missing.append({"id": lid, "title": title, "reason": "license " + str(lic)})
                else:
                    with open(raw_path, "wb") as f:
                        f.write(fetch_bytes(dp["medium_url"]))
                    credits[lid] = {"id": lid, "title": title, "matched": t.get("name"),
                        "author": dp.get("attribution") or "iNaturalist contributor",
                        "license": LICENSE_LABEL.get(lic, lic), "license_code": lic,
                        "url": "https://www.inaturalist.org/taxa/" + str(t.get("id"))}
        except Exception as e:
            missing.append({"id": lid, "title": title, "reason": str(e)})
        if (i + 1) % 10 == 0 or i + 1 == len(ids):
            json.dump(list(credits.values()), open(cpath, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
            json.dump(missing, open(os.path.join(PHOTODIR, "_missing.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
            sys.stdout.write("\r  %d/%d  (got %d, missing %d)" % (i + 1, len(ids), len(credits), len(missing)))
            sys.stdout.flush()
        time.sleep(args.sleep)
    print()

    # ---- 2) optimize + inline ----
    print("Optimizing + encoding...")
    photos = {}; total = 0; kept = []
    for c in list(credits.values()):
        rp = os.path.join(PHOTODIR, c["id"] + ".img")
        if not os.path.exists(rp):
            continue
        try:
            data = optimize(open(rp, "rb").read(), args.max_dim, args.quality)
        except Exception as e:
            print("  skip", c["id"], "-", e); continue
        photos[c["id"]] = "data:image/jpeg;base64," + base64.b64encode(data).decode("ascii")
        kept.append(c); total += len(data)

    # ---- 3) bake into the HTML ----
    print("Baking %d photos into the page..." % len(photos))
    photos_json = json.dumps(photos).replace("</", "<\\/")
    credits_json = json.dumps(kept).replace("</", "<\\/")
    blob = ("<script>window.__SEA_PHOTOS__=" + photos_json
            + ";window.__SEA_PHOTO_CREDITS__=" + credits_json + ";</script>\n</body>")
    html = open(html_path, encoding="utf-8").read()
    if "</body>" not in html:
        raise SystemExit("Unexpected HTML (no </body>).")
    html = html.replace("</body>", blob, 1)
    out = os.path.join(HERE, "SeaHype Marine Biology Education (with photos).html")
    open(out, "w", encoding="utf-8").write(html)

    print("\nDONE.")
    print("  photos baked in:", len(photos), "| missing/illustration fallback:", len(missing))
    print("  payload added: %.1f MB" % (total / 1048576.0))
    print("  ->", out)
    print("  Open that file. Credits are under Library > Sources > Photo credits.")
    print("  Spot-check likeness in photos/_credits.json before publishing.")

if __name__ == "__main__":
    main()
