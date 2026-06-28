#!/usr/bin/env python3
# TerraHype species specs: accurate North American land/freshwater species + geology.
# g.S(id, name, group, track, hab, diet, trait, sci=..., kind=...)
import gen_curriculum as g
S = g.S

# ============================== TREES (kind="tree", flora) ==============================
S("red-maple","Red maple","maple tree","flora","decid","photosyn","Its leaves flush brilliant red in autumn, and even its twigs, buds and winged seeds carry a reddish tint.",sci="Acer rubrum",kind="tree")
S("sugar-maple","Sugar maple","maple tree","flora","decid","photosyn","Its sweet sap is boiled down to make maple syrup, and its leaf is the model for Canada's flag.",sci="Acer saccharum",kind="tree")
S("white-oak","White oak","oak tree","flora","decid","photosyn","Its rounded leaf lobes and sweeter acorns set it apart from sharp-lobed red oaks, and it can live more than 300 years.",sci="Quercus alba",kind="tree")
S("northern-red-oak","Northern red oak","oak tree","flora","decid","photosyn","Its leaves have pointed, bristle-tipped lobes, and its bitter acorns take two years to ripen.",sci="Quercus rubra",kind="tree")
S("eastern-white-pine","Eastern white pine","pine tree","flora","conifer","photosyn","Its soft needles grow in bundles of five, one for each letter in the word 'white'.",sci="Pinus strobus",kind="tree")
S("loblolly-pine","Loblolly pine","pine tree","flora","conifer","photosyn","A fast-growing southern pine, it is the most planted timber tree in the United States.",sci="Pinus taeda",kind="tree")
S("douglas-fir","Douglas-fir","conifer tree","flora","conifer","photosyn","Despite its name it is not a true fir; its cones have three-pronged bracts that poke out like tiny mouse tails.",sci="Pseudotsuga menziesii",kind="tree")
S("coast-redwood","Coast redwood","redwood tree","flora","wetforest","photosyn","It is the tallest living thing on Earth, with record individuals topping 115 meters.",sci="Sequoia sempervirens",kind="tree")
S("giant-sequoia","Giant sequoia","sequoia tree","flora","mountain","photosyn","By volume it is the largest single living thing on Earth, and its thick spongy bark helps it survive forest fires.",sci="Sequoiadendron giganteum",kind="tree")
S("quaking-aspen","Quaking aspen","aspen tree","flora","mountain","photosyn","Its flat leaf-stems make the leaves tremble in the lightest breeze, and a whole grove can be one connected organism.",sci="Populus tremuloides",kind="tree")
S("paper-birch","Paper birch","birch tree","flora","conifer","photosyn","Its white bark peels in papery strips and was traditionally used to build canoes.",sci="Betula papyrifera",kind="tree")
S("eastern-hemlock","Eastern hemlock","conifer tree","flora","wetforest","photosyn","A shade-loving evergreen of cool ravines, it is being killed across the East by a tiny invasive insect, the hemlock woolly adelgid.",sci="Tsuga canadensis",kind="tree")
S("american-sycamore","American sycamore","sycamore tree","flora","riparian","photosyn","Its mottled bark flakes off to reveal smooth white patches, making streamside trees easy to spot in winter.",sci="Platanus occidentalis",kind="tree")
S("shagbark-hickory","Shagbark hickory","hickory tree","flora","decid","photosyn","Its gray bark peels away in long, shaggy strips, and its sweet nuts feed many woodland animals.",sci="Carya ovata",kind="tree")
S("american-beech","American beech","beech tree","flora","decid","photosyn","Its smooth silver-gray bark holds onto pale, dry leaves through winter, and it produces triangular beechnuts.",sci="Fagus grandifolia",kind="tree")
S("bald-cypress","Bald cypress","cypress tree","flora","wetland","photosyn","A swamp conifer that drops its needles in winter, it grows woody 'knees' that poke up from the water around its base.",sci="Taxodium distichum",kind="tree")
S("joshua-tree","Joshua tree","tree (a giant yucca)","flora","desert","photosyn","This spiky Mojave Desert icon is not a true tree but a giant yucca, and it is pollinated only by the yucca moth.",sci="Yucca brevifolia",kind="tree")
S("saguaro","Saguaro","giant cactus tree","flora","desert","photosyn","A giant Sonoran Desert cactus, it can live 150 to 200 years and may not grow its first arm until it is about 70.",sci="Carnegiea gigantea",kind="tree")
S("honey-mesquite","Honey mesquite","desert tree","flora","desert","photosyn","Its roots can reach far underground to find water, among the deepest roots known of any plant.",sci="Prosopis glandulosa",kind="tree")
S("live-oak","Southern live oak","oak tree","flora","coastal","photosyn","An evergreen oak with wide, spreading limbs, it is often draped in Spanish moss across the Deep South.",sci="Quercus virginiana",kind="tree")

