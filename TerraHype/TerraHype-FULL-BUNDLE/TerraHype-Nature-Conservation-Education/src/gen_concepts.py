#!/usr/bin/env python3
# TerraHype hand-written concept lessons -> seahype-lessons.js (window.__SEA_LESSONS__)
import json
SRC = {
 "usgs":["USGS","https://www.usgs.gov/"],
 "usfs":["USDA Forest Service","https://www.fs.usda.gov/"],
 "nps":["National Park Service","https://www.nps.gov/"],
 "usfws":["U.S. Fish & Wildlife Service","https://www.fws.gov/"],
 "nrcs":["USDA Natural Resources Conservation Service","https://www.nrcs.usda.gov/"],
 "epa":["U.S. EPA","https://www.epa.gov/"],
 "usda":["USDA PLANTS Database","https://plants.usda.gov/"],
 "cornell":["Cornell Lab - All About Birds","https://www.allaboutbirds.org/"],
 "audubon":["National Audubon Society","https://www.audubon.org/"],
 "nwf":["National Wildlife Federation","https://www.nwf.org/"],
 "iucn":["IUCN Red List","https://www.iucnredlist.org/"],
 "si":["Smithsonian - Natural History","https://naturalhistory.si.edu/"],
 "eol":["Encyclopedia of Life","https://eol.org/"],
 "natgeo":["National Geographic Education","https://education.nationalgeographic.org/"],
 "nasa":["NASA Earth Observatory","https://earthobservatory.nasa.gov/"],
 "noaa":["NOAA - Climate","https://www.climate.gov/"],
}
L = {}
def mk(lid, title, track, level, codes, time, explain, why, terms, hook, quiz, misc=None):
    src0 = codes[0]
    sources = [{"label": SRC[c][0], "url": SRC[c][1]} for c in codes]
    rec = {"title": title, "track": track, "level": level, "src": src0, "time": time,
           "explain": explain, "why": why, "terms": [[t, d] for t, d in terms],
           "hook": hook, "sources": sources, "quiz": quiz}
    if misc: rec["misconception"] = misc
    L[lid] = rec

def MC(q, choices, ans, why): return {"type": "mc", "q": q, "choices": choices, "answer": ans, "why": why}
def TF(q, ans, why): return {"type": "tf", "q": q, "answer": ans, "why": why}

# ================= FOUNDATIONS =================
mk("terra-intro","Welcome to nature conservation","foundations","Foundations",["nps","usfws"],3,
 ["Nature conservation means caring for wild plants, animals and the land and water they need to survive. A conservationist studies how nature works, watches for problems like pollution or vanishing habitats, and helps protect and repair wild places so they stay healthy for the future.",
  "Everything in nature is connected. A change to one part - the soil, a river, a single kind of plant - can ripple out to many others. TerraHype walks you through that web piece by piece, from soil and rocks to forests, wildlife and the people who protect them."],
 "Conservation is not about locking nature away from people. It is about understanding nature well enough to use and enjoy it without using it up.",
 [("Conservation","Caring for and protecting nature and natural resources so they last for the future."),
  ("Naturalist","A person who studies and observes nature in the field.")],
 "The land does not belong to us so much as we belong to the land.",
 [MC("What is the main goal of nature conservation?",["To remove all people from nature","To protect nature so it stays healthy for the future","To turn forests into farmland","To collect as many wild animals as possible"],1,"Conservation protects wild places and species so they remain healthy over time."),
  TF("A change to one part of nature can affect many other parts.",True,"True - nature is a connected web, so one change can ripple outward.")])

mk("what-is-ecosystem","What is an ecosystem?","foundations","Foundations",["nps","si"],3,
 ["An ecosystem is a community of living things - plants, animals, fungi and microbes - together with the non-living parts of their home, like sunlight, water, air and soil. A patch of forest, a pond, or even a fallen log can each be an ecosystem.",
  "The living and non-living parts work together. Plants capture sunlight, animals eat plants and one another, and when things die, decomposers break them down and return nutrients to the soil for plants to use again. Energy flows through and nutrients cycle around."],
 "Knowing an area is an ecosystem reminds us that protecting one species often means protecting the whole web it depends on.",
 [("Ecosystem","All the living things in an area plus the non-living things they depend on, working as a system."),
  ("Habitat","The specific place where a particular plant or animal naturally lives.")],
 "Pick up a fallen log and you hold a tiny ecosystem in your hands.",
 [MC("An ecosystem includes:",["Only the animals","Only the plants","Living things plus non-living things like water and soil","Only the weather"],2,"An ecosystem is the living community together with the non-living parts of its home."),
  TF("Decomposers return nutrients to the soil when things die.",True,"True - decomposers recycle dead matter back into nutrients plants can reuse.")])

mk("biomes-overview","Biomes: Earth's major regions","foundations","Foundations",["nps","nasa"],4,
 ["A biome is a huge region defined by its climate and the kinds of life adapted to it. North America alone holds forests, grasslands, deserts, wetlands, mountains and frozen tundra. Temperature and rainfall are the two biggest forces that decide which biome forms where.",
  "Plants and animals are shaped by their biome. Cactus store water for the desert; thick-furred animals suit the cold north; deep-rooted grasses thrive on dry plains. Knowing a biome helps you predict what lives there and what it needs."],
 "Each biome faces different threats, so conservationists tailor their plans to the land they are protecting.",
 [("Biome","A large region defined by its climate and the community of life adapted to it."),
  ("Climate","The usual pattern of temperature and rainfall in a place over many years.")],
 "Travel from a steamy swamp to a frozen peak and you cross several biomes in a single day.",
 [MC("Which two factors most decide which biome forms in a place?",["Temperature and rainfall","Soil color and wind","Day length and altitude only","Number of rivers"],0,"Temperature and rainfall are the main forces that shape a biome."),
  TF("Animals are often specially adapted to the biome they live in.",True,"True - life is shaped by the climate and conditions of its biome.")])

mk("soil-basics","Soil: the living skin of the land","foundations","Foundations",["nrcs","usgs"],4,
 ["Soil is far more than dirt. It is a living mix of tiny mineral grains from broken-down rock, rotting plant and animal matter called humus, water, air and billions of living things. A single handful can hold more microbes than there are people on Earth.",
  "Soil forms in layers called horizons: dark, rich topsoil near the surface, lighter subsoil below, then broken rock and finally solid bedrock. Building just one inch of topsoil can take hundreds of years, which is why losing it to erosion is such a serious problem."],
 "Healthy soil grows our food and filters our water, so protecting soil is one of the quietest but most important jobs in conservation.",
 [("Topsoil","The dark, nutrient-rich upper layer of soil where most plant roots grow."),
  ("Humus","Dark, decayed plant and animal matter that makes soil rich and holds water."),
  ("Erosion","The wearing away and carrying off of soil or rock by wind and water.")],
 "Beneath your feet is a hidden world more crowded than any city.",
 [MC("Why is losing topsoil to erosion a serious problem?",["Topsoil grows back in days","It can take hundreds of years to form an inch of topsoil","Topsoil has no living things","Erosion only moves rocks"],1,"Topsoil forms very slowly, so once it erodes away it is not quickly replaced."),
  TF("A single handful of healthy soil can contain billions of living things.",True,"True - soil teems with microbes and other tiny life.")])

mk("water-cycle","The water cycle","foundations","Foundations",["noaa","usgs"],4,
 ["Earth's water is always on the move in the water cycle. The sun heats water in oceans, lakes and soil, turning it into invisible vapor that rises - this is evaporation. Plants add water vapor too, breathing it out through their leaves in a process called transpiration.",
  "High up, the vapor cools and clumps into clouds (condensation), then falls back as rain or snow (precipitation). Some soaks into the ground to refill underground water, and some runs downhill into streams and rivers, beginning the journey all over again. The same water has cycled for billions of years."],
 "Because all freshwater comes from this cycle, protecting forests and wetlands that store and clean water protects our water supply.",
 [("Evaporation","When liquid water turns into vapor and rises into the air."),
  ("Condensation","When water vapor cools and turns back into tiny droplets, forming clouds."),
  ("Precipitation","Water falling from clouds as rain, snow, sleet or hail.")],
 "The water in your glass may once have rained on the dinosaurs.",
 [MC("What is evaporation?",["Water freezing into ice","Liquid water turning into vapor and rising","Rain falling from clouds","Water soaking into soil"],1,"Evaporation is liquid water turning into vapor and rising into the air."),
  TF("Plants release water vapor into the air through their leaves.",True,"True - this is called transpiration, and it adds moisture to the cycle.")])

mk("watersheds","Watersheds: how water shapes the land","foundations","Foundations",["epa","usgs"],4,
 ["A watershed is all the land that drains its rain and snowmelt into one shared river, lake or wetland. High ground forms the rim, and every drop that falls inside rolls downhill toward the same waterway. You are always standing in some watershed right now.",
  "Because everything connects through flowing water, whatever happens on the land - a spilled chemical, eroding soil, a healthy forest - ends up in the water downstream. That is why conservationists often plan by whole watersheds rather than by single fields or towns."],
 "What we do upstream always reaches our neighbors downstream, so caring for a watershed means caring for everyone who shares it.",
 [("Watershed","All the land that drains into a particular river, lake or wetland."),
  ("Runoff","Rain or melted snow that flows over the land into streams and rivers.")],
 "Every raindrop is on a one-way trip downhill - and the whole neighborhood drinks from where it lands.",
 [MC("A watershed is:",["A shed where water is stored","All the land that drains into one waterway","A type of dam","A machine that cleans water"],1,"A watershed is all the land that drains into a single river, lake or wetland."),
  TF("Pollution on the land can end up in the water downstream.",True,"True - flowing water carries whatever is on the land into waterways downstream.")])

# ================= ECOLOGY =================
mk("energy-flow","Energy flow and the 10% rule","ecology","Core",["nps","si"],4,
 ["Almost all energy in an ecosystem starts with the sun. Plants capture sunlight and store it as food, then plant-eaters eat the plants, and meat-eaters eat the plant-eaters. Energy flows up this chain from one feeding level to the next.",
  "But energy leaks at every step. Animals use most of the energy they eat just to move, stay warm and live, so only about 10% passes up to the next level. That is why there are many more plants than deer, and many more deer than mountain lions - the top of the chain can only support a few."],
 "The 10% rule explains why top predators are naturally rare and need large, healthy areas of habitat to survive.",
 [("Producer","A living thing, usually a plant, that makes its own food from sunlight."),
  ("Consumer","An animal that gets energy by eating other living things."),
  ("Food chain","The path of energy as one living thing is eaten by another.")],
 "It takes a whole hillside of grass to feed the deer that feed a single mountain lion.",
 [MC("About how much energy passes from one feeding level to the next?",["About 10%","About 50%","About 90%","Nearly 100%"],0,"Only about 10% of energy moves up to the next level; the rest is used up or lost as heat."),
  TF("There are usually more producers than top predators in an ecosystem.",True,"True - because energy shrinks at each step, the base of the chain is the largest.")])

mk("producers","Producers: plants power the web","ecology","Core",["usfs","si"],3,
 ["Producers are living things that make their own food, and on land that means green plants. Using sunlight, water and carbon dioxide from the air, they build sugars through photosynthesis - and release the oxygen we breathe as a by-product.",
  "Because producers turn sunlight into food, they are the foundation of almost every land food web. Remove the plants and the plant-eaters starve, then the predators that eat them, all the way up the chain. Every grazing deer and hunting hawk ultimately runs on sunlight captured by plants."],
 "Protecting plant life protects the energy base that every other living thing in the ecosystem depends on.",
 [("Photosynthesis","How plants use sunlight, water and carbon dioxide to make food and release oxygen."),
  ("Carbon dioxide","A gas in the air that plants take in to build their food.")],
 "Every bite a wolf eats traces back to sunlight a plant once caught.",
 [MC("Why are producers called the foundation of the food web?",["They eat the most","They make the food that feeds everything else","They are the largest animals","They live the longest"],1,"Producers make food from sunlight, which all other living things ultimately rely on."),
  TF("Green plants release oxygen as they make food.",True,"True - oxygen is a by-product of photosynthesis.")])

