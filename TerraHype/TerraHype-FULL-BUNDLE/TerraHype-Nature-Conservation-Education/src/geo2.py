# -*- coding: utf-8 -*-
import gen_curriculum as g
S = g.S
B = "geology"
def G(sid, name, grp, fact, trait): S(sid, name, grp, B, None, None, trait, sci=fact, kind="rock")

# ---- rocks ----
G("gabbro","Gabbro","coarse igneous rock","It forms when magma cools slowly deep underground.","It is the deep-earth cousin of basalt, sharing its minerals but growing much larger crystals.")
G("rhyolite","Rhyolite","fine igneous rock","It has the same makeup as granite but cools quickly at the surface.","Pale and packed with tiny crystals, it erupts from some of the most explosive volcanoes.")
G("andesite","Andesite","volcanic igneous rock","It is named for the Andes Mountains, where it is common.","A medium-gray lava rock typical of the chain of volcanoes ringing the Pacific.")
G("chert","Chert","hard sedimentary rock","It is built from microscopic grains of quartz.","It breaks with razor edges, so early people chipped it (as flint) into arrowheads and blades.")
G("breccia","Breccia","sedimentary rock","It forms when broken rock fragments are cemented back together.","Its pieces are sharp and angular, a sign they were buried before travel could wear them smooth.")
G("schist","Schist","metamorphic rock","Heat and pressure lined up its flaky minerals into layers.","It sparkles with mica and splits into wavy, glittering sheets.")

# ---- minerals ----
G("garnet","Garnet","mineral","It commonly grows as deep-red, many-sided crystals.","Hard and sharp, crushed garnet is used as sandpaper grit and in waterjet cutters.")
G("magnetite","Magnetite","iron mineral","It is the most magnetic natural mineral on Earth.","A single piece can pull a compass needle off course; a magnetized lump is called lodestone.")
G("galena","Galena","mineral","It is the chief ore that we mine for lead.","Heavy and metallic gray, it cleaves into neat little cubes.")
G("talc","Talc","soft mineral","It is the softest mineral, ranked 1 on the Mohs hardness scale.","So soft you can scratch it with a fingernail, it is ground into talcum powder.")
G("graphite","Graphite","mineral","It is a soft, slippery form of pure carbon.","Gray and greasy to the touch, it is the 'lead' in pencils and even conducts electricity.")

# ---- fossils ----
G("brachiopod","Brachiopod","fossil shell","These clam-like sea animals carried two unequal shells.","Their fossils are among the most common finds in ancient sea-floor rocks.")
G("crinoid","Crinoid","fossil sea lily","Despite the nickname, crinoids are animals related to starfish.","They left button- and stem-shaped fossils stacked like tiny stone poker chips.")
G("fossil-shark-tooth","Fossil shark tooth","fossil tooth","Sharks grow and shed thousands of teeth over a lifetime.","Because a shark's skeleton is soft cartilage, its hard teeth are the part most often fossilized.")
G("fossil-coral","Fossil coral","reef fossil","Corals are tiny animals that build stony reefs together.","Ancient reef corals left honeycomb and chain-link patterns preserved in limestone.")