# ===================== SHRUBS / WILDFLOWERS / GRASSES / FERNS (kind="plant", flora) =====================
S("big-sagebrush","Big sagebrush","desert shrub","flora","desert","photosyn","Its silvery, three-toothed leaves give the Western range its sharp scent, and it shelters the imperiled sage-grouse.",sci="Artemisia tridentata",kind="plant")
S("serviceberry","Serviceberry","shrub","flora","edge","photosyn","Its early white spring blossoms and sweet summer berries feed birds, bears and people alike.",sci="Amelanchier",kind="plant")
S("highbush-blueberry","Highbush blueberry","shrub","flora","wetland","photosyn","The wild ancestor of cultivated blueberries, it needs acidic soil and turns fiery red in fall.",sci="Vaccinium corymbosum",kind="plant")
S("common-milkweed","Common milkweed","wildflower","flora","meadow","photosyn","Its leaves are the only food monarch caterpillars can eat, and its pods release silky, parachute-borne seeds.",sci="Asclepias syriaca",kind="plant")
S("black-eyed-susan","Black-eyed Susan","wildflower","flora","meadow","photosyn","Its golden petals ring a dark brown center, a cheerful prairie bloom that turns to follow the sun when young.",sci="Rudbeckia hirta",kind="plant")
S("purple-coneflower","Purple coneflower","wildflower","flora","grass","photosyn","Its drooping purple petals surround a spiky orange cone, and it is widely grown both for beauty and as the herb echinacea.",sci="Echinacea purpurea",kind="plant")
S("california-poppy","California poppy","wildflower","flora","desert","photosyn","California's state flower, its orange petals close up at night and on cloudy days.",sci="Eschscholzia californica",kind="plant")
S("fireweed","Fireweed","wildflower","flora","mountain","photosyn","It is named because it is one of the first plants to bloom on burned ground, painting recovering land bright pink.",sci="Chamerion angustifolium",kind="plant")
S("texas-bluebonnet","Texas bluebonnet","wildflower","flora","grass","photosyn","The state flower of Texas, it blankets spring roadsides in deep blue and, as a legume, enriches the soil with nitrogen.",sci="Lupinus texensis",kind="plant")
S("white-trillium","White trillium","wildflower","flora","wetforest","photosyn","Its parts come in threes, three leaves and three petals, and picking the flower can kill the whole plant.",sci="Trillium grandiflorum",kind="plant")
S("cardinal-flower","Cardinal flower","wildflower","flora","wetland","photosyn","Its brilliant red tubular blooms are shaped for hummingbirds, whose long bills can reach the hidden nectar.",sci="Lobelia cardinalis",kind="plant")
S("goldenrod","Goldenrod","wildflower","flora","meadow","photosyn","Its plumes of tiny yellow flowers feed late-season pollinators, and despite the myth it does not cause hay fever.",sci="Solidago",kind="plant")
S("big-bluestem","Big bluestem","tallgrass","flora","grass","photosyn","The signature grass of the tallgrass prairie, it can grow over two meters tall with roots reaching nearly as deep.",sci="Andropogon gerardii",kind="plant")
S("switchgrass","Switchgrass","prairie grass","flora","grass","photosyn","A tough native prairie grass with deep roots, it is studied as a renewable source of biofuel.",sci="Panicum virgatum",kind="plant")
S("little-bluestem","Little bluestem","prairie grass","flora","grass","photosyn","Its blue-green summer stems turn coppery red in fall, coloring prairies through the winter.",sci="Schizachyrium scoparium",kind="plant")
S("broadleaf-cattail","Broadleaf cattail","wetland reed","flora","wetland","photosyn","Its brown sausage-shaped flower spikes release thousands of fluffy seeds, and nearly every part of it is edible.",sci="Typha latifolia",kind="plant")
S("cinnamon-fern","Cinnamon fern","fern","flora","wetland","photosyn","It is named for the cinnamon-colored fertile fronds that stand upright in the center of the plant.",sci="Osmundastrum cinnamomeum",kind="plant")
S("ostrich-fern","Ostrich fern","fern","flora","wetforest","photosyn","Its young, tightly coiled fronds, called fiddleheads, are foraged and eaten as a spring vegetable.",sci="Matteuccia struthiopteris",kind="plant")
S("bracken-fern","Bracken fern","fern","flora","forest","photosyn","One of the world's most widespread ferns, it spreads aggressively across ground that has been burned or cleared.",sci="Pteridium aquilinum",kind="plant")
S("sphagnum-moss","Sphagnum moss","moss","flora","wetland","photosyn","This bog moss can soak up many times its own weight in water and slowly builds peat over centuries.",sci="Sphagnum",kind="plant")

