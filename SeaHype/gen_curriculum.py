#!/usr/bin/env python3
# SeaHype curriculum generator.
# Authoring is compact and factual; this engine expands each spec into a full
# lesson (templated factual prose + terms + sources + an auto-built quiz grounded
# in the authored facts) and groups lessons into roadmap units.
import json, hashlib

# Controlled vocabularies keep prose accurate and quiz distractors clean.
HAB = {
  "reef": "coral reefs", "open": "the open ocean", "kelp": "kelp forests",
  "deep": "the deep sea", "sand": "sandy or muddy seafloor",
  "rocky": "rocky shores and tide pools", "polar": "cold polar seas",
  "mang": "mangroves and estuaries", "twilight": "the ocean twilight zone",
  "vent": "around hydrothermal vents", "pelagic": "open midwater",
  "coast": "shallow coastal waters", "global": "many oceans worldwide",
  "tropic": "warm tropical seas", "shelf": "the continental shelf",
  "ice": "polar ice edges", "shore": "the intertidal shoreline",
  "seagrass": "seagrass meadows", "bay": "bays and lagoons"
}
DIET = {
  "plankton": "plankton", "fishsquid": "fish and squid", "algae": "algae and seaweed",
  "inverts": "small invertebrates", "coral": "coral polyps", "mammals": "other marine mammals",
  "krill": "krill and small crustaceans", "detritus": "detritus and seabed matter",
  "omni": "a wide range of foods", "filter": "tiny filtered plankton", "parasites": "parasites and dead skin",
  "blood": "blood and tissue as a parasite", "squid": "squid", "jellies": "jellyfish and soft-bodied animals",
  "crabs": "crabs and shellfish", "worms": "worms and buried invertebrates", "fish": "fish",
  "urchins": "sea urchins and shellfish", "sponges": "sponges", "photosyn": "sunlight (it makes its own food)",
  "chemo": "energy from chemicals (via symbiotic bacteria)", "seals": "seals, fish and squid", "zoopl": "zooplankton", "plants": "seagrass and water plants"
}
# simplified classification categories used for the quiz + art + sources
CATS = ["bony fish","shark","ray","marine mammal","sea turtle","marine reptile","seabird",
        "cnidarian","mollusc","crustacean","echinoderm","marine worm","sponge","tunicate",
        "alga or plant","plankton or microbe"]

def simple_cat(group):
    g = group.lower()
    if "shark" in g: return "shark"
    if "ray" in g or "skate" in g or "sawfish" in g: return "ray"
    if "mammal" in g or "whale" in g or "dolphin" in g or "porpoise" in g or "seal" in g or "sea lion" in g or "walrus" in g or "manatee" in g or "dugong" in g or "otter" in g: return "marine mammal"
    if "turtle" in g: return "sea turtle"
    if "reptile" in g or "iguana" in g or "snake" in g or "crocodile" in g: return "marine reptile"
    if "bird" in g or "penguin" in g or "albatross" in g or "gull" in g or "tern" in g or "puffin" in g: return "seabird"
    if "cnidarian" in g or "jelly" in g or "coral" in g or "anemone" in g or "hydroid" in g or "siphonophore" in g: return "cnidarian"
    if "mollusc" in g or "snail" in g or "octopus" in g or "squid" in g or "cuttle" in g or "nautilus" in g or "clam" in g or "oyster" in g or "scallop" in g or "mussel" in g or "slug" in g or "chiton" in g or "gastropod" in g or "bivalve" in g or "cephalopod" in g: return "mollusc"
    if "crustacean" in g or "crab" in g or "shrimp" in g or "lobster" in g or "krill" in g or "barnacle" in g or "copepod" in g or "amphipod" in g or "isopod" in g: return "crustacean"
    if "echinoderm" in g or "star" in g or "urchin" in g or "cucumber" in g or "crinoid" in g or "sand dollar" in g: return "echinoderm"
    if "worm" in g: return "marine worm"
    if "sponge" in g: return "sponge"
    if "tunicate" in g or "squirt" in g or "salp" in g or "lancelet" in g: return "tunicate"
    if "alga" in g or "kelp" in g or "seaweed" in g or "seagrass" in g or "mangrove" in g or "plant" in g or "phytoplankton" in g: return "alga or plant"
    if "plankton" in g or "diatom" in g or "dinoflagellate" in g or "foram" in g or "radiolaria" in g or "microbe" in g or "bacteri" in g or "virus" in g or "archaea" in g or "cyano" in g: return "plankton or microbe"
    if "fish" in g or "eel" in g: return "bony fish"
    return "bony fish"

