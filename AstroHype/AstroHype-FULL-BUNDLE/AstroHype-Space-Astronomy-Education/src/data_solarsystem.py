# -*- coding: utf-8 -*-
# Solar System bodies. All assigned track "flora" (The Solar System).

# Planets + Sun: (id, name, sci/query, group, hab, habKey, flavor, art, trait, cat)
PLANETS = [
 ("the-sun","The Sun","Sun","G-type main-sequence star","the center of our Solar System","sun",
  "Like all stars, it shines by fusing hydrogen into helium deep in its core.","sun",
  "It holds 99.8% of all the mass in the Solar System, and over a million Earths could fit inside it.","star"),
 ("mercury","Mercury","Mercury (planet)","small rocky planet","the inner Solar System","innerss",
  "Like all planets, it orbits the Sun and shines only by reflected sunlight.","planet",
  "The smallest planet and the closest to the Sun, it swings from scorching day heat to deep night cold.","planet"),
 ("venus","Venus","Venus","rocky planet","the inner Solar System","innerss",
  "Like all planets, it orbits the Sun and shines only by reflected sunlight.","planet",
  "Wrapped in a thick carbon-dioxide blanket, it is the hottest planet, hot enough to melt lead at its surface.","planet"),
 ("earth","Earth","Earth","rocky planet","the inner Solar System","innerss",
  "Like all planets, it orbits the Sun and shines only by reflected sunlight.","planet",
  "The only world known to host life, its surface is most covered by liquid water and a breathable atmosphere.","planet"),
 ("mars","Mars","Mars","rocky planet","the inner Solar System","innerss",
  "Like all planets, it orbits the Sun and shines only by reflected sunlight.","planet",
  "The 'red planet' is rusty with iron oxide and home to Olympus Mons, the tallest volcano in the Solar System.","planet"),
 ("jupiter","Jupiter","Jupiter","gas giant planet","the outer Solar System","outerss",
  "Like all planets, it orbits the Sun and shines only by reflected sunlight.","planet",
  "The largest planet by far, its Great Red Spot is a storm wider than the whole Earth that has raged for centuries.","planet"),
 ("saturn","Saturn","Saturn","gas giant planet","the outer Solar System","outerss",
  "Like all planets, it orbits the Sun and shines only by reflected sunlight.","planet",
  "Famous for its dazzling rings of ice and rock, it is so light it would float in a big enough bathtub of water.","planet"),
 ("uranus","Uranus","Uranus","ice giant planet","the outer Solar System","outerss",
  "Like all planets, it orbits the Sun and shines only by reflected sunlight.","planet",
  "This pale blue-green ice giant is tipped right over on its side, so it seems to roll around the Sun.","planet"),
 ("neptune","Neptune","Neptune","ice giant planet","the outer Solar System","outerss",
  "Like all planets, it orbits the Sun and shines only by reflected sunlight.","planet",
  "The most distant planet, this deep-blue ice giant has the fastest winds in the Solar System, over 2,000 km/h.","planet"),
]

