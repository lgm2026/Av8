# -*- coding: utf-8 -*-
# Concept lessons part 3 of 3: 10 additional lessons to reach 75 total.

def mc(q, choices, answer, why):
    return {"type":"mc","q":q,"choices":choices,"answer":answer,"why":why}
def tf(q, answer, why):
    return {"type":"tf","q":q,"answer":answer,"why":why}

# foundations track (+2)
FOUNDATIONS_X = [
 ("u-found-5","Mapping and Moving Skies","Coordinates and the wandering pole","Core",[
   {"id":"sky-coordinates","title":"Addresses in the Sky","level":"Core",
    "explain":["Just as places on Earth have latitude and longitude, points in the sky have their own coordinates. Declination measures how far north or south a star is, and right ascension measures its east-west position.",
               "With these two numbers, astronomers anywhere can point a telescope to the exact same star, like giving the sky a postal address."],
    "why":"Sky coordinates let astronomers record and share the precise position of any object.",
    "hook":"Every star in the sky has its own exact address.",
    "terms":[["Declination","A star's north-south position in the sky, like latitude."],
             ["Right ascension","A star's east-west position in the sky, like longitude."]],
    "quiz":[mc("Sky coordinates work much like Earth's:",["postcodes","latitude and longitude","phone numbers","street names"],1,"They mirror latitude and longitude."),
            tf("Declination is like latitude for the sky.",True,"True - it measures north-south position.")]},
   {"id":"precession-pole-stars","title":"The Wandering Pole Star","level":"Core",
    "explain":["Earth's axis does not point in a fixed direction forever. Like a slowly wobbling spinning top, it traces a wide circle over about 26,000 years, a motion called precession.",
               "Because of this, the title of 'North Star' changes over the ages. Polaris holds it now, but thousands of years ago it was Thuban, and one day it will be Vega."],
    "why":"Precession explains why even the steady-looking pole star slowly changes over the centuries.",
    "hook":"Polaris is only our temporary North Star; the pole is slowly drifting.",
    "terms":[["Precession","The slow, circular wobble of Earth's spinning axis."],
             ["Pole star","The star that happens to sit above a celestial pole."]],
    "quiz":[mc("The North Star changes over thousands of years because of Earth's:",["orbit","axial wobble (precession)","speed","shrinking"],1,"Precession slowly shifts where the axis points."),
            tf("Polaris has always been and will always be the North Star.",False,"Precession means the pole star changes over the ages.")]},
 ]),
]

# orbits track (+1)
ORBITS_X = [
 ("u-orbit-3","The Edge of the Solar System","Where comets come from","Core",[
   {"id":"comet-origins","title":"Where Comets Come From","level":"Core",
    "explain":["Most comets begin far from the Sun in two icy reservoirs. The Kuiper Belt is a broad ring of frozen bodies just beyond Neptune, while the Oort Cloud is a vast spherical shell of comets surrounding the whole Solar System.",
               "When a distant icy body is nudged toward the Sun, it warms up, releases gas and dust, and grows the glowing head and tail we recognise as a comet."],
    "why":"Knowing comets' icy homelands reveals the frozen outer edges of the Solar System.",
    "hook":"Comets are icy messengers from the deep-freeze at the edge of the Solar System.",
    "terms":[["Kuiper Belt","A ring of icy bodies beyond Neptune."],
             ["Oort Cloud","A giant spherical shell of comets far surrounding the Solar System."]],
    "quiz":[mc("Long-period comets are thought to come from the:",["asteroid belt","Oort Cloud","Sun","Moon"],1,"From the distant Oort Cloud."),
            tf("A comet grows a tail when it is warmed by the Sun.",True,"True - heat releases gas and dust.")]},
 ]),
]

