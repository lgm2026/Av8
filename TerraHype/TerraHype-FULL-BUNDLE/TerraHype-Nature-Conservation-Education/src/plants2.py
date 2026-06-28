# -*- coding: utf-8 -*-
import gen_curriculum as g
S = g.S
B = "flora"
def P(sid, name, grp, hab, trait, sci): S(sid, name, grp, B, hab, "photosyn", trait, sci=sci, kind="plant")

# ---- wildflowers ----
P("wild-bergamot","Wild bergamot","bergamot wildflower","meadow","Its ragged lavender flower heads smell strongly of mint and draw bees, butterflies and hummingbirds.","Monarda fistulosa")
P("butterfly-milkweed","Butterfly milkweed","orange milkweed wildflower","meadow","A brilliant-orange milkweed whose flowers swarm with butterflies and whose leaves feed monarch caterpillars.","Asclepias tuberosa")
P("showy-milkweed","Showy milkweed","milkweed wildflower","grass","Star-shaped pink flower clusters give way to pods of silk-tufted seeds; its leaves feed western monarchs.","Asclepias speciosa")
P("new-england-aster","New England aster","purple aster wildflower","meadow","Clouds of purple, daisy-like blooms with gold centers feed pollinators late into the fall.","Symphyotrichum novae-angliae")
P("common-yarrow","Common yarrow","yarrow wildflower","meadow","Flat-topped clusters of tiny white flowers rise above feathery leaves long used to slow bleeding.","Achillea millefolium")
P("wild-lupine","Wild lupine","lupine wildflower","grass","Spikes of blue pea-flowers; its leaves are the only food of the rare Karner blue butterfly's caterpillars.","Lupinus perennis")
P("blue-flag-iris","Blue flag iris","wild iris wildflower","wetland","A native iris of marsh edges with violet-blue flowers veined in yellow.","Iris versicolor")
P("wild-columbine","Wild columbine","columbine wildflower","rocky","Nodding red-and-yellow flowers with backward-pointing nectar spurs that hummingbirds probe.","Aquilegia canadensis")
P("bloodroot","Bloodroot","woodland wildflower","forest","An early-spring forest flower whose broken root oozes a red-orange sap.","Sanguinaria canadensis")
P("mayapple","Mayapple","woodland wildflower","forest","Pairs of umbrella-like leaves hide one white flower; only its ripe fruit is edible, the rest is toxic.","Podophyllum peltatum")
P("trout-lily","Trout lily","spring lily wildflower","forest","Mottled leaves and a nodding yellow lily appear briefly before the forest canopy leafs out.","Erythronium americanum")
P("virginia-bluebells","Virginia bluebells","woodland wildflower","wetforest","Pink buds open into nodding, bell-shaped blue flowers across spring floodplain woods.","Mertensia virginica")
P("wild-geranium","Wild geranium","woodland wildflower","forest","Its ripe seed capsules curl back and fling the seeds away like tiny catapults.","Geranium maculatum")
P("joe-pye-weed","Joe-pye weed","tall wildflower","wetland","Towering domes of dusty-pink flowers buzz with late-summer butterflies and bees.","Eutrochium purpureum")
P("jack-in-the-pulpit","Jack-in-the-pulpit","woodland wildflower","wetforest","A hooded green-and-purple 'pulpit' shelters a spike that later forms a cluster of red berries.","Arisaema triphyllum")
P("evening-primrose","Evening primrose","wildflower","edge","Its lemon-yellow flowers open at dusk and are pollinated by night-flying moths.","Oenothera biennis")

# ---- shrubs ----
P("spicebush","Spicebush","native shrub","wetforest","Crush a leaf and it smells of spice; its red berries and leaves feed the spicebush swallowtail.","Lindera benzoin")
P("witch-hazel","Witch-hazel","native shrub","forest","It blooms with spidery yellow flowers in late fall as its leaves drop, then shoots its seeds out.","Hamamelis virginiana")
P("american-elderberry","American elderberry","elderberry shrub","wetland","Flat clusters of tiny white flowers become dark purple berries used in jelly and pie.","Sambucus canadensis")
P("buttonbush","Buttonbush","wetland shrub","wetland","A water-loving shrub with spherical, pincushion-like white flower balls that draw butterflies.","Cephalanthus occidentalis")
P("staghorn-sumac","Staghorn sumac","sumac shrub","edge","Velvety, antler-like branches end in fuzzy red berry cones that last through winter.","Rhus typhina")
P("winterberry","Winterberry","holly shrub","wetland","A native deciduous holly whose bare winter branches glow with bright red berries.","Ilex verticillata")
P("mountain-laurel","Mountain laurel","evergreen shrub","forest","Its spring-loaded flower stamens flick pollen onto visiting bees as they land.","Kalmia latifolia")
P("american-beautyberry","American beautyberry","native shrub","edge","Tight rings of vivid magenta-purple berries clasp its stems in autumn.","Callicarpa americana")
P("creosote-bush","Creosote bush","desert shrub","desert","A desert shrub that smells of rain; some clonal rings are among the oldest living things on Earth.","Larrea tridentata")
P("greenleaf-manzanita","Greenleaf manzanita","manzanita shrub","mountain","Smooth red-brown bark and crooked branches; its berries ('little apples') feed wildlife.","Arctostaphylos patula")

# ---- grasses, sedges & rushes ----
P("indiangrass","Indiangrass","prairie grass","grass","A tall prairie grass with golden, plume-like seed heads that shimmer in autumn light.","Sorghastrum nutans")
P("sideoats-grama","Sideoats grama","grama grass","grass","Small oat-like seed spikes dangle along just one side of each arching stem.","Bouteloua curtipendula")
P("soft-rush","Soft rush","wetland rush","wetland","Forms green clumps of round, wiry stems; rushes are round where sedges are three-sided.","Juncus effusus")
P("tussock-sedge","Tussock sedge","marsh sedge","wetland","Builds raised clumps ('tussocks') in marshes; its stem is solid and triangular in cross-section.","Carex stricta")

# ---- ferns & other spore plants ----
P("maidenhair-fern","Maidenhair fern","woodland fern","wetforest","Delicate fan-shaped leaflets spread on shiny black stems across moist, shady woods.","Adiantum pedatum")
P("christmas-fern","Christmas fern","evergreen fern","forest","Stays green through winter, and each leaflet has a small 'toe' like a Christmas stocking.","Polystichum acrostichoides")
P("royal-fern","Royal fern","large fern","wetland","A big fern of swampy ground whose fertile frond tips look like clusters of flowers.","Osmunda regalis")
P("field-horsetail","Field horsetail","horsetail spore plant","riparian","A living fossil with jointed, hollow stems; its ancient relatives helped form today's coal.","Equisetum arvense")

# ---- mosses & clubmosses ----
P("haircap-moss","Haircap moss","cushion moss","forest","One of the tallest mosses, forming star-like rosettes of stiff little leaves.","Polytrichum commune")
P("princess-pine","Princess pine","clubmoss","forest","A tiny evergreen clubmoss that looks like a miniature pine tree carpeting the forest floor.","Dendrolycopodium obscurum")
