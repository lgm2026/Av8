# -*- coding: utf-8 -*-
# Galaxies and deep-sky objects. Track "geology" (Galaxies & Deep Sky).

# Galaxies: (id, name, sci/query, group, trait)
GALAXIES = [
 ("milky-way","The Milky Way","Milky Way","barred spiral galaxy","Our home galaxy, a vast pinwheel of several hundred billion stars; on dark nights its disk arches across the sky as a glowing band."),
 ("andromeda-galaxy","Andromeda Galaxy","Andromeda Galaxy","spiral galaxy","The nearest large galaxy to ours and the most distant object visible to the naked eye; it is heading toward a merger with the Milky Way."),
 ("triangulum-galaxy","Triangulum Galaxy","Triangulum Galaxy","spiral galaxy","The third-largest galaxy in our Local Group, a delicate face-on spiral about 2.7 million light-years away."),
 ("whirlpool-galaxy","Whirlpool Galaxy","Whirlpool Galaxy","spiral galaxy","A textbook spiral galaxy caught in the act of dragging on a smaller companion galaxy, M51."),
 ("sombrero-galaxy","Sombrero Galaxy","Sombrero Galaxy","spiral galaxy","Seen nearly edge-on, its bright bulge and dark dust lane give it the look of a wide-brimmed hat."),
 ("pinwheel-galaxy","Pinwheel Galaxy","Pinwheel Galaxy","spiral galaxy","A large, beautifully symmetric face-on spiral galaxy, M101, near the Big Dipper."),
 ("large-magellanic-cloud","Large Magellanic Cloud","Large Magellanic Cloud","dwarf galaxy","A small companion galaxy of the Milky Way, easily seen from the southern hemisphere as a detached patch of the Milky Way."),
 ("small-magellanic-cloud","Small Magellanic Cloud","Small Magellanic Cloud","dwarf galaxy","A second nearby companion galaxy, fainter than its large cousin, hanging in the far southern sky."),
 ("cigar-galaxy","Cigar Galaxy","Messier 82","starburst galaxy","A galaxy bursting with new stars after a brush with a neighbour, blasting hot gas out of its center, M82."),
 ("black-eye-galaxy","Black Eye Galaxy","Black Eye Galaxy","spiral galaxy","Named for the dark band of dust sweeping across its bright core like a bruised eye, M64."),
 ("centaurus-a","Centaurus A","Centaurus A","peculiar galaxy","One of the closest active galaxies, crossed by a thick dust lane and roaring with a giant black hole at its heart."),
 ("bode-galaxy","Bode's Galaxy","Messier 81","spiral galaxy","A grand-design spiral galaxy with sweeping arms, M81, a favourite target for backyard telescopes."),
 ("sunflower-galaxy","Sunflower Galaxy","Sunflower Galaxy","spiral galaxy","A bright spiral with many short, patchy arms that give it a flowery look, M63."),
 ("tadpole-galaxy","Tadpole Galaxy","Tadpole Galaxy","disrupted spiral galaxy","A galaxy with a vast tail of stars and gas torn out by a close encounter, like a cosmic tadpole."),
 ("antennae-galaxies","Antennae Galaxies","Antennae Galaxies","colliding galaxies","Two galaxies in mid-collision, flinging out long streamers of stars that look like an insect's antennae."),
 ("messier-87","Messier 87","Messier 87","giant elliptical galaxy","A huge ball-shaped galaxy whose central black hole was the first ever photographed, in 2019."),
 ("ngc-1300","NGC 1300","NGC 1300","barred spiral galaxy","A stunning example of a barred spiral, with arms that spring from the ends of a straight bar of stars."),
 ("cartwheel-galaxy","Cartwheel Galaxy","Cartwheel Galaxy","ring galaxy","A galaxy shaped like a wheel, a ring of new stars rippling outward after another galaxy punched through its center."),
 ("hoags-object","Hoag's Object","Hoag's Object","ring galaxy","A near-perfect ring of bright stars surrounding a yellow core, one of the strangest galaxies known."),
 ("ngc-6822","Barnard's Galaxy","Barnard's Galaxy","dwarf galaxy","A small, nearby irregular galaxy in our Local Group, dotted with glowing clouds where stars are born."),
]