# solar track (+2)
SOLAR_X = [
 ("u-solar-4","Small Worlds, Big Questions","Reclassifying Pluto and reading comets","Core",[
   {"id":"dwarf-planet-debate","title":"Why Pluto Became a Dwarf Planet","level":"Core",
    "explain":["For 76 years Pluto was called the ninth planet. But as astronomers found other Pluto-sized icy worlds beyond Neptune, they had to decide what 'planet' really means.",
               "In 2006 they ruled that a planet must orbit the Sun, be round, and have cleared other objects from its path. Pluto shares its zone with many icy bodies, so it was reclassified as a dwarf planet."],
    "why":"Pluto's story shows how science updates its definitions as new discoveries arrive.",
    "hook":"Pluto did not change; our definition of 'planet' did.",
    "terms":[["Dwarf planet","A round world orbiting the Sun that shares its path with other bodies."],
             ["Reclassify","To change how something is categorised as knowledge grows."]],
    "misconception":"Pluto was not 'deleted' or destroyed; it is still there, simply placed in the new category of dwarf planet.",
    "quiz":[mc("Pluto is now classified as a:",["planet","dwarf planet","moon","comet"],1,"It is a dwarf planet."),
            tf("Pluto was reclassified because other similar worlds were discovered.",True,"True - it shares its zone with many icy bodies.")]},
   {"id":"comet-anatomy","title":"The Parts of a Comet","level":"Core",
    "explain":["At a comet's heart is the nucleus, a small, dark ball of ice and dust often likened to a dirty snowball. As it nears the Sun, the nucleus heats up and releases a fuzzy cloud of gas called the coma.",
               "Sunlight and the solar wind push this material outward into one or more tails that always point away from the Sun, no matter which way the comet is travelling."],
    "why":"Understanding a comet's parts explains its dramatic, ever-changing appearance.",
    "hook":"A comet's tail always points away from the Sun, even as the comet leaves.",
    "terms":[["Nucleus","The small icy core of a comet."],
             ["Coma","The fuzzy cloud of gas and dust around a comet's nucleus."]],
    "misconception":"A comet's tail does not stream behind it like smoke; it points away from the Sun, so it can even lead the comet on the way out.",
    "quiz":[mc("A comet's tail always points:",["behind its motion","away from the Sun","toward Earth","straight down"],1,"Always away from the Sun."),
            tf("A comet's nucleus is made mostly of ice and dust.",True,"True - it is a 'dirty snowball'.")]},
 ]),
]

# stars track (+2)
STARS_X = [
 ("u-star-3","Stars in Pairs and Stars That Change","Doubles, multiples and variables","Core",[
   {"id":"binary-stars","title":"Stars in Pairs","level":"Core",
    "explain":["Many stars are not alone. More than half belong to systems of two or more stars orbiting one another, bound by gravity. The Sun, being single, is actually a little unusual.",
               "Some pairs are so close they trade material, while others are separated by huge distances. Studying their orbits lets astronomers weigh the stars and learn their masses."],
    "why":"Binary stars are common and are the main way astronomers measure star masses.",
    "hook":"More than half of all stars come with a partner; lone stars like the Sun are the exception.",
    "terms":[["Binary star","A pair of stars orbiting their shared centre of gravity."],
             ["Multiple star","A system of three or more stars bound together."]],
    "quiz":[mc("Most stars in the galaxy are:",["completely alone","in pairs or groups","planets","comets"],1,"Over half are in pairs or larger systems."),
            tf("Studying binary orbits lets astronomers measure star masses.",True,"True - orbits reveal mass.")]},
   {"id":"variable-stars","title":"Stars That Change Brightness","level":"Core",
    "explain":["Some stars do not shine steadily but brighten and dim over hours, days or months. These variable stars change for different reasons: some pulse in size, others are eclipsed by a companion.",
               "Certain pulsing stars, called Cepheids, are especially useful. Their steady rhythm reveals their true brightness, which astronomers use as a ruler to measure cosmic distances."],
    "why":"Variable stars act as cosmic measuring sticks that helped reveal the scale of the universe.",
    "hook":"Some stars keep such steady rhythm that we use them to measure the universe.",
    "terms":[["Variable star","A star whose brightness changes over time."],
             ["Cepheid","A pulsing star used to measure distances in space."]],
    "quiz":[mc("Cepheid variable stars are used as cosmic:",["clocks","distance rulers","magnets","mirrors"],1,"They serve as distance rulers."),
            tf("All stars shine with perfectly steady brightness.",False,"Variable stars change in brightness.")]},
 ]),
]

