# -*- coding: utf-8 -*-
# Missions/spacecraft (track "conservation"), telescopes (track "conservation"),
# and exotic objects (track "habitats").

# Missions: (id, name, sci/query, group, trait)
MISSIONS = [
 ("apollo-11","Apollo 11","Apollo 11","crewed Moon mission","In July 1969 it carried the first humans to walk on the Moon, as Neil Armstrong took 'one giant leap for mankind'."),
 ("apollo-8","Apollo 8","Apollo 8","crewed Moon mission","The first crewed mission to leave Earth orbit and circle the Moon, returning the famous 'Earthrise' photograph."),
 ("apollo-13","Apollo 13","Apollo 13","crewed Moon mission","After an oxygen tank exploded on the way to the Moon, its crew was brought safely home in a tense rescue."),
 ("apollo-17","Apollo 17","Apollo 17","crewed Moon mission","The last time humans walked on the Moon, in 1972, and the only Apollo flight to carry a trained geologist."),
 ("voyager-1","Voyager 1","Voyager 1","interstellar probe","Launched in 1977, it is the most distant human-made object, now sailing in interstellar space beyond the planets."),
 ("voyager-2","Voyager 2","Voyager 2","planetary probe","The only spacecraft ever to fly past all four giant planets: Jupiter, Saturn, Uranus and Neptune."),
 ("cassini","Cassini","Cassini–Huygens","Saturn orbiter","It spent 13 years studying Saturn and its moons before plunging into the planet in a planned 'grand finale'."),
 ("huygens","Huygens probe","Huygens (spacecraft)","Titan lander","It parachuted down to Titan in 2005, the first landing on a world in the outer Solar System."),
 ("new-horizons","New Horizons","New Horizons","flyby probe","After a nine-year journey it gave us our first close-up views of Pluto in 2015, then flew on into the Kuiper Belt."),
 ("juno","Juno","Juno (spacecraft)","Jupiter orbiter","It loops over Jupiter's poles, peering beneath the clouds to study the giant planet's deep interior."),
 ("galileo-probe","Galileo","Galileo (spacecraft)","Jupiter orbiter","The first spacecraft to orbit Jupiter, it dropped a probe into the planet's atmosphere and studied its moons."),
 ("pioneer-10","Pioneer 10","Pioneer 10","flyby probe","The first spacecraft to cross the asteroid belt and fly past Jupiter, carrying a plaque meant for any aliens who find it."),
 ("pioneer-11","Pioneer 11","Pioneer 11","flyby probe","It made the first flyby of Saturn, scouting a path the Voyagers would later follow."),
 ("curiosity","Curiosity","Curiosity (rover)","Mars rover","A car-sized rover that has roamed Mars since 2012, finding signs that the planet once had lakes and rivers."),
 ("perseverance","Perseverance","Perseverance (rover)","Mars rover","It landed in 2021 to hunt for signs of ancient life and is caching rock samples for a future return to Earth."),
 ("opportunity","Opportunity","Opportunity (rover)","Mars rover","Built to last 90 days, this plucky rover explored Mars for nearly 15 years before a dust storm ended its mission."),
 ("spirit-rover","Spirit","Spirit (rover)","Mars rover","Opportunity's twin, it found mineral evidence that water once flowed on the surface of Mars."),
 ("sojourner","Sojourner","Sojourner (rover)","Mars rover","The first rover to drive on Mars, a microwave-oven-sized robot that landed in 1997."),
 ("ingenuity","Ingenuity","Ingenuity (helicopter)","Mars helicopter","The first aircraft to fly on another planet, this tiny helicopter made dozens of flights in Mars's thin air."),
 ("viking-1","Viking 1","Viking 1","Mars lander","It made the first fully successful landing on Mars in 1976 and sent back the first pictures from the surface."),
 ("insight","InSight","InSight","Mars lander","A stationary lander that listened for 'marsquakes' to map the hidden interior of the red planet."),
 ("mariner-2","Mariner 2","Mariner 2","flyby probe","The first spacecraft to successfully fly past another planet, reaching Venus in 1962."),
 ("mariner-4","Mariner 4","Mariner 4","flyby probe","It returned the first close-up photos of Mars in 1965, revealing a cratered, desert world."),
 ("mariner-9","Mariner 9","Mariner 9","Mars orbiter","The first spacecraft to orbit another planet, mapping nearly all of Mars from above."),
 ("mariner-10","Mariner 10","Mariner 10","flyby probe","The first probe to visit Mercury and the first to use a planet's gravity as a slingshot to reach another."),
 ("messenger","MESSENGER","MESSENGER","Mercury orbiter","The first spacecraft to orbit Mercury, it mapped the whole planet and found ice hidden in its polar craters."),
 ("magellan-probe","Magellan","Magellan (spacecraft)","Venus orbiter","Using radar to see through the clouds, it mapped almost the entire surface of Venus."),
 ("parker-solar-probe","Parker Solar Probe","Parker Solar Probe","solar probe","The fastest spacecraft ever built, it flies through the Sun's scorching outer atmosphere to study our star up close."),
 ("soho","SOHO","Solar and Heliospheric Observatory","solar observatory","A spacecraft that watches the Sun around the clock and has discovered thousands of comets along the way."),
 ("dawn-probe","Dawn","Dawn (spacecraft)","asteroid orbiter","The first mission to orbit two different worlds, the giant asteroid Vesta and the dwarf planet Ceres."),
 ("rosetta","Rosetta","Rosetta (spacecraft)","comet orbiter","The first spacecraft to orbit a comet and deliver a lander, Philae, onto its icy surface."),
 ("philae","Philae lander","Philae (spacecraft)","comet lander","The first probe ever to make a soft landing on the surface of a comet, in 2014."),
 ("stardust","Stardust","Stardust (spacecraft)","comet sample mission","It flew through a comet's tail, captured dust grains, and returned them to Earth in a capsule."),
 ("deep-impact","Deep Impact","Deep Impact (spacecraft)","comet impactor","It fired a heavy slug into a comet to blast out a crater and study what comets are made of inside."),
 ("osiris-rex","OSIRIS-REx","OSIRIS-REx","asteroid sample mission","It grabbed a sample from asteroid Bennu and dropped it to Earth in 2023 for scientists to study."),
 ("hayabusa","Hayabusa","Hayabusa","asteroid sample mission","Japan's mission that returned the first-ever sample from an asteroid, despite a string of breakdowns."),
 ("hayabusa2","Hayabusa2","Hayabusa2","asteroid sample mission","It collected material from asteroid Ryugu, even firing a projectile to expose buried rock."),
 ("dart-mission","DART","Double Asteroid Redirection Test","planetary defence test","The first test of planetary defence, it deliberately crashed into a small asteroid to nudge its orbit."),
 ("juice-mission","JUICE","Jupiter Icy Moons Explorer","Jupiter moon orbiter","Europe's mission, launched in 2023, to study Jupiter's icy ocean moons Ganymede, Callisto and Europa."),
 ("europa-clipper","Europa Clipper","Europa Clipper","Jupiter moon orbiter","A mission to make dozens of close flybys of Europa to find out whether its hidden ocean could support life."),
 ("sputnik-1","Sputnik 1","Sputnik 1","artificial satellite","The first artificial satellite, launched by the Soviet Union in 1957, which started the space age."),
 ("explorer-1","Explorer 1","Explorer 1","artificial satellite","The first U.S. satellite, it discovered the Van Allen belts of radiation circling the Earth."),
 ("vostok-1","Vostok 1","Vostok 1","crewed spacecraft","It carried Yuri Gagarin, the first human in space, on a single orbit of Earth in 1961."),
 ("mercury-friendship-7","Friendship 7","Mercury-Atlas 6","crewed spacecraft","It carried John Glenn, the first American to orbit the Earth, in 1962."),
 ("gemini-program","Project Gemini","Project Gemini","crewed spacecraft","A series of two-person flights that practised the spacewalks and dockings needed to reach the Moon."),
 ("space-shuttle","Space Shuttle","Space Shuttle","reusable spacecraft","The first reusable crewed spacecraft, it launched satellites and helped build the space station over 30 years."),
 ("iss","International Space Station","International Space Station","space station","A football-field-sized laboratory orbiting Earth, continuously crewed by astronauts from many nations since 2000."),
 ("skylab","Skylab","Skylab","space station","The first American space station, where crews lived and worked in orbit in the 1970s."),
 ("mir","Mir","Mir","space station","A long-lived Soviet and Russian space station that set records for the longest human stays in space."),
 ("crew-dragon","Crew Dragon","Crew Dragon","crewed spacecraft","A modern reusable capsule that in 2020 returned crewed launches to the United States after a long gap."),
 ("artemis-1","Artemis 1","Artemis 1","Moon mission","The first flight of the program meant to return humans to the Moon, sending an uncrewed capsule around it in 2022."),
 ("luna-2","Luna 2","Luna 2","Moon impactor","The first human-made object to reach another world, crash-landing on the Moon in 1959."),
 ("luna-3","Luna 3","Luna 3","Moon flyby probe","It sent back the first-ever photographs of the far side of the Moon, which no one had seen before."),
 ("change-4","Chang'e 4","Chang'e 4","Moon lander","The first spacecraft to land softly on the far side of the Moon, in 2019."),
 ("change-5","Chang'e 5","Chang'e 5","Moon sample mission","It returned fresh samples of Moon rock to Earth in 2020, the first such return in over 40 years."),
 ("chandrayaan-3","Chandrayaan-3","Chandrayaan-3","Moon lander","India's mission that in 2023 made the first soft landing near the Moon's south pole."),
 ("surveyor-1","Surveyor 1","Surveyor 1","Moon lander","An early robotic lander that proved the lunar surface was firm enough for astronauts to stand on."),
 ("lunar-reconnaissance-orbiter","Lunar Reconnaissance Orbiter","Lunar Reconnaissance Orbiter","Moon orbiter","It maps the Moon in fine detail and has even photographed the Apollo landing sites from above."),
 ("venera-7","Venera 7","Venera 7","Venus lander","The first spacecraft to land on another planet and send back data, surviving briefly on the searing surface of Venus."),
 ("akatsuki","Akatsuki","Akatsuki (spacecraft)","Venus orbiter","Japan's orbiter that studies the raging super-fast winds and weather of Venus."),
 ("mars-express","Mars Express","Mars Express","Mars orbiter","Europe's long-running Mars orbiter, which discovered signs of water ice and possible underground lakes."),
 ("mars-reconnaissance-orbiter","Mars Reconnaissance Orbiter","Mars Reconnaissance Orbiter","Mars orbiter","Carrying the most powerful camera ever sent to another planet, it scouts landing sites and studies the surface."),
 ("maven","MAVEN","MAVEN","Mars orbiter","It studies how Mars lost most of its atmosphere to space, turning a once-wet world into a cold desert."),
 ("tianwen-1","Tianwen-1","Tianwen-1","Mars mission","China's first Mars mission, which delivered the Zhurong rover to the surface in 2021."),
 ("kepler-mission","Kepler","Kepler space telescope","planet-hunting telescope","It stared at one patch of sky for years and discovered thousands of planets around other stars."),
 ("tess-mission","TESS","Transiting Exoplanet Survey Satellite","planet-hunting telescope","It scans almost the whole sky for the tiny dips in starlight that reveal planets passing in front of stars."),
 ("gaia-mission","Gaia","Gaia (spacecraft)","astrometry telescope","It is making the most precise three-dimensional map ever of more than a billion stars in our galaxy."),
 ("new-horizons-kbo","Lucy mission","Lucy (spacecraft)","asteroid flyby probe","On a twelve-year tour, it is the first mission to visit the Trojan asteroids that share Jupiter's orbit."),
 ("psyche-mission","Psyche","Psyche (spacecraft)","asteroid orbiter","A mission to a strange metal-rich asteroid that may be the exposed core of an ancient shattered world."),
 ("juno-placeholder","BepiColombo","BepiColombo","Mercury mission","A joint European and Japanese mission cruising toward Mercury to study the smallest, least-explored inner planet."),
 ("solar-orbiter","Solar Orbiter","Solar Orbiter","solar observatory","It took the first close-up images of the Sun's poles, regions no spacecraft had clearly seen before."),
 ("cluster-mission","Apollo Lunar Module","Apollo Lunar Module","Moon lander","The spidery craft that actually carried Apollo astronauts down to the lunar surface and back up to orbit."),
]