# Deep-sky objects (nebulae, clusters): (id, name, sci/query, cat, group, hab, habKey, art, trait, termA)
DEEPSKY = [
 ("orion-nebula","Orion Nebula","Orion Nebula","nebula","star-forming nebula","the constellation Orion","milkyway","nebula",
  "A glowing nursery of newborn stars hanging below Orion's Belt, visible as a fuzzy patch to the naked eye."),
 ("crab-nebula","Crab Nebula","Crab Nebula","nebula","supernova remnant","the constellation Taurus","milkyway","nebula",
  "The shredded wreckage of a star that exploded in 1054, with a spinning pulsar at its heart."),
 ("eagle-nebula","Eagle Nebula","Eagle Nebula","nebula","star-forming nebula","the constellation Serpens","milkyway","nebula",
  "Home to the towering 'Pillars of Creation', columns of gas and dust where new stars are being born."),
 ("ring-nebula","Ring Nebula","Ring Nebula","nebula","planetary nebula","the constellation Lyra","milkyway","nebula",
  "A glowing smoke ring puffed off by a dying Sun-like star, a famous small-telescope target, M57."),
 ("helix-nebula","Helix Nebula","Helix Nebula","nebula","planetary nebula","the constellation Aquarius","milkyway","nebula",
  "One of the closest planetary nebulae, its eye-like ring has earned it the nickname the 'Eye of God'."),
 ("horsehead-nebula","Horsehead Nebula","Horsehead Nebula","nebula","dark nebula","the constellation Orion","milkyway","nebula",
  "A dark cloud of dust shaped uncannily like a horse's head, silhouetted against glowing gas behind it."),
 ("lagoon-nebula","Lagoon Nebula","Lagoon Nebula","nebula","star-forming nebula","the constellation Sagittarius","milkyway","nebula",
  "A bright cloud near the galaxy's heart where stars are forming, just visible to the unaided eye, M8."),
 ("carina-nebula","Carina Nebula","Carina Nebula","nebula","star-forming nebula","the constellation Carina","milkyway","nebula",
  "An enormous, turbulent cloud surrounding the unstable monster star Eta Carinae."),
 ("rosette-nebula","Rosette Nebula","Rosette Nebula","nebula","star-forming nebula","the constellation Monoceros","milkyway","nebula",
  "A great flower-shaped cloud of glowing gas with a young star cluster opening a hole in its center."),
 ("trifid-nebula","Trifid Nebula","Trifid Nebula","nebula","star-forming nebula","the constellation Sagittarius","milkyway","nebula",
  "A colourful cloud split into three lobes by dark lanes of dust, M20."),
 ("dumbbell-nebula","Dumbbell Nebula","Dumbbell Nebula","nebula","planetary nebula","the constellation Vulpecula","milkyway","nebula",
  "The first planetary nebula ever discovered, an hourglass of gas thrown off by a dying star, M27."),
 ("cats-eye-nebula","Cat's Eye Nebula","Cat's Eye Nebula","nebula","planetary nebula","the constellation Draco","milkyway","nebula",
  "An intricate, layered shell of gas shed by a dying star, one of the most complex nebulae known."),
 ("veil-nebula","Veil Nebula","Veil Nebula","nebula","supernova remnant","the constellation Cygnus","milkyway","nebula",
  "Delicate wisps of glowing gas, the expanding remains of a star that exploded thousands of years ago."),
 ("north-america-nebula","North America Nebula","North America Nebula","nebula","star-forming nebula","the constellation Cygnus","milkyway","nebula",
  "A glowing cloud whose shape strikingly resembles the continent of North America."),
 ("flame-nebula","Flame Nebula","Flame Nebula","nebula","star-forming nebula","the constellation Orion","milkyway","nebula",
  "A bright cloud near Orion's Belt that looks like a flickering flame, lit by hidden young stars."),
 ("pleiades","Pleiades","Pleiades","star cluster","open star cluster","the constellation Taurus","milkyway","cluster",
  "The 'Seven Sisters', a sparkling young cluster of hot blue stars easily seen with the naked eye, M45."),
 ("hyades","Hyades","Hyades","star cluster","open star cluster","the constellation Taurus","milkyway","cluster",
  "The nearest star cluster to the Sun, a loose V-shaped group forming the face of Taurus the bull."),
 ("beehive-cluster","Beehive Cluster","Beehive Cluster","star cluster","open star cluster","the constellation Cancer","milkyway","cluster",
  "A swarm of stars in Cancer, visible as a misty glow to the naked eye and a glittering field in binoculars, M44."),
 ("double-cluster","Double Cluster","Double Cluster","star cluster","open star cluster","the constellation Perseus","milkyway","cluster",
  "A breathtaking pair of bright star clusters side by side in Perseus, lovely in binoculars."),
 ("hercules-cluster","Hercules Cluster","Messier 13","star cluster","globular star cluster","the constellation Hercules","milkyway","cluster",
  "The finest globular cluster in the northern sky, a tight ball of hundreds of thousands of ancient stars, M13."),
 ("omega-centauri","Omega Centauri","Omega Centauri","star cluster","globular star cluster","the constellation Centaurus","milkyway","cluster",
  "The largest and brightest globular cluster orbiting the Milky Way, packing millions of old stars into a glowing ball."),
 ("47-tucanae","47 Tucanae","47 Tucanae","star cluster","globular star cluster","the constellation Tucana","milkyway","cluster",
  "A dazzling globular cluster of the far southern sky, second only to Omega Centauri in splendour."),
 ("wild-duck-cluster","Wild Duck Cluster","Wild Duck Cluster","star cluster","open star cluster","the constellation Scutum","milkyway","cluster",
  "A rich, dense open cluster whose brightest stars form a V like a flight of ducks, M11."),
 ("ptolemy-cluster","Ptolemy Cluster","Ptolemy Cluster","star cluster","open star cluster","the constellation Scorpius","milkyway","cluster",
  "A bright, scattered cluster near the scorpion's tail, noted by the astronomer Ptolemy nearly 2,000 years ago, M7."),
 ("tarantula-nebula","Tarantula Nebula","Tarantula Nebula","nebula","star-forming nebula","the Large Magellanic Cloud","deepspace","nebula",
  "The most active star-forming region known in our cosmic neighbourhood, glowing in a nearby companion galaxy."),
 ("butterfly-nebula","Butterfly Nebula","Butterfly Nebula","nebula","planetary nebula","the constellation Scorpius","milkyway","nebula",
  "A dying star unleashing twin wings of gas heated to staggering temperatures, NGC 6302."),
 ("owl-nebula","Owl Nebula","Owl Nebula","nebula","planetary nebula","the constellation Ursa Major","milkyway","nebula",
  "A round planetary nebula whose two dark patches look like the staring eyes of an owl, M97."),
 ("california-nebula","California Nebula","California Nebula","nebula","star-forming nebula","the constellation Perseus","milkyway","nebula",
  "A long red cloud of glowing hydrogen shaped like the state of California."),
 ("witch-head-nebula","Witch Head Nebula","Witch Head Nebula","nebula","reflection nebula","the constellation Eridanus","milkyway","nebula",
  "A faint cloud lit blue by nearby Rigel, its profile resembling a witch's face."),
 ("cone-nebula","Cone Nebula","Cone Nebula","nebula","star-forming nebula","the constellation Monoceros","milkyway","nebula",
  "A dark, cone-shaped pillar of cold gas and dust where new stars are taking shape."),
 ("running-chicken-nebula","Running Chicken Nebula","Running Chicken Nebula","nebula","star-forming nebula","the constellation Centaurus","milkyway","nebula",
  "A southern cloud of glowing gas whose patches suggest the shape of a running bird."),
 ("coalsack-nebula","Coalsack Nebula","Coalsack Nebula","nebula","dark nebula","the constellation Crux","milkyway","nebula",
  "A famous dark nebula, a cloud of dust blotting out the stars of the Milky Way beside the Southern Cross."),
 ("ngc-2070-placeholder","Bug Nebula","Bug Nebula","nebula","planetary nebula","the constellation Scorpius","milkyway","nebula",
  "Another name for the Butterfly Nebula region, where a dying star sheds glowing, insect-like wings of gas."),
 ("messier-22","Messier 22","Messier 22","star cluster","globular star cluster","the constellation Sagittarius","milkyway","cluster",
  "One of the nearest and brightest globular clusters, sparkling near the heart of the galaxy, M22."),
 ("jewel-box-cluster","Jewel Box Cluster","Jewel Box (star cluster)","star cluster","open star cluster","the constellation Crux","milkyway","cluster",
  "A small, brilliant cluster beside the Southern Cross, its mix of coloured stars sparkling like gems."),
 ("ngc-869-placeholder","Christmas Tree Cluster","Christmas Tree Cluster","star cluster","open star cluster","the constellation Monoceros","milkyway","cluster",
  "A young cluster of stars arranged in the rough shape of a Christmas tree, near the Cone Nebula."),
 ("messier-4","Messier 4","Messier 4","star cluster","globular star cluster","the constellation Scorpius","milkyway","cluster",
  "One of the closest globular clusters to Earth, easy to find right beside the bright red star Antares."),
 ("ngc-7000-placeholder","Pelican Nebula","Pelican Nebula","nebula","star-forming nebula","the constellation Cygnus","milkyway","nebula",
  "A glowing cloud shaped like a pelican, separated from the North America Nebula by a lane of dark dust."),
 ("soul-nebula","Soul Nebula","Soul Nebula","nebula","star-forming nebula","the constellation Cassiopeia","milkyway","nebula",
  "A vast cloud of glowing hydrogen sculpted into pillars by the radiation of young stars within it."),
 ("heart-nebula","Heart Nebula","Heart Nebula","nebula","star-forming nebula","the constellation Cassiopeia","milkyway","nebula",
  "A huge cloud of glowing gas shaped like a heart, the companion of the nearby Soul Nebula."),
]

