# -*- coding: utf-8 -*-
import re
F = "/home/claude/astro/src/AstroHype.jsx"
src = open(F, encoding="utf-8").read()
fails = []

def RX(pattern, repl, label, count=1):
    global src
    new, n = re.subn(pattern, lambda m: repl, src, count=count, flags=re.S)
    if n != count: fails.append((label, n, count))
    src = new

def EX(old, new, label):
    global src
    c = src.count(old)
    if c != 1: fails.append((label, c, 1)); return
    src = src.replace(old, new)

# ---- arcade titles & descriptions ----
arcade_td = [
 ('title: "Acorn Pong"','title: "Comet Pong"'),
 ('desc: "Volley an acorn past the squirrel."','desc: "Volley a comet past the paddle."'),
 ('title: "Boulder Breaker"','title: "Asteroid Breaker"'),
 ('desc: "Smash the rock wall with a bouncing stone."','desc: "Smash the asteroid field with a bouncing probe."'),
 ('title: "Seed Drift"','title: "Probe Drift"'),
 ('desc: "Float a maple seed through gaps in the canopy."','desc: "Drift a probe through gaps in the asteroid field."'),
 ('title: "Litter Patrol"','title: "Debris Patrol"'),
 ('desc: "Grab the litter, spare the wildlife."','desc: "Grab the space junk, spare the satellites."'),
 ('title: "Caterpillar Crawl"','title: "Comet Crawl"'),
 ('desc: "Grow your caterpillar by eating leaves."','desc: "Grow your comet\'s tail by gathering ice."'),
 ('title: "Trail Memory"','title: "Cosmic Memory"'),
 ('desc: "Match pairs of forest creatures."','desc: "Match pairs of cosmic objects."'),
 ('title: "Locust Swarm"','title: "Meteor Swarm"'),
 ('desc: "Blast the descending swarm of locusts."','desc: "Blast the descending swarm of meteors."'),
 ('title: "Toad Crossing"','title: "Rover Crossing"'),
 ('desc: "Guide the toad safely across the road."','desc: "Guide the rover safely across the crater field."'),
 ('title: "Berry Catch"','title: "Stardust Catch"'),
 ('desc: "Catch ripe berries, dodge the thorns."','desc: "Catch stardust, dodge the meteors."'),
 ('title: "Tree Climber"','title: "Rocket Climber"'),
 ('desc: "Bounce up through the forest canopy."','desc: "Bounce up through the layers of the atmosphere."'),
 ('title: "Hail Dodge"','title: "Meteor Dodge"'),
 ('desc: "Survive the hailstorm."','desc: "Survive the meteor storm."'),
 ('title: "Squirrel Sprint"','title: "Rover Sprint"'),
 ('desc: "Weave through three forest lanes."','desc: "Weave through three crater lanes."'),
 ('title: "Rockslide"','title: "Asteroid Field"'),
 ('desc: "Blast tumbling rocks on the mountainside."','desc: "Blast tumbling asteroids in deep space."'),
 ('title: "Cave Crawler"','title: "Lava Tube Crawler"'),
 ('desc: "Crawl deep for crystals before your lamp fades."','desc: "Crawl into a lunar lava tube for ice before your lamp fades."'),
 ('title: "Trail Runner"','title: "Orbit Runner"'),
 ('desc: "Race down the trail, dodge the logs."','desc: "Race through orbit, dodge the debris."'),
 ('title: "Firefly Catch"','title: "Star Catch"'),
 ('desc: "Tap as many fireflies as you can."','desc: "Tap as many stars as you can."'),
 ('title: "Strata Stacker"','title: "Orbital Stacker"'),
 ('desc: "Stack rock layers and clear lines."','desc: "Stack station modules and clear lines."'),
 ('title: "Leaf Match"','title: "Planet Match"'),
 ('desc: "Swap to line up three matching leaves."','desc: "Swap to line up three matching planets."'),
 ('title: "Birdsong Says"','title: "Signal Says"'),
 ('desc: "Repeat the birdsong sequence."','desc: "Repeat the signal sequence."'),
 ('title: "Sapling 2048"','title: "Star 2048"'),
 ('desc: "Merge seeds to grow a mighty tree."','desc: "Merge dust to grow a mighty star."'),
 ('title: "Mushroom Sweeper"','title: "Crater Sweeper"'),
 ('desc: "Uncover safe mushrooms, avoid the toxic ones."','desc: "Uncover safe ground, avoid the hidden craters."'),
 ('title: "Firefly Lights"','title: "Constellation Lights"'),
 ('desc: "Switch off every glowing firefly."','desc: "Switch off every glowing star."'),
]
for o,n in arcade_td: EX(o,n,"td:"+o[:22])