# Telescopes/observatories: (id, name, sci/query, group, trait)
TELESCOPES = [
 ("hubble-telescope","Hubble Space Telescope","Hubble Space Telescope","space telescope","Orbiting above the blurring air since 1990, it has taken some of the most famous and detailed images of the universe."),
 ("james-webb-telescope","James Webb Space Telescope","James Webb Space Telescope","space telescope","The largest space telescope ever launched, it sees in infrared light to peer at the very first galaxies."),
 ("spitzer-telescope","Spitzer Space Telescope","Spitzer Space Telescope","space telescope","An infrared observatory that studied warm dust, forming stars and distant galaxies hidden from ordinary telescopes."),
 ("chandra-observatory","Chandra X-ray Observatory","Chandra X-ray Observatory","space telescope","It views the universe in X-rays, revealing black holes, exploded stars and superheated gas."),
 ("hertz-placeholder","Compton Gamma Ray Observatory","Compton Gamma Ray Observatory","space telescope","It studied the universe's most violent events in gamma rays, the highest-energy light of all."),
 ("vlt","Very Large Telescope","Very Large Telescope","ground telescope","Four giant telescopes in the Chilean desert that can join their light to see incredibly fine detail."),
 ("keck-observatory","Keck Observatory","W. M. Keck Observatory","ground telescope","Its twin ten-metre telescopes atop a Hawaiian volcano are among the most powerful on Earth."),
 ("alma","ALMA","Atacama Large Millimeter Array","radio telescope","Dozens of dishes high in the Andes work together to study cold gas and the dusty discs where planets form."),
 ("arecibo","Arecibo Telescope","Arecibo Telescope","radio telescope","For decades the world's largest single radio dish, nestled in a Puerto Rican sinkhole, until it collapsed in 2020."),
 ("green-bank","Green Bank Telescope","Green Bank Telescope","radio telescope","The largest fully steerable radio telescope on Earth, listening to the faint radio whispers of the cosmos."),
 ("vla","Very Large Array","Very Large Array","radio telescope","A Y-shaped array of 27 movable dishes in New Mexico, famous from films, that studies radio waves from space."),
 ("event-horizon-telescope","Event Horizon Telescope","Event Horizon Telescope","radio telescope","A network of dishes across the planet that linked up to capture the first-ever image of a black hole."),
 ("gemini-observatory","Gemini Observatory","Gemini Observatory","ground telescope","A pair of twin telescopes, one in each hemisphere, that together can study the entire sky."),
 ("subaru-telescope","Subaru Telescope","Subaru Telescope","ground telescope","A large Japanese telescope in Hawaii known for its exceptionally wide and detailed views of the sky."),
 ("ligo","LIGO","LIGO","gravitational-wave detector","Not a telescope for light but for ripples in space itself, it made the first detection of gravitational waves in 2015."),
 ("extremely-large-telescope","Extremely Large Telescope","Extremely Large Telescope","ground telescope","Under construction in Chile, its 39-metre mirror will make it by far the largest optical telescope on Earth."),
]

