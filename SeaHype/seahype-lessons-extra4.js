/* SeaHype — expansion lessons (batch 4). Appends to window.__SEA_LESSONS__.
   All facts are established marine biology; sources point to authoritative orgs. */
window.__SEA_LESSONS__ = Object.assign(window.__SEA_LESSONS__ || {}, {

  "vents-chemo": {
    title: "Hydrothermal vents: life without sunlight",
    track: "habitats", level: "Advanced", src: "noaaoe", time: 7,
    explain: [
      "In 1977, scientists in the sub Alvin dove on the Galápagos Rift. They found something no one expected: thick clusters of animals living in total darkness around cracks in the seafloor. These are hydrothermal vents. Here, seawater seeps into the crust near volcanoes, gets superheated, and gushes back out full of dissolved minerals. The hottest chimneys, called 'black smokers,' can pour out fluid hotter than 350°C. The crushing pressure of the deep keeps that water from boiling.",
      "Sunlight never reaches these depths, so the food web cannot start with photosynthesis. Instead it starts with chemosynthesis. Microbes take energy from chemicals in the vent fluid, especially hydrogen sulfide, and use it to build sugars. Those microbes feed everything else. Giant tubeworms up to two meters long have no mouth and no gut. They hold billions of helpful bacteria inside a special organ and live entirely on the food those bacteria make.",
      "This discovery overturned a basic idea in biology: that almost all life depends on the sun. Vent communities include tubeworms, vent crabs, pale shrimp, clams, and mussels. They are islands of life that appear, grow, and vanish as vents turn on and off over years to decades. They also make scientists wonder about life on other worlds with hidden oceans, like Jupiter's moon Europa."
    ],
    why: "Vents proved that whole ecosystems can run on chemical energy instead of sunlight, reshaping how we think about the limits of life on Earth and beyond.",
    misconception: "Vent animals are not 'eating' the heat or minerals directly — chemosynthetic bacteria convert vent chemicals into food, and the animals depend on those bacteria.",
    terms: [
      ["Hydrothermal vent", "A seafloor opening where mineral-rich, superheated water erupts near volcanic crust."],
      ["Chemosynthesis", "Building food from chemical energy (e.g., oxidizing hydrogen sulfide) instead of sunlight."],
      ["Black smoker", "A vent chimney whose mineral-laden fluid looks like billowing black smoke."],
      ["Symbiosis", "A close, long-term relationship between species — here, tubeworms housing bacteria that feed them."]
    ],
    hook: "1977, the sub Alvin: tubeworms with no mouths, fed by bacteria living on hydrogen sulfide.",
    sources: [
      { label: "NOAA Ocean Exploration — vents", url: "https://oceanexplorer.noaa.gov/" },
      { label: "WHOI — deep-sea research", url: "https://www.whoi.edu/" }
    ],
    quiz: [
      { type: "mc", q: "The food web at hydrothermal vents is built on:", choices: ["Photosynthesis by deep algae", "Chemosynthesis by bacteria", "Marine snow alone", "Sunlight focused by the water"], answer: 1, why: "Bacteria use chemical energy from vent fluids (like hydrogen sulfide) to make food, since no sunlight reaches the deep." },
      { type: "tf", q: "Giant tubeworms at vents survive thanks to symbiotic bacteria living inside their bodies.", answer: true, why: "The worms have no mouth or gut; internal bacteria convert vent chemicals into food for them." },
      { type: "mc", q: "Why was the 1977 vent discovery so important to biology?", choices: ["It found the deepest point in the ocean", "It showed ecosystems can run without sunlight", "It proved corals are animals", "It discovered the first fish"], answer: 1, why: "It overturned the assumption that nearly all life ultimately depends on the sun." }
    ]
  },

  "whale-fall": {
    title: "Whale falls: an oasis on the seafloor",
    track: "habitats", level: "Advanced", src: "mbari", time: 6,
    explain: [
      "When a great whale dies, it sinks to the deep seafloor. Down there, food is usually scarce, so its huge body becomes a sudden feast. Scientists call this a whale fall. A single body can feed a busy community for years or even decades. It is a rare burst of life on the cold, dark, food-poor abyssal plain.",
      "A whale fall goes through stages. First, mobile scavengers strip the soft flesh within months to a couple of years. These include hagfish, sleeper sharks, and swarms of amphipods. Next, worms and snails move in to feed on the bones and the rich sediment around them. Finally, in a long last stage, bacteria break down the fats locked inside the bones. This makes hydrogen sulfide and supports chemosynthetic life, much like a hydrothermal vent.",
      "Whale falls even have specialists found almost nowhere else. One is the bone-eating Osedax worm, sometimes called the zombie worm. It bores into bone to reach the fats inside. Because they host chemosynthetic communities, whale falls may act as stepping stones. They could help deep-sea species spread between distant vents and seeps across the ocean floor."
    ],
    why: "Whale falls show how a single death can seed a long-lived deep-sea ecosystem, and they link the fates of surface giants to life kilometers below.",
    misconception: "A whale fall is not just a quick meal for scavengers — its bones can fuel chemosynthetic life for decades after the flesh is gone.",
    terms: [
      ["Whale fall", "The carcass of a large whale on the deep seafloor and the community it supports."],
      ["Scavenger", "An animal that feeds on dead organisms, like hagfish at a whale fall."],
      ["Osedax", "Bone-eating 'zombie worms' that mine fat from whale bones."],
      ["Sulfophilic stage", "The long final phase where bacteria break down bone lipids, releasing sulfide."]
    ],
    hook: "A dead whale feeds the deep for decades — ending with 'zombie worms' eating its bones.",
    sources: [
      { label: "MBARI — deep-sea ecology", url: "https://www.mbari.org/" },
      { label: "NOAA Ocean Exploration", url: "https://oceanexplorer.noaa.gov/" }
    ],
    quiz: [
      { type: "mc", q: "A whale fall is important on the deep seafloor mainly because:", choices: ["It warms the surrounding water", "It delivers a huge, rare pulse of food", "It is a source of sunlight", "It produces oxygen"], answer: 1, why: "Food is scarce in the deep, so a whale carcass supports a community for years to decades." },
      { type: "mc", q: "In the final stage of a whale fall, energy comes largely from:", choices: ["Photosynthesis", "Bacteria breaking down fats in the bones", "Leftover muscle tissue", "Geothermal heat"], answer: 1, why: "The sulfophilic stage relies on chemosynthetic bacteria using lipids stored in bone." },
      { type: "tf", q: "Osedax 'zombie worms' specialize in mining fat from whale bones.", answer: true, why: "They bore into bone to reach the lipids inside, a niche found at few other places." }
    ]
  },

  "twilight-zone": {
    title: "The twilight zone and the planet's biggest migration",
    track: "ecology", level: "Core", src: "mbari", time: 6,
    explain: [
      "Between about 200 and 1,000 meters deep lies the twilight zone, also called the mesopelagic zone. Down here, only a dim blue glow reaches, far too little for photosynthesis. It is one of the least explored places on Earth. Even so, it is full of life: lanternfish, bristlemouths, shrimp, jellies, and squid. Many are small, soft, and strange.",
      "Every night, huge numbers of these animals rise hundreds of meters toward the surface. Under cover of darkness, they feed on plankton. Before dawn, they sink back down to hide from predators in the gloom. This daily up-and-down trip is called diel vertical migration. It is the largest animal migration on the planet. It is not the longest trip, but it moves the most living weight, and it happens every single day all over the ocean.",
      "Many twilight-zone animals make their own light, called bioluminescence. It helps them find mates, lure prey, or hide. Some make a faint glow on their undersides that matches the dim light from above. This erases their shadow from predators looking up, a trick called counterillumination. The twilight zone also helps the climate. When animals feed near the surface and then release waste down deep, they carry carbon from the top of the ocean into the deep."
    ],
    why: "The twilight zone may hold more fish biomass than the rest of the ocean combined, drives the daily migration of countless animals, and helps move carbon into the deep.",
    misconception: "Diel vertical migration is the 'largest migration on Earth' by total biomass moved each day, not because any one animal travels a long way.",
    terms: [
      ["Mesopelagic zone", "The 'twilight' layer of the ocean, roughly 200–1,000 m deep."],
      ["Diel vertical migration", "The daily movement of animals up at night to feed and down by day to hide."],
      ["Counterillumination", "Producing faint light to match the glow from above and erase one's silhouette."],
      ["Lanternfish", "Small, abundant mesopelagic fish that bear rows of light-producing organs."]
    ],
    hook: "Every night, the ocean's biggest migration rises in the dark to feed, then sinks by dawn.",
    sources: [
      { label: "MBARI — midwater research", url: "https://www.mbari.org/" },
      { label: "WHOI — the ocean twilight zone", url: "https://www.whoi.edu/" }
    ],
    quiz: [
      { type: "mc", q: "Diel vertical migration is best described as:", choices: ["A once-a-year breeding migration", "A daily up-at-night, down-by-day movement", "Animals swimming toward the poles", "Larvae drifting on currents"], answer: 1, why: "Mesopelagic animals rise to feed at night and descend by day to avoid predators." },
      { type: "mc", q: "Counterillumination helps an animal by:", choices: ["Heating its body", "Matching the light from above to hide its silhouette", "Attracting a mate with bright flashes", "Sensing electric fields"], answer: 1, why: "A faint downward glow blends with dim surface light so predators below cannot see the outline." },
      { type: "fill", q: "The 'twilight' layer of the ocean, about 200–1,000 m deep, is called the ___ zone.", answer: "mesopelagic", why: "Mesopelagic means the middle, dimly lit layer between the sunlit surface and the dark deep." }
    ]
  },

  "keystone-otters": {
    title: "Keystone species: sea otters and kelp",
    track: "ecology", level: "Core", src: "si", time: 6,
    explain: [
      "Some species shape their whole community far more than their numbers alone would suggest. Ecologists call these keystone species. The name comes from the wedge-shaped stone that holds an arch together: take it out, and the arch falls. The classic ocean example is the sea otter of the North Pacific.",
      "Sea otters love to eat sea urchins, and sea urchins love to eat kelp. Where otters are common, they keep urchin numbers down, and tall kelp forests thrive. Those forests feed and shelter fish, invertebrates, and more. Where otters are removed, as happened during the fur trade, urchins multiply and mow down the kelp. This leaves bare 'urchin barrens' with only a fraction of the life. This chain of effects moving down the food web is called a trophic cascade.",
      "Otters themselves are remarkable. They have no blubber to keep them warm, so they rely on the thickest fur of any animal. They also have a very fast metabolism and eat about a quarter of their body weight every day to stay warm. Protecting otters protects kelp forests. Those forests shelter many species and even store carbon. It is a reminder that everything in an ecosystem is connected."
    ],
    why: "Keystone species like sea otters control entire ecosystems, so losing or restoring one species can transform a whole habitat.",
    misconception: "A keystone species is not simply the most common animal — it is one whose presence has an outsized effect relative to its abundance.",
    terms: [
      ["Keystone species", "A species with an outsized effect on its community relative to its numbers."],
      ["Trophic cascade", "A chain of effects passing down a food web when a top consumer is added or removed."],
      ["Urchin barren", "A kelp-stripped seafloor dominated by sea urchins after predators are lost."],
      ["Kelp forest", "A dense stand of large brown algae that shelters diverse coastal life."]
    ],
    hook: "Otters eat urchins, urchins eat kelp — lose the otters and the forest becomes a barren.",
    sources: [
      { label: "Smithsonian Ocean — kelp & otters", url: "https://ocean.si.edu/" },
      { label: "NOAA — kelp forests", url: "https://oceanservice.noaa.gov/facts/" }
    ],
    quiz: [
      { type: "mc", q: "A keystone species is one that:", choices: ["Is always the largest animal", "Has an outsized effect on its community", "Lives only in the deep sea", "Builds reefs"], answer: 1, why: "Its influence on the ecosystem is large relative to its abundance — like the keystone in an arch." },
      { type: "mc", q: "If sea otters disappear from a kelp forest, you would expect:", choices: ["More kelp", "Urchins to increase and kelp to decline", "No change", "Warmer water"], answer: 1, why: "Without otters eating urchins, urchins overgraze the kelp, creating urchin barrens." },
      { type: "tf", q: "Sea otters rely on dense fur rather than blubber to stay warm.", answer: true, why: "They lack insulating blubber and have the densest fur of any animal, plus a high metabolism." }
    ]
  },

  "cleaning-stations": {
    title: "Cleaning stations: trust on the reef",
    track: "ecology", level: "Core", src: "si", time: 5,
    explain: [
      "On many reefs there are special spots where larger fish line up and wait. They are not waiting to be eaten, but to be cleaned. At these cleaning stations, small cleaner fish like cleaner wrasses, along with cleaner shrimp, pick parasites, dead skin, and bits of food off much bigger 'client' fish. They even clean inside the mouths and gills. It is a classic example of mutualism, where both partners win.",
      "The cleaner gets an easy meal. The client gets healthier skin and fewer parasites. Remarkably, predators that could easily swallow a cleaner usually leave it alone. Clients hold still and open their mouths to let the cleaner work inside. Cleaners even do a little dance to advertise their service, and clients come back to the same stations again and again.",
      "Like any teamwork, cleaning can be cheated. Some cleaner fish now and then take a bite of healthy tissue. And a sneaky copycat, the false cleanerfish, mimics the cleaner wrasse's look and dance to get close, then bites a chunk out of the client. Even so, the partnership is so valuable that cleaning stations stay busy hubs of reef life."
    ],
    why: "Cleaning stations reveal how cooperation, trust, and even deception evolve between species, and how mutualism keeps reef fish healthy.",
    misconception: "Client fish are not being preyed upon at cleaning stations — they actively seek out cleaners and cooperate to be groomed.",
    terms: [
      ["Cleaning station", "A reef spot where cleaner fish or shrimp remove parasites from larger clients."],
      ["Mutualism", "A relationship in which both species benefit."],
      ["Client fish", "A larger fish that visits a cleaning station to be groomed."],
      ["Aggressive mimicry", "When a predator (e.g., the false cleanerfish) imitates a harmless species to get close."]
    ],
    hook: "Big fish queue to be cleaned by tiny ones — and a sneaky mimic exploits the trust.",
    sources: [
      { label: "Smithsonian Ocean — reef life", url: "https://ocean.si.edu/" },
      { label: "NOAA — coral reef ecosystems", url: "https://coralreef.noaa.gov/" }
    ],
    quiz: [
      { type: "mc", q: "A cleaning station is an example of:", choices: ["Predation", "Mutualism", "Competition", "Parasitism only"], answer: 1, why: "Both partners benefit: the cleaner eats, and the client loses parasites and dead skin." },
      { type: "tf", q: "Predatory client fish usually refrain from eating the cleaners that service them.", answer: true, why: "The grooming is valuable enough that clients cooperate instead of eating the cleaner." },
      { type: "mc", q: "The false cleanerfish survives by:", choices: ["Cleaning more thoroughly", "Mimicking a real cleaner, then biting the client", "Eating only algae", "Building cleaning stations"], answer: 1, why: "It copies the cleaner wrasse's look and dance to approach, then bites healthy tissue — aggressive mimicry." }
    ]
  },

  "cephalopod-minds": {
    title: "Cephalopod intelligence: minds in the arms",
    track: "organisms", level: "Core", src: "si", time: 6,
    explain: [
      "Octopuses, squid, cuttlefish, and nautiluses are cephalopods. They are molluscs that mostly gave up their shell for speed, soft bodies, and big brains. Among animals without a backbone, their brains are the largest and most complex. An octopus is famous for solving problems. It can open jars, escape from tanks, find its way through mazes, and even use tools. The veined octopus, for example, carries coconut-shell halves to hide inside later.",
      "An octopus has an unusual nervous system. About two-thirds of its nerve cells are spread through its eight arms. The arms can taste, touch, and partly act on their own. Cephalopods are also masters of disguise. Special skin cells called chromatophores, backed by reflective layers, let them change color and even texture in a split second. They use this to blend in or to flash bold signals. Amazingly, most are probably color-blind, yet they still match their surroundings.",
      "Their biology has trade-offs. Most cephalopods live just one or two years. They breed only once and die soon after, living a fast, brilliant life. They also have three hearts and blue blood. Their blood uses copper instead of iron, which carries oxygen well in cold water with little oxygen. They sit far from us on the tree of life, so their cleverness shows that intelligence has evolved more than once."
    ],
    why: "Cephalopods show that complex intelligence evolved independently from ours, expanding what we think minds can look like.",
    misconception: "An octopus's intelligence is not centered in one big brain alone — much of its nervous system, and a lot of its behavior, lives in its arms.",
    terms: [
      ["Cephalopod", "A group of molluscs including octopus, squid, cuttlefish and nautilus."],
      ["Chromatophore", "A pigment-filled skin cell that lets cephalopods rapidly change color."],
      ["Hemocyanin", "A copper-based, bluish blood pigment that carries oxygen in cephalopods."],
      ["Semelparity", "Reproducing only once in a lifetime, as most cephalopods do."]
    ],
    hook: "Three hearts, blue blood, color-changing skin — and most of its neurons in its arms.",
    sources: [
      { label: "Smithsonian Ocean — cephalopods", url: "https://ocean.si.edu/" },
      { label: "MBARI — cephalopod research", url: "https://www.mbari.org/" }
    ],
    quiz: [
      { type: "mc", q: "About what fraction of an octopus's neurons are in its arms?", choices: ["Almost none", "Roughly two-thirds", "Exactly half in the eyes", "All of them"], answer: 1, why: "Around two-thirds of its neurons are distributed through the eight arms, which can act semi-independently." },
      { type: "mc", q: "Cephalopods change color rapidly using:", choices: ["Chlorophyll", "Chromatophores in the skin", "Scales", "Bioluminescent bacteria only"], answer: 1, why: "Chromatophores, backed by reflective cells, expand and contract to shift color and pattern in an instant." },
      { type: "tf", q: "Most octopuses live only one or two years and breed a single time.", answer: true, why: "They are typically semelparous, with short lifespans, breeding once and then dying." }
    ]
  },

  "shark-senses": {
    title: "Shark senses: the electric sixth sense",
    track: "physiology", level: "Advanced", src: "noaafish", time: 6,
    explain: [
      "Sharks are ancient, well-equipped predators. Much of their success comes from an amazing set of senses. They have a sharp sense of smell. They see well in low light, helped by a mirror-like layer behind the eye. They also have a lateral line, a row of sensors along the body. It picks up tiny vibrations and water movements, so a shark can 'feel' a struggling fish nearby.",
      "Their most amazing sense is electroreception. Around a shark's snout are jelly-filled pores called the ampullae of Lorenzini. They detect the weak electric fields made by the muscles and nerves of other animals. This lets sharks find prey hidden in sand or murky water, even in total darkness. It may also help them navigate using Earth's magnetic field. Some sharks can sense incredibly weak fields.",
      "Movies make these powers sound even bigger than they are. A shark cannot really smell a single drop of blood from miles away. Still, the truth is impressive. Many sharks must keep swimming to push water over their gills, which is called ram ventilation. Others can pump water and rest on the bottom. Together, smell, vibration sensing, sharp eyesight, and electroreception keep sharks finely tuned to the ocean around them."
    ],
    why: "Electroreception and the lateral line let sharks detect prey we could never sense, showing how different the sensory world of a marine predator can be.",
    misconception: "Sharks cannot detect 'one drop of blood from miles away' — that claim is a myth; their real senses are remarkable but not magical.",
    terms: [
      ["Ampullae of Lorenzini", "Jelly-filled snout pores that let sharks sense weak electric fields."],
      ["Electroreception", "The ability to detect electric fields produced by other animals."],
      ["Lateral line", "A row of sensors detecting vibrations and water movement along a fish's body."],
      ["Ram ventilation", "Swimming forward to force water over the gills for breathing."]
    ],
    hook: "Jelly-filled pores on a shark's snout sense the electricity of a hidden heartbeat.",
    sources: [
      { label: "NOAA Fisheries — sharks", url: "https://www.fisheries.noaa.gov/" },
      { label: "Smithsonian Ocean — sharks", url: "https://ocean.si.edu/" }
    ],
    quiz: [
      { type: "mc", q: "The ampullae of Lorenzini allow sharks to:", choices: ["See color underwater", "Detect weak electric fields from prey", "Breathe without gills", "Produce light"], answer: 1, why: "These snout pores sense the electric fields made by other animals' muscles and nerves." },
      { type: "tf", q: "A shark's lateral line detects vibrations and water movements around it.", answer: true, why: "The lateral line lets a shark 'feel' nearby motion, like a struggling fish." },
      { type: "mc", q: "Which popular claim about sharks is a myth?", choices: ["They have a good sense of smell", "They can smell a single drop of blood from miles away", "They have electroreception", "Some must swim to breathe"], answer: 1, why: "Sharks smell well, but the 'drop of blood from miles away' claim is greatly exaggerated." }
    ]
  },

  "turtle-journeys": {
    title: "Sea turtles: magnetic maps and long journeys",
    track: "physiology", level: "Core", src: "noaafish", time: 6,
    explain: [
      "Sea turtles live long lives that cross entire ocean basins. Females often return to nest on or near the very beach where they hatched. This is called natal homing. It can happen decades later and thousands of kilometers away. The sex of their hatchlings is not set by genes but by temperature. Warmer sand tends to make more females, and cooler sand more males. This makes turtles sensitive to a warming climate.",
      "Newly hatched turtles rush to the sea and vanish into the open ocean for years. These are called the 'lost years.' They return to coastal feeding grounds later as juveniles. To find their way across featureless seas, turtles use Earth's magnetic field. They can sense both its strength and the angle at which it dips. They read the field like a map and compass to find regions and even specific coastlines.",
      "These journeys face many dangers. Hatchlings can be fatally confused by artificial lights that draw them away from the sea. Adults get caught by accident in fishing gear. And turtles mistake floating plastic for food. Understanding how turtles navigate and breed helps guide protections, from shielded beach lighting to gear that lets turtles escape nets."
    ],
    why: "Sea turtle navigation reveals a magnetic sense we lack, and temperature-set sex makes turtles a sensitive indicator of climate change.",
    misconception: "A hatchling's sex is not fixed by chromosomes like ours — for sea turtles it depends on the temperature of the sand during incubation.",
    terms: [
      ["Natal homing", "Returning to breed at or near one's own birthplace."],
      ["Magnetoreception", "Sensing Earth's magnetic field to navigate."],
      ["Temperature-dependent sex determination", "When incubation temperature, not genes, sets hatchling sex."],
      ["Lost years", "The early ocean-going phase of young sea turtles, long hard to track."]
    ],
    hook: "Turtles read Earth's magnetic field like a map — and warm sand makes more females.",
    sources: [
      { label: "NOAA Fisheries — sea turtles", url: "https://www.fisheries.noaa.gov/" },
      { label: "Smithsonian Ocean — sea turtles", url: "https://ocean.si.edu/" }
    ],
    quiz: [
      { type: "mc", q: "For most sea turtles, hatchling sex is determined by:", choices: ["Sex chromosomes", "Incubation temperature of the sand", "The mother's diet", "Ocean salinity"], answer: 1, why: "Warmer sand tends to yield more females and cooler sand more males — temperature-dependent sex determination." },
      { type: "mc", q: "Sea turtles navigate across open ocean largely by sensing:", choices: ["Star patterns only", "Earth's magnetic field", "Ocean temperature alone", "Sound from shore"], answer: 1, why: "They use magnetoreception, reading both the strength and inclination of the geomagnetic field." },
      { type: "tf", q: "Artificial beach lighting can disorient hatchlings and draw them away from the sea.", answer: true, why: "Hatchlings head toward the brightest horizon; artificial lights can misdirect them inland." }
    ]
  }

});