def art_for(cat, hab):
    if hab in ("deep","vent","twilight"): return "deepsea"
    m = {"shark":"shark","ray":"ray","marine mammal":"whale","sea turtle":"turtle",
         "marine reptile":"turtle","seabird":"ocean","cnidarian":"jelly","mollusc":"octopus",
         "crustacean":"tidepool","echinoderm":"tidepool","marine worm":"deepsea","sponge":"reef",
         "tunicate":"reef","alga or plant":"kelp","plankton or microbe":"plankton","bony fish":"reef"}
    a = m.get(cat, "reef")
    if cat == "alga or plant" and hab in ("mang","seagrass"): a = "mangrove"
    if hab == "kelp" and cat in ("alga or plant",): a = "kelp"
    return a

SRC_BY = {
  "organism": [("Smithsonian Ocean", "https://ocean.si.edu/"), ("NOAA Fisheries — species", "https://www.fisheries.noaa.gov/")],
  "invert":   [("Smithsonian Ocean", "https://ocean.si.edu/"), ("World Register of Marine Species", "https://www.marinespecies.org/")],
  "habitat":  [("NOAA Ocean Service", "https://oceanservice.noaa.gov/facts/"), ("Smithsonian Ocean", "https://ocean.si.edu/")],
  "ecology":  [("Smithsonian Ocean", "https://ocean.si.edu/"), ("NOAA Ocean Service", "https://oceanservice.noaa.gov/facts/")],
  "physio":   [("Smithsonian Ocean", "https://ocean.si.edu/"), ("NOAA Ocean Exploration", "https://oceanexplorer.noaa.gov/")],
  "conserv":  [("NOAA Fisheries", "https://www.fisheries.noaa.gov/"), ("IUCN Red List", "https://www.iucnredlist.org/")],
  "ocean":    [("NOAA Ocean Service", "https://oceanservice.noaa.gov/facts/"), ("NOAA PMEL", "https://www.pmel.noaa.gov/")],
  "methods":  [("NOAA Ocean Exploration", "https://oceanexplorer.noaa.gov/"), ("MBARI", "https://www.mbari.org/")]
}
SRC_CODE = {"organism":"si","invert":"si","habitat":"noaa","ecology":"si","physio":"si","conserv":"noaafish","ocean":"noaa","methods":"noaaoe"}

# group/cat -> a relevant glossary-style term pair for the lesson
CAT_TERM = {
  "bony fish": ["Bony fish", "A fish with a skeleton of bone, a gas-filled swim bladder, and a gill cover (operculum)."],
  "shark": ["Cartilaginous fish", "A shark, ray or chimaera, whose skeleton is made of flexible cartilage rather than bone."],
  "ray": ["Cartilaginous fish", "A shark, ray or chimaera, with a skeleton of cartilage instead of bone."],
  "marine mammal": ["Marine mammal", "An air-breathing, warm-blooded mammal that lives in the sea, nursing its young on milk."],
  "sea turtle": ["Reptile", "An air-breathing, cold-blooded vertebrate with scales; sea turtles must surface to breathe."],
  "marine reptile": ["Reptile", "An air-breathing, scaly, cold-blooded vertebrate, like a sea snake or marine iguana."],
  "seabird": ["Seabird", "A bird adapted to life at sea, feeding from the ocean and often nesting in colonies."],
  "cnidarian": ["Cnidarian", "A simple animal with stinging cells, such as a jellyfish, coral or anemone."],
  "mollusc": ["Mollusc", "A soft-bodied invertebrate such as a snail, clam or octopus, often with a shell."],
  "crustacean": ["Crustacean", "A hard-shelled, jointed-legged invertebrate such as a crab, shrimp or barnacle."],
  "echinoderm": ["Echinoderm", "A spiny, five-part-symmetric invertebrate like a sea star, urchin or sea cucumber."],
  "marine worm": ["Marine worm", "One of many soft, segmented or unsegmented worms living in the sea."],
  "sponge": ["Sponge", "A simple animal that filters food from water pumped through its porous body."],
  "tunicate": ["Tunicate", "A sac-like filter feeder; despite its looks, it is a close invertebrate relative of vertebrates."],
  "alga or plant": ["Primary producer", "An organism that makes its own food from sunlight, forming the base of the food web."],
  "plankton or microbe": ["Plankton", "Tiny drifting organisms that float with the currents at the base of ocean food webs."]
}
HAB_TERM = {
  "reef": ["Coral reef", "A living limestone structure built by corals that shelters much of the sea's biodiversity."],
  "deep": ["Deep sea", "The cold, dark ocean below about 1,000 m, where there is no sunlight."],
  "kelp": ["Kelp forest", "A dense underwater stand of large brown algae that shelters coastal life."],
  "mang": ["Estuary", "Where a river meets the sea and fresh and salt water mix, rich in young fish."],
  "twilight": ["Mesopelagic zone", "The dim 'twilight' layer of the ocean, about 200–1,000 m deep."],
  "vent": ["Hydrothermal vent", "A seafloor opening of hot, mineral-rich water that supports chemosynthetic life."],
  "polar": ["Polar seas", "Cold, often ice-covered waters near the poles, surprisingly full of life."],
  "intertidal": ["Intertidal zone", "The shore between high and low tide, alternately underwater and exposed."]
}

