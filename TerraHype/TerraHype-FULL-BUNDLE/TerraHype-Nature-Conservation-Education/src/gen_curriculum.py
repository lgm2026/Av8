#!/usr/bin/env python3
# TerraHype curriculum generator (land / nature conservation).
import json, hashlib

HAB = {
  "forest": "forests and woodlands", "decid": "deciduous forests",
  "conifer": "coniferous forests", "grass": "grasslands and prairies",
  "wetland": "wetlands and marshes", "desert": "deserts and dry scrub",
  "mountain": "mountains and high slopes", "river": "rivers and streams",
  "lake": "lakes and ponds", "meadow": "meadows and open fields",
  "edge": "forest edges and clearings", "urban": "towns, parks and gardens",
  "widespread": "many habitats across North America", "riparian": "streamsides and riverbanks",
  "tundra": "cold northern tundra", "coastal": "coastal dunes and shores",
  "cave": "caves and rocky crevices", "soil": "soil and leaf litter",
  "canopy": "the forest canopy", "understory": "the forest understory",
  "wetforest": "moist shady forests", "rocky": "rocky outcrops and talus"
}
DIET = {
  "herb": "plants, leaves and shoots", "graze": "grasses", "browse": "leaves, twigs and buds",
  "seeds": "seeds and nuts", "fruit": "fruit and berries", "nectar": "flower nectar",
  "insects": "insects and other small invertebrates", "omni": "a wide range of plant and animal foods",
  "carn": "animals it hunts", "smallmammals": "small mammals like mice and rabbits",
  "fish": "fish and other water animals", "carrion": "carrion (already-dead animals)",
  "wood": "wood and inner bark", "roots": "roots, bulbs and tubers", "pollen": "pollen and nectar",
  "blood": "blood (it is a parasite)", "grain": "grains and seeds", "foliage": "leaves and foliage",
  "aquaticplants": "water plants", "amphibivore": "frogs, insects and other small prey",
  "photosyn": "(makes its own food from sunlight)", "decompose": "(feeds on dead matter)"
}
BIO_CATS = ["tree", "shrub", "wildflower", "grass", "fern or moss", "fungus or lichen",
            "mammal", "bird", "reptile", "amphibian", "freshwater fish", "insect", "arachnid"]
GEO_CATS = ["rock", "mineral", "fossil"]
CATS = BIO_CATS + GEO_CATS