mk("food-webs-land","Food webs and trophic levels","ecology","Core",["nps","nwf"],4,
 ["A food chain shows one path of energy - grass to grasshopper to shrew to hawk. But real ecosystems are tangled food webs, because most animals eat several foods and are eaten by several others. The hawk also eats mice and snakes; the grasshopper feeds many birds.",
  "Scientists sort living things into trophic levels: producers at the bottom, then plant-eaters (herbivores), then meat-eaters (carnivores), with omnivores eating both. Decomposers work at every level, breaking down the dead. The many links make a web sturdier - if one food runs short, animals can often switch to another."],
 "Because species are linked in a web, losing even one can ripple through many others - a key reason conservation looks at whole communities.",
 [("Food web","The network of connected food chains in an ecosystem."),
  ("Herbivore","An animal that eats only plants."),
  ("Carnivore","An animal that eats other animals."),
  ("Omnivore","An animal that eats both plants and animals.")],
 "Tug one strand of a food web and the whole net trembles.",
 [MC("How is a food web different from a single food chain?",["It only has plants","It shows many connected feeding paths, not just one","It has no predators","It runs on moonlight"],1,"A food web links many food chains, since most animals have several foods and predators."),
  TF("An omnivore eats both plants and animals.",True,"True - omnivores have a mixed diet of plants and animals.")])

mk("biodiversity-land","Biodiversity: why variety matters","ecology","Core",["iucn","si"],4,
 ["Biodiversity is the variety of life in a place - the number of different species and the range of habitats they form. A meadow buzzing with dozens of insects, flowers and birds is more biodiverse than a bare lawn with one kind of grass.",
  "Variety makes ecosystems stronger and more able to bounce back from trouble like drought or disease. Different species also do different jobs - pollinating, cleaning water, building soil - so each one is a working part of the whole. When species vanish, those jobs can go undone."],
 "Protecting biodiversity keeps ecosystems resilient and keeps the many free services nature provides us running.",
 [("Biodiversity","The variety of different living things and habitats in an area."),
  ("Species","A group of living things so alike they can breed and produce offspring like themselves."),
  ("Resilience","The ability of an ecosystem to recover after a disturbance.")],
 "A field humming with a hundred species can shrug off a bad year that would flatten a field with one.",
 [MC("Why does higher biodiversity help an ecosystem?",["It makes the ecosystem more fragile","It helps the ecosystem recover from trouble","It removes all predators","It stops the seasons from changing"],1,"More variety makes ecosystems more resilient and keeps more vital jobs covered."),
  TF("A lawn of a single grass is more biodiverse than a wildflower meadow.",False,"False - the meadow with many species is far more biodiverse than a single-grass lawn.")])

mk("succession","Ecological succession","ecology","Core",["nps","usfs"],4,
 ["Ecosystems change over time in a process called succession. After bare ground is exposed - by a fire, flood or landslide - tough pioneer species like mosses, lichens and weeds move in first. They begin building soil and shade.",
  "As conditions improve, grasses give way to shrubs, then fast-growing trees, and finally a mature, stable forest may take over. Each stage changes the place enough to let the next stage arrive. Succession can take decades or centuries, and a disturbance can restart it at any time."],
 "Understanding succession helps conservationists know whether to let land heal on its own or give it a helping hand.",
 [("Succession","The gradual, step-by-step change in the community of species in an area over time."),
  ("Pioneer species","The first tough species to colonize bare or disturbed ground.")],
 "Out of bare rock and ash, a forest slowly writes itself back into being.",
 [MC("Which usually appears first after bare ground is exposed?",["A mature oak forest","Pioneer species like moss and lichen","Large predators","Tall shrubs"],1,"Tough pioneer species such as moss and lichen colonize bare ground first."),
  TF("Succession can be restarted by a disturbance like a fire.",True,"True - a new disturbance can reset the process at any stage.")])

mk("keystone","Keystone species","ecology","Core",["usfws","nps"],4,
 ["A keystone species has an effect on its ecosystem far larger than its numbers would suggest - like the keystone at the top of a stone arch that holds everything else in place. Remove it, and the whole community can change or collapse.",
  "Beavers are a classic example: by damming streams they create ponds and wetlands that countless other species depend on. Wolves are another - by keeping deer and elk moving, they let young trees grow back along streams, which helps fish, birds and beavers in turn."],
 "Spotting keystone species lets conservationists protect the few animals that hold an entire ecosystem together.",
 [("Keystone species","A species whose presence has an unusually large effect on its whole ecosystem."),
  ("Ecosystem engineer","An animal, like a beaver, that reshapes habitat in ways many other species rely on.")],
 "Pull one special stone from the arch and the whole thing can tumble.",
 [MC("What makes a species a keystone species?",["It is the biggest animal around","Its effect on the ecosystem is far larger than its numbers suggest","It eats only plants","It lives the longest"],1,"A keystone species has an outsized effect on its whole ecosystem."),
  TF("Beavers create wetlands that many other species depend on.",True,"True - beavers are ecosystem engineers and a classic keystone species.")])

# ================= FLORA =================
mk("plant-parts","How a plant works","flora","Foundations",["usda","usfs"],4,
 ["A typical plant has three main parts, each with a job. Roots anchor the plant and drink up water and minerals from the soil. The stem holds the plant up and carries water and food between the roots and leaves, like a set of pipes.",
  "Leaves are the plant's food factories, catching sunlight to make sugars. Many plants also grow flowers, which make seeds so the plant can reproduce. Together these parts let a plant feed itself, grow, and make the next generation - all without moving an inch."],
 "Knowing a plant's parts helps you understand what it needs and why healthy soil, sun and water all matter.",
 [("Roots","The underground parts that anchor a plant and absorb water and minerals."),
  ("Stem","The part that supports a plant and carries water and food between roots and leaves."),
  ("Leaf","The part of a plant that captures sunlight to make food.")],
 "A plant is a living solar factory rooted in place.",
 [MC("Which part of a plant absorbs water and minerals from the soil?",["The leaves","The flowers","The roots","The seeds"],2,"Roots anchor the plant and take up water and minerals from the soil."),
  TF("Leaves are where a plant makes most of its food.",True,"True - leaves capture sunlight to make sugars.")])

mk("photosynthesis-land","Photosynthesis","flora","Foundations",["si","nasa"],4,
 ["Photosynthesis is the amazing trick that lets green plants make their own food. In their leaves, plants use energy from sunlight to combine water from the soil with carbon dioxide from the air, building sugary food and releasing oxygen.",
  "The green color comes from chlorophyll, the pigment that captures sunlight. This single process feeds nearly all life on land and fills the air with the oxygen animals need to breathe. In a real sense, forests and grasslands are the planet's lungs."],
 "Because photosynthesis makes both our food and our oxygen, protecting plant life protects the basics of life itself.",
 [("Chlorophyll","The green pigment in plants that captures sunlight for photosynthesis."),
  ("Oxygen","The gas, released by plants, that animals need to breathe.")],
 "Every breath you take was paid for by a plant catching the sun.",
 [MC("What do plants release into the air during photosynthesis?",["Carbon dioxide","Oxygen","Nitrogen","Water vapor only"],1,"Plants release oxygen as a by-product of making food."),
  TF("Chlorophyll is the green pigment that captures sunlight.",True,"True - chlorophyll gives plants their color and captures light energy.")])

mk("trees-anatomy","How a tree grows","flora","Core",["usfs","usda"],4,
 ["A tree is built to live long and stand tall. Its bark is a protective skin that guards against insects, fire and weather. Just under the bark is a thin living layer that grows a new ring of wood each year, which is why you can count a tree's rings to learn its age.",
  "Deep roots anchor the tree and pull up water, while the spreading crown of leaves catches sunlight high above competitors. Wide rings mark good years with plenty of rain; narrow rings mark hard, dry ones, so a tree trunk keeps a hidden record of the climate it lived through."],
 "Old trees store decades of climate history and huge amounts of carbon, making them especially valuable to protect.",
 [("Bark","The protective outer layer of a tree's trunk and branches."),
  ("Tree ring","A yearly ring of wood; counting them reveals a tree's age."),
  ("Crown","The spreading branches and leaves at the top of a tree.")],
 "Slice a trunk and you can read the tree's diary, one ring per year.",
 [MC("Why can you tell a tree's age from its rings?",["It grows one new ring each year","Rings appear only in spring","Each ring is a different tree","Rings form when it rains once"],0,"A tree adds one ring of wood per year, so the rings count its age."),
  TF("Narrow tree rings can mark dry, difficult years.",True,"True - rings are narrower in years with less growth, such as droughts.")])

mk("forest-layers","Layers of a forest","flora","Core",["usfs","nps"],4,
 ["A healthy forest is built in layers, each home to different life. At the top is the canopy, the leafy roof where tall trees soak up sunlight and many birds and insects live. Below it, shorter understory trees and saplings reach for the light that filters through.",
  "Lower still is the shrub layer of bushes, then the herb layer of wildflowers and ferns, and finally the forest floor, carpeted with fallen leaves where fungi and insects recycle the dead. Each layer offers its own food and shelter, which is why a layered forest holds far more life than a bare one."],
 "Logging or clearing that flattens these layers removes habitat for many species, so conservationists value structurally rich forests.",
 [("Canopy","The leafy upper layer of a forest formed by the tallest trees."),
  ("Understory","The layer of shorter trees and plants growing beneath the canopy."),
  ("Forest floor","The ground layer of leaf litter where decomposers recycle dead matter.")],
 "A forest is an apartment building, with neighbors living from the rooftop to the basement.",
 [MC("Which forest layer is the leafy roof formed by the tallest trees?",["The forest floor","The shrub layer","The canopy","The understory"],2,"The canopy is the leafy upper layer formed by the tallest trees."),
  TF("A forest with many layers usually supports more kinds of life.",True,"True - each layer adds habitat, so layered forests are richer in species.")])

mk("fungi-lichen","Fungi and lichens: the recyclers","flora","Core",["usfs","si"],4,
 ["Fungi are not plants or animals but their own kingdom of life. The mushroom you see is just the fruit; most of a fungus is a hidden web of fine threads spreading through soil or wood. Fungi feed by breaking down dead leaves, wood and animals, recycling their nutrients back into the soil.",
  "Many fungi also team up with plants. Their threads wrap around tree roots and trade water and minerals for sugars, helping forests thrive. Lichens are another partnership - a fungus living with an alga - that can grow on bare rock and slowly help turn it into soil."],
 "Without fungi, dead matter would pile up and nutrients would stay locked away, so these quiet recyclers keep whole ecosystems running.",
 [("Fungus","A living thing, neither plant nor animal, that feeds by breaking matter down."),
  ("Decomposer","A living thing that breaks down dead matter and returns its nutrients to the soil."),
  ("Lichen","A partnership of a fungus and an alga that can grow on bare rock or bark.")],
 "The forest's clean-up crew works mostly out of sight, beneath the leaves.",
 [MC("How do most fungi feed?",["By making food from sunlight","By breaking down dead matter","By hunting insects","By drinking rain"],1,"Most fungi feed by breaking down dead leaves, wood and animals."),
  TF("A lichen is a partnership between a fungus and an alga.",True,"True - lichens are a fungus and an alga living together.")])

mk("native-invasive-plants","Native vs. invasive plants","flora","Core",["usfws","nps"],4,
 ["A native plant is one that naturally belongs in a region and has lived there long enough to fit into the local web of life, feeding native insects and animals. An invasive plant is one brought from far away that spreads aggressively and crowds native plants out.",
  "Invasive plants can take over because the insects and diseases that kept them in check back home are missing here. As they smother native plants, the insects and animals that depended on those natives lose their food and shelter, and biodiversity drops. Removing invaders and replanting natives is common conservation work."],
 "Choosing native plants and removing invasive ones is one of the most direct ways people can help local wildlife.",
 [("Native species","A species that naturally belongs in a particular region."),
  ("Invasive species","A non-native species that spreads aggressively and harms the local ecosystem.")],
 "A pretty garden escapee can become a bully that takes over a whole hillside.",
 [MC("Why can invasive plants spread so aggressively?",["They need no sunlight","The pests and diseases that controlled them back home are missing","They are always larger","Native animals plant them on purpose"],1,"Without their natural controls, invasive plants can outcompete natives."),
  TF("Native plants generally support more local wildlife than invasive ones.",True,"True - native plants are woven into the local food web that wildlife depends on.")])