# Exotic objects (track "habitats" -> Cosmology & Exotica): (id, name, sci, cat, group, trait)
EXOTICA = [
 ("sagittarius-a-star","Sagittarius A*","Sagittarius A*","black hole","supermassive black hole","The giant black hole at the very center of our Milky Way, weighing about four million Suns."),
 ("ton-618-placeholder","TON 618","TON 618","quasar","ultramassive black hole","One of the most massive black holes known, powering a brilliant quasar in the distant universe."),
 ("cygnus-x-1","Cygnus X-1","Cygnus X-1","black hole","stellar black hole","One of the first black holes ever discovered, pulling gas off a giant companion star into a glowing disk."),
 ("crab-pulsar","Crab Pulsar","Crab Pulsar","pulsar","neutron star","A city-sized spinning neutron star at the heart of the Crab Nebula, flashing about 30 times every second."),
 ("vela-pulsar","Vela Pulsar","Vela Pulsar","pulsar","neutron star","The leftover core of an exploded star, a dense neutron star spinning many times each second."),
 ("3c-273","3C 273","3C 273","quasar","active galaxy core","The first quasar ever identified, a galaxy core so bright it outshines its whole galaxy from billions of light-years away."),
 ("sn-1987a","SN 1987A","SN 1987A","supernova remnant","exploded star","The closest supernova seen in modern times, the death of a star in a nearby galaxy in 1987."),
 ("geminga","Geminga","Geminga","pulsar","neutron star","A nearby neutron star that pulses in gamma rays, the spinning corpse of a star that exploded long ago."),
 ("trappist-1","TRAPPIST-1","TRAPPIST-1","exoplanet system","red dwarf with planets","A small cool star circled by seven Earth-sized planets, several in the zone where liquid water could exist."),
 ("proxima-b","Proxima b","Proxima Centauri b","exoplanet","Earth-sized planet","The nearest exoplanet to us, an Earth-sized world orbiting Proxima Centauri, the closest star to the Sun."),
 ("51-pegasi-b","51 Pegasi b","51 Pegasi b","exoplanet","hot Jupiter","The first planet found orbiting a Sun-like star, a giant world whipping around its star in just four days."),
 ("kepler-452b","Kepler-452b","Kepler-452b","exoplanet","super-Earth","Nicknamed 'Earth's cousin', a larger world orbiting a Sun-like star in the zone where water could be liquid."),
]

