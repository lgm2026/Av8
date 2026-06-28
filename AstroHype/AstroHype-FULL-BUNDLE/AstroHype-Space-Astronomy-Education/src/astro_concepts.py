# -*- coding: utf-8 -*-
import astro_concepts_p1 as p1
import astro_concepts_p2 as p2
import astro_concepts_p3 as p3
from gen_sources import SRC

# (track_id, list_of_units) in curriculum order matching TRACKS order in the engine.
TRACK_BLOCKS = [
 ("foundations", p1.FOUNDATIONS + p3.FOUNDATIONS_X),
 ("ecology",     p1.ORBITS + p3.ORBITS_X),
 ("flora",       p1.SOLAR + p3.SOLAR_X),
 ("fauna",       p2.STARS + p3.STARS_X),
 ("geology",     p2.GALAXIES + p3.GALAXIES_X),
 ("habitats",    p2.COSMOLOGY + p3.COSMOLOGY_X),
 ("conservation",p2.MISSIONS + p3.MISSIONS_X),
 ("methods",     p2.SKYWATCHING),
]

CONCEPT_SRC = {
 "foundations":"nasa","ecology":"nasa","flora":"nasaplanets","fauna":"esahubble",
 "geology":"esahubble","habitats":"esahubble","conservation":"nasa","methods":"nasa",
}
CONCEPT_ART = {
 "foundations":"star","ecology":"planet","flora":"sun","fauna":"star",
 "geology":"galaxy","habitats":"blackhole","conservation":"mission","methods":"telescope",
}
SECOND_SRC = {
 "nasa":"esa","nasaplanets":"jpl","esahubble":"noirlab","nasaexo":"nasa",
}

def sources_for(srckey):
    out=[]
    second = SECOND_SRC.get(srckey,"nasa")
    for k in (srckey, second):
        if k in SRC: out.append({"label":SRC[k]["label"],"url":SRC[k]["url"]})
    return out

def build():
    lessons = {}
    unit_plan = []
    for track_id, units in TRACK_BLOCKS:
        srckey = CONCEPT_SRC[track_id]
        art = CONCEPT_ART[track_id]
        for (uid, title, subtitle, ulevel, ls) in units:
            ids = []
            for L in ls:
                lid = L["id"]
                ids.append(lid)
                lesson = {
                    "title": L["title"],
                    "track": track_id,
                    "level": L["level"],
                    "src": srckey,
                    "time": 4,
                    "explain": L["explain"],
                    "why": L["why"],
                    "hook": L["hook"],
                    "terms": L["terms"],
                    "art": art,
                    "sources": sources_for(srckey),
                    "quiz": L["quiz"],
                }
                if "misconception" in L:
                    lesson["misconception"] = L["misconception"]
                lessons[lid] = lesson
            unit_plan.append({
                "id": uid, "track": track_id, "level": ulevel,
                "title": title, "subtitle": subtitle, "ids": ids,
            })
    return lessons, unit_plan

if __name__ == "__main__":
    lessons, plan = build()
    print("concept lessons:", len(lessons))
    print("concept units:", len(plan))
    # verify uniqueness
    assert len(lessons) == sum(len(u["ids"]) for u in plan)
    from collections import Counter
    print("by track:", dict(Counter(v["track"] for v in lessons.values())))
    # check fields present
    for k,v in lessons.items():
        assert v["explain"] and v["quiz"] and v["why"] and v["hook"], k
    print("all concept lessons valid")