# ================= FAUNA =================
mk("animal-kingdom-land","The animal kingdom on land","fauna","Foundations",["si","eol"],4,
 ["Animals come in an astonishing variety, but scientists sort them into big groups. Animals with a backbone are called vertebrates: mammals, birds, reptiles, amphibians and fish. Animals without a backbone are invertebrates, like insects, spiders, worms and snails - and they make up the great majority of all animal species.",
  "Each group shares key traits. Mammals have fur and feed milk; birds have feathers; reptiles have dry scales; amphibians have moist skin and usually start life in water. Learning these groups gives you a map for identifying almost any creature you meet outdoors."],
 "Knowing how animals are grouped helps conservationists track which kinds of wildlife are thriving and which are in trouble.",
 [("Vertebrate","An animal with a backbone, such as a mammal, bird, reptile, amphibian or fish."),
  ("Invertebrate","An animal without a backbone, such as an insect, spider or worm.")],
 "Most animals on Earth have no backbone at all - the bugs vastly outnumber the rest.",
 [MC("Which of these is an invertebrate?",["A robin","A beetle","A frog","A deer"],1,"A beetle is an invertebrate; it has no backbone."),
  TF("Mammals are animals that have fur and feed their young milk.",True,"True - fur and feeding young milk are key mammal traits.")])

mk("mammals-intro","Mammals","fauna","Foundations",["usfws","nwf"],4,
 ["Mammals are warm-blooded animals with fur or hair that feed their babies milk. They range from tiny shrews to massive moose, and include familiar wildlife like deer, bears, foxes, squirrels and bats - the only mammals that truly fly.",
  "Being warm-blooded lets mammals stay active in cold weather, and many have clever tricks for winter: bears den up, squirrels store nuts, and some grow thicker coats. Most mammals also have excellent senses of smell and hearing, and the largest brains for their size of any animal group."],
 "Many mammals need large territories to roam, so protecting them often means protecting big, connected areas of habitat.",
 [("Mammal","A warm-blooded animal with fur or hair that feeds its young milk."),
  ("Warm-blooded","Able to keep a steady body temperature, even when it is cold outside.")],
 "From a shrew lighter than a coin to a moose taller than a car, all are mammals.",
 [MC("What do all mammals do for their young?",["Lay eggs in water","Feed them milk","Carry them in a shell","Leave them as soon as they hatch"],1,"All mammals feed their young milk."),
  TF("Bats are mammals that can truly fly.",True,"True - bats are the only mammals capable of true flight.")])

mk("birds-intro","Birds","fauna","Foundations",["cornell","audubon"],4,
 ["Birds are warm-blooded animals covered in feathers, the only animals that have them. Feathers keep birds warm and, shaped into wings, let most of them fly. All birds have beaks instead of teeth and lay eggs, usually in carefully built nests.",
  "Different beaks and feet reveal how a bird lives: a hawk's hooked beak tears meat, a finch's stout beak cracks seeds, a heron's long legs wade in shallows. Many birds migrate huge distances with the seasons, navigating by the sun, stars and Earth's magnetic field."],
 "Because birds are easy to spot and sensitive to change, scientists often use them as early warnings of an ecosystem's health.",
 [("Feather","The light, strong covering unique to birds, used for warmth and flight."),
  ("Migration","The seasonal journey some animals make between regions to find food or breed.")],
 "A bird's beak is a tool kit that tells you exactly how it makes a living.",
 [MC("What feature is found only on birds?",["Scales","Feathers","Fur","Gills"],1,"Feathers are unique to birds."),
  TF("A bird's beak shape can tell you what it eats.",True,"True - beaks are adapted to a bird's diet, from cracking seeds to tearing meat.")])

mk("reptiles-amphibians","Reptiles and amphibians","fauna","Core",["usfws","si"],4,
 ["Reptiles and amphibians are both cold-blooded, meaning they rely on their surroundings for warmth and often bask in the sun to heat up. But they differ in important ways. Reptiles - snakes, lizards and turtles - have dry, scaly skin and lay tough-shelled eggs on land.",
  "Amphibians - frogs, toads and salamanders - have moist, thin skin and usually begin life in water as gilled larvae, like tadpoles, before growing legs and lungs. Because amphibians breathe partly through their delicate skin, they are very sensitive to pollution, which makes them important indicators of clean water."],
 "Amphibians are vanishing worldwide, and their sensitive skin makes them an early warning sign that an environment is in trouble.",
 [("Cold-blooded","Relying on the surroundings, like sunlight, to control body temperature."),
  ("Reptile","A cold-blooded animal with dry scales that lays eggs on land."),
  ("Amphibian","A cold-blooded animal with moist skin that usually starts life in water.")],
 "A frog breathes partly through its skin - so it drinks in whatever is in its pond.",
 [MC("How do reptiles differ from amphibians?",["Reptiles have moist skin and live in water","Reptiles have dry scales and lay eggs on land","Reptiles are warm-blooded","Reptiles never lay eggs"],1,"Reptiles have dry, scaly skin and lay shelled eggs on land; amphibians have moist skin and start in water."),
  TF("Amphibians are sensitive to pollution because they breathe partly through their skin.",True,"True - their permeable skin makes amphibians sensitive indicators of clean water.")])

mk("insects-intro","Insects and other invertebrates","fauna","Core",["si","eol"],4,
 ["Insects are the most successful animals on Earth, with more kinds than all other animals combined. Every insect has six legs, a body in three parts - head, thorax and abdomen - and usually a pair or two of wings. Beetles, bees, butterflies, ants and grasshoppers are all insects.",
  "Tiny as they are, insects run the world. They pollinate most flowering plants, including many crops; they recycle dung and dead matter; and they are food for countless birds, fish and other animals. Spiders, with eight legs, are not insects but close invertebrate relatives that help control insect numbers."],
 "Insect numbers are falling in many places, which worries scientists because so much of nature - and our food - depends on them.",
 [("Insect","A six-legged invertebrate with a three-part body and usually wings."),
  ("Pollinator","An animal, often an insect, that moves pollen so plants can make seeds and fruit."),
  ("Arachnid","An eight-legged invertebrate such as a spider or scorpion.")],
 "If insects vanished, most flowering plants - and the animals that eat them - would soon follow.",
 [MC("How many legs does an insect have?",["Four","Six","Eight","Ten"],1,"All insects have six legs."),
  TF("Spiders are insects.",False,"False - spiders are arachnids, with eight legs, not insects.")])

mk("animal-tracks","Reading animal tracks and signs","fauna","Core",["nps","nwf"],4,
 ["You rarely see wild animals up close, but they leave clues everywhere. Footprints in mud or snow, called tracks, can reveal who passed by, how big they were and which way they went. A dog-like track with claw marks may be a fox; a rounded track without claws may be a cat.",
  "Animals leave other signs too: droppings (called scat), gnawed nuts, scratched bark, tufts of fur, and feathers. Reading these signs is a core naturalist skill that lets scientists survey shy or nighttime animals without ever seeing them - sometimes with the help of motion-triggered cameras."],
 "Tracks and signs let conservationists detect rare and secretive animals, helping them map where wildlife lives.",
 [("Track","A footprint left by an animal, useful for identifying it."),
  ("Scat","Animal droppings, which can reveal what an animal is and what it eats."),
  ("Field sign","Any clue, like tracks or chewed plants, that shows an animal has been present.")],
 "An empty trail is never really empty - it is covered in messages, if you can read them.",
 [MC("A rounded paw print with no claw marks most likely belongs to:",["A dog or fox","A cat such as a bobcat","A deer","A bird"],1,"Cats usually leave rounded tracks without claw marks, since their claws retract."),
  TF("Scientists can survey shy animals using tracks and signs without seeing them.",True,"True - tracks, scat and other signs reveal animals that are hard to observe directly.")])
print("Part A lessons:", len(L))

# ================= GEOLOGY =================
mk("geology-intro","Geology: the story in the rocks","geology","Foundations",["usgs","nps"],4,
 ["Geology is the study of the Earth - its rocks, minerals and the slow, powerful forces that shape the land. The ground may look unchanging, but over millions of years mountains rise, rivers carve canyons, and whole continents drift across the globe.",
  "Rocks are made of minerals, the natural crystal building blocks of the Earth's crust. By reading rocks and the fossils inside them, geologists piece together the planet's history - past oceans, ancient volcanoes and vanished forests - like detectives reading clues frozen in stone."],
 "Understanding the land's rocks and soils helps conservationists know what will grow there and how water and pollution will move through it.",
 [("Geology","The study of the Earth, its rocks, minerals and the forces that shape the land."),
  ("Mineral","A naturally formed solid with a definite makeup and orderly crystal structure."),
  ("Rock","A natural solid made of one or more minerals.")],
 "Every cliff and pebble is a page in a story millions of years long.",
 [MC("What are rocks made of?",["Only water","One or more minerals","Living cells","Plastic"],1,"Rocks are natural solids made of one or more minerals."),
  TF("Geologists can read Earth's history from rocks and fossils.",True,"True - rocks and fossils record past oceans, volcanoes and life.")])

mk("rock-cycle","The rock cycle","geology","Core",["usgs","si"],4,
 ["Rocks may seem permanent, but they are slowly recycled in the rock cycle. Deep heat melts rock into magma, which cools into hard igneous rock. At the surface, wind and water break rock into bits of sediment that pile up and harden into sedimentary rock.",
  "Buried deep and squeezed by heat and pressure, any rock can change into metamorphic rock - and if it gets hot enough, it melts back into magma to start again. There is no beginning or end; the same atoms have cycled through countless rocks over billions of years."],
 "The rock cycle shows that even the solid land is always slowly changing, building the soils and landforms life depends on.",
 [("Magma","Hot, molten rock beneath the Earth's surface."),
  ("Sediment","Small pieces of broken-down rock that can pile up and harden into rock."),
  ("Rock cycle","The endless process by which rocks change from one type to another over time.")],
 "The mountain under your feet may once have been mud, lava, and mud again.",
 [MC("In the rock cycle, what does magma cool into?",["Sedimentary rock","Igneous rock","Soil","Sand"],1,"When magma cools and hardens, it forms igneous rock."),
  TF("Heat and pressure can change one kind of rock into another.",True,"True - that is how metamorphic rock forms from other rocks.")])

mk("minerals-intro","Minerals: building blocks of rock","geology","Core",["usgs","si"],4,
 ["Minerals are the natural crystals that make up rocks. Each mineral has its own recipe of chemical elements and grows in an orderly, repeating crystal shape. Quartz, feldspar, mica and calcite are some of the most common.",
  "Geologists tell minerals apart by their properties: color, hardness, luster (how shiny they are), and the color of the streak they leave when scraped on a tile. The same mineral can come in different colors, so these tests matter more than color alone. Minerals also give us metals, gemstones and the materials in everyday objects."],
 "Minerals are the raw materials of both the land and modern life, and mining them responsibly is a real conservation challenge.",
 [("Mineral","A naturally formed solid with a set chemical makeup and crystal structure."),
  ("Hardness","How well a mineral resists being scratched, used to help identify it."),
  ("Crystal","A solid whose atoms are arranged in a neat, repeating pattern.")],
 "Inside an ordinary gray rock hide perfect, geometric crystals.",
 [MC("How do geologists often tell minerals apart?",["By their smell only","By properties like hardness and streak","By how heavy the whole rock is","By the day they were found"],1,"Properties such as hardness, luster and streak help identify minerals."),
  TF("The same mineral can appear in more than one color.",True,"True - which is why color alone is not enough to identify a mineral.")])

mk("igneous","Igneous rocks","geology","Core",["usgs","nps"],3,
 ["Igneous rocks form from cooled molten rock. The word comes from a Latin word for fire. When magma cools slowly deep underground, large crystals have time to grow, making coarse rocks like granite. When lava cools quickly at the surface, crystals stay tiny, making fine rocks like basalt.",
  "Sometimes lava cools so fast that no crystals form at all, creating volcanic glass called obsidian. Frothy lava full of gas bubbles can harden into pumice, the only common rock light enough to float on water. The speed of cooling leaves its fingerprint in the rock's texture."],
 "Igneous rock forms much of the Earth's crust and, as it breaks down, helps build fresh, mineral-rich soil.",
 [("Igneous rock","Rock formed when molten magma or lava cools and hardens."),
  ("Lava","Molten rock that has erupted onto the Earth's surface.")],
 "How fast lava cools decides whether you get big crystals or smooth glass.",
 [MC("Why does granite have large crystals?",["It cooled quickly at the surface","Magma cooled slowly deep underground, giving crystals time to grow","It is made of glass","It never cooled"],1,"Slow cooling deep underground lets large crystals grow, as in granite."),
  TF("Obsidian is volcanic glass that formed when lava cooled very fast.",True,"True - rapid cooling left no time for crystals, forming glassy obsidian.")])