# ---- arcade facts & help (regex to endquote) ----
arcade_rx = [
 (r'fact: "A gray squirrel can relocate[^"]*"','fact: "A comet speeds up as it falls toward the Sun and slows as it swings back out."'),
 (r'help: "Slide your paddle\. Get the acorn[^"]*"','help: "Slide your paddle. Get the comet past the top to score; don\'t let it past you."'),
 (r'fact: "Lichens slowly break bare rock[^"]*"','fact: "The asteroid belt holds millions of rocky bodies, yet they are spread far apart."'),
 (r'help: "Bounce the stone to break the rocks[^"]*"','help: "Bounce the probe to break the asteroids. Don\'t let it fall past your paddle."'),
 (r'fact: "Maple seeds spin like tiny helicopters[^"]*"','fact: "In space there is no air, so a probe keeps drifting until gravity steers it."'),
 (r'help: "Tap to float upward\. Slip through the gaps[^"]*"','help: "Tap to thrust upward. Slip through the gaps in the asteroid field."'),
 (r'fact: "A single plastic bottle can take[^"]*"','fact: "Thousands of bits of old rocket and satellite debris now orbit Earth as space junk."'),
 (r'help: "Catch falling litter in your bag[^"]*"','help: "Catch falling space junk in your scoop. Don\'t grab the satellites!"'),
 (r'fact: "A caterpillar can eat many times[^"]*"','fact: "A comet\'s tail can stretch for millions of kilometres, always pointing away from the Sun."'),
 (r'help: "Steer the caterpillar to eat leaves[^"]*"','help: "Steer the comet to gather ice. Don\'t hit the walls or yourself."'),
 (r'fact: "An octopus has about 500 million[^"]*"','fact: "Astronomers have catalogued millions of stars and galaxies, each with its own name or number."'),
 (r'fact: "A large locust swarm can contain[^"]*"','fact: "During a meteor storm, thousands of shooting stars can blaze across the sky in an hour."'),
 (r'help: "Move with the arrows and fire to scatter the locust[^"]*"','help: "Move with the arrows and fire to scatter the meteor swarm before it lands."'),
 (r'fact: "Some towns build small tunnels so toads[^"]*"','fact: "Mars rovers drive slowly and carefully to avoid getting stuck on rocks and in sand."'),
 (r'help: "Hop across, dodging cars and hazards[^"]*"','help: "Roll across, dodging hazards. Reach the far side to score."'),
 (r'fact: "Bears gorge on berries[^"]*"','fact: "Spacecraft have flown through comet tails to catch real stardust and return it to Earth."'),
 (r'help: "Move the basket to catch falling berries[^"]*"','help: "Move the scoop to catch falling stardust. Avoid the meteors!"'),
 (r'fact: "Some bamboo can grow nearly a meter[^"]*"','fact: "A rocket must reach about 28,000 km/h to climb all the way into orbit around Earth."'),
 (r'help: "Bounce higher and higher up the branches[^"]*"','help: "Bounce higher and higher toward space. Don\'t fall off the bottom!"'),
 (r'fact: "Hailstones grow as storm updrafts[^"]*"','fact: "Tiny meteoroids strike spacecraft at huge speeds, so shields protect them from impacts."'),
 (r'help: "Move to dodge the falling hailstones[^"]*"','help: "Move to dodge the falling meteors. Survive as long as you can."'),
 (r'fact: "Flying squirrels don\'t truly fly[^"]*"','fact: "Rovers are guided from Earth, where drivers plan each move because signals take minutes to arrive."'),
 (r'fact: "Frost, water and gravity slowly wear mountains[^"]*"','fact: "Some missions have deliberately crashed into asteroids to test how we might deflect one."'),
 (r'fact: "Some cave crystals grow for thousands[^"]*"','fact: "The Moon has giant lava tubes that future astronauts might use as ready-made shelters."'),
 (r'help: "Steer to grab crystals[^"]*"','help: "Steer to grab ice (it refills your lamp). Dodge the rocks. Watch your light!"'),
 (r'fact: "Pronghorn can sprint over 80[^"]*"','fact: "The space station races around Earth at about 28,000 km/h, circling the planet every 90 minutes."'),
 (r'help: "Move up and down to dodge logs[^"]*"','help: "Move up and down to dodge debris and grab stardust. It gets faster!"'),
 (r'fact: "Fireflies flash in coded patterns[^"]*"','fact: "Stars seem to twinkle because their light is bent and jostled by Earth\'s moving air."'),
 (r'help: "Tap the fireflies before time[^"]*"','help: "Tap the stars before time runs out. Chain taps for a bonus!"'),
 (r'fact: "Rock layers stack over millions[^"]*"','fact: "The space station was built piece by piece in orbit, adding module after module over years."'),
 (r'fact: "Leaves blaze red and gold[^"]*"','fact: "From the Sun outward, the planets run Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune."'),
 (r'help: "Tap a leaf, then a neighbour[^"]*"','help: "Tap a planet, then a neighbour, to swap. Make rows of 3+ before time runs out."'),
 (r'fact: "Many songbirds learn their songs[^"]*"','fact: "Spacecraft send and receive coded radio signals to talk with their teams on Earth."'),
 (r'fact: "A giant sequoia grows from a seed[^"]*"','fact: "Stars are born when gravity gathers vast clouds of gas and dust into a hot, glowing ball."'),
 (r'help: "Swipe with the arrows to slide and merge matching seeds[^"]*"','help: "Swipe with the arrows to slide and merge matching dust. Don\'t fill the grid!"'),
 (r'fact: "Never eat a wild mushroom[^"]*"','fact: "The Moon is covered in craters because, with almost no air, even small rocks reach the ground."'),
 (r'help: "Tap to uncover a tile\. Numbers show nearby toxic[^"]*"','help: "Tap to uncover a tile. Numbers show nearby craters. Clear every safe tile!"'),
 (r'fact: "Fireflies make cold light[^"]*"','fact: "Constellations are patterns our ancestors imagined by joining the brighter stars in the sky."'),
]
for pat,rep in arcade_rx: RX(pat,rep,"rx:"+pat[:22])