# ============================== FUNGI / LICHENS (kind="fungus", flora) ==============================
S("yellow-morel","Yellow morel","mushroom (fungus)","flora","wetforest","decompose","Its honeycomb-pitted cap makes it a prized spring edible, but only when an expert tells it apart from toxic look-alikes.",sci="Morchella esculenta",kind="fungus")
S("chanterelle","Golden chanterelle","mushroom (fungus)","flora","forest",None,"A golden, funnel-shaped edible with a faint apricot smell, it grows in a partnership with the roots of trees.",sci="Cantharellus",kind="fungus")
S("fly-agaric","Fly agaric","mushroom (fungus)","flora","conifer",None,"Its iconic red cap dotted with white is famous in fairy tales, and it is toxic and should never be eaten.",sci="Amanita muscaria",kind="fungus")
S("oyster-mushroom","Oyster mushroom","shelf fungus","flora","forest","decompose","It grows in shelving clusters on dead wood and is one of the few fungi that can trap and digest tiny roundworms for nitrogen.",sci="Pleurotus ostreatus",kind="fungus")
S("turkey-tail","Turkey tail","bracket fungus","flora","forest","decompose","Its banded, fan-shaped brackets help rot fallen logs, returning their nutrients to the forest floor.",sci="Trametes versicolor",kind="fungus")
S("shaggy-mane","Shaggy mane","mushroom (fungus)","flora","urban","decompose","As it ages, its tall white shaggy cap dissolves into an inky black liquid to release its spores.",sci="Coprinus comatus",kind="fungus")
S("british-soldiers","British soldiers lichen","lichen","flora","rocky","photosyn","This tiny lichen is tipped with bright red caps, and like all lichens it is a partnership of a fungus and an alga.",sci="Cladonia cristatella",kind="fungus")
S("reindeer-lichen","Reindeer lichen","lichen","flora","tundra","photosyn","A pale, spongy, branching lichen that carpets the far north, it is a winter mainstay for caribou.",sci="Cladonia rangiferina",kind="fungus")

# ============================== MAMMALS (kind="animal", fauna) ==============================
S("american-black-bear","American black bear","bear (mammal)","fauna","forest","omni","The most common bear in North America, it climbs trees well and sleeps away the winter in a den.",sci="Ursus americanus",kind="animal")
S("grizzly-bear","Grizzly bear","bear (mammal)","fauna","mountain","omni","A brown bear of the West, it has a shoulder hump of muscle for digging and can run faster than 50 km/h despite its bulk.",sci="Ursus arctos horribilis",kind="animal")
S("gray-wolf","Gray wolf","wolf (mammal)","fauna","forest","carn","It hunts in family packs led by a breeding pair and communicates across long distances by howling.",sci="Canis lupus",kind="animal")
S("coyote","Coyote","wild dog (mammal)","fauna","widespread","omni","Adaptable enough to thrive even in big cities, its yipping howls are a familiar night sound across the continent.",sci="Canis latrans",kind="animal")
S("red-fox","Red fox","fox (mammal)","fauna","edge","omni","It hunts by leaping high to pounce straight down on mice, and can hear a mouse moving under the snow.",sci="Vulpes vulpes",kind="animal")
S("white-tailed-deer","White-tailed deer","deer (mammal)","fauna","edge","browse","When alarmed it raises its white tail like a flag to warn the herd as it bounds away.",sci="Odocoileus virginianus",kind="animal")
S("elk","Elk","deer (mammal)","fauna","mountain","graze","Among the largest deer, bulls grow huge antlers each year and bugle loudly to rivals during the fall rut.",sci="Cervus canadensis",kind="animal")
S("moose","Moose","deer (mammal)","fauna","wetland","browse","The largest deer on Earth, it wades into ponds to feed on water plants and can even dive several meters down.",sci="Alces alces",kind="animal")
S("american-bison","American bison","bison (mammal)","fauna","grass","graze","The largest land animal in North America, it once roamed the plains in the tens of millions before being hunted to near extinction.",sci="Bison bison",kind="animal")
S("pronghorn","Pronghorn","hoofed mammal","fauna","grass","graze","The fastest land animal in North America, it can sprint over 80 km/h and spot predators kilometers away.",sci="Antilocapra americana",kind="animal")
S("bighorn-sheep","Bighorn sheep","wild sheep (mammal)","fauna","mountain","graze","Rams crash their massive curled horns together in head-butting duels that echo across the cliffs.",sci="Ovis canadensis",kind="animal")
S("mountain-lion","Mountain lion","wild cat (mammal)","fauna","mountain","carn","Also called puma or cougar, it can leap the length of a school bus and is the most widely spread wild mammal in the Americas.",sci="Puma concolor",kind="animal")
S("bobcat","Bobcat","wild cat (mammal)","fauna","forest","carn","Named for its short, 'bobbed' tail, this secretive cat is about twice the size of a house cat and an expert ambush hunter.",sci="Lynx rufus",kind="animal")
S("raccoon","Raccoon","mammal","fauna","urban","omni","Its nimble, sensitive front paws can open latches and unwrap food, and its dark mask may cut glare to sharpen its night vision.",sci="Procyon lotor",kind="animal")
S("striped-skunk","Striped skunk","mammal","fauna","edge","omni","When threatened it can spray a foul-smelling musk accurately several meters at an attacker's face.",sci="Mephitis mephitis",kind="animal")
S("north-american-beaver","North American beaver","rodent (mammal)","fauna","river","herb","The continent's largest rodent, it fells trees with chisel-like teeth and builds dams that create whole wetlands.",sci="Castor canadensis",kind="animal")
S("river-otter","North American river otter","mammal","fauna","river","fish","A playful swimmer with dense, water-repellent fur, it can hold its breath for several minutes while chasing fish.",sci="Lontra canadensis",kind="animal")
S("eastern-gray-squirrel","Eastern gray squirrel","rodent (mammal)","fauna","urban","seeds","It buries thousands of nuts each fall and relocates many later by memory and smell, planting forests it forgets about.",sci="Sciurus carolinensis",kind="animal")
S("american-red-squirrel","American red squirrel","rodent (mammal)","fauna","conifer","seeds","It loudly defends a small territory and stockpiles pine cones in big larders called middens.",sci="Tamiasciurus hudsonicus",kind="animal")
S("eastern-chipmunk","Eastern chipmunk","rodent (mammal)","fauna","forest","seeds","It stuffs food into stretchy cheek pouches and carries it back to an underground burrow with many chambers.",sci="Tamias striatus",kind="animal")
S("porcupine","North American porcupine","rodent (mammal)","fauna","forest","browse","It is covered in about 30,000 barbed quills that lodge in a predator's skin, though it cannot actually throw them.",sci="Erethizon dorsatum",kind="animal")
S("american-pika","American pika","mammal","fauna","mountain","herb","A small relative of rabbits, it gathers 'haystacks' of dried plants to survive winter on cold mountain rockslides.",sci="Ochotona princeps",kind="animal")
S("eastern-cottontail","Eastern cottontail","rabbit (mammal)","fauna","meadow","herb","It freezes to hide, then bursts into a zigzag run, and can raise several litters of young in one year.",sci="Sylvilagus floridanus",kind="animal")
S("nine-banded-armadillo","Nine-banded armadillo","mammal","fauna","edge","insects","Protected by a bony shell, it almost always gives birth to four identical quadruplets from a single egg.",sci="Dasypus novemcinctus",kind="animal")
S("virginia-opossum","Virginia opossum","marsupial (mammal)","fauna","edge","omni","North America's only marsupial, it carries its young in a pouch and 'plays possum,' faking death, when scared.",sci="Didelphis virginiana",kind="animal")
S("little-brown-bat","Little brown bat","bat (mammal)","fauna","cave","insects","It hunts insects in the dark using echolocation and can snap up hundreds of mosquito-sized insects in a single hour.",sci="Myotis lucifugus",kind="animal")