mk("sedimentary","Sedimentary rocks","geology","Core",["usgs","nps"],3,
 ["Sedimentary rocks are built from pieces of older rocks and the remains of living things. Wind and water break rock into sand, silt and clay, which settle in layers in lakes, rivers and seas. Over long ages the layers are pressed and cemented into solid rock like sandstone and shale.",
  "Other sedimentary rocks form from once-living material: limestone is built largely from seashells, and coal from buried plants. Because sediment settles in flat layers, sedimentary rock often forms striped cliffs - and it is the rock most likely to hold fossils."],
 "Sedimentary layers preserve fossils and ancient climates, making them a priceless record of life's history.",
 [("Sedimentary rock","Rock formed from layers of sediment pressed and cemented together."),
  ("Fossil","The preserved remains or trace of a living thing, often found in sedimentary rock.")],
 "Every striped canyon wall is a stack of pages, oldest at the bottom.",
 [MC("Sedimentary rock forms when:",["Magma cools underground","Layers of sediment are pressed and cemented together","Rock is squeezed by deep heat and pressure","Lava cools into glass"],1,"Sedimentary rock forms from layers of sediment cemented together over time."),
  TF("Limestone is built largely from the shells of sea creatures.",True,"True - limestone forms mostly from shells and skeletons of marine life.")])

mk("metamorphic","Metamorphic rocks","geology","Core",["usgs","si"],3,
 ["Metamorphic rocks are rocks that have been changed. The word means 'changed form.' When existing rock is buried deep and squeezed by intense heat and pressure - but not quite melted - its minerals rearrange into a new, often harder rock.",
  "Limestone becomes smooth marble, prized by sculptors. Shale becomes slate, which splits into flat sheets. Granite can become banded gneiss, with its minerals smeared into light and dark stripes. The original rock is transformed without ever turning to liquid."],
 "Metamorphic rocks reveal the enormous forces deep inside mountains, and many are among the oldest rocks on the planet.",
 [("Metamorphic rock","Rock changed into a new form by heat and pressure, without melting."),
  ("Pressure","A squeezing force; deep underground it helps reshape rock.")],
 "Bury limestone deep enough, squeeze it hard enough, and out comes marble.",
 [MC("How do metamorphic rocks form?",["By cooling from magma","By heat and pressure changing existing rock without melting it","By sediment settling in water","By lava cooling into glass"],1,"Heat and pressure transform existing rock into metamorphic rock without melting it."),
  TF("Marble forms when limestone is changed by heat and pressure.",True,"True - marble is metamorphosed limestone.")])

mk("erosion-weathering","Weathering and erosion","geology","Core",["usgs","nrcs"],4,
 ["Two slow forces constantly reshape the land. Weathering is the breaking down of rock where it sits - by freezing water cracking it, plant roots prying it apart, or chemicals dissolving it. It turns solid rock into smaller pieces and, eventually, soil.",
  "Erosion is the carrying away of those pieces by water, wind, ice or gravity. Rivers haul sand to the sea, wind sculpts desert rock, and glaciers grind out valleys. Together, weathering and erosion can level mountains over millions of years - and they also strip away precious topsoil if land is left bare."],
 "Erosion that washes away soil is a major threat to farms and rivers, so slowing it is central to land conservation.",
 [("Weathering","The breaking down of rock in place by water, ice, plants or chemicals."),
  ("Erosion","The carrying away of soil and rock by water, wind, ice or gravity.")],
 "Drop by drop and gust by gust, the softest forces wear down the hardest stone.",
 [MC("What is the difference between weathering and erosion?",["They are the same thing","Weathering breaks rock down; erosion carries the pieces away","Erosion builds new mountains","Weathering only happens underwater"],1,"Weathering breaks rock apart in place; erosion transports the broken pieces."),
  TF("Plant cover on the land can help slow erosion.",True,"True - roots hold soil in place, reducing erosion.")])

mk("geologic-time","Geologic time and fossils","geology","Core",["usgs","si"],4,
 ["Earth is about 4.6 billion years old - a span so vast it is called geologic time. To handle such enormous numbers, geologists divide it into eras and periods, often named for the kinds of life that existed then, like the Age of Dinosaurs.",
  "Fossils are our windows into this deep past. Because younger rock layers usually sit on top of older ones, the deeper a fossil is found, the older it tends to be. By matching fossils between sites, scientists can put the long history of life in order and watch how species changed over millions of years."],
 "Fossils and deep time remind us how rare and recent humans are, and how long nature took to build what we can lose quickly.",
 [("Geologic time","The vast timescale of Earth's history, measured in millions and billions of years."),
  ("Fossil","The preserved remains or trace of an ancient living thing."),
  ("Extinct","Describing a species that has died out completely.")],
 "If Earth's whole history were one day, humans would appear only in the last few seconds.",
 [MC("In undisturbed rock layers, where are the oldest fossils usually found?",["In the top layers","In the deepest, lowest layers","Scattered randomly","Only on the surface"],1,"Older layers lie beneath younger ones, so the deepest fossils are usually oldest."),
  TF("Earth is about 4.6 billion years old.",True,"True - Earth formed roughly 4.6 billion years ago.")])

# ================= HABITATS =================
mk("forest-biome","Forests","habitats","Core",["usfs","nps"],4,
 ["Forests are biomes ruled by trees, and they come in several kinds. Tropical rainforests near the equator are warm, wet and bursting with more species than anywhere else on land. Temperate forests, like much of the eastern United States, have four seasons and trees that often drop their leaves in fall.",
  "Far to the north stretch cold boreal forests of spruce and fir. Whatever the type, forests shelter countless animals, store huge amounts of carbon that would otherwise warm the planet, and release oxygen and moisture into the air. They are among the richest and most important biomes on Earth."],
 "Forests are being cleared worldwide, so protecting and replanting them is one of conservation's biggest priorities.",
 [("Forest","A biome dominated by trees and the web of life they support."),
  ("Deciduous","Describing trees that drop their leaves each year, as in temperate forests."),
  ("Boreal forest","The cold northern forest of evergreens like spruce and fir.")],
 "From steamy rainforest to frozen spruce woods, all are forests - and all are vanishing too fast.",
 [MC("Which forest holds the most species?",["Boreal forest","Tropical rainforest","Temperate forest","No forest has many species"],1,"Tropical rainforests are the most species-rich biome on land."),
  TF("Forests store large amounts of carbon that would otherwise warm the planet.",True,"True - forests lock up carbon, helping moderate the climate.")])

mk("grassland-biome","Grasslands and prairies","habitats","Core",["nps","usfs"],4,
 ["Grasslands are open biomes ruled by grasses rather than trees. They form where there is too little rain for a thick forest, but enough to keep the land from becoming a desert. North America's prairies once stretched across the center of the continent in a sea of grass.",
  "Grasses are tough survivors: much of the plant lives underground as deep roots, so it can regrow after fire or grazing. These deep roots also build some of the richest soil on Earth. That rich soil is exactly why most prairie has been plowed into farmland, leaving native grassland one of the most endangered biomes."],
 "Because so little native prairie remains, protecting and restoring grassland is urgent conservation work.",
 [("Grassland","An open biome dominated by grasses, with few trees."),
  ("Prairie","The temperate grassland of central North America."),
  ("Grazer","An animal, like a bison, that feeds mainly on grass.")],
 "An ocean of grass once rolled across the heart of the continent - now almost all of it is gone.",
 [MC("Why do grasslands have few trees?",["The soil is poisonous","There is too little rain for dense forest but enough to avoid desert","Animals eat every tree seed","It is always too cold"],1,"Grasslands form where rainfall is between forest and desert levels."),
  TF("Much of a prairie grass plant lives underground as deep roots.",True,"True - deep roots let grasses regrow after fire or grazing and build rich soil.")])

mk("wetland-biome","Wetlands","habitats","Core",["epa","usfws"],4,
 ["Wetlands are places where the land is covered or soaked with water at least part of the year - marshes, swamps and bogs. They sit between dry land and open water, and they brim with life, from frogs and dragonflies to wading birds and fish that breed in their shallows.",
  "Wetlands do priceless work for free. They soak up floodwaters like a sponge, filter pollution out of water as it passes through, and store carbon. Despite this, more than half of America's wetlands have been drained or filled, so protecting those that remain is a major goal."],
 "Wetlands clean our water and buffer floods, yet they are easily destroyed, making their protection a conservation priority.",
 [("Wetland","Land soaked or covered with water at least part of the year."),
  ("Marsh","A wetland dominated by grasses and reeds rather than trees."),
  ("Filter","To remove pollution from water, a key service wetlands provide.")],
 "A swamp is not wasteland - it is a sponge, a filter, and a nursery all at once.",
 [MC("Which is a service wetlands provide?",["They make deserts","They soak up floods and filter water","They block all rivers","They create earthquakes"],1,"Wetlands absorb floodwater and filter pollutants, among other services."),
  TF("More than half of America's original wetlands have been drained or filled.",True,"True - widespread draining is why protecting remaining wetlands matters.")])

mk("desert-biome","Deserts","habitats","Core",["nps","usgs"],4,
 ["Deserts are biomes that receive very little rain - usually less than 25 centimeters a year. They are not always hot; some, like parts of the Great Basin, are cold in winter. What unites them is dryness, and the remarkable ways life copes with it.",
  "Desert plants and animals are masters of saving water. Cactus store it in thick stems and guard it with spines; many animals shelter in burrows by day and come out in the cool night. Despite the harsh conditions, healthy deserts hold a surprising variety of specially adapted life."],
 "Deserts are fragile and slow to recover, so even small damage from vehicles or development can scar them for decades.",
 [("Desert","A biome that receives very little rainfall, where life is adapted to drought."),
  ("Adaptation","A feature that helps a living thing survive in its environment, like water-storing stems.")],
 "Life in the desert is a daily masterclass in making every drop of water count.",
 [MC("What defines a desert?",["It is always hot","It receives very little rainfall","It has no living things","It is covered in sand only"],1,"Deserts are defined by very low rainfall, not necessarily by heat or sand."),
  TF("Many desert animals shelter in burrows by day and are active at night.",True,"True - this helps them avoid the daytime heat and save water.")])

mk("mountain-biome","Mountains and alpine zones","habitats","Core",["usgs","nps"],4,
 ["Mountains pack many habitats into a small space. As you climb, the air grows colder and thinner, so the plants and animals change with height - much like traveling from the equator toward the poles. Forests near the base give way to stunted, twisted trees higher up.",
  "Above the tree line lies the alpine zone, too cold and windy for trees, where tough low plants hug the ground and animals like pikas and bighorn sheep are built for the cold. Mountains also catch rain and snow, feeding the rivers that supply water to lowlands far away."],
 "Mountain snowpack supplies water to millions of people, so a warming climate that melts it early is a serious concern.",
 [("Tree line","The height on a mountain above which trees cannot grow."),
  ("Alpine zone","The cold, treeless habitat high on a mountain above the tree line.")],
 "Climb a single mountain and you pass through the world's climate zones in an afternoon.",
 [MC("What is the tree line?",["A row of planted trees","The height above which trees cannot grow","The bottom of a mountain","A trail through the forest"],1,"The tree line is the elevation above which it is too cold for trees to grow."),
  TF("Climbing a mountain changes habitats much like traveling toward the poles.",True,"True - rising elevation brings colder zones, similar to moving toward the poles.")])

mk("river-stream","Rivers and streams","habitats","Core",["usgs","epa"],4,
 ["Rivers and streams are ribbons of moving freshwater that carry rain and snowmelt from the highlands back to the sea. They are alive with fish, insects, amphibians and birds, and they carve and shape the land as they flow. The green strip of life along their banks is called the riparian zone.",
  "Clean, flowing water is delicate. Many stream animals, like trout and certain insects, can survive only in cold, clear, well-oxygenated water, which makes them living indicators of a healthy stream. Dams, pollution and removing streamside trees can quickly upset this balance."],
 "Rivers connect whole landscapes, so a problem far upstream can harm wildlife and people for many miles downstream.",
 [("River","A large natural stream of flowing freshwater."),
  ("Riparian zone","The strip of plant life along the banks of a river or stream."),
  ("Indicator species","A species whose presence reveals the health of its environment.")],
 "A trout in the stream is a living water-quality test, swimming only where the water is clean.",
 [MC("What is the riparian zone?",["The deepest part of the ocean","The strip of life along a river's banks","The top of a mountain","A dry desert"],1,"The riparian zone is the band of plant life along a river or stream."),
  TF("Some stream animals can only survive in cold, clean, oxygen-rich water.",True,"True - such species act as indicators of a healthy stream.")])

