#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

# ---- MARVELS (Library "Wonders" tab): natural-world records {title, fact, src} ----
MARVELS = [
 ("The tallest living thing on Earth","A coast redwood in California named Hyperion stands about 116 m tall - taller than a 35-story building. Redwoods are the tallest trees known to exist.","usfs"),
 ("The largest single living thing by volume","A giant sequoia called General Sherman holds more wood than any other single tree, weighing an estimated 1,900 tonnes - yet it grew from a seed smaller than an oat flake.","nps"),
 ("Among the oldest living things","Great Basin bristlecone pines high in the western mountains can live more than 4,800 years, making some older than the pyramids of Egypt.","usfs"),
 ("Possibly the largest organism of all","A single honey fungus in Oregon spreads its underground threads across roughly 9 square kilometers and may be thousands of years old - by area, perhaps the biggest organism on Earth.","usfs"),
 ("The fastest animal on the planet","In a hunting dive the peregrine falcon exceeds 320 km/h, faster than a race car, making it the fastest animal known.","cornell"),
 ("The fastest land animal in North America","The pronghorn can sprint at over 80 km/h and hold a fast pace for miles - speed thought to have evolved to outrun long-extinct American cheetahs.","usfws"),
 ("One of nature's greatest journeys","Monarch butterflies travel thousands of kilometers from as far as Canada to the same small patch of Mexican forest each year, a trip no single butterfly completes both ways.","si"),
 ("The longest cave on Earth","Mammoth Cave in Kentucky has more than 686 km of mapped passages - by far the longest known cave system in the world, and still growing as explorers map more.","nps"),
 ("North America's highest peak","Denali in Alaska rises about 6,190 m above sea level, and measured from its base it is one of the tallest mountains on land anywhere.","usgs"),
 ("Some of the oldest rock on Earth","Rocks in northern Canada have been dated to around 4 billion years old - nearly as old as the planet itself - preserving a record from Earth's distant youth.","usgs"),
 ("Two billion years of history in one canyon","The walls of the Grand Canyon expose rock layers spanning nearly 2 billion years, letting visitors look back across an immense stretch of Earth's past in a single view.","nps"),
 ("A dam you can see from space","Beavers in northern Canada built a dam over 850 m long - so large it can be spotted in satellite images - showing how powerfully these animals reshape the land.","nwf"),
]

with open("/home/claude/terra/seahype-extra-content.js", "w", encoding="utf-8") as f:
    f.write("/* TerraHype natural-world records for the Library 'Wonders' tab. */\n")
    out = [dict(zip(["title","fact","src"], r)) for r in MARVELS]
    f.write("window.__SEA_MARVELS__ = " + json.dumps(out, ensure_ascii=False) + ";\n")