# ============================== BIRDS (kind="bird", fauna) ==============================
S("bald-eagle","Bald eagle","raptor (bird)","fauna","river","fish","The national bird of the U.S., it builds the largest tree nest of any North American bird, reused and enlarged for years.",sci="Haliaeetus leucocephalus",kind="bird")
S("golden-eagle","Golden eagle","raptor (bird)","fauna","mountain","carn","A powerful hunter of open country, it can dive at more than 240 km/h to seize rabbits and other prey.",sci="Aquila chrysaetos",kind="bird")
S("red-tailed-hawk","Red-tailed hawk","raptor (bird)","fauna","edge","carn","Its rusty-red tail and piercing scream are so iconic that its cry is often dubbed over other birds in movies.",sci="Buteo jamaicensis",kind="bird")
S("osprey","Osprey","raptor (bird)","fauna","river","fish","Built to catch fish, it has a reversible outer toe and barbed foot pads to grip slippery prey snatched from the water.",sci="Pandion haliaetus",kind="bird")
S("great-horned-owl","Great horned owl","owl (bird)","fauna","forest","carn","A fierce nighttime hunter with feather 'horns,' its soft-edged feathers let it fly almost silently.",sci="Bubo virginianus",kind="bird")
S("barred-owl","Barred owl","owl (bird)","fauna","wetforest","carn","Its hooting call sounds like the question 'who cooks for you?' echoing through swampy woods at night.",sci="Strix varia",kind="bird")
S("wild-turkey","Wild turkey","game bird","fauna","forest","omni","Nearly wiped out by 1900, it has rebounded strongly; males fan their tail feathers and gobble to attract mates.",sci="Meleagris gallopavo",kind="bird")
S("northern-cardinal","Northern cardinal","songbird (bird)","fauna","edge","seeds","The bright red male sings year-round, and unlike most songbirds the female sings too.",sci="Cardinalis cardinalis",kind="bird")
S("american-robin","American robin","songbird (bird)","fauna","urban","omni","A familiar lawn forager, it tilts its head not to listen but to look sideways for earthworms.",sci="Turdus migratorius",kind="bird")
S("blue-jay","Blue jay","songbird (bird)","fauna","forest","omni","A clever, noisy bird that buries acorns for winter and can mimic the scream of a hawk to scare other birds.",sci="Cyanocitta cristata",kind="bird")
S("black-capped-chickadee","Black-capped chickadee","songbird (bird)","fauna","forest","insects","It hides thousands of seeds and grows extra brain cells each fall to help it remember where.",sci="Poecile atricapillus",kind="bird")
S("american-crow","American crow","songbird (bird)","fauna","widespread","omni","One of the smartest birds, it can use simple tools, recognize human faces, and remember them for years.",sci="Corvus brachyrhynchos",kind="bird")
S("ruby-throated-hummingbird","Ruby-throated hummingbird","hummingbird (bird)","fauna","edge","nectar","It beats its wings about 50 times a second and can fly backwards, even crossing the Gulf of Mexico nonstop.",sci="Archilochus colubris",kind="bird")
S("pileated-woodpecker","Pileated woodpecker","woodpecker (bird)","fauna","forest","insects","A crow-sized woodpecker with a flaming red crest, it chisels large rectangular holes to hunt carpenter ants.",sci="Dryocopus pileatus",kind="bird")
S("great-blue-heron","Great blue heron","wading bird","fauna","wetland","fish","It stalks the shallows on long stilt-like legs and spears fish with a lightning jab of its dagger-like bill.",sci="Ardea herodias",kind="bird")
S("sandhill-crane","Sandhill crane","crane (bird)","fauna","wetland","omni","Famous for its leaping courtship dances, it gathers by the hundreds of thousands along rivers during migration.",sci="Antigone canadensis",kind="bird")
S("mallard","Mallard","duck (bird)","fauna","wetland","omni","The familiar green-headed duck and ancestor of most farm ducks, it 'dabbles' tail-up to feed just under the surface.",sci="Anas platyrhynchos",kind="bird")
S("canada-goose","Canada goose","goose (bird)","fauna","lake","herb","It flies in a V formation to save energy and mates for life, fiercely defending its goslings.",sci="Branta canadensis",kind="bird")
S("american-goldfinch","American goldfinch","songbird (bird)","fauna","meadow","seeds","A strict seed-eater, it nests late in summer so its chicks hatch when thistle and sunflower seeds are ripe.",sci="Spinus tristis",kind="bird")
S("eastern-bluebird","Eastern bluebird","songbird (bird)","fauna","meadow","insects","It nests in tree holes and nest boxes and drops from a perch to snatch insects off the ground.",sci="Sialia sialis",kind="bird")
S("peregrine-falcon","Peregrine falcon","raptor (bird)","fauna","coastal","carn","In a hunting dive it can exceed 320 km/h, making it the fastest animal on the planet.",sci="Falco peregrinus",kind="bird")
S("american-kestrel","American kestrel","raptor (bird)","fauna","grass","insects","North America's smallest falcon, it can hover in place over a field while hunting insects and mice.",sci="Falco sparverius",kind="bird")
S("turkey-vulture","Turkey vulture","raptor (bird)","fauna","widespread","carrion","It soars for hours rarely flapping, and unusually for a bird it finds its food, carrion, by smell.",sci="Cathartes aura",kind="bird")
S("common-loon","Common loon","water bird","fauna","lake","fish","A powerful diver with unusually solid bones, it can plunge dozens of meters after fish and gives an eerie, wailing call.",sci="Gavia immer",kind="bird")