# ================= CONSERVATION =================
mk("why-conserve","Why conservation matters","conservation","Core",["usfws","nps"],4,
 ["Why should we protect wild plants, animals and places? One reason is that nature gives us things we cannot live without: clean air and water, fertile soil, pollination of crops, and medicines first found in wild species. These free gifts are sometimes called ecosystem services.",
  "There are other reasons too. Every species is the unique result of millions of years of life, impossible to replace once gone. Wild places give people beauty, wonder, recreation and a sense of connection. Many people also believe we simply have a duty to care for the living world we share."],
 "Conservation protects both the practical benefits nature gives us and the irreplaceable richness of life itself.",
 [("Ecosystem services","The benefits nature provides people, like clean water, pollination and fertile soil."),
  ("Extinction","The complete and permanent loss of a species.")],
 "Nature quietly hands us clean water, food and medicine - and asks only that we not break it.",
 [MC("What are ecosystem services?",["Fees charged to enter parks","The free benefits nature provides people, like clean water","Jobs in zoos","Rules about hunting"],1,"Ecosystem services are the benefits nature provides, such as clean water and pollination."),
  TF("An extinct species can be brought back easily if we change our minds.",False,"False - extinction is permanent; a lost species cannot be restored.")])

mk("habitat-loss","Habitat loss and fragmentation","conservation","Core",["usfws","iucn"],4,
 ["The single biggest threat to wildlife worldwide is habitat loss - the destruction of the wild places animals and plants need to live. When forests are cleared, wetlands drained or grasslands plowed, the species that lived there lose their homes and food.",
  "Even when some habitat remains, splitting it into small, separated pieces - called fragmentation - causes problems. Roads and fields cut wildlife off from mates and food, and small isolated populations are more likely to die out. Connecting protected areas with wildlife corridors helps animals move safely between them."],
 "Because habitat loss drives most extinctions, protecting and reconnecting large wild areas is conservation's most powerful tool.",
 [("Habitat loss","The destruction of the natural places where wildlife lives."),
  ("Fragmentation","The breaking of habitat into smaller, separated pieces."),
  ("Wildlife corridor","A protected strip of habitat that lets animals move between larger areas.")],
 "A forest cut into scattered scraps can no longer hold the life a whole forest did.",
 [MC("What is the biggest threat to wildlife worldwide?",["Habitat loss","Too much rain","Bird songs","Tree growth"],0,"Habitat loss is the leading threat to wildlife around the world."),
  TF("Wildlife corridors help animals move safely between separated habitats.",True,"True - corridors reconnect fragmented habitat for wildlife.")])

mk("invasive-species","Invasive species","conservation","Core",["usfws","nps"],4,
 ["An invasive species is a living thing carried by people into a new region where it does not belong and then spreads out of control. Free from the predators and diseases that kept it in check back home, it can multiply quickly and overwhelm native species.",
  "Invasives can crowd out native plants, eat native animals, or bring new diseases. Examples in North America include kudzu vine smothering forests, zebra mussels clogging waterways, and the emerald ash borer killing millions of ash trees. Preventing their spread, and removing them early, is far easier than fighting them once established."],
 "Invasive species are a top cause of extinctions, so stopping their spread is a constant and costly conservation battle.",
 [("Invasive species","A non-native species that spreads aggressively and harms its new ecosystem."),
  ("Native species","A species that naturally belongs in a region.")],
 "A single hitchhiking species can unravel a web of life that took ages to weave.",
 [MC("Why can invasive species spread so quickly in a new place?",["They are always bigger","They lack the predators and diseases that controlled them at home","They need no food","Native animals protect them"],1,"Without their natural enemies, invasives can multiply unchecked."),
  TF("It is usually easier to prevent an invasive species than to remove an established one.",True,"True - early prevention is far cheaper and easier than later control.")])

mk("endangered-species","Endangered species and the ESA","conservation","Core",["usfws","iucn"],4,
 ["A species is endangered when so few remain that it is at risk of disappearing forever. Scientists track these species on lists like the IUCN Red List, ranking them from least concern up to critically endangered and, sadly, extinct.",
  "In the United States, the Endangered Species Act is a powerful law that protects listed species and their habitats and guides efforts to help them recover. It has brought animals like the bald eagle, the American alligator and the gray wolf back from the brink, showing that with effort, some losses can be reversed."],
 "Laws and recovery programs prove that determined conservation can pull species back from the edge of extinction.",
 [("Endangered species","A species at serious risk of dying out completely."),
  ("Endangered Species Act","A U.S. law that protects threatened and endangered species and their habitats."),
  ("Recovery","The process of helping an endangered species' numbers grow back to safety.")],
 "The bald eagle once nearly vanished from the skies - then people brought it back.",
 [MC("What does the Endangered Species Act do?",["Allows hunting of any animal","Protects listed species and their habitats","Removes all national parks","Bans all fishing forever"],1,"The Endangered Species Act protects listed species and the habitats they need."),
  TF("The bald eagle is an example of a species that recovered from the brink.",True,"True - protection helped the bald eagle and others rebound.")])

mk("fire-ecology","Fire ecology","conservation","Core",["usfs","nps"],4,
 ["Fire is not always the enemy of nature. Many ecosystems, from prairies to pine forests, actually depend on regular, smaller fires. These natural burns clear away dead brush, return nutrients to the soil, and make room for new growth. Some pine cones only open and release their seeds in a fire's heat.",
  "Trouble comes when people put out every small fire for many years. Dead wood and brush pile up, so when a fire finally starts it can explode into a huge, destructive blaze. Today, foresters often use careful, planned 'prescribed' burns to clear that fuel safely and keep fire-adapted lands healthy."],
 "Understanding good fire versus dangerous fire helps conservationists manage land in ways that prevent catastrophic wildfires.",
 [("Fire ecology","The study of how fire shapes and renews ecosystems."),
  ("Prescribed burn","A carefully planned, controlled fire used to keep land healthy."),
  ("Fuel","Dead wood, brush and dry plants that a fire can burn.")],
 "Stop every small fire for decades and you are just stacking the wood for one giant blaze.",
 [MC("Why can putting out every small fire be harmful over time?",["It cools the planet too much","Dead brush piles up and can fuel a huge fire later","It scares away all birds","It uses up all the water"],1,"Suppressing every fire lets fuel build up, raising the risk of a massive blaze."),
  TF("Some pine cones only open to release seeds in the heat of a fire.",True,"True - certain pines are fire-adapted and need fire's heat to seed.")])

mk("restoration","Habitat restoration","conservation","Core",["nps","nrcs"],4,
 ["Conservation is not only about protecting what remains - it is also about repairing what has been damaged. Habitat restoration means helping a harmed ecosystem recover, whether that is replanting a cleared forest, reflooding a drained wetland, or returning a straightened stream to its natural curves.",
  "Restoration often means removing invasive species, bringing back native plants, and sometimes reintroducing animals that had vanished. It takes patience, because a forest or wetland may need many years to mature. But it shows that with care, badly hurt land can become wild and full of life again."],
 "Restoration gives damaged land a second chance, proving that some environmental harm can be undone with effort and time.",
 [("Restoration","Helping a damaged ecosystem recover toward its natural, healthy state."),
  ("Reintroduction","Returning a species to an area where it once lived but had disappeared.")],
 "With patience and care, even a paved-over wetland can be coaxed back to life.",
 [MC("What is habitat restoration?",["Building cities on wild land","Helping a damaged ecosystem recover","Removing all plants from an area","Catching wild animals for zoos"],1,"Restoration helps a damaged ecosystem return to a healthy, natural state."),
  TF("Restoration can include reintroducing animals that had vanished from an area.",True,"True - bringing back lost species is part of many restoration efforts.")])

mk("stewardship","Everyday stewardship","conservation","Foundations",["nps","nwf"],4,
 ["You do not need to be a scientist to help nature. Stewardship means caring for the natural world through everyday choices and actions. Planting native flowers for pollinators, picking up litter, saving water, and keeping pets from disturbing wildlife all add up.",
  "When you visit wild places, the idea of Leave No Trace helps: stay on trails, pack out your trash, leave plants, rocks and animals where they are, and keep a respectful distance from wildlife. Small, repeated actions by millions of people make a real difference for the land and its creatures."],
 "Conservation is everyone's job, and simple daily habits are a powerful way for anyone to protect nature.",
 [("Stewardship","Caring responsibly for the natural world through everyday actions."),
  ("Leave No Trace","A set of habits for enjoying nature without harming it.")],
 "Saving the wild is not one giant act - it is a million small ones, including yours.",
 [MC("Which is an example of Leave No Trace?",["Picking wildflowers to take home","Staying on trails and packing out your trash","Feeding wild bears","Carving your name in a tree"],1,"Leave No Trace means staying on trails and carrying out everything you bring in."),
  TF("Everyday choices by ordinary people can make a real difference for nature.",True,"True - small, repeated actions add up to a big impact.")])

# ================= METHODS =================
mk("naturalist-skills","Becoming a naturalist","methods","Foundations",["nps","si"],4,
 ["A naturalist is someone who studies nature by carefully observing it. The most important tool is not expensive gear - it is patient, curious attention. Naturalists slow down, watch closely, listen, and notice small details others walk right past.",
  "Keeping a nature journal sharpens these skills. By sketching what you see, jotting the date, weather and location, and writing down questions, you train yourself to look harder and you build a record over time. Asking 'what is that?' and 'why is it doing that?' is the start of real science."],
 "Careful observation is the foundation of all field science, and anyone willing to look closely can begin contributing.",
 [("Naturalist","A person who studies and observes nature in the field."),
  ("Nature journal","A notebook for recording observations, sketches and questions about nature.")],
 "The naturalist's secret weapon is simply paying closer attention than everyone else.",
 [MC("What is a naturalist's most important tool?",["An expensive camera","Patient, careful observation","A fast car","A large budget"],1,"Careful, patient observation is the heart of being a naturalist."),
  TF("Keeping a nature journal can sharpen your observation skills.",True,"True - journaling trains you to look closely and records what you find.")])

mk("field-tools","Field tools and technology","methods","Foundations",["usgs","cornell"],4,
 ["Naturalists use simple tools to see and record nature better. Binoculars bring distant birds and animals close. A hand lens reveals the tiny details of a flower or insect. Field guides - books or apps - help you name what you find by comparing pictures and descriptions.",
  "Technology has opened new doors. Motion-triggered trail cameras photograph shy animals at night, GPS tracks exactly where observations were made, and phone apps can suggest an identification from a photo or even a bird's song. These tools let a single naturalist gather far more, and more accurate, information."],
 "Modern tools let conservationists study wildlife more thoroughly and share their findings with scientists everywhere.",
 [("Field guide","A book or app that helps identify plants, animals or other natural things."),
  ("Trail camera","A motion-triggered camera that photographs animals, often shy or nocturnal ones.")],
 "With a trail camera, the forest takes its own photographs while you sleep.",
 [MC("What does a trail camera do?",["Measures temperature","Photographs animals when motion triggers it","Identifies rocks","Cleans rivers"],1,"A trail camera takes photos automatically when an animal's motion triggers it."),
  TF("Some phone apps can help identify a bird from its song.",True,"True - sound-recognition apps can suggest species from recorded bird songs.")])

mk("surveys-monitoring","Surveys and monitoring","methods","Foundations",["usgs","usfws"],4,
 ["To protect nature, scientists first need to know what is there and how it is changing. They run surveys - careful counts of plants or animals in an area. One common method is a transect, a set line that a scientist walks while recording everything seen along it.",
  "Repeating surveys over years is called monitoring, and it reveals trends: Is a frog population shrinking? Are birds arriving earlier in spring? Because counting every individual is impossible, scientists sample - measuring a representative part - and use those numbers to estimate the whole. Careful, repeatable methods make the results trustworthy."],
 "Long-term monitoring is how conservationists catch problems early and measure whether their efforts are working.",
 [("Survey","A careful count or measurement of plants or animals in an area."),
  ("Transect","A set line along which a scientist records everything observed."),
  ("Monitoring","Repeating surveys over time to track how nature is changing.")],
 "You cannot tell if nature is winning or losing until you start keeping score.",
 [MC("What is monitoring?",["Counting once and never again","Repeating surveys over time to track change","Removing animals from an area","Guessing how many animals there are"],1,"Monitoring means repeating surveys over time to detect trends."),
  TF("Scientists often sample part of an area to estimate the whole.",True,"True - sampling a representative part lets scientists estimate totals.")])

