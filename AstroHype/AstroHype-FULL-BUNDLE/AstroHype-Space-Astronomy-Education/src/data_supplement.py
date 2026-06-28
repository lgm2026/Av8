# -*- coding: utf-8 -*-
# 35 supplementary entries to bring entry total to exactly 426.

# More stars (fauna): (id, name, sci, group, trait)
MORE_STARS = [
 ("alphecca-real","Gemma","Alphecca","blue-white star","The brightest jewel of the Northern Crown, also called Gemma, 'the jewel'."),
 ("izar","Izar","Izar","orange giant pair","A gorgeous double star in Bootes, a golden giant with a fainter blue companion."),
 ("cor-caroli","Cor Caroli","Cor Caroli","blue-white star","The brightest star of the Hunting Dogs, its name means 'Charles's heart'."),
 ("alphard-real","Unukalhai","Unukalhai","orange giant star","The brightest star of Serpens, the serpent, its name meaning 'the serpent's neck'."),
 ("ras-algethi-real","Cebalrai","Cebalrai","orange giant star","An orange giant in Ophiuchus, a quiet marker in the serpent-bearer's shoulder."),
 ("zubeneschamali","Zubeneschamali","Zubeneschamali","blue-white star","The 'northern claw' of Libra, sometimes reported as the only naked-eye star with a greenish tint."),
 ("alkalurops","Muphrid","Muphrid","yellow star","A Sun-like star close to brilliant Arcturus in the herdsman, Bootes."),
 ("rastaban","Rastaban","Rastaban","yellow giant star","One of the two 'eyes of the dragon' in Draco, beside brighter Eltanin."),
 ("alnasl","Alnasl","Alnasl","orange giant star","The star marking the tip of the spout of the Sagittarius 'teapot'."),
 ("furud","Furud","Furud","blue star","A bright blue star in the great dog, near brilliant Sirius."),
]

# More moons (flora): (id, name, sci, parent, trait)
MORE_MOONS = [
 ("ariel","Ariel","Ariel (moon)","Uranus","A bright icy moon of Uranus crossed by long canyons, its surface relatively young and smooth."),
 ("umbriel","Umbriel","Umbriel","Uranus","The darkest of the large Uranian moons, with a mysterious bright ring nicknamed the 'fluorescent cheerio'."),
 ("janus","Janus","Janus (moon)","Saturn","A small moon of Saturn that swaps orbits with its twin Epimetheus every few years in a slow cosmic dance."),
 ("pan-moon","Pan","Pan (moon)","Saturn","A tiny moon shaped like a ravioli that orbits inside a gap in Saturn's rings, sweeping the gap clear."),
 ("daphnis","Daphnis","Daphnis (moon)","Saturn","A tiny moon whose gravity raises waves in the edges of the ring gap it orbits within."),
 ("larissa","Larissa","Larissa (moon)","Neptune","A small, lumpy inner moon of Neptune, discovered as Voyager 2 flew past in 1989."),
]

# Meteor showers (flora, solar-system phenomena): (id, name, sci, trait)
SHOWERS = [
 ("perseids","Perseids","Perseids","A reliable, bright August meteor shower, the dusty trail left behind by Comet Swift-Tuttle."),
 ("geminids","Geminids","Geminids","One of the richest meteor showers of the year each December, debris not from a comet but from an odd rocky asteroid."),
 ("leonids","Leonids","Leonids","A November shower that occasionally erupts into a dazzling storm of thousands of meteors an hour."),
 ("orionids","Orionids","Orionids","An October shower of fast meteors, made of dust shed long ago by Halley's Comet."),
 ("quadrantids","Quadrantids","Quadrantids","A brief but intense January shower, named for a constellation that no longer officially exists."),
 ("lyrids","Lyrids","Lyrids","One of the oldest recorded meteor showers, lighting up April skies for thousands of years."),
 ("eta-aquariids","Eta Aquariids","Eta Aquariids","A May shower of swift meteors, the second yearly gift of dust from Halley's Comet."),
 ("taurids","Taurids","Taurids","A long, slow autumn shower famous for producing especially bright, fireball-like meteors."),
]

# More exoplanets / systems (habitats): (id, name, sci, cat, group, trait)
MORE_EXO = [
 ("hd-209458b","Osiris (HD 209458 b)","HD 209458 b","exoplanet","hot Jupiter","The first exoplanet seen crossing its star and the first with an atmosphere detected; it is so hot it is evaporating."),
 ("kepler-186f","Kepler-186f","Kepler-186f","exoplanet","Earth-sized planet","The first Earth-sized planet found in the habitable zone of another star, where water could be liquid."),
 ("wasp-12b","WASP-12b","WASP-12b","exoplanet","hot Jupiter","One of the hottest known planets, a doomed giant being stretched into an egg shape and slowly eaten by its star."),
 ("gliese-581g-placeholder","Gliese 667 Cc","Gliese 667 Cc","exoplanet","super-Earth","A rocky 'super-Earth' orbiting a red dwarf in a triple-star system, within the zone where water could exist."),
 ("55-cancri-e","55 Cancri e","55 Cancri e","exoplanet","lava world","A scorching rocky world so close to its star that its surface may be an ocean of molten lava."),
]