# ============================== REPTILES (kind="animal", fauna) ==============================
S("eastern-box-turtle","Eastern box turtle","turtle (reptile)","fauna","forest","omni","Its hinged shell can close fully like a box, and a single turtle may live more than 80 years in one small patch of woods.",sci="Terrapene carolina",kind="animal")
S("snapping-turtle","Common snapping turtle","turtle (reptile)","fauna","wetland","omni","A heavy freshwater turtle with powerful jaws, it lurks buried in mud and ambushes prey that passes overhead.",sci="Chelydra serpentina",kind="animal")
S("painted-turtle","Painted turtle","turtle (reptile)","fauna","lake","omni","The most widespread turtle in North America, it basks in rows on logs, and its hatchlings can survive winter frozen in the nest.",sci="Chrysemys picta",kind="animal")
S("american-alligator","American alligator","reptile (crocodilian)","fauna","wetland","carn","A conservation success story, it digs 'gator holes' that hold water and shelter other wetland life during droughts.",sci="Alligator mississippiensis",kind="animal")
S("western-diamondback","Western diamondback rattlesnake","snake (reptile)","fauna","desert","carn","It warns intruders by buzzing the rattle on its tail and senses warm prey with heat-detecting pits on its face.",sci="Crotalus atrox",kind="animal")
S("garter-snake","Common garter snake","snake (reptile)","fauna","widespread","amphibivore","One of the most common snakes, it is harmless to people and tolerates cold so well that it is often the first snake out in spring.",sci="Thamnophis sirtalis",kind="animal")
S("gopher-snake","Gopher snake","snake (reptile)","fauna","grass","smallmammals","A large, nonvenomous snake, it hisses and vibrates its tail to bluff like a rattlesnake when it is cornered.",sci="Pituophis catenifer",kind="animal")
S("eastern-fence-lizard","Eastern fence lizard","lizard (reptile)","fauna","forest","insects","It scurries up the far side of a tree to escape, and in some areas has evolved longer legs to flee invasive fire ants.",sci="Sceloporus undulatus",kind="animal")
S("green-anole","Green anole","lizard (reptile)","fauna","edge","insects","It can shift from green to brown with its mood and temperature, and males flash a pink throat-fan at rivals.",sci="Anolis carolinensis",kind="animal")
S("desert-tortoise","Desert tortoise","tortoise (reptile)","fauna","desert","herb","It survives blistering deserts by digging deep burrows and storing water in its bladder for the dry months.",sci="Gopherus agassizii",kind="animal")