SPECS = []
def S(sid, name, group, track, hab, diet, trait, sci=None, level=None, kind="organism", art=None, why=None):
    SPECS.append(dict(id=sid, name=name, group=group, track=track, hab=hab, diet=diet,
                      trait=trait.strip(), sci=sci, level=level, kind=kind, art=art, why=why))

def cap(s):
    return s[0].upper() + s[1:] if s else s

def aan(word):
    w = (word or "").strip().lower()
    if not w:
        return "a"
    if w[0] in "aeio":
        return "an"
    if w[0] == "u":
        return "an" if w.startswith("urch") else "a"
    return "a"

# Proper-noun first words that must stay capitalized mid-sentence.
PROPER = set("Atlantic Pacific Caribbean Mediterranean Galápagos Galapagos Portuguese "
             "Japanese European Hawaiian Antarctic Arctic Neptune Irish Sally Venus "
             "Steller Weddell Ross Humboldt Spanish Adélie Laysan Moorish North South".split())

def midname(name):
    first = name.split(" ")[0].strip("(")
    if first in PROPER or first.endswith("'s") or first.endswith("'"):
        return name
    return name[0].lower() + name[1:] if name else name

def rnd(seed, n):
    h = int(hashlib.md5(seed.encode()).hexdigest(), 16)
    return h % n

def pick_distractors(correct, pool, seed, k=3):
    opts = [x for x in pool if x != correct]
    # deterministic shuffle
    opts.sort(key=lambda x: hashlib.md5((seed + x).encode()).hexdigest())
    return opts[:k]

def build_quiz(sp, cat, habp, dietp):
    nm = midname(sp["name"])
    quiz = []
    # Q1 habitat
    hpool = list(HAB.values())
    d1 = pick_distractors(habp, hpool, sp["id"] + "h")
    ch1 = [habp] + d1
    ch1.sort(key=lambda x: hashlib.md5((sp["id"] + "a" + x).encode()).hexdigest())
    quiz.append({"type": "mc", "q": "Where is the " + nm + " most at home?",
                 "choices": ch1, "answer": ch1.index(habp),
                 "why": "The " + nm + " is most at home in " + habp + "."})
    # Q2 classification
    cpool = CATS[:]
    d2 = pick_distractors(cat, cpool, sp["id"] + "c")
    ch2 = [cat] + d2
    ch2.sort(key=lambda x: hashlib.md5((sp["id"] + "b" + x).encode()).hexdigest())
    quiz.append({"type": "mc", "q": "The " + nm + " is classified as a kind of:",
                 "choices": ch2, "answer": ch2.index(cat),
                 "why": "The " + nm + " is " + aan(cat) + " " + cat + "."})
    # Q3 alternate trait-true vs wrong-diet-false
    if rnd(sp["id"] + "q", 2) == 0 or not dietp:
        quiz.append({"type": "tf", "q": cap(sp["trait"]),
                     "answer": True, "why": "True — that's a real feature of the " + nm + "."})
    else:
        wrongpool = [d for d in DIET.values() if d != dietp]
        wrong = wrongpool[rnd(sp["id"] + "w", len(wrongpool))]
        quiz.append({"type": "tf", "q": "The " + nm + " mainly eats " + wrong + ".",
                     "answer": False, "why": "False — the " + nm + " actually eats " + dietp + "."})
    return quiz