# galaxies track (+1)
GALAXIES_X = [
 ("u-gal-3","When Galaxies Collide","Mergers and active cores","Core",[
   {"id":"galaxy-collisions","title":"Galaxies in Collision","level":"Core",
    "explain":["Galaxies are not fixed in place; gravity slowly draws them together, and over billions of years they can merge. When they do, their stars rarely crash, because the gaps between stars are so vast.",
               "Instead the galaxies are reshaped, their gas is squeezed into bursts of new stars. Our own Milky Way is on a slow collision course with the Andromeda Galaxy, billions of years from now."],
    "why":"Collisions are a major way galaxies grow and change shape over cosmic time.",
    "hook":"The Milky Way and Andromeda are heading for a slow-motion collision.",
    "terms":[["Galaxy merger","The joining of two galaxies pulled together by gravity."],
             ["Starburst","A sudden surge of star formation, often triggered by a collision."]],
    "misconception":"When galaxies collide, their stars almost never hit each other, because stars are tiny compared to the empty space between them.",
    "quiz":[mc("When two galaxies collide, their stars usually:",["smash together","pass without hitting","vanish","turn to gas"],1,"Stars rarely collide; space between them is vast."),
            tf("The Milky Way will one day merge with the Andromeda Galaxy.",True,"True - they are approaching each other.")]},
 ]),
]

# cosmology track (+1)
COSMOLOGY_X = [
 ("u-cosmos-3","The Far Future","How the universe might end","Core",[
   {"id":"fate-of-universe","title":"The Fate of the Universe","level":"Core",
    "explain":["Because the universe is expanding ever faster, most scientists think it will simply keep growing colder and emptier far into the future, as stars burn out and galaxies drift apart.",
               "This distant, dark, cold future is sometimes called the 'big freeze'. The exact fate is still uncertain and depends on the nature of mysterious dark energy."],
    "why":"Asking how the universe ends is one of the grandest questions cosmology explores.",
    "hook":"The universe may end not with a bang, but with a long, slow fade to dark.",
    "terms":[["Big freeze","A possible far future where the universe grows cold and empty."],
             ["Dark energy","The mysterious influence speeding up the universe's expansion."]],
    "quiz":[mc("Because expansion is speeding up, many think the universe will grow:",["hotter and denser","colder and emptier","smaller","unchanged"],1,"It is expected to grow cold and empty."),
            tf("The exact fate of the universe is still uncertain.",True,"True - it depends on dark energy.")]},
 ]),
]

# missions track (+1)
MISSIONS_X = [
 ("u-mission-3","Living Beyond Earth","People in space","Core",[
   {"id":"living-in-space","title":"Living in Space","level":"Core",
    "explain":["Aboard the International Space Station, astronauts float in continuous free fall, so everything must be strapped down. They exercise two hours a day to stop their muscles and bones from weakening without gravity.",
               "Water is precious and recycled, even from sweat and breath. Living in space teaches us how to keep people healthy on long journeys to the Moon and Mars."],
    "why":"Learning to live in space is the key to sending people farther than ever before.",
    "hook":"On the space station, even your sweat is recycled into drinking water.",
    "terms":[["Microgravity","The near-weightless condition of continuous free fall in orbit."],
             ["Space station","A crewed spacecraft where people live and work in orbit."]],
    "quiz":[mc("Astronauts exercise daily in space to protect their:",["eyesight","muscles and bones","hair","teeth"],1,"To keep muscles and bones strong."),
            tf("Astronauts on the space station float because they are in continuous free fall.",True,"True - orbit is a state of free fall.")]},
 ]),
]
