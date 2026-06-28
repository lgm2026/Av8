# -*- coding: utf-8 -*-
import gen_curriculum as g
S = g.S
B = "fauna"
def R(sid, name, grp, hab, diet, trait, sci): S(sid, name, grp, B, hab, diet, trait, sci=sci, kind="animal")

# ---- snakes ----
R("eastern-ratsnake","Eastern ratsnake","ratsnake (reptile)","forest","smallmammals","A large, strong climber that squeezes rodents and birds; it is harmless to people.","Pantherophis alleghaniensis")
R("northern-watersnake","Northern watersnake","watersnake (reptile)","wetland","amphibivore","A nonvenomous water snake often mistaken for a cottonmouth as it hunts fish and frogs.","Nerodia sipedon")
R("eastern-hognose-snake","Eastern hognose snake","hognose snake (reptile)","edge","amphibivore","When alarmed it flattens its neck and hisses, then rolls over and plays dead.","Heterodon platirhinos")
R("ringneck-snake","Ring-necked snake","snake (reptile)","forest","insects","A small, secretive snake with a bright yellow-orange belly and a matching neck ring.","Diadophis punctatus")
R("eastern-milksnake","Eastern milksnake","milk snake (reptile)","edge","smallmammals","Its red, black and yellow bands mimic a venomous coral snake, but it is completely harmless.","Lampropeltis triangulum")
R("eastern-coral-snake","Eastern coral snake","coral snake (reptile)","forest","carn","A venomous snake where red bands touch yellow: 'red touches yellow, kill a fellow.'","Micrurus fulvius")
R("timber-rattlesnake","Timber rattlesnake","rattlesnake (reptile)","forest","smallmammals","A venomous pit viper of eastern woods that buzzes its tail in warning before it strikes.","Crotalus horridus")
R("copperhead","Copperhead","copperhead snake (reptile)","forest","smallmammals","A venomous pit viper whose hourglass coppery bands vanish against fallen leaves.","Agkistrodon contortrix")
R("common-kingsnake","Common kingsnake","kingsnake (reptile)","edge","carn","A glossy snake that even eats venomous snakes, being largely immune to their venom.","Lampropeltis getula")
R("rough-green-snake","Rough green snake","green snake (reptile)","edge","insects","A slender, bright-green snake that glides through shrubs hunting insects and spiders.","Opheodrys aestivus")

# ---- lizards ----
R("six-lined-racerunner","Six-lined racerunner","racerunner lizard (reptile)","grass","insects","A fast, striped lizard that darts across sandy ground in sudden bursts of speed.","Aspidoscelis sexlineata")
R("five-lined-skink","Five-lined skink","skink (reptile)","forest","insects","Young skinks flash an electric-blue tail that can snap off to distract a predator.","Plestiodon fasciatus")
R("western-fence-lizard","Western fence lizard","fence lizard (reptile)","rocky","insects","Males do 'push-ups' to flash blue belly patches; the lizard may even lower Lyme disease in ticks.","Sceloporus occidentalis")
R("eastern-collared-lizard","Eastern collared lizard","collared lizard (reptile)","desert","insects","A boldly collared lizard that can sprint on its hind legs like a tiny dinosaur.","Crotaphytus collaris")
R("gila-monster","Gila monster","beaded lizard (reptile)","desert","carn","One of the few venomous lizards, slow and beaded, storing fat in its thick tail.","Heloderma suspectum")

# ---- turtles & tortoises ----
R("eastern-musk-turtle","Eastern musk turtle","musk turtle (reptile)","wetland","omni","A small turtle that releases a musky smell when handled and walks along pond bottoms.","Sternotherus odoratus")
R("red-eared-slider","Red-eared slider","slider turtle (reptile)","wetland","omni","Named for the red stripe behind each eye, it basks in stacks on logs.","Trachemys scripta")
R("wood-turtle","Wood turtle","wood turtle (reptile)","river","omni","Its shell looks carved from wood, and it stomps the ground to lure earthworms up.","Glyptemys insculpta")
R("spiny-softshell-turtle","Spiny softshell turtle","softshell turtle (reptile)","river","carn","A flat, pancake-like turtle with a leathery shell and a snorkel-like nose.","Apalone spinifera")
R("gopher-tortoise","Gopher tortoise","tortoise (reptile)","grass","herb","Its deep burrows shelter hundreds of other species, making it a keystone of southern pinelands.","Gopherus polyphemus")
R("ornate-box-turtle","Ornate box turtle","box turtle (reptile)","grass","omni","A land turtle of the prairies with yellow lines radiating across a high-domed shell.","Terrapene ornata")

# ---- frogs & toads ----
R("gray-treefrog","Gray treefrog","treefrog (amphibian)","forest","insects","It can shift from gray to green and grips bark with sticky, expandable toe pads.","Hyla versicolor")
R("green-frog","Green frog","frog (amphibian)","lake","insects","Its call sounds like a loose banjo string plucked once over the pond.","Lithobates clamitans")
R("northern-leopard-frog","Northern leopard frog","leopard frog (amphibian)","wetland","insects","Green and patterned with rows of dark, light-ringed spots like a leopard's coat.","Lithobates pipiens")
R("pickerel-frog","Pickerel frog","frog (amphibian)","wetland","insects","Two rows of square chocolate spots mark its back, and its skin tastes foul to predators.","Lithobates palustris")
R("northern-cricket-frog","Northern cricket frog","frog (amphibian)","wetland","insects","A thumbnail-sized frog whose clicking call sounds like two pebbles tapped together.","Acris crepitans")
R("fowlers-toad","Fowler's toad","toad (amphibian)","edge","insects","A warty toad of sandy ground with a short, nasal, bleating call.","Anaxyrus fowleri")
R("eastern-spadefoot","Eastern spadefoot","spadefoot toad (amphibian)","edge","insects","It digs backward into the soil with spade-like hind feet and waits underground for heavy rain.","Scaphiopus holbrookii")

# ---- salamanders & newts ----
R("eastern-red-backed-salamander","Eastern red-backed salamander","salamander (amphibian)","forest","insects","A lungless salamander that breathes through its skin and never needs to enter water.","Plethodon cinereus")
R("tiger-salamander","Tiger salamander","salamander (amphibian)","grass","insects","One of the largest land salamanders, boldly blotched with yellow on black.","Ambystoma tigrinum")
R("marbled-salamander","Marbled salamander","salamander (amphibian)","forest","insects","Silvery-white bands cross its black body, and it guards its eggs in a dry nest until rains come.","Ambystoma opacum")
R("mudpuppy","Mudpuppy","mudpuppy salamander (amphibian)","river","carn","A fully aquatic salamander that keeps frilly red gills for its entire life.","Necturus maculosus")
R("rough-skinned-newt","Rough-skinned newt","newt (amphibian)","wetforest","insects","Its skin carries one of the strongest natural toxins known, advertised by a bright orange belly.","Taricha granulosa")