mk("conservation-history","A short history of conservation","methods","Foundations",["nps","usfws"],5,
 ["The conservation movement grew as people saw wild places and animals vanishing. In the 1800s, writer John Muir urged protection of wild lands and helped inspire the national parks. President Theodore Roosevelt then protected vast areas as parks, forests and refuges in the early 1900s.",
  "Later thinkers deepened the idea. Aldo Leopold argued that people should treat the land as a community they belong to, not just property to use. In 1962, Rachel Carson's book Silent Spring revealed the harm of careless pesticide use and helped spark the modern environmental movement and major new laws."],
 "Knowing this history shows that today's protected lands and laws were won by people who chose to act.",
 [("National park","A large area of wild land protected by the government for nature and people."),
  ("Conservation movement","The long effort by many people to protect nature and use it wisely.")],
 "The parks we enjoy today exist because people long ago refused to let them disappear.",
 [MC("Whose 1962 book helped spark the modern environmental movement?",["John Muir","Rachel Carson","Theodore Roosevelt","Aldo Leopold"],1,"Rachel Carson's Silent Spring (1962) helped launch the modern environmental movement."),
  TF("Theodore Roosevelt protected large areas of land as parks, forests and refuges.",True,"True - Roosevelt set aside vast lands for protection in the early 1900s.")])

mk("careers-conservation","Careers in conservation","methods","Foundations",["usfws","nps"],4,
 ["Loving nature can become a career. Wildlife biologists study animals and how to protect them. Park rangers care for public lands and teach visitors. Foresters manage forests, and ecologists study how living things interact. Conservation also needs people in law, education, mapping, engineering and communication.",
  "Most of these paths start with curiosity and grow through study and hands-on experience. Volunteering for local nature groups, joining citizen-science projects, and spending time outdoors all build the skills and knowledge that conservation careers are built on. There are many ways to make protecting nature your life's work."],
 "Conservation needs many kinds of talent, so almost any interest can connect to protecting the natural world.",
 [("Wildlife biologist","A scientist who studies animals and how to protect them."),
  ("Park ranger","A person who protects public lands and helps visitors enjoy them safely."),
  ("Citizen science","Scientific work that ordinary volunteers help carry out.")],
 "Whatever you love - animals, maps, writing, building - there is a way to use it to protect nature.",
 [MC("Which of these is a conservation career?",["Wildlife biologist","Park ranger","Forester","All of these"],3,"Wildlife biologists, park rangers and foresters are all conservation careers."),
  TF("Volunteering and citizen science can help build skills for a conservation career.",True,"True - hands-on experience and citizen science are great first steps.")])

# ================= ADDED CONCEPT LESSONS (expansion to 501 total) =================

# ----- FOUNDATIONS -----
mk("nutrient-cycles","Nutrient cycles: carbon and nitrogen","foundations","Core",["nasa","nps"],4,
 ["Living things are built from a handful of chemical elements, and nature uses the same atoms over and over. Carbon moves from the air into plants during photosynthesis, into animals that eat the plants, and back into the air when things breathe, rot or burn. This endless loop is called the carbon cycle.",
  "Nitrogen works the same way. The air is nearly four-fifths nitrogen gas, but most living things cannot use it straight from the air. Special bacteria in soil and roots change it into a form plants can absorb, and decomposers later release it again. Because the supply of each element is limited, recycling keeps life going."],
 "When we burn forests or fossil fuels, we speed up the carbon cycle and add extra carbon to the air, which is the main cause of climate change.",
 [("Carbon cycle","The movement of carbon between air, living things, soil and rock."),
  ("Nitrogen-fixing bacteria","Tiny soil microbes that change air nitrogen into a form plants can use."),
  ("Decomposer","A living thing that breaks down dead matter and frees its nutrients.")],
 "Some of the carbon atoms in your body were once part of a dinosaur, a tree, and the air itself.",
 [MC("During photosynthesis, plants take carbon out of:",["The soil only","The air","Rocks","Rainwater"],1,"Plants pull carbon dioxide out of the air to build their tissues."),
  TF("Most living things can use nitrogen gas straight from the air.",False,"False - special bacteria must first change nitrogen into a usable form.")])

mk("sun-and-seasons","The Sun, day length and the seasons","foundations","Foundations",["nasa","noaa"],3,
 ["Almost all the energy in nature comes from the Sun. Sunlight powers plants, warms the air and water, and drives the weather. Earth is tilted on its axis, so as it circles the Sun, different parts lean toward or away from it. That tilt, not our distance from the Sun, is what makes the seasons.",
  "When your half of Earth tilts toward the Sun, days grow long and warm and it is summer. When it tilts away, days shorten and cool into winter. Plants and animals read these changes closely - leaves drop, animals migrate or hibernate, and flowers bloom - all timed to the rhythm of light and warmth."],
 "Knowing the seasons helps conservationists predict when animals breed, when plants flower, and when habitats are most fragile.",
 [("Axis","The imaginary line through Earth's poles that it spins around."),
  ("Season","One of the yearly periods - spring, summer, fall, winter - set by Earth's tilt.")],
 "Summer and winter happen at the same time on opposite halves of the planet.",
 [MC("What is the main cause of Earth's seasons?",["How close Earth is to the Sun","The tilt of Earth's axis","The number of clouds","The phase of the Moon"],1,"The tilt of Earth's axis, not its distance from the Sun, causes the seasons."),
  TF("Plants and animals time many activities to changes in day length.",True,"True - shifting light and warmth trigger blooming, migration and more.")],
 "Many people think summer happens because Earth is closer to the Sun, but the real reason is the planet's tilt.")

mk("scale-of-nature","The scale of nature: microbes to biomes","foundations","Foundations",["si","nps"],3,
 ["Nature can be studied at many sizes. The smallest level is a single cell or tiny microbe. Step up and you reach one organism. Then comes a population of the same kind, then a community of different species living together, then a whole ecosystem of life plus its non-living surroundings.",
  "Zoom out further and ecosystems join into giant biomes like deserts or forests, and all of them together make up the biosphere - the thin layer of Earth where life exists. Scientists pick the level that fits their question, from a drop of pond water to the whole planet."],
 "Conservation problems also live at different scales, so knowing which level you are working on helps you choose the right solution.",
 [("Population","All the members of one species living in the same area."),
  ("Community","All the different species living and interacting in one area."),
  ("Biosphere","The thin zone of Earth, from deep soil to high air, where life exists.")],
 "Life ranges from a microbe too small to see to a biosphere wrapped around the entire Earth.",
 [MC("Which list goes from smallest to largest?",["Biome, ecosystem, organism","Organism, population, community","Community, population, organism","Biosphere, biome, cell"],1,"One organism, then a population, then a community is the correct small-to-large order."),
  TF("The biosphere includes every place on Earth where life is found.",True,"True - the biosphere is the whole life-containing layer of the planet.")])

# ----- ECOLOGY -----
mk("symbiosis","Symbiosis: living together","ecology","Core",["si","nps"],4,
 ["Many species live in close partnerships called symbiosis. Some help each other: a bee gets nectar while it carries pollen between flowers, and both win. This win-win kind is called mutualism. Lichens are another example - a fungus and an alga living as one.",
  "Not every partnership is equal. In commensalism, one species benefits while the other is unbothered, like a bird nesting in a tree. In parasitism, one species gains at the other's expense, like a tick feeding on a deer. Spotting these relationships reveals how tightly the web of life is woven."],
 "Protecting one species often means protecting its partners too, since pulling one thread can unravel several lives.",
 [("Mutualism","A partnership in which both species benefit."),
  ("Commensalism","A relationship in which one species benefits and the other is unaffected."),
  ("Parasitism","A relationship in which one species benefits while harming the other.")],
 "A lichen on a rock is really two creatures - a fungus and an alga - living as one.",
 [MC("A bee and a flower helping each other is an example of:",["Parasitism","Mutualism","Commensalism","Competition"],1,"Both the bee and the flower benefit, which is mutualism."),
  TF("In parasitism, both species benefit equally.",False,"False - a parasite benefits while harming its host.")])

mk("predator-prey","Predator and prey cycles","ecology","Core",["nps","usfws"],4,
 ["A predator is an animal that hunts and eats other animals, called its prey. Hawks and mice, foxes and rabbits, wolves and deer - these pairs are locked together. The hunters help keep prey numbers from exploding, and the prey, in turn, feed the hunters.",
  "Their numbers rise and fall in linked waves. When prey are plentiful, predators have lots of food and their numbers climb. More predators then eat more prey, so prey numbers drop, and soon there is too little food, so predator numbers fall too. Then prey recover and the cycle begins again."],
 "Removing top predators can let prey overpopulate and damage the land, which is why predators are an important part of a healthy ecosystem.",
 [("Predator","An animal that hunts and eats other animals."),
  ("Prey","An animal that is hunted and eaten by a predator."),
  ("Population cycle","The repeating rise and fall in the number of a species over time.")],
 "When the rabbits boom, the foxes follow - and then the rabbits crash and pull the foxes down with them.",
 [MC("What often happens after a prey population grows very large?",["Predators die out forever","Predator numbers rise because there is more food","Prey never decrease","Plants disappear"],1,"More prey means more food, so predator numbers tend to rise."),
  TF("Top predators help keep prey populations in balance.",True,"True - predators prevent prey from overpopulating and harming the land.")])

mk("decomposition","Decomposers: nature's cleanup crew","ecology","Core",["usfs","si"],4,
 ["When a leaf falls or an animal dies, it does not pile up forever. Decomposers - fungi, bacteria and small creatures like worms and beetles - break dead matter down into simpler pieces. This returns nutrients to the soil, where plants can take them up and grow again.",
  "Without decomposers, dead material would bury the world and nutrients would stay locked away. They are the quiet recyclers that close nature's loops. A rotting log, for instance, is not waste at all - it is a feast that slowly becomes rich soil and new life."],
 "Healthy soil and clean ecosystems depend on decomposers, so protecting the small, unseen life in the soil matters as much as protecting big animals.",
 [("Decomposer","An organism that breaks down dead plants and animals."),
  ("Nutrients","The chemical building blocks living things need to grow."),
  ("Detritivore","An animal, like a worm or beetle, that eats dead matter and breaks it up.")],
 "A fallen log is not the end of a tree - it is a slow-motion feast that becomes new soil.",
 [MC("What is the main job of decomposers?",["To hunt live prey","To break down dead matter and recycle nutrients","To make their own food from sunlight","To pollinate flowers"],1,"Decomposers break down dead matter and return nutrients to the soil."),
  TF("Without decomposers, nutrients would stay locked in dead material.",True,"True - decomposers free those nutrients for living things to reuse.")])

mk("pollination","Pollination partnerships","ecology","Core",["usda","nwf"],4,
 ["Most flowering plants cannot move to find a mate, so they rely on pollinators to carry pollen from flower to flower. Bees, butterflies, moths, beetles, birds and bats all do this work, usually while visiting flowers for nectar. When pollen reaches the right flower, seeds and fruit can form.",
  "Plants and pollinators have shaped each other over millions of years. Bright colors, sweet scents and tube-shaped blooms are all advertisements aimed at pollinators. In return, pollinators get food. Roughly three-quarters of the world's food crops depend at least partly on this partnership."],
 "Pollinators are declining from habitat loss and pesticides, so planting native flowers and avoiding sprays helps protect both wildlife and our food.",
 [("Pollinator","An animal that moves pollen between flowers so plants can make seeds."),
  ("Pollen","The fine powder a flower makes that must reach another flower to form seeds."),
  ("Nectar","The sugary liquid flowers offer to attract pollinators.")],
 "About three of every four food crops we grow depend on animal pollinators.",
 [MC("Why do many flowers have bright colors and sweet scents?",["To scare away animals","To attract pollinators","To make shade","To store water"],1,"Color and scent advertise to pollinators that food is available."),
  TF("Many of the foods we eat depend on pollinators.",True,"True - roughly 75% of food crops rely at least partly on pollinators.")])

