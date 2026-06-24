/* SeaHype lesson batch: Ocean Habitats + Adaptation & Physiology.
   Plain data merged at build time. Facts drawn from established marine-biology
   references; figures spot-checked. Sources point to authoritative orgs. */
window.__SEA_LESSONS__ = Object.assign(window.__SEA_LESSONS__ || {}, {

  /* ===================== HABITATS ===================== */

  "intertidal": {
    title: "The intertidal: life between the tides",
    track: "habitats", level: "Core", src: "noaa", time: 6,
    explain: [
      "The intertidal zone, also called the littoral zone, is the strip of shore covered at high tide and bare at low tide. Twice a day it flips between underwater and open air. So the animals and seaweeds living there face some of the harshest, fastest-changing conditions in the sea. They deal with drying out, baking sun, freezing or overheating, crashing waves, and big swings in saltiness from rain or shrinking pools.",
      "The stresses change with how high you are on the shore. Because of this, intertidal life sorts into visible horizontal bands, a pattern called zonation. The high zone gets only splash and spray, so tough, drought-resistant species live there. The middle zone is home to barnacles and mussels. The low zone, rarely exposed, holds seaweeds, anemones, and more delicate animals. Physical stress sets the top edge of each band, while competition and predators set the bottom edge.",
      "Shores come in three broad types. Rocky shores hold the richest, most studied communities, with animals clinging tight against the surf. Sandy beaches keep shifting, so animals burrow into them. Mudflats, and the salt marshes behind them, trap fine sediment and act as nurseries for many fish and birds."
    ],
    why: "The intertidal is the most accessible marine habitat for study and a classic natural laboratory for ecology — zonation, competition and disturbance were all worked out here.",
    misconception: "Tide pools are not calm refuges; their temperature, oxygen and salinity can swing wildly over a single low tide.",
    terms: [
      ["Intertidal zone", "The shore between the highest and lowest tide lines, alternately submerged and exposed."],
      ["Zonation", "Banding of organisms by height on the shore in response to stress and competition."],
      ["Desiccation", "Drying out — a key danger for intertidal life when the tide is out."]
    ],
    hook: "Physical stress sets the top of each band; biology (competition, predators) sets the bottom.",
    sources: [
      { label: "NOAA — tides and the intertidal", url: "https://oceanservice.noaa.gov/education/tutorial_tides/" },
      { label: "Smithsonian Ocean — shores and coasts", url: "https://ocean.si.edu/" }
    ],
    quiz: [
      { type: "mc", q: "The intertidal zone is the part of the shore that is:", choices: ["Always underwater", "Covered at high tide and exposed at low tide", "Never reached by waves", "Below 200 m"], answer: 1, why: "It alternates between submerged and exposed as the tide rises and falls." },
      { type: "mc", q: "The horizontal banding of intertidal organisms is called:", choices: ["Stratification", "Zonation", "Migration", "Succession"], answer: 1, why: "Zonation reflects different tolerances to exposure and different competitive pressures up the shore." },
      { type: "tf", q: "On a rocky shore, physical stress generally sets the upper limit of a species' band and competition or predation sets the lower limit.", answer: true, why: "This classic pattern was established by experiments on rocky shores." }
    ]
  },

  "estuaries": {
    title: "Estuaries: where rivers meet the sea",
    track: "habitats", level: "Core", src: "noaa", time: 6,
    explain: [
      "An estuary is a partly enclosed coastal area where fresh water from rivers mixes with salt water from the ocean. The mix makes brackish water, which is a little salty. Its saltiness rises and falls with the tides and the seasons. Bays, lagoons, sounds, and river mouths are all kinds of estuaries.",
      "Estuaries are among the most productive places on Earth. Rivers bring nutrients, sunlight reaches the shallow water, and tides stir it all together. This fuels thick growth of plankton, marsh grasses, and algae. All that food supports huge numbers of animals. Many important fish and shellfish use estuaries as nurseries. These are safe places to lay eggs and grow before heading out to sea.",
      "Living in an estuary means handling salt levels that keep changing. Species that do well here are called euryhaline, which means they can handle a wide range of saltiness. Many can adjust their bodies as the water turns fresher or saltier around them. Estuaries also protect the coast. They filter runoff and soak up storm energy. That makes them both valuable and easy to harm."
    ],
    why: "A large share of fished species depend on estuaries as nurseries, so estuary health ties directly to coastal economies and food.",
    misconception: "Estuaries are not simply 'where a river ends'; they are dynamic mixing zones with their own tides, chemistry and specialized life.",
    terms: [
      ["Estuary", "A coastal zone where river fresh water mixes with ocean salt water."],
      ["Brackish", "Water of intermediate salinity, between fresh and full-strength seawater."],
      ["Euryhaline", "Able to tolerate a wide range of salinities."]
    ],
    hook: "Rivers + tides + sunlight in shallow water = a nursery and one of Earth's most productive habitats.",
    sources: [
      { label: "NOAA — what is an estuary", url: "https://oceanservice.noaa.gov/facts/estuary.html" },
      { label: "NOAA Education — estuaries tutorial", url: "https://oceanservice.noaa.gov/education/tutorial_estuaries/" }
    ],
    quiz: [
      { type: "mc", q: "Brackish water in an estuary is:", choices: ["Pure fresh water", "A mix of fresh and salt water", "Saltier than the open ocean", "Free of dissolved minerals"], answer: 1, why: "Estuaries form where river fresh water blends with ocean salt water." },
      { type: "tf", q: "Many commercially important fish use estuaries as nurseries.", answer: true, why: "Sheltered, food-rich estuaries are vital nursery grounds for fish and shellfish." },
      { type: "mc", q: "An animal that tolerates a wide range of salinity is described as:", choices: ["Stenohaline", "Euryhaline", "Anaerobic", "Benthic"], answer: 1, why: "Euryhaline species handle the shifting salt levels typical of estuaries." }
    ]
  },

  "mangroves-seagrass": {
    title: "Mangroves and seagrass meadows",
    track: "habitats", level: "Core", src: "si", time: 6,
    explain: [
      "Mangroves are trees and shrubs that can handle salt. They grow along calm, warm coasts, rooted in muddy ground that floods with the tides. They have special parts that help them survive: stilt-like roots that prop them up, roots that poke up to breathe air, and ways to block or get rid of salt. Their tangled roots trap mud, shelter young fish and other small animals, and protect the shore from storms and washing away.",
      "Seagrasses are not seaweeds. They are true flowering plants that moved back into the sea. They take root in soft ground in clear, shallow water and form underwater meadows. They make oxygen and hold the bottom in place. They feed grazers like green turtles, manatees, and dugongs. They also act as a nursery where many young animals grow up.",
      "Both habitats are strong 'blue carbon' systems. They bury and store lots of carbon in their wet soils, far more than you would expect for their small size. That makes mangroves and seagrasses matter not just for wildlife and shore safety, but for the climate too. When they are destroyed, that stored carbon escapes back into the air."
    ],
    why: "Mangroves and seagrasses punch far above their size in nursery value, coastal defense and carbon storage, making their conservation a priority.",
    misconception: "Seagrasses are flowering plants, not algae or true grasses — they have roots, flowers and seeds.",
    terms: [
      ["Mangrove", "A salt-tolerant tree of sheltered tropical coasts, rooted in intertidal mud."],
      ["Seagrass", "A marine flowering plant forming rooted underwater meadows in shallow water."],
      ["Blue carbon", "Carbon captured and stored by coastal and marine ecosystems such as mangroves, seagrasses and salt marshes."]
    ],
    hook: "Mangroves above the mud, seagrass meadows below it — both are nurseries and blue-carbon vaults.",
    sources: [
      { label: "Smithsonian Ocean — mangroves and seagrass", url: "https://ocean.si.edu/ocean-life/plants-algae/mangroves" },
      { label: "NOAA — seagrasses and habitat", url: "https://oceanservice.noaa.gov/facts/seagrass.html" }
    ],
    quiz: [
      { type: "mc", q: "Seagrasses are best described as:", choices: ["A type of seaweed", "Marine flowering plants", "Colonial animals", "Coral relatives"], answer: 1, why: "Seagrasses are true flowering plants with roots, flowers and seeds, not algae." },
      { type: "tf", q: "Mangroves and seagrasses store large amounts of 'blue carbon' in their sediments.", answer: true, why: "Their waterlogged soils bury carbon efficiently, giving them outsized climate value." },
      { type: "mc", q: "A key role both mangroves and seagrass meadows share is:", choices: ["Producing oil", "Serving as nurseries for marine life", "Generating tides", "Forming coral skeletons"], answer: 1, why: "Both provide sheltered nursery habitat in addition to protecting coasts." }
    ]
  },

  "kelp": {
    title: "Kelp forests of the cool seas",
    track: "habitats", level: "Core", src: "noaa", time: 6,
    explain: [
      "Kelp are large brown algae. They grow in cool coastal waters that are full of nutrients, mostly in temperate and polar regions. A root-like part called a holdfast anchors kelp to rock. Gas-filled floats keep it upright. The biggest kinds, like giant kelp, form towering underwater forests that reach the surface. In good conditions, they can grow amazingly fast.",
      "Like trees on land, kelp build habitat with height and structure. Their canopies, stalks, and holdfasts give fish, invertebrates, and other algae places to hide and grow on. This supports far more life than bare rock would. Kelp also pull in carbon dioxide as they photosynthesize.",
      "Kelp forests show how just a few species can control an ecosystem. Sea urchins eat kelp. Their predators include sea otters in the North Pacific and sea stars in other places. When those predators are removed, urchin numbers explode. The urchins can mow a lush forest down to bare rock called an 'urchin barren.' Bringing the predators back can let the forest recover. This is a clear example of keystone species and trophic cascades."
    ],
    why: "Kelp forests show how predators, grazers and producers are linked: lose a keystone predator and the whole forest can collapse.",
    misconception: "Kelp is not a plant; it is a large brown alga, and it attaches by a holdfast rather than absorbing nutrients through true roots.",
    terms: [
      ["Kelp", "A large brown alga that forms underwater forests in cool, nutrient-rich seas."],
      ["Holdfast", "The root-like structure that anchors kelp to rock (it does not absorb nutrients)."],
      ["Urchin barren", "A reef stripped of kelp by overgrazing sea urchins after predators are lost."]
    ],
    hook: "Otters eat urchins, urchins eat kelp — remove the otter and the forest becomes a barren.",
    sources: [
      { label: "NOAA — kelp forests", url: "https://oceanservice.noaa.gov/facts/kelp.html" },
      { label: "Smithsonian Ocean — kelp forest habitat", url: "https://ocean.si.edu/ocean-life/plants-algae/kelp-forests" }
    ],
    quiz: [
      { type: "mc", q: "Kelp is classified as:", choices: ["A flowering plant", "A large brown alga", "A coral", "A bacterium"], answer: 1, why: "Kelp are brown algae, not plants, and they anchor with a holdfast rather than roots." },
      { type: "mc", q: "An 'urchin barren' forms when:", choices: ["Kelp grows too fast", "Predators of urchins are lost and urchins overgraze the kelp", "The water gets too cold", "Otters eat all the kelp"], answer: 1, why: "Without predators, urchin populations explode and strip the kelp." },
      { type: "tf", q: "Kelp forests build three-dimensional habitat much as trees do on land.", answer: true, why: "Canopies, stalks and holdfasts shelter a rich community of marine life." }
    ]
  },

  "coral-reefs": {
    title: "Coral reefs: the rainforests of the sea",
    track: "habitats", level: "Core", src: "coral", time: 7,
    explain: [
      "A coral reef is a living limestone structure. It is built over hundreds of years by colonies of tiny animals called stony corals. Each coral polyp makes a hard skeleton out of calcium carbonate. Layer after layer of these skeletons cement together into the reef. Reef-building corals live in warm, clear, sunny, shallow tropical seas. They need tiny algae called zooxanthellae living inside them, because these algae make most of their food.",
      "Reefs cover well under one percent of the ocean floor. Even so, they are home to about a quarter of all ocean species. That is why people call them the rainforests of the sea. They also guard coastlines from waves and storms. And they support fishing and tourism for hundreds of millions of people.",
      "Reefs grow in three classic shapes, first explained by Charles Darwin. Fringing reefs hug the shore. Barrier reefs are separated from land by a lagoon. Ring-shaped atolls circle a lagoon where an island has slowly sunk. When the water gets too warm, corals push out their algae and turn white. This is called coral bleaching. If the stress lasts too long, the corals can starve."
    ],
    why: "Reefs concentrate a huge share of marine biodiversity and protect coasts, yet they are acutely sensitive to warming and acidification.",
    misconception: "Coral is an animal, not a rock or a plant — the 'rock' is the limestone skeleton it builds, and its color often comes from algae living inside it.",
    terms: [
      ["Coral polyp", "The individual cnidarian animal that builds a coral colony."],
      ["Zooxanthellae", "Photosynthetic algae living inside coral tissue that supply most of the coral's food."],
      ["Atoll", "A ring-shaped reef enclosing a lagoon, formed as a volcanic island subsides."],
      ["Coral bleaching", "Loss of symbiotic algae under stress (often heat), turning coral white."]
    ],
    hook: "Fringing, barrier, atoll — Darwin's three reef forms; heat makes coral bleach white.",
    sources: [
      { label: "NOAA — coral reef ecosystems", url: "https://coralreef.noaa.gov/" },
      { label: "NOAA — how reefs are built (tutorial)", url: "https://oceanservice.noaa.gov/education/tutorial_corals/" }
    ],
    quiz: [
      { type: "mc", q: "Reef-building corals get most of their food from:", choices: ["Filtering plankton only", "Symbiotic algae (zooxanthellae) in their tissues", "Their limestone skeleton", "Sunlight directly"], answer: 1, why: "Photosynthetic zooxanthellae supply most of the coral's energy, which is why reefs need clear, sunlit water." },
      { type: "mc", q: "A ring-shaped reef surrounding a lagoon is a:", choices: ["Fringing reef", "Barrier reef", "Atoll", "Patch reef"], answer: 2, why: "Atolls form as a volcanic island subsides beneath a growing reef." },
      { type: "tf", q: "Coral bleaching is caused by corals expelling their symbiotic algae under stress such as heat.", answer: true, why: "Without the algae the coral loses color and its main food source." }
    ]
  },

  "open-ocean": {
    title: "The open ocean: Earth's largest habitat",
    track: "habitats", level: "Core", src: "si", time: 6,
    explain: [
      "The open ocean, or pelagic realm, is the huge volume of water away from the coast and the bottom. It is by far the largest living space on the planet. Yet to the eye it can look empty. There is nowhere to hide, and away from the surface there is little to eat. Life here is spread thin and often built for travel.",
      "Everything in the open ocean depends on the sunlit surface layer. There, drifting phytoplankton turn sunlight into food. Tiny grazing plankton eat the phytoplankton. Small fish eat the grazers. Larger predators like tuna, sharks, billfish, dolphins, and whales roam widely to find them. Many open-ocean animals are strong swimmers, called the nekton, that can make long migrations.",
      "Each day, the open ocean hosts the largest animal migration on Earth. At dusk, countless small animals rise toward the surface to feed under cover of darkness. By day, they sink back to the dim depths. This daily trip, called diel vertical migration, moves food and carbon between the surface and the deep. It is a defining rhythm of the open ocean."
    ],
    why: "The pelagic realm is the planet's biggest habitat and the highway for the largest fisheries and the greatest animal migrations.",
    misconception: "The open ocean is not lifeless; its life is simply thinly spread and dependent on the productivity of the sunlit surface.",
    terms: [
      ["Pelagic", "Of the open water column, away from the coast and the bottom."],
      ["Nekton", "Animals that swim strongly enough to move independently of currents (fish, squid, whales)."],
      ["Diel vertical migration", "The daily up-at-night, down-by-day movement of plankton and small animals."]
    ],
    hook: "Sunlit surface feeds it all; at dusk the deep rises to eat — the planet's biggest daily commute.",
    sources: [
      { label: "Smithsonian Ocean — the open ocean", url: "https://ocean.si.edu/ecosystems/open-ocean/open-ocean" },
      { label: "NOAA — ocean zones and the water column", url: "https://oceanservice.noaa.gov/facts/light_travel.html" }
    ],
    quiz: [
      { type: "mc", q: "The open-ocean food web is ultimately based on:", choices: ["Seafloor bacteria", "Phytoplankton in the sunlit surface", "River nutrients", "Coral algae"], answer: 1, why: "Surface phytoplankton are the primary producers that feed the pelagic realm." },
      { type: "mc", q: "Strong-swimming animals like tuna and whales are collectively called:", choices: ["Plankton", "Nekton", "Benthos", "Producers"], answer: 1, why: "Nekton can swim against currents, unlike drifting plankton." },
      { type: "tf", q: "Diel vertical migration is the daily movement of small animals up to the surface at night and down by day.", answer: true, why: "It is considered the largest animal migration on Earth, repeated every day." }
    ]
  },

  "deep-sea": {
    title: "The deep sea: cold, dark, and under pressure",
    track: "habitats", level: "Advanced", src: "noaaoe", time: 7,
    explain: [
      "Below about 200 meters, sunlight fades to black. The deep sea is the largest habitat on Earth by volume. It is cold, always dark, and squeezed by huge pressure. That pressure rises by about one atmosphere for every 10 meters you go down. Food is hard to find, so deep-sea animals are often slow, long-lived, and good at saving energy. Many have huge mouths, stomachs that can stretch, and body parts that make light.",
      "There is no sunlight for photosynthesis down here. So most of the deep sea runs on 'marine snow.' This is a slow fall of dead plankton, droppings, and other bits drifting down from the busy surface above. This thin, steady rain feeds filter feeders, scavengers, and the animals on the seafloor.",
      "Some deep-sea communities do not depend on that rain at all. At hydrothermal vents and cold seeps, microbes use chemosynthesis. They get energy from chemicals like hydrogen sulfide instead of sunlight. These microbes feed packed oases of tubeworms, clams, and shrimp. Scientists found these communities only in 1977. They proved that lots of life can thrive with no sunlight at all."
    ],
    why: "The deep sea is most of the biosphere by volume and home to chemosynthetic ecosystems that rewrote our understanding of where life is possible.",
    misconception: "The deep sea is not empty or uniform; it holds diverse communities, and vent ecosystems are powered by chemicals rather than sunlight.",
    terms: [
      ["Marine snow", "The slow fall of organic particles from the surface that feeds much of the deep sea."],
      ["Chemosynthesis", "Making food from chemical energy (e.g. hydrogen sulfide) rather than sunlight."],
      ["Hydrothermal vent", "A seafloor hot spring where chemosynthetic communities thrive."]
    ],
    hook: "No light, so no photosynthesis — the deep runs on marine snow and, at vents, on chemistry.",
    sources: [
      { label: "NOAA Ocean Exploration — the deep ocean", url: "https://oceanexplorer.noaa.gov/facts/midwater-zone.html" },
      { label: "MBARI — deep-sea research", url: "https://www.mbari.org/" }
    ],
    quiz: [
      { type: "mc", q: "Pressure in the ocean increases by about one atmosphere for every:", choices: ["1 meter of depth", "10 meters of depth", "100 meters of depth", "1,000 meters of depth"], answer: 1, why: "Roughly one atmosphere is added every 10 m, so the deep sea is under crushing pressure." },
      { type: "mc", q: "Hydrothermal vent communities are powered mainly by:", choices: ["Photosynthesis", "Marine snow", "Chemosynthesis", "Tidal energy"], answer: 2, why: "Vent microbes use chemical energy such as hydrogen sulfide, not sunlight." },
      { type: "tf", q: "'Marine snow' is the fall of organic particles from the surface that feeds much of the deep sea.", answer: true, why: "It is the main food supply where no sunlight reaches." }
    ]
  },

  "polar-seas": {
    title: "Polar seas and the power of ice",
    track: "habitats", level: "Advanced", src: "nasa", time: 6,
    explain: [
      "The cold seas around the poles are the Arctic Ocean in the north and the Southern Ocean around Antarctica. Above all, they are shaped by sea ice that forms in winter and melts in summer. Cold water holds more dissolved oxygen. Where it is also full of nutrients, it can be amazingly productive, even in such harsh conditions.",
      "Sea ice is a habitat itself. Algae grow inside and beneath the ice. When the ice melts and sunlight floods back each spring, these algae and other phytoplankton bloom explosively. In the Southern Ocean, that bloom feeds huge swarms of Antarctic krill. These small, shrimp-like animals are the key link to penguins, seals, seabirds, and the great baleen whales.",
      "Polar animals survive the cold in several ways. They use thick blubber, dense fur or feathers, and, in some fishes, antifreeze chemicals in their blood. They also time their lives to the brief, intense summer. So much of the food web depends on when and how much sea ice forms. That makes polar seas especially sensitive to a warming climate."
    ],
    why: "Polar food webs hinge on sea ice and seasonal blooms, making them productive, distinctive, and highly vulnerable to warming.",
    misconception: "Cold polar water is not barren; cold water holds more oxygen and, with nutrients and summer light, supports enormous seasonal productivity.",
    terms: [
      ["Sea ice", "Frozen seawater that forms and melts seasonally and serves as a habitat for ice algae."],
      ["Krill", "Small shrimp-like crustaceans; Antarctic krill are a keystone of the Southern Ocean food web."],
      ["Ice algae", "Algae that grow within and beneath sea ice, fueling spring blooms when ice melts."]
    ],
    hook: "Ice melts, light returns, algae bloom, krill swarm — and the whole polar web follows.",
    sources: [
      { label: "NASA Earth Observatory — sea ice and polar oceans", url: "https://earthobservatory.nasa.gov/" },
      { label: "NOAA — Arctic and polar oceans", url: "https://www.noaa.gov/education/resource-collections/ocean-coasts/arctic-ocean" }
    ],
    quiz: [
      { type: "mc", q: "Antarctic krill are important because they:", choices: ["Build coral reefs", "Link the Southern Ocean's algae to penguins, seals and whales", "Live only in the deep sea", "Photosynthesize"], answer: 1, why: "Krill are the keystone grazers that transfer energy up the Antarctic food web." },
      { type: "tf", q: "Cold polar water can hold more dissolved oxygen than warm water.", answer: true, why: "Gas solubility rises as temperature falls, so cold seas can be oxygen-rich." },
      { type: "mc", q: "Polar food webs are especially sensitive to warming because they depend on:", choices: ["Coral health", "The timing and extent of sea ice", "River runoff", "Deep-sea vents"], answer: 1, why: "Sea ice controls the ice algae and seasonal blooms the whole web relies on." }
    ]
  },

  /* ===================== PHYSIOLOGY ===================== */

  "osmoregulation": {
    title: "Staying balanced: salt and water in the body",
    track: "physiology", level: "Advanced", src: "si", time: 7,
    explain: [
      "Every ocean animal faces the same problem with salt and water. Water naturally moves toward where salt is more concentrated. This movement is called osmosis. Salt tends to drift the other way. Keeping the right balance of salt and water inside the body is called osmoregulation. Different animals solve this in very different ways.",
      "A bony sea fish is less salty inside than the ocean around it. Because of this, it keeps losing water and could dry out. To fix this, it drinks seawater. Then special cells in its gills, along with its kidneys, pump the extra salt back out. A freshwater fish has the opposite problem: water floods into its body. So it barely drinks and makes lots of watery urine.",
      "Sharks and rays do it another way. They keep a chemical called urea in their blood. This makes their insides nearly as salty as the sea, so they do not keep losing water. Sea mammals, reptiles, and seabirds use very strong kidneys instead. Many also have special glands that get rid of the extra salt they take in."
    ],
    why: "Osmoregulation explains why marine and freshwater fish behave so differently and why most species are restricted to a particular salinity range.",
    misconception: "Marine bony fish do not avoid drinking; they drink seawater constantly and work hard to excrete the salt.",
    terms: [
      ["Osmosis", "The movement of water across a membrane toward higher salt concentration."],
      ["Osmoregulation", "Controlling the balance of salt and water in the body."],
      ["Urea retention", "The shark strategy of holding urea in the blood to match seawater concentration."]
    ],
    hook: "Bony fish drink and pump salt out; sharks store urea; both fight the same osmotic tug-of-war.",
    sources: [
      { label: "Smithsonian Ocean — how marine animals survive", url: "https://ocean.si.edu/" },
      { label: "NOAA — ocean salinity", url: "https://oceanservice.noaa.gov/facts/whysalty.html" }
    ],
    quiz: [
      { type: "mc", q: "A bony marine fish, being less salty than seawater, tends to:", choices: ["Gain water and rarely drink", "Lose water and must drink seawater", "Stay perfectly balanced with no effort", "Absorb salt through its skin on purpose"], answer: 1, why: "It loses water to the sea, so it drinks seawater and excretes the excess salt." },
      { type: "mc", q: "Sharks reduce water loss to the sea mainly by:", choices: ["Drinking huge amounts of water", "Retaining urea to match seawater concentration", "Sealing their gills", "Living only in fresh water"], answer: 1, why: "Retained urea keeps their internal concentration close to that of seawater." },
      { type: "tf", q: "Controlling the body's balance of salt and water is called osmoregulation.", answer: true, why: "It is a central physiological challenge for all aquatic animals." }
    ]
  },

  "buoyancy-gas": {
    title: "Buoyancy, gas, and the diving problem",
    track: "physiology", level: "Advanced", src: "si", time: 7,
    explain: [
      "Staying at a chosen depth without constant effort is hard. Flesh and bone are denser than water, so they tend to sink. Many bony fish solve this with a swim bladder, a gas-filled sac. They adjust how much gas is in it to hover weightlessly. Sharks have no swim bladder. Instead they rely on a large, oil-rich liver, since oil is lighter than water, plus lift from swimming and their fins.",
      "Gas under pressure causes its own problems. As an animal goes down, the rising pressure squeezes any gas in its body. As it rises, that gas expands. A fish pulled up too fast can suffer a burst or over-stretched swim bladder. The same physics is why scuba divers must come up slowly.",
      "Air-breathing divers like whales and seals handle gases cleverly to avoid 'the bends,' or decompression sickness. Many breathe out before diving, and their lungs collapse under pressure. This limits how much gas dissolves into the blood. They also store lots of oxygen in their muscles using a protein called myoglobin. This lets them stay down far longer than their lungs alone would allow."
    ],
    why: "Buoyancy control and gas management determine how animals occupy the water column and how deep diving air-breathers can safely go.",
    misconception: "Diving mammals do not simply hold a big breath of air; many exhale and rely on oxygen stored in blood and muscle, partly to avoid the bends.",
    terms: [
      ["Swim bladder", "A gas-filled organ many bony fish use to control buoyancy."],
      ["Myoglobin", "An oxygen-storing protein abundant in the muscles of diving mammals."],
      ["Decompression sickness", "'The bends' — harm from dissolved gas coming out of solution during a fast ascent."]
    ],
    hook: "Bony fish use a gas bladder; sharks use an oily liver; whales exhale and store oxygen in muscle.",
    sources: [
      { label: "Smithsonian Ocean — adaptations of marine animals", url: "https://ocean.si.edu/" },
      { label: "NOAA — how animals dive and the role of pressure", url: "https://oceanexplorer.noaa.gov/facts/light_travel.html" }
    ],
    quiz: [
      { type: "mc", q: "Sharks stay buoyant largely because of:", choices: ["A gas-filled swim bladder", "A large, oil-rich liver and lift from swimming", "Hollow bones", "Air sacs like birds"], answer: 1, why: "Lacking a swim bladder, sharks use a lighter-than-water oily liver plus dynamic lift." },
      { type: "mc", q: "Diving mammals reduce the risk of 'the bends' partly by:", choices: ["Taking the deepest possible breath", "Exhaling and allowing their lungs to collapse under pressure", "Diving as fast as possible", "Breathing through gills"], answer: 1, why: "Collapsing lungs limit how much gas dissolves into the blood during a deep dive." },
      { type: "tf", q: "Myoglobin lets diving mammals store extra oxygen in their muscles.", answer: true, why: "High muscle myoglobin extends dive time beyond what lung air alone would permit." }
    ]
  },

  "light-biolum": {
    title: "Living light: bioluminescence",
    track: "physiology", level: "Advanced", src: "noaaoe", time: 6,
    explain: [
      "Bioluminescence is light made by living things through a chemical reaction. Usually a molecule called luciferin reacts with oxygen, helped by an enzyme called luciferase. The result is 'cold light': almost all light and very little heat. In the ocean it is mostly blue-green, the color that travels best through seawater.",
      "It is also very common in the sea. In the open ocean and the deep, most animals can make light, far more than on land. Some make their own chemistry for it. Others host light-making bacteria in special organs and basically farm their glow.",
      "Animals use living light in many ways. One trick is counterillumination: glowing softly on the belly to match the dim light from above. This erases the animal's shadow from predators looking up. Anglerfish dangle a glowing lure to draw prey close. A startled animal may flash to confuse an attacker, light up to find a mate, or release a glowing cloud as a decoy while it escapes."
    ],
    why: "In a world that is dark over most of its volume, self-made light is a primary tool for hunting, hiding, communicating and mating.",
    misconception: "Bioluminescence is not the same as fluorescence: it is light generated by a chemical reaction in the organism, not light absorbed and re-emitted.",
    terms: [
      ["Bioluminescence", "Light produced by a living organism through a chemical reaction."],
      ["Luciferin / luciferase", "The light-producing molecule and the enzyme that drives the reaction."],
      ["Counterillumination", "Glowing on the underside to match downwelling light and erase one's silhouette."]
    ],
    hook: "Cold blue-green light: lure prey, erase your shadow, blind a predator, or find a mate.",
    sources: [
      { label: "NOAA — what is bioluminescence", url: "https://oceanexplorer.noaa.gov/facts/biolum.html" },
      { label: "Smithsonian Ocean — bioluminescence", url: "https://ocean.si.edu/ocean-life/fish/bioluminescence" }
    ],
    quiz: [
      { type: "mc", q: "Bioluminescence in the ocean is most often what color?", choices: ["Red", "Blue-green", "Yellow", "Violet"], answer: 1, why: "Blue-green light travels farthest through seawater, so most marine light is that color." },
      { type: "mc", q: "Glowing on the belly to match the light from above and hide your silhouette is called:", choices: ["Counterillumination", "Fluorescence", "Camouflage molting", "Phototaxis"], answer: 0, why: "Counterillumination cancels the animal's shadow as seen from below." },
      { type: "tf", q: "Bioluminescence is produced by a chemical reaction inside the organism, often involving luciferin and luciferase.", answer: true, why: "It is generated light, distinct from fluorescence, which only re-emits absorbed light." }
    ]
  },

  "senses-movement": {
    title: "Senses and movement underwater",
    track: "physiology", level: "Advanced", src: "si", time: 6,
    explain: [
      "Water carries information very differently than air does. So ocean animals use senses we rarely think about. Fish have a lateral line. It is a row of tiny sensors along the body that feels water moving and pressure changing. This lets a fish sense currents, objects, and other animals nearby. It also helps a whole school turn at the same time.",
      "Sharks and rays have an extra sense called electroreception. Jelly-filled pores on their snouts, called the ampullae of Lorenzini, feel the weak electric fields made by living muscles. This lets a shark find prey hidden in sand or in the dark. Toothed whales and dolphins use echolocation. They send out clicks and listen to the echoes to build a sound picture of what is around them. Sound travels far and fast in water, so hearing is a top sense in the sea.",
      "Moving through thick, heavy water also takes special tricks. Fish and sea mammals swim by waving their body and tail, steering with fins or flippers. Squid and octopuses can shoot forward by squirting water out through a tube called a siphon. The tiniest plankton just drift, beating tiny hairs or limbs. The fastest swimmers have smooth, streamlined shapes that slip through the water more easily."
    ],
    why: "Underwater senses like the lateral line, electroreception and echolocation explain how marine animals hunt and navigate where sight is limited.",
    misconception: "Vision is often secondary in the sea; many animals rely more on water motion, electric fields or sound than on their eyes.",
    terms: [
      ["Lateral line", "A row of sensors along a fish that detects water movement and pressure changes."],
      ["Ampullae of Lorenzini", "Electricity-sensing organs in sharks and rays that detect prey's electric fields."],
      ["Echolocation", "Using emitted sound and its echoes to sense surroundings, as toothed whales do."]
    ],
    hook: "Feel the water (lateral line), sense electricity (sharks), see with sound (dolphins).",
    sources: [
      { label: "Smithsonian Ocean — senses in the sea", url: "https://ocean.si.edu/ocean-life/sharks-rays" },
      { label: "NOAA Fisheries — how marine mammals use sound", url: "https://www.fisheries.noaa.gov/national/science-data/ocean-noise" }
    ],
    quiz: [
      { type: "mc", q: "The lateral line lets a fish sense:", choices: ["Color", "Water movement and pressure changes", "Magnetic north only", "Temperature only"], answer: 1, why: "It detects motion and pressure in the water, aiding schooling and predator avoidance." },
      { type: "mc", q: "The ampullae of Lorenzini allow sharks to detect:", choices: ["Sound waves", "Electric fields from prey", "Light in the deep sea", "Salinity"], answer: 1, why: "These organs sense the faint electricity of living muscle, even through sand." },
      { type: "tf", q: "Toothed whales use echolocation, reading echoes of their own clicks to sense prey.", answer: true, why: "Sound travels far in water, making echolocation a powerful tool." }
    ]
  },

  "reproduction": {
    title: "Reproduction and life cycles in the sea",
    track: "physiology", level: "Advanced", src: "si", time: 6,
    explain: [
      "Many sea animals reproduce by broadcast spawning. They release eggs and sperm into the water, and fertilization happens outside the body. For this to work in a huge ocean, spawners time it together. They are often cued by the moon, tides, season, or temperature, so everyone releases at once. The famous mass coral spawning events work this way. Other animals fertilize inside the body and may lay eggs or give live birth.",
      "Many sea animals begin life as tiny drifting larvae that look nothing like the adult. These larvae float in the plankton, feeding and growing, sometimes for weeks. Then they settle and transform into the adult form, a change called metamorphosis. This larval stage is how slow or attached animals like corals, barnacles, and many fish spread to new places.",
      "Different species bet on their young in different ways. Some use a 'many cheap young' plan. They release millions of eggs and do nothing more, trusting that a few will survive. Others have few young but care for them a lot, raising each one's chances. Both plans, and everything in between, last because each fits a certain way of life."
    ],
    why: "Spawning timing, larval dispersal and parental investment shape population connectivity, recovery from disturbance, and how fisheries must be managed.",
    misconception: "External fertilization is not random luck; spawning is tightly synchronized by environmental cues so eggs and sperm actually meet.",
    terms: [
      ["Broadcast spawning", "Releasing eggs and sperm into the water for external fertilization."],
      ["Larva", "A tiny early life stage, often drifting in plankton, that differs from the adult."],
      ["Metamorphosis", "The transformation from larva to adult form, often at settlement."]
    ],
    hook: "Spawn in sync, drift as larvae, settle and transform — the classic marine life cycle.",
    sources: [
      { label: "Smithsonian Ocean — reproduction and life cycles", url: "https://ocean.si.edu/ocean-life/invertebrates/coral-spawning" },
      { label: "NOAA — fish life cycles and nurseries", url: "https://www.fisheries.noaa.gov/" }
    ],
    quiz: [
      { type: "mc", q: "Broadcast spawning means:", choices: ["Giving live birth", "Releasing eggs and sperm into the water for external fertilization", "Laying eggs in a nest", "Cloning"], answer: 1, why: "Eggs and sperm are shed into the water, so the event is synchronized to succeed." },
      { type: "mc", q: "Many marine animals disperse to new places mainly through their:", choices: ["Adult migrations only", "Drifting larval stage in the plankton", "Burrowing", "Symbiotic algae"], answer: 1, why: "Larvae drifting in the plankton spread even slow or attached species." },
      { type: "tf", q: "Some marine species produce millions of eggs with no parental care, while others have few, well-cared-for young.", answer: true, why: "Both reproductive strategies persist because each suits a different way of life." }
    ]
  }

});