# ---- global Daily Trek -> Daily Orbit ----
src = src.replace("Daily Treks","Daily Orbits").replace("Daily Trek","Daily Orbit")

# ---- Trail level (TeacherScreen tile) ----
src = src.replace('tile("Trail level"','tile("Explorer level"')

# ---- GROUP_ART ----
RX(r'var GROUP_ART = \{.*?\n    \};',
'''var GROUP_ART = {
      "Stars": "star", "Planets": "planet", "Dwarf planets": "dwarf", "Moons": "moon", "Asteroids": "asteroid",
      "Comets": "comet", "Nebulae": "nebula", "Star clusters": "cluster", "Galaxies": "galaxy",
      "Black holes": "blackhole", "Neutron stars & pulsars": "blackhole", "Exoplanets": "planet"
    };''', "GROUP_ART")
EX('h(Illus, { name: GROUP_ART[it.group] ? GROUP_ART[it.group] : "forest"',
   'h(Illus, { name: GROUP_ART[it.group] ? GROUP_ART[it.group] : "star"', "GROUP_ART_fb")

# ---- collection screen header + subtitle ----
EX('h(Illus, { name: "forest", ar: "16 / 6", label: "Woodland", style: { marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" } }),',
   'h(Illus, { name: "asteroid", ar: "16 / 6", label: "Meteorites", style: { marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" } }),', "coll_header")
RX(r'"Rocks, minerals and fossils you can find in the field, grouped by [^"]*"',
   '"Meteorites and space rocks that have fallen to Earth, grouped by type."', "coll_sub")

# ---- PathsScreen subtitle ----
src = src.replace('"Your journey from trailhead to summit."','"Your journey from launchpad to deep space."')