# Dwarf planets and small bodies: (id, name, sci, group, hab, habKey, art, trait, cat)
SMALL_BODIES = [
 ("pluto","Pluto","Pluto","dwarf planet","the Kuiper Belt","kuiper","dwarf",
  "Once counted as the ninth planet, it was reclassified as a dwarf planet in 2006 and has a giant heart-shaped plain of ice.","dwarf planet"),
 ("ceres","Ceres","Ceres (dwarf planet)","dwarf planet","the asteroid belt","belt","dwarf",
  "The largest object in the asteroid belt and the only dwarf planet in the inner Solar System; it may hide salty water beneath its crust.","dwarf planet"),
 ("eris","Eris","Eris (dwarf planet)","dwarf planet","the Kuiper Belt","kuiper","dwarf",
  "A distant icy dwarf planet nearly the same size as Pluto, whose discovery sparked the great 'what is a planet' debate.","dwarf planet"),
 ("haumea","Haumea","Haumea","dwarf planet","the Kuiper Belt","kuiper","dwarf",
  "Spinning so fast it is stretched into an egg shape, this icy dwarf planet even has its own thin ring.","dwarf planet"),
 ("makemake","Makemake","Makemake","dwarf planet","the Kuiper Belt","kuiper","dwarf",
  "A reddish dwarf planet of the far Kuiper Belt, named after a creation god of Easter Island.","dwarf planet"),
 ("vesta","Vesta","4 Vesta","large asteroid","the asteroid belt","belt","asteroid",
  "One of the largest asteroids and the brightest, it is occasionally just visible to the naked eye from a dark sky.","asteroid"),
 ("pallas","Pallas","2 Pallas","large asteroid","the asteroid belt","belt","asteroid",
  "One of the first asteroids ever found, it follows an unusually tilted path through the asteroid belt.","asteroid"),
 ("hygiea","Hygiea","10 Hygiea","large asteroid","the asteroid belt","belt","asteroid",
  "The fourth-largest asteroid, it is so round that some astronomers argue it should count as a dwarf planet."  ,"asteroid"),
 ("juno-ast","Juno","3 Juno","asteroid","the asteroid belt","belt","asteroid",
  "One of the earliest asteroids discovered, a large stony body in the main belt."  ,"asteroid"),
 ("eros","Eros","433 Eros","near-Earth asteroid","the inner Solar System","innerss","asteroid",
  "A peanut-shaped asteroid that swings near Earth; in 2001 a spacecraft became the first ever to land on an asteroid here.","asteroid"),
 ("bennu","Bennu","101955 Bennu","near-Earth asteroid","the inner Solar System","innerss","asteroid",
  "A dark, rubble-pile asteroid visited by OSIRIS-REx, which scooped up a sample and returned it to Earth in 2023.","asteroid"),
 ("ryugu","Ryugu","162173 Ryugu","near-Earth asteroid","the inner Solar System","innerss","asteroid",
  "A spinning-top-shaped asteroid sampled by Japan's Hayabusa2, helping reveal the building blocks of the early Solar System.","asteroid"),
 ("itokawa","Itokawa","25143 Itokawa","near-Earth asteroid","the inner Solar System","innerss","asteroid",
  "The first asteroid ever sampled, by Japan's original Hayabusa mission, it is a loose pile of rubble shaped like a sea otter.","asteroid"),
 ("arrokoth","Arrokoth","Arrokoth","Kuiper Belt object","the Kuiper Belt","kuiper","asteroid",
  "The most distant object ever explored up close, this snowman-shaped world was visited by New Horizons in 2019.","asteroid"),
 ("sedna","Sedna","90377 Sedna","trans-Neptunian object","the outer Solar System","kuiper","dwarf",
  "An extremely distant reddish world on a 11,000-year orbit that carries it far beyond the Kuiper Belt."  ,"dwarf planet"),
 ("halley","Halley's Comet","Halley's Comet","periodic comet","the inner Solar System","comet","comet",
  "The most famous comet of all, it sweeps past Earth about every 76 years and last appeared in 1986."  ,"comet"),
 ("hale-bopp","Comet Hale-Bopp","Comet Hale–Bopp","comet","the inner Solar System","comet","comet",
  "A spectacular 'great comet' of 1997, it was visible to the naked eye for a record 18 months."  ,"comet"),
 ("halebopp-neowise","Comet NEOWISE","Comet NEOWISE","comet","the inner Solar System","comet","comet",
  "A bright comet that delighted skywatchers in 2020, sporting a long dusty tail in the evening sky."  ,"comet"),
 ("comet-encke","Comet Encke","Comet Encke","periodic comet","the inner Solar System","comet","comet",
  "The comet with the shortest known orbit, returning every 3.3 years; its dust feeds an annual meteor shower."  ,"comet"),
 ("oumuamua","Oumuamua","ʻOumuamua","interstellar object","beyond the Solar System","interstellar","comet",
  "The first known visitor from another star system, a strange elongated object that zipped through in 2017."  ,"comet"),
]

# Moons: (id, name, sci, parent, art, trait)
MOONS = [
 ("the-moon","The Moon","Moon","Earth","moon",
  "Earth's only natural satellite, its gravity drives the ocean tides and it is the only world beyond Earth humans have walked on."),
 ("io","Io","Io (moon)","Jupiter","moon",
  "The most volcanically active world in the Solar System, dotted with hundreds of erupting volcanoes."),
 ("europa","Europa","Europa (moon)","Jupiter","moon",
  "Beneath its smooth icy shell lies a deep salty ocean, making it one of the best places to search for alien life."),
 ("ganymede","Ganymede","Ganymede (moon)","Jupiter","moon",
  "The largest moon in the Solar System, bigger even than the planet Mercury, and the only moon with its own magnetic field."),
 ("callisto","Callisto","Callisto (moon)","Jupiter","moon",
  "One of the most heavily cratered worlds known, its ancient surface is a frozen record of billions of years of impacts."),
 ("titan","Titan","Titan (moon)","Saturn","moon",
  "Saturn's giant moon has a thick orange atmosphere and rivers and lakes of liquid methane, the only other surface liquid known."),
 ("enceladus","Enceladus","Enceladus","Saturn","moon",
  "This bright icy moon shoots geysers of water into space from a hidden ocean, hinting it could be habitable."),
 ("mimas","Mimas","Mimas (moon)","Saturn","moon",
  "A small icy moon with one huge crater that makes it look strikingly like the Death Star."),
 ("rhea","Rhea","Rhea (moon)","Saturn","moon",
  "Saturn's second-largest moon, a cold, cratered ball of ice and rock."),
 ("iapetus","Iapetus","Iapetus (moon)","Saturn","moon",
  "A two-faced moon, jet black on one side and bright white on the other, circled by a strange equatorial ridge."),
 ("dione","Dione","Dione (moon)","Saturn","moon",
  "An icy Saturnian moon laced with bright cliffs of fractured ice."),
 ("tethys","Tethys","Tethys (moon)","Saturn","moon",
  "A nearly pure-ice moon of Saturn scarred by an enormous canyon stretching most of the way around it."),
 ("titania","Titania","Titania (moon)","Uranus","moon",
  "The largest moon of Uranus, an icy world cut by huge canyons."),
 ("oberon","Oberon","Oberon (moon)","Uranus","moon",
  "The outermost large moon of Uranus, an old, dark, heavily cratered ball of ice and rock."),
 ("miranda","Miranda","Miranda (moon)","Uranus","moon",
  "A small moon with one of the strangest surfaces known, a jumble of cliffs, grooves and terraces."),
 ("triton","Triton","Triton (moon)","Neptune","moon",
  "Neptune's giant moon orbits backwards, hinting it was captured, and it spouts icy nitrogen geysers."),
 ("phobos","Phobos","Phobos (moon)","Mars","moon",
  "The larger of Mars's two tiny moons, it orbits so low and fast that it rises in the west and sets in the east."),
 ("deimos","Deimos","Deimos (moon)","Mars","moon",
  "The smaller, outer moon of Mars, a tiny lumpy rock barely 12 kilometres across."),
 ("charon","Charon","Charon (moon)","Pluto","moon",
  "Pluto's huge moon is half the size of Pluto itself, so the two whirl around a point in empty space between them."),
 ("amalthea","Amalthea","Amalthea (moon)","Jupiter","moon",
  "A small, reddish, potato-shaped inner moon of Jupiter, one of the reddest objects in the Solar System."),
 ("hyperion","Hyperion","Hyperion (moon)","Saturn","moon",
  "A spongy-looking moon of Saturn that tumbles chaotically, never showing the same face twice."),
 ("phoebe","Phoebe","Phoebe (moon)","Saturn","moon",
  "A dark, distant moon of Saturn that orbits backwards, likely a captured object from the outer Solar System."),
 ("nereid","Nereid","Nereid (moon)","Neptune","moon",
  "A small moon of Neptune on one of the most stretched-out, lopsided orbits of any moon."),
 ("proteus","Proteus","Proteus (moon)","Neptune","moon",
  "A dark, boxy moon of Neptune, about as large as a moon can be while still being lumpy rather than round."),
]

