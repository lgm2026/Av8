#!/usr/bin/env python3
"""
SeaHype photo fetcher.

Pulls a representative, openly-licensed, watermark-free photograph for each of
the 444 species lessons from the iNaturalist API (the taxon "default photo,"
which the iNaturalist community curates as a good likeness of the species).
Captures the photographer credit + license for each image so the app can show
proper attribution.

RUN THIS ON A MACHINE WITH NORMAL INTERNET ACCESS (the build sandbox blocks
image hosts, which is why this is a separate step).

    python3 fetch_photos.py                 # fetch all, default licenses
    python3 fetch_photos.py --license cc0,cc-by,cc-by-sa   # commercial-safe only
    python3 fetch_photos.py --limit 25      # try the first 25 (smoke test)
    python3 fetch_photos.py                 # re-run: resumes, skips done ones

Output:
    photos/<lesson-id>.jpg          one image per species
    photos/_credits.json            [{id,title,matched,author,license,url}]
    photos/_missing.json            species with no acceptable image (review)

Then run:  python3 embed_photos.py   (optimizes + wires them into the app)

NOTE ON LIKENESS: matching is automated. iNaturalist's default photos are
usually an excellent likeness, but you MUST spot-check. Any species that matched
the wrong taxon can be fixed by editing its "q" in species_queries.json and
re-running, or by dropping a correct image into photos/<id>.jpg yourself.
"""
import json, os, sys, time, argparse, urllib.request, urllib.parse, ssl

API = "https://api.inaturalist.org/v1/taxa"
UA = "SeaHype-Education/1.0 (offline study app; photo sourcing script)"
HERE = os.path.dirname(os.path.abspath(__file__))
PHOTODIR = os.path.join(HERE, "photos")

LICENSE_LABEL = {
    "cc0": "CC0 (public domain)", "cc-by": "CC BY", "cc-by-sa": "CC BY-SA",
    "cc-by-nc": "CC BY-NC", "cc-by-nc-sa": "CC BY-NC-SA",
    "cc-by-nd": "CC BY-ND", "cc-by-nc-nd": "CC BY-NC-ND",
}

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
        return json.loads(r.read().decode("utf-8"))

def download(url, path):
    # upgrade iNat thumbnail size to a larger one if possible
    url = url.replace("/square.", "/medium.").replace("/small.", "/medium.")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
        data = r.read()
    # sanity: must look like an image (JPEG/PNG/GIF/WebP magic bytes)
    if not (data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n"
            or data[:6] in (b"GIF87a", b"GIF89a") or data[8:12] == b"WEBP"):
        raise ValueError("not an image")
    with open(path, "wb") as f:
        f.write(data)
    return len(data)

def best_taxon(query, results):
    ql = query.strip().lower()
    scored = []
    for t in results:
        if not t.get("is_active", True):
            continue
        dp = t.get("default_photo")
        if not dp or not dp.get("medium_url"):
            continue
        name = (t.get("name") or "").lower()
        common = (t.get("preferred_common_name") or "").lower()
        score = 0
        if ql == common or ql == name:
            score += 100
        if ql in common or ql in name or common in ql or name in ql:
            score += 30
        if t.get("rank") == "species":
            score += 10
        elif t.get("rank") == "genus":
            score += 4
        score += min(int(t.get("observations_count", 0)) ** 0.5, 50) / 10.0
        scored.append((score, t))
    if not scored:
        return None
    scored.sort(key=lambda x: x[0], reverse=True)
    return scored[0][1]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--license", default="cc0,cc-by,cc-by-sa,cc-by-nc,cc-by-nc-sa",
                    help="comma list of acceptable license codes")
    ap.add_argument("--limit", type=int, default=0, help="only attempt the first N (0 = all)")
    ap.add_argument("--sleep", type=float, default=1.2, help="seconds between API calls (be polite)")
    args = ap.parse_args()
    allowed = set(x.strip() for x in args.license.split(",") if x.strip())

    with open(os.path.join(HERE, "species_queries.json"), encoding="utf-8") as f:
        queries = json.load(f)
    os.makedirs(PHOTODIR, exist_ok=True)

    credits_path = os.path.join(PHOTODIR, "_credits.json")
    credits = {}
    if os.path.exists(credits_path):
        credits = {c["id"]: c for c in json.load(open(credits_path, encoding="utf-8"))}
    missing = []

    ids = list(queries.keys())
    if args.limit:
        ids = ids[:args.limit]

    done = 0; fetched = 0
    for i, lid in enumerate(ids):
        out = os.path.join(PHOTODIR, lid + ".jpg")
        if os.path.exists(out) and lid in credits:
            done += 1
            continue
        q = queries[lid]["q"]
        title = queries[lid]["title"]
        try:
            url = API + "?" + urllib.parse.urlencode({"q": q, "per_page": 8})
            data = get_json(url)
            t = best_taxon(title, data.get("results", [])) or best_taxon(q, data.get("results", []))
            if not t:
                missing.append({"id": lid, "title": title, "reason": "no taxon match"})
                print("  [%d/%d] MISS %s (%s) — no match" % (i + 1, len(ids), lid, title))
            else:
                dp = t["default_photo"]
                lic = dp.get("license_code")
                if lic not in allowed:
                    missing.append({"id": lid, "title": title, "reason": "license " + str(lic),
                                    "matched": t.get("name")})
                    print("  [%d/%d] SKIP %s — license %s not allowed" % (i + 1, len(ids), lid, lic))
                else:
                    sz = download(dp["medium_url"], out)
                    credits[lid] = {
                        "id": lid, "title": title, "matched": t.get("name"),
                        "author": dp.get("attribution") or "iNaturalist contributor",
                        "license": LICENSE_LABEL.get(lic, lic),
                        "license_code": lic,
                        "url": "https://www.inaturalist.org/taxa/" + str(t.get("id")),
                    }
                    fetched += 1
                    print("  [%d/%d] OK   %s -> %s [%s, %s, %.0f KB]" % (
                        i + 1, len(ids), lid, t.get("name"), lic, "img", sz / 1024.0))
        except Exception as e:
            missing.append({"id": lid, "title": title, "reason": str(e)})
            print("  [%d/%d] ERR  %s — %s" % (i + 1, len(ids), lid, e))
        # save progress frequently so the run is resumable
        if (i + 1) % 10 == 0 or i + 1 == len(ids):
            json.dump(list(credits.values()), open(credits_path, "w", encoding="utf-8"),
                      indent=1, ensure_ascii=False)
            json.dump(missing, open(os.path.join(PHOTODIR, "_missing.json"), "w", encoding="utf-8"),
                      indent=1, ensure_ascii=False)
        time.sleep(args.sleep)

    json.dump(list(credits.values()), open(credits_path, "w", encoding="utf-8"),
              indent=1, ensure_ascii=False)
    json.dump(missing, open(os.path.join(PHOTODIR, "_missing.json"), "w", encoding="utf-8"),
              indent=1, ensure_ascii=False)
    print("\nDone. already had: %d | newly fetched: %d | total with photos: %d | missing/skipped: %d"
          % (done, fetched, len(credits), len(missing)))
    print("Next: python3 embed_photos.py")

if __name__ == "__main__":
    main()