# ---- expedition challenge prompts ----
for o,n in [
 ('"Sort each animal into its group."','"Sort each object into its group."'),
 ('"Sort each animal by where it lives."','"Sort each object by where it is found."'),
 ('"Sort each animal by what it eats."','"Sort each object by type."'),
 ('"animal group"','"object group"'),
 ('"home habitat"','"home region"'),
 ('"Match each animal to where it lives."','"Match each object to where it is found."'),
 ('"Match each animal to what it eats."','"Match each object by type."'),
 ('Every animal is suited to its own home in the sea.','Every object has its own place in the cosmos.'),
]:
    src = src.replace(o, n)

# ---- BADGES ----
badges_js = '''var BADGES = [
  { id: "first-dive", title: "First Light", desc: "Finish your first lesson", icon: "check", check: function (s) { return bDone(s) >= 1; }, prog: function (s) { return progCount(bDone(s), 1); } },
  { id: "getting-wet", title: "Finding Your Way", desc: "Finish 10 lessons", icon: "wave", check: function (s) { return bDone(s) >= 10; }, prog: function (s) { return progCount(bDone(s), 10); } },
  { id: "reef-regular", title: "Regular Observer", desc: "Finish 50 lessons", icon: "fish", check: function (s) { return bDone(s) >= 50; }, prog: function (s) { return progCount(bDone(s), 50); } },
  { id: "deep-diver", title: "Deep Sky", desc: "Finish 100 lessons", icon: "depth", check: function (s) { return bDone(s) >= 100; }, prog: function (s) { return progCount(bDone(s), 100); } },
  { id: "marine-scholar", title: "Star Scholar", desc: "Finish 300 lessons", icon: "book", check: function (s) { return bDone(s) >= 300; }, prog: function (s) { return progCount(bDone(s), 300); } },
  { id: "species-spotter", title: "Object Spotter", desc: "Master 25 objects", icon: "search", check: function (s) { return bMastered(s) >= 25; }, prog: function (s) { return progCount(bMastered(s), 25); } },
  { id: "naturalist", title: "Master Observer", desc: "Master 100 objects", icon: "fish", check: function (s) { return bMastered(s) >= 100; }, prog: function (s) { return progCount(bMastered(s), 100); } },
  { id: "well-rounded", title: "Well Rounded", desc: "Start all 8 topics", icon: "anchor", check: function (s) { return bTracks(s) >= 8; }, prog: function (s) { return progCount(bTracks(s), 8); } },
  { id: "making-waves", title: "Looking Up", desc: "Reach a 3-day streak", icon: "flame", check: function (s) { return bStreak(s) >= 3; }, prog: function (s) { return progCount(bStreak(s), 3); } },
  { id: "tidal-force", title: "Skywatcher", desc: "Reach a 7-day streak", icon: "flame", check: function (s) { return bStreak(s) >= 7; }, prog: function (s) { return progCount(bStreak(s), 7); } },
  { id: "devotee", title: "Cosmic Devotee", desc: "Reach a 30-day streak", icon: "flame", check: function (s) { return bStreak(s) >= 30; }, prog: function (s) { return progCount(bStreak(s), 30); } },
  { id: "pathfinder", title: "Pathfinder", desc: "Complete an expedition", icon: "depth", check: function (s) { return bExpeditions(s) >= 1; }, prog: function (s) { return progCount(bExpeditions(s), 1); } },
  { id: "cartographer", title: "Sky Cartographer", desc: "Complete all 8 expeditions", icon: "star", check: function (s) { return bExpeditions(s) >= 8; }, prog: function (s) { return progCount(bExpeditions(s), 8); } },
  { id: "memory-keeper", title: "Memory Keeper", desc: "Finish your first Daily Orbit", icon: "spark", check: function (s) { return bReviews(s) >= 1; }, prog: function (s) { return progCount(bReviews(s), 1); } },
  { id: "steel-trap", title: "Steel Trap", desc: "Finish 15 Daily Orbits", icon: "spark", check: function (s) { return bReviews(s) >= 15; }, prog: function (s) { return progCount(bReviews(s), 15); } },
  { id: "flawless", title: "Flawless", desc: "Ace a lesson quiz (100%)", icon: "star", check: function (s) { return bPerfect(s); } },
  { id: "arcade-ace", title: "Arcade Ace", desc: "Collect 50 arcade tickets", icon: "ticket", check: function (s) { return bTickets(s) >= 50; }, prog: function (s) { return progCount(bTickets(s), 50); } }
];'''
RX(r'var BADGES = \[.*?\n\];', badges_js, "BADGES")