# ----- FLORA -----
mk("seed-dispersal","How seeds travel","flora","Core",["usfs","usda"],4,
 ["A seed that sprouts right under its parent must fight for the same light and water, so plants have clever ways to send seeds away. Some grow wings or fluffy parachutes that ride the wind, like maple keys and dandelions. Others make tasty fruit so animals eat them and drop the seeds far off in their droppings.",
  "Still others hitch a ride by sticking to fur with tiny hooks, or float downriver, or even burst from pods that fling seeds into the air. Each method helps a plant spread into new ground, escape crowding, and colonize fresh habitat."],
 "Because many plants depend on animals to move their seeds, losing wildlife can quietly stop forests and meadows from spreading and recovering.",
 [("Seed dispersal","The ways seeds are carried away from the parent plant."),
  ("Fruit","The part of a plant that holds seeds, often eaten by animals."),
  ("Burr","A seed covered in tiny hooks that cling to fur or clothing.")],
 "The burrs that stick to your socks are seeds using you to travel to new ground.",
 [MC("How does a dandelion seed usually travel?",["By floating on its fluffy parachute in the wind","By being buried by its parent","By rolling downhill only","It does not travel"],0,"A dandelion seed has a fluffy tuft that carries it on the wind."),
  TF("Some plants rely on animals eating their fruit to spread their seeds.",True,"True - animals carry the seeds and drop them far away.")])

mk("leaf-id","Reading leaves: how to know a tree","flora","Core",["usfs","usda"],4,
 ["Leaves are a tree's name tag. First check the shape: is it a single broad blade (simple) or split into many leaflets (compound)? Then look at the edges - smooth, toothed or deeply lobed like an oak. Finally, see how leaves are arranged on the twig: in pairs across from each other, or one at a time along it.",
  "Needles and scales mark the conifers. Pines bundle their needles in little groups, spruces and firs attach them singly, and cedars wear flat scaly sprays. With just these few clues - shape, edge, arrangement and needle style - you can name most trees you meet on a walk."],
 "Identifying trees is the first step in studying a forest, tracking its health, and noticing when something is wrong.",
 [("Simple leaf","A leaf that is a single blade, not divided into leaflets."),
  ("Compound leaf","A leaf divided into several smaller leaflets."),
  ("Lobed","Having rounded or pointed sections, like the edge of an oak leaf.")],
 "Hold up a single leaf and it can tell you the name of the whole tree.",
 [MC("A leaf divided into several leaflets is called:",["A simple leaf","A compound leaf","A needle","A lobe"],1,"A leaf split into leaflets is a compound leaf."),
  TF("How leaves are arranged on a twig can help identify a tree.",True,"True - paired or alternating arrangement is a useful clue.")])

mk("mosses-ferns","Mosses and ferns: the spore plants","flora","Core",["usfs","si"],4,
 ["Long before flowers existed, mosses and ferns covered the land. They do not make seeds or flowers. Instead they reproduce with tiny dust-like spores, and they need a film of water for their life cycle, which is why they thrive in damp, shady places.",
  "Mosses are small, soft cushions with no true roots; they soak up water like a sponge and help hold soil and moisture. Ferns are larger, with feathery fronds that uncurl from coiled tips called fiddleheads. Both are ancient survivors, and the giant ferns of long ago helped form today's coal."],
 "Mosses and ferns guard soil and water in forests, and their presence often signals clean air and a healthy, moist habitat.",
 [("Spore","A tiny cell that ferns and mosses use to reproduce instead of seeds."),
  ("Frond","The feathery leaf of a fern."),
  ("Fiddlehead","The tightly coiled young frond of a fern before it unrolls.")],
 "The coal that once powered trains began as giant ferns in ancient swamps.",
 [MC("How do mosses and ferns reproduce?",["With flowers","With seeds","With spores","With cones"],2,"Mosses and ferns release spores rather than making seeds or flowers."),
  TF("Mosses and ferns usually grow best in damp, shady places.",True,"True - they need moisture for their life cycle.")])

# ----- FAUNA -----
mk("migration","Migration: great journeys","fauna","Core",["cornell","usfws"],4,
 ["Migration is a regular, back-and-forth journey animals make between two homes, usually to follow food or find a place to breed. Many birds fly south for winter and north for summer. Caribou walk vast distances across the tundra, and even monarch butterflies travel thousands of miles over several generations.",
  "Animals navigate using the Sun, the stars, landmarks and even Earth's magnetic field. These journeys are dangerous and tiring, and they depend on safe stopover sites to rest and refuel. If those stopovers are destroyed, the whole journey can fail."],
 "Migrating animals connect faraway places, so protecting them means protecting a chain of habitats across many regions and even countries.",
 [("Migration","A regular seasonal journey animals make between two areas."),
  ("Stopover site","A resting and feeding place migrating animals depend on along the way."),
  ("Navigation","Finding the way, using cues like the Sun, stars or magnetic field.")],
 "It takes several generations of monarch butterflies to complete one yearly migration loop.",
 [MC("Why do many animals migrate?",["To follow food or find a place to breed","To avoid sleeping","Because they dislike each other","To grow new legs"],0,"Animals usually migrate to follow food or reach breeding grounds."),
  TF("Migrating animals depend on safe stopover sites to rest and refuel.",True,"True - losing stopovers can cause the whole journey to fail.")])

mk("hibernation-dormancy","Surviving winter: hibernation and dormancy","fauna","Core",["nps","nwf"],4,
 ["Winter brings cold and scarce food, so many animals shut down to survive it. In true hibernation, an animal's heartbeat and breathing slow dramatically and its body cools, letting it live for months on stored fat. Ground squirrels and some bats are deep hibernators.",
  "Others enter lighter forms of rest. Bears sleep deeply but can wake, a state often called torpor. Frogs and turtles slow down in the mud, and some can survive partly frozen. Plants go dormant too, dropping leaves and resting until warmth returns. All of these are ways to ride out the hard season."],
 "Hibernating animals are easily disturbed and burn precious energy if woken, so winter is a time to give wildlife extra space.",
 [("Hibernation","A deep winter sleep in which body functions slow to save energy."),
  ("Torpor","A short-term drop in body activity to save energy, lighter than hibernation."),
  ("Dormancy","A resting state, used by plants and animals, that pauses growth until conditions improve.")],
 "A hibernating ground squirrel's heart can slow from hundreds of beats a minute to just a few.",
 [MC("During true hibernation, an animal's body:",["Speeds up","Slows down to save energy","Stays exactly the same","Stops needing fat"],1,"Hibernation slows the body so the animal can live on stored fat."),
  TF("Waking a hibernating animal can waste energy it needs to survive winter.",True,"True - disturbance forces it to burn precious stored fat.")])

mk("camouflage-mimicry","Camouflage and mimicry","fauna","Core",["si","nwf"],4,
 ["To avoid being eaten - or to sneak up on prey - many animals hide in plain sight. Camouflage is coloring or shape that blends into the background, like a brown moth on bark or a fawn's spots in dappled light. Some animals even change color with the seasons, turning white for snow.",
  "Mimicry is a different trick: looking like something else. A harmless milk snake wears the bright bands of a venomous coral snake, so predators leave it alone. Some moths have giant eyespots that startle attackers. Both camouflage and mimicry are clever results of evolution."],
 "These survival tricks show how closely predators and prey shape one another, a balance that conservation tries to keep intact.",
 [("Camouflage","Coloring or shape that helps an animal blend into its surroundings."),
  ("Mimicry","When one animal looks like another, often a dangerous one, for protection."),
  ("Eyespot","A round, eye-like marking that can startle or confuse predators.")],
 "A harmless milk snake survives by copying the warning colors of a venomous one.",
 [MC("An animal blending into its background is using:",["Mimicry","Camouflage","Migration","Hibernation"],1,"Blending into the background is camouflage."),
  TF("A harmless animal that looks like a dangerous one is using mimicry.",True,"True - mimicry borrows another animal's warning to stay safe.")])

mk("metamorphosis","Metamorphosis: changing bodies","fauna","Core",["si","eol"],4,
 ["Some animals are born looking nothing like their parents and completely rebuild their bodies as they grow. This dramatic change is called metamorphosis. A butterfly begins as a crawling caterpillar, seals itself in a chrysalis, and emerges transformed with wings.",
  "Frogs do it too: a fish-like tadpole with gills and a tail slowly grows legs, absorbs its tail, and turns into an air-breathing frog. Many insects change in stages from egg to larva to pupa to adult. Each stage often eats different food and lives in a different place, which reduces competition within the species."],
 "Because young and adult stages may need very different habitats, protecting a species can mean protecting a pond for tadpoles and a meadow for the adults.",
 [("Metamorphosis","A major change in body form as an animal grows up."),
  ("Larva","The young, often worm-like stage of an animal before metamorphosis."),
  ("Pupa","The resting stage, like a chrysalis, where an insect transforms.")],
 "A caterpillar essentially dissolves and rebuilds itself into a butterfly inside its chrysalis.",
 [MC("Which animal goes through metamorphosis?",["A frog","A horse","A sparrow","A bear"],0,"A frog changes from a tadpole into an adult through metamorphosis."),
  TF("Young and adult stages of an animal may live in different habitats.",True,"True - tadpoles need water while adult frogs use land, for example.")])

# ----- GEOLOGY -----
mk("landforms","Landforms: how the land takes shape","geology","Core",["usgs","nps"],4,
 ["The surface of the land is full of shapes called landforms - mountains, valleys, plains, plateaus, canyons and deltas. They are built and worn down by slow, powerful forces. Moving plates and volcanoes push land up, while water, ice and wind grind it down over enormous stretches of time.",
  "A river can carve a deep canyon, a glacier can gouge a wide valley, and piles of sediment can build a flat delta where a river meets the sea. Even the tallest mountains are temporary - given enough time, weather wears them back to plains."],
 "Landforms decide where water flows, where soil collects and what can live where, so reading the land is basic to understanding any habitat.",
 [("Landform","A natural shape of the land surface, such as a hill or valley."),
  ("Plateau","A wide area of high, mostly flat land."),
  ("Delta","Flat land built from sediment where a river meets a lake or sea.")],
 "The Grand Canyon was carved by a river patiently cutting downward for millions of years.",
 [MC("Which force helps wear landforms down?",["Flowing water and ice","Sunlight color","Bird songs","Magnetism"],0,"Water, ice and wind erode and wear landforms down over time."),
  TF("Even tall mountains are slowly worn down over long periods of time.",True,"True - erosion eventually reduces mountains toward plains.")])

mk("caves-karst","Caves and karst","geology","Core",["usgs","nps"],4,
 ["Some of the most amazing places on Earth are hidden underground. Many caves form when slightly acidic rainwater seeps into limestone and slowly dissolves it, hollowing out rooms and tunnels over thousands of years. A landscape full of such caves, sinkholes and underground streams is called karst.",
  "Inside, dripping mineral-rich water builds stone icicles called stalactites that hang from the ceiling and stalagmites that rise from the floor. Caves are fragile homes for special animals like bats and blind cave fish, and they connect directly to the groundwater people drink."],
 "Because water moves quickly through karst, pollution on the surface can reach cave streams and wells fast, so these landscapes need careful protection.",
 [("Cave","A natural hollow space underground, often dissolved out of limestone."),
  ("Karst","A landscape of caves, sinkholes and underground streams in soluble rock."),
  ("Stalactite","A mineral icicle that hangs from a cave ceiling.")],
 "A stalactite holds tight to the ceiling, while a stalagmite might one day reach the roof.",
 [MC("Many caves form when rainwater dissolves:",["Granite","Limestone","Basalt","Sand"],1,"Slightly acidic water dissolves limestone to form many caves."),
  TF("Pollution on the surface can quickly reach water inside karst caves.",True,"True - water moves fast through karst, carrying pollution underground.")])