def simple_cat(group):
    g = group.lower()
    if any(w in g for w in ["mineral","quartz","feldspar","mica","calcite","pyrite","gypsum","galena","fluorite","garnet","hematite","magnetite","talc","olivine","tourmaline","beryl","malachite","azurite"]): return "mineral"
    if any(w in g for w in ["fossil","trilobite","ammonite","petrified","amber"]): return "fossil"
    if any(w in g for w in ["rock","granite","basalt","sandstone","limestone","shale","slate","marble","gneiss","schist","conglomerate","obsidian","gabbro","rhyolite","dolomite","quartzite","chert"]): return "rock"
    if any(w in g for w in ["fern","moss","horsetail","clubmoss","liverwort","spikemoss"]): return "fern or moss"
    if any(w in g for w in ["fungus","mushroom","lichen","mold","bracket","puffball","morel","toadstool","bolete"]): return "fungus or lichen"
    if any(w in g for w in ["grass","sedge","rush","reed","cane","bluestem","fescue"]): return "grass"
    if any(w in g for w in ["shrub","bush","bramble","sumac","manzanita","sagebrush","huckleberry"]): return "shrub"
    if any(w in g for w in ["wildflower","flower","forb","lily","aster","goldenrod","lupine","milkweed","poppy","iris","orchid","violet","sunflower","coneflower","columbine","trillium","clover"]): return "wildflower"
    if any(w in g for w in ["tree","oak","maple","pine","spruce","fir","birch","aspen","willow","cedar","hemlock","redwood","sequoia","cottonwood","sycamore","hickory","beech","elm","ash","walnut","magnolia","cypress","juniper","larch"]): return "tree"
    if any(w in g for w in ["spider","arachnid","scorpion","tick","mite","harvestman","daddy"]): return "arachnid"
    if any(w in g for w in ["insect","butterfly","beetle","bee","ant","dragonfly","moth","grasshopper","cricket","wasp","fly","mantis","cicada","firefly","ladybug","aphid","damselfly","bug","weevil","hornet","bumblebee"]): return "insect"
    if any(w in g for w in ["amphibian","frog","toad","salamander","newt"]): return "amphibian"
    if any(w in g for w in ["reptile","snake","lizard","turtle","tortoise","skink","gecko","rattlesnake"]): return "reptile"
    if any(w in g for w in ["fish","trout","bass","sunfish","catfish","minnow","darter","perch","pike","salmon","bluegill","crappie"]): return "freshwater fish"
    if any(w in g for w in ["bird","hawk","owl","eagle","duck","goose","sparrow","warbler","woodpecker","jay","robin","heron","crane","finch","chickadee","wren","falcon","vulture","crow","raven","turkey","grouse","hummingbird","swallow","cardinal","thrush","quail","loon","kingfisher","nuthatch","blackbird","oriole","osprey","kestrel","bluebird","tanager","junco","dove","pelican","egret"]): return "bird"
    if any(w in g for w in ["mammal","deer","bear","fox","squirrel","bat","rodent","rabbit","wolf","weasel","beaver","raccoon","opossum","skunk","bison","elk","moose","sheep","goat","coyote","cougar","puma","lion","chipmunk","mouse","vole","shrew","mole","porcupine","otter","badger","marmot","hare","bobcat","lynx","muskrat","pika","mink","ferret","prairie dog","groundhog","woodchuck"]): return "mammal"
    return "insect"

def art_for(cat, hab):
    m = {"tree": "oak", "shrub": "forest", "wildflower": "wildflower", "grass": "grassland",
         "fern or moss": "fern", "fungus or lichen": "mushroom",
         "mammal": "fox", "bird": "bird", "reptile": "reptile", "amphibian": "frog",
         "freshwater fish": "fish", "insect": "butterfly", "arachnid": "fern",
         "rock": "mineral", "mineral": "mineral", "fossil": "fossil"}
    a = m.get(cat, "forest")
    if cat == "mammal" and hab in ("river", "lake", "wetland", "riparian"): a = "beaver"
    if cat == "mammal" and hab in ("mountain", "tundra", "rocky"): a = "deer"
    if cat == "bird" and hab in ("wetland", "lake", "river", "riparian"): a = "wetland"
    if cat == "reptile" and hab in ("wetland", "lake", "river", "riparian"): a = "pond"
    if cat == "reptile" and hab == "desert": a = "desert"
    if cat == "amphibian" and hab in ("river", "lake"): a = "pond"
    if cat == "tree" and hab in ("conifer", "mountain"): a = "mountain"
    if cat in ("wildflower", "grass") and hab in ("meadow", "grass"): a = "meadow"
    if hab == "coastal": a = "coast"
    if hab == "tundra": a = "tundra"
    if hab == "cave": a = "cave"
    return a