# ---- ROCKS reference (Library "Rocks" tab): __SEA_SHELLS__ repurposed ----
# fields: name, sci (italic sub-label), group, art (SEA_ART key), regions (type tags), size, desc
ROCKS = [
 ("Granite","Coarse-grained, intrusive","Igneous rock","mineral",["Igneous"],"Hardness ~6-7",
  "Look for a speckled mix of glassy gray quartz, pink or white feldspar and flecks of dark mica. Its large crystals show it cooled slowly deep underground. Common in mountains and used for countertops and monuments."),
 ("Basalt","Fine-grained, volcanic","Igneous rock","mineral",["Igneous"],"Hardness ~6",
  "A dark, heavy, fine-grained rock whose crystals are too small to see. It forms from fast-cooling lava and makes up most of the ocean floor and many lava plains. Sometimes full of small gas holes."),
 ("Obsidian","Volcanic glass","Igneous rock","mineral",["Igneous"],"Hardness ~5-6",
  "Shiny black natural glass with sharp, curved edges, formed when lava cooled almost instantly. It has no crystals. Early peoples flaked it into razor-sharp blades and arrowheads."),
 ("Pumice","Frothy volcanic rock","Igneous rock","mineral",["Igneous"],"Very low density",
  "A pale, gritty rock so full of frozen gas bubbles that it can float on water - the only common rock that does. It forms from frothy lava blasted from a volcano."),
 ("Sandstone","Cemented sand grains","Sedimentary rock","mineral",["Sedimentary"],"Hardness ~6-7",
  "Made of sand grains you can often see and feel, cemented together. It frequently shows layers or ripple marks and forms many colorful desert cliffs, arches and canyon walls."),
 ("Limestone","Mostly calcium carbonate","Sedimentary rock","mineral",["Sedimentary"],"Hardness ~3",
  "A pale gray rock built largely from ancient shells and coral. It fizzes when a drop of weak acid touches it, and slowly dissolving limestone forms most of the world's caves."),
 ("Shale","Hardened mud and clay","Sedimentary rock","mineral",["Sedimentary"],"Hardness ~3",
  "A fine, dull rock that splits into thin flat layers. Formed from compacted mud, it is the most common sedimentary rock and often holds well-preserved fossils."),
 ("Conglomerate","Cemented pebbles","Sedimentary rock","mineral",["Sedimentary"],"Varies",
  "A natural concrete of rounded pebbles and gravel cemented in finer material. The rounded stones show they were tumbled smooth by water before settling in a riverbed or beach."),
 ("Marble","Metamorphosed limestone","Metamorphic rock","mineral",["Metamorphic"],"Hardness ~3",
  "A smooth, often swirled stone that began as limestone before heat and pressure recrystallized it. Prized by sculptors, it can be polished to a soft shine and still fizzes in acid."),
 ("Slate","Metamorphosed shale","Metamorphic rock","mineral",["Metamorphic"],"Hardness ~3-4",
  "A fine, dark gray rock that splits cleanly into flat sheets. Made from shale squeezed by heat and pressure, it was long used for roof tiles and chalkboards."),
 ("Gneiss","Banded, high-grade","Metamorphic rock","mineral",["Metamorphic"],"Hardness ~6-7",
  "Recognizable by its stripes of light and dark minerals, formed under intense heat and pressure deep in the crust. Some gneiss is among the oldest rock on Earth."),
 ("Quartzite","Metamorphosed sandstone","Metamorphic rock","mineral",["Metamorphic"],"Hardness ~7",
  "A very hard, often pale rock made when sandstone is baked until its grains fuse. Unlike sandstone it does not crumble, and it resists almost all weathering."),
 ("Quartz","Silicon dioxide","Mineral","mineral",["Mineral"],"Hardness 7",
  "One of the most common minerals, forming six-sided crystals that come in many colors, including purple amethyst and yellow citrine. It is hard enough to scratch glass."),
 ("Feldspar","Aluminum silicates","Mineral","mineral",["Mineral"],"Hardness 6",
  "The most abundant mineral group in the crust, usually pink, white or gray with flat, blocky crystals. It makes up much of granite and slowly weathers into clay."),
 ("Calcite","Calcium carbonate","Mineral","mineral",["Mineral"],"Hardness 3",
  "A soft, often clear or white mineral that fizzes in weak acid. Clear pieces can split light into a double image. It builds limestone and marble and lines many caves."),
 ("Pyrite","Iron sulfide","Mineral","mineral",["Mineral"],"Hardness 6-6.5",
  "Nicknamed 'fool's gold' for its shiny brassy color, it often grows in striking near-perfect cubes. Unlike real gold it is hard and brittle, and it can spark when struck."),
 ("Mica","Sheet silicate","Mineral","mineral",["Mineral"],"Hardness 2-3",
  "A mineral that peels into thin, flexible, see-through sheets and adds glitter to many rocks. Tilt a rock in sunlight and the sparkles are often flakes of mica."),
 ("Trilobite","Extinct arthropod","Fossil","fossil",["Fossil"],"To ~10 cm",
  "A common fossil of a hard-shelled sea animal with a body in three lengthwise lobes. Trilobites thrived for nearly 300 million years before dying out, long before the dinosaurs."),
 ("Ammonite","Coiled cephalopod","Fossil","fossil",["Fossil"],"To ~30 cm+",
  "A spiral, chambered shell from an ancient relative of squid and the nautilus. Often beautifully ridged and sometimes shimmering, ammonites are prized and widespread fossils."),
 ("Petrified wood","Mineralized wood","Fossil","fossil",["Fossil"],"Varies",
  "Ancient wood turned to colorful stone, cell by cell, as minerals replaced the original tissue. It can still show growth rings and bark, but it is now hard rock."),
]

with open("/home/claude/terra/seahype-shells.js", "w", encoding="utf-8") as f:
    f.write("/* TerraHype rocks, minerals and fossils for the Library 'Rocks' tab.\n")
    f.write("   regions tags: Igneous, Sedimentary, Metamorphic, Mineral, Fossil (Common = any).\n")
    f.write("   'art' matches a key in window.SEA_ART. */\n")
    out = [dict(zip(["name","sci","group","art","regions","size","desc"], r)) for r in ROCKS]
    f.write("window.__SEA_SHELLS__ = " + json.dumps(out, ensure_ascii=False) + ";\n")

print("marvels:", len(MARVELS), "| rocks:", len(ROCKS))
