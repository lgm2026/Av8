#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# TerraHype Library reference content -> seahype-content.js
import json

GLOSSARY = [
 ("Adaptation","Ecology","A feature or behavior that helps a living thing survive in its environment."),
 ("Biodiversity","Ecology","The variety of different living things and habitats in an area."),
 ("Biome","Habitats","A large region defined by its climate and the community of life adapted to it."),
 ("Camouflage","Animals","Colors or patterns that help an animal blend into its surroundings."),
 ("Canopy","Plants","The leafy upper layer of a forest formed by the tallest trees."),
 ("Carnivore","Animals","An animal that eats other animals."),
 ("Climate","Habitats","The usual pattern of temperature and rainfall in a place over many years."),
 ("Cold-blooded","Animals","Relying on the surroundings, such as sunlight, to control body temperature."),
 ("Conservation","Conservation","Caring for and protecting nature so it stays healthy for the future."),
 ("Decomposer","Ecology","A living thing that breaks down dead matter and returns its nutrients to the soil."),
 ("Deciduous","Plants","Describing trees that drop their leaves each year, as in temperate forests."),
 ("Ecosystem","Ecology","All the living things in an area plus the non-living things they depend on."),
 ("Endangered species","Conservation","A species at serious risk of dying out completely."),
 ("Erosion","Geology","The wearing away and carrying off of soil or rock by water, wind or ice."),
 ("Extinct","Conservation","Describing a species that has died out completely and forever."),
 ("Food chain","Ecology","The path of energy as one living thing is eaten by another."),
 ("Food web","Ecology","The network of many connected food chains in an ecosystem."),
 ("Fossil","Geology","The preserved remains or trace of a living thing from long ago."),
 ("Fragmentation","Conservation","The breaking of habitat into smaller, separated pieces."),
 ("Fungus","Plants","A living thing, neither plant nor animal, that feeds by breaking matter down."),
 ("Germination","Plants","When a seed begins to sprout and grow into a new plant."),
 ("Habitat","Ecology","The specific place where a particular plant or animal naturally lives."),
 ("Herbivore","Animals","An animal that eats only plants."),
 ("Humus","Geology","Dark, decayed plant and animal matter that makes soil rich and holds water."),
 ("Igneous rock","Geology","Rock formed when molten magma or lava cools and hardens."),
 ("Indicator species","Ecology","A species whose presence reveals the health of its environment."),
 ("Invasive species","Conservation","A non-native species that spreads aggressively and harms an ecosystem."),
 ("Invertebrate","Animals","An animal without a backbone, such as an insect, spider or worm."),
 ("Keystone species","Ecology","A species whose presence has an unusually large effect on its ecosystem."),
 ("Larva","Animals","A young animal, like a tadpole or caterpillar, that looks unlike the adult."),
 ("Lichen","Plants","A partnership of a fungus and an alga that can grow on bare rock or bark."),
 ("Magma","Geology","Hot, molten rock beneath the Earth's surface."),
 ("Metamorphic rock","Geology","Rock changed into a new form by heat and pressure, without melting."),
 ("Migration","Animals","The seasonal journey some animals make between regions to find food or breed."),
 ("Mineral","Geology","A naturally formed solid with a definite makeup and orderly crystal structure."),
 ("Native species","Conservation","A species that naturally belongs in a particular region."),
 ("Naturalist","Field skills","A person who studies and observes nature in the field."),
 ("Niche","Ecology","The particular role and way of life a species has in its ecosystem."),
 ("Nocturnal","Animals","Active mainly at night."),
 ("Omnivore","Animals","An animal that eats both plants and animals."),
 ("Photosynthesis","Plants","How plants use sunlight, water and carbon dioxide to make food and release oxygen."),
 ("Pioneer species","Ecology","The first tough species to colonize bare or disturbed ground."),
 ("Pollinator","Animals","An animal that moves pollen so plants can make seeds and fruit."),
 ("Predator","Animals","An animal that hunts and eats other animals."),
 ("Prey","Animals","An animal that is hunted and eaten by another."),
 ("Producer","Ecology","A living thing, usually a plant, that makes its own food from sunlight."),
 ("Riparian zone","Habitats","The strip of plant life along the banks of a river or stream."),
 ("Sediment","Geology","Small pieces of broken-down rock that can pile up and harden into rock."),
 ("Sedimentary rock","Geology","Rock formed from layers of sediment pressed and cemented together."),
 ("Species","Ecology","A group of living things so alike they can breed and produce similar offspring."),
 ("Succession","Ecology","The gradual change in the community of species in an area over time."),
 ("Topsoil","Geology","The dark, nutrient-rich upper layer of soil where most plant roots grow."),
 ("Vertebrate","Animals","An animal with a backbone, such as a mammal, bird, reptile, amphibian or fish."),
 ("Warm-blooded","Animals","Able to keep a steady body temperature even when it is cold outside."),
 ("Watershed","Habitats","All the land that drains into a particular river, lake or wetland."),
 ("Wetland","Habitats","Land soaked or covered with water at least part of the year."),
 ("Weathering","Geology","The breaking down of rock in place by water, ice, plants or chemicals."),
 ("Wildlife corridor","Conservation","A protected strip of habitat that lets animals move between larger areas."),
]