SRC_BY = {
  "tree":   [("USDA Forest Service", "https://www.fs.usda.gov/"), ("USDA PLANTS Database", "https://plants.usda.gov/")],
  "plant":  [("USDA PLANTS Database", "https://plants.usda.gov/"), ("USDA Forest Service", "https://www.fs.usda.gov/")],
  "fungus": [("USDA Forest Service", "https://www.fs.usda.gov/"), ("Smithsonian - Natural History", "https://naturalhistory.si.edu/")],
  "bird":   [("Cornell Lab - All About Birds", "https://www.allaboutbirds.org/"), ("National Audubon Society", "https://www.audubon.org/")],
  "animal": [("U.S. Fish & Wildlife Service", "https://www.fws.gov/"), ("Smithsonian - Natural History", "https://naturalhistory.si.edu/")],
  "insect": [("Smithsonian - Natural History", "https://naturalhistory.si.edu/"), ("Encyclopedia of Life", "https://eol.org/")],
  "rock":   [("USGS", "https://www.usgs.gov/"), ("Smithsonian - Natural History", "https://naturalhistory.si.edu/")],
  "habitat":[("National Park Service", "https://www.nps.gov/"), ("USGS", "https://www.usgs.gov/")],
  "ecology":[("National Park Service", "https://www.nps.gov/"), ("Smithsonian - Natural History", "https://naturalhistory.si.edu/")],
  "conserv":[("U.S. Fish & Wildlife Service", "https://www.fws.gov/"), ("IUCN Red List", "https://www.iucnredlist.org/")]
}
SRC_CODE = {"tree":"usfs","plant":"usda","fungus":"usfs","bird":"cornell","animal":"usfws",
            "insect":"si","rock":"usgs","habitat":"nps","ecology":"nps","conserv":"usfws"}

CAT_TERM = {
  "tree": ["Tree", "A tall woody plant with a single main trunk that can live for many years."],
  "shrub": ["Shrub", "A woody plant smaller than a tree, usually with several stems rising from the base."],
  "wildflower": ["Wildflower", "A flowering plant that grows in the wild without being planted by people."],
  "grass": ["Grass", "A plant with narrow blade-like leaves and hollow, jointed stems; grasses carpet prairies and lawns."],
  "fern or moss": ["Spore plant", "A plant such as a fern or moss that reproduces by spores instead of seeds or flowers."],
  "fungus or lichen": ["Fungus", "A living thing that is neither plant nor animal and feeds by breaking matter down; a mushroom is the fruiting body of a fungus."],
  "mammal": ["Mammal", "A warm-blooded animal, usually with fur or hair, that feeds its young on milk."],
  "bird": ["Bird", "A warm-blooded animal with feathers and a beak; most birds can fly."],
  "reptile": ["Reptile", "A cold-blooded, scaly, air-breathing animal such as a snake, lizard or turtle."],
  "amphibian": ["Amphibian", "A cold-blooded animal such as a frog or salamander that usually begins life in water with gills."],
  "freshwater fish": ["Fish", "A cold-blooded water animal that breathes through gills and swims with fins."],
  "insect": ["Insect", "A six-legged invertebrate with a three-part body and, usually, wings."],
  "arachnid": ["Arachnid", "An eight-legged invertebrate such as a spider, scorpion or tick."],
  "rock": ["Rock", "A natural solid made of one or more minerals - the building material of the Earth's crust."],
  "mineral": ["Mineral", "A naturally formed solid with a definite chemical makeup and an orderly crystal structure."],
  "fossil": ["Fossil", "The preserved remains or trace of a living thing from long ago, usually turned to stone."]
}
HAB_TERM = {
  "forest": ["Forest", "Land thickly covered with trees and the web of life they shelter."],
  "decid": ["Deciduous forest", "A forest of broad-leaved trees that drop their leaves each autumn."],
  "conifer": ["Coniferous forest", "A forest of cone-bearing evergreens such as pines, spruces and firs."],
  "grass": ["Grassland", "An open landscape ruled by grasses, with few trees - like a prairie."],
  "wetland": ["Wetland", "Land soaked with water at least part of the year, such as a marsh, swamp or bog."],
  "desert": ["Desert", "A dry region that gets very little rain, where life is built to survive drought."],
  "mountain": ["Alpine zone", "The cold, treeless habitat high on a mountain, above the tree line."],
  "river": ["Riparian zone", "The green ribbon of life along the banks of a river or stream."],
  "riparian": ["Riparian zone", "The green ribbon of life along the banks of a river or stream."],
  "tundra": ["Tundra", "A cold, treeless northern habitat with frozen ground beneath the surface."]
}