# ---- SEQUENCES ----
seq_js = '''var SEQUENCES = [
  { id: "seq-distance", track: "foundations", prompt: "Order these from nearest to Earth to farthest away.", items: ["The Moon", "The Sun", "The nearest star", "The galaxy's center", "The Andromeda Galaxy"], why: "Distances climb fast: the Moon is closest, then the Sun, the nearest star, the galaxy's core, and a whole other galaxy." },
  { id: "seq-size", track: "foundations", prompt: "Order these from smallest to largest.", items: ["The Moon", "Earth", "The Sun", "The Solar System", "The Milky Way"], why: "Each step is far bigger than the last, from the Moon up to our entire galaxy." },
  { id: "seq-seelight", track: "foundations", prompt: "Order the steps of seeing a distant star.", items: ["The star gives off light", "Light crosses space for years", "Light enters a telescope", "A detector records it", "We see the star's past"], why: "Because light takes time to travel, the starlight we see left long ago." },
  { id: "seq-scaleu", track: "foundations", prompt: "Order these by how far their light must travel, nearest first.", items: ["Sunlight (8 minutes)", "Nearest star (4 years)", "Galaxy's center (27,000 years)", "Andromeda (2.5 million years)"], why: "The deeper into space we look, the longer the light has been travelling to reach us." },
  { id: "seq-phases", track: "ecology", prompt: "Order the Moon's phases, starting from new moon.", items: ["New moon", "Waxing crescent", "First quarter", "Full moon", "Last quarter"], why: "As the Moon orbits Earth, we see more and then less of its lit half each month." },
  { id: "seq-eclipse", track: "ecology", prompt: "Order what happens during a solar eclipse.", items: ["Moon moves between Sun and Earth", "Moon's shadow reaches Earth", "The Sun is blocked", "The sky darkens", "The Moon moves on"], why: "A solar eclipse happens when the Moon lines up to cast its shadow on Earth." },
  { id: "seq-orbitspeed", track: "ecology", prompt: "Order a planet's orbit from where it moves fastest to slowest.", items: ["Closest to the Sun (fastest)", "Approaching the Sun", "Leaving the Sun", "Farthest from the Sun (slowest)"], why: "Planets speed up near the Sun and slow down when far away, as Kepler found." },
  { id: "seq-tides", track: "ecology", prompt: "Order how the tides happen.", items: ["The Moon's gravity pulls on Earth", "The oceans bulge out", "Earth rotates", "A coast passes a bulge", "High tide"], why: "The Moon's gravity raises ocean bulges, and Earth's spin carries coasts through them." },
  { id: "seq-planetsin", track: "flora", prompt: "Order the inner planets outward from the Sun.", items: ["Mercury", "Venus", "Earth", "Mars"], why: "The four rocky inner planets run Mercury, Venus, Earth, Mars." },
  { id: "seq-planetsout", track: "flora", prompt: "Order the outer planets outward from the Sun.", items: ["Jupiter", "Saturn", "Uranus", "Neptune"], why: "The four giant outer planets run Jupiter, Saturn, Uranus, Neptune." },
  { id: "seq-formation", track: "flora", prompt: "Order how the Solar System formed.", items: ["A gas cloud collapses", "The Sun ignites", "A disk of dust spins", "Dust clumps into worlds", "Planets sweep their paths"], why: "The Sun and planets grew from one collapsing cloud over millions of years." },
  { id: "seq-comet", track: "flora", prompt: "Order how a comet brightens as it nears the Sun.", items: ["Frozen and dark, far out", "Approaches the Sun", "Ice turns to gas", "A tail streams out", "Brightest near the Sun"], why: "Sunlight heats a comet's ice into a glowing coma and tail." },
  { id: "seq-starlife", track: "fauna", prompt: "Order the life of a Sun-like star.", items: ["Nebula", "Protostar", "Main-sequence star", "Red giant", "White dwarf"], why: "A Sun-like star is born in a nebula and ends as a fading white dwarf." },
  { id: "seq-massive", track: "fauna", prompt: "Order the life of a massive star.", items: ["Nebula", "Massive star", "Red supergiant", "Supernova", "Neutron star or black hole"], why: "Massive stars die in a supernova, leaving a neutron star or black hole." },
  { id: "seq-starcolor", track: "fauna", prompt: "Order star colours from coolest to hottest.", items: ["Red", "Orange", "Yellow", "White", "Blue"], why: "A star's colour reveals its heat: red is coolest, blue is hottest." },
  { id: "seq-navigate", track: "fauna", prompt: "Order how to find north using the stars.", items: ["Find the Big Dipper", "Follow its pointer stars", "Reach the North Star", "Face the North Star", "That way is north"], why: "The Big Dipper's pointer stars lead to Polaris, which marks true north." },
  { id: "seq-structure", track: "geology", prompt: "Order these from smallest to largest.", items: ["A star", "The Solar System", "A star cluster", "A galaxy", "The Local Group"], why: "Structure builds up from single stars to whole groups of galaxies." },
  { id: "seq-starbirth", track: "geology", prompt: "Order how stars form in a nebula.", items: ["A cold gas cloud", "A region is squeezed", "Gravity pulls it together", "The core heats up", "A new star shines"], why: "Gravity gathers and heats a cloud until a star ignites." },
  { id: "seq-galsize", track: "geology", prompt: "Order these deep-sky objects from smallest to largest.", items: ["A single star", "A planetary nebula", "A star cluster", "A galaxy"], why: "From one dying star's nebula up to a galaxy of billions of stars." },
  { id: "seq-univhist", track: "habitats", prompt: "Order the history of the universe.", items: ["The Big Bang", "First atoms form", "First stars shine", "Galaxies form", "Today"], why: "The universe cooled from the Big Bang, then built atoms, stars and galaxies." },
  { id: "seq-cosmicd", track: "habitats", prompt: "Order these from nearest to farthest.", items: ["The Moon", "The Sun", "The nearest star", "The galaxy's center", "A distant galaxy"], why: "Cosmic distances grow enormously from the Moon out to other galaxies." },
  { id: "seq-stardeath", track: "habitats", prompt: "Order what happens as a massive star's core dies.", items: ["Fuel runs out", "The core collapses", "A supernova explodes", "Outer layers blast away", "A black hole remains"], why: "A massive star's collapse triggers a supernova and can leave a black hole." },
  { id: "seq-launch", track: "conservation", prompt: "Order a rocket launch into orbit.", items: ["Engines ignite", "The rocket lifts off", "It tips and speeds sideways", "It reaches orbital speed", "It falls around Earth in orbit"], why: "Reaching orbit means building enough sideways speed to keep falling around Earth." },
  { id: "seq-spacehist", track: "conservation", prompt: "Order these milestones of spaceflight by date.", items: ["First satellite (1957)", "First human in space (1961)", "First Moon landing (1969)", "First Mars rover (1997)", "First black hole image (2019)"], why: "Spaceflight advanced quickly from the first satellite to imaging a black hole." },
  { id: "seq-sample", track: "conservation", prompt: "Order a sample-return mission.", items: ["Launch toward an asteroid", "Arrive and study it", "Grab a sample", "Fly back to Earth", "Drop the capsule"], why: "Missions like OSIRIS-REx travel out, grab a sample, and return it to Earth." },
  { id: "seq-tellight", track: "conservation", prompt: "Order how light becomes a telescope image.", items: ["Light leaves a galaxy", "It travels across space", "A mirror gathers it", "A detector records it", "The image is sent to Earth"], why: "A telescope collects faint light and turns it into an image we can study." },
  { id: "seq-stargaze", track: "methods", prompt: "Order a good night of stargazing.", items: ["Check the weather", "Find a dark spot", "Let your eyes adapt", "Use a star map", "Spot the constellations"], why: "Planning and dark-adapted eyes make backyard stargazing far more rewarding." },
  { id: "seq-findfaint", track: "methods", prompt: "Order how to find a faint object in a telescope.", items: ["Set up on a steady mount", "Point using a bright star", "Center the area", "Look through the eyepiece", "Focus the view"], why: "Starting from a bright signpost star makes faint targets much easier to find." },
  { id: "seq-astrohist", track: "methods", prompt: "Order the history of astronomy.", items: ["Ancient sky-watchers", "Ptolemy's Earth-centred model", "Copernicus puts the Sun at the center", "Galileo's telescope", "Modern space telescopes"], why: "Astronomy grew from naked-eye watching to powerful telescopes in space." },
  { id: "seq-findplanet", track: "methods", prompt: "Order how to tell a planet from a star.", items: ["Notice a bright point of light", "See that it does not twinkle", "Check a sky map", "Watch it move over nights", "Confirm it is a planet"], why: "Planets shine steadily and drift against the stars over several nights." }
];'''
RX(r'var SEQUENCES = \[.*?\n\];', seq_js, "SEQUENCES")