PRON = [
 ("Photosynthesis","foh-toh-SIN-thuh-sis","The way green plants make food from light."),
 ("Chlorophyll","KLOR-uh-fil","The green pigment that captures sunlight."),
 ("Deciduous","dih-SIJ-oo-us","Trees that drop their leaves each fall."),
 ("Coniferous","kuh-NIF-er-us","Cone-bearing evergreens like pines and firs."),
 ("Riparian","rih-PAIR-ee-un","The green zone along a riverbank."),
 ("Biodiversity","BY-oh-dih-VUR-sih-tee","The variety of life in a place."),
 ("Ecosystem","EE-koh-sis-tum","A community of life plus its surroundings."),
 ("Igneous","IG-nee-us","Rock formed from cooled magma or lava."),
 ("Sedimentary","sed-uh-MEN-tuh-ree","Rock formed from layers of sediment."),
 ("Metamorphic","met-uh-MOR-fik","Rock changed by heat and pressure."),
 ("Lichen","LY-kun","A fungus and alga living together; sounds like 'liken'."),
 ("Fungi","FUN-jy","The plural of fungus; also said FUNG-guy."),
 ("Amphibian","am-FIB-ee-un","A frog, toad or salamander."),
 ("Herbivore","UR-buh-vor","A plant-eating animal; the 'h' is often silent."),
 ("Carnivore","KAR-nuh-vor","A meat-eating animal."),
 ("Saguaro","suh-WAR-oh","The giant cactus of the Sonoran Desert; the 'g' is soft."),
 ("Mycorrhiza","my-kuh-RY-zuh","The helpful link between fungi and plant roots."),
 ("Succession","suk-SESH-un","The step-by-step change of an ecosystem over time."),
 ("Hemlock","HEM-lok","A shade-loving evergreen tree of cool forests."),
 ("Quaking aspen","KWAY-king AS-pun","The tree whose leaves tremble in the breeze."),
 ("Pronghorn","PRONG-horn","The fastest land animal in North America."),
 ("Hemlock woolly adelgid","HEM-lok WOOL-ee uh-DEL-jid","A tiny invasive insect harming hemlock trees."),
 ("Conservation","kon-sur-VAY-shun","Protecting nature for the future."),
 ("Habitat","HAB-ih-tat","The natural home of a plant or animal."),
 ("Invertebrate","in-VUR-tuh-brit","An animal without a backbone."),
 ("Trilobite","TRY-luh-byte","An ancient sea animal, now a common fossil."),
]

