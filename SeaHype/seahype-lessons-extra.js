/* SeaHype lesson batch: Marine Life — a survey of the major groups,
   from microbes to mammals. Plain data merged at build time. */
window.__SEA_LESSONS__ = Object.assign(window.__SEA_LESSONS__ || {}, {

  "life-domains": {
    title: "The tree of marine life",
    track: "organisms", level: "Foundations", src: "eol", time: 6,
    explain: [
      "All living things fit into three big groups called domains. Two of them, Bacteria and Archaea, are tiny single cells with no nucleus (a nucleus is the part that holds a cell's DNA). The third, Eukarya, is made of living things whose cells do have a nucleus. That group includes protists, fungi, plants, and animals. The ocean has members of all three domains, and life almost certainly began in the sea.",
      "Animals are sorted into big groups called phyla. Each phylum shares a basic body plan. The ocean is full of them: sponges; cnidarians, like jellyfish and corals; molluscs, like snails, clams, and octopuses; arthropods, like crabs; echinoderms, like sea stars and urchins; many kinds of worms; and chordates, the group that includes all animals with a backbone.",
      "Scientists sort all this life from broad groups down to narrow ones: domain, kingdom, phylum, class, order, family, genus, and species. Each species also gets a two-part Latin name made from its genus and species. The great white shark, for example, is Carcharodon carcharias. This shared naming lets scientists everywhere talk about the exact same animal."
    ],
    why: "A mental map of the major groups is the framework on which every other fact about marine life hangs.",
    terms: [
      ["Domain", "The broadest division of life: Bacteria, Archaea, Eukarya."],
      ["Phylum", "A major group defined by a shared body plan (e.g. Mollusca, Chordata)."],
      ["Binomial name", "The two-part Latin name of a species (genus + species)."]
    ],
    hook: "Domain, kingdom, phylum, class, order, family, genus, species — broad to specific.",
    sources: [
      { label: "Encyclopedia of Life — the tree of life", url: "https://eol.org/" },
      { label: "WoRMS — marine taxonomy", url: "https://www.marinespecies.org/" }
    ],
    quiz: [
      { type: "mc", q: "The three domains of life are:", choices: ["Plants, animals, fungi", "Bacteria, Archaea, Eukarya", "Fish, invertebrates, mammals", "Producers, consumers, decomposers"], answer: 1, why: "Bacteria and Archaea lack a nucleus; Eukarya have one and include all animals and plants." },
      { type: "mc", q: "A species' two-part Latin name consists of its:", choices: ["Domain and kingdom", "Family and order", "Genus and species", "Class and phylum"], answer: 2, why: "The binomial system pairs the genus with the species name (e.g. Carcharodon carcharias)." },
      { type: "tf", q: "A phylum is a major group of organisms sharing a basic body plan.", answer: true, why: "Mollusca, Arthropoda, Echinodermata and Chordata are examples of animal phyla." }
    ]
  },

  "microbes": {
    title: "Marine microbes and viruses",
    track: "organisms", level: "Core", src: "whoi", time: 6,
    explain: [
      "The most common life in the ocean is too small to see. A single milliliter of seawater, about one-fifth of a teaspoon, can hold a million bacteria and ten million viruses. These microbes are not just along for the ride. They run the chemistry of the sea. They recycle carbon, nitrogen, and other nutrients, and they make much of the planet's oxygen.",
      "Among them, tiny cyanobacteria do a huge amount of photosynthesis. One kind, called Prochlorococcus, is smaller than most bacteria. It is one of the most common photosynthesizers on Earth and makes a real share of the world's oxygen. Other bacteria and archaea use chemosynthesis at vents and seeps, living where no sunlight reaches.",
      "Ocean viruses are the most numerous living things in the sea, and most of them infect bacteria. When they burst the cells they infect, they spill nutrients back into the water. Scientists call this the 'viral shunt.' It shapes which microbes thrive and how carbon flows through the whole ecosystem."
    ],
    why: "Microbes and viruses, though unseen, control nutrient cycling, oxygen production and the base of the food web.",
    misconception: "The ocean's oxygen does not come mainly from large plants or kelp; much of it comes from microscopic cyanobacteria and other phytoplankton.",
    terms: [
      ["Cyanobacteria", "Photosynthetic bacteria; major ocean oxygen producers (e.g. Prochlorococcus)."],
      ["Viral shunt", "Release of nutrients when viruses burst microbial hosts."]
    ],
    hook: "A million bacteria and ten million viruses in a single drop of seawater.",
    sources: [
      { label: "Woods Hole Oceanographic Institution — marine microbes", url: "https://www.whoi.edu/" },
      { label: "NOAA — how much oxygen comes from the ocean", url: "https://oceanservice.noaa.gov/facts/ocean-oxygen.html" }
    ],
    quiz: [
      { type: "mc", q: "The most numerous biological entities in the ocean are:", choices: ["Fish", "Whales", "Viruses", "Crabs"], answer: 2, why: "Marine viruses, mostly infecting bacteria, outnumber all other life by far." },
      { type: "mc", q: "Prochlorococcus is significant because it is:", choices: ["A large predatory fish", "An abundant photosynthetic microbe producing much oxygen", "A deep-sea worm", "A type of coral"], answer: 1, why: "This tiny cyanobacterium is among Earth's most abundant photosynthesizers." },
      { type: "tf", q: "A large fraction of Earth's oxygen is produced by microscopic ocean organisms.", answer: true, why: "Phytoplankton, including cyanobacteria, generate roughly half of atmospheric oxygen over time." }
    ]
  },

  "protists-algae": {
    title: "Protists and algae",
    track: "organisms", level: "Core", src: "mbari", time: 6,
    explain: [
      "Protists are living things with nucleus-holding cells that are not plants, animals, or fungi. The group covers an amazing variety of mostly single-celled life. In the plankton, two kinds of photosynthetic protists stand out. Diatoms are wrapped in fancy glassy shells made of silica. Dinoflagellates swim using whip-like tails called flagella. Together they are major primary producers and the base of many food webs.",
      "Other protists build shells that record ocean history. Foraminifera have shells of calcium carbonate, and radiolarians have skeletons of silica. After they die, they sink and pile up as soft deep-sea ooze. Their fossils help scientists figure out what past climates were like.",
      "Algae are living things that photosynthesize but are not true plants. The tiny ones are the phytoplankton. The large ones are the seaweeds. Seaweeds are sorted by color into green, red, and brown algae. The brown algae include the giant kelps, which form underwater forests. Some dinoflagellates can suddenly bloom into harmful 'red tides' that make poisons."
    ],
    why: "Protists and algae do much of the ocean's photosynthesis and leave a fossil record that lets us read past climates.",
    terms: [
      ["Diatom", "A single-celled alga with a glassy silica shell; a major primary producer."],
      ["Dinoflagellate", "A flagellated protist; some cause toxic red tides, some glow."],
      ["Macroalgae (seaweed)", "Multicellular algae grouped as green, red or brown."]
    ],
    hook: "Diatoms wear glass, forams wear chalk, kelp is a brown alga.",
    sources: [
      { label: "MBARI — plankton and protists", url: "https://www.mbari.org/" },
      { label: "NOAA — what is a harmful algal bloom (red tide)?", url: "https://oceanservice.noaa.gov/facts/redtide.html" }
    ],
    quiz: [
      { type: "mc", q: "Diatoms are notable for building shells out of:", choices: ["Calcium carbonate", "Glassy silica", "Chitin", "Cellulose"], answer: 1, why: "Diatoms encase themselves in intricate silica (glass) frustules." },
      { type: "mc", q: "Seaweeds (macroalgae) are grouped by color into:", choices: ["Black, white and gray", "Green, red and brown", "Hard and soft", "Warm and cold"], answer: 1, why: "Green, red and brown algae are the three macroalgal groups; kelps are brown." },
      { type: "tf", q: "Some dinoflagellates can multiply rapidly into toxic blooms called red tides.", answer: true, why: "Harmful algal blooms from certain dinoflagellates can produce potent toxins." }
    ]
  },

  "plants": {
    title: "Marine plants: seagrasses and mangroves",
    track: "organisms", level: "Core", src: "noaa", time: 5,
    explain: [
      "True flowering plants are rare in the sea, but the few that make it are mighty. Seagrasses are the only flowering plants that live fully underwater in seawater. They grow from roots in the seabed and form vast underwater meadows in shallow, sunny water. Despite the name, they are not seaweeds. They have roots, stems, flowers, and seeds.",
      "Mangroves are salt-tolerant trees and shrubs. They grow along warm coasts, in the zone between land and sea. They handle salt, low oxygen, and shifting tides using special roots. They also hold the shoreline together against waves and storms.",
      "Both habitats are nurseries and carbon stores. Seagrass meadows and mangrove forests shelter young fish, crabs, and shrimp. They also bury carbon in their sediments far faster, for their size, than most forests on land. This is part of what is called 'blue carbon.'"
    ],
    why: "Seagrasses and mangroves protect coasts, raise young marine life, and lock away carbon, making them priorities for conservation.",
    misconception: "Seagrasses are flowering plants, not seaweeds (which are algae).",
    terms: [
      ["Seagrass", "A submerged marine flowering plant that forms meadows on the seabed."],
      ["Mangrove", "A salt-tolerant coastal tree/shrub of tropical shorelines."],
      ["Blue carbon", "Carbon captured and stored by coastal marine ecosystems."]
    ],
    hook: "Seagrass flowers, seaweed does not — one is a plant, the other an alga.",
    sources: [
      { label: "NOAA — what is a seagrass / mangrove", url: "https://oceanservice.noaa.gov/facts/seagrass.html" },
      { label: "Smithsonian Ocean — mangroves and seagrasses", url: "https://ocean.si.edu/ocean-life/plants-algae/mangroves" }
    ],
    quiz: [
      { type: "mc", q: "Seagrasses are best described as:", choices: ["A type of seaweed", "Submerged marine flowering plants", "Coral animals", "Photosynthetic bacteria"], answer: 1, why: "They are true flowering plants with roots, stems, flowers and seeds." },
      { type: "mc", q: "'Blue carbon' refers to carbon stored by:", choices: ["Deep-sea trenches", "Coastal ecosystems like mangroves and seagrass", "Open-ocean currents", "Sea ice"], answer: 1, why: "Mangroves, seagrasses and salt marshes bury carbon rapidly in their sediments." },
      { type: "tf", q: "Mangroves are salt-tolerant trees that grow where land meets sea in the tropics.", answer: true, why: "Their specialized roots let them survive salt, tides and low-oxygen mud." }
    ]
  },

  "sponges-cnidarians": {
    title: "Sponges and cnidarians",
    track: "organisms", level: "Core", src: "si", time: 6,
    explain: [
      "Sponges are among the simplest animals. Their group is the phylum Porifera. They have no true tissues, organs, nerves, or muscles. They work like living filters. Water is pulled in through countless tiny holes, and special cells strain out bits of food. Even though they are simple, sponges are ancient and come in many kinds. They help build reefs and clean the water.",
      "Cnidarians make up the phylum Cnidaria. They include jellyfish, corals, sea anemones, and hydrozoans. They share a simple round body plan and a single opening for a gut. Their special feature is stinging cells called cnidocytes. These fire tiny harpoons, called nematocysts, to catch prey and defend themselves. Many switch between a swimming jellyfish stage and an attached polyp stage.",
      "Reef-building corals, also called stony corals, are colonies of cnidarian polyps. Each one makes a hard skeleton out of calcium carbonate. New corals build on the skeletons of old ones. Over thousands of years, these pile up into coral reefs. Reefs are the largest structures ever built by living things on Earth."
    ],
    why: "Cnidarians build coral reefs, the most biodiverse marine ecosystems, and their stinging cells are a textbook example of an animal innovation.",
    misconception: "Coral is an animal (a colony of cnidarian polyps), not a plant or a rock — though it builds a rocky skeleton.",
    terms: [
      ["Porifera", "Sponges — simple filter-feeding animals lacking true tissues."],
      ["Nematocyst", "The stinging harpoon fired by cnidarian stinging cells (cnidocytes)."],
      ["Polyp / medusa", "The attached and free-swimming body forms of cnidarians."]
    ],
    hook: "Sponges filter; cnidarians sting — and corals are colonies of tiny stinging animals.",
    sources: [
      { label: "Smithsonian Ocean — invertebrates (sponges, cnidarians)", url: "https://ocean.si.edu/ocean-life/invertebrates" },
      { label: "NOAA — coral anatomy and biology", url: "https://oceanservice.noaa.gov/education/tutorial_corals/coral01_intro.html" }
    ],
    quiz: [
      { type: "mc", q: "The defining feature of cnidarians is:", choices: ["A backbone", "Stinging cells with nematocysts", "Eight arms", "A silica skeleton"], answer: 1, why: "Cnidocytes firing nematocysts define the phylum Cnidaria." },
      { type: "mc", q: "Sponges feed by:", choices: ["Hunting fish", "Filtering particles from water drawn through their pores", "Photosynthesis only", "Grazing on kelp"], answer: 1, why: "Porifera are filter feeders with no true tissues, organs or muscles." },
      { type: "tf", q: "A coral reef is built mainly by colonial animals secreting calcium-carbonate skeletons.", answer: true, why: "Stony coral polyps lay down limestone that accumulates into reefs over millennia." }
    ]
  },

  "mollusks": {
    title: "Mollusks: snails, clams and cephalopods",
    track: "organisms", level: "Core", src: "eol", time: 6,
    explain: [
      "Molluscs are one of the largest animal groups, a phylum called Mollusca. They have a soft body, usually guarded by a shell made of calcium carbonate. Many also have a rough, scraping tongue called a radula. The ocean kinds include gastropods (snails and sea slugs), bivalves (clams, oysters, mussels, and scallops), chitons, and cephalopods.",
      "Bivalves have two shells joined by a hinge. Most are filter feeders. They pull in water and strain out plankton. As they do, beds of oysters and mussels clean huge amounts of coastal water. Gastropods are the most varied group. They range from grazing snails to sea slugs called nudibranchs in amazing colors. Some nudibranchs even steal stinging cells or chemicals from their prey to defend themselves.",
      "Cephalopods are the brainy ones. This group includes octopuses, squid, cuttlefish, and the chambered nautilus. They have the most complex brains of any animal without a backbone. They also have sharp eyesight, jet propulsion, and amazing camouflage. They can change their skin color and texture in an instant. The giant and colossal squids are the largest animals on Earth without a backbone."
    ],
    why: "Molluscs span filter-feeding water cleaners to the most intelligent invertebrates, and they are central to fisheries and food webs.",
    misconception: "An octopus is a mollusc — related to snails and clams — despite having no external shell.",
    terms: [
      ["Radula", "A rasping, tooth-covered feeding ribbon found in many molluscs."],
      ["Bivalve", "A mollusc with two hinged shells; most are filter feeders."],
      ["Cephalopod", "Octopus, squid, cuttlefish, nautilus — the most intelligent invertebrates."]
    ],
    hook: "Same phylum, wildly different brains: clams filter, octopuses solve puzzles.",
    sources: [
      { label: "Encyclopedia of Life — Mollusca", url: "https://eol.org/" },
      { label: "Smithsonian Ocean — cephalopods", url: "https://ocean.si.edu/ocean-life/invertebrates/cephalopods" }
    ],
    quiz: [
      { type: "mc", q: "Which of these is a cephalopod?", choices: ["Clam", "Octopus", "Sea star", "Barnacle"], answer: 1, why: "Octopuses, squid, cuttlefish and nautiluses are cephalopod molluscs." },
      { type: "mc", q: "Most bivalves (clams, oysters, mussels) feed by:", choices: ["Hunting prey", "Filtering plankton from water", "Photosynthesis", "Scraping algae with a radula"], answer: 1, why: "Bivalves are filter feeders and can clean large volumes of water." },
      { type: "tf", q: "Cephalopods have the most complex nervous systems of any invertebrate.", answer: true, why: "Octopuses and their relatives show advanced vision, learning and camouflage." }
    ]
  },

  "arthropods": {
    title: "Marine arthropods: the crustaceans",
    track: "organisms", level: "Core", src: "noaa", time: 6,
    explain: [
      "Arthropods are animals with jointed legs and a hard outer skeleton called an exoskeleton. They are the most numerous animals on Earth. In the sea, the main arthropods are the crustaceans. Crabs, lobsters, shrimp, barnacles, copepods, and krill all belong here. To grow, an arthropod must molt. This means it sheds its stiff shell and hardens a new, bigger one.",
      "The tiniest crustaceans matter the most. Copepods are grazers only about a millimeter long. They may be the most numerous animals on the planet. Antarctic krill form swarms so huge they feed whales, seals, penguins, and fish across the Southern Ocean. These small crustaceans are the key link that passes energy from phytoplankton up to large predators.",
      "Larger crustaceans support big fisheries. They also play key roles as scavengers and predators on the seafloor. Horseshoe crabs, despite the name, are not true crabs. They are ancient animals more closely related to spiders. They are living fossils that have barely changed for hundreds of millions of years."
    ],
    why: "Small crustaceans like copepods and krill are the keystone link feeding the largest animals in the sea.",
    misconception: "Horseshoe crabs are not crustaceans or true crabs; they are chelicerates, closer to spiders and scorpions.",
    terms: [
      ["Exoskeleton / molting", "A hard external skeleton that must be shed (molted) to grow."],
      ["Copepod", "A tiny, hugely abundant crustacean; a key grazer of phytoplankton."],
      ["Krill", "Shrimp-like crustaceans that swarm and feed whales, seals and penguins."]
    ],
    hook: "Krill feed the whales — the biggest animals run on some of the smallest.",
    sources: [
      { label: "NOAA Fisheries — krill and crustaceans", url: "https://www.fisheries.noaa.gov/" },
      { label: "Smithsonian Ocean — crustaceans", url: "https://ocean.si.edu/ocean-life/invertebrates/crabs-and-other-crustaceans" }
    ],
    quiz: [
      { type: "mc", q: "To grow, a crustacean must:", choices: ["Photosynthesize", "Molt its exoskeleton", "Migrate to deep water", "Shed its gills"], answer: 1, why: "A rigid exoskeleton cannot expand, so arthropods molt to grow larger." },
      { type: "mc", q: "Antarctic krill are ecologically vital because they:", choices: ["Build reefs", "Feed whales, seals, penguins and fish", "Produce most ocean oxygen", "Filter all coastal water"], answer: 1, why: "Krill swarms are the key prey supporting Southern Ocean predators." },
      { type: "tf", q: "Copepods are among the most abundant animals on Earth.", answer: true, why: "These tiny grazing crustaceans are extraordinarily numerous in the plankton." }
    ]
  },

  "echinoderms-worms": {
    title: "Echinoderms and marine worms",
    track: "organisms", level: "Core", src: "si", time: 6,
    explain: [
      "Echinoderms make up the phylum Echinodermata. They include sea stars, sea urchins, sand dollars, brittle stars, sea cucumbers, and feather stars. They are found only in the sea. As adults, their bodies have five matching parts arranged in a circle. They also have a special water vascular system. This is a network of water-filled tubes that works hundreds of tiny 'tube feet' for moving, gripping, and feeding.",
      "These animals have a big effect on their habitats. Sea urchins graze on algae. If nothing keeps them in check, they can mow kelp forests down to bare 'urchin barrens.' Many sea stars are important predators. Some eat lots of mussels, and the crown-of-thorns sea star eats coral. Sea cucumbers recycle seafloor sediment, working like marine earthworms.",
      "Marine worms belong to many different groups. The best-known are the segmented worms called annelids, especially the polychaetes. These bristle worms crawl, burrow, or build tubes everywhere from tide pools to hydrothermal vents. The giant tube worms at deep-sea vents have no gut at all. They are fed by chemosynthetic bacteria living inside them."
    ],
    why: "Echinoderms and worms shape the seafloor as grazers, predators, recyclers and the foundation of vent ecosystems.",
    terms: [
      ["Water vascular system", "An echinoderm's water-filled canals that power its tube feet."],
      ["Polychaete", "A segmented marine bristle worm (phylum Annelida)."],
      ["Urchin barren", "A seafloor stripped of kelp by overgrazing sea urchins."]
    ],
    hook: "Five-fold symmetry, tube feet, and a body run by seawater plumbing.",
    sources: [
      { label: "Smithsonian Ocean — sea stars and echinoderms", url: "https://ocean.si.edu/ocean-life/invertebrates/sea-stars-and-other-echinoderms" },
      { label: "NOAA Ocean Exploration — hydrothermal vent tube worms", url: "https://oceanexplorer.noaa.gov/" }
    ],
    quiz: [
      { type: "mc", q: "A feature unique to echinoderms is the:", choices: ["Backbone", "Water vascular system powering tube feet", "Stinging nematocyst", "External shell"], answer: 1, why: "Tube feet driven by a water vascular system are the echinoderm signature." },
      { type: "mc", q: "Overgrazing by which animals can turn kelp forests into bare 'barrens'?", choices: ["Sea cucumbers", "Sea urchins", "Brittle stars", "Feather stars"], answer: 1, why: "Unchecked urchins can strip kelp, creating urchin barrens." },
      { type: "tf", q: "Giant tube worms at hydrothermal vents are fed by symbiotic chemosynthetic bacteria.", answer: true, why: "Lacking a gut, they rely on internal bacteria that use vent chemicals to make food." }
    ]
  },

  "fishes": {
    title: "Fishes: the vertebrate majority",
    track: "organisms", level: "Core", src: "noaafish", time: 7,
    explain: [
      "Fishes are water-living vertebrates that breathe with gills and usually have fins. They are by far the most varied vertebrates, with more than 30,000 species. There are three living groups: jawless fishes (hagfishes and lampreys), cartilaginous fishes (sharks, rays, and chimaeras), and bony fishes. The bony fishes are by far the largest group and include almost all familiar fish.",
      "A fish breathes by pumping water over its gills. There, its blood takes in dissolved oxygen and releases carbon dioxide. Most bony fishes also have a gas-filled swim bladder. They adjust it to float at a chosen depth without constant effort. Sharks do not have this organ.",
      "Fishes sense their world in ways land animals cannot. The lateral line is a row of sensors along the body. It detects water movement and pressure changes. This lets fish school tightly and feel predators or prey in the dark. Fins give thrust and steering. A fish's body shape fits its lifestyle, from torpedo-shaped open-ocean sprinters to flattened bottom-dwellers."
    ],
    why: "Fishes are the ocean's vertebrate engine — the bulk of its biomass diversity and the heart of global fisheries.",
    misconception: "Not all fish have the same skeleton: sharks and rays are cartilaginous, while most fish are bony.",
    terms: [
      ["Gills", "Organs that extract dissolved oxygen from water as it flows across them."],
      ["Swim bladder", "A gas-filled organ in bony fishes used to control buoyancy."],
      ["Lateral line", "A sensory system that detects water movement and pressure."]
    ],
    hook: "Jawless, cartilage, bone — three kinds of fish, and bone wins on numbers.",
    sources: [
      { label: "NOAA Fisheries — species directory", url: "https://www.fisheries.noaa.gov/species-directory" },
      { label: "Smithsonian Ocean — fish", url: "https://ocean.si.edu/ocean-life/fish" }
    ],
    quiz: [
      { type: "mc", q: "Most familiar fish belong to which group?", choices: ["Jawless fishes", "Cartilaginous fishes", "Bony fishes", "Marine mammals"], answer: 2, why: "Bony fishes contain the vast majority of the 30,000+ fish species." },
      { type: "mc", q: "The swim bladder of a bony fish is used mainly for:", choices: ["Hearing", "Buoyancy control", "Reproduction", "Filtering food"], answer: 1, why: "Adjusting gas in the swim bladder lets a fish hold depth without constant swimming." },
      { type: "tf", q: "The lateral line lets fish detect movement and pressure changes in the water.", answer: true, why: "It helps them school, navigate and sense predators or prey, even in darkness." }
    ]
  },

  "sharks-rays": {
    title: "Sharks, rays, and chimaeras",
    track: "organisms", level: "Core", src: "noaafish", time: 6,
    explain: [
      "Sharks, rays, skates, and chimaeras are the cartilaginous fishes, the class Chondrichthyes. Their skeletons are made of bendy cartilage, not bone. This ancient group has cruised the seas for over 400 million years, long before the dinosaurs. Their skin is covered in tooth-like scales called dermal denticles that cut down drag. Many replace their teeth over and over throughout life.",
      "They are superbly equipped predators. Along with sharp smell and vision, sharks have the ampullae of Lorenzini. These jelly-filled pores sense the faint electric fields made by living animals. That helps a shark find prey hidden in sand or murky water. Rays are basically flattened relatives built for life on or near the bottom. Mantas are an exception, filtering plankton in open water.",
      "Most sharks grow slowly, mature late, and have few young. This makes their populations very slow to bounce back. Fishing pressure, including for their fins, plus bycatch, has pushed many shark and ray species toward extinction. As top predators, their loss can unbalance entire ecosystems."
    ],
    why: "Sharks are keystone predators and an evolutionary success story, yet their slow life history makes them acutely vulnerable to overfishing.",
    misconception: "Sharks are fish, not mammals, and most species pose little danger to people; many are themselves endangered.",
    terms: [
      ["Chondrichthyes", "Cartilaginous fishes: sharks, rays, skates and chimaeras."],
      ["Ampullae of Lorenzini", "Electroreceptive pores that sense prey's electric fields."],
      ["Dermal denticles", "Tooth-like skin scales that reduce drag."]
    ],
    hook: "Cartilage, denticles, and a sixth sense for electricity — 400 million years of refinement.",
    sources: [
      { label: "NOAA Fisheries — sharks", url: "https://www.fisheries.noaa.gov/sharks" },
      { label: "IUCN Red List — sharks and rays status", url: "https://www.iucnredlist.org/" }
    ],
    quiz: [
      { type: "mc", q: "The skeleton of a shark is made of:", choices: ["Bone", "Cartilage", "Calcium carbonate", "Silica"], answer: 1, why: "Chondrichthyans have skeletons of flexible cartilage rather than bone." },
      { type: "mc", q: "The ampullae of Lorenzini allow sharks to detect:", choices: ["Sound", "Color", "Electric fields from prey", "Water temperature"], answer: 2, why: "These pores sense the weak electric fields produced by living animals." },
      { type: "tf", q: "Many sharks recover slowly from population declines because they mature late and have few young.", answer: true, why: "Slow life histories make sharks and rays highly vulnerable to overfishing." }
    ]
  },

  "reptiles-birds": {
    title: "Marine reptiles and seabirds",
    track: "organisms", level: "Core", src: "iucn", time: 6,
    explain: [
      "A few reptile groups returned to the sea. Sea turtles spend almost their whole lives in the ocean. They come ashore only to lay eggs, and females often return to the very beach where they hatched. The other living sea reptiles are sea snakes, the marine iguana of the Galápagos, and the saltwater crocodile. Because they all breathe air, they must come to the surface. Many are harmed by bycatch, plastic, and the loss of nesting beaches.",
      "Seabirds are birds built to feed at sea. They include albatrosses, petrels, penguins, gulls, terns, and puffins. Some, like the wandering albatross, soar across whole oceans for years between visits to land. Penguins gave up flying and instead 'fly' underwater with powerful strokes.",
      "Drinking seawater would kill most animals. Seabirds and sea reptiles share a clever fix: special salt glands, usually near the eyes or nose. These glands gather the extra salt and push it out. This lets the animals stay at sea, far from any fresh water."
    ],
    why: "Air-breathing reptiles and birds are key ocean predators and tie marine ecosystems to the land where they nest.",
    misconception: "Sea turtles and seabirds can 'drink' seawater because salt glands remove the excess salt — their kidneys alone could not.",
    terms: [
      ["Salt gland", "An organ that excretes excess salt, letting animals live on seawater."],
      ["Natal beach", "The beach where a sea turtle hatched and where females often return to nest."]
    ],
    hook: "Salt glands are the trick that lets a turtle or albatross live at sea.",
    sources: [
      { label: "IUCN Red List — sea turtles and seabirds", url: "https://www.iucnredlist.org/" },
      { label: "NOAA Fisheries — sea turtles", url: "https://www.fisheries.noaa.gov/sea-turtles" }
    ],
    quiz: [
      { type: "mc", q: "Sea turtles come ashore mainly to:", choices: ["Feed", "Sleep", "Lay eggs", "Escape predators"], answer: 2, why: "They spend life at sea but females nest on land, often on their natal beach." },
      { type: "mc", q: "Seabirds and marine reptiles cope with salty water using:", choices: ["Extra-large kidneys", "Salt glands that excrete excess salt", "Gills", "A swim bladder"], answer: 1, why: "Salt glands concentrate and remove salt so they can drink seawater." },
      { type: "tf", q: "Penguins are seabirds that 'fly' underwater rather than through the air.", answer: true, why: "Penguins traded aerial flight for powerful flipper-driven swimming." }
    ]
  },

  "mammals": {
    title: "Marine mammals",
    track: "organisms", level: "Core", src: "noaafish", time: 7,
    explain: [
      "Marine mammals are warm-blooded, air-breathing animals that returned to the sea. The main groups are the cetaceans (whales, dolphins, and porpoises), the pinnipeds (seals, sea lions, and walruses), and the sirenians (manatees and dugongs, the gentle plant-eaters). Sea otters and polar bears count too. The blue whale, a cetacean, is the largest animal known to have ever lived.",
      "Living in cold water while breathing air takes special adaptations. A thick layer of blubber keeps them warm and stores energy. Large oxygen stores in their blood and muscle, plus a slowed heart rate, let them make long, deep dives. And streamlined bodies with flippers or flukes make them strong swimmers.",
      "Cetaceans are also sound experts. Toothed whales and dolphins use echolocation. They send out clicks and read the echoes to hunt and navigate in dark or murky water. Baleen whales filter huge mouthfuls of water through fringed plates to strain out krill and small fish. Sound is their main sense, which is why ocean noise pollution is a serious worry."
    ],
    why: "Marine mammals are top predators, climate sentinels, and showcases of how air-breathing life re-mastered the ocean.",
    misconception: "Whales and dolphins are mammals, not fish — they breathe air, are warm-blooded, and nurse their young.",
    terms: [
      ["Cetacean", "Whales, dolphins and porpoises."],
      ["Blubber", "A thick fat layer that insulates marine mammals and stores energy."],
      ["Echolocation", "Sensing surroundings by emitting sound and interpreting the echoes."]
    ],
    hook: "Blubber to stay warm, big oxygen stores to dive, and sound to see.",
    sources: [
      { label: "NOAA Fisheries — marine mammals", url: "https://www.fisheries.noaa.gov/marine-mammals" },
      { label: "Smithsonian Ocean — marine mammals", url: "https://ocean.si.edu/ocean-life/marine-mammals" }
    ],
    quiz: [
      { type: "mc", q: "The largest animal known to have ever lived is the:", choices: ["Great white shark", "Blue whale", "Giant squid", "Elephant"], answer: 1, why: "The blue whale, a baleen cetacean, exceeds any dinosaur in size." },
      { type: "mc", q: "Toothed whales and dolphins find prey in the dark using:", choices: ["The lateral line", "Echolocation", "Salt glands", "Electroreception"], answer: 1, why: "They emit clicks and interpret the returning echoes to locate objects." },
      { type: "tf", q: "Baleen whales filter krill and small fish through fringed plates instead of teeth.", answer: true, why: "Baleen plates strain prey from huge mouthfuls of water." }
    ]
  }

});