# ============================== AMPHIBIANS (kind="animal", fauna) ==============================
S("american-bullfrog","American bullfrog","frog (amphibian)","fauna","wetland","carn","The largest frog in North America, its deep 'jug-o-rum' call carries far, and it will eat almost anything it can swallow.",sci="Lithobates catesbeianus",kind="animal")
S("spring-peeper","Spring peeper","frog (amphibian)","fauna","wetland","insects","A tiny tree frog, its loud peeping chorus on cool evenings is one of the first sounds of spring.",sci="Pseudacris crucifer",kind="animal")
S("american-toad","American toad","toad (amphibian)","fauna","edge","insects","Its warty skin oozes a mild poison that deters predators, and it can eat thousands of insects in a single season.",sci="Anaxyrus americanus",kind="animal")
S("wood-frog","Wood frog","frog (amphibian)","fauna","wetforest","insects","It can survive being frozen nearly solid each winter, its heart stopping, then thaw out and hop away in spring.",sci="Lithobates sylvaticus",kind="animal")
S("eastern-newt","Eastern newt","salamander (amphibian)","fauna","lake","insects","Its bright orange land-living 'eft' stage warns predators that it is toxic before it returns to the water as an adult.",sci="Notophthalmus viridescens",kind="animal")
S("spotted-salamander","Spotted salamander","salamander (amphibian)","fauna","wetforest","insects","It spends most of its life hidden underground, emerging on rainy spring nights to breed in temporary woodland pools.",sci="Ambystoma maculatum",kind="animal")
S("hellbender","Hellbender","salamander (amphibian)","fauna","river","insects","North America's largest salamander, it breathes through wrinkly folds of skin and needs cold, clean, fast-flowing streams.",sci="Cryptobranchus alleganiensis",kind="animal")

# ============================== FRESHWATER FISH (kind="animal", fauna) ==============================
S("brook-trout","Brook trout","freshwater fish","fauna","river","insects","A jewel-toned native of cold mountain streams, it is so sensitive to warmth and pollution that its presence signals clean water.",sci="Salvelinus fontinalis",kind="animal")
S("rainbow-trout","Rainbow trout","freshwater fish","fauna","river","insects","Named for the pink stripe along its side, it is prized by anglers and can leap waterfalls to reach its spawning grounds.",sci="Oncorhynchus mykiss",kind="animal")
S("largemouth-bass","Largemouth bass","freshwater fish","fauna","lake","fish","A favorite sport fish, the male sweeps out a nest, fans the eggs to keep them clean, and then guards the young fry.",sci="Micropterus salmoides",kind="animal")
S("bluegill","Bluegill","sunfish (freshwater fish)","fauna","lake","insects","A common panfish, the male sweeps out saucer-shaped nests in the shallows and defends them fiercely.",sci="Lepomis macrochirus",kind="animal")
S("channel-catfish","Channel catfish","freshwater fish","fauna","river","omni","It 'tastes' the water with whisker-like barbels and has taste buds scattered all over its body to find food in the dark.",sci="Ictalurus punctatus",kind="animal")

# ============================== INSECTS & SPIDERS (kind="insect", fauna) ==============================
S("monarch-butterfly","Monarch butterfly","butterfly (insect)","fauna","meadow","nectar","Its orange wings warn that it is toxic, and it migrates thousands of kilometers to the same Mexican forests each year.",sci="Danaus plexippus",kind="insect")
S("tiger-swallowtail","Eastern tiger swallowtail","butterfly (insect)","fauna","forest","nectar","A large yellow-and-black butterfly whose caterpillar has fake eyespots that make it look like a small snake.",sci="Papilio glaucus",kind="insect")
S("honey-bee","Western honey bee","bee (insect)","fauna","meadow","pollen","It tells hive-mates where flowers are by dancing, and a strong colony can visit millions of blossoms a day.",sci="Apis mellifera",kind="insect")
S("bumble-bee","Common eastern bumble bee","bee (insect)","fauna","meadow","pollen","It can fly in cool weather by shivering to warm up, and 'buzz-pollinates' flowers that honey bees cannot.",sci="Bombus impatiens",kind="insect")
S("firefly","Common eastern firefly","beetle (insect)","fauna","meadow","insects","It is not a fly but a beetle, flashing a coded light from its belly to find a mate on summer nights.",sci="Photinus pyralis",kind="insect")
S("lady-beetle","Convergent lady beetle","beetle (insect)","fauna","meadow","insects","A gardener's friend, a single ladybug can eat thousands of plant-sucking aphids over its life.",sci="Hippodamia convergens",kind="insect")
S("green-darner","Common green darner","dragonfly (insect)","fauna","wetland","insects","One of the fastest insects, it catches prey in mid-air with a basket of legs, and some even migrate like birds.",sci="Anax junius",kind="insect")
S("carolina-mantis","Carolina mantis","mantis (insect)","fauna","meadow","insects","It can swivel its head almost all the way around and seizes prey with lightning-fast, spined front legs.",sci="Stagmomantis carolina",kind="insect")
S("luna-moth","Luna moth","moth (insect)","fauna","forest",None,"A large, pale-green moth with long tails, the adult has no mouth and lives only about a week, just long enough to mate.",sci="Actias luna",kind="insect")
S("periodical-cicada","Periodical cicada","cicada (insect)","fauna","forest",None,"It spends 13 or 17 years underground as a nymph, then emerges in vast synchronized swarms to sing and mate.",sci="Magicicada",kind="insect")
S("carpenter-ant","Black carpenter ant","ant (insect)","fauna","forest","omni","It does not eat wood but tunnels through damp, rotting wood to nest, helping to break down dead trees.",sci="Camponotus pennsylvanicus",kind="insect")
S("garden-spider","Yellow garden spider","spider (arachnid)","fauna","meadow","insects","It weaves a zigzag band of silk down the center of its wheel-shaped web, then waits head-down for prey.",sci="Argiope aurantia",kind="insect")
S("wolf-spider","Wolf spider","spider (arachnid)","fauna","grass","insects","Rather than build a web, it chases down prey on foot and carries its egg sac, and later its babies, on its back.",sci="Lycosidae",kind="insect")