TAXONOMY = [
 ("Mammals","Class (Mammalia)","Bear, deer, fox, squirrel, bat","Warm-blooded, fur or hair, feed their young milk."),
 ("Birds","Class (Aves)","Eagle, owl, robin, heron, hummingbird","Warm-blooded, feathered, beaked egg-layers; most can fly."),
 ("Reptiles & amphibians","Two classes","Snake, turtle, frog, salamander","Cold-blooded; reptiles have dry scales, amphibians moist skin."),
 ("Insects & invertebrates","Many groups","Butterfly, beetle, bee, spider, worm","Animals without backbones; insects have six legs, spiders eight."),
 ("Freshwater fish","Several groups","Trout, bass, sunfish, catfish","Cold-blooded water animals that breathe through gills."),
 ("Trees & shrubs","Woody plants","Oak, maple, pine, sagebrush","Woody plants; trees have one main trunk, shrubs several stems."),
 ("Wildflowers & forbs","Flowering plants","Milkweed, coneflower, trillium","Soft-stemmed flowering plants that are not grasses."),
 ("Grasses & sedges","Grass family and kin","Bluestem, switchgrass, tussock sedge","Narrow-leaved plants with jointed stems; the rulers of prairies and marshes."),
 ("Ferns & mosses","Spore plants","Cinnamon fern, bracken, sphagnum","Plants that reproduce by spores instead of seeds or flowers."),
 ("Fungi & lichens","Kingdom (Fungi)","Morel, chanterelle, reindeer lichen","Neither plant nor animal; they feed by breaking matter down."),
 ("Rocks & minerals","Earth materials","Granite, basalt, quartz, calcite","The non-living solids that build the Earth's crust."),
 ("Fossils","Traces of ancient life","Trilobite, ammonite, petrified wood","Preserved remains or traces of living things from deep time."),
]

CONCEPTS = [
 ("Everything is connected","In nature, living and non-living things are linked in a web. A change to the soil, water, or a single species can ripple out to many others. This is why conservationists study whole ecosystems, not just one part.","nps"),
 ("Energy flows, nutrients cycle","Energy enters ecosystems from the sun and flows one way up the food chain, shrinking at each step. Nutrients, by contrast, are recycled endlessly as decomposers return dead matter to the soil.","si"),
 ("Sunlight feeds almost everything","Green plants turn sunlight into food through photosynthesis, forming the base of nearly every food web on land and filling the air with oxygen.","si"),
 ("Variety makes nature strong","The more kinds of life an ecosystem holds, the better it can survive shocks like drought or disease. Biodiversity is a form of natural insurance.","iucn"),
 ("Habitat is everything","Most species vanish because their homes are destroyed. Protecting and reconnecting habitat is the single most powerful tool in conservation.","usfws"),
 ("Climate shapes life","Temperature and rainfall decide which biome forms in a place and which plants and animals can live there, from desert to tundra.","nasa"),
 ("Nature changes over time","Through succession, bare ground slowly becomes meadow, then shrubs, then forest. Even solid rock is recycled over millions of years.","nps"),
 ("Some species hold the web together","Keystone species like beavers and wolves shape their whole ecosystem, so protecting a few can safeguard many.","nps"),
 ("Soil and water are alive and limited","Healthy soil takes centuries to form, and all our freshwater moves through one cycle. Both are easily damaged and worth protecting.","nrcs"),
 ("People are part of nature","Humans depend on nature for air, water, food and wonder, and our choices shape its future. Conservation is about living well within the living world.","nwf"),
]

CAREERS = [
 ("Wildlife biologist","Studies animals in the wild and finds ways to protect them and their habitats.","A degree in wildlife biology or zoology, plus field experience; often a graduate degree.","usfws"),
 ("Park ranger","Protects public lands, enforces rules, and helps visitors learn about and enjoy nature safely.","A background in natural resources or law enforcement; strong outdoor and people skills.","nps"),
 ("Forester","Manages forests for healthy growth, wildlife, recreation and careful timber use.","A degree in forestry; knowledge of trees, soils, fire and mapping.","usfs"),
 ("Ecologist","Studies how living things interact with one another and their environment.","A degree in ecology or biology; strong skills in field study and data.","si"),
 ("Conservation scientist","Plans how to protect and restore land, water and wildlife, often for agencies or nonprofits.","A degree in environmental or natural resource science; project and people skills.","nrcs"),
 ("Botanist","Studies plants, from identifying species to protecting rare ones and fighting invasives.","A degree in botany or plant science; sharp identification skills.","usda"),
 ("Hydrologist","Studies water, where it flows and how to keep rivers, lakes and groundwater clean.","A degree in hydrology, geology or environmental engineering.","usgs"),
 ("Environmental educator","Teaches people of all ages about nature and how to care for it.","A background in education and science; a gift for explaining and inspiring.","nwf"),
 ("Wildlife veterinarian","Cares for the health of wild animals and helps recover endangered species.","Veterinary school plus training in wildlife and conservation medicine.","usfws"),
 ("GIS and mapping specialist","Makes maps and analyzes data to track habitats, wildlife and land change.","Skills in geography, computers and mapping software (GIS).","usgs"),
]

