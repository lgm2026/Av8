/* SeaHype base lesson set: Ocean Foundations + Marine Ecology.
   Plain data, merged at build time. See HANDOFF.md for the lesson shape.
   Sources point to authoritative ocean-science organizations (NOAA, Smithsonian
   Ocean, MBARI, WHOI, IUCN, WoRMS, NASA). Facts are drawn from well-established
   marine-biology references; high-leverage figures were spot-checked. */
window.__SEA_LESSONS__ = Object.assign(window.__SEA_LESSONS__ || {}, {

  "sea-intro": {
    title: "What marine biology is — and how to use SeaHype",
    track: "foundations", level: "Foundations", src: "si", time: 4,
    explain: [
      "Marine biology is the study of living things in the ocean. That covers everything from bacteria too tiny to see all the way up to the blue whale, the biggest animal that has ever lived. The ocean covers most of our planet. It shapes our weather, our air, and our food. So marine biologists get to explore a little bit of everything.",
      "SeaHype teaches it the way you would really learn it: in short lessons grouped into a roadmap, each one followed by a quick quiz so the ideas stick. You will start with how the ocean itself works. Then you will move on to ocean food webs, the major groups of sea life, ocean habitats, how animals survive down there, how to protect the ocean, and how scientists actually study it.",
      "Think of SeaHype as your study buddy. It is a place to learn and explore, not a replacement for school or real diving training. When a lesson states a fact, it links to a trusted website where you can read more. Tap any source link when you want to dig deeper."
    ],
    terms: [
      ["Marine biology", "The scientific study of living things in the ocean and other salt water."],
      ["Habitat", "The particular place or environment where an organism naturally lives."],
      ["Species", "A group of organisms that can interbreed and produce fertile, viable offspring."]
    ],
    why: "When you see how the pieces fit together, the water, the chemistry, the animals, the whole system, you start to think like a real marine biologist instead of just memorizing facts.",
    hook: "Basics first, then the animals — because you can't really understand the fish until you understand the water.",
    sources: [
      { label: "Smithsonian Ocean — overview and exploration", url: "https://ocean.si.edu/" },
      { label: "NOAA Ocean Service — ocean facts", url: "https://oceanservice.noaa.gov/facts/" }
    ],
    quiz: [
      { type: "mc", q: "Marine biology is best described as the study of:", choices: ["Only fish", "Living things in the ocean and other salt water", "Only the seafloor", "Only marine mammals"], answer: 1, why: "It spans all ocean life, from microbes to whales, and overlaps with oceanography, chemistry and ecology." },
      { type: "tf", q: "SeaHype lessons are a substitute for an accredited marine-biology degree and field training.", answer: false, why: "SeaHype is a study and reference tool. Real training, fieldwork and certifications come from accredited programs." }
    ]
  },

  "ocean-cover": {
    title: "One ocean, most of the planet",
    track: "foundations", level: "Foundations", src: "noaa", time: 5,
    explain: [
      "The ocean covers about 71% of Earth's surface and holds about 97% of the planet's water. We name five basins: the Pacific, Atlantic, Indian, Southern, and Arctic. But they are really one connected body of water, the global ocean, with no real walls between them. The Pacific is the largest and deepest basin.",
      "The ocean is huge in volume, not just area. Its average depth is about 3,682 meters (12,080 feet). More than 90% of it lies deeper than 200 meters. That is the dark, cold, high-pressure realm we call the deep sea. It makes the ocean by far the largest livable space on Earth.",
      "Despite its size, most of the ocean is unseen. So far, only a small part of the deep seafloor has been directly observed. About a quarter to a third has been mapped in fine detail. Scientists keep describing about two thousand new sea species every year."
    ],
    why: "Almost every global system — climate, weather, the carbon and oxygen cycles, fisheries — runs through this single connected ocean.",
    misconception: "The five 'oceans' are not separate seas; they are regions of one continuous global ocean.",
    terms: [
      ["Ocean basin", "A large region of the global ocean (Pacific, Atlantic, Indian, Southern, Arctic)."],
      ["Deep sea", "Ocean deeper than about 200 m — over 90% of the ocean by volume."]
    ],
    hook: "Seven-one-one: 71% covered, ~97% of the water, >90% of it deep.",
    sources: [
      { label: "NOAA — ocean facts (basics)", url: "https://oceanservice.noaa.gov/facts/oceanfacts-basics.html" },
      { label: "NOAA Ocean Exploration — how much has been explored", url: "https://oceanexplorer.noaa.gov/ocean-fact/explored/" }
    ],
    quiz: [
      { type: "mc", q: "Approximately what fraction of Earth's surface does the ocean cover?", choices: ["About 30%", "About 50%", "About 71%", "About 95%"], answer: 2, why: "The ocean covers roughly 71% of Earth's surface and holds about 97% of its water." },
      { type: "mc", q: "Which basin is the largest and deepest?", choices: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2, why: "The Pacific is both the largest and the deepest ocean basin." },
      { type: "tf", q: "More than 90% of the ocean by volume is deeper than 200 meters.", answer: true, why: "The average depth is about 3,682 m and the deep sea (>200 m) makes up the vast majority of ocean volume." }
    ]
  },

  "seawater": {
    title: "What seawater is made of",
    track: "foundations", level: "Foundations", src: "noaa", time: 6,
    explain: [
      "Seawater is water plus dissolved salts. On average, it holds about 35 grams of salt per kilogram of water. That is written as 35 parts per thousand, or about 3.5% by weight. The two most common ions are sodium and chloride, which together make ordinary table salt. After those come sulfate, magnesium, calcium, and potassium.",
      "The ocean is salty because of a slow process. Rivers and rain slowly wear down rock on land and carry dissolved minerals to the sea. Undersea vents add more. Water leaves the ocean by evaporation, but the salts stay behind and build up over a very long time. So the sea stays salty even though the rivers feeding it are fresh.",
      "Saltiness is not the same everywhere. It rises where lots of water evaporates, like the warm, dry subtropics. It falls where rivers, rain, or melting ice add fresh water, like the poles and estuaries. These differences in salt, along with temperature, change how dense seawater is. That helps drive ocean currents."
    ],
    why: "Salt content sets the density of water and creates the osmotic challenge every marine organism must solve to keep its internal salt balance.",
    misconception: "Most ocean salt does not come from the seafloor sinking; it mainly comes from rock weathering on land delivered by rivers, plus hydrothermal input.",
    terms: [
      ["Salinity", "The amount of dissolved salt in water, averaging ~35 ppt in the open ocean."],
      ["Parts per thousand (ppt / ‰)", "Grams of salt per kilogram of seawater."]
    ],
    hook: "Thirty-five and salty: ~35 g of salt per kg, mostly sodium and chloride.",
    sources: [
      { label: "NOAA — Why is the ocean salty?", url: "https://oceanservice.noaa.gov/facts/whysalty.html" },
      { label: "NOAA — Can humans drink seawater?", url: "https://oceanservice.noaa.gov/facts/drinksw.html" }
    ],
    quiz: [
      { type: "mc", q: "The average salinity of the open ocean is closest to:", choices: ["3.5 ppt", "35 ppt", "350 ppt", "0.35 ppt"], answer: 1, why: "Average seawater is about 35 parts per thousand — roughly 35 g of salt per kg of water." },
      { type: "mc", q: "The two most abundant ions in seawater are:", choices: ["Calcium and potassium", "Magnesium and sulfate", "Sodium and chloride", "Iron and silicate"], answer: 2, why: "Sodium and chloride dominate; sulfate, magnesium, calcium and potassium follow." },
      { type: "tf", q: "The ocean is salty mainly because rivers carry dissolved minerals from weathered rock into the sea over long times.", answer: true, why: "Weathering on land plus hydrothermal input add salts; evaporation removes water but leaves the salt behind." }
    ]
  },

  "temp-density-light": {
    title: "Temperature, density, and light in the sea",
    track: "foundations", level: "Foundations", src: "nasa", time: 6,
    explain: [
      "The sun warms only the surface, so most of the open ocean is layered. A warm, mixed surface layer sits on top of cold deep water. Between them is the thermocline, a zone where the temperature drops quickly as you go down. Below the thermocline, the deep ocean is cold almost everywhere, just a few degrees above freezing.",
      "Cold water and salty water are denser, or heavier, than warm or fresh water. So dense water sinks, and steady layers resist mixing. This layering is called stratification. It controls how nutrients and oxygen move between the surface and the deep. That, in turn, decides where life can thrive.",
      "Light fades fast underwater. Red and orange light is soaked up in the first 10 to 20 meters. Blue light reaches the deepest, which is why the open ocean looks blue. Enough light for photosynthesis usually reaches only the top 200 meters or so. This is the sunlit zone, also called the photic zone. Below about 1,000 meters, there is no sunlight at all."
    ],
    why: "Temperature, density and light together decide where photosynthesis happens, how layers mix, and which animals live at which depth.",
    terms: [
      ["Thermocline", "The depth zone where temperature drops rapidly between warm surface water and the cold deep."],
      ["Stratification", "Stable layering of water by density (temperature and salinity) that resists mixing."],
      ["Photic zone", "The sunlit upper layer (~0–200 m) where there is enough light for photosynthesis."]
    ],
    hook: "Red dies first, blue goes deepest — that is why the open sea looks blue.",
    sources: [
      { label: "NASA Earth Observatory — ocean color and light", url: "https://earthobservatory.nasa.gov/" },
      { label: "NOAA — why the ocean gets colder at depth", url: "https://oceanservice.noaa.gov/facts/coldocean.html" }
    ],
    quiz: [
      { type: "mc", q: "The thermocline is the zone where:", choices: ["Salinity is highest", "Temperature drops rapidly with depth", "Light is brightest", "Pressure is lowest"], answer: 1, why: "It separates the warm surface layer from the cold deep, with a steep temperature change." },
      { type: "mc", q: "The open ocean looks blue mainly because:", choices: ["It reflects the sky only", "Red light is absorbed quickly and blue penetrates deepest", "Salt is blue", "Plankton are blue"], answer: 1, why: "Water absorbs long (red) wavelengths near the surface, so deeper-penetrating blue light dominates." },
      { type: "tf", q: "Most of the deep ocean is only a few degrees above freezing.", answer: true, why: "Below the thermocline the deep sea is uniformly cold across most of the planet." }
    ]
  },

  "pressure": {
    title: "Pressure and the deep",
    track: "foundations", level: "Foundations", src: "noaa", time: 4,
    explain: [
      "Water is heavy, and it piles up. Pressure rises by about one atmosphere for every 10 meters (about 33 feet) of depth. At the surface you feel 1 atmosphere. At 1,000 meters you feel about 100. At the bottom of the deepest trench, the pressure is more than a thousand times what it is at sea level.",
      "The deepest known point is the Challenger Deep, in the Mariana Trench. It is about 10,935 meters (around 35,876 feet) down, deeper than Mount Everest is tall. Animals live even there, in total darkness and crushing pressure.",
      "Deep-sea animals survive because they are not full of air to be crushed. Their bodies are mostly water and gel, which barely squeeze. Their cells and enzymes are tuned to work under high pressure. The same pressure that would crush a hollow container passes harmlessly through a soft, water-filled body."
    ],
    why: "Pressure is the single biggest engineering problem for exploring and understanding the deep sea — and the reason deep life looks so different.",
    misconception: "Deep-sea animals are not 'crushed-proof' by being tough; they avoid crushing by having almost no internal air spaces.",
    terms: [
      ["Atmosphere (atm)", "A unit of pressure; one atm is the air pressure at sea level."],
      ["Challenger Deep", "The deepest known point of the ocean, in the Mariana Trench (~10,935 m)."]
    ],
    hook: "One atmosphere per ten meters — the deep is a slow, relentless squeeze.",
    sources: [
      { label: "NOAA — how does pressure change with depth", url: "https://oceanservice.noaa.gov/facts/pressure.html" },
      { label: "NOAA Fisheries — Mariana Trench Marine National Monument", url: "https://www.fisheries.noaa.gov/pacific-islands/habitat-conservation/mariana-trench-marine-national-monument" }
    ],
    quiz: [
      { type: "mc", q: "About how much does pressure increase per 10 meters of depth?", choices: ["A tenth of an atmosphere", "One atmosphere", "Ten atmospheres", "One hundred atmospheres"], answer: 1, why: "Roughly one atmosphere (~14.7 psi) is added for every 10 m / 33 ft of descent." },
      { type: "tf", q: "The Challenger Deep is deeper than Mount Everest is tall.", answer: true, why: "At about 10,935 m it exceeds Everest's height of ~8,849 m." },
      { type: "mc", q: "Deep-sea animals avoid being crushed mainly because:", choices: ["They have thick armor", "Their bodies are mostly water and gel with few air spaces", "They surface every day", "Pressure is actually low down there"], answer: 1, why: "Water and soft tissue barely compress, so pressure passes through harmlessly." }
    ]
  },

  "zones-pelagic": {
    title: "The ocean in layers: pelagic zones",
    track: "foundations", level: "Foundations", src: "si", time: 6,
    explain: [
      "Scientists divide the open water into depth zones, based mostly on light. The top zone is the epipelagic, or sunlit zone. It runs from the surface to about 200 meters. Almost all photosynthesis happens here, and it holds most of the ocean's familiar life.",
      "Below that is the mesopelagic, or twilight zone, about 200 to 1,000 meters down. Only faint blue light reaches here, and many animals make their own light. Next comes the bathypelagic, or midnight zone, about 1,000 to 4,000 meters, which is always dark. Below that is the abyssopelagic, about 4,000 to 6,000 meters, near the flat abyssal plains.",
      "Deepest of all is the hadal zone, below about 6,000 meters. It is found mainly in ocean trenches. Each zone is colder, darker, and under more pressure than the one above. Animals are adapted to the exact band where they live."
    ],
    why: "Depth zones are the ocean's address system: knowing the zone tells you the light, temperature, pressure and the kind of life you will find.",
    terms: [
      ["Pelagic", "Of the open water column, as opposed to the seafloor (benthic)."],
      ["Epipelagic / photic", "Surface to ~200 m; the sunlit zone where photosynthesis occurs."],
      ["Mesopelagic", "~200–1,000 m; the dim 'twilight zone'."],
      ["Hadal", "Below ~6,000 m, mostly in deep trenches."]
    ],
    hook: "Sunlight, twilight, midnight, abyss, hadal — five steps down into the dark.",
    sources: [
      { label: "Smithsonian Ocean — ocean zones and the deep", url: "https://ocean.si.edu/ecosystems/deep-sea" },
      { label: "MBARI — midwater and the twilight zone", url: "https://www.mbari.org/" }
    ],
    quiz: [
      { type: "mc", q: "Which zone holds almost all of the ocean's photosynthesis?", choices: ["Bathypelagic (midnight)", "Hadal", "Epipelagic (sunlit)", "Abyssopelagic"], answer: 2, why: "Only the sunlit epipelagic (0–200 m) gets enough light for photosynthesis." },
      { type: "mc", q: "The mesopelagic is also called the:", choices: ["Midnight zone", "Twilight zone", "Sunlit zone", "Hadal zone"], answer: 1, why: "The mesopelagic (~200–1,000 m) is the dim twilight zone, rich in bioluminescent life." },
      { type: "tf", q: "The hadal zone is found mainly in deep ocean trenches below about 6,000 meters.", answer: true, why: "Hadal habitats are largely confined to the deepest trenches." }
    ]
  },

  "zones-benthic": {
    title: "Living on the bottom: the benthic realm",
    track: "foundations", level: "Foundations", src: "noaa", time: 5,
    explain: [
      "Life on or in the seafloor is called the benthos. The bottom habitats make up the benthic realm. It is the partner to the pelagic realm, which is the open water. Benthic zones follow the shape of the seafloor as it drops away from shore.",
      "Closest to land is the intertidal, or littoral, zone, covered and uncovered by the tides. Beyond it is the sublittoral, or neritic, zone over the continental shelf. This is the shallow, sunny, productive seafloor where most fishing happens. Past the shelf edge, the bottom drops through the bathyal zone (the slope), the abyssal zone (the vast deep plains), and the hadal zone (the trenches).",
      "Benthic animals are grouped by how they live. Epifauna sit on the surface, like corals, sea stars, and mussels. Infauna burrow into the sediment, like clams and many worms. Most of the seafloor is soft mud and sand. But hard-bottom habitats like reefs and rocky shores pack in far more species per square meter."
    ],
    why: "A huge share of ocean biodiversity, and most of the world's fish catch, comes from the benthic shelf, not the open blue water.",
    terms: [
      ["Benthos / benthic", "Organisms living on or in the seafloor, and their bottom habitats."],
      ["Neritic / continental shelf", "The shallow seafloor from shore to the shelf edge (~200 m)."],
      ["Epifauna vs infauna", "Animals living on the surface of the seafloor vs burrowed within it."]
    ],
    hook: "Benthos lives on the bottom; pelagos drifts and swims above it.",
    sources: [
      { label: "NOAA — ocean facts (basics)", url: "https://oceanservice.noaa.gov/facts/oceanfacts-basics.html" },
      { label: "Smithsonian Ocean — seafloor and shelf habitats", url: "https://ocean.si.edu/" }
    ],
    quiz: [
      { type: "mc", q: "The benthos refers to:", choices: ["Drifting plankton", "Organisms living on or in the seafloor", "Fast-swimming open-ocean fish", "Surface seaweed"], answer: 1, why: "Benthos are bottom-dwellers; the open-water drifters and swimmers are plankton and nekton." },
      { type: "mc", q: "Most of the world's fisheries operate over the:", choices: ["Hadal trenches", "Abyssal plains", "Continental shelf (neritic zone)", "Open midnight zone"], answer: 2, why: "The shallow, sunlit, productive shelf supports most commercial fishing." },
      { type: "tf", q: "Infauna are animals that burrow into the sediment, while epifauna live on its surface.", answer: true, why: "Clams and many worms are infauna; sea stars and mussels are epifauna." }
    ]
  },

  "seafloor": {
    title: "The shape of the seafloor and plate tectonics",
    track: "foundations", level: "Foundations", src: "usgs", time: 6,
    explain: [
      "From the coast, the seafloor drops in steps. First comes the gently sloping continental shelf. At its edge, the steeper continental slope takes over. Below that lies the rise, and then the abyssal plain. The abyssal plain is a huge, flat floor covered in sediment, several kilometers down. It makes up much of the ocean bottom.",
      "Crossing the deep are the mid-ocean ridges. They form the planet's longest mountain chain. Here, the giant plates of Earth's crust pull apart, and erupting magma makes new seafloor. Where plates crash together, one plate dives under the other. This is called a subduction zone. It forms the deepest places on Earth: ocean trenches, like the Mariana Trench.",
      "Moving plates also build seamounts (underwater volcanoes), chains of islands, and hydrothermal vents along the ridges. These features are more than scenery. They create habitats, gather nutrients, and hold whole communities of animals found nowhere else."
    ],
    why: "Geology sets the stage: ridges, trenches, vents and seamounts decide where unique deep-sea ecosystems can exist.",
    terms: [
      ["Continental shelf / slope", "The shallow shelf near land and the steep drop beyond the shelf break."],
      ["Abyssal plain", "The flat, deep, sediment-covered seafloor several km down."],
      ["Mid-ocean ridge", "An underwater mountain chain where plates spread and new crust forms."],
      ["Subduction / trench", "Where one plate sinks beneath another, forming the deepest ocean trenches."]
    ],
    hook: "Ridges build seafloor, trenches swallow it — the bottom is alive with tectonics.",
    sources: [
      { label: "USGS — plate tectonics and the seafloor", url: "https://www.usgs.gov/" },
      { label: "NOAA Ocean Exploration — seafloor features", url: "https://oceanexplorer.noaa.gov/" }
    ],
    quiz: [
      { type: "mc", q: "The longest mountain chain on Earth is:", choices: ["The Andes", "The Himalayas", "The mid-ocean ridge system", "The Rockies"], answer: 2, why: "The globe-spanning mid-ocean ridge, mostly underwater, is the planet's longest mountain range." },
      { type: "mc", q: "Deep ocean trenches form where:", choices: ["Plates spread apart", "One plate subducts beneath another", "Rivers deposit sediment", "Coral builds reefs"], answer: 1, why: "Subduction zones, where one plate dives under another, create the deepest trenches." },
      { type: "tf", q: "The abyssal plain is a flat, sediment-covered region that makes up much of the deep seafloor.", answer: true, why: "Abyssal plains are among the flattest and most extensive surfaces on Earth." }
    ]
  },

  "currents": {
    title: "Currents, gyres, and upwelling",
    track: "foundations", level: "Foundations", src: "noaa", time: 6,
    explain: [
      "Wind pushes on the sea surface and drives the great surface currents. As Earth spins, it bends the paths of these currents. This bending is called the Coriolis effect. Because of it, the currents in each ocean basin loop into giant spinning systems called gyres. They turn clockwise north of the equator and counterclockwise south of it.",
      "These currents carry heat around the planet. The Gulf Stream, for example, carries warm tropical water toward Europe and keeps its weather milder. Deeper down, differences in temperature and saltiness drive a slow, deep flow. It is called the thermohaline circulation, or the global ocean conveyor belt. It links all the ocean basins, but it takes centuries to go around.",
      "Sometimes wind pushes surface water away from a coast. Then cold water full of nutrients rises from below to take its place. This rising is called upwelling. It feeds the sunlit zone and creates some of the best fishing grounds on Earth, like the waters off Peru and California."
    ],
    why: "Currents spread heat, oxygen, and nutrients around the ocean. They decide which areas are nearly empty and which are full of life.",
    misconception: "Surface currents are driven mainly by wind and steered by Coriolis, not by the tides.",
    terms: [
      ["Gyre", "A large, rotating system of surface currents in an ocean basin."],
      ["Coriolis effect", "The deflection of moving water (and air) caused by Earth's rotation."],
      ["Upwelling", "Rising of cold, nutrient-rich deep water that fuels high productivity."],
      ["Thermohaline circulation", "Deep, slow global flow driven by temperature and salinity differences."]
    ],
    hook: "Wind spins the gyres; cold upwelling feeds the feast.",
    sources: [
      { label: "NOAA — the global ocean conveyor belt", url: "https://oceanservice.noaa.gov/facts/conveyor.html" },
      { label: "NOAA — what is upwelling?", url: "https://oceanservice.noaa.gov/facts/upwelling.html" }
    ],
    quiz: [
      { type: "mc", q: "Ocean gyres rotate the way they do mainly because of:", choices: ["The tides", "The Coriolis effect from Earth's rotation", "Moonlight", "Salinity alone"], answer: 1, why: "Wind drives the currents and Earth's rotation (Coriolis) bends them into rotating gyres." },
      { type: "mc", q: "Upwelling makes coastal waters highly productive because it brings up:", choices: ["Warm fresh water", "Cold, nutrient-rich deep water", "Extra salt", "Sediment from rivers"], answer: 1, why: "Nutrient-rich deep water rising to the sunlit zone fuels plankton blooms and rich fisheries." },
      { type: "tf", q: "The thermohaline circulation is driven by differences in temperature and salinity.", answer: true, why: "Density differences from heat and salt drive this slow, deep, global circulation." }
    ]
  },

  "tides": {
    title: "Tides and the moving shore",
    track: "foundations", level: "Foundations", src: "noaa", time: 5,
    explain: [
      "Tides are the regular rise and fall of the sea. They are caused mostly by the gravity of the Moon, and to a lesser extent the Sun, working together with Earth's rotation. Most coasts get two high tides and two low tides each day, a pattern called semidiurnal. Some places get just one of each.",
      "When the Sun, Earth, and Moon line up, at new and full moons, their pulls add together. This makes the biggest tides, called spring tides. When the Sun and Moon are at right angles, at the first and last quarter, their pulls partly cancel. This makes the smallest tides, called neap tides.",
      "Tides shape life along the coast. The intertidal zone is covered and uncovered as the tide moves. So the animals and seaweeds there must handle waves, drying out, temperature swings, and changing saltiness. That is why intertidal communities are arranged in distinct bands."
    ],
    why: "The tide is the master rhythm of every shoreline, controlling feeding, breeding, exposure and the zonation of coastal life.",
    misconception: "'Spring tides' have nothing to do with the season; they occur at every new and full moon when Sun and Moon align.",
    terms: [
      ["Spring tide", "The largest tidal range, at new and full moon when Sun and Moon align."],
      ["Neap tide", "The smallest tidal range, at the quarter moons when their pulls partly cancel."],
      ["Intertidal zone", "The shore between the high- and low-tide marks, alternately wet and dry."]
    ],
    hook: "Line up for springs, square off for neaps.",
    sources: [
      { label: "NOAA — what causes tides?", url: "https://oceanservice.noaa.gov/education/tutorial_tides/welcome.html" },
      { label: "NOAA — tides and water levels", url: "https://oceanservice.noaa.gov/facts/" }
    ],
    quiz: [
      { type: "mc", q: "Tides are caused mainly by the gravitational pull of:", choices: ["The Sun only", "The Moon (and to a lesser extent the Sun)", "Ocean currents", "Earth's core"], answer: 1, why: "The Moon's gravity dominates, with the Sun contributing and Earth's rotation timing the cycle." },
      { type: "mc", q: "Spring tides (the largest range) occur when:", choices: ["The Moon is at first quarter", "Sun, Earth and Moon are aligned (new/full moon)", "It is springtime", "The tide is neap"], answer: 1, why: "Alignment at new and full moon adds the Sun's and Moon's pulls together." },
      { type: "tf", q: "Intertidal organisms must tolerate being both underwater and exposed to air.", answer: true, why: "The tide alternately submerges and exposes them, driving strong zonation along the shore." }
    ]
  },

  /* ---------------------------- Marine Ecology ---------------------------- */

  "primary-production": {
    title: "Primary production: who feeds the sea",
    track: "ecology", level: "Foundations", src: "nasa", time: 6,
    explain: [
      "Almost all ocean life runs on energy first captured by primary producers. These are living things that build food from carbon dioxide. Near the surface, where there is sunlight, they make food by photosynthesis. Most of this work is done by tiny phytoplankton. In shallow water, seaweeds, seagrasses, and the algae inside corals help too.",
      "Phytoplankton are tiny, but they matter enormously. They drift as single cells and chains. Together they do about half of all the photosynthesis on Earth and make a large share of the oxygen we breathe. They need two things to grow: sunlight near the surface, and nutrients like nitrogen, phosphorus, and iron that rise from deeper water.",
      "In the deep sea there is no sunlight at all. At hydrothermal vents and cold seeps, some bacteria and archaea still make food. Instead of using light, they get energy from chemicals like hydrogen sulfide or methane. This is called chemosynthesis. These tiny microbes feed whole communities of animals in complete darkness."
    ],
    why: "Primary production is the base of the entire marine food web and a major driver of Earth's oxygen and carbon cycles.",
    misconception: "The ocean's main 'plants' are not big seaweeds but microscopic phytoplankton, which do most of the sea's photosynthesis.",
    terms: [
      ["Primary producer", "An organism that makes organic matter from CO2 (by photosynthesis or chemosynthesis)."],
      ["Phytoplankton", "Microscopic drifting photosynthesizers; the base of most marine food webs."],
      ["Chemosynthesis", "Building food from chemical energy (e.g. sulfide) instead of sunlight."]
    ],
    hook: "Half of Earth's photosynthesis happens in cells you cannot see.",
    sources: [
      { label: "NASA — ocean color and phytoplankton", url: "https://earthobservatory.nasa.gov/features/Phytoplankton" },
      { label: "NOAA — what are phytoplankton?", url: "https://oceanservice.noaa.gov/facts/phyto.html" }
    ],
    quiz: [
      { type: "mc", q: "Most photosynthesis in the open ocean is done by:", choices: ["Kelp forests", "Coral animals", "Microscopic phytoplankton", "Sea turtles"], answer: 2, why: "Drifting phytoplankton perform roughly half of all photosynthesis on Earth." },
      { type: "mc", q: "Chemosynthesis lets organisms make food using:", choices: ["Sunlight", "Chemical energy such as from hydrogen sulfide", "Moonlight", "Salt"], answer: 1, why: "At vents and seeps, microbes use chemical energy instead of light to build organic matter." },
      { type: "tf", q: "Phytoplankton growth at the surface is often limited by the supply of nutrients from deeper water.", answer: true, why: "Light is plentiful at the surface, so nutrients (N, P, Fe) frequently limit production." }
    ]
  },

  "plankton": {
    title: "Plankton: the drifting multitude",
    track: "ecology", level: "Foundations", src: "mbari", time: 6,
    explain: [
      "Plankton are living things that drift with the currents. They cannot swim strongly enough to fight them. The word comes from the Greek word for 'wanderer.' Plankton range from tiny viruses and bacteria to jellyfish several meters wide. There are two big groups. Phytoplankton are plant-like and photosynthesize. Zooplankton are animal-like and graze or hunt.",
      "Some animals are plankton their whole lives, such as copepods and krill. These are called holoplankton. Others drift for only part of their lives. The eggs and young of crabs, fish, sea stars, and corals drift before they settle or grow into stronger swimmers. These are called meroplankton. This drifting stage is how many seafloor species spread to new places.",
      "Even the smallest plankton matter enormously. Ocean bacteria and viruses recycle nutrients in what is called the microbial loop, keeping the whole system going. Grazing zooplankton pass energy from phytoplankton up to fish, whales, and seabirds."
    ],
    why: "Plankton are the engine room of ocean food webs and the larval highway that connects distant populations.",
    terms: [
      ["Phytoplankton vs zooplankton", "Plant-like photosynthetic drifters vs animal-like drifting grazers/predators."],
      ["Holoplankton vs meroplankton", "Lifelong drifters vs temporary planktonic eggs and larvae."],
      ["Microbial loop", "Recycling of nutrients by marine bacteria and viruses."]
    ],
    hook: "Phyto makes the food, zoo eats it, micro recycles it.",
    sources: [
      { label: "MBARI — plankton research", url: "https://www.mbari.org/" },
      { label: "NOAA — what is plankton?", url: "https://oceanservice.noaa.gov/facts/plankton.html" }
    ],
    quiz: [
      { type: "mc", q: "Plankton are defined by the fact that they:", choices: ["Live on the seafloor", "Drift with currents and cannot swim strongly against them", "Are always microscopic", "Only live in the deep sea"], answer: 1, why: "Plankton drift; size ranges from viruses to large jellyfish." },
      { type: "mc", q: "Crab and fish larvae that drift temporarily before settling are examples of:", choices: ["Holoplankton", "Meroplankton", "Phytoplankton", "Nekton"], answer: 1, why: "Meroplankton spend only part of their life cycle as drifting plankton." },
      { type: "tf", q: "Zooplankton are typically photosynthetic.", answer: false, why: "Zooplankton are animal-like grazers and predators; phytoplankton are the photosynthesizers." }
    ]
  },

  "food-webs": {
    title: "Food webs and energy flow",
    track: "ecology", level: "Foundations", src: "noaa", time: 6,
    explain: [
      "Energy enters the ocean through primary producers. Then it moves upward as living things eat one another. We describe where an animal sits with its trophic level. Producers are level one. The plant-eaters that eat them, like grazing zooplankton, are level two. The small meat-eaters that eat those are level three. This continues up to top predators like tuna, sharks, and orcas.",
      "Energy is lost at every step. It gets used for moving, growing, and making body heat. So only about 10% of the energy at one level reaches the next. This is called the 'ten percent rule.' It is why there are huge numbers of plankton but few top predators. It is also why big predators need large areas to find enough food.",
      "Real ecosystems are food webs, not simple chains. Most animals eat several kinds of prey and are eaten by several predators. Decomposers and scavengers complete the loop. They break down dead material and return nutrients to the system. Removing even one species can ripple through the whole web. This is especially true for a top predator or a 'keystone' species."
    ],
    why: "The ten-percent rule and food-web structure explain ocean abundance, predator rarity, and why overfishing top predators destabilizes ecosystems.",
    misconception: "Energy is not recycled up the chain; only about a tenth carries to each higher level, so top predators are always comparatively rare.",
    terms: [
      ["Trophic level", "An organism's step in the food web (producer, herbivore, carnivore...)."],
      ["Ten percent rule", "Roughly 10% of energy transfers from one trophic level to the next."],
      ["Keystone species", "A species whose effect on its community is large relative to its abundance."]
    ],
    hook: "Lose 90% at every step — that is why apex predators are few.",
    sources: [
      { label: "NOAA Fisheries — food webs and the ecosystem", url: "https://www.fisheries.noaa.gov/" },
      { label: "NOAA — ocean food chains and webs", url: "https://oceanservice.noaa.gov/education/" }
    ],
    quiz: [
      { type: "mc", q: "Roughly what fraction of energy passes from one trophic level to the next?", choices: ["About 1%", "About 10%", "About 50%", "About 90%"], answer: 1, why: "The 'ten percent rule': most energy is lost as heat and activity at each step." },
      { type: "mc", q: "A keystone species is one that:", choices: ["Is the most abundant", "Has a disproportionately large effect on its community", "Is always a producer", "Lives only in the deep sea"], answer: 1, why: "Its influence is large relative to its abundance; losing it can reshape the ecosystem." },
      { type: "tf", q: "Because of energy loss at each step, top predators are usually far less numerous than producers.", answer: true, why: "Only ~10% carries up each level, so abundance shrinks toward the top." }
    ]
  },

  "biodiversity": {
    title: "Biodiversity and biogeography",
    track: "ecology", level: "Core", src: "worms", time: 6,
    explain: [
      "Biodiversity is the variety of life. It includes the number of species, their genetic differences, and the range of ecosystems they form. The ocean is the cradle of biodiversity. Most major animal groups, called phyla, appear there, and several live nowhere else. Scientists have formally named more than 250,000 living marine species, and they add about two thousand new ones each year.",
      "Yet that is only a slice of what exists. Scientists think the true number of ocean species may be in the millions, with most still undiscovered. This is especially true for microbes and life in the deep sea. The main running count of named marine species is the World Register of Marine Species, or WoRMS.",
      "Biodiversity is not spread evenly. It is usually highest in the warm tropics and drops off toward the poles. It is also packed into complex habitats like coral reefs. The 'Coral Triangle' of Southeast Asia is the single richest marine region on Earth. Where the conditions and history allow more niches, more species can live together."
    ],
    why: "Diverse ecosystems are more productive and more resilient — and you cannot protect what has not been counted and mapped.",
    terms: [
      ["Biodiversity", "The variety of life: species, genes and ecosystems."],
      ["WoRMS", "World Register of Marine Species — the authoritative list of named marine species."],
      ["Latitudinal gradient", "The tendency for species richness to peak in the tropics and decline poleward."]
    ],
    hook: "250,000+ named, millions likely — the ocean is mostly undiscovered.",
    sources: [
      { label: "WoRMS — World Register of Marine Species", url: "https://www.marinespecies.org/" },
      { label: "Smithsonian Ocean — census of marine life", url: "https://ocean.si.edu/" }
    ],
    quiz: [
      { type: "mc", q: "About how many living marine species have been formally described?", choices: ["About 2,500", "About 25,000", "More than 250,000", "More than 25 million"], answer: 2, why: "WoRMS lists more than 250,000 accepted living marine species, with ~2,000 added yearly." },
      { type: "mc", q: "Marine biodiversity generally is:", choices: ["Highest at the poles", "Highest in the tropics and lower toward the poles", "Even everywhere", "Highest in the open midnight zone"], answer: 1, why: "A latitudinal gradient concentrates species richness in warm tropical seas, especially the Coral Triangle." },
      { type: "tf", q: "Most marine species are thought to be already described and named.", answer: false, why: "A large majority — especially microbes and deep-sea life — are still undiscovered." }
    ]
  },

  "interactions": {
    title: "How species interact",
    track: "ecology", level: "Core", src: "si", time: 6,
    explain: [
      "Ocean communities are shaped by how living things affect one another. In predation, one animal eats another. In competition, two living things fight over the same limited thing, like food or space. Both push species to specialize and to share out the habitat.",
      "Symbiosis means a close, long-lasting relationship between two species. It comes in three kinds. In mutualism, both species win. In commensalism, one wins and the other is not affected. In parasitism, one wins while the other is harmed. The sea is full of clear examples.",
      "Clownfish live safely among the stinging tentacles of an anemone. The fish gets protection, and its waste feeds the anemone. That is mutualism. Cleaner wrasse and cleaner shrimp pick parasites off bigger fish at spots called 'cleaning stations.' They get a meal while keeping the bigger fish healthy. Corals depend on tiny algae living inside them, which may be the most important partnership in the whole sea."
    ],
    why: "Interactions — not just physical conditions — determine who lives where, and many of the ocean's iconic relationships are partnerships.",
    misconception: "Symbiosis does not only mean mutual benefit; parasitism and commensalism are symbioses too.",
    terms: [
      ["Mutualism", "A symbiosis in which both species benefit (e.g. clownfish and anemone)."],
      ["Commensalism", "One species benefits, the other is essentially unaffected."],
      ["Parasitism", "One species benefits at the host's expense."]
    ],
    hook: "Mutual = both win, commensal = one wins, parasite = one wins at a cost.",
    sources: [
      { label: "Smithsonian Ocean — symbiosis and relationships", url: "https://ocean.si.edu/" },
      { label: "NOAA — corals and their algae (mutualism)", url: "https://oceanservice.noaa.gov/education/tutorial_corals/coral02_zooxanthellae.html" }
    ],
    quiz: [
      { type: "mc", q: "A relationship where both species benefit is called:", choices: ["Parasitism", "Commensalism", "Mutualism", "Predation"], answer: 2, why: "Mutualism benefits both partners — as with clownfish and their anemone." },
      { type: "mc", q: "Cleaner wrasse removing parasites from larger fish is an example of:", choices: ["Competition", "Mutualism", "Parasitism", "Predation"], answer: 1, why: "The cleaner is fed and the client is freed of parasites — both benefit." },
      { type: "tf", q: "Parasitism is considered a type of symbiosis.", answer: true, why: "Symbiosis covers all close, long-term relationships, including parasitism and commensalism." }
    ]
  }

});