def build():
    out = []
    for mid,name,sci,group,trait in MISSIONS:
        out.append({"id":mid,"name":name,"sci":sci,"cat":"spacecraft","group":group,
            "hab":"space exploration","habKey":"mission",
            "flavor":"Like all spacecraft, it is a machine built to explore beyond Earth and send its discoveries home.",
            "art":"mission","trait":trait,"track":"conservation",
            "termA":["Spacecraft","A vehicle or robot built to travel and work in space, crewed or uncrewed."],
            "termB":["Orbit","The curved path a spacecraft or world follows around a larger body under gravity."]})
    for tid,name,sci,group,trait in TELESCOPES:
        out.append({"id":tid,"name":name,"sci":sci,"cat":"telescope","group":group,
            "hab":"the study of the sky","habKey":"telescope",
            "flavor":"Like all telescopes, it gathers light or other signals from space to reveal what the eye alone cannot see.",
            "art":"telescope","trait":trait,"track":"conservation",
            "termA":["Telescope","An instrument that collects light or radio waves to make distant objects appear closer and brighter."],
            "termB":["Observatory","A place, on the ground or in space, built to house telescopes and study the sky."]})
    for eid,name,sci,cat,group,trait in EXOTICA:
        termmap={
          "black hole":["Black hole","A region where gravity is so strong that not even light can escape."],
          "pulsar":["Pulsar","A fast-spinning neutron star that sweeps beams of radiation past us like a lighthouse."],
          "quasar":["Quasar","The blazing core of a distant galaxy, powered by a giant black hole swallowing matter."],
          "supernova remnant":["Supernova","The titanic explosion of a dying star, briefly outshining a whole galaxy."],
          "exoplanet":["Exoplanet","A planet that orbits a star other than our Sun."],
          "exoplanet system":["Exoplanet","A planet orbiting a star other than the Sun."],
        }
        out.append({"id":eid,"name":name,"sci":sci,"cat":cat,"group":group,
            "hab":"the distant universe","habKey":"deepspace",
            "flavor":({"black hole":"Like all black holes, its gravity is so extreme that nothing, not even light, can escape it.",
                       "pulsar":"Like all pulsars, it is the dense, fast-spinning core left behind when a massive star died.",
                       "quasar":"Like all quasars, it is a galaxy's core blazing as a giant black hole devours matter.",
                       "supernova remnant":"Like all supernova remnants, it is the expanding wreckage of a star that exploded.",
                       "exoplanet":"Like all exoplanets, it orbits a star far beyond our own Sun.",
                       "exoplanet system":"Like other planetary systems, it is a family of worlds circling a distant star."}[cat]),
            "art":({"black hole":"blackhole","pulsar":"blackhole","quasar":"galaxy",
                    "supernova remnant":"nebula","exoplanet":"planet","exoplanet system":"planet"}[cat]),
            "trait":trait,"track":"habitats","termA":termmap[cat],
            "termB":["Light-year","The distance light travels in a year, the scale on which the deep universe is measured."]})
    return out

if __name__ == "__main__":
    b = build()
    print(len(b), "missions/telescopes/exotica")
    ids=[x["id"] for x in b]; assert len(ids)==len(set(ids)); print("unique ok")