# ============================== GEOLOGY: ROCKS (kind="rock", geology) ==============================
S("granite","Granite","igneous rock","geology",None,None,"Formed deep underground from slowly cooled magma, its coarse crystals of quartz and feldspar make it hard and long-lasting.",sci="It is the most common rock in the continents.",kind="rock")
S("basalt","Basalt","igneous rock","geology",None,None,"It forms when lava cools quickly at the surface, building vast lava plains and most of the ocean floor.",sci="Its crystals are usually too small to see without a lens.",kind="rock")
S("obsidian","Obsidian","igneous rock","geology",None,None,"It is volcanic glass, formed when lava cools so fast that no crystals can grow, and it can be flaked razor-sharp.",sci="Early peoples prized it for cutting tools and arrowheads.",kind="rock")
S("pumice","Pumice","igneous rock","geology",None,None,"So full of frozen gas bubbles that it can float on water, it forms from frothy lava blasted out of a volcano.",sci="It is the only common rock that floats.",kind="rock")
S("sandstone","Sandstone","sedimentary rock","geology",None,None,"Made of sand grains cemented together, it often preserves ripple marks and forms colorful canyon walls and arches.",sci="Many desert cliffs and arches are carved from it.",kind="rock")
S("limestone","Limestone","sedimentary rock","geology",None,None,"Built largely from the shells and skeletons of sea creatures, it slowly dissolves in mild acid to form caves.",sci="Most of the world's caves are dissolved out of it.",kind="rock")
S("shale","Shale","sedimentary rock","geology",None,None,"Formed from compacted mud and clay, it splits into thin flat layers and often holds the best-preserved fossils.",sci="It is the most common sedimentary rock.",kind="rock")
S("conglomerate","Conglomerate","sedimentary rock","geology",None,None,"A natural concrete of rounded pebbles cemented together, it forms in fast water like riverbeds and beaches.",sci="Its rounded pebbles show they were tumbled by water.",kind="rock")
S("coal","Coal","sedimentary rock","geology",None,None,"It forms over millions of years from buried plant matter squeezed under heat and pressure, storing ancient sunlight as fuel.",sci="It is a fossil fuel made from ancient swamp plants.",kind="rock")
S("marble","Marble","metamorphic rock","geology",None,None,"It begins as limestone, then heat and pressure recrystallize it into the smooth stone that sculptors love to carve.",sci="Many famous statues are carved from it.",kind="rock")
S("slate","Slate","metamorphic rock","geology",None,None,"Heat and pressure turn shale into slate, which splits into flat sheets once widely used for roofs and chalkboards.",sci="It splits into smooth, flat plates.",kind="rock")
S("gneiss","Gneiss","metamorphic rock","geology",None,None,"Intense heat and pressure squeeze its minerals into striking light-and-dark bands, and it is among the oldest rock on Earth.",sci="Its minerals are sorted into visible stripes.",kind="rock")
S("quartzite","Quartzite","metamorphic rock","geology",None,None,"Sandstone baked and pressed until its grains fuse together, it becomes so hard it resists almost all weathering.",sci="It is one of the hardest common rocks.",kind="rock")

# ============================== GEOLOGY: MINERALS (kind="rock", geology) ==============================
S("quartz","Quartz","mineral","geology",None,None,"One of the most common minerals, it grows six-sided crystals and comes in colorful forms like purple amethyst and yellow citrine.",sci="Its chemical makeup is silicon dioxide.",kind="rock")
S("feldspar","Feldspar","mineral","geology",None,None,"The most abundant mineral group in Earth's crust, it slowly weathers into the clay that helps build soil.",sci="It makes up much of the rock granite.",kind="rock")
S("calcite","Calcite","mineral","geology",None,None,"It fizzes in weak acid and can split light into a double image, and it is the mineral that builds limestone and marble.",sci="A drop of vinegar makes it bubble.",kind="rock")
S("pyrite","Pyrite","mineral","geology",None,None,"Its shiny brassy cubes earned the nickname 'fool's gold,' though it is far harder and lighter than real gold.",sci="It often grows in near-perfect cubes.",kind="rock")
S("mica","Mica","mineral","geology",None,None,"It peels apart into thin, flexible, see-through sheets and adds the glitter you can see in many rocks.",sci="It splits into paper-thin transparent flakes.",kind="rock")
S("gypsum","Gypsum","mineral","geology",None,None,"So soft you can scratch it with a fingernail, it is ground up to make the plaster inside drywall.",sci="It is soft enough to scratch with a fingernail.",kind="rock")
S("hematite","Hematite","mineral","geology",None,None,"A major ore of iron, it leaves a rust-red streak and tints many rocks and soils a reddish color.",sci="It is one of the main ores we get iron from.",kind="rock")
S("fluorite","Fluorite","mineral","geology",None,None,"It forms colorful cube-shaped crystals and glows under ultraviolet light, the very origin of the word 'fluorescent.'",sci="Many specimens glow under UV light.",kind="rock")
S("halite","Halite","mineral","geology",None,None,"This is rock salt, the same salt you eat, left behind when ancient seas and salty lakes dried up.",sci="It is the mineral form of table salt.",kind="rock")