SPECS = []
def S(sid, name, group, track, hab, diet, trait, sci=None, level=None, kind="animal", art=None, why=None):
    SPECS.append(dict(id=sid, name=name, group=group, track=track, hab=hab, diet=diet,
                      trait=trait.strip(), sci=sci, level=level, kind=kind, art=art, why=why))

def cap(s): return s[0].upper() + s[1:] if s else s
def aan(word):
    w = (word or "").strip().lower()
    if not w: return "a"
    return "an" if w[0] in "aeiou" else "a"

PROPER = set("American Eastern Western Northern Southern California Californian Rocky Appalachian "
             "Sierra Pacific Atlantic Canada Canadian Mexican Arctic Virginia Carolina Florida Texas "
             "Colorado Alaska Alaskan Oregon Nevada Sonoran Mojave Chihuahuan Allegheny Cascade Ozark "
             "North South East West Great New England Christmas Gila Joshua Baltimore British Io "
             "Joe-pye".split())

def midname(name):
    first = name.split(" ")[0].strip("(")
    if first in PROPER or first.endswith("'s") or first.endswith("'"):
        return name
    return name[0].lower() + name[1:] if name else name

def rnd(seed, n):
    return int(hashlib.md5(seed.encode()).hexdigest(), 16) % n

def pick_distractors(correct, pool, seed, k=3):
    opts = [x for x in pool if x != correct]
    opts.sort(key=lambda x: hashlib.md5((seed + x).encode()).hexdigest())
    return opts[:k]

def geo_label(group, cat):
    g = group.lower()
    if cat == "mineral": return "a mineral"
    if cat == "fossil": return "a fossil"
    if "igneous" in g: return "an igneous rock"
    if "sedimentary" in g: return "a sedimentary rock"
    if "metamorphic" in g: return "a metamorphic rock"
    return "a rock"

def build_quiz(sp, cat, habp, dietp):
    nm = midname(sp["name"]); quiz = []
    if cat in GEO_CATS:
        correct = geo_label(sp["group"], cat)
        pool = ["an igneous rock", "a sedimentary rock", "a metamorphic rock", "a mineral", "a fossil"]
        d1 = pick_distractors(correct, pool, sp["id"] + "g")
        ch1 = [correct] + d1
        ch1.sort(key=lambda x: hashlib.md5((sp["id"] + "a" + x).encode()).hexdigest())
        quiz.append({"type": "mc", "q": "The " + nm + " is best classified as:",
                     "choices": ch1, "answer": ch1.index(correct),
                     "why": "The " + nm + " is " + correct + "."})
        quiz.append({"type": "tf", "q": cap(sp["trait"]), "answer": True,
                     "why": "True - that's a real feature of the " + nm + "."})
        return quiz
    hpool = list(HAB.values())
    d1 = pick_distractors(habp, hpool, sp["id"] + "h")
    ch1 = [habp] + d1
    ch1.sort(key=lambda x: hashlib.md5((sp["id"] + "a" + x).encode()).hexdigest())
    quiz.append({"type": "mc", "q": "Where is the " + nm + " most at home?",
                 "choices": ch1, "answer": ch1.index(habp),
                 "why": "The " + nm + " is most at home in " + habp + "."})
    cpool = BIO_CATS[:]
    d2 = pick_distractors(cat, cpool, sp["id"] + "c")
    ch2 = [cat] + d2
    ch2.sort(key=lambda x: hashlib.md5((sp["id"] + "b" + x).encode()).hexdigest())
    quiz.append({"type": "mc", "q": "The " + nm + " is classified as a kind of:",
                 "choices": ch2, "answer": ch2.index(cat),
                 "why": "The " + nm + " is " + aan(cat) + " " + cat + "."})
    if rnd(sp["id"] + "q", 2) == 0 or not dietp or sp["diet"] in ("photosyn", "decompose"):
        quiz.append({"type": "tf", "q": cap(sp["trait"]), "answer": True,
                     "why": "True - that's a real feature of the " + nm + "."})
    else:
        wrongpool = [d for d in DIET.values() if d != dietp and not d.startswith("(")]
        wrong = wrongpool[rnd(sp["id"] + "w", len(wrongpool))]
        quiz.append({"type": "tf", "q": "The " + nm + " mainly eats " + wrong + ".",
                     "answer": False, "why": "False - the " + nm + " actually eats " + dietp + "."})
    return quiz

