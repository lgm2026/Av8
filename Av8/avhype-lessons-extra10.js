/* AvHype Aviation Education — Final stretch II (extra10). Brings the library to 501.
   PPL fundamentals (aerodynamics, systems, instruments, weather, regs) plus a couple of
   instrument items. All airplane-pathway. Merges into LESSONS. JSON-serializable.
   Sources: PHAK, Airplane Flying Handbook, AC 00-6, 14 CFR 91.3/91.103/91.205/91.213/91.409,
   AIM, Instrument Procedures Handbook. */
window.__AV_LESSONS__ = Object.assign((window.__AV_LESSONS__ || {}), {

  /* ===================== Aerodynamics & Stability ===================== */
  "aero-bernoulli": {
    title: "How a wing makes lift",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Aerodynamics -- lift", time: 5,
    explain: [
      "A wing produces lift two complementary ways. By Bernoulli's principle, air speeding up over the curved upper surface has lower pressure than the slower air beneath, and that pressure difference pushes the wing up. By Newton's third law, the wing also deflects a mass of air downward, and the equal and opposite reaction is lift.",
      "Both descriptions are correct and describe the same physical event from different angles. What ties them together is the angle of attack -- the angle between the wing and the oncoming air -- which you control with pitch and which sets how much lift the wing makes.",
      "Increase the angle of attack and lift grows, up to the critical angle where the airflow separates and the wing stalls, regardless of airspeed or attitude."
    ],
    quiz: [
      { type: "mc", q: "Lift is best explained by:", choices: ["Bernoulli only", "Newton only", "Both Bernoulli's pressure difference and Newton's downward deflection", "Neither"], answer: 2, why: "Both the pressure difference (Bernoulli) and downwash reaction (Newton) describe the same lift." },
      { type: "tf", q: "A wing stalls at the critical angle of attack regardless of airspeed.", answer: true, why: "Stall is a function of exceeding the critical AoA, not a specific speed or attitude." }
    ]
  },
  "aero-staticstab": {
    title: "Static stability",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Aerodynamics -- stability", time: 5,
    explain: [
      "Static stability is an airplane's initial tendency after a disturbance. With positive static stability, when something nudges it off its trimmed condition the airplane's first tendency is to return toward where it was -- the quality you want for easy, hands-off flying.",
      "Neutral static stability means it tends to stay wherever the disturbance left it, and negative static stability means it tends to diverge further away, which makes an airplane tiring or dangerous to fly.",
      "Most training airplanes are designed with positive static stability so that they naturally want to return to trimmed flight, reducing pilot workload."
    ],
    quiz: [
      { type: "mc", q: "Positive static stability means after a disturbance the airplane initially tends to:", choices: ["Diverge further", "Stay put", "Return toward its original condition", "Roll inverted"], answer: 2, why: "Positive static stability is the initial tendency to return toward equilibrium." },
      { type: "tf", q: "Negative static stability means the airplane tends to diverge from its original condition.", answer: true, why: "It moves further away after a disturbance rather than returning." }
    ]
  },
  "aero-dynstab": {
    title: "Dynamic stability",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Aerodynamics -- stability", time: 5,
    explain: [
      "Dynamic stability describes what happens over time after the disturbance, as the airplane oscillates. With positive dynamic stability the oscillations gradually dampen out and die away, settling the airplane back to trimmed flight on its own.",
      "Neutral dynamic stability means the oscillations continue at a constant amplitude, and negative dynamic stability means they grow larger over time -- a worsening porpoise or wallow that demands pilot intervention.",
      "An airplane can be statically stable yet dynamically unstable, so designers aim for positive in both: an initial tendency to return, and oscillations that fade rather than build."
    ],
    quiz: [
      { type: "mc", q: "Positive dynamic stability means oscillations after a disturbance:", choices: ["Grow over time", "Stay constant", "Dampen out over time", "Reverse direction"], answer: 2, why: "Positive dynamic stability damps the oscillations until the airplane resettles." },
      { type: "tf", q: "An airplane can be statically stable but dynamically unstable.", answer: true, why: "It may initially return yet oscillate with growing amplitude over time." }
    ]
  },
  "aero-longstab": {
    title: "Longitudinal, lateral, and directional stability",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Aerodynamics -- axes", time: 6,
    explain: [
      "An airplane is stable about three axes. Longitudinal stability is stability in pitch about the lateral axis, and it is the most important, governed largely by the center of gravity and the tail -- which is why CG limits matter so much. Lateral stability is stability in roll about the longitudinal axis, helped by wing dihedral.",
      "Directional stability is stability in yaw about the vertical axis, provided mainly by the vertical fin acting like a weathervane to keep the nose into the relative wind.",
      "Lateral and directional stability are coupled, producing motions like the spiral and Dutch roll, but for a private pilot the key idea is that each axis has a design feature -- tail, dihedral, and fin -- that keeps the airplane pointed and balanced."
    ],
    quiz: [
      { type: "mc", q: "Longitudinal stability is stability about which axis, and is most affected by:", choices: ["Vertical axis; the fin", "Lateral axis; the CG and tail", "Longitudinal axis; dihedral", "All axes equally"], answer: 1, why: "Longitudinal (pitch) stability about the lateral axis depends largely on CG and the tail." },
      { type: "mc", q: "Wing dihedral primarily improves:", choices: ["Pitch stability", "Lateral (roll) stability", "Directional stability", "Engine cooling"], answer: 1, why: "Dihedral aids lateral stability in roll; the vertical fin aids directional stability." }
    ]
  },
  "aero-slips": {
    title: "Forward slips and sideslips",
    pathway: "airplane", cert: "ppl", faa: "afh",
    acs: "Aerodynamics -- slips", time: 6,
    explain: [
      "A slip is a cross-controlled maneuver -- you bank one way and hold opposite rudder -- and it comes in two forms with two purposes. A forward slip is used to lose altitude quickly without gaining airspeed: you bank, apply opposite rudder, and the fuselage turns broadside to the airflow, adding drag for a steep descent while your ground track stays straight, which is handy for getting down over an obstacle.",
      "A sideslip is the crosswind-landing tool: you bank into the wind just enough to stop the airplane from drifting and hold opposite rudder to keep the nose aligned with the runway, touching down on the upwind main wheel first.",
      "In a forward slip the nose points off to the side while the path stays the same; in a sideslip the nose stays aligned with the runway. You straighten out of a forward slip before touchdown, and you fly the sideslip right onto the runway."
    ],
    quiz: [
      { type: "mc", q: "A forward slip is used primarily to:", choices: ["Gain airspeed", "Lose altitude steeply without gaining airspeed", "Increase lift", "Turn faster"], answer: 1, why: "The cross-control turns the fuselage to the airflow, adding drag for a steep descent at a steady speed." },
      { type: "tf", q: "A sideslip is used in a crosswind landing to stop drift while keeping the nose aligned with the runway.", answer: true, why: "Bank into the wind to stop drift, opposite rudder to stay aligned, touching down upwind wheel first." }
    ]
  },
  "aero-paradrag": {
    title: "Parasite drag and the total drag curve",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Aerodynamics -- drag", time: 5,
    explain: [
      "Drag comes in two families. Parasite drag is the resistance of the airframe moving through the air -- form drag, skin friction, and interference -- and it grows rapidly with speed, roughly with the square of velocity. Induced drag is the byproduct of making lift and is greatest at low speed and high angle of attack.",
      "Add them together and you get the total drag curve, which is high at low speed because of induced drag and high again at high speed because of parasite drag. The bottom of that curve, where the two are balanced, is the speed of minimum drag and best lift-to-drag ratio.",
      "That minimum-drag speed is also your best-glide and best-endurance reference, which is why the shape of the total drag curve underlies so much of performance."
    ],
    quiz: [
      { type: "mc", q: "Parasite drag increases:", choices: ["At low speed", "Roughly with the square of airspeed", "Only in turns", "With weight only"], answer: 1, why: "Parasite drag rises sharply with speed (about velocity squared); induced drag falls with speed." },
      { type: "tf", q: "Minimum total drag occurs where parasite and induced drag are balanced.", answer: true, why: "That speed gives the best lift-to-drag ratio (best glide/endurance reference)." }
    ]
  },
  "aero-glide": {
    title: "Best glide and gliding distance",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Performance -- glide", time: 5,
    explain: [
      "If the engine quits, the airplane becomes a glider, and best-glide speed is the airspeed that gives the most distance for the altitude you have -- the speed for the best lift-to-drag ratio. Flying faster or slower than best glide steepens your descent and shortens how far you reach.",
      "For maximum gliding distance, best-glide speed is essentially the same regardless of weight, though a heavier airplane flies that speed a bit faster and arrives sooner. Wind matters a great deal over the ground: a headwind shrinks your glide range and a tailwind extends it.",
      "Know your airplane's best-glide speed cold, because in an engine failure pitching for it immediately is what buys you the most options for a landing site."
    ],
    quiz: [
      { type: "mc", q: "Best-glide speed gives:", choices: ["The slowest descent rate always", "Maximum gliding distance for the altitude available", "The fastest descent", "Maximum endurance"], answer: 1, why: "Best glide (best L/D) maximizes distance per altitude; flying off it shortens the glide." },
      { type: "tf", q: "A headwind reduces gliding distance over the ground.", answer: true, why: "Wind shifts the glide footprint: headwind shrinks range, tailwind extends it." }
    ]
  },
  "aero-ceilings": {
    title: "Service and absolute ceilings",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Performance -- ceilings", time: 4,
    explain: [
      "As an airplane climbs, the thinning air steadily reduces its ability to climb. The service ceiling is the altitude at which the best rate of climb falls to a small, defined value -- for a piston airplane, 100 feet per minute -- representing the practical top of useful climb performance.",
      "The absolute ceiling is higher still: the altitude at which the airplane can no longer climb at all and the maximum rate of climb reaches zero. Approaching it, climb performance becomes painfully slow.",
      "Both ceilings drop as weight, temperature, or density altitude rise, so a hot, heavy day lowers the altitude your airplane can practically reach."
    ],
    quiz: [
      { type: "mc", q: "The service ceiling of a piston airplane is the altitude where best climb rate falls to:", choices: ["0 fpm", "100 fpm", "500 fpm", "1,000 fpm"], answer: 1, why: "Service ceiling is where best rate of climb drops to 100 fpm; absolute ceiling is 0 fpm." },
      { type: "tf", q: "The absolute ceiling is where the maximum climb rate reaches zero.", answer: true, why: "At the absolute ceiling the airplane can no longer climb." }
    ]
  },
  "aero-turns": {
    title: "Turn rate, radius, and standard-rate turns",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Aerodynamics -- turns", time: 5,
    explain: [
      "In a turn, the horizontal component of lift pulls the airplane around, so a steeper bank turns faster and tighter. Turn rate is how quickly the heading changes and turn radius is how big a circle you carve; for a given bank, flying faster increases the radius and slows the rate.",
      "A standard-rate turn is three degrees per second, which completes a 360-degree turn in two minutes and is the basis for instrument procedures and the turn coordinator's markings. The bank needed for a standard rate grows with speed.",
      "The practical takeaways: bank controls how fast and tight you turn, speed enlarges the circle, and instrument flying is built around the predictable three-degrees-per-second standard rate."
    ],
    quiz: [
      { type: "mc", q: "A standard-rate turn is:", choices: ["1 degree per second", "3 degrees per second", "10 degrees per second", "A 30-degree bank always"], answer: 1, why: "Standard rate is 3 deg/sec, a 360-degree turn in two minutes." },
      { type: "tf", q: "For a given bank angle, flying faster increases the turn radius.", answer: true, why: "Higher speed enlarges the radius and reduces the rate at the same bank." }
    ]
  },
  "aero-washout": {
    title: "Wing washout and stall progression",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Aerodynamics -- stall behavior", time: 5,
    explain: [
      "Designers often build a slight twist into the wing called washout, giving the wingtip a lower angle of incidence than the root. Because the root reaches its critical angle of attack first, the wing stalls from the root outward toward the tip.",
      "That progression is deliberate and valuable: the ailerons live out near the tips, so keeping the tips flying longer means you retain roll control deeper into the stall and get gentler, more predictable stall behavior with less tendency to drop a wing.",
      "It is one of several design tricks -- along with stall strips and leading-edge devices -- that make a wing stall in a way the pilot can recognize and control."
    ],
    quiz: [
      { type: "mc", q: "Washout (wing twist) causes the wing to stall:", choices: ["From the tip inward", "From the root outward", "All at once", "Only in turns"], answer: 1, why: "Lower tip incidence makes the root stall first, preserving aileron authority at the tips." },
      { type: "tf", q: "Stalling from the root first helps retain roll control deeper into a stall.", answer: true, why: "Keeping the tips (and ailerons) flying longer gives gentler, more controllable stalls." }
    ]
  },

  /* ===================== Engine, Fuel & Propeller ===================== */
  "sys-leaning": {
    title: "Leaning the mixture",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- mixture", time: 5,
    explain: [
      "The mixture control sets the ratio of fuel to air the engine burns. As you climb, the air thins but the carburetor or injection meters about the same fuel, so the mixture grows too rich -- wasting fuel, fouling spark plugs, and losing power -- which is why you lean it as you go up.",
      "Pilots lean by reference to engine instruments, often toward peak exhaust gas temperature or per the airplane's handbook, to get smooth, efficient operation. For takeoff and full-power climbs at low altitude you normally run full rich, because the extra fuel also helps cool the engine.",
      "Improper leaning cuts both ways: too rich fouls plugs and wastes fuel, while too lean at high power raises temperatures and risks detonation, so follow the handbook procedure for your engine."
    ],
    quiz: [
      { type: "mc", q: "As you climb, the mixture tends to become:", choices: ["Too lean", "Too rich because the air thins", "Unchanged", "Inverted"], answer: 1, why: "Thinner air with about the same fuel makes the mixture too rich, so you lean as you climb." },
      { type: "tf", q: "Running too lean at high power can raise temperatures and risk detonation.", answer: true, why: "Excessive leaning at high power overheats and can cause detonation; follow the POH." }
    ]
  },
  "sys-csprop": {
    title: "Constant-speed propellers",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- propeller", time: 6,
    explain: [
      "A constant-speed propeller lets the engine hold a chosen RPM while a governor automatically changes the blade pitch to match the load -- flattening the blades for high RPM and coarsening them for low. You set RPM with the propeller control and power with the throttle, which sets manifold pressure.",
      "This lets the propeller stay efficient across the flight: fine pitch and high RPM for takeoff power, then a coarser pitch and lower RPM for an efficient cruise, much like gears on a bicycle. A fixed-pitch propeller, by contrast, is a compromise tuned for one regime.",
      "Manage the two controls together, and remember the common sequence of reducing power: typically you reduce manifold pressure considerations per your airplane's procedures rather than abruptly mismatching RPM and power."
    ],
    quiz: [
      { type: "mc", q: "A constant-speed propeller maintains a set RPM by:", choices: ["Changing engine size", "Automatically varying blade pitch", "Adding fuel", "Changing the throttle only"], answer: 1, why: "A governor varies blade pitch to hold the selected RPM as load changes." },
      { type: "tf", q: "With a constant-speed prop, the propeller control sets RPM and the throttle sets manifold pressure.", answer: true, why: "RPM via the prop control, power/manifold pressure via the throttle." }
    ]
  },
  "sys-detonation": {
    title: "Detonation and preignition",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- abnormal combustion", time: 5,
    explain: [
      "Normally the fuel-air charge burns smoothly after the spark. Detonation is when it instead explodes violently, often from using fuel of too low a grade, an excessively lean mixture at high power, or high engine temperatures. It causes a sudden loss of power, overheating, and can quickly damage the engine.",
      "Preignition is a related problem where the charge ignites before the spark, set off by a glowing hot spot or deposit in the cylinder. It also spikes temperatures and can occur together with detonation.",
      "The cures overlap: use the correct fuel grade, enrich the mixture, reduce power, and cool the engine. Both conditions are serious, so avoiding them is part of proper power and mixture management."
    ],
    quiz: [
      { type: "mc", q: "Detonation can be caused by:", choices: ["Correct fuel and rich mixture", "Too-low fuel grade, lean mixture at high power, or high temperatures", "Cold engine", "Low altitude only"], answer: 1, why: "Low-grade fuel, high-power lean mixtures, and high temps cause detonation." },
      { type: "tf", q: "Preignition is when the charge ignites before the spark, often from a hot spot.", answer: true, why: "A glowing deposit/hot spot lights the mixture early, raising temperatures." }
    ]
  },
  "sys-oil": {
    title: "The oil system",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- oil", time: 5,
    explain: [
      "Engine oil does more than lubricate. It also cools by carrying heat away from the moving parts, cleans by suspending contaminants for the filter to catch, seals the gaps around the piston rings, and protects metal against corrosion. A pump circulates it, a filter cleans it, and a cooler manages its temperature.",
      "The cockpit gives you oil pressure and oil temperature gauges, and the most important check is right after start: oil pressure should rise into the green within seconds, or you shut down before damage occurs.",
      "Check the quantity before every flight and watch the gauges in flight, because the oil system is the lifeblood that keeps the engine from destroying itself."
    ],
    quiz: [
      { type: "mc", q: "Besides lubricating, engine oil also:", choices: ["Generates electricity", "Cools, cleans, seals, and protects against corrosion", "Pressurizes the cabin", "Powers the gyros"], answer: 1, why: "Oil lubricates, cools, cleans, seals, and protects against corrosion." },
      { type: "tf", q: "Oil pressure should rise into the green within seconds of engine start.", answer: true, why: "No oil pressure shortly after start is a shutdown item to prevent damage." }
    ]
  },
  "sys-cooling": {
    title: "Engine cooling",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- cooling", time: 5,
    explain: [
      "Most light-airplane engines are air-cooled, relying on cooling fins on the cylinders and baffles that direct ram air over the hottest parts. The oil system carries away additional heat, and some airplanes add cowl flaps the pilot can open for more cooling in a climb and close to stay warm in cruise or descent.",
      "Cooling depends on airflow, so a prolonged high-power climb at low airspeed -- lots of heat, little air -- can overheat the engine, watched on the cylinder head temperature gauge. Lowering the nose to gain speed increases the cooling airflow.",
      "Avoid rapid large power reductions that shock-cool the cylinders, and manage attitude, power, and cowl flaps so temperatures stay in the green."
    ],
    quiz: [
      { type: "mc", q: "Most light-aircraft engines are cooled primarily by:", choices: ["Liquid coolant", "Air over cooling fins and baffles", "The oil alone", "The propeller"], answer: 1, why: "They are air-cooled, using fins and baffles to direct airflow, aided by the oil." },
      { type: "tf", q: "A prolonged high-power, low-airspeed climb can overheat the engine.", answer: true, why: "Lots of heat with little cooling airflow raises CHT; lowering the nose helps." }
    ]
  },
  "sys-alternator": {
    title: "Alternator, battery, and ammeter",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- electrical", time: 5,
    explain: [
      "A light airplane's electrical system centers on the battery and the engine-driven alternator. The battery starts the engine and provides a reserve, while the alternator, once the engine is running, powers the electrical loads and recharges the battery. The master switch connects the system.",
      "The ammeter tells you how the system is doing: depending on the type, it shows whether the battery is charging or discharging, or how much load the alternator is carrying. A discharge reading with the engine running is a warning that the alternator may have failed.",
      "If the alternator fails, you are running on battery alone for a limited time, so the response is to shed nonessential electrical loads and land before the battery is exhausted."
    ],
    quiz: [
      { type: "mc", q: "With the engine running, the alternator:", choices: ["Starts the engine", "Powers the electrical loads and recharges the battery", "Cools the engine", "Drives the gyros"], answer: 1, why: "The alternator supplies electrical power and recharges the battery while running." },
      { type: "tf", q: "If the alternator fails, you should shed nonessential loads and land before the battery is exhausted.", answer: true, why: "On battery alone, conserve power and land promptly." }
    ]
  },
  "sys-vacuum": {
    title: "The vacuum system",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- vacuum", time: 5,
    explain: [
      "Many light airplanes spin their gyroscopic attitude and heading indicators with air, using an engine-driven vacuum pump that draws air through the instruments. A vacuum gauge confirms the system is providing suction within the proper range.",
      "The catch is that if the vacuum pump fails, those air-driven gyros slowly become unreliable -- and they can fail subtly, leaning and drifting rather than dying outright, which is dangerous in the clouds. The turn coordinator is usually electric, so it survives a vacuum failure and becomes a key cross-check.",
      "Know which of your instruments are vacuum-driven and which are electric, so a failure of either system leaves you knowing exactly which instruments to trust."
    ],
    quiz: [
      { type: "mc", q: "In many light airplanes, the vacuum system drives the:", choices: ["Airspeed indicator", "Attitude and heading indicators (gyros)", "Tachometer", "Fuel gauge"], answer: 1, why: "An engine-driven vacuum pump spins the air-driven attitude and heading gyros." },
      { type: "tf", q: "The turn coordinator is usually electric and survives a vacuum failure.", answer: true, why: "Being electric, it remains a key cross-check if the vacuum system fails." }
    ]
  },
  "sys-flaps": {
    title: "Types of flaps",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- flaps", time: 5,
    explain: [
      "Flaps increase the wing's lift and drag for takeoff and landing, letting you fly slower and descend more steeply, and they come in several designs. A plain flap is a simple hinged section, a split flap deflects only the lower surface, and a slotted flap leaves a gap that lets high-pressure air energize the flow over it, making it very effective and common.",
      "A Fowler flap is the most powerful of the common types: it slides aft as it lowers, increasing both the wing area and its curvature, which is why you see it on larger and high-performance airplanes.",
      "In all cases, the early flap settings add a lot of lift for relatively little drag, while the last settings add mostly drag, which is why approaches typically add flaps progressively."
    ],
    quiz: [
      { type: "mc", q: "Which flap type slides aft to increase both wing area and camber?", choices: ["Plain", "Split", "Slotted", "Fowler"], answer: 3, why: "Fowler flaps extend aft and down, adding area and camber for the greatest effect." },
      { type: "tf", q: "Flaps increase both lift and drag, allowing slower, steeper approaches.", answer: true, why: "They raise lift and drag, enabling lower speeds and steeper descents." }
    ]
  },
  "sys-fuelgrades": {
    title: "Aviation fuel grades",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- fuel", time: 5,
    explain: [
      "Piston airplanes burn aviation gasoline, and the grades are color-coded to prevent mistakes: 100LL (low lead) is dyed blue and is the common grade today, while grade 100 is green and the rare grade 80 is red. The numbers reflect the fuel's anti-knock rating.",
      "Turbine engines burn jet fuel, a kerosene that is clear to straw-colored and must never be put in a piston engine. Using a lower grade than your engine requires invites detonation, and contamination -- water or the wrong fuel -- is a serious hazard.",
      "Always confirm the correct grade, and sump the tanks before flight to check for water and debris, since fuel problems are a leading cause of engine failures that are entirely preventable."
    ],
    quiz: [
      { type: "mc", q: "The common piston aviation fuel today, 100LL, is dyed:", choices: ["Green", "Blue", "Red", "Clear"], answer: 1, why: "100LL (low lead) is blue; grade 100 is green; jet fuel is clear/straw." },
      { type: "tf", q: "Using a lower fuel grade than the engine requires can cause detonation.", answer: true, why: "Lower anti-knock rating than specified risks detonation." }
    ]
  },
  "sys-fuelinjection": {
    title: "Carburetor versus fuel injection",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- induction", time: 5,
    explain: [
      "A carburetor mixes fuel and air in a venturi before sending the charge to the cylinders. It is simple and reliable but distributes the mixture a little unevenly and is prone to carburetor ice, which is why carbureted engines have a carburetor heat control to melt ice in the venturi.",
      "Fuel injection instead sprays metered fuel directly into each cylinder's intake, giving more even distribution, slightly better efficiency, and far less susceptibility to induction icing. Its trade-offs are a more complex system and sometimes trickier hot starts due to fuel vaporizing in the lines.",
      "Both systems provide a source of warm or alternate air so the engine keeps breathing if the normal intake ices or blocks, and both rely on correct mixture management."
    ],
    quiz: [
      { type: "mc", q: "Compared with a carburetor, fuel injection is:", choices: ["More prone to carb ice", "Less prone to induction icing with more even fuel distribution", "Simpler", "Unable to be leaned"], answer: 1, why: "Injection sprays fuel into each cylinder, improving distribution and resisting induction ice." },
      { type: "tf", q: "Carbureted engines use carburetor heat to address induction icing.", answer: true, why: "Carb heat melts ice forming in the venturi of a carbureted engine." }
    ]
  },

  /* ===================== Flight Instruments ===================== */
  "inst-attitude": {
    title: "The attitude indicator",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Instruments -- attitude", time: 5,
    explain: [
      "The attitude indicator shows the airplane's pitch and bank against a miniature horizon, and it is the master instrument for controlling the airplane when you cannot see outside. It works on a gyroscope's rigidity in space: the spinning gyro holds a fixed reference while the airplane moves around it.",
      "It may be driven by the vacuum system or by electricity, and it presents pitch up or down and bank left or right directly and intuitively, which is why instrument scans are built around it.",
      "Older units can tumble if their limits are exceeded, and a failing vacuum-driven attitude indicator may lean or droop slowly, so cross-checking it against other instruments matters."
    ],
    quiz: [
      { type: "mc", q: "The attitude indicator displays:", choices: ["Heading and turn rate", "Pitch and bank against an artificial horizon", "Airspeed", "Altitude"], answer: 1, why: "It shows pitch and bank using a gyro's rigidity in space; it is the master flight instrument." },
      { type: "tf", q: "The attitude indicator relies on a gyro's rigidity in space.", answer: true, why: "The spinning gyro holds a fixed reference as the airplane moves around it." }
    ]
  },
  "inst-heading": {
    title: "The heading indicator",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Instruments -- heading", time: 5,
    explain: [
      "The heading indicator, or directional gyro, shows the airplane's heading on a stable card free of the magnetic compass's swinging and turning errors. Because it is a gyro and not magnetic, it drifts over time and must be reset to the magnetic compass periodically, typically every fifteen minutes or so in straight-and-level flight.",
      "Set against an accurate compass, it then gives you a steady heading reference for turns and tracking that is far easier to fly than the lively magnetic compass.",
      "If it is vacuum-driven, it shares the fate of the attitude indicator in a vacuum failure, so include it in your cross-check and reset it from the compass during stable flight."
    ],
    quiz: [
      { type: "mc", q: "The heading indicator must be periodically reset to the:", choices: ["GPS", "Magnetic compass", "Altimeter", "Tachometer"], answer: 1, why: "Being a gyro, it precesses/drifts and must be aligned to the magnetic compass." },
      { type: "tf", q: "The heading indicator avoids the magnetic compass's turning and acceleration errors.", answer: true, why: "As a gyro, it shows a steady heading without those magnetic errors." }
    ]
  },
  "inst-turncoord": {
    title: "The turn coordinator",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Instruments -- turn", time: 5,
    explain: [
      "The turn coordinator shows two things: the rate at which you are turning and whether the turn is coordinated. Its miniature airplane banks to indicate turn rate, with a mark for a standard-rate turn, while the inclinometer ball below shows whether you are slipping or skidding.",
      "Keeping the ball centered means the turn is coordinated; if it slides to one side, you 'step on the ball' -- add rudder on the side the ball has moved toward -- to bring it back to center.",
      "The turn coordinator is usually electrically driven, so it remains available if the vacuum system fails, making it an important backup for maintaining controlled turns on instruments."
    ],
    quiz: [
      { type: "mc", q: "To coordinate a turn when the ball is off-center, you:", choices: ["Add aileron", "Step on the ball (add rudder toward the ball)", "Reduce power", "Ignore it"], answer: 1, why: "Apply rudder toward the side the ball moved to ('step on the ball') to center it." },
      { type: "tf", q: "The turn coordinator shows both turn rate and turn coordination.", answer: true, why: "The miniature airplane shows rate; the inclinometer ball shows coordination." }
    ]
  },
  "inst-hsi": {
    title: "The horizontal situation indicator (HSI)",
    pathway: "airplane", cert: "ppl", faa: "iph",
    acs: "Instruments -- HSI", time: 5,
    explain: [
      "The horizontal situation indicator combines the heading indicator and the navigation course display into a single instrument. On one face you see the aircraft heading, the selected course, the course deviation, and whether you are flying to or from the station, which greatly simplifies navigation.",
      "Because the course needle is presented over the heading card, the picture matches the real-world geometry: the needle shows which way to turn to intercept, without the reverse-sensing confusion that a separate indicator can create on a back course.",
      "The HSI reduces the mental work of relating heading to course, which is why it is a common upgrade and a help when flying instrument approaches."
    ],
    quiz: [
      { type: "mc", q: "An HSI combines the heading indicator with the:", choices: ["Altimeter", "Course deviation/navigation display", "Tachometer", "Fuel gauge"], answer: 1, why: "It merges heading and course-deviation information into one integrated display." },
      { type: "tf", q: "An HSI presents the course needle over the heading card to match real-world geometry.", answer: true, why: "This integrated picture reduces interpretation and back-course reverse-sensing confusion." }
    ]
  },
  "inst-gyros": {
    title: "Gyroscopic instrument principles",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Instruments -- gyroscopes", time: 5,
    explain: [
      "Three flight instruments rely on spinning gyroscopes, which behave according to two properties. Rigidity in space means a spinning gyro resists changes to the direction of its axis, which is what gives the attitude indicator and heading indicator a stable reference to measure against.",
      "Precession means a force applied to a spinning gyro takes effect as if applied ninety degrees later in the direction of rotation, and the turn coordinator uses precession to sense the rate of turn.",
      "These gyros are spun either by vacuum-driven air or by electricity, and knowing which property and which power source each instrument uses is the key to understanding their behavior and their failures."
    ],
    quiz: [
      { type: "mc", q: "Which gyroscopic property gives the attitude and heading indicators a stable reference?", choices: ["Precession", "Rigidity in space", "Magnetism", "Centrifugal force"], answer: 1, why: "Rigidity in space lets a spinning gyro resist changes to its axis, providing a reference." },
      { type: "tf", q: "The turn coordinator uses precession to sense the rate of turn.", answer: true, why: "Precession (force felt 90 degrees later) lets it indicate turn rate." }
    ]
  },
  "inst-vsi": {
    title: "The vertical speed indicator",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Instruments -- vertical speed", time: 5,
    explain: [
      "The vertical speed indicator shows your rate of climb or descent in feet per minute by sensing how fast the static pressure is changing. It does this through a calibrated leak in its case, comparing instantaneous pressure with a slightly delayed reference, so the needle deflects with the rate of altitude change.",
      "That calibrated leak gives the VSI a characteristic lag: when you change pitch it takes a moment to show the new trend and then to settle on the steady rate. So you read it first as a trend -- which way and roughly how fast -- and then as a precise rate once it stabilizes.",
      "It is the instrument you use to nail a target descent rate, such as 500 feet per minute, and like the altimeter it depends on the static system, so a blocked static port pins the VSI at zero."
    ],
    quiz: [
      { type: "mc", q: "The vertical speed indicator measures:", choices: ["Airspeed", "The rate of change of static pressure (climb/descent rate)", "Heading", "Bank angle"], answer: 1, why: "It senses how fast static pressure changes, displaying feet per minute of climb or descent." },
      { type: "tf", q: "The VSI has a lag and is read first as a trend, then as a precise rate.", answer: true, why: "Its calibrated leak causes lag; read trend first, then the stabilized rate." }
    ]
  },

  /* ===================== Landing Gear ===================== */
  "sys-tricycle": {
    title: "Tricycle versus conventional gear",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- landing gear", time: 5,
    explain: [
      "Tricycle gear places the third wheel under the nose, ahead of the two main wheels, with the center of gravity forward of the mains. This layout is stable on the ground, gives good forward visibility, and naturally resists the tendency to swap ends, making it easier to taxi and land -- which is why most modern trainers use it.",
      "Conventional gear, the taildragger, puts the small wheel at the tail with the main wheels forward of the center of gravity. It offers more propeller clearance and handles rough or unimproved fields well, but because the CG is behind the mains it is prone to ground loops and demands more active rudder work.",
      "Neither is better in the abstract; they are tuned for different missions, and a taildragger requires a logbook endorsement because of the extra ground-handling skill it takes."
    ],
    quiz: [
      { type: "mc", q: "Tricycle gear has the center of gravity:", choices: ["Behind the main wheels", "Forward of the main wheels", "At the tail", "Over the nose wheel only"], answer: 1, why: "CG forward of the mains makes tricycle gear directionally stable on the ground." },
      { type: "tf", q: "Conventional (taildragger) gear is more prone to ground loops than tricycle gear.", answer: true, why: "With the CG behind the mains, taildraggers can swap ends without active rudder control." }
    ]
  },

  /* ===================== Weather: Fronts ===================== */
  "wxf-coldfront": {
    title: "Cold fronts",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- fronts", time: 5,
    explain: [
      "A cold front is the leading edge of advancing cold air that wedges under warmer air ahead of it. The boundary is steep and often moves fast, forcing the warm air up quickly, which builds cumulus and thunderstorms in a relatively narrow band along the front.",
      "The weather is typically brief but intense: gusty winds, heavy showers or storms, and turbulence, followed by rapid clearing as the cooler, drier, more stable air arrives behind it. Temperature drops and the pressure, which fell ahead of the front, rises after it passes.",
      "Because cold-front storms can be severe and line up as squall lines, treat an approaching fast-moving cold front as a real go/no-go decision."
    ],
    quiz: [
      { type: "mc", q: "Cold-front weather is typically:", choices: ["Widespread and steady over a large area", "A narrow band of brief but intense weather", "Always clear", "Only fog"], answer: 1, why: "The steep, fast boundary forces rapid lifting, making narrow bands of intense weather." },
      { type: "tf", q: "After a cold front passes, temperature drops and pressure rises.", answer: true, why: "Cooler, drier, more stable air follows, with rising pressure behind the front." }
    ]
  },
  "wxf-warmfront": {
    title: "Warm fronts",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- fronts", time: 5,
    explain: [
      "A warm front is the boundary where advancing warm air rides up and over cooler air ahead of it. The slope is shallow and the front moves slowly, so the warm air rises gradually over a wide area, producing broad layers of cloud that lower and thicken as the front approaches -- cirrus giving way to stratus.",
      "The result is widespread, steady precipitation, low ceilings, and reduced visibility spread over hundreds of miles, often with fog, lasting far longer than a cold front's quick punch.",
      "Warm fronts trade intensity for breadth and duration, so the hazard is prolonged low instrument conditions rather than violent storms, though embedded thunderstorms are possible in unstable warm air."
    ],
    quiz: [
      { type: "mc", q: "Warm-front weather is characterized by:", choices: ["A narrow band of storms", "Widespread, steady precipitation and low ceilings over a large area", "Rapid clearing", "Strong gusts only"], answer: 1, why: "Gradual lifting over a shallow slope gives broad, layered clouds and steady precipitation." },
      { type: "tf", q: "Warm fronts generally move slowly and bring prolonged low ceilings and visibility.", answer: true, why: "Their shallow slope and slow movement spread low IMC over a wide area." }
    ]
  },
  "wxf-occluded": {
    title: "Occluded fronts",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- fronts", time: 5,
    explain: [
      "An occluded front forms when a faster cold front catches up to a slower warm front ahead of it, lifting the warm air completely off the ground. The result combines features of both fronts, so you can see the widespread clouds and steady precipitation of a warm front together with the showery, more intense weather of a cold front.",
      "Depending on the relative temperatures of the air masses, it is classed as a cold or warm occlusion, but for a pilot the practical point is mixed and often widespread weather along the occlusion.",
      "Occlusions usually appear in the mature-to-decaying stage of a low-pressure system, and they can produce extensive areas of cloud, precipitation, and reduced visibility."
    ],
    quiz: [
      { type: "mc", q: "An occluded front forms when:", choices: ["Two warm fronts merge", "A cold front overtakes a warm front, lifting the warm air aloft", "A front stops moving", "Air sinks"], answer: 1, why: "A faster cold front catches the warm front, occluding (lifting) the warm air." },
      { type: "tf", q: "Occluded fronts can combine the weather features of both warm and cold fronts.", answer: true, why: "They mix widespread steady precipitation with showery, more intense weather." }
    ]
  },
  "wxf-stationary": {
    title: "Stationary fronts",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- fronts", time: 4,
    explain: [
      "A stationary front is a boundary between two air masses that is not moving, because neither the warm nor the cold air is strong enough to displace the other. With little forward motion, the weather tends to linger over the same area, sometimes for days.",
      "The conditions along a stationary front often resemble those of a warm front -- layered clouds and steady, sometimes drizzly precipitation -- and the persistence is the main hazard, keeping an area socked in.",
      "When a stationary front finally begins to move again, it becomes a warm or cold front depending on which air mass takes over, so watching its evolution is part of trip planning."
    ],
    quiz: [
      { type: "mc", q: "A stationary front is one that:", choices: ["Moves very fast", "Is not moving because neither air mass displaces the other", "Only forms over oceans", "Brings clearing skies"], answer: 1, why: "Neither air mass advances, so the boundary and its weather stay put, often for days." },
      { type: "tf", q: "Stationary-front weather often resembles warm-front conditions and can persist for days.", answer: true, why: "Layered clouds and steady precipitation can linger over the same area." }
    ]
  },

  /* ===================== Weather: Clouds, Storms, Fog & Stability ===================== */
  "wxc-cloudtypes": {
    title: "Cloud types and what they tell you",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- clouds", time: 6,
    explain: [
      "Clouds are grouped by height and shape. Low clouds include stratus and stratocumulus; middle clouds carry the prefix alto, as in altostratus and altocumulus; and high, icy clouds carry the prefix cirro, as in cirrus and cirrostratus. Clouds with great vertical development, cumulus and towering cumulonimbus, span the layers.",
      "Shape tells you about stability. Flat, layered stratiform clouds signal stable air and smooth, steady conditions, while puffy, heaped cumuliform clouds signal instability, turbulence, and showery weather. The prefix nimbo or the suffix on cumulonimbus indicates precipitation.",
      "Reading the sky becomes a forecast: a lowering deck of stratus warns of a warm front and IFR, while building cumulus warns of convection and turbulence ahead."
    ],
    quiz: [
      { type: "mc", q: "Puffy, heaped cumuliform clouds indicate:", choices: ["Stable, smooth air", "Unstable air with turbulence and showers", "No weather", "High pressure only"], answer: 1, why: "Cumuliform clouds signal instability, turbulence, and showery precipitation." },
      { type: "mc", q: "The prefix 'cirro' indicates clouds that are:", choices: ["Low", "Middle", "High and icy", "At the surface"], answer: 2, why: "Cirro-type clouds are high and composed of ice crystals; 'alto' is middle; stratus is low." }
    ]
  },
  "wxc-tstorm": {
    title: "The thunderstorm life cycle",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- thunderstorms", time: 6,
    explain: [
      "A thunderstorm needs three ingredients: moisture, an unstable atmosphere, and a lifting force to get the air rising. Given those, it grows through three stages. In the cumulus stage the cell is dominated by updrafts as it builds tall.",
      "The mature stage begins when precipitation starts falling to the ground, and it is the most dangerous: powerful updrafts and downdrafts exist side by side, with heavy rain, lightning, hail, severe turbulence, and the strong outflow that can become a microburst. In the dissipating stage downdrafts take over, the updrafts die, and the storm rains itself out.",
      "Because the mature stage packs the worst hazards, the only safe plan is to stay well clear of thunderstorms entirely, giving severe cells a wide berth."
    ],
    quiz: [
      { type: "mc", q: "The most hazardous thunderstorm stage, marked by coexisting updrafts and downdrafts, is the:", choices: ["Cumulus stage", "Mature stage", "Dissipating stage", "Clearing stage"], answer: 1, why: "The mature stage (onset when precipitation reaches the ground) has the worst hazards." },
      { type: "mc", q: "A thunderstorm requires moisture, a lifting force, and:", choices: ["Stable air", "An unstable atmosphere", "High pressure", "Calm winds"], answer: 1, why: "Moisture, instability, and lift are the three ingredients for thunderstorm development." }
    ]
  },
  "wxc-fog": {
    title: "Fog: how it forms",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- fog", time: 5,
    explain: [
      "Fog is simply a cloud at the surface, and it forms when the air near the ground becomes saturated -- either by cooling to its dewpoint or by adding moisture. The closer the temperature and dewpoint already are, the more easily fog forms, which is why a small temperature-dewpoint spread is a warning sign.",
      "Different processes create different fog types: cooling on a calm clear night, warm moist air moving over a cold surface, moist air lifting up a slope, or cold air sitting over warm water. Each has its own conditions and behavior.",
      "Because fog can drop visibility below landing minimums quickly, recognizing the conditions that breed it -- high humidity and a means of saturation -- is essential for avoiding a trap on arrival."
    ],
    quiz: [
      { type: "mc", q: "Fog forms when surface air becomes saturated by:", choices: ["Warming only", "Cooling to its dewpoint or adding moisture", "High winds", "Low humidity"], answer: 1, why: "Saturation by cooling to the dewpoint or by added moisture forms fog." },
      { type: "tf", q: "A small temperature-dewpoint spread warns that fog may form.", answer: true, why: "Air already near saturation easily reaches its dewpoint and fogs." }
    ]
  },
  "wxc-radfog": {
    title: "Radiation fog",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- fog", time: 5,
    explain: [
      "Radiation fog forms on clear, calm nights when the ground radiates its heat away to space, cooling the air just above it to the dewpoint. It is favored by light winds and moist air, and because cool air drains downhill, it tends to settle in low-lying areas and valleys -- hence the name ground fog.",
      "It often appears around dawn when temperatures are lowest, and it usually burns off as the sun warms the ground and a breeze picks up, mixing the air.",
      "Plan around it on still, clear mornings near rivers and low ground, knowing it can form quickly overnight and may not lift until mid-morning."
    ],
    quiz: [
      { type: "mc", q: "Radiation fog is favored by:", choices: ["Strong winds and clouds", "Clear, calm nights with moist air", "Hot afternoons", "Frontal passage"], answer: 1, why: "Clear, calm, moist nights let the ground cool the air to its dewpoint, forming radiation fog." },
      { type: "tf", q: "Radiation fog tends to settle in low-lying areas and valleys.", answer: true, why: "Cool air drains downhill, pooling fog in low ground; it often burns off with sun and wind." }
    ]
  },
  "wxc-advfog": {
    title: "Advection fog",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- fog", time: 5,
    explain: [
      "Advection fog forms when warm, moist air moves horizontally over a cooler surface, which chills the air to its dewpoint. Unlike radiation fog, it needs some wind to keep the moist air flowing over the cold surface, and it is common along coastlines where mild air drifts over cooler water or land.",
      "Because it is driven by moving air, advection fog can be deeper and far more persistent than radiation fog, lasting through the day and over a large area, and it does not simply burn off with morning sun.",
      "Watch for it when mild, humid air is forecast to move over a cooler surface, especially near coasts, since it can blanket an airport for hours."
    ],
    quiz: [
      { type: "mc", q: "Advection fog forms when:", choices: ["Air cools on a calm night", "Warm, moist air moves over a cooler surface", "Air sinks and warms", "Skies are clear and winds calm"], answer: 1, why: "Horizontal movement of warm, moist air over a cold surface chills it to the dewpoint." },
      { type: "tf", q: "Advection fog needs some wind and can be more persistent than radiation fog.", answer: true, why: "Moving moist air sustains it; it can last through the day over a wide area." }
    ]
  },
  "wxc-upslope": {
    title: "Upslope and steam fog",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- fog", time: 5,
    explain: [
      "Upslope fog forms when moist, stable air is pushed up sloping terrain, cooling as it rises until it reaches its dewpoint -- the same adiabatic cooling that makes clouds, but riding up the ground. It needs an upslope wind to sustain it and is common on the plains east of mountain ranges.",
      "Steam fog, sometimes called sea smoke, is the opposite situation: very cold air moves over much warmer water, and the water evaporates into the cold air and immediately recondenses, rising like steam off a hot drink.",
      "Steam fog can carry low-level turbulence and even icing as the rising moisture meets cold air, so both fog types deserve respect even though they form in very different ways."
    ],
    quiz: [
      { type: "mc", q: "Upslope fog forms when:", choices: ["Air sinks and warms", "Moist, stable air is forced up sloping terrain and cools to its dewpoint", "Cold air sits still", "The sun heats the ground"], answer: 1, why: "Air cooling adiabatically as it is pushed upslope reaches its dewpoint, forming fog." },
      { type: "tf", q: "Steam fog forms when cold air moves over much warmer water.", answer: true, why: "Water evaporates into the cold air and recondenses, rising like steam (sea smoke)." }
    ]
  },
  "wxc-stability": {
    title: "Stable versus unstable air",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Weather -- stability", time: 6,
    explain: [
      "Atmospheric stability is whether a parcel of air, once lifted, tends to keep rising or to sink back. It depends on how fast the actual temperature falls with height compared with the rate a rising parcel cools. When the surrounding air cools quickly with altitude, lifted air stays warmer and keeps rising -- unstable; when it cools slowly, lifted air soon becomes cooler and sinks back -- stable.",
      "The two states bring opposite weather. Stable air gives stratiform clouds, smooth flight, steady precipitation, and often poor visibility with haze or fog. Unstable air gives cumuliform clouds, turbulence, showery or stormy precipitation, gusty winds, and usually good visibility.",
      "Knowing which regime you are in lets you anticipate the ride and the weather: stable means smooth but possibly murky, unstable means bumpy and showery but clear."
    ],
    quiz: [
      { type: "mc", q: "Unstable air is associated with:", choices: ["Smooth flight and stratus", "Cumuliform clouds, turbulence, and showery precipitation", "Persistent fog", "Steady drizzle"], answer: 1, why: "Unstable air brings cumuliform clouds, turbulence, showers, and usually good visibility." },
      { type: "tf", q: "Stable air tends to produce smooth flight but can bring haze and poor visibility.", answer: true, why: "Stable air gives stratiform clouds, smooth air, steady precipitation, and reduced visibility." }
    ]
  },

  /* ===================== Regulations & Airworthiness ===================== */
  "reg-annual": {
    title: "Annual and 100-hour inspections",
    pathway: "airplane", cert: "ppl", faa: "cfr91",
    acs: "Regulations -- inspections", time: 5,
    explain: [
      "To be legal to fly, an airplane needs a current annual inspection, required every twelve calendar months and signed off by a mechanic holding an Inspection Authorization. On top of that, an aircraft operated for hire -- such as for flight instruction provided by the operator or for rental -- needs a 100-hour inspection every 100 hours of time in service.",
      "The annual and the 100-hour cover the same scope, so a fresh annual also satisfies the 100-hour requirement. The 100-hour limit may be exceeded by up to ten hours only to reach a place where the inspection can be done, and that overage counts against the next interval.",
      "Knowing which inspections apply -- always the annual, and the 100-hour when flying for hire -- is part of confirming an airplane is airworthy before you fly it."
    ],
    quiz: [
      { type: "mc", q: "An annual inspection is required every:", choices: ["100 hours", "12 calendar months", "24 calendar months", "6 months"], answer: 1, why: "The annual is required every 12 calendar months, signed by an IA." },
      { type: "tf", q: "A 100-hour inspection is required for aircraft operated for hire.", answer: true, why: "Aircraft flown for hire (e.g., rental, instruction by the operator) need 100-hour inspections." }
    ]
  },
  "reg-ad": {
    title: "Airworthiness directives",
    pathway: "airplane", cert: "ppl", faa: "cfr91",
    acs: "Regulations -- ADs", time: 5,
    explain: [
      "An airworthiness directive is a legally binding order from the FAA to correct an unsafe condition found in a type of aircraft, engine, propeller, or appliance. Compliance is mandatory, not optional, and the work and recurring checks are recorded in the maintenance logs.",
      "Some ADs are one-time fixes, while others are recurring, requiring repeated inspection or action at set intervals. An aircraft is not airworthy if an applicable AD has not been complied with.",
      "Owners and operators are responsible for ensuring all applicable ADs are met, which is one reason reviewing the maintenance records matters before relying on an aircraft's airworthiness."
    ],
    quiz: [
      { type: "mc", q: "An airworthiness directive (AD) is:", choices: ["An optional recommendation", "A mandatory FAA order to correct an unsafe condition", "A weather product", "A type of clearance"], answer: 1, why: "ADs are legally mandatory corrections for unsafe conditions; compliance is required." },
      { type: "tf", q: "Some ADs are recurring, requiring repeated inspection or action.", answer: true, why: "ADs may be one-time or recurring at set intervals; both are logged." }
    ]
  },
  "reg-ferry": {
    title: "Special flight permits",
    pathway: "airplane", cert: "ppl", faa: "cfr91",
    acs: "Regulations -- special permits", time: 5,
    explain: [
      "Sometimes an aircraft does not currently meet all airworthiness requirements but is still safe to make a specific flight -- for example, to fly to a maintenance base for repairs or a fresh inspection. A special flight permit, often called a ferry permit, is the FAA authorization that allows such a flight under stated conditions.",
      "The permit is issued for a particular purpose and route, may carry limitations on weight, weather, or crew, and is requested in advance from the FAA. It is not a way to dodge maintenance; it is a controlled exception to reposition an otherwise-grounded aircraft.",
      "Knowing that this option exists -- and that it requires authorization and conditions -- is useful when an aircraft becomes unairworthy away from its maintenance facility."
    ],
    quiz: [
      { type: "mc", q: "A special flight permit (ferry permit) allows an aircraft to:", choices: ["Skip all inspections permanently", "Make a specific flight (e.g., to repairs) though it does not currently meet all airworthiness requirements", "Carry passengers for hire", "Fly without a pilot"], answer: 1, why: "It authorizes a specific flight, with conditions, for an aircraft safe to fly but not fully airworthy." },
      { type: "tf", q: "A special flight permit is requested in advance and may carry limitations.", answer: true, why: "The FAA issues it for a stated purpose/route with conditions on weight, weather, or crew." }
    ]
  },
  "reg-inopequip": {
    title: "Inoperative equipment",
    pathway: "airplane", cert: "ppl", faa: "cfr91",
    acs: "Regulations -- inoperative equipment", time: 6,
    explain: [
      "Finding a piece of equipment inoperative before flight does not automatically ground the airplane. If it has an approved Minimum Equipment List, you operate according to that list. Without an MEL, regulation 91.213 lays out a process: the inoperative item must not be required by the type certificate, the airworthiness rules, an airworthiness directive, or the rules for your kind of operation.",
      "If it is not required, the item is then either removed or deactivated and placarded 'inoperative,' and a pilot or mechanic determines that the aircraft is still safe to fly without it. Anything actually required to be working must be working.",
      "The point is a disciplined decision, not a guess: you confirm the item is not required, deal with it properly, placard it, and only then fly."
    ],
    quiz: [
      { type: "mc", q: "Without an MEL, inoperative equipment that is not required may be flown after it is:", choices: ["Ignored", "Removed or deactivated and placarded 'inoperative'", "Repaired in flight", "Reported to ATC"], answer: 1, why: "Under 91.213(d), confirm it is not required, then deactivate/remove and placard it inoperative." },
      { type: "tf", q: "Equipment required by the type certificate or the rules for your operation must be working.", answer: true, why: "Only non-required items may be deferred; required equipment must be operative." }
    ]
  },
  "reg-picauth": {
    title: "Pilot-in-command authority and preflight action",
    pathway: "airplane", cert: "ppl", faa: "cfr91",
    acs: "Regulations -- PIC responsibility", time: 5,
    explain: [
      "The pilot in command is directly responsible for, and is the final authority as to, the operation of the aircraft. That authority comes with a matching responsibility, and in an in-flight emergency the PIC may deviate from the regulations to the extent required to handle it, then report it if asked.",
      "Before the flight even begins, the PIC must take preflight action: under 14 CFR 91.103, becoming familiar with all available information concerning the flight. For any flight that includes more than a local hop, that means weather reports and forecasts, runway lengths, takeoff and landing performance, fuel requirements, and alternatives if the flight cannot be completed.",
      "Together these define the job: gather the information, make the decisions, and carry the ultimate responsibility for the safe conduct of the flight."
    ],
    quiz: [
      { type: "mc", q: "In an in-flight emergency, the PIC may:", choices: ["Never deviate from the rules", "Deviate from the regulations to the extent required to handle the emergency", "Only follow ATC", "Hand off command"], answer: 1, why: "91.3 grants the PIC emergency authority to deviate as needed, with reporting if requested." },
      { type: "tf", q: "Preflight action under 91.103 includes weather, performance, fuel, and alternatives.", answer: true, why: "The PIC must become familiar with all available information before the flight." }
    ]
  },

  /* ===================== Comms, Transponder & Nav Aids ===================== */
  "com-squawk": {
    title: "Transponder codes and emergency squawks",
    pathway: "airplane", cert: "ppl", faa: "aim",
    acs: "Communications -- transponder", time: 5,
    explain: [
      "The transponder replies to radar with a four-digit code you set, and a few codes are reserved. For normal VFR flight you squawk 1200. Three emergency codes stand out: 7500 indicates unlawful interference (hijack), 7600 indicates lost communications (radio failure), and 7700 indicates a general emergency.",
      "A common memory aid runs: seven-five, taken alive; seven-six, can't communicate; seven-seven, going to heaven. The ident button momentarily highlights your target on the controller's scope when asked.",
      "Setting the right code lets ATC recognize your situation instantly, and squawking 7700 in a real emergency gets you immediate attention even without a word on the radio."
    ],
    quiz: [
      { type: "mc", q: "Which transponder code indicates a general emergency?", choices: ["1200", "7500", "7600", "7700"], answer: 3, why: "7700 = emergency; 7600 = lost comms; 7500 = hijack; 1200 = VFR." },
      { type: "mc", q: "The normal VFR transponder code is:", choices: ["1200", "7000", "2000", "7600"], answer: 0, why: "Squawk 1200 for normal VFR operations in the US." }
    ]
  },
  "com-rvr": {
    title: "Runway visual range",
    pathway: "airplane", cert: "ppl", faa: "aim",
    acs: "Operations -- RVR", time: 4,
    explain: [
      "Runway visual range is a measurement of how far a pilot can see down a specific runway, taken by sensors near the runway and reported in feet rather than miles. Because it is measured right at the runway, it is more precise and relevant for low-visibility operations than the airport's general prevailing visibility.",
      "RVR values are used in instrument approach minimums, especially for the lower categories, where a minimum like RVR 2400 sets the visibility you must have along the runway to continue.",
      "When low ceilings and visibility are in play, RVR is the number that often governs whether an approach can be flown to a landing."
    ],
    quiz: [
      { type: "mc", q: "Runway visual range (RVR) is reported in:", choices: ["Statute miles", "Feet", "Meters of cloud base", "Percent"], answer: 1, why: "RVR is a sensor-measured visibility along the runway, reported in feet." },
      { type: "tf", q: "RVR is more relevant than prevailing visibility for low-visibility approaches.", answer: true, why: "Measured at the runway, it directly reflects what the pilot will see on the approach." }
    ]
  },
  "com-staticwick": {
    title: "Static wicks and precipitation static",
    pathway: "airplane", cert: "ppl", faa: "phak",
    acs: "Systems -- static dischargers", time: 4,
    explain: [
      "Flying through precipitation, dust, or cloud can build up a static electrical charge on the airframe, and that charge -- precipitation static, or P-static -- can interfere with radio and navigation reception, causing noise and degraded signals. Static wicks, the small pointed dischargers on the trailing edges of the wings and tail, bleed that charge harmlessly back into the air.",
      "They are not lightning protection; their job is the steady drain of accumulated static so your communication and navigation equipment keeps working in precipitation.",
      "Missing or damaged static wicks can show up as unexplained radio static in precipitation, which is why they are part of the preflight walk-around inspection."
    ],
    quiz: [
      { type: "mc", q: "Static wicks (dischargers) are designed to:", choices: ["Protect from lightning strikes", "Bleed off precipitation static to protect radio/nav reception", "Heat the wing", "Measure airspeed"], answer: 1, why: "They discharge accumulated P-static that would otherwise interfere with comms/nav." },
      { type: "tf", q: "Precipitation static can interfere with radio and navigation reception.", answer: true, why: "Charge buildup in precipitation causes noise; static wicks drain it away." }
    ]
  },
  "inav-ldasdf": {
    title: "LDA and SDF approaches",
    pathway: "airplane", cert: "instrument", faa: "iph",
    acs: "Instrument -- approach types", time: 5,
    explain: [
      "Not every localizer-like approach is a standard ILS localizer. A Localizer-type Directional Aid (LDA) has the accuracy and width of a localizer but is not aligned with the runway, so its final approach course points off the runway centerline; some LDAs include a glideslope, but many are non-precision.",
      "A Simplified Directional Facility (SDF) is also similar to a localizer but is less precise: its course may be wider than a localizer's and may likewise not be aligned with the runway. Both provide lateral guidance on a non-precision approach.",
      "The practical point is to read the chart: with an LDA or SDF you may be tracking a course offset from the runway and, lacking a glideslope, flying to a minimum descent altitude rather than a decision altitude."
    ],
    quiz: [
      { type: "mc", q: "An LDA differs from a standard ILS localizer mainly because it is:", choices: ["More precise", "Not aligned with the runway centerline", "Always paired with a glideslope", "VFR only"], answer: 1, why: "An LDA has localizer-like precision but its course is offset from the runway." },
      { type: "tf", q: "An SDF may have a wider course than a localizer and may not be aligned with the runway.", answer: true, why: "The SDF is similar to a localizer but less precise and possibly offset." }
    ]
  }

});