HISTORY = [
 ("1872","World's first national park","Yellowstone is set aside as the first national park anywhere, protecting its geysers, wildlife and wild land for everyone."),
 ("1892","Sierra Club founded","Naturalist John Muir helps found the Sierra Club to protect wild lands, especially in California's mountains."),
 ("1903","First national wildlife refuge","President Theodore Roosevelt protects Pelican Island in Florida, beginning the national wildlife refuge system."),
 ("1905","U.S. Forest Service created","A new agency is formed to care for the nation's forests and use their resources wisely."),
 ("1916","National Park Service created","A single agency is established to protect and manage all of America's national parks."),
 ("1934","Soil conservation begins","After the Dust Bowl strips topsoil from the plains, the nation launches major efforts to protect soil from erosion."),
 ("1949","A land ethic is written","In A Sand County Almanac, Aldo Leopold argues that people should treat the land as a community to which they belong."),
 ("1962","Silent Spring","Rachel Carson's book reveals the harm of careless pesticide use and helps spark the modern environmental movement."),
 ("1970","First Earth Day and the EPA","Millions join the first Earth Day, and the Environmental Protection Agency is created to safeguard air, water and land."),
 ("1973","Endangered Species Act","A landmark U.S. law begins protecting threatened and endangered species and the habitats they need to survive."),
]

MILESTONES = [
 ("first-step",1,"First Step","You finished your first lesson. Every naturalist starts with a single careful observation.","National Park Service"),
 ("trail-started",5,"On the Trail","Five lessons in. You are building a real foundation in how the natural world works.","Smithsonian"),
 ("field-ready",10,"Field Ready","Ten lessons done. You now know enough to start noticing nature more closely outdoors.","U.S. Fish & Wildlife Service"),
 ("naturalist-25",25,"Budding Naturalist","Twenty-five lessons. You are connecting plants, animals, rocks and habitats into a bigger picture.","National Wildlife Federation"),
 ("steward-50",50,"Land Steward","Fifty lessons. You understand both how nature works and why it is worth protecting.","National Park Service"),
 ("explorer-100",100,"Seasoned Explorer","One hundred lessons. Your knowledge of North America's wild life runs deep and wide.","USGS"),
 ("expert-150",150,"Conservation Expert","One hundred fifty lessons. You have the breadth of a serious student of nature.","IUCN"),
 ("guardian-200",200,"Wilderness Guardian","Two hundred lessons. You have explored nearly the whole field, from soil to summit.","Smithsonian"),
]

def arr(name, rows, keys):
    out = [dict(zip(keys, r)) for r in rows]
    return "window.__SEA_" + name + "__ = " + json.dumps(out, ensure_ascii=False) + ";\n"

with open("/home/claude/terra/seahype-content.js", "w", encoding="utf-8") as f:
    f.write("/* TerraHype Library reference content. */\n")
    f.write(arr("GLOSSARY", GLOSSARY, ["term","cat","def"]))
    f.write(arr("PRON", PRON, ["term","say","note"]))
    f.write(arr("TAXONOMY", TAXONOMY, ["group","rank","examples","note"]))
    f.write(arr("CONCEPTS", CONCEPTS, ["title","body","src"]))
    f.write(arr("CAREERS", CAREERS, ["role","what","path","src"]))
    f.write(arr("HISTORY", HISTORY, ["year","title","body"]))
    f.write(arr("MILESTONES", MILESTONES, ["id","need","title","blurb","cite"]))
print("content: glossary", len(GLOSSARY), "pron", len(PRON), "taxonomy", len(TAXONOMY),
      "concepts", len(CONCEPTS), "careers", len(CAREERS), "history", len(HISTORY), "milestones", len(MILESTONES))