# ---- theme appearance labels ----
EX('t.name === "dark" ? "Woodland dark theme" : "Bright meadow theme"',
   't.name === "dark" ? "Deep space theme" : "Daylight theme"', "theme_labels")

# ---- photo credits label ----
EX('"Species photographs are used under their respective open licenses. Image, author and license:"',
   '"Object photographs are used under their respective open licenses. Image, author and license:"', "photo_credits")

# ---- header subtitle + arcade title ----
EX('"Nature & Conservation"', '"Space & Astronomy"', "header_subtitle")
EX('"8-Bit Nature Arcade"', '"8-Bit Space Arcade"', "arcade_title")

# ---- legal disclaimer (footer) ----
RX(r'"SeaHype presents original educational content[^"]*"',
   '"AstroHype presents original educational content with links to authoritative sources. It is not affiliated with NASA, ESA, the IAU, or any agency, and is not a substitute for accredited coursework. Always follow local laws and safety guidance, and never look directly at the Sun without proper, certified solar protection."',
   "legal_footer")

# ---- library reference intro ----
RX(r'"TerraHype\'s facts are drawn from[^"]*"',
   '"AstroHype\'s facts are drawn from established astronomy and space-science references and link to these authoritative organizations. Open any to explore further. Object photos load live from Wikimedia Commons; tap the Wikimedia tag on any photo for its source page and image credits."',
   "library_ref")