def build_lesson(sp):
    cat = simple_cat(sp["group"])
    habp = HAB.get(sp["hab"], sp["hab"])
    dietp = DIET.get(sp["diet"], sp["diet"]) if sp["diet"] else None
    art = sp["art"] or art_for(cat, sp["hab"])
    # prose
    nm = midname(sp["name"])
    grp = sp["group"]
    if nm.lower() == grp.lower():
        grp = cat
    p1 = "The " + nm + " is " + aan(grp) + " " + grp + ", most at home in " + habp + "."
    if sp.get("sci") and " " in sp["sci"]:
        p1 += " Scientists call it " + sp["sci"] + "."
    if dietp:
        if sp["diet"] == "photosyn":
            p1 += " Instead of hunting for food, it makes its own using sunlight."
        elif sp["diet"] == "chemo":
            p1 += " Instead of using sunlight, it gets its energy from chemicals, with help from tiny bacteria living inside it."
        else:
            p1 += " It mostly eats " + dietp + "."
    p2 = cap(sp["trait"])
    explain = [p1, p2]
    # terms
    terms = []
    ct = CAT_TERM.get(cat)
    if ct: terms.append(ct)
    ht = HAB_TERM.get(sp["hab"])
    if ht and (not terms or ht[0] != terms[0][0]): terms.append(ht)
    # sources
    src_pair = SRC_BY.get(sp["kind"], SRC_BY["organism"])
    sources = [{"label": src_pair[0][0], "url": src_pair[0][1]},
               {"label": src_pair[1][0], "url": src_pair[1][1]}]
    lesson = {
        "title": sp["name"],
        "track": sp["track"],
        "level": sp["level"] or "Core",
        "src": SRC_CODE.get(sp["kind"], "si"),
        "time": 3,
        "explain": explain,
        "terms": terms,
        "art": art,
        "sources": sources,
        "quiz": build_quiz(sp, cat, habp, dietp)
    }
    if sp.get("why"):
        lesson["why"] = sp["why"]
    return lesson

# UNIT grouping: ordered list of (unit_title, subtitle, track, level, [ids])
UNITS = []
def U(title, subtitle, track, level, ids):
    UNITS.append({"id": "u-gen-" + str(len(UNITS) + 1), "title": title, "subtitle": subtitle,
                  "track": track, "level": level, "ids": ids})

def chunk_units(title_base, subtitle, track, level, ids, size=6):
    # split a long id list into numbered units
    n = 0
    parts = [ids[i:i+size] for i in range(0, len(ids), size)]
    roman = ["", " I", " II", " III", " IV", " V", " VI", " VII", " VIII", " IX", " X",
             " XI", " XII", " XIII", " XIV", " XV", " XVI", " XVII", " XVIII", " XIX", " XX"]
    for idx, part in enumerate(parts):
        suffix = roman[idx + 1] if len(parts) > 1 and idx + 1 < len(roman) else ""
        U(title_base + suffix, subtitle, track, level, part)

# populated by appended spec modules:
def emit():
    lessons = {}
    for sp in SPECS:
        lessons[sp["id"]] = build_lesson(sp)
    with open("/home/claude/sea/seahype-curriculum.js", "w", encoding="utf-8") as f:
        f.write("window.__SEA_LESSONS__ = Object.assign(window.__SEA_LESSONS__ || {}, " + json.dumps(lessons) + ");\n")
        f.write("window.__SEA_UNITS_EXTRA__ = (window.__SEA_UNITS_EXTRA__ || []).concat(" + json.dumps(UNITS) + ");\n")
    print("generated lessons:", len(lessons), "| units:", len(UNITS),
          "| ids unique:", len(set(s["id"] for s in SPECS)) == len(SPECS))