# More comets/asteroids (flora): (id, name, sci, cat, group, hab, habKey, trait)
MORE_SMALL = [
 ("comet-tempel-tuttle","Comet Tempel-Tuttle","Comet Tempel–Tuttle","comet","periodic comet","the inner Solar System","comet",
  "The parent comet of the Leonid meteor shower, returning roughly every 33 years."),
 ("comet-swift-tuttle","Comet Swift-Tuttle","Comet Swift–Tuttle","comet","periodic comet","the inner Solar System","comet",
  "A large comet whose dusty trail Earth plows through every August to create the Perseid meteor shower."),
 ("comet-shoemaker-levy","Comet Shoemaker-Levy 9","Comet Shoemaker–Levy 9","comet","disrupted comet","the outer Solar System","comet",
  "Torn into a string of fragments by Jupiter's gravity, it slammed into the giant planet in 1994 as the world watched."),
 ("apophis","Apophis","99942 Apophis","asteroid","near-Earth asteroid","the inner Solar System","innerss",
  "A near-Earth asteroid that will pass closer than some satellites in 2029, though it poses no danger of hitting us."),
 ("psyche-asteroid","16 Psyche","16 Psyche","asteroid","metal-rich asteroid","the asteroid belt","belt",
  "A large asteroid thought to be unusually rich in metal, possibly the exposed core of a shattered baby planet."),
 ("chiron","Chiron","2060 Chiron","asteroid","centaur object","the outer Solar System","kuiper",
  "A strange icy body orbiting among the giant planets that behaves partly like an asteroid and partly like a comet."),
]

def build():
    out = []
    for sid,name,sci,group,trait in MORE_STARS:
        out.append({"id":sid,"name":name,"sci":sci,"cat":"star","group":group,
            "hab":"our Milky Way galaxy","habKey":"milkyway",
            "flavor":"Like all stars, it shines by fusing lighter elements into heavier ones in its core.",
            "art":"star","trait":trait,"track":"fauna",
            "termA":["Star","A glowing ball of gas, like the Sun, that makes its own light by nuclear fusion."],
            "termB":["Light-year","The distance light travels in one year, about 9.5 trillion kilometres."]})
    for mid,name,sci,parent,trait in MORE_MOONS:
        out.append({"id":mid,"name":name,"sci":sci,"cat":"moon","group":"natural moon",
            "hab":"orbit around "+parent,"habKey":"moon",
            "flavor":"Like all moons, it orbits a planet rather than the Sun directly.",
            "art":"moon","trait":trait,"track":"flora",
            "termA":["Moon","A natural object that orbits a planet, dwarf planet, or asteroid."],
            "termB":["Orbit","The curved, repeating path one object takes around another under gravity."]})
    for sid,name,sci,trait in SHOWERS:
        out.append({"id":sid,"name":name,"sci":sci,"cat":"meteor shower","group":"annual meteor shower",
            "hab":"Earth's night sky","habKey":"comet",
            "flavor":"Like all meteor showers, it happens when Earth sweeps through the dusty trail left by a comet or asteroid.",
            "art":"comet","trait":trait,"track":"flora",
            "termA":["Meteor shower","A burst of 'shooting stars' seen when Earth passes through a trail of comet or asteroid dust."],
            "termB":["Meteor","The streak of light made when a tiny bit of space dust burns up in Earth's atmosphere."]})
    for eid,name,sci,cat,group,trait in MORE_EXO:
        out.append({"id":eid,"name":name,"sci":sci,"cat":"exoplanet","group":group,
            "hab":"the distant universe","habKey":"deepspace",
            "flavor":"Like all exoplanets, it orbits a star far beyond our own Sun.",
            "art":"planet","trait":trait,"track":"habitats",
            "termA":["Exoplanet","A planet that orbits a star other than our Sun."],
            "termB":["Habitable zone","The band around a star where a planet could have liquid water on its surface."]})
    for sid,name,sci,cat,group,hab,habKey,trait in MORE_SMALL:
        termA = {"comet":["Comet","An icy body that grows a glowing tail of gas and dust when it nears the Sun."],
                 "asteroid":["Asteroid","A small rocky body orbiting the Sun, most found in the belt between Mars and Jupiter."]}[cat]
        termB = {"comet":["Tail","The glowing streamer of gas and dust a comet grows as the Sun heats it."],
                 "innerss":["Near-Earth object","An asteroid or comet whose orbit brings it close to Earth's neighbourhood."],
                 "belt":["Asteroid belt","The ring of rocky asteroids orbiting the Sun between Mars and Jupiter."],
                 "kuiper":["Kuiper Belt","A vast ring of icy bodies beyond Neptune."]}[habKey]
        out.append({"id":sid,"name":name,"sci":sci,"cat":cat,"group":group,"hab":hab,"habKey":habKey,
            "flavor":({"comet":"Like all comets, it is a chunk of ice and dust that grows a glowing tail near the Sun.",
                       "asteroid":"Like all asteroids, it is a small rocky leftover from the building of the planets."}[cat]),
            "art":("comet" if cat=="comet" else "asteroid"),"trait":trait,"track":"flora",
            "termA":termA,"termB":termB})
    return out

if __name__ == "__main__":
    b=build(); print(len(b),"supplement")
    ids=[x["id"] for x in b]; assert len(ids)==len(set(ids)); print("unique ok")