# ---- about: affiliation paragraph ----
RX(r'PARA_NOAFFIL_PLACEHOLDER', 'PARA_NOAFFIL_PLACEHOLDER', "noop", count=0)
RX(r'"SeaHype is not affiliated with, endorsed by[^"]*"',
   '"AstroHype is not affiliated with, endorsed by, or sponsored by NASA, ESA, the International Astronomical Union, or any other organization referenced. Linked sources belong to their respective owners and are provided for educational reference only."',
   "about_affil")

# ---- header comment ----
src = src.replace("accredited coursework, fieldwork, or scientific-diving certification.",
                  "accredited coursework or formal instruction.")

# ---- About: educational disclaimer (marine-biology -> astronomy) ----
RX(r'" is an independent educational study and reference tool[^"]*"',
   '" is an independent educational study and reference tool. Its lessons are original explanations of well-established astronomy and space-science concepts, with links to authoritative public sources for further reading. It is not a substitute for formal instruction."',
   "about_disclaimer")

# ---- About: safety paragraph (stargazing) ----
RX(r'"Always follow local laws, regulations and safety guidance for any beach, water, boating or field activity[^"]*"',
   '"Always follow local laws and basic safety when observing outdoors at night: choose safe locations, bring a friend, and dress for the conditions. Never look directly at the Sun, and never point binoculars or a telescope at it, without proper, certified solar filters, as permanent eye damage can result."',
   "about_safety")

# ---- safety global brand replace (catches About title, privacy, trademark, warranty, review intro) ----
src = src.replace("nature & conservation study app", "space & astronomy study app")
src = src.replace("SeaHype", "AstroHype").replace("TerraHype", "AstroHype")
# ---- header comment + internal cache key (SeaHype lineage remnants) ----
src = src.replace("Marine Biology Education", "Space & Astronomy Education")
src = src.replace("accessible marine-biology", "accessible astronomy")
src = src.replace("openMarineDB", "openSpaceDB")
src = src.replace("seahype-lessons", "astrohype-lessons").replace("seahype-content", "astrohype-content")
src = src.replace('"seahype_photocache_v1"', '"astrohype_photocache_v1"')
src = src.replace("well-established marine-biology concepts", "well-established astronomy concepts")

if fails:
    print("FAILURES:")
    for f in fails: print("  ", f)
else:
    print("pass 2 OK - all replacements applied")
open(F, "w", encoding="utf-8").write(src)
print("wrote", F, "bytes", len(src))