def build():
    out = []
    # planets + sun
    for pid,name,sci,group,hab,habKey,flavor,art,trait,cat in PLANETS:
        out.append({"id":pid,"name":name,"sci":sci,"cat":cat,"group":group,"hab":hab,"habKey":habKey,
            "flavor":flavor,"art":art,"trait":trait,"track":"flora",
            "termA":["Planet","A large round world that orbits the Sun and has cleared its path of other objects."] if cat=="planet" else ["Star","A glowing ball of gas that makes its own light by nuclear fusion."],
            "termB":["Solar System","The Sun together with everything bound to it by gravity: planets, moons, asteroids and comets."]})
    # small bodies
    for sid,name,sci,group,hab,habKey,art,trait,cat in SMALL_BODIES:
        termA = {
          "dwarf planet":["Dwarf planet","A round world orbiting the Sun that has not cleared other objects from its path, like Pluto."],
          "asteroid":["Asteroid","A small rocky body orbiting the Sun, most found in the belt between Mars and Jupiter."],
          "comet":["Comet","An icy body that grows a glowing tail of gas and dust when it nears the Sun."],
        }[cat]
        termB = {
          "kuiper":["Kuiper Belt","A vast ring of icy bodies beyond Neptune, home to Pluto and many other small worlds."],
          "belt":["Asteroid belt","The ring of rocky asteroids that orbits the Sun between Mars and Jupiter."],
          "comet":["Tail","The glowing streamer of gas and dust that a comet grows as the Sun heats it."],
          "innerss":["Near-Earth object","An asteroid or comet whose orbit brings it close to Earth's neighbourhood."],
          "interstellar":["Interstellar object","A body that formed around another star and is just passing through our Solar System."],
        }[habKey]
        out.append({"id":sid,"name":name,"sci":sci,"cat":cat,"group":group,"hab":hab,"habKey":habKey,
            "flavor":({"dwarf planet":"Like all dwarf planets, it orbits the Sun and is round, but shares its zone with other bodies.",
                       "asteroid":"Like all asteroids, it is a small rocky leftover from the building of the planets.",
                       "comet":"Like all comets, it is a chunk of ice and dust that grows a glowing tail near the Sun."}[cat]),
            "art":art,"trait":trait,"track":"flora","termA":termA,"termB":termB})
    # moons
    for mid,name,sci,parent,art,trait in MOONS:
        out.append({"id":mid,"name":name,"sci":sci,"cat":"moon","group":"natural moon",
            "hab":"orbit around "+parent,"habKey":"moon",
            "flavor":"Like all moons, it orbits a planet or other world rather than the Sun directly.",
            "art":art,"trait":trait,"track":"flora",
            "termA":["Moon","A natural object that orbits a planet, dwarf planet, or asteroid."],
            "termB":["Orbit","The curved, repeating path one object takes around another under gravity."]})
    return out

if __name__ == "__main__":
    b = build()
    print(len(b), "solar system bodies")
    ids=[x["id"] for x in b]; assert len(ids)==len(set(ids)); print("unique ok")