def build_lesson(sp):
    cat = simple_cat(sp["group"])
    habp = HAB.get(sp["hab"], sp["hab"]) if sp["hab"] else None
    dietp = DIET.get(sp["diet"], sp["diet"]) if sp["diet"] else None
    art = sp["art"] or art_for(cat, sp["hab"])
    nm = midname(sp["name"]); grp = sp["group"]
    if nm.lower() == grp.lower(): grp = cat
    if cat in GEO_CATS:
        p1 = "The " + nm + " is " + aan(grp) + " " + grp + "."
        if sp.get("sci"): p1 += " " + sp["sci"]
        explain = [p1, cap(sp["trait"])]
    else:
        p1 = "The " + nm + " is " + aan(grp) + " " + grp
        if habp: p1 += ", most at home in " + habp
        p1 += "."
        if sp.get("sci") and " " in sp["sci"]:
            p1 += " Scientists call it " + sp["sci"] + "."
        if dietp:
            if sp["diet"] == "photosyn":
                p1 += " Like all green plants, it makes its own food from sunlight through photosynthesis."
            elif sp["diet"] == "decompose":
                p1 += " It feeds by breaking down dead leaves and wood, recycling their nutrients back into the soil."
            else:
                p1 += " It mostly eats " + dietp + "."
        explain = [p1, cap(sp["trait"])]
    terms = []
    ct = CAT_TERM.get(cat)
    if ct: terms.append(ct)
    ht = HAB_TERM.get(sp["hab"])
    if ht and (not terms or ht[0] != terms[0][0]): terms.append(ht)
    src_pair = SRC_BY.get(sp["kind"], SRC_BY["animal"])
    sources = [{"label": src_pair[0][0], "url": src_pair[0][1]},
               {"label": src_pair[1][0], "url": src_pair[1][1]}]
    lesson = {"title": sp["name"], "track": sp["track"], "level": sp["level"] or "Core",
        "src": SRC_CODE.get(sp["kind"], "si"), "time": 3,
        "explain": explain, "terms": terms, "art": art, "sources": sources,
        "quiz": build_quiz(sp, cat, habp, dietp)}
    if sp.get("why"): lesson["why"] = sp["why"]
    return lesson

UNITS = []
def U(title, subtitle, track, level, ids):
    UNITS.append({"id": "u-gen-" + str(len(UNITS) + 1), "title": title, "subtitle": subtitle,
                  "track": track, "level": level, "ids": ids})

def chunk_units(title_base, subtitle, track, level, ids, size=6):
    parts = [ids[i:i+size] for i in range(0, len(ids), size)]
    roman = ["", " I", " II", " III", " IV", " V", " VI", " VII", " VIII", " IX", " X", " XI", " XII"]
    for idx, part in enumerate(parts):
        suffix = roman[idx + 1] if len(parts) > 1 and idx + 1 < len(roman) else ""
        U(title_base + suffix, subtitle, track, level, part)

def emit():
    lessons = {}
    for sp in SPECS:
        lessons[sp["id"]] = build_lesson(sp)
    with open("/home/claude/terra/seahype-curriculum.js", "w", encoding="utf-8") as f:
        f.write("window.__SEA_LESSONS__ = Object.assign(window.__SEA_LESSONS__ || {}, " + json.dumps(lessons) + ");\n")
        f.write("window.__SEA_UNITS_EXTRA__ = (window.__SEA_UNITS_EXTRA__ || []).concat(" + json.dumps(UNITS) + ");\n")
    print("generated lessons:", len(lessons), "| units:", len(UNITS),
          "| ids unique:", len(set(s["id"] for s in SPECS)) == len(SPECS))
