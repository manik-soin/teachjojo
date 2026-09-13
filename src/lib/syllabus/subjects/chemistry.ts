import type { Subject } from "../types";

/** IB Chemistry: guide for first assessment 2025, organised into Structure and Reactivity units. Topic codes, labels and library slugs match RevisionDojo's resource library (read 13 Sep 2026). */
export const CHEMISTRY: Subject = {
  id: "ib-chemistry",
  name: "Chemistry",
  short: "Chem",
  slug: "ib-chemistry-new",
  tint: "primary",
  units: [
    {
      id: "s1-models-particulate",
      label: "Structure 1 - Models of the particulate nature of matter",
      topics: [
        {
          id: "s1-1-particulate",
          code: "S1.1",
          label: "Introduction to the particulate nature of matter",
          slug: "ib-chemistry-new-s11-introduction-to-the-particulate-nature-of-matter",
          misconceptions: [
            "Particles expand when heated (the spacing increases, the particles do not).",
            "A mixture is a compound (compounds are chemically bonded in fixed ratio).",
            "Melting and dissolving are the same process.",
          ],
          objectives: [
            "Distinguish elements, compounds and mixtures at the particle level",
            "Explain changes of state in terms of kinetic energy and intermolecular forces",
          ],
          criteria: {
            "Distinguish elements, compounds and mixtures at the particle level": ["an element contains only one type of atom", "a compound has different atoms chemically bonded in a fixed ratio", "a mixture has substances that are not chemically bonded and can be separated physically"],
            "Explain changes of state in terms of kinetic energy and intermolecular forces": ["heating raises the kinetic energy of the particles", "particles overcome the intermolecular forces and move further apart", "during the change of state the temperature stays constant while the energy breaks the forces"],
          },
        },
        {
          id: "s1-2-nuclear-atom",
          code: "S1.2",
          label: "The nuclear atom",
          slug: "ib-chemistry-new-s12-the-nuclear-atom",
          misconceptions: [
            "Isotopes of an element have different chemical properties (chemistry depends on the electrons, which isotopes share; only mass-dependent physical properties differ).",
            "The number printed under an element on the periodic table is its mass number (it is the relative atomic mass, a weighted average over the isotopes, so it is rarely a whole number).",
            "Electrons contribute significantly to the mass of an atom (an electron has about one two-thousandth of the mass of a proton; nearly all the mass is in the nucleus).",
          ],
          objectives: [
            "Describe the structure of the atom in terms of protons, neutrons and electrons",
            "Explain what isotopes are and why they share the same chemical properties",
            "Explain how relative atomic mass is obtained from isotopic abundances",
          ],
          criteria: {
            "Describe the structure of the atom in terms of protons, neutrons and electrons": ["protons and neutrons make up a small, dense, positively charged nucleus", "electrons carry a negative charge and occupy the space around the nucleus", "protons and neutrons each have a relative mass of about one; the mass of an electron is negligible", "a neutral atom has the same number of electrons as protons, and the proton number identifies the element"],
            "Explain what isotopes are and why they share the same chemical properties": ["isotopes are atoms of the same element with the same number of protons but different numbers of neutrons", "they have the same electron configuration, so they react in the same way", "they differ in mass, so physical properties such as density or rate of diffusion differ slightly"],
            "Explain how relative atomic mass is obtained from isotopic abundances": ["relative atomic mass is the weighted average mass of an element's atoms compared with one twelfth of a carbon-12 atom", "each isotope's mass is multiplied by its fractional abundance and the results are added together", "the average is usually not a whole number, such as chlorine at 35.45 from a mix of chlorine-35 and chlorine-37"],
          },
        },
        {
          id: "s1-3-electron-configurations",
          code: "S1.3",
          label: "Electron configurations",
          slug: "ib-chemistry-new-s13-electron-configurations",
          misconceptions: [
            "Electrons orbit the nucleus like planets on fixed circular paths.",
            "The 3d sublevel fills before 4s (4s fills first, at lower energy).",
            "An orbital can hold any number of electrons (two, with opposite spins).",
          ],
          objectives: [
            "Explain how emission spectra provide evidence for discrete energy levels",
            "Describe the pattern of electron configuration across the first 20 elements",
          ],
          criteria: {
            "Explain how emission spectra provide evidence for discrete energy levels": ["excited electrons drop to lower energy levels and emit light", "each line corresponds to one fixed energy difference between levels", "discrete lines rather than a continuous spectrum show the energy levels are quantised"],
            "Describe the pattern of electron configuration across the first 20 elements": ["shells fill in the order 2, 8, 8, then 2 more", "sublevels fill in the order 1s 2s 2p 3s 3p 4s", "elements in the same group have the same number of outer electrons"],
          },
        },
        {
          id: "s1-4-the-mole",
          code: "S1.4",
          label: "Counting particles by mass: the mole",
          slug: "ib-chemistry-new-s14-counting-particles-by-mass-the-mole",
          misconceptions: [
            "One mole of any substance has the same mass (one mole always has the same number of particles; the mass depends on the molar mass).",
            "The empirical formula shows how many atoms are in a molecule (it shows only the simplest ratio; glucose C6H12O6 has the empirical formula CH2O).",
            "Diluting a solution reduces the amount of solute (it lowers the concentration; the number of moles of solute stays the same).",
          ],
          objectives: [
            "Explain what a mole is and how it links mass to number of particles",
            "Distinguish the empirical formula of a compound from its molecular formula",
            "Outline what molar concentration measures and what Avogadro's law states",
          ],
          criteria: {
            "Explain what a mole is and how it links mass to number of particles": ["a mole is the amount of substance containing the Avogadro number of particles, about 6.02 times 10 to the power 23", "the molar mass in grams per mole is numerically equal to the relative atomic or formula mass", "amount in moles equals mass divided by molar mass, so mass can be converted to a number of particles"],
            "Distinguish the empirical formula of a compound from its molecular formula": ["the empirical formula gives the simplest whole number ratio of atoms of each element", "the molecular formula gives the actual number of atoms of each element in one molecule", "the molecular formula is a whole number multiple of the empirical formula, as C2H4 is of CH2", "the molecular formula is found from the empirical formula using the molar mass"],
            "Outline what molar concentration measures and what Avogadro's law states": ["concentration is the amount of solute in moles per unit volume of solution, in mol per dm3", "diluting adds solvent, so the concentration falls while the amount of solute stays the same", "equal volumes of any gases at the same temperature and pressure contain equal numbers of molecules", "so the mole ratio of gases in a reaction equals their volume ratio"],
          },
        },
        {
          id: "s1-5-ideal-gases",
          code: "S1.5",
          label: "Ideal gases",
          slug: "ib-chemistry-new-s15-ideal-gases",
          misconceptions: [
            "Gas particles slow down when a gas is compressed at constant temperature (pressure rises because collisions with the walls are more frequent; particle speed depends only on temperature).",
            "Doubling the temperature in degrees Celsius doubles the volume of a gas (the gas laws use the absolute kelvin scale; 20 to 40 degrees Celsius is only a small change in kelvin).",
            "A real gas behaves most ideally at low temperature (it is at high temperature and low pressure, when intermolecular forces and particle volume matter least).",
          ],
          objectives: [
            "Describe the assumptions of the ideal gas model",
            "Explain why real gases deviate from ideal behaviour at low temperature and high pressure",
            "Explain how pressure, volume and temperature of a fixed amount of gas are related",
          ],
          criteria: {
            "Describe the assumptions of the ideal gas model": ["gas particles are in constant random motion and collide elastically, losing no kinetic energy", "the volume of the particles themselves is negligible compared with the volume of the container", "there are no intermolecular forces between the particles", "the average kinetic energy of the particles is proportional to the absolute temperature"],
            "Explain why real gases deviate from ideal behaviour at low temperature and high pressure": ["at high pressure the particles are close together, so their own volume is no longer negligible", "at low temperature the particles move slowly, so intermolecular forces become significant and pull them together", "deviation is greatest for large or polar molecules, which have the strongest intermolecular forces"],
            "Explain how pressure, volume and temperature of a fixed amount of gas are related": ["at constant temperature pressure is inversely proportional to volume; halving the volume doubles the pressure", "at constant pressure volume is directly proportional to the absolute temperature in kelvin", "at constant volume pressure is directly proportional to the absolute temperature", "these combine into the ideal gas equation: pressure times volume equals moles times the gas constant times temperature"],
          },
        },
      ],
    },
    {
      id: "s2-models-bonding",
      label: "Structure 2 - Models of bonding and structure",
      topics: [
        {
          id: "s2-1-ionic",
          code: "S2.1",
          label: "The ionic model",
          slug: "ib-chemistry-new-s21-the-ionic-model",
          misconceptions: [
            "Ionic compounds are made of molecules such as a single NaCl unit (they form a continuous lattice; the formula is only the ratio of ions).",
            "Ionic compounds conduct electricity because electrons move through them (the charge carriers are the ions, which can only move when molten or dissolved).",
            "The transfer of electrons is the ionic bond (the bond is the electrostatic attraction between the oppositely charged ions that result).",
          ],
          objectives: [
            "Explain how ions form and how an ionic bond holds a compound together",
            "Describe the lattice structure of an ionic compound",
            "Explain the physical properties of ionic compounds in terms of their structure",
          ],
          criteria: {
            "Explain how ions form and how an ionic bond holds a compound together": ["metal atoms lose electrons to form positive ions and non-metal atoms gain electrons to form negative ions", "the ionic bond is the electrostatic attraction between oppositely charged ions", "the charge on an ion can be predicted from its group, such as 1+ for group 1 or 1- for group 17", "ionic bonding forms between elements with a large difference in electronegativity, roughly 1.8 or more"],
            "Describe the lattice structure of an ionic compound": ["ions are arranged in a regular, repeating three-dimensional lattice", "each ion is surrounded by ions of the opposite charge, so the attraction acts in all directions", "the formula is an empirical formula giving the simplest ratio of ions, not a molecule"],
            "Explain the physical properties of ionic compounds in terms of their structure": ["high melting and boiling points and low volatility because many strong electrostatic attractions must be overcome", "they conduct electricity when molten or dissolved because the ions are free to move, but not when solid", "many dissolve in water because the polar water molecules attract and surround the ions"],
          },
        },
        {
          id: "s2-2-covalent",
          code: "S2.2",
          label: "The covalent model",
          slug: "ib-chemistry-new-s22-the-covalent-model",
          misconceptions: [
            "Covalent bonds involve transferring electrons (that is ionic; covalent bonds share).",
            "A molecule with polar bonds must be a polar molecule (symmetry can cancel dipoles, as in CO2).",
            "HF has the lowest boiling point of the hydrogen halides (hydrogen bonding makes it anomalously high).",
          ],
          objectives: [
            "Explain how bond polarity arises from differences in electronegativity",
            "Compare the strength of hydrogen bonding with other intermolecular forces",
            "Explain the trend in boiling points of the hydrogen halides",
          ],
          criteria: {
            "Explain how bond polarity arises from differences in electronegativity": ["electronegativity is an atom's pull on the shared electrons", "an unequal pull shifts electron density towards the more electronegative atom", "that gives a partial negative and a partial positive charge, a dipole"],
            "Compare the strength of hydrogen bonding with other intermolecular forces": ["hydrogen bonding needs hydrogen bonded to nitrogen, oxygen or fluorine", "it is the strongest of the intermolecular forces", "stronger than dipole-dipole and London dispersion forces but far weaker than a covalent bond"],
            "Explain the trend in boiling points of the hydrogen halides": ["HF is anomalously high because of hydrogen bonding", "from HCl to HI the boiling point rises", "larger molecules have more electrons, so stronger London dispersion forces"],
          },
        },
        {
          id: "s2-3-metallic",
          code: "S2.3",
          label: "The metallic model",
          slug: "ib-chemistry-new-s23-the-metallic-model",
          misconceptions: [
            "Metals conduct electricity because the positive ions move (the ions stay fixed in the lattice; only the delocalised electrons move).",
            "Metallic bonding must be weak because metals bend easily (many metals have high melting points; malleability comes from layers sliding, not from weak bonds).",
            "All of a metal atom's electrons become delocalised (only the outer valence electrons do; the inner electrons stay with the positive ion).",
          ],
          objectives: [
            "Describe the bonding in a metal",
            "Explain the electrical conductivity and malleability of metals",
            "Explain how the strength of metallic bonding varies between metals",
          ],
          criteria: {
            "Describe the bonding in a metal": ["metal atoms release their outer electrons into a shared pool of delocalised electrons", "the metal is a lattice of positive ions held together by electrostatic attraction to the delocalised electrons", "the delocalised electrons belong to the whole lattice rather than to any one atom"],
            "Explain the electrical conductivity and malleability of metals": ["metals conduct because the delocalised electrons are free to move through the lattice and carry charge", "metals are malleable because layers of ions can slide over each other without breaking the bonding", "the delocalised electrons move with the ions, so the attraction is kept in the new positions"],
            "Explain how the strength of metallic bonding varies between metals": ["the greater the charge on the metal ion, the more delocalised electrons and the stronger the attraction", "the smaller the ionic radius, the closer the delocalised electrons are to the nucleus and the stronger the bond", "so melting point rises from sodium to magnesium to aluminium across period 3 and falls down group 1"],
          },
        },
        {
          id: "s2-4-models-to-materials",
          code: "S2.4",
          label: "From models to materials",
          slug: "ib-chemistry-new-s24-from-models-to-materials",
          misconceptions: [
            "Alloys are compounds with a fixed formula (they are mixtures, so their composition can vary and they keep metallic properties).",
            "A polymer is a mixture of many small molecules (it is one very large molecule made of covalently bonded repeating units).",
            "Bonding is either purely ionic or purely covalent (it is a continuum; most bonds have some polar covalent character, as the bonding triangle shows).",
          ],
          objectives: [
            "Explain how the bonding triangle is used to classify bonding in a substance",
            "Explain why alloys are often harder and stronger than pure metals",
            "Describe how addition polymers form from alkenes",
          ],
          criteria: {
            "Explain how the bonding triangle is used to classify bonding in a substance": ["the triangle plots the difference in electronegativity between the elements against their average electronegativity", "a large difference indicates ionic bonding; a small difference with a high average indicates covalent bonding", "a small difference with a low average electronegativity indicates metallic bonding", "bonding is a continuum, so many substances fall between the corners, such as polar covalent compounds"],
            "Explain why alloys are often harder and stronger than pure metals": ["an alloy is a homogeneous mixture of a metal with other metals or non-metals", "atoms of different sizes disrupt the regular lattice of the metal", "layers of ions can no longer slide over each other easily, so the alloy is harder and less malleable", "one example, such as steel from iron and carbon, or brass from copper and zinc"],
            "Describe how addition polymers form from alkenes": ["a polymer is a very large molecule made from many repeating units called monomers", "in addition polymerisation the double bond of each alkene monomer opens up", "the monomers join into a long chain with no other product formed", "one example, such as poly(ethene) from ethene or PVC from chloroethene"],
          },
        },
      ],
    },
    {
      id: "s3-classification",
      label: "Structure 3 - Classification of matter",
      topics: [
        {
          id: "s3-1-periodic-table",
          code: "S3.1",
          label: "The periodic table: classification of elements",
          slug: "ib-chemistry-new-s31-the-periodic-table-classification-of-elements",
          misconceptions: [
            "Atomic radius increases across a period because more electrons are added (the extra electrons enter the same shell while nuclear charge rises, so the atoms get smaller).",
            "Noble gases have the lowest ionisation energy in their period because they are unreactive (they have the highest; a full outer shell held by a large nuclear charge is very hard to ionise).",
            "All oxides dissolve in water to form acids (metal oxides are basic and give alkaline solutions; only non-metal oxides are acidic).",
          ],
          objectives: [
            "Explain how the periodic table is organised and how properties change down a group",
            "Explain the trends in atomic radius, ionisation energy and electronegativity across a period",
            "Describe the trend in acid-base character of the oxides across period 3",
          ],
          criteria: {
            "Explain how the periodic table is organised and how properties change down a group": ["elements are arranged in order of increasing atomic number in periods (rows) and groups (columns)", "the period number gives the number of occupied shells and the group relates to the number of valence electrons", "down a group atomic radius increases because each element has an extra occupied shell", "ionisation energy and electronegativity fall down a group because the outer electrons are further away and more shielded"],
            "Explain the trends in atomic radius, ionisation energy and electronegativity across a period": ["nuclear charge increases across the period while the shielding from inner shells stays the same", "atomic radius decreases because the outer electrons are pulled closer to the nucleus", "first ionisation energy increases because the outer electron is held more tightly and is harder to remove", "electronegativity increases because the nucleus attracts the shared bonding electrons more strongly"],
            "Describe the trend in acid-base character of the oxides across period 3": ["metal oxides such as sodium oxide and magnesium oxide are basic and form alkaline solutions or neutralise acids", "non-metal oxides such as sulfur dioxide and the phosphorus oxides are acidic and dissolve to give acidic solutions", "aluminium oxide is amphoteric, reacting with both acids and bases", "the change from basic to acidic reflects the change from metallic to non-metallic character across the period"],
          },
        },
        {
          id: "s3-2-functional-groups",
          code: "S3.2",
          label: "Functional groups: classification of organic compounds",
          slug: "ib-chemistry-new-s32-functional-groups-classification-of-organic-compounds",
          misconceptions: [
            "Compounds with the same molecular formula are the same substance (isomers share a formula but have different structures and properties).",
            "Members of a homologous series have the same boiling point because they share a functional group (boiling point rises along the series as chain length and London forces increase).",
            "Ethanol is an alkane because it contains a carbon chain (it is an alcohol; the hydroxyl functional group decides its class and its reactions).",
          ],
          objectives: [
            "Explain what a homologous series is and how its properties change along the series",
            "Describe how organic compounds are classified and named by functional group",
            "Distinguish structural isomers and explain why they have different properties",
          ],
          criteria: {
            "Explain what a homologous series is and how its properties change along the series": ["members have the same functional group and the same general formula", "successive members differ by one CH2 unit", "members show similar chemical properties because the functional group determines reactivity", "physical properties such as boiling point change gradually because London forces grow with chain length"],
            "Describe how organic compounds are classified and named by functional group": ["the functional group is the atom or group of atoms that gives a compound its characteristic reactions", "the name has a stem for the longest carbon chain and a suffix or prefix for the functional group, such as -ol for alcohols", "numbers locate side chains or the functional group on the chain, using the lowest possible numbers", "one class named with its group, such as alkenes (C=C), alcohols (OH), carboxylic acids (COOH) or halogenoalkanes"],
            "Distinguish structural isomers and explain why they have different properties": ["structural isomers have the same molecular formula but a different arrangement of atoms", "they may differ in chain branching, in the position of the functional group, or in the functional group itself", "different shapes give different intermolecular forces, so physical properties such as boiling point differ", "a different functional group gives different chemical properties"],
          },
        },
      ],
    },
    {
      id: "r1-energy",
      label: "Reactivity 1 - What drives chemical reactions?",
      topics: [
        {
          id: "r1-1-enthalpy",
          code: "R1.1",
          label: "Measuring enthalpy changes",
          slug: "ib-chemistry-new-r11-measuring-enthalpy-change",
          misconceptions: [
            "Bond breaking releases energy (it absorbs energy; bond forming releases it).",
            "A negative enthalpy change means the reaction gets colder (exothermic reactions heat the surroundings).",
            "Heat and temperature are the same quantity.",
          ],
          objectives: [
            "Explain the difference between exothermic and endothermic reactions using an energy profile",
            "Describe how to measure an enthalpy change by calorimetry and one source of error",
          ],
          criteria: {
            "Explain the difference between exothermic and endothermic reactions using an energy profile": ["exothermic releases heat, products lower in energy than reactants, enthalpy change negative", "endothermic absorbs heat, products higher in energy, enthalpy change positive", "the activation energy is the hump between reactants and products"],
            "Describe how to measure an enthalpy change by calorimetry and one source of error": ["measure the temperature change of a known mass of water or solution", "use q = m c ΔT to find the heat transferred", "one source of error, such as heat loss to the surroundings"],
          },
        },
        {
          id: "r1-2-energy-cycles",
          code: "R1.2",
          label: "Energy cycles in reactions",
          slug: "ib-chemistry-new-r12-energy-cycles-in-reactions",
          misconceptions: [
            "Bond enthalpy calculations give exact enthalpy changes (they use average values across many compounds and assume gaseous species, so they are estimates).",
            "Hess's law only works if the intermediate reactions actually take place (enthalpy is a state function, so any route with the same start and end points gives the same total).",
            "The enthalpy of formation of an element such as oxygen gas is a large value (it is zero by definition for an element in its standard state).",
          ],
          objectives: [
            "Explain how average bond enthalpies are used to estimate the enthalpy change of a reaction",
            "Explain Hess's law and how an energy cycle finds an enthalpy change indirectly",
            "Outline how enthalpies of formation and combustion give a reaction enthalpy",
          ],
          criteria: {
            "Explain how average bond enthalpies are used to estimate the enthalpy change of a reaction": ["bond enthalpy is the energy needed to break one mole of a given bond in gaseous molecules", "energy is absorbed to break the bonds in the reactants and released when the bonds in the products form", "the enthalpy change is the total energy of bonds broken minus the total energy of bonds formed", "the values are averages over many compounds, so the result is only an estimate"],
            "Explain Hess's law and how an energy cycle finds an enthalpy change indirectly": ["the enthalpy change of a reaction is the same whatever route is taken, as long as the start and end states are the same", "the enthalpy changes of the steps in an indirect route are added to give the change for the direct route", "this gives changes that cannot be measured directly, such as forming a compound from its elements"],
            "Outline how enthalpies of formation and combustion give a reaction enthalpy": ["the standard enthalpy of formation is the change when one mole of a compound forms from its elements in their standard states", "an element in its standard state has an enthalpy of formation of zero", "with formation data the reaction enthalpy is the sum for the products minus the sum for the reactants", "with combustion data the reaction enthalpy is the sum for the reactants minus the sum for the products"],
          },
        },
        {
          id: "r1-3-energy-from-fuels",
          code: "R1.3",
          label: "Energy from fuels",
          slug: "ib-chemistry-new-r13-energy-from-fuels",
          misconceptions: [
            "Incomplete combustion releases more energy because the flame is bigger and sootier (it releases less; some carbon is left as carbon monoxide or soot instead of being fully oxidised).",
            "Burning a biofuel releases no carbon dioxide (it does; it is roughly carbon neutral only because the carbon was recently taken from the air by the plants that made it).",
            "Hydrogen is the ideal fuel because it has the highest energy density (its energy per unit mass is very high but its energy per unit volume as a gas is low, so storage is difficult).",
          ],
          objectives: [
            "Explain the difference between complete and incomplete combustion of a hydrocarbon",
            "Compare fossil fuels and biofuels as sources of energy",
            "Explain why fuels differ in the energy they release and the carbon dioxide they produce",
          ],
          criteria: {
            "Explain the difference between complete and incomplete combustion of a hydrocarbon": ["complete combustion in plentiful oxygen gives carbon dioxide and water", "incomplete combustion in limited oxygen gives carbon monoxide or soot (carbon) as well as water", "incomplete combustion releases less energy per mole of fuel", "carbon monoxide is toxic because it binds to haemoglobin and stops it carrying oxygen"],
            "Compare fossil fuels and biofuels as sources of energy": ["fossil fuels such as coal, crude oil and natural gas formed from ancient organisms and are non-renewable", "burning fossil fuels releases carbon dioxide that was locked away long ago, adding to the greenhouse effect", "biofuels are made from recent biomass, such as bioethanol from fermenting sugars or biodiesel from vegetable oils", "biofuels are renewable and roughly carbon neutral because the carbon dioxide released was recently absorbed by photosynthesis"],
            "Explain why fuels differ in the energy they release and the carbon dioxide they produce": ["specific energy is the energy released per unit mass and energy density is the energy released per unit volume", "fuels with a higher hydrogen to carbon ratio, such as methane, release less carbon dioxide per unit of energy", "coal has a low hydrogen to carbon ratio, so it releases the most carbon dioxide per joule of energy", "hydrogen gives only water on burning but is hard to store because its energy density as a gas is low"],
          },
        },
        {
          id: "r1-4-entropy",
          code: "R1.4",
          label: "Entropy and spontaneity (HL only)",
          slug: "ib-chemistry-new-r14-entropy-and-spontaneity-hl",
          misconceptions: [
            "A spontaneous reaction must happen quickly (spontaneity is about thermodynamic feasibility; the change of diamond to graphite is spontaneous yet immeasurably slow).",
            "Endothermic reactions can never be spontaneous (they can when the entropy increase is large enough, or the temperature high enough, for TΔS to outweigh ΔH).",
            "The entropy of the system must increase in every spontaneous reaction (the system's entropy can fall if the surroundings gain more; it is the total entropy that increases).",
          ],
          objectives: [
            "Explain what entropy measures and predict the sign of an entropy change for a reaction",
            "Explain how the Gibbs energy change decides whether a reaction is spontaneous",
            "Explain how temperature affects the spontaneity of a reaction",
          ],
          criteria: {
            "Explain what entropy measures and predict the sign of an entropy change for a reaction": ["entropy measures the dispersal of matter and energy in a system; the more ways the particles can be arranged, the higher it is", "entropy rises from solid to liquid to gas, so a change producing more moles of gas has a positive entropy change", "a reaction that reduces the number of moles of gas or turns a gas into a solid has a negative entropy change", "the standard entropy change of a reaction is the sum of the products' entropies minus the sum of the reactants'"],
            "Explain how the Gibbs energy change decides whether a reaction is spontaneous": ["the Gibbs energy change equals the enthalpy change minus the temperature in kelvin times the entropy change of the system", "a reaction is spontaneous when the Gibbs energy change is negative; at equilibrium it is zero", "spontaneous means thermodynamically feasible, not fast; the rate depends on the activation energy", "the more negative the standard Gibbs energy change, the larger the equilibrium constant"],
            "Explain how temperature affects the spontaneity of a reaction": ["exothermic with an entropy increase is spontaneous at every temperature; endothermic with an entropy decrease never is", "when both changes are positive (endothermic, more disorder) the reaction becomes spontaneous above a certain temperature", "when both changes are negative (exothermic, less disorder) the reaction is spontaneous only below a certain temperature", "the changeover temperature is where the Gibbs energy change is zero: enthalpy change divided by entropy change"],
          },
        },
      ],
    },
    {
      id: "r2-how-much-fast-far",
      label: "Reactivity 2 - How much, how fast and how far?",
      topics: [
        {
          id: "r2-1-amount",
          code: "R2.1",
          label: "How much? The amount of chemical change",
          slug: "ib-chemistry-new-r21-how-much-the-amount-of-chemical-change",
          misconceptions: [
            "The limiting reactant is the one present in the smallest mass or number of moles (it is the one that runs out first once the mole ratio in the equation is taken into account).",
            "A percentage yield of 100 per cent means the reaction has a high atom economy (yield and atom economy are independent; a full yield can still produce a lot of waste by-product).",
            "An equation can be balanced by changing the subscripts in a formula (only the coefficients may change; altering a subscript changes the substance).",
          ],
          objectives: [
            "Explain what a balanced chemical equation tells us about the amounts of substances reacting",
            "Explain the limiting reactant and why actual yield is usually less than theoretical yield",
            "Explain what atom economy measures and why it matters for green chemistry",
          ],
          criteria: {
            "Explain what a balanced chemical equation tells us about the amounts of substances reacting": ["atoms are conserved, so each element has the same number of atoms on both sides", "the coefficients give the mole ratio in which the substances react and are formed", "the mole ratio lets a mass, solution volume or gas volume of one substance be converted into that of another", "state symbols show whether each substance is solid, liquid, gas or aqueous"],
            "Explain the limiting reactant and why actual yield is usually less than theoretical yield": ["the limiting reactant is the one used up first; it fixes the maximum amount of product", "the other reactants are in excess and some of each is left over at the end", "theoretical yield is the product predicted from the limiting reactant; percentage yield is actual divided by theoretical times 100", "yield is lower because of side reactions, incomplete reaction, or loss of product during separation and purification"],
            "Explain what atom economy measures and why it matters for green chemistry": ["atom economy is the mass of the desired product as a percentage of the total mass of all products", "an addition reaction with a single product has an atom economy of 100 per cent", "a high atom economy means less waste, so the process is more sustainable and cheaper to run", "atom economy is different from percentage yield, which compares actual and theoretical amounts of product"],
          },
        },
        {
          id: "r2-2-rate",
          code: "R2.2",
          label: "How fast? The rate of chemical change",
          slug: "ib-chemistry-new-r22-how-fast-the-rate-of-chemical-change",
          misconceptions: [
            "A catalyst works by giving the particles more energy (it provides a different pathway with a lower activation energy; the particle energies are unchanged).",
            "Raising the temperature speeds up a reaction mainly because particles collide more often (the main effect is that a much larger fraction of collisions has energy above the activation energy).",
            "Increasing the concentration gives the particles more energy (it increases the frequency of collisions; the energy of the particles depends only on temperature).",
          ],
          objectives: [
            "Explain using collision theory why concentration and surface area affect the rate",
            "Explain how temperature affects rate using the Maxwell-Boltzmann distribution",
            "Explain how a catalyst increases the rate of a reaction",
          ],
          criteria: {
            "Explain using collision theory why concentration and surface area affect the rate": ["a reaction happens only when particles collide with enough energy and the correct orientation", "the rate depends on how many successful collisions happen per unit time", "a higher concentration or gas pressure means more particles per unit volume, so collisions are more frequent", "a greater surface area of a solid exposes more particles to collisions, so the rate increases"],
            "Explain how temperature affects rate using the Maxwell-Boltzmann distribution": ["activation energy is the minimum energy colliding particles need for a reaction to occur", "at a higher temperature the distribution curve flattens and shifts to higher energies, with the same total area", "a much larger fraction of particles has energy above the activation energy, so far more collisions succeed", "particles also collide more often, but the bigger effect is the higher proportion of successful collisions"],
            "Explain how a catalyst increases the rate of a reaction": ["a catalyst provides an alternative reaction pathway with a lower activation energy", "more of the colliding particles have energy above the lower activation energy, so more collisions succeed", "the catalyst is not used up and does not change the enthalpy change or the position of equilibrium"],
          },
        },
        {
          id: "r2-3-extent",
          code: "R2.3",
          label: "How far? The extent of chemical change",
          slug: "ib-chemistry-new-r23-how-far-the-extent-of-chemical-change",
          misconceptions: [
            "At equilibrium the reaction has stopped (both the forward and reverse reactions continue, at the same rate).",
            "At equilibrium the concentrations of reactants and products are equal (they are constant, but their ratio is set by K and is rarely one to one).",
            "A catalyst shifts the equilibrium position towards the products (it speeds up both directions equally, so equilibrium is reached faster with the same position).",
          ],
          objectives: [
            "Describe the characteristics of a system in dynamic equilibrium",
            "Explain what the magnitude of the equilibrium constant indicates about a reaction",
            "Explain how an equilibrium responds to changes in concentration, pressure and temperature",
          ],
          criteria: {
            "Describe the characteristics of a system in dynamic equilibrium": ["the forward and reverse reactions continue at equal rates", "the concentrations of reactants and products stay constant, though not necessarily equal", "equilibrium can only be reached in a closed system", "the same equilibrium is reached from either direction and there is no change in macroscopic properties"],
            "Explain what the magnitude of the equilibrium constant indicates about a reaction": ["the equilibrium constant is the product concentrations divided by the reactant concentrations, each raised to its coefficient", "a value much greater than 1 means the equilibrium lies to the right and mostly products are present", "a value much less than 1 means the equilibrium lies to the left and little product forms", "the value depends only on temperature, not on concentration, pressure or the presence of a catalyst"],
            "Explain how an equilibrium responds to changes in concentration, pressure and temperature": ["the position shifts to partly counteract the change (Le Chatelier's principle)", "adding a reactant or removing a product shifts the equilibrium towards the products", "increasing the pressure shifts the position to the side with fewer moles of gas", "raising the temperature favours the endothermic direction and is the only change that alters the value of K"],
          },
        },
      ],
    },
    {
      id: "r3-mechanisms",
      label: "Reactivity 3 - What are the mechanisms of chemical change?",
      topics: [
        {
          id: "r3-1-proton-transfer",
          code: "R3.1",
          label: "Proton transfer reactions",
          slug: "ib-chemistry-new-r31-proton-transfer-reactions",
          misconceptions: [
            "A weak acid is the same as a dilute acid (weak refers to partial ionisation; dilute refers to low concentration; a concentrated weak acid is perfectly possible).",
            "A solution of pH 4 has twice the hydrogen ion concentration of one at pH 8 (the scale is logarithmic; it has ten thousand times the concentration).",
            "A neutral solution always has a pH of 7 (pH 7 is neutral only at 25 degrees Celsius; the ion product of water, and so the neutral pH, changes with temperature).",
          ],
          objectives: [
            "Explain the Brønsted-Lowry definitions of acids and bases and conjugate acid-base pairs",
            "Distinguish strong and weak acids and explain how strength differs from concentration",
            "Explain what pH measures and describe the reaction of an acid with a base",
          ],
          criteria: {
            "Explain the Brønsted-Lowry definitions of acids and bases and conjugate acid-base pairs": ["an acid is a proton donor and a base is a proton acceptor", "a conjugate acid-base pair is two species that differ by one proton, such as NH3 and NH4+ or H2O and OH-", "the stronger an acid, the weaker its conjugate base", "an amphiprotic species such as water or HCO3- can both donate and accept a proton"],
            "Distinguish strong and weak acids and explain how strength differs from concentration": ["a strong acid ionises completely in water, so effectively all its molecules release their protons", "a weak acid ionises only partly, so an equilibrium exists between the acid and its ions", "strength is about the degree of ionisation while concentration is about the amount of acid per unit volume", "at the same concentration a strong acid has a lower pH, higher conductivity and reacts faster with metals or carbonates"],
            "Explain what pH measures and describe the reaction of an acid with a base": ["pH is the negative logarithm to base 10 of the hydrogen ion concentration", "a change of one pH unit is a tenfold change in hydrogen ion concentration", "in a neutral solution the hydrogen and hydroxide ion concentrations are equal, giving pH 7 at 25 degrees Celsius", "acids react with bases (metal oxides, hydroxides or carbonates) to give a salt and water; carbonates also give carbon dioxide"],
          },
        },
        {
          id: "r3-2-electron-transfer",
          code: "R3.2",
          label: "Electron transfer reactions",
          slug: "ib-chemistry-new-r32-electron-transfer-reactions",
          misconceptions: [
            "Oxidation always involves oxygen (it is loss of electrons; a metal reacting with chlorine is also oxidised).",
            "The anode is always the positive electrode (in a voltaic cell the anode is negative; in both kinds of cell it is the electrode where oxidation happens).",
            "Electrons flow through the salt bridge (ions move through the salt bridge; electrons flow only through the external wire).",
          ],
          objectives: [
            "Explain oxidation and reduction in terms of electron transfer and oxidation state",
            "Explain how a reactivity series is built from displacement reactions",
            "Compare voltaic and electrolytic cells",
          ],
          criteria: {
            "Explain oxidation and reduction in terms of electron transfer and oxidation state": ["oxidation is loss of electrons and reduction is gain of electrons", "oxidation raises the oxidation state of an atom and reduction lowers it", "the oxidising agent accepts electrons and is itself reduced; the reducing agent donates electrons and is itself oxidised", "in a redox reaction the electrons lost by one species equal the electrons gained by the other"],
            "Explain how a reactivity series is built from displacement reactions": ["a more reactive metal displaces a less reactive metal from a solution of its ions", "the more reactive metal is oxidised because it loses electrons more readily, while the less reactive metal ion is reduced", "a more reactive halogen displaces a less reactive halide ion from solution; reactivity falls down group 17", "the series ranks elements by how readily they lose electrons (metals) or gain electrons (halogens)"],
            "Compare voltaic and electrolytic cells": ["a voltaic cell turns a spontaneous redox reaction into electricity; an electrolytic cell uses electricity to force a reaction", "in a voltaic cell the more reactive metal is the negative electrode, where oxidation happens", "oxidation happens at the anode and reduction at the cathode in both kinds of cell", "in a voltaic cell a salt bridge lets ions flow to complete the circuit; electrolysis needs a molten or aqueous electrolyte"],
          },
        },
        {
          id: "r3-3-electron-sharing",
          code: "R3.3",
          label: "Electron sharing reactions",
          slug: "ib-chemistry-new-r33-electron-sharing-reactions",
          misconceptions: [
            "A radical is a kind of ion (a radical is neutral with an unpaired electron; it forms when a bond splits evenly, not when electrons are transferred).",
            "Free radical substitution of methane with chlorine gives only chloromethane (substitution can continue to di-, tri- and tetrachloromethane, so a mixture forms).",
            "Ultraviolet light is needed throughout the whole reaction (it is needed only for initiation; propagation sustains itself until termination).",
          ],
          objectives: [
            "Explain what a radical is and how radicals form by homolytic fission",
            "Describe the mechanism of free radical substitution of an alkane by a halogen",
            "Explain why alkanes are generally unreactive and why halogenation gives a mixture of products",
          ],
          criteria: {
            "Explain what a radical is and how radicals form by homolytic fission": ["a radical is a species with an unpaired electron, shown by a dot", "in homolytic fission a covalent bond breaks evenly, with one electron going to each atom", "the energy for fission usually comes from ultraviolet light or heat", "radicals are highly reactive because the unpaired electron readily pairs with another electron"],
            "Describe the mechanism of free radical substitution of an alkane by a halogen": ["initiation: ultraviolet light splits the halogen molecule into two halogen radicals", "propagation: a halogen radical takes a hydrogen from the alkane to make an alkyl radical, which attacks another halogen molecule", "propagation regenerates a halogen radical, so a chain reaction continues", "termination: two radicals combine to form a stable molecule, ending the chain"],
            "Explain why alkanes are generally unreactive and why halogenation gives a mixture of products": ["the carbon to carbon and carbon to hydrogen bonds are strong and almost non-polar, so ions have no site to attack", "alkanes react mainly by combustion or with radicals, which need heat or ultraviolet light to start", "substitution can happen at any hydrogen and can repeat, so mono-, di- and further substituted products form", "the reaction cannot easily be controlled to give a single product"],
          },
        },
        {
          id: "r3-4-electron-pair-sharing",
          code: "R3.4",
          label: "Electron-pair sharing reactions",
          slug: "ib-chemistry-new-r34-electron-pair-sharing-reactions",
          misconceptions: [
            "Nucleophiles must be negatively charged ions (neutral molecules with a lone pair, such as water or ammonia, are also nucleophiles).",
            "Nucleophiles attack the halogen atom of a halogenoalkane (they attack the partially positive carbon; the halogen leaves as a halide ion).",
            "Addition and substitution are the same because both make a new bond (in addition the double bond opens and nothing is lost; in substitution one group is replaced by another).",
          ],
          objectives: [
            "Distinguish nucleophiles from electrophiles and explain heterolytic fission",
            "Describe nucleophilic substitution of a halogenoalkane",
            "Explain why alkenes undergo electrophilic addition and describe one example",
          ],
          criteria: {
            "Distinguish nucleophiles from electrophiles and explain heterolytic fission": ["a nucleophile is electron rich and donates an electron pair to form a new bond, such as hydroxide, water or ammonia", "an electrophile is electron poor and accepts an electron pair, such as a hydrogen ion or a bromine molecule polarised by an alkene", "in heterolytic fission a bond breaks so that both electrons go to one atom, forming a positive and a negative fragment", "a curly arrow shows the movement of an electron pair from the nucleophile to the electrophile"],
            "Describe nucleophilic substitution of a halogenoalkane": ["the carbon to halogen bond is polar, so the carbon is partially positive and attracts nucleophiles", "the nucleophile donates an electron pair to the carbon and forms a new bond", "the carbon to halogen bond breaks heterolytically and the halide ion leaves as the leaving group", "one example, such as bromoethane with hydroxide ions giving ethanol and bromide ions"],
            "Explain why alkenes undergo electrophilic addition and describe one example": ["the double bond is a region of high electron density that attracts electrophiles", "the double bond opens and two new single bonds form, so the atoms of the reagent are added and nothing is lost", "one example, such as ethene with bromine giving 1,2-dibromoethane or with hydrogen bromide giving bromoethane", "the decolourising of bromine water is the test for an unsaturated compound"],
          },
        },
      ],
    },
  ],
};
