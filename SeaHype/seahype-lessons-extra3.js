/* SeaHype lesson batch: Conservation + Methods & Careers.
   Plain data merged at build time. Figures spot-checked against NOAA, FAO and
   IPCC-aligned sources; phrased conservatively. */
window.__SEA_LESSONS__ = Object.assign(window.__SEA_LESSONS__ || {}, {

  /* ===================== CONSERVATION ===================== */

  "fisheries": {
    title: "Fishing, overfishing, and sustainable seafood",
    track: "conservation", level: "Core", src: "noaafish", time: 7,
    explain: [
      "Each year, people take tens of millions of tonnes of wild seafood from the ocean. For many coastal towns, fish are the main food and the main income. Trouble starts when a fish stock is caught faster than it can have young. This is called overfishing. It shrinks the population, and in the worst cases the stock can collapse. That is what happened to the huge Atlantic cod fishery off Newfoundland.",
      "Worldwide checks show that more than a third of the fish stocks scientists watch are now overfished. That share has slowly risen for decades. Fishing has two other costs as well. One is bycatch, when animals like turtles, dolphins, and seabirds are caught by accident. The other is habitat damage, such as heavy nets called bottom trawls that scrape the seafloor.",
      "The good news is that smart management works. It helps to set catch limits based on science, protect the places where fish breed and grow up, use better gear to cut bycatch, and rebuild stocks that have shrunk. Where people do these things, fisheries often recover. Fish farming, called aquaculture, has grown very fast. In 2022 it passed wild fishing for the first time. It now supplies about half the seafood people eat, though it has its own downsides for the environment."
    ],
    why: "Fisheries feed billions and drive economies, so the difference between overfishing and sustainable management has enormous human and ecological stakes.",
    misconception: "Overfishing is not irreversible: well-managed, science-based limits have rebuilt many depleted stocks.",
    terms: [
      ["Overfishing", "Catching fish faster than the population can reproduce, shrinking the stock."],
      ["Bycatch", "The unintended capture of non-target species such as turtles or dolphins."],
      ["Aquaculture", "Farming aquatic organisms; in 2022 it overtook wild capture in seafood production."]
    ],
    hook: "Catch within limits and stocks rebuild; exceed them and they collapse — management is the lever.",
    sources: [
      { label: "NOAA Fisheries — sustainable fisheries", url: "https://www.fisheries.noaa.gov/topic/sustainable-fisheries" },
      { label: "FAO — State of World Fisheries and Aquaculture", url: "https://www.fao.org/state-of-fisheries-aquaculture" }
    ],
    quiz: [
      { type: "mc", q: "Overfishing means:", choices: ["Catching fish faster than the population can reproduce", "Farming fish in pens", "Fishing only at night", "Catching the wrong species by accident"], answer: 0, why: "When removal outpaces reproduction, the stock shrinks and may collapse." },
      { type: "mc", q: "The unintended capture of non-target animals like turtles and dolphins is called:", choices: ["Overfishing", "Bycatch", "Aquaculture", "Upwelling"], answer: 1, why: "Reducing bycatch with smarter gear is a major conservation goal." },
      { type: "tf", q: "Science-based catch limits have helped rebuild some depleted fish stocks.", answer: true, why: "Good management is the most effective tool for recovering fisheries." }
    ]
  },

  "pollution": {
    title: "Ocean pollution: plastic, nutrients, and noise",
    track: "conservation", level: "Core", src: "noaa", time: 7,
    explain: [
      "Most ocean pollution starts on land. Millions of tonnes of plastic enter the ocean every year. Sunlight and waves break it into microplastics, which are tiny bits of plastic. These are now found from the surface to the deep seafloor, and inside animals all through the food web. Plastic can tangle wildlife, be mistaken for food, and carry harmful chemicals.",
      "A second big problem is nutrient pollution. Fertilizer, sewage, and other runoff add lots of nitrogen and phosphorus to coastal water. This makes algae grow in huge blooms. When the blooms die and rot, bacteria use up the oxygen. This creates low-oxygen 'dead zones' where most animals cannot survive. A large one forms each year in the Gulf of Mexico.",
      "There are other problems too. Oil spills, harmful chemicals that build up in the bodies of top predators, and underwater noise from ships and industry all hurt sea life. Noise is especially hard on whales and dolphins, which depend on sound to talk and find their way. Because the whole ocean is connected, pollution rarely stays where it began."
    ],
    why: "Pollution affects the whole food web and reaches even the deepest, most remote waters, making prevention on land central to ocean health.",
    misconception: "Most ocean plastic and nutrient pollution does not originate at sea; it washes in from land via rivers and runoff.",
    terms: [
      ["Microplastics", "Tiny plastic fragments found throughout the ocean and food web."],
      ["Eutrophication", "Nutrient over-enrichment that fuels algal blooms and oxygen loss."],
      ["Dead zone (hypoxia)", "A low-oxygen area where most marine animals cannot survive."]
    ],
    hook: "It starts on land: plastic breaks into microplastics, nutrients breed dead zones, noise drowns out whales.",
    sources: [
      { label: "NOAA Marine Debris Program — plastic in the ocean", url: "https://marinedebris.noaa.gov/" },
      { label: "NOAA — what is a dead zone", url: "https://oceanservice.noaa.gov/facts/deadzone.html" }
    ],
    quiz: [
      { type: "mc", q: "A low-oxygen 'dead zone' is usually caused by:", choices: ["Too much plastic", "Nutrient runoff fueling blooms that decompose and use up oxygen", "Cold water", "Overfishing"], answer: 1, why: "Excess nutrients drive blooms; their decay consumes the oxygen animals need." },
      { type: "tf", q: "Most ocean plastic enters from land, then breaks down into microplastics.", answer: true, why: "Rivers and runoff carry plastic to sea, where it fragments into microplastics." },
      { type: "mc", q: "Underwater noise from ships is a particular problem for:", choices: ["Corals", "Animals that rely on sound, like whales and dolphins", "Seagrasses", "Plankton"], answer: 1, why: "Noise can mask the sounds marine mammals use to communicate and navigate." }
    ]
  },

  "climate-ocean": {
    title: "The ocean and a changing climate",
    track: "conservation", level: "Advanced", src: "noaa", time: 7,
    explain: [
      "The ocean is the planet's great climate buffer. It has soaked up most of the extra heat that greenhouse gases trap, around 90% of it. It has also taken in about a quarter to a third of the carbon dioxide people have released. This has slowed the warming of the air. But it comes at a cost to the sea itself.",
      "As the ocean warms, the water expands and polar ice melts. This raises the sea level and threatens coasts and low islands. Warmer water also holds less oxygen. And it fuels marine heatwaves, which are long spells of unusually warm water. Heatwaves can cause mass coral bleaching. They can also push species toward the poles or into deeper, cooler water.",
      "These changes ripple through ecosystems. As species move to new areas, food webs and fisheries get scrambled. Bleaching damages reefs. Species that cannot move or change fast enough begin to decline. The ocean stores so much heat and carbon that it protects us from faster climate change. But it also takes much of the damage."
    ],
    why: "The ocean absorbs most of the heat and much of the carbon from climate change, so understanding ocean impacts is central to understanding the climate itself.",
    misconception: "The ocean is not separate from climate change; it absorbs most of the excess heat and a large share of the carbon, and is being transformed by both.",
    terms: [
      ["Thermal expansion", "Warming seawater expands, a major driver of sea-level rise."],
      ["Marine heatwave", "A prolonged period of unusually warm water that can cause bleaching and range shifts."],
      ["Deoxygenation", "The decline in ocean oxygen as the water warms."]
    ],
    hook: "~90% of excess heat and much of our CO2 go into the sea — buffering the air, but warming the water.",
    sources: [
      { label: "NOAA — climate and the ocean", url: "https://oceanservice.noaa.gov/facts/climate.html" },
      { label: "NOAA — sea level rise", url: "https://oceanservice.noaa.gov/facts/sealevel.html" }
    ],
    quiz: [
      { type: "mc", q: "Roughly how much of the excess heat from global warming has the ocean absorbed?", choices: ["About 10%", "About 50%", "About 90%", "Almost none"], answer: 2, why: "The ocean has taken up on the order of 90% of the extra heat, buffering the atmosphere." },
      { type: "mc", q: "A prolonged spike of unusually warm seawater that can cause mass coral bleaching is a:", choices: ["Dead zone", "Marine heatwave", "Upwelling", "Spring bloom"], answer: 1, why: "Marine heatwaves stress corals and push species to shift their ranges." },
      { type: "tf", q: "Warming seawater can hold less dissolved oxygen.", answer: true, why: "Deoxygenation is one of the ways warming directly affects ocean life." }
    ]
  },

  "acidification": {
    title: "Ocean acidification: the other carbon problem",
    track: "conservation", level: "Advanced", src: "pmel", time: 7,
    explain: [
      "When carbon dioxide gas dissolves in seawater, it makes a weak acid. This lowers the ocean's pH, which means the water becomes more acidic. The ocean has soaked up a large share of the carbon dioxide people have released. Because of this, the surface ocean's pH has already dropped by about 0.1 since the 1800s. That is about a 30% rise in acidity. Scientists call this change ocean acidification.",
      "More acidic water holds fewer of the building blocks animals need for shells and skeletons. Many sea animals build their hard parts from a material called calcium carbonate. So corals, oysters, clams, sea urchins, and tiny drifting plankton find it harder to make and keep their shells. In bad cases, shells that already exist can start to dissolve.",
      "So much of the food web depends on shell- and skeleton-builders. These range from reef corals to tiny sea snails called pteropods that fish eat. So acidification puts both ocean life and fishing at risk. It comes from the same carbon dioxide that warms the planet. That is why people call it 'the other carbon problem.'"
    ],
    why: "Acidification undermines the shell- and reef-builders that whole ecosystems and major fisheries depend on, and it is accelerating with carbon emissions.",
    misconception: "Acidification does not mean the ocean has turned to acid; it means seawater is becoming less alkaline, and that shift is already harming calcifiers.",
    terms: [
      ["Ocean acidification", "The drop in ocean pH as it absorbs carbon dioxide from the atmosphere."],
      ["pH", "A scale of acidity; lower pH means more acidic. Surface ocean pH has fallen about 0.1 unit."],
      ["Calcifier", "An organism that builds shells or skeletons of calcium carbonate (corals, shellfish, some plankton)."]
    ],
    hook: "More CO2 in, lower pH, fewer carbonate building blocks — harder for shells and reefs to form.",
    sources: [
      { label: "NOAA PMEL — ocean acidification", url: "https://www.pmel.noaa.gov/co2/story/Ocean+Acidification" },
      { label: "NOAA — what is ocean acidification", url: "https://oceanservice.noaa.gov/facts/acidification.html" }
    ],
    quiz: [
      { type: "mc", q: "Ocean acidification happens because seawater absorbs:", choices: ["Oxygen", "Carbon dioxide", "Nitrogen", "Plastic"], answer: 1, why: "Dissolved CO2 forms carbonic acid, lowering the ocean's pH." },
      { type: "mc", q: "Acidification is especially hard on:", choices: ["Fast-swimming fish", "Shell- and skeleton-builders like corals and shellfish", "Seabirds", "Kelp"], answer: 1, why: "Lower pH reduces the carbonate these animals need to build calcium carbonate structures." },
      { type: "tf", q: "Surface ocean pH has fallen by roughly 0.1 unit since the industrial era began.", answer: true, why: "That corresponds to about a 30% increase in acidity." }
    ]
  },

  "protection": {
    title: "Protecting the ocean: MPAs and recovery",
    track: "conservation", level: "Core", src: "noaa", time: 6,
    explain: [
      "One of the best ways to protect the ocean is to set aside special places called marine protected areas, or MPAs. In these places, harmful activities are limited or banned. Some MPAs have only a few rules. The strongest are 'no-take' reserves, where nothing may be removed at all. Inside strong reserves, fish grow bigger and more plentiful. Many then swim out and help restock the waters nearby.",
      "Protection is growing, but slowly. Right now, less than 10% of the ocean is strongly protected. A worldwide goal called '30 by 30' aims to protect 30% of the planet's land and sea by the year 2030. Reaching it would mean creating many more protected areas and guarding them well.",
      "Protected areas are not the only way to help. After whaling was banned, several great whale groups grew back. Laws have helped sea otters and sea turtles recover in some places. People are also rebuilding habitats on purpose. They replant seagrass and mangroves, rebuild oyster reefs, and plant corals grown in nurseries. When the pressure stops and there is enough time, the ocean can heal."
    ],
    why: "Protected areas, laws, and habitat rebuilding all show the ocean can recover. That makes the choices people make a big factor in its future.",
    misconception: "Marine protected areas are not all the same; only fully protected 'no-take' reserves deliver the strongest recovery, and they remain a small fraction of the ocean.",
    terms: [
      ["Marine protected area (MPA)", "An ocean area where harmful activities are limited to conserve nature."],
      ["No-take reserve", "A fully protected MPA where removing organisms or resources is banned."],
      ["30 by 30", "A goal to conserve 30% of land and sea by 2030."]
    ],
    hook: "Strong reserves grow bigger fish that spill over — and '30 by 30' aims to protect a third of the sea.",
    sources: [
      { label: "NOAA — marine protected areas", url: "https://marineprotectedareas.noaa.gov/" },
      { label: "IUCN — conservation and the Red List", url: "https://www.iucnredlist.org/" }
    ],
    quiz: [
      { type: "mc", q: "A fully protected 'no-take' reserve is one where:", choices: ["Only sport fishing is allowed", "Nothing may be removed", "Boats are banned but fishing is allowed", "Only research vessels may enter"], answer: 1, why: "No-take reserves deliver the strongest recovery because nothing is harvested." },
      { type: "mc", q: "The '30 by 30' goal aims to conserve:", choices: ["30 species by 2030", "30% of land and sea by 2030", "30 marine parks", "30% of fish stocks"], answer: 1, why: "It targets protection of 30% of the planet's land and ocean by 2030." },
      { type: "tf", q: "Bans on commercial whaling helped several great whale populations recover.", answer: true, why: "Removing the pressure, given time, allowed populations to rebound — evidence that recovery is possible." }
    ]
  },

  /* ===================== METHODS & CAREERS ===================== */

  "scientific-method": {
    title: "How marine biologists actually do science",
    track: "methods", level: "Foundations", src: "si", time: 6,
    explain: [
      "Marine biology is a science, so it follows the scientific method. First, a scientist watches carefully and makes observations. Next, they form a hypothesis, which is a testable idea that might explain what they see. They use that idea to make a prediction. Then they design a study or experiment to test it. Finally, they study the results and write them up. Other scientists check the work, a step called peer review, before it is trusted.",
      "Good studies are careful not to fool the scientist. They use comparisons so the real cause can be found. They repeat their measurements, so a one-time fluke is not mistaken for a real pattern. They are also honest about what they are unsure of. One key rule is that 'correlation is not causation.' Just because two things change together does not prove that one causes the other.",
      "The ocean makes this harder than working in a lab. Animals move and hide, study sites are far away, and conditions keep changing. So marine biologists use smart sampling, watch the same places for years, and lean on math and computer models. The goal stays the same: answers that others can repeat and that the evidence really supports, not just good-sounding stories."
    ],
    why: "Knowing how marine science is actually done lets you judge claims about the ocean by the strength of the evidence behind them.",
    misconception: "A single study or a striking correlation does not establish a fact; science relies on testing, replication and peer review.",
    terms: [
      ["Hypothesis", "A testable proposed explanation that a study is designed to evaluate."],
      ["Control", "A comparison condition that isolates the effect being tested."],
      ["Peer review", "Evaluation of research by other scientists before it is accepted."]
    ],
    hook: "Observe, hypothesize, predict, test, review — and never confuse correlation with causation.",
    sources: [
      { label: "Smithsonian Ocean — ocean science and research", url: "https://ocean.si.edu/" },
      { label: "NOAA Education — how ocean science works", url: "https://oceanservice.noaa.gov/education/" }
    ],
    quiz: [
      { type: "mc", q: "A testable proposed explanation in science is called a:", choices: ["Theory of everything", "Hypothesis", "Conclusion", "Variable"], answer: 1, why: "A hypothesis is what a study is designed to test." },
      { type: "tf", q: "If two things change together, that proves one causes the other.", answer: false, why: "Correlation is not causation; further testing is needed to establish cause." },
      { type: "mc", q: "Before research is widely trusted it usually undergoes:", choices: ["Advertising", "Peer review by other scientists", "A public vote", "Patent approval"], answer: 1, why: "Peer review checks the methods and reasoning before findings are accepted." }
    ]
  },

  "tools": {
    title: "The marine biologist's toolkit",
    track: "methods", level: "Core", src: "noaaoe", time: 6,
    explain: [
      "The ocean is deep and hard to reach, so marine biologists need special tools. Research ships work like floating labs. SCUBA gear lets scientists swim and work on shallow reefs and kelp forests. To go deeper than people can safely dive, they use robots and small subs. ROVs are robots tied to a ship by a long cable. AUVs are robots that swim on their own. Crewed submersibles carry people down. The most famous one, called Alvin, helped find deep-sea hot springs known as hydrothermal vents.",
      "Some tools work from far away. Satellites in space watch the ocean from orbit. They measure how warm the surface is, its color (which hints at how much phytoplankton is growing), how high the sea is, and where the ice is. Sonar uses sound to map the seafloor and find animals. A tool called a CTD is lowered on a line to measure salt, temperature, and depth all the way down. It is one of the most-used tools in ocean science.",
      "Other tools follow the animals themselves. Scientists stick small electronic tags on sharks, turtles, and whales to track where they go. They also listen with underwater microphones. They can even test the water for tiny bits of genetic material that animals leave behind, called environmental DNA, or eDNA. This tells them which species are nearby without ever seeing them."
    ],
    why: "The tools a scientist has decide what questions they can answer, from mapping the seafloor to following one tagged shark across the ocean.",
    misconception: "Marine biology is not all hands-on diving; much of it uses robots, satellites, acoustics and genetics to study places and animals we cannot reach directly.",
    terms: [
      ["ROV / AUV", "Remotely operated and autonomous underwater vehicles for exploring the deep."],
      ["Remote sensing", "Measuring the ocean from satellites (temperature, color, sea level, ice)."],
      ["eDNA", "Environmental DNA shed into the water, used to detect which species are present."]
    ],
    hook: "Ships, SCUBA, ROVs, satellites, sonar, CTDs, tags and eDNA — each reaches a different part of the sea.",
    sources: [
      { label: "NOAA Ocean Exploration — exploration technology", url: "https://oceanexplorer.noaa.gov/technology/technology.html" },
      { label: "WHOI — vehicles and instruments", url: "https://www.whoi.edu/what-we-do/explore/instruments/" }
    ],
    quiz: [
      { type: "mc", q: "A tethered underwater robot operated from a ship is a(n):", choices: ["AUV", "ROV", "CTD", "Sonar"], answer: 1, why: "ROVs are remotely operated and connected to the ship by a tether." },
      { type: "mc", q: "A CTD instrument measures:", choices: ["Color, temperature and density", "Conductivity (salinity), temperature and depth", "Current, tide and distance", "Carbon, time and density"], answer: 1, why: "The CTD is the standard tool for profiling salinity, temperature and depth." },
      { type: "tf", q: "eDNA lets scientists detect which species are present from the genetic traces they leave in the water.", answer: true, why: "Environmental DNA can reveal species without anyone seeing or catching them." }
    ]
  },

  "history": {
    title: "A short history of marine biology",
    track: "methods", level: "Foundations", src: "si", time: 6,
    explain: [
      "People have studied sea life for a very long time. More than two thousand years ago, the Greek thinker Aristotle described and sorted ocean animals. But ocean science as we know it began in the 1800s. On his voyage aboard HMS Beagle, Charles Darwin worked out how ring-shaped coral reefs form. In the 1870s, the ship HMS Challenger sailed around the world and carefully sampled the deep sea. It found thousands of new species, and many people call that voyage the start of ocean science.",
      "The 1900s let people see the deep sea for the first time. In the 1930s, a round metal chamber called the bathysphere carried people far below the surface. Later, small subs and the aqualung (modern SCUBA) let scientists dive like never before. A huge moment came in 1977. Scientists in the sub Alvin found hydrothermal vents and the strange life living around them. No one had imagined these deep-sea communities before.",
      "Today the field mixes careful nature study with DNA science, satellites, robots, and powerful computers. Scientists keep listing ocean species and mapping the seafloor. Even so, most of the deep sea has never been explored. Marine biology is still full of new things to discover."
    ],
    why: "Knowing the field's milestones — Challenger, the bathysphere, Alvin and the vents — frames how recently and how rapidly our knowledge of the ocean has grown.",
    misconception: "Marine biology is not an old, finished science; systematic study is only about 150 years old, and most of the deep sea is still unexplored.",
    terms: [
      ["HMS Challenger", "The 1870s expedition that systematically sampled the deep sea, founding oceanography."],
      ["Bathysphere", "A 1930s sphere that carried observers to then-unprecedented depths."],
      ["Alvin", "The crewed submersible whose 1977 dives discovered hydrothermal-vent ecosystems."]
    ],
    hook: "Aristotle to Challenger to Alvin: a 2,000-year curiosity, but only ~150 years of systematic science.",
    sources: [
      { label: "Smithsonian Ocean — history of ocean exploration", url: "https://ocean.si.edu/human-connections/history-cultures" },
      { label: "NOAA Ocean Exploration — history and milestones", url: "https://oceanexplorer.noaa.gov/" }
    ],
    quiz: [
      { type: "mc", q: "The expedition often called the birth of oceanography was:", choices: ["The voyage of HMS Beagle", "The HMS Challenger expedition of the 1870s", "The Apollo program", "The Kon-Tiki raft"], answer: 1, why: "Challenger systematically sampled the deep ocean and described thousands of new species." },
      { type: "mc", q: "Hydrothermal vents and their chemosynthetic life were discovered in 1977 using:", choices: ["A satellite", "The submersible Alvin", "SCUBA gear", "A fishing trawler"], answer: 1, why: "Scientists aboard Alvin found the vents, revealing life powered by chemistry." },
      { type: "tf", q: "Most of the deep sea has now been explored in detail.", answer: false, why: "Much of the deep ocean remains unexplored, keeping marine biology a frontier science." }
    ]
  },

  "careers": {
    title: "Becoming a marine biologist",
    track: "methods", level: "Foundations", src: "noaaedu", time: 6,
    explain: [
      "Marine biology is not one job. It is a whole family of jobs. Some marine biologists do research at universities. Others study fish to set safe catch limits, work to protect the ocean, teach at aquariums, farm sea life, or advise on building projects near the coast. Many of these jobs mix work in the field, work in the lab, and a lot of time studying data on a computer.",
      "They all share one base: strong science. Most marine biologists earn a college degree in marine biology, zoology, or a close subject. Many then study further for research jobs. Math skills matter too, like statistics and even coding, because the work uses lots of data. Good writing and being able to work as a team are just as important.",
      "Real experience matters a lot. Volunteering, internships, helping in a lab, and time on a boat help you stand out and find what you love. If a job needs diving, you usually need a science-diving license first. Many people want these jobs, so it helps to be curious and to keep trying. Best of all, the ocean still has far more questions than answers."
    ],
    why: "Understanding the real range of marine-biology careers — and what they require — turns a childhood fascination into an achievable plan.",
    misconception: "Marine biology is not mostly swimming with dolphins; it is largely science, data analysis and fieldwork, across many different career paths.",
    terms: [
      ["Quantitative skills", "Statistics and coding — essential because modern marine biology is data-heavy."],
      ["Scientific diving certification", "A qualification typically required for research that involves diving."],
      ["Internship / fieldwork", "Hands-on experience that builds skills and helps you enter the field."]
    ],
    hook: "Many paths, one foundation: strong science, quantitative skills, writing, and hands-on experience.",
    sources: [
      { label: "NOAA Education — marine science careers", url: "https://www.noaa.gov/education/resource-collections/careers/marine-science-careers" },
      { label: "Smithsonian Ocean — ocean careers and people", url: "https://ocean.si.edu/" }
    ],
    quiz: [
      { type: "mc", q: "Modern marine biology relies heavily on:", choices: ["Only scuba diving", "Quantitative skills like statistics and coding", "Memorizing animal names", "Avoiding computers"], answer: 1, why: "The field is data-heavy, so analysis and coding skills are increasingly essential." },
      { type: "tf", q: "Hands-on experience such as internships and fieldwork helps people enter marine biology.", answer: true, why: "Practical experience builds skills and is highly valued in a competitive field." },
      { type: "mc", q: "For research that involves diving, you typically need:", choices: ["A pilot's license", "A scientific-diving certification", "No special training", "A medical degree"], answer: 1, why: "Scientific-diving certification is the standard requirement for research diving." }
    ]
  }

});