def build():
    out = []
    for gid,name,sci,group,trait in GALAXIES:
        out.append({"id":gid,"name":name,"sci":sci,"cat":"galaxy","group":group,
            "hab":"deep space beyond the Milky Way" if gid!="milky-way" else "the local universe",
            "habKey":"deepspace","flavor":"Like all galaxies, it is a giant gravitationally bound system of stars, gas, dust and dark matter.",
            "art":"galaxy","trait":trait,"track":"geology",
            "termA":["Galaxy","An enormous collection of stars, gas and dust held together by gravity; our own is the Milky Way."],
            "termB":["Light-year","The distance light travels in one year, used to measure the huge gaps between galaxies."]})
    for did,name,sci,cat,group,hab,habKey,art,trait in DEEPSKY:
        if cat=="nebula":
            termA=["Nebula","A giant cloud of gas and dust in space, where stars are born or where dying stars shed their layers."]
            flavor="Like all nebulae, it is a vast cloud of gas and dust glowing in the depths of space."
        else:
            termA=["Star cluster","A group of stars that formed together and are held near one another by gravity."]
            flavor="Like all star clusters, it is a family of stars that were born together from the same cloud."
        out.append({"id":did,"name":name,"sci":sci,"cat":cat,"group":group,"hab":hab,"habKey":habKey,
            "flavor":flavor,"art":art,"trait":trait,"track":"geology","termA":termA,
            "termB":["Deep-sky object","Anything beyond the Solar System that is not a single star: nebulae, clusters and galaxies."]})
    return out

if __name__ == "__main__":
    b = build()
    print(len(b), "deep-sky objects")
    ids=[x["id"] for x in b]; assert len(ids)==len(set(ids)); print("unique ok")