# ============================== GEOLOGY: FOSSILS (kind="rock", geology) ==============================
S("trilobite","Trilobite","fossil","geology",None,None,"These hard-shelled sea animals ruled the oceans for nearly 300 million years before vanishing, and are common fossils today.",sci="They went extinct about 250 million years ago.",kind="rock")
S("ammonite","Ammonite","fossil","geology",None,None,"The coiled, chambered shells of these ancient relatives of squid are prized fossils, often shimmering with color.",sci="Their closest living relative is the nautilus.",kind="rock")
S("petrified-wood","Petrified wood","fossil","geology",None,None,"Ancient buried wood whose every cell was slowly replaced by minerals, turning a log to colorful stone that still shows its rings.",sci="The wood has been entirely turned to stone.",kind="rock")
S("dinosaur-bone","Dinosaur bone","fossil","geology",None,None,"Buried bone in which minerals filled and replaced the original tissue tells us about animals that lived millions of years ago.",sci="The bone has been mineralized over millions of years.",kind="rock")
S("amber","Amber","fossil","geology",None,None,"Hardened tree resin from long-dead forests, it sometimes traps and perfectly preserves ancient insects inside.",sci="It is fossilized tree resin, not a true stone.",kind="rock")

# ---- additional authored species (each module appends to g.SPECS) ----
import birds1, birds2, mammals2, trees2, plants2, herps2, fish2, fungi2, insects2, geo2  # noqa

# ---- DEDUP: keep first (base) occurrence of any id; drop later collisions ----
_seen_ids = {}
_deduped = []
_dropped = []
for _sp in g.SPECS:
    _id = _sp["id"]
    if _id in _seen_ids:
        _dropped.append(_id)
        continue
    _seen_ids[_id] = True
    _deduped.append(_sp)
g.SPECS[:] = _deduped
print("dedup: kept", len(g.SPECS), "| dropped", len(_dropped), "dup ids")

# ============================== UNITS (bucket species by category) ==============================
_buckets = {}
for _s in g.SPECS:
    _c = g.simple_cat(_s["group"])
    _buckets.setdefault(_c, []).append(_s["id"])
def B(*cats):
    out = []
    for c in cats:
        out += _buckets.get(c, [])
    return out

g.chunk_units("North American Trees", "Native trees and how to know them", "flora", "Core", B("tree"), 7)
g.chunk_units("Wildflowers, Shrubs & Grasses", "The flowering plants of field and forest", "flora", "Core", B("wildflower","shrub","grass","fern or moss"), 7)
g.chunk_units("Fungi & Lichens", "The recyclers and rock-breakers", "flora", "Core", B("fungus or lichen"), 6)
g.chunk_units("Mammals of North America", "From shrews to bears", "fauna", "Core", B("mammal"), 7)
g.chunk_units("Birds of North America", "Raptors, songbirds and water birds", "fauna", "Core", B("bird"), 7)
g.chunk_units("Reptiles & Amphibians", "Snakes, turtles, frogs and salamanders", "fauna", "Core", B("reptile","amphibian"), 7)
g.chunk_units("Fish, Insects & Spiders", "Stream fish and the world of bugs", "fauna", "Core", B("freshwater fish","insect","arachnid"), 7)
g.chunk_units("Rocks Up Close", "The three great rock families", "geology", "Core", B("rock"), 7)
g.chunk_units("Minerals Up Close", "The crystals that build the rocks", "geology", "Core", B("mineral"), 6)
g.chunk_units("Fossils", "Windows into deep time", "geology", "Core", B("fossil"), 6)

g.emit()

# ---- runtime photo queries (browser fetches by these terms; SVG art is the fallback) ----
import json as _json
_q = {}
for _s in g.SPECS:
    _term = _s["name"] if _s["kind"] == "rock" else (_s["sci"] if _s.get("sci") else _s["name"])
    _q[_s["id"]] = _term
with open("/home/claude/terra/seahype-queries.js", "w", encoding="utf-8") as _f:
    _f.write("/* species -> Wikipedia search term, for runtime photo loading */\n")
    _f.write("window.__SEA_QUERIES__ = " + _json.dumps(_q, ensure_ascii=False) + ";\n")
print("wrote queries:", len(_q))

# ---- per-species meta for guided Expedition challenges ----
_meta = {}
for _s in g.SPECS:
    _cat = g.simple_cat(_s["group"])
    _hab = g.HAB.get(_s["hab"], _s["hab"]) if _s["hab"] else ""
    _diet = g.DIET.get(_s["diet"], _s["diet"]) if _s["diet"] else ""
    _art = _s["art"] or g.art_for(_cat, _s["hab"])
    _meta[_s["id"]] = {"name": _s["name"], "cat": _cat, "group": _s["group"],
                       "hab": _hab, "habKey": _s["hab"], "diet": _diet,
                       "art": _art, "trait": _s["trait"]}
with open("/home/claude/terra/seahype-pathmeta.js", "w", encoding="utf-8") as _f:
    _f.write("window.__SEA_SPECIES_META__ = " + _json.dumps(_meta, ensure_ascii=False) + ";\n")
print("wrote species meta entries:", len(_meta))
