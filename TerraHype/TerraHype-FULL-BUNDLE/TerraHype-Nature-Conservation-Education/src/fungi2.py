# -*- coding: utf-8 -*-
import gen_curriculum as g
S = g.S
B = "flora"
def Fg(sid, name, grp, hab, trait, sci, diet="decompose"): S(sid, name, grp, B, hab, diet, trait, sci=sci, kind="fungus")

# ---- fungi ----
Fg("giant-puffball","Giant puffball","puffball fungus","meadow","A white ball that can swell as large as a soccer ball, then puffs out trillions of spores.","Calvatia gigantea")
Fg("destroying-angel","Destroying angel","amanita mushroom (toadstool)","forest","A pure-white woodland mushroom that is among the deadliest poisonous fungi in North America.","Amanita bisporigera",diet=None)
Fg("king-bolete","King bolete","bolete mushroom","conifer","A stout mushroom with a spongy layer of pores, not gills, beneath its cap; it partners with tree roots.","Boletus edulis",diet=None)
Fg("chicken-of-the-woods","Chicken of the woods","bracket fungus","forest","Vivid orange-and-yellow shelves grow in overlapping fans on logs and trunks.","Laetiporus sulphureus")
Fg("hen-of-the-woods","Hen of the woods","bracket fungus","forest","Big, ruffled clusters sprout at the base of oaks, layered like a sitting hen's feathers.","Grifola frondosa")
Fg("artist-conk","Artist's conk","bracket fungus (conk)","forest","Its flat white underside bruises brown when scratched, so people can draw on it like a canvas.","Ganoderma applanatum")
Fg("birds-nest-fungus","Bird's nest fungus","cup fungus","soil","Tiny cups hold egg-like packets of spores that raindrops splash out to spread them.","Cyathus striatus")
Fg("earthstar","Earthstar","puffball fungus","forest","Its outer skin splits open into a star that props up a central spore sac.","Geastrum saccatum")
Fg("common-stinkhorn","Common stinkhorn","stinkhorn fungus","soil","It oozes a foul-smelling slime that lures flies, which then carry its spores away.","Phallus impudicus")
Fg("jack-o-lantern","Jack-o'-lantern mushroom","gilled mushroom (toadstool)","forest","This poisonous orange mushroom's gills can glow faintly green in the dark.","Omphalotus illudens")
Fg("honey-fungus","Honey fungus","gilled mushroom","forest","Its underground threads can spread for kilometers, forming some of the largest organisms on Earth.","Armillaria mellea")
Fg("lions-mane","Lion's mane","tooth fungus (mushroom)","forest","It cascades from logs in white spines like a frozen waterfall or a shaggy mane.","Hericium erinaceus")

# ---- lichens (a partnership of fungus and alga) ----
Fg("old-mans-beard","Old man's beard","beard lichen","conifer","A pale, stringy lichen that drapes from branches and grows only where the air is clean.","Usnea",diet=None)
Fg("lungwort-lichen","Lungwort lichen","leaf lichen","wetforest","Its broad green lobes look like lung tissue, and it captures nitrogen from the air.","Lobaria pulmonaria",diet=None)
Fg("rock-tripe","Rock tripe","rock lichen","rocky","A leathery lichen that clings to bare cliff faces by a single central anchor point.","Umbilicaria",diet=None)
Fg("common-greenshield","Common greenshield lichen","shield lichen","forest","A flat, pale-green lichen that patches tree bark in spreading circular crusts.","Flavoparmelia caperata",diet=None)