mk("volcanoes-plates","Volcanoes and moving plates","geology","Core",["usgs","nasa"],4,
 ["Earth's hard outer shell is cracked into giant pieces called tectonic plates that drift slowly on the hot, soft rock below. Where plates pull apart, collide or grind past each other, the ground buckles, mountains rise, and earthquakes and volcanoes are born.",
  "A volcano is an opening where molten rock, called magma underground and lava once it erupts, reaches the surface. Many of the world's volcanoes ring the Pacific Ocean in a zone nicknamed the Ring of Fire. Though dangerous, volcanoes also build new land and create some of the richest soils on Earth."],
 "Volcanoes and plate movement shape continents and hazards alike, helping us understand both the deep past and risks to communities today.",
 [("Tectonic plate","One of the giant moving pieces of Earth's outer shell."),
  ("Magma","Molten rock beneath the surface; it is called lava once it erupts."),
  ("Ring of Fire","The belt of volcanoes and earthquakes around the Pacific Ocean.")],
 "The same volcanoes that can be dangerous also build new islands and rich farmland.",
 [MC("Most of Earth's earthquakes and volcanoes happen:",["In the middle of plates","Where tectonic plates meet","Only at the poles","Only underwater"],1,"Plate edges, where plates meet, are where most volcanoes and quakes occur."),
  TF("Molten rock is called magma underground and lava after it erupts.",True,"True - the name changes once it reaches the surface.")])

# ----- HABITATS -----
mk("tundra-biome","The tundra: life on the frozen edge","habitats","Core",["nps","nasa"],4,
 ["The tundra is a cold, treeless biome found in the far north and high on mountains. Winters are long, dark and brutally cold, and summers are short and cool. Just below the surface lies permafrost - ground that stays frozen all year - which stops tree roots and traps water near the top.",
  "Life here is tough and low to the ground: mosses, lichens, tiny wildflowers and dwarf shrubs. In the brief summer, the land bursts with insects and migrating birds, and caribou graze across the open plains. Everything is adapted to survive cold and make the most of the short growing season."],
 "Tundra is fragile and slow to heal, and warming temperatures are thawing its permafrost, releasing stored carbon and threatening this rare habitat.",
 [("Tundra","A cold, treeless biome with frozen ground beneath the surface."),
  ("Permafrost","Ground that stays frozen all year round."),
  ("Adaptation","A feature that helps a living thing survive in its habitat.")],
 "No trees can grow on the tundra because the frozen ground blocks their roots.",
 [MC("Why are there no trees on the tundra?",["Too much rain","Frozen ground (permafrost) blocks deep roots","Too many animals","Too much sunlight"],1,"Permafrost keeps roots from growing deep, so trees cannot survive."),
  TF("Thawing permafrost can release carbon that was stored in the frozen ground.",True,"True - warming tundra frees stored carbon, worsening climate change.")])

mk("coastal-estuary","Coasts and estuaries","habitats","Core",["noaa","nps"],4,
 ["Where land meets the sea, life is rich and busy. Along sandy and rocky coasts, tides rise and fall twice a day, and creatures like crabs, shorebirds and shellfish are built to handle both water and air. Dunes and beach plants hold the shifting sand in place against wind and waves.",
  "An estuary is a special coastal place where a river's fresh water mixes with the ocean's salt water. These calm, sheltered waters are packed with food and serve as nurseries where countless young fish and shellfish grow before heading out to sea. Salt marshes and mangroves often line them."],
 "Coasts and estuaries shield the land from storms and feed huge numbers of animals, yet they are heavily developed, making their protection urgent.",
 [("Coast","The place where land meets the sea."),
  ("Estuary","A coastal area where river fresh water mixes with ocean salt water."),
  ("Nursery habitat","A sheltered place where young animals grow safely.")],
 "Many ocean fish begin life in the calm, food-rich waters of an estuary.",
 [MC("An estuary is a place where:",["Two rivers meet","Fresh river water mixes with ocean salt water","A desert meets a mountain","Ice covers the sea"],1,"An estuary is where a river's fresh water mixes with ocean salt water."),
  TF("Estuaries act as nurseries for many young fish and shellfish.",True,"True - their sheltered, food-rich waters protect growing young.")])

mk("pond-vs-lake","Ponds and lakes","habitats","Core",["epa","usgs"],4,
 ["Ponds and lakes are bodies of still fresh water, but they differ in size and depth. A pond is small and shallow enough that sunlight reaches the bottom almost everywhere, so plants can grow across it and the water stays a similar temperature top to bottom.",
  "A lake is larger and deeper. Sunlight cannot reach the dark, cold bottom, so in summer the water settles into layers - warm on top, cold below. Both teem with life: algae and plants feed insects and tadpoles, which feed fish, which feed birds and other hunters, all linked in a watery food web."],
 "Still freshwaters supply drinking water and habitat, but they are easily harmed by pollution and runoff, so what happens on nearby land matters greatly.",
 [("Pond","A small, shallow body of still fresh water sunlight can reach throughout."),
  ("Lake","A larger, deeper body of still fresh water with dark, cold lower depths."),
  ("Algae","Simple water plants that form the base of many freshwater food webs.")],
 "In a pond, sunlight reaches the bottom; in a deep lake, the bottom stays dark and cold.",
 [MC("One main difference between a pond and a lake is:",["A pond is salty","A lake is deeper and sunlight cannot reach its bottom","A pond has no life","A lake never has fish"],1,"Lakes are deeper, so sunlight does not reach the cold bottom."),
  TF("Runoff and pollution from nearby land can harm ponds and lakes.",True,"True - still waters are easily affected by what happens on land around them.")])

# ----- CONSERVATION -----
mk("climate-change","Climate change and wildlife","conservation","Core",["nasa","noaa"],5,
 ["Climate is the usual pattern of temperature and rainfall in a place over many years. Burning fossil fuels like coal, oil and gas adds extra carbon dioxide to the air, which traps heat and slowly warms the planet. This warming is what people mean by climate change.",
  "The effects ripple through nature. Springs arrive earlier, throwing off the timing between flowers and pollinators. Habitats shift toward cooler areas, ice and snow shrink, seas rise, and extreme weather grows more common. Plants and animals must move, adapt or face decline - and many cannot keep up."],
 "Slowing climate change by using cleaner energy, and protecting forests and wetlands that store carbon, are among the biggest tasks in conservation today.",
 [("Climate change","A long-term shift in temperature and weather patterns, largely from human activity."),
  ("Fossil fuel","Coal, oil or gas formed from ancient life and burned for energy."),
  ("Greenhouse gas","A gas like carbon dioxide that traps heat in the atmosphere.")],
 "The carbon released by burning ancient forests as coal is warming the world today.",
 [MC("What human activity is the main driver of climate change?",["Planting trees","Burning fossil fuels","Watching birds","Recycling paper"],1,"Burning fossil fuels releases heat-trapping carbon dioxide."),
  TF("Climate change can throw off the timing between flowers and their pollinators.",True,"True - earlier springs can split apart partners that once matched.")],
 "Weather is what happens day to day, while climate is the long-term pattern, so a cold day does not cancel out a warming climate.")

mk("pollution-land-water","Pollution on land and in water","conservation","Core",["epa","noaa"],4,
 ["Pollution is harmful material that people release into the environment. It comes in many forms: chemicals and fertilizer washing off fields, plastic trash, oil spills, dirty air from smoke, and even too much light or noise. Once loose, pollution spreads through soil, water and air.",
  "Water pollution is especially harmful because everything is connected by the water cycle and watersheds. Fertilizer runoff can trigger huge algae blooms that rob water of oxygen and kill fish. Plastic breaks into tiny pieces that animals mistake for food. The cleanest fix is to stop pollution at its source."],
 "Preventing pollution protects wildlife, drinking water and human health all at once, and small everyday choices add up across millions of people.",
 [("Pollution","Harmful material released into the air, water or land."),
  ("Runoff","Water that flows over land, often carrying pollution into streams."),
  ("Algae bloom","A rapid overgrowth of algae, often fed by pollution, that harms water life.")],
 "A plastic bottle dropped on a street can ride the storm drains all the way to the sea.",
 [MC("Why is water pollution so far-reaching?",["Water never moves","Watersheds and the water cycle connect everything","Water cannot carry chemicals","Fish clean all water"],1,"Because water flows and connects places, pollution travels widely."),
  TF("Stopping pollution at its source is usually the cleanest solution.",True,"True - preventing pollution beats trying to clean it up later.")])

mk("protected-areas","Parks, refuges and protected areas","conservation","Core",["nps","usfws"],4,
 ["One of the most powerful tools in conservation is simply setting land and water aside to keep it wild. National parks protect scenery and nature for everyone to enjoy. Wildlife refuges focus on safe homes for animals. Wilderness areas, preserves and marine protected areas each guard nature in their own way.",
  "Protected areas give species room to live, breed and migrate, and they shield clean water and important habitats from development. The best of them are large and connected by corridors, so animals can move between them. Many also welcome visitors to learn, explore and fall in love with the outdoors."],
 "Protected areas are a promise across generations, but they need funding, care and respectful visitors to keep doing their job.",
 [("National park","Wild public land protected by government for nature and people."),
  ("Wildlife refuge","Protected land managed mainly as a safe home for animals."),
  ("Wildlife corridor","A protected strip of habitat that links larger natural areas.")],
 "The world's first national park, Yellowstone, was set aside in 1872 and inspired parks everywhere.",
 [MC("What is the main purpose of a wildlife refuge?",["To build houses","To provide a safe home for animals","To mine for metals","To race vehicles"],1,"A wildlife refuge is managed mainly as a safe home for animals."),
  TF("Connecting protected areas with corridors helps animals move between them.",True,"True - corridors let wildlife travel safely between protected lands.")])

# ----- METHODS -----
mk("using-field-guide","Using a field guide and keys","methods","Foundations",["si","nps"],3,
 ["A field guide is a book or app that helps you identify the plants and animals you find. Good observation comes first: note the size, color, shape, sound, location and behavior of what you see. Then match those clues to the pictures and descriptions in the guide.",
  "Many guides include a dichotomous key, a step-by-step set of either-or questions - 'leaves needle-like or broad?', 'flowers yellow or white?' - that narrows the choices until one answer remains. Working carefully through a key turns a confusing tangle of life into a name you can look up and learn about."],
 "Naming what you see is the first step of all field science, letting you record, compare and share what lives in a place.",
 [("Field guide","A book or app used to identify plants and animals."),
  ("Dichotomous key","A tool that identifies a species through a series of either-or choices."),
  ("Observation","Careful watching and noting of details in nature.")],
 "A good key works like a game of twenty questions that ends with a species' name.",
 [MC("A dichotomous key identifies a species by:",["Guessing randomly","A series of either-or questions","Counting how many you see","Its loudness only"],1,"A dichotomous key uses step-by-step either-or choices to reach an answer."),
  TF("Careful observation should come before reaching for a field guide.",True,"True - noting details first makes matching to a guide much easier.")])

mk("citizen-science","Citizen science: everyone can help","methods","Foundations",["cornell","usgs"],3,
 ["Citizen science is real scientific research that ordinary people help carry out. Volunteers around the world count birds, photograph insects, measure rainfall, log the first blooms of spring and report frog calls. Together they gather far more data than scientists ever could alone.",
  "This flood of observations helps researchers track how species and seasons are changing across whole continents. Anyone with curiosity and care can take part, often with just a phone. It is one of the easiest and most powerful ways for a young naturalist to contribute to protecting nature."],
 "Citizen science turns everyday curiosity into useful data, giving everyone a real role in understanding and protecting the natural world.",
 [("Citizen science","Scientific research that volunteers from the public help conduct."),
  ("Data","Recorded facts and measurements that scientists study."),
  ("Naturalist","A person who studies and observes nature in the field.")],
 "A single weekend bird count can add up to millions of observations worldwide.",
 [MC("What is citizen science?",["Science only professionals may do","Research that volunteers help carry out","Reading science fiction","A type of video game"],1,"Citizen science is real research that members of the public help with."),
  TF("Citizen science helps scientists gather more data than they could alone.",True,"True - many volunteers together collect huge amounts of useful data.")])

# ---- write out ----
with open("/home/claude/terra/seahype-lessons.js", "w", encoding="utf-8") as f:
    f.write("window.__SEA_LESSONS__ = Object.assign(window.__SEA_LESSONS__ || {}, " + json.dumps(L, ensure_ascii=False) + ");\n")
# Blank the extra lesson files (all concept lessons now live in seahype-lessons.js)
for extra in ["seahype-lessons-extra.js","seahype-lessons-extra2.js","seahype-lessons-extra3.js","seahype-lessons-extra4.js"]:
    with open("/home/claude/terra/" + extra, "w", encoding="utf-8") as f:
        f.write("/* merged into seahype-lessons.js */\nwindow.__SEA_LESSONS__ = window.__SEA_LESSONS__ || {};\n")
print("TOTAL concept lessons written:", len(L))
