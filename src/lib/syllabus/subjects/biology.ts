import type { Subject } from "../types";

/** IB Biology: guide for first assessment 2025, organised into themes A to D with HL-only topics marked. Topic codes, labels and library slugs match RevisionDojo's resource library (read 13 Sep 2026). */
export const BIOLOGY: Subject = {
  id: "ib-biology",
  name: "Biology",
  short: "Bio",
  slug: "ib-biology-new",
  tint: "success",
  units: [
    {
      id: "a-unity-diversity",
      label: "A - Unity and Diversity",
      topics: [
        {
          id: "a1-1-water",
          code: "A1.1",
          label: "Water",
          slug: "ib-biology-new-a11-water",
          misconceptions: [
            "Hydrogen bonds are the covalent bonds inside a water molecule (they are weak attractions BETWEEN molecules).",
            "Water is a good solvent because it is 'wet' or 'liquid' (it is the partial charges that attract ions and polar molecules).",
            "Cohesion and adhesion are the same thing (cohesion is water to water; adhesion is water to other surfaces).",
          ],
          objectives: [
            "Explain how the polarity of water leads to hydrogen bonding",
            "Describe cohesion and adhesion and give one consequence of each for living things",
            "Explain why water is an effective solvent for polar and ionic substances",
          ],
          criteria: {
            "Explain how the polarity of water leads to hydrogen bonding": ["oxygen is more electronegative, so the shared electrons sit closer to it", "the oxygen end is partially negative and the hydrogen ends partially positive", "a hydrogen of one water molecule is attracted to the oxygen of a neighbouring molecule"],
            "Describe cohesion and adhesion and give one consequence of each for living things": ["cohesion is water molecules sticking to each other through hydrogen bonds", "adhesion is water sticking to other polar surfaces", "one consequence of cohesion, such as the continuous water column in xylem or surface tension", "one consequence of adhesion, such as capillary rise in cell walls or soil"],
            "Explain why water is an effective solvent for polar and ionic substances": ["water's partial charges attract ions and polar molecules", "water molecules surround each dissolved particle", "non-polar substances have no charges to attract, so they do not dissolve"],
          },
        },
        {
          id: "a1-2-nucleic-acids",
          code: "A1.2",
          label: "Nucleic acids",
          slug: "ib-biology-new-a12-nucleic-acids",
          misconceptions: [
            "The two strands of DNA are identical copies of each other (they are complementary, not identical, so one strand is read to build the other).",
            "RNA is simply DNA with uracil in it (RNA is also single stranded and contains ribose rather than deoxyribose).",
            "The sugar and phosphate part of DNA carries the genetic information (the backbone is uniform; the information is in the order of the bases).",
          ],
          objectives: [
            "Describe the structure of a nucleotide and how nucleotides are joined into a strand",
            "Explain complementary base pairing in the DNA double helix",
            "Distinguish the structure of DNA from the structure of RNA",
          ],
          criteria: {
            "Describe the structure of a nucleotide and how nucleotides are joined into a strand": ["a nucleotide has a pentose sugar, a phosphate group and a nitrogenous base", "the phosphate of one nucleotide bonds to the sugar of the next in a condensation reaction", "this makes a sugar phosphate backbone with the bases projecting from it"],
            "Explain complementary base pairing in the DNA double helix": ["adenine pairs with thymine and cytosine pairs with guanine", "the bases are held together by hydrogen bonds", "a purine always pairs with a pyrimidine, so the helix has a constant width", "the two strands run in opposite directions (antiparallel) and twist into a double helix"],
            "Distinguish the structure of DNA from the structure of RNA": ["DNA is double stranded while RNA is usually single stranded", "DNA contains deoxyribose and RNA contains ribose", "RNA has uracil in place of thymine"],
          },
        },
        {
          id: "a2-1-origins-of-cells",
          code: "A2.1",
          label: "Origins of cells (HL only)",
          slug: "ib-biology-new-a21-origins-of-cells-hl",
          misconceptions: [
            "The Miller and Urey experiment produced living cells (it produced amino acids and other organic molecules only).",
            "Spontaneous generation of cells still happens today (conditions and competition on the modern Earth prevent it; all cells now come from pre-existing cells).",
            "The last universal common ancestor was the first living thing (it was one later population from which all surviving life descends).",
          ],
          objectives: [
            "Outline the stages required for the spontaneous origin of cells on early Earth",
            "Explain the significance of the Miller and Urey experiment",
            "Describe the evidence for a last universal common ancestor",
          ],
          criteria: {
            "Outline the stages required for the spontaneous origin of cells on early Earth": ["simple organic molecules such as amino acids and sugars had to form from inorganic matter", "these had to be assembled into polymers that could catalyse reactions", "self replicating molecules such as RNA had to appear, allowing inheritance and variation", "the molecules had to be enclosed by a membrane to form a compartment separate from the surroundings"],
            "Explain the significance of the Miller and Urey experiment": ["a sealed apparatus modelled the reducing atmosphere and ocean of the early Earth, with sparks as lightning", "amino acids and other organic molecules were produced from inorganic starting materials", "it showed that the first step towards life needs no living organism, though it does not prove this is how life began"],
            "Describe the evidence for a last universal common ancestor": ["all known organisms share the same genetic code and use DNA, RNA and ribosomes", "shared features such as ATP as energy currency and common metabolic pathways are hard to explain by chance", "comparing conserved gene sequences allows the ancestor to be dated, probably to hydrothermal vent conditions"],
          },
        },
        {
          id: "a2-2-cell-structure",
          code: "A2.2",
          label: "Cell structure",
          slug: "ib-biology-new-a22-cell-structure",
          misconceptions: [
            "Prokaryotes have no DNA (they have a naked circular chromosome, just no nucleus).",
            "Plant cells have no mitochondria because they have chloroplasts.",
            "All cells have a nucleus.",
          ],
          objectives: [
            "Outline the features shared by all cells",
            "Distinguish prokaryotic from eukaryotic cell structure",
            "Explain the advantage of compartmentalisation in eukaryotic cells",
          ],
          criteria: {
            "Outline the features shared by all cells": ["a plasma membrane", "cytoplasm", "DNA as the genetic material", "ribosomes that make proteins"],
            "Distinguish prokaryotic from eukaryotic cell structure": ["prokaryotes have no nucleus and their DNA is a naked loop in the cytoplasm", "eukaryotes have a nucleus and membrane-bound organelles", "prokaryotes are smaller and have smaller ribosomes"],
            "Explain the advantage of compartmentalisation in eukaryotic cells": ["incompatible reactions are kept apart", "enzymes and substrates are concentrated, so reactions run faster", "conditions such as pH can differ between compartments"],
          },
        },
        {
          id: "a2-3-viruses",
          code: "A2.3",
          label: "Viruses (HL only)",
          slug: "ib-biology-new-a23-viruses-hl",
          misconceptions: [
            "Viruses are very small cells (they have no cytoplasm, no ribosomes and no metabolism of their own).",
            "Antibiotics can be used to treat viral infections (antibiotics target bacterial structures and processes that viruses do not have).",
            "A virus in the lysogenic cycle is doing no harm and has left the cell (its genome is integrated into the host DNA and is copied every time the host divides).",
          ],
          objectives: [
            "Describe the structural features common to all viruses",
            "Compare the lytic cycle with the lysogenic cycle",
            "Explain why viruses evolve rapidly",
          ],
          criteria: {
            "Describe the structural features common to all viruses": ["a nucleic acid genome, either DNA or RNA, that is very small", "a protein coat called a capsid surrounding the genome", "no cytoplasm, ribosomes or metabolism, so replication needs a host cell", "some viruses also have an envelope of host membrane, but this is not universal"],
            "Compare the lytic cycle with the lysogenic cycle": ["both begin with the virus attaching to a host cell and injecting its genome", "in the lytic cycle the host machinery makes new virions at once and the cell bursts", "in the lysogenic cycle the viral genome integrates into the host DNA and is copied as the host divides", "a lysogenic infection can later switch to the lytic cycle"],
            "Explain why viruses evolve rapidly": ["generation times are very short and huge numbers of virions are made from one cell", "replication enzymes, especially in RNA viruses, lack proofreading, so mutation rates are high", "some viruses exchange genome segments when one cell is infected twice, as in influenza", "selection by host immunity or antiviral drugs favours the new variants"],
          },
        },
        {
          id: "a3-1-diversity-of-organisms",
          code: "A3.1",
          label: "Diversity of organisms",
          slug: "ib-biology-new-a31-diversity-of-organisms",
          misconceptions: [
            "Two organisms that look alike must be the same species (appearance can converge, and it is the ability to interbreed and produce fertile offspring that counts).",
            "Species with more chromosomes are more complex (chromosome number varies widely and is not related to complexity).",
            "The common name of an organism is enough to identify it (common names differ between places and languages, which is why the binomial is used).",
          ],
          objectives: [
            "Explain the biological species concept and one difficulty in applying it",
            "Outline the binomial system used to name species",
            "Describe how chromosome number and genome size vary between species",
          ],
          criteria: {
            "Explain the biological species concept and one difficulty in applying it": ["a species is a group of organisms that can interbreed and produce fertile offspring", "members of different species are reproductively isolated from each other", "one difficulty, such as asexual organisms, extinct fossil species or hybrids like the mule that are infertile"],
            "Outline the binomial system used to name species": ["each species is given a two part name, the genus followed by the species name", "the genus begins with a capital letter and the species name does not, and both are italicised", "the system is international, so one species has one agreed name everywhere"],
            "Describe how chromosome number and genome size vary between species": ["chromosome number is constant within a species but differs widely between species", "a karyotype shows the number and type of chromosomes in a cell", "genome size varies enormously and is not proportional to the complexity of the organism"],
          },
        },
        {
          id: "a3-2-classification-cladistics",
          code: "A3.2",
          label: "Classification and cladistics (HL only)",
          slug: "ib-biology-new-a32-classification-and-cladistics-hl",
          misconceptions: [
            "Species that look similar are always closely related (analogous features produced by convergent evolution can mislead, which is why molecular evidence is used).",
            "A cladogram shows which living species evolved from which (the tips are all present day species; only the nodes represent common ancestors).",
            "Classification is fixed once agreed (groups are revised whenever new molecular evidence shows they are not clades).",
          ],
          objectives: [
            "Distinguish a natural classification from an artificial one",
            "Explain how base or amino acid sequences are used to build a cladogram",
            "Explain why groups are sometimes reclassified",
          ],
          criteria: {
            "Distinguish a natural classification from an artificial one": ["a natural classification groups organisms by shared ancestry, so each group is a clade", "a clade contains a common ancestor and all of its descendants", "an artificial classification groups by convenient shared features, which may be analogous rather than inherited", "a natural classification has predictive value because members of a clade share many other traits"],
            "Explain how base or amino acid sequences are used to build a cladogram": ["differences in the sequence of a gene or protein are counted between species", "more differences imply a longer time since the species shared a common ancestor", "mutations accumulate at a roughly constant rate, which acts as a molecular clock", "the cladogram places the most similar sequences on the most recent branches"],
            "Explain why groups are sometimes reclassified": ["molecular evidence can show that a traditional group is not a clade", "a group may exclude some descendants of its ancestor or include unrelated species", "one example, such as the splitting of the figwort family or the placing of birds within the reptiles"],
          },
        },
        {
          id: "a4-1-evolution-speciation",
          code: "A4.1",
          label: "Evolution and speciation",
          slug: "ib-biology-new-a41-evolution-and-speciation",
          misconceptions: [
            "Individual organisms evolve during their lifetime (it is the population that changes across generations, not the individual).",
            "Homologous structures show that one species evolved from another living species (they show descent from a shared ancestor).",
            "Speciation always needs a physical barrier (sympatric speciation can occur through polyploidy, timing of breeding or habitat preference).",
          ],
          objectives: [
            "Outline three types of evidence that species have evolved",
            "Explain how reproductive isolation can lead to speciation",
            "Distinguish allopatric from sympatric speciation",
          ],
          criteria: {
            "Outline three types of evidence that species have evolved": ["the fossil record shows a sequence of forms changing over time", "selective breeding shows that populations can be changed rapidly by selection", "homologous structures such as the pentadactyl limb show a shared ancestor with different functions", "molecular evidence shows more similar sequences in more closely related species"],
            "Explain how reproductive isolation can lead to speciation": ["gene flow between the two populations stops", "each population experiences different mutations and different selection pressures", "allele frequencies diverge until the populations can no longer interbreed and produce fertile offspring"],
            "Distinguish allopatric from sympatric speciation": ["allopatric speciation begins with a geographical barrier separating the populations", "sympatric speciation happens while the populations live in the same area", "sympatric isolation comes from behavioural, temporal or chromosomal differences such as polyploidy"],
          },
        },
        {
          id: "a4-2-conservation",
          code: "A4.2",
          label: "Conservation of biodiversity",
          slug: "ib-biology-new-a42-conservation-of-biodiversity",
          misconceptions: [
            "Biodiversity just means the number of species (it also includes genetic diversity within species and the diversity of ecosystems).",
            "Keeping a species alive in a zoo or seed bank conserves it fully (ex situ conservation loses the habitat, the interactions and much genetic diversity).",
            "Current extinctions are simply the normal background rate (present rates are estimated to be far above the rate seen in the fossil record).",
          ],
          objectives: [
            "Outline the main human causes of the current loss of biodiversity",
            "Compare in situ and ex situ approaches to conservation",
            "Explain why some species are prioritised for conservation",
          ],
          criteria: {
            "Outline the main human causes of the current loss of biodiversity": ["habitat loss and fragmentation from agriculture and building", "overexploitation such as overfishing or hunting", "pollution and the spread of invasive species", "climate change shifting conditions faster than species can adapt or move"],
            "Compare in situ and ex situ approaches to conservation": ["in situ conservation protects species in their natural habitat, for example in a nature reserve", "ex situ conservation keeps organisms outside the habitat, such as in zoos, botanic gardens or seed banks", "in situ keeps the ecosystem and its interactions intact, so it is generally preferred", "ex situ is a last resort for very small populations and can supply individuals for reintroduction"],
            "Explain why some species are prioritised for conservation": ["resources are limited, so choices between species have to be made", "evolutionarily distinct species carry genetic diversity with no close relatives to replace it", "globally endangered species are at greatest risk of being lost soon", "protecting a keystone species or its habitat also protects many other species"],
          },
        },
      ],
    },
    {
      id: "b-form-function",
      label: "B - Form and Function",
      topics: [
        {
          id: "b1-1-carbohydrates-lipids",
          code: "B1.1",
          label: "Carbohydrates and lipids",
          slug: "ib-biology-new-b11-carbohydrates-and-lipids",
          misconceptions: [
            "Starch and cellulose are different because they are made of different monomers (both are polymers of glucose; the difference is the orientation of the glycosidic bonds).",
            "All fats are unhealthy (unsaturated fats are a normal part of the diet; the concern is mainly with saturated and trans fats).",
            "Lipids are polymers like polysaccharides (a triglyceride is a single molecule of glycerol with three fatty acids, not a long repeating chain).",
          ],
          objectives: [
            "Explain how condensation and hydrolysis build and break biological polymers",
            "Compare the structure and function of cellulose, starch and glycogen",
            "Distinguish saturated from unsaturated fatty acids",
          ],
          criteria: {
            "Explain how condensation and hydrolysis build and break biological polymers": ["condensation joins two monomers and releases a molecule of water", "in carbohydrates this forms a glycosidic bond between monosaccharides", "hydrolysis uses a molecule of water to break the bond and release the monomers", "both reactions are catalysed by enzymes in cells"],
            "Compare the structure and function of cellulose, starch and glycogen": ["all three are polysaccharides made from glucose monomers", "cellulose is unbranched with alternate glucose molecules inverted, giving straight chains that form strong fibres in cell walls", "starch is the plant store, with amylose as a helix and amylopectin branched", "glycogen is the animal store and is more highly branched, so it can be broken down quickly"],
            "Distinguish saturated from unsaturated fatty acids": ["a saturated fatty acid has no double bonds between its carbon atoms", "an unsaturated fatty acid has one or more carbon to carbon double bonds", "double bonds create kinks, so the molecules pack less closely and melting points are lower", "saturated fats are usually solid at room temperature while unsaturated fats are usually oils"],
          },
        },
        {
          id: "b1-2-proteins",
          code: "B1.2",
          label: "Proteins",
          slug: "ib-biology-new-b12-proteins",
          misconceptions: [
            "A denatured protein has had its peptide bonds broken (denaturation changes the three dimensional shape; the primary sequence is unchanged).",
            "All proteins have four levels of structure (quaternary structure exists only where two or more polypeptides combine).",
            "The 20 amino acids differ in their whole structure (they share the same amine, carboxyl and hydrogen groups and differ only in the R group).",
          ],
          objectives: [
            "Describe how amino acids are joined to form a polypeptide",
            "Explain the levels of protein structure",
            "Explain how heat and extremes of pH denature a protein",
          ],
          criteria: {
            "Describe how amino acids are joined to form a polypeptide": ["all amino acids share an amine group, a carboxyl group and a variable R group on a central carbon", "a condensation reaction between the amine group of one and the carboxyl group of the next forms a peptide bond and releases water", "this happens on the ribosome, giving a chain whose order of amino acids is set by the gene"],
            "Explain the levels of protein structure": ["primary structure is the sequence of amino acids in the chain", "secondary structure is local folding into alpha helices or beta pleated sheets held by hydrogen bonds", "tertiary structure is the three dimensional shape held by bonds between R groups, such as disulfide bridges or ionic bonds", "quaternary structure is two or more polypeptides joining, sometimes with a prosthetic group such as haem"],
            "Explain how heat and extremes of pH denature a protein": ["heat makes the chain vibrate so that the weak bonds holding the tertiary structure break", "a change in pH alters the charges on R groups, so ionic bonds and hydrogen bonds are disrupted", "the three dimensional shape is lost, so an active site or binding site no longer fits its substrate", "the primary sequence stays intact and the change is usually irreversible"],
          },
        },
        {
          id: "b2-1-membranes",
          code: "B2.1",
          label: "Membranes and membrane transport",
          slug: "ib-biology-new-b21-membranes-and-membrane-transport",
          misconceptions: [
            "Osmosis moves water from where there is more solute to where there is less solute (it is the reverse: towards the higher solute concentration).",
            "Osmosis or simple diffusion needs ATP (only active transport does).",
            "Facilitated diffusion moves substances against the concentration gradient.",
          ],
          objectives: [
            "Describe the structure of the plasma membrane",
            "Explain the direction of osmosis",
            "Compare simple and facilitated diffusion",
          ],
          criteria: {
            "Describe the structure of the plasma membrane": ["a phospholipid bilayer", "hydrophilic phosphate heads face the water and hydrophobic tails point inwards", "proteins embedded in or spanning the bilayer", "cholesterol between the phospholipids"],
            "Explain the direction of osmosis": ["net movement of water across a partially permeable membrane", "from lower solute concentration to higher solute concentration (towards more solute, where there is less free water)"],
            "Compare simple and facilitated diffusion": ["both are passive and move particles down their concentration gradient", "simple diffusion goes straight through the bilayer for small or non-polar particles", "facilitated diffusion uses channel or carrier proteins for polar or charged particles"],
          },
        },
        {
          id: "b2-2-organelles",
          code: "B2.2",
          label: "Organelles and compartmentalization",
          slug: "ib-biology-new-b22-organelles-and-compartmentalization",
          misconceptions: [
            "Compartments make reactions slower because substances have to cross membranes (they raise local concentrations and separate incompatible reactions).",
            "The rough ER makes lipids and the smooth ER makes proteins (it is the other way round).",
            "Lysosomes are only found in plant cells.",
          ],
          objectives: [
            "Describe the structure and function of the mitochondrion",
            "Explain how the nucleus controls the cell's activities",
          ],
          criteria: {
            "Describe the structure and function of the mitochondrion": ["a double membrane with the inner membrane folded into cristae", "the matrix, where the Krebs cycle happens", "cristae increase the surface area for ATP production by the electron transport chain"],
            "Explain how the nucleus controls the cell's activities": ["the nucleus holds the DNA that carries the instructions for proteins", "genes are transcribed into mRNA in the nucleus", "mRNA leaves through nuclear pores to ribosomes, so the nucleus decides which proteins are made"],
          },
        },
        {
          id: "b2-3-cell-specialization",
          code: "B2.3",
          label: "Cell specialization",
          slug: "ib-biology-new-b23-cell-specialization",
          misconceptions: [
            "Specialised cells have lost the genes they do not use (almost all body cells keep the whole genome; they differ in which genes are expressed).",
            "Stem cells are only found in embryos (adult tissues such as bone marrow contain multipotent stem cells).",
            "Large cells are more efficient because they hold more cytoplasm (as a cell grows the surface area to volume ratio falls and exchange becomes too slow).",
          ],
          objectives: [
            "Explain how cells with identical genomes become specialised",
            "Describe the properties of stem cells and one use in medicine",
            "Explain how the surface area to volume ratio limits cell size",
          ],
          criteria: {
            "Explain how cells with identical genomes become specialised": ["differentiation is the expression of some genes and not others in a cell", "the position of a cell and the chemical signals it receives determine which genes are switched on", "the proteins made give the cell its structure and function, such as haemoglobin in a red blood cell", "the pattern of expression is usually retained when the cell divides"],
            "Describe the properties of stem cells and one use in medicine": ["stem cells can divide repeatedly to make more cells of the same kind", "they are unspecialised but can differentiate into other cell types", "potency varies, from totipotent in the early embryo to multipotent in adult tissues", "one therapeutic use, such as bone marrow transplants for leukaemia or growing skin grafts for burns"],
            "Explain how the surface area to volume ratio limits cell size": ["the rate of exchange across the membrane depends on surface area", "the demand for materials and the waste produced depend on the volume", "as a cell grows, volume rises faster than surface area, so the ratio falls", "beyond a certain size exchange and diffusion inside the cell are too slow to meet demand"],
          },
        },
        {
          id: "b3-1-gas-exchange",
          code: "B3.1",
          label: "Gas exchange",
          slug: "ib-biology-new-b31-gas-exchange",
          misconceptions: [
            "The lungs actively pump air in and out (ventilation is caused by pressure changes produced by the diaphragm and intercostal muscles).",
            "Air breathed out contains no oxygen (it still contains about 16 per cent oxygen; only some is absorbed).",
            "Stomata open at night to take in carbon dioxide (most plants open stomata in the light, when photosynthesis needs carbon dioxide).",
          ],
          objectives: [
            "Describe the features shared by efficient gas exchange surfaces",
            "Explain how the alveoli are adapted for gas exchange",
            "Explain how stomata balance gas exchange against water loss",
          ],
          criteria: {
            "Describe the features shared by efficient gas exchange surfaces": ["a large surface area for many molecules to cross at once", "a thin surface, often one cell thick, giving a short diffusion distance", "a moist permeable surface so gases dissolve and pass through", "a concentration gradient maintained by ventilation or by a blood supply"],
            "Explain how the alveoli are adapted for gas exchange": ["millions of alveoli give a very large total surface area", "the alveolar wall and the capillary wall are each one cell thick", "a dense capillary network carries oxygen away and brings carbon dioxide, maintaining the gradient", "the surface is moist and surfactant stops the alveoli collapsing"],
            "Explain how stomata balance gas exchange against water loss": ["stomata are pores in the epidermis, usually on the lower surface of the leaf", "they let carbon dioxide diffuse in and oxygen diffuse out", "water vapour is lost through the same pores by transpiration", "guard cells change shape to open the pore in the light and close it when water is short"],
          },
        },
        {
          id: "b3-2-transport",
          code: "B3.2",
          label: "Transport",
          slug: "ib-biology-new-b32-transport",
          misconceptions: [
            "The root pushes water up the xylem (the main pull comes from transpiration at the leaves; root pressure is minor).",
            "Arteries always carry oxygenated blood (the pulmonary artery carries deoxygenated blood to the lungs).",
            "Xylem and phloem both carry water upwards only (phloem is living tissue and translocates sugars from source to sink in either direction).",
          ],
          objectives: [
            "Explain how water is moved from root to leaf in the xylem",
            "Explain how sugars are translocated in the phloem",
            "Compare the structure and function of arteries, veins and capillaries",
          ],
          criteria: {
            "Explain how water is moved from root to leaf in the xylem": ["water evaporates from the mesophyll cell walls and diffuses out through the stomata", "this creates tension, or low pressure, at the top of the xylem", "cohesion between water molecules holds the column together so it is pulled up as one", "adhesion to the xylem walls and the narrow lignified vessels help support the column"],
            "Explain how sugars are translocated in the phloem": ["sucrose is actively loaded into the phloem at a source such as a photosynthesising leaf", "this lowers the water potential, so water follows by osmosis and raises the hydrostatic pressure", "the pressure gradient pushes the contents along the sieve tubes to a sink", "at the sink sucrose is unloaded and used or stored, which is why flow can go either way"],
            "Compare the structure and function of arteries, veins and capillaries": ["arteries carry blood away from the heart at high pressure and have thick muscular elastic walls and a narrow lumen", "veins return blood at low pressure with thinner walls, a wide lumen and valves to prevent backflow", "capillaries have walls one cell thick and are permeable, so exchange with tissues occurs"],
          },
        },
        {
          id: "b3-3-muscle-motility",
          code: "B3.3",
          label: "Muscle and motility (HL only)",
          slug: "ib-biology-new-b33-muscle-and-motility-hl",
          misconceptions: [
            "The actin and myosin filaments shorten during contraction (the filaments keep their length and slide past each other, so the sarcomere shortens).",
            "ATP is used only to pull the filaments together (ATP is also needed to detach myosin from actin, which is why muscle stiffens after death).",
            "A single muscle can both bend and straighten a joint (muscles only pull, so antagonistic pairs are needed to move a joint in both directions).",
          ],
          objectives: [
            "Explain muscle contraction using the sliding filament model",
            "Describe the roles of calcium ions and ATP in the contraction cycle",
            "Explain why skeletal muscles must act in antagonistic pairs",
          ],
          criteria: {
            "Explain muscle contraction using the sliding filament model": ["a sarcomere runs between two Z discs and contains thin actin and thick myosin filaments", "myosin heads bind to actin, forming cross bridges, and then pivot to pull the actin inwards", "the filaments do not change length; they slide over each other so the sarcomere shortens", "the light band and the distance between Z discs shorten while the dark band stays the same width"],
            "Describe the roles of calcium ions and ATP in the contraction cycle": ["a nerve impulse causes calcium ions to be released from the sarcoplasmic reticulum", "calcium binds to troponin, moving tropomyosin off the binding sites on actin", "ATP hydrolysis cocks the myosin head and provides energy for the power stroke", "binding a new ATP molecule releases the myosin head from actin so the cycle can repeat"],
            "Explain why skeletal muscles must act in antagonistic pairs": ["a muscle can only exert force by contracting and pulling, not by pushing", "one muscle of the pair contracts while the other relaxes and is stretched", "the second muscle contracts to return the bone to its original position", "one example, such as the biceps and triceps at the elbow"],
          },
        },
        {
          id: "b4-1-adaptation",
          code: "B4.1",
          label: "Adaptation to environment",
          slug: "ib-biology-new-b41-adaptation-to-environment",
          misconceptions: [
            "Organisms develop the adaptations they need because they want or try to (adaptations arise from variation and natural selection over generations).",
            "A species can survive anywhere if the temperature suits it (each species has a range of tolerance for several abiotic factors at once).",
            "Cacti have spines mainly for defence (the reduced leaves also greatly cut the surface area for water loss).",
          ],
          objectives: [
            "Explain how abiotic factors determine which species live in an area",
            "Describe adaptations of plants to arid conditions",
            "Describe adaptations of animals to very cold environments",
          ],
          criteria: {
            "Explain how abiotic factors determine which species live in an area": ["each species has a range of tolerance for factors such as temperature, water, light and salinity", "growth and reproduction are best near the optimum and fall towards the limits of the range", "outside the limits of tolerance the species cannot survive there", "the combination of abiotic factors in a region gives it its characteristic biome and community"],
            "Describe adaptations of plants to arid conditions": ["reduced leaves or spines, cutting the surface area for transpiration", "a thick waxy cuticle and sunken or few stomata to slow water loss", "water storage in succulent stems or leaves", "deep or wide spreading roots to reach scarce water"],
            "Describe adaptations of animals to very cold environments": ["a thick layer of fur or blubber for insulation", "a large body size and small extremities, reducing the surface area to volume ratio", "countercurrent heat exchange in the limbs to keep the core warm", "behaviour such as huddling, migration or hibernation"],
          },
        },
        {
          id: "b4-2-ecological-niches",
          code: "B4.2",
          label: "Ecological niches",
          slug: "ib-biology-new-b42-ecological-niches",
          misconceptions: [
            "A niche is just the place where an organism lives (the habitat is the place; the niche is the whole role, including food, conditions and interactions).",
            "Two species can share an identical niche indefinitely (competitive exclusion means one will out-compete the other unless the niches diverge).",
            "All plants are autotrophs and all animals are heterotrophs (some plants are parasitic and some organisms, such as Euglena, are mixotrophic).",
          ],
          objectives: [
            "Explain what is meant by the ecological niche of a species",
            "Distinguish the fundamental niche from the realised niche",
            "Compare autotrophic, heterotrophic and mixotrophic nutrition",
          ],
          criteria: {
            "Explain what is meant by the ecological niche of a species": ["the niche is the role of a species in its community, not simply its habitat", "it includes the abiotic conditions the species can tolerate", "it includes how it obtains food and its interactions with other species", "no two species in a community can occupy exactly the same niche for long"],
            "Distinguish the fundamental niche from the realised niche": ["the fundamental niche is the full range of conditions and resources a species could use", "the realised niche is the part it actually occupies in the presence of other species", "the realised niche is smaller because competition, predation or disease restrict it"],
            "Compare autotrophic, heterotrophic and mixotrophic nutrition": ["autotrophs make their own organic compounds from inorganic sources, using light or chemical energy", "heterotrophs obtain organic compounds by taking them in from other organisms", "mixotrophs can do both, using one mode or the other as conditions allow", "one example of each, such as a grass, a lion and Euglena"],
          },
        },
      ],
    },
    {
      id: "c-interaction",
      label: "C - Interaction and Interdependence",
      topics: [
        {
          id: "c1-1-enzymes",
          code: "C1.1",
          label: "Enzymes and metabolism",
          slug: "ib-biology-new-c11-enzymes-and-metabolism",
          misconceptions: [
            "Enzymes are used up in the reaction they catalyse (they are unchanged and can be reused many times).",
            "Enzymes are killed when they denature (enzymes are not alive; the shape of the active site is lost).",
            "Raising the temperature always speeds up an enzyme reaction (above the optimum the enzyme denatures and the rate falls sharply).",
          ],
          objectives: [
            "Explain enzyme specificity in terms of the active site and the substrate",
            "Explain the effect of temperature and pH on the rate of an enzyme reaction",
            "Distinguish anabolic from catabolic reactions",
          ],
          criteria: {
            "Explain enzyme specificity in terms of the active site and the substrate": ["the active site is a small region whose shape and chemistry are set by the tertiary structure", "only a substrate with a complementary shape can bind to form an enzyme substrate complex", "binding induces a slight change in the active site that stresses the bonds in the substrate", "the enzyme lowers the activation energy and is left unchanged, so it can be reused"],
            "Explain the effect of temperature and pH on the rate of an enzyme reaction": ["raising the temperature gives molecules more kinetic energy, so successful collisions are more frequent", "above the optimum the bonds holding the tertiary structure break and the active site is denatured", "each enzyme has an optimum pH at which the rate is highest", "away from the optimum pH the charges on R groups change, the active site distorts and the rate falls"],
            "Distinguish anabolic from catabolic reactions": ["anabolic reactions build larger molecules from smaller ones and require energy", "catabolic reactions break larger molecules down into smaller ones and release energy", "one example of each, such as protein synthesis and digestion or respiration", "metabolism is the sum of all these enzyme catalysed reactions in the cell"],
          },
        },
        {
          id: "c1-2-cell-respiration",
          code: "C1.2",
          label: "Cell respiration",
          slug: "ib-biology-new-c12-cell-respiration",
          misconceptions: [
            "Respiration is the same as breathing.",
            "Plants do not respire, they only photosynthesise.",
            "Anaerobic respiration produces more ATP than aerobic (aerobic yields far more per glucose).",
            "Oxygen is needed for glycolysis.",
          ],
          objectives: [
            "Describe the role of ATP as the cell's energy currency",
            "Explain why anaerobic respiration yields less ATP than aerobic",
            "Outline the effect of temperature on the rate of respiration",
          ],
          criteria: {
            "Describe the role of ATP as the cell's energy currency": ["ATP releases energy when it is hydrolysed to ADP and phosphate", "energy from respiration is used to remake ATP from ADP", "ATP powers processes such as active transport and muscle contraction"],
            "Explain why anaerobic respiration yields less ATP than aerobic": ["anaerobic respiration only completes glycolysis", "glucose is not fully oxidised, so most of its energy stays in lactate or ethanol", "aerobic respiration uses oxygen to break glucose down fully to carbon dioxide and water, making far more ATP"],
            "Outline the effect of temperature on the rate of respiration": ["rate rises with temperature because molecules move faster and collide more", "enzymes work faster up to an optimum", "above the optimum enzymes denature and the rate falls"],
          },
        },
        {
          id: "c1-3-photosynthesis",
          code: "C1.3",
          label: "Photosynthesis",
          slug: "ib-biology-new-c13-photosynthesis",
          misconceptions: [
            "Plants get most of their mass from the soil (most comes from CO2).",
            "The oxygen released comes from CO2 (it comes from the splitting of water).",
            "Photosynthesis happens only in the day and respiration only at night (respiration runs all the time).",
          ],
          objectives: [
            "Explain why plants appear green in terms of light absorption",
            "Describe the role of water in the light-dependent reactions",
          ],
          criteria: {
            "Explain why plants appear green in terms of light absorption": ["chlorophyll absorbs red and blue light", "green light is reflected or transmitted rather than absorbed", "the reflected green light is what we see"],
            "Describe the role of water in the light-dependent reactions": ["water is split using light energy (photolysis)", "it supplies electrons to replace those lost by chlorophyll", "oxygen is released as a by-product"],
          },
        },
        {
          id: "c2-1-chemical-signalling",
          code: "C2.1",
          label: "Chemical signalling (HL only)",
          slug: "ib-biology-new-c21-chemical-signalling-hl",
          misconceptions: [
            "A hormone in the blood reaches every cell, so it affects every cell (only cells with the matching receptor can respond).",
            "All hormones enter the target cell to work (peptide hormones bind receptors on the outside of the membrane and act through a second messenger).",
            "A stronger response always means more hormone molecules arrived (a transduction cascade amplifies a very small signal into a large response).",
          ],
          objectives: [
            "Distinguish hormones that bind surface receptors from those that enter the cell",
            "Explain how a signal transduction cascade amplifies a chemical signal",
            "Explain why a chemical signal affects only certain target cells",
          ],
          criteria: {
            "Distinguish hormones that bind surface receptors from those that enter the cell": ["peptide and protein hormones are hydrophilic and cannot cross the phospholipid bilayer", "they bind receptors in the plasma membrane and act through a second messenger such as cyclic AMP", "steroid hormones are hydrophobic and pass through the membrane to intracellular receptors", "the steroid receptor complex acts in the nucleus as a transcription factor, so responses are slower but longer lasting"],
            "Explain how a signal transduction cascade amplifies a chemical signal": ["binding of the hormone changes the shape of the receptor and activates a protein inside the cell", "this activates an enzyme that produces many molecules of a second messenger", "each activated enzyme in the chain activates many molecules of the next, so numbers multiply at each step", "a few hormone molecules can therefore alter millions of molecules in the cell, as with epinephrine and glycogen breakdown"],
            "Explain why a chemical signal affects only certain target cells": ["a cell can only respond if it has a receptor with a binding site complementary to the signal", "the fit between the signal and the receptor is specific, like an enzyme and its substrate", "cells without the receptor are exposed to the signal but do not respond", "the same signal can produce different responses where the transduction pathways inside cells differ"],
          },
        },
        {
          id: "c2-2-neural-signalling",
          code: "C2.2",
          label: "Neural signalling",
          slug: "ib-biology-new-c22-neural-signalling",
          misconceptions: [
            "The nerve impulse is a flow of electricity along the axon like a wire (it is a wave of depolarisation caused by ions moving across the membrane).",
            "A stronger stimulus makes a bigger action potential (action potentials are all or nothing; a stronger stimulus raises their frequency).",
            "Impulses can travel in either direction across a synapse (vesicles of neurotransmitter are only in the presynaptic neuron, so transmission is one way).",
          ],
          objectives: [
            "Explain how the resting potential is maintained across the axon membrane",
            "Describe the events of an action potential",
            "Explain how a signal crosses a chemical synapse",
          ],
          criteria: {
            "Explain how the resting potential is maintained across the axon membrane": ["sodium potassium pumps use ATP to move three sodium ions out for every two potassium ions in", "this makes the inside of the axon negative relative to the outside, at about minus 70 millivolts", "the membrane is more permeable to potassium, which leaks out and keeps the inside negative", "negatively charged proteins inside the axon add to the imbalance"],
            "Describe the events of an action potential": ["a stimulus that reaches the threshold opens voltage gated sodium channels", "sodium ions rush in and the membrane depolarises to about plus 40 millivolts", "sodium channels close and potassium channels open, so potassium leaves and the membrane repolarises", "the sodium potassium pump restores the resting potential, and during the refractory period no new impulse can start"],
            "Explain how a signal crosses a chemical synapse": ["depolarisation of the presynaptic membrane opens calcium channels and calcium ions enter", "vesicles fuse with the membrane and release neurotransmitter into the synaptic cleft by exocytosis", "the neurotransmitter diffuses across and binds receptors on the postsynaptic membrane, opening ion channels", "the neurotransmitter is then broken down or reabsorbed, so the response stops"],
          },
        },
        {
          id: "c3-1-integration-body-systems",
          code: "C3.1",
          label: "Integration of body systems",
          slug: "ib-biology-new-c31-integration-of-body-systems",
          misconceptions: [
            "The brain has to decide before a reflex happens (the reflex arc passes through the spinal cord, and the brain is informed afterwards).",
            "Hormones act faster than nerves because they travel in the blood (nervous transmission is much faster and far more localised).",
            "Negative feedback keeps a variable perfectly constant (it corrects departures, so the variable fluctuates around a set point).",
          ],
          objectives: [
            "Describe the pathway of a reflex arc",
            "Compare nervous and hormonal communication",
            "Explain how negative feedback keeps a variable near a set point",
          ],
          criteria: {
            "Describe the pathway of a reflex arc": ["a receptor detects the stimulus and starts an impulse in a sensory neuron", "the impulse passes to a relay neuron in the spinal cord without waiting for the brain", "a motor neuron carries the impulse to an effector, a muscle or a gland", "the effector produces the response, which is rapid and involuntary"],
            "Compare nervous and hormonal communication": ["nerves carry electrical impulses along neurons while hormones travel dissolved in the blood", "nervous responses are very fast and short lived, hormonal responses are slower and longer lasting", "nerve signals are directed to specific cells, whereas hormones reach all cells but affect only those with receptors", "the two systems are linked, for example by the hypothalamus and the pituitary gland"],
            "Explain how negative feedback keeps a variable near a set point": ["a receptor detects a change away from the set point", "a control centre compares the value with the norm and signals to effectors", "the effectors act to reverse the change and bring the variable back", "because correction only follows a departure, the variable oscillates around the set point rather than staying fixed"],
          },
        },
        {
          id: "c3-2-defence-against-disease",
          code: "C3.2",
          label: "Defence against disease",
          slug: "ib-biology-new-c32-defense-against-disease",
          misconceptions: [
            "Antibodies kill pathogens directly (they mark, clump or neutralise pathogens so that phagocytes and other mechanisms destroy them).",
            "A vaccine gives you the disease it protects against (it contains a weakened, killed or partial antigen that cannot cause the illness).",
            "Antibiotic resistance develops because a person's body gets used to the drug (resistant bacteria are selected for and multiply).",
          ],
          objectives: [
            "Describe the primary defences that keep pathogens out of the body",
            "Explain how the specific immune response produces antibodies",
            "Explain how vaccination gives long-lasting immunity",
          ],
          criteria: {
            "Describe the primary defences that keep pathogens out of the body": ["the skin acts as a physical barrier of tough dead cells", "mucous membranes trap pathogens in sticky mucus in the airways and gut", "chemical defences such as stomach acid, lysozyme in tears and sebum on the skin", "blood clotting seals wounds, so pathogens cannot enter through cuts"],
            "Explain how the specific immune response produces antibodies": ["a macrophage engulfs the pathogen and presents its antigen", "the helper T cell with a matching receptor is activated and stimulates the matching B cell", "the selected B cell divides by mitosis to form a clone of identical cells", "plasma cells secrete large numbers of antibodies specific to that antigen"],
            "Explain how vaccination gives long-lasting immunity": ["a vaccine contains a weakened, killed or fragmentary form of the pathogen carrying its antigen", "this triggers a primary response without causing the disease", "memory cells specific to that antigen remain in the body afterwards", "on a real infection the secondary response is faster and larger, so the pathogen is destroyed before symptoms appear"],
          },
        },
        {
          id: "c4-1-populations-communities",
          code: "C4.1",
          label: "Populations and communities",
          slug: "ib-biology-new-c41-populations-and-communities",
          misconceptions: [
            "Population growth slows because organisms stop reproducing (the birth rate falls and the death rate rises as limiting factors bite).",
            "Carrying capacity is a fixed number for a habitat (it changes as resources and conditions change).",
            "Predators wipe out their prey (predator and prey numbers usually cycle, since falling prey numbers reduce the predators).",
          ],
          objectives: [
            "Explain the shape of a sigmoid population growth curve",
            "Describe the density-dependent factors that limit population size",
            "Compare competition, predation and mutualism as interactions",
          ],
          criteria: {
            "Explain the shape of a sigmoid population growth curve": ["in the exponential phase resources are plentiful, so the birth rate far exceeds the death rate", "in the transitional phase limiting factors begin to act and growth slows", "in the plateau phase the birth rate roughly equals the death rate and numbers level off", "the plateau is the carrying capacity, the largest population the environment can support"],
            "Describe the density-dependent factors that limit population size": ["competition for food, water, light or space increases as density rises", "predation increases because predators find prey more easily when prey are crowded", "disease and parasites spread more readily between crowded individuals", "accumulation of waste or toxins can also raise the death rate"],
            "Compare competition, predation and mutualism as interactions": ["in competition both species are harmed as they use the same limited resource", "in predation one species benefits by killing and eating the other, which is harmed", "in mutualism both species benefit from the association", "one example of each, such as two plants competing for light, a lion and a zebra, and root nodule bacteria in a legume"],
          },
        },
        {
          id: "c4-2-energy-matter-transfer",
          code: "C4.2",
          label: "Transfer of energy and matter",
          slug: "ib-biology-new-c42-transfer-of-energy-and-matter",
          misconceptions: [
            "Energy is recycled in an ecosystem in the same way as nutrients (energy flows through and is lost as heat; only matter is recycled).",
            "The top predator has the most energy because it eats everything below it (energy is lost at each transfer, so top levels hold the least).",
            "Decomposers are a separate food chain that does not matter (they release the nutrients that producers need, so without them the cycle stops).",
          ],
          objectives: [
            "Explain why energy is lost between trophic levels",
            "Distinguish the flow of energy from the cycling of nutrients",
            "Describe the role of decomposers in an ecosystem",
          ],
          criteria: {
            "Explain why energy is lost between trophic levels": ["much of the energy taken in is released as heat during cell respiration", "not all of the organism at one level is eaten or is digestible, so some energy passes out in faeces", "energy is also lost in excretion and in dead material", "roughly a tenth of the energy passes on, which is why food chains rarely have more than four or five levels"],
            "Distinguish the flow of energy from the cycling of nutrients": ["energy enters as sunlight, passes along the chain and leaves as heat, so it flows in one direction", "energy must be continually resupplied by the sun", "chemical elements such as carbon and nitrogen are passed on and returned to the environment", "the same atoms are used again by producers, so matter cycles within the ecosystem"],
            "Describe the role of decomposers in an ecosystem": ["decomposers such as bacteria and fungi feed on dead organisms and waste", "they digest the organic matter, often by secreting enzymes onto it", "this releases inorganic nutrients such as nitrates and carbon dioxide back into the soil and air", "producers take these nutrients up again, so the ecosystem keeps functioning"],
          },
        },
      ],
    },
    {
      id: "d-continuity-change",
      label: "D - Continuity and Change",
      topics: [
        {
          id: "d1-1-dna-replication",
          code: "D1.1",
          label: "DNA replication",
          slug: "ib-biology-new-d11-dna-replication",
          misconceptions: [
            "Each new DNA molecule is made entirely of new nucleotides (replication is semi-conservative, so every molecule keeps one parent strand).",
            "DNA polymerase separates the two strands (helicase unwinds and separates them; polymerase adds the new nucleotides).",
            "New nucleotides can be added at either end of a growing strand (polymerase can only add to the 3 prime end, which is why one strand is made in fragments).",
          ],
          objectives: [
            "Explain why DNA replication is described as semi-conservative",
            "Describe the roles of helicase and DNA polymerase in replication",
            "Outline how the polymerase chain reaction amplifies a sample of DNA",
          ],
          criteria: {
            "Explain why DNA replication is described as semi-conservative": ["the two strands of the original molecule separate, and each acts as a template", "complementary base pairing decides which nucleotide is added opposite each base", "each daughter molecule contains one original strand and one newly made strand", "this conserves the base sequence, so the two daughter molecules are identical to the parent"],
            "Describe the roles of helicase and DNA polymerase in replication": ["helicase unwinds the double helix and breaks the hydrogen bonds between the bases", "DNA polymerase adds free nucleotides to the template strand following complementary base pairing", "it forms the covalent bonds of the sugar phosphate backbone between adjacent nucleotides", "it works in one direction only, so one strand is made continuously and the other in fragments"],
            "Outline how the polymerase chain reaction amplifies a sample of DNA": ["heating to about 95 degrees Celsius separates the two strands", "cooling allows short primers to bind to the target sequence at each end", "a heat stable DNA polymerase such as Taq extends the primers to copy the region", "the cycle is repeated many times, so the number of copies roughly doubles each cycle"],
          },
        },
        {
          id: "d1-2-protein-synthesis",
          code: "D1.2",
          label: "Protein synthesis",
          slug: "ib-biology-new-d12-protein-synthesis",
          misconceptions: [
            "Transcription copies the whole chromosome (only the gene being expressed is transcribed).",
            "The mRNA codon binds directly to the amino acid (it binds the anticodon of a tRNA, and the tRNA carries the amino acid).",
            "A degenerate genetic code means the code is ambiguous (each codon still specifies only one amino acid; several codons can share an amino acid).",
          ],
          objectives: [
            "Describe transcription and the role of RNA polymerase",
            "Explain how the genetic code is read during translation",
            "Explain what is meant by a universal and degenerate genetic code",
          ],
          criteria: {
            "Describe transcription and the role of RNA polymerase": ["RNA polymerase binds to a promoter and separates the two DNA strands", "one strand acts as a template, and free RNA nucleotides pair with its bases, with uracil opposite adenine", "the polymerase links the nucleotides into a single stranded mRNA molecule", "transcription happens in the nucleus, and the mRNA then leaves through a nuclear pore"],
            "Explain how the genetic code is read during translation": ["the mRNA is read in non-overlapping groups of three bases called codons", "a ribosome moves along the mRNA one codon at a time", "a tRNA with the complementary anticodon brings the amino acid specified by that codon", "peptide bonds join the amino acids in order until a stop codon is reached"],
            "Explain what is meant by a universal and degenerate genetic code": ["universal means almost all organisms use the same codons for the same amino acids", "this is evidence of common ancestry and allows genes to be transferred between species", "degenerate means most amino acids are coded for by more than one codon", "a degenerate code means some base substitutions do not change the amino acid, so the protein is unaffected"],
          },
        },
        {
          id: "d1-3-mutations-gene-editing",
          code: "D1.3",
          label: "Mutations and gene editing",
          slug: "ib-biology-new-d13-mutations-and-gene-editing",
          misconceptions: [
            "All mutations are harmful (most have no effect, and a few are beneficial and provide the variation on which selection acts).",
            "A mutation in a body cell can be passed to a child (only mutations in gametes or the cells that make them are inherited).",
            "Mutations happen because an organism needs them (they arise at random, and the environment then selects among them).",
          ],
          objectives: [
            "Explain why a base substitution may have a large effect or none at all",
            "Distinguish somatic from germline mutations",
            "Outline how gene editing with CRISPR works",
          ],
          criteria: {
            "Explain why a base substitution may have a large effect or none at all": ["a substitution changes one base, so at most one codon is altered", "because the code is degenerate, the new codon may still specify the same amino acid, so nothing changes", "a changed amino acid may alter the folding and so the shape of the protein, as in sickle cell anaemia", "the effect is greatest when the change is in an active site or produces a premature stop codon"],
            "Distinguish somatic from germline mutations": ["a somatic mutation occurs in a body cell and is passed only to that cell's descendants", "a germline mutation occurs in a gamete or its precursor and can be inherited by offspring", "somatic mutations can cause conditions such as cancer in the individual but disappear when the individual dies", "germline mutations are present in every cell of the offspring and can spread through a population"],
            "Outline how gene editing with CRISPR works": ["a short guide RNA is designed to be complementary to the target sequence in the genome", "the guide RNA directs an enzyme such as Cas9 to that exact site", "the enzyme cuts both strands of the DNA at that point", "the cell's repair mechanisms then disable the gene or insert a new sequence supplied by the researcher"],
          },
        },
        {
          id: "d2-1-cell-division",
          code: "D2.1",
          label: "Cell and nuclear division",
          slug: "ib-biology-new-d21-cell-and-nuclear-division",
          misconceptions: [
            "Chromosomes are copied during mitosis (DNA is replicated in interphase, before mitosis begins).",
            "Mitosis is the same as cell division (mitosis divides the nucleus; cytokinesis divides the cytoplasm).",
            "Meiosis produces four identical cells (crossing over and independent assortment make all four genetically different).",
          ],
          objectives: [
            "Outline the events of the cell cycle",
            "Explain how meiosis produces genetically different gametes",
            "Explain how uncontrolled cell division leads to a tumour",
          ],
          criteria: {
            "Outline the events of the cell cycle": ["interphase is the longest stage, in which the cell grows and makes proteins and organelles", "DNA is replicated during the S phase of interphase, so each chromosome becomes two sister chromatids", "mitosis divides the nucleus into two genetically identical nuclei", "cytokinesis divides the cytoplasm, producing two daughter cells"],
            "Explain how meiosis produces genetically different gametes": ["crossing over in prophase I exchanges sections of DNA between homologous chromosomes", "independent assortment means each pair of homologous chromosomes lines up independently, giving many combinations", "two divisions halve the chromosome number, so the gametes are haploid", "random fertilisation then combines two different gametes, adding further variation"],
            "Explain how uncontrolled cell division leads to a tumour": ["the cell cycle is normally controlled by checkpoints and by regulatory genes", "mutations in these genes, caused by mutagens such as radiation or carcinogens, can remove the controls", "the affected cell divides repeatedly without stopping, forming a mass of cells", "a malignant tumour invades nearby tissue and cells may spread to form secondary tumours"],
          },
        },
        {
          id: "d2-2-gene-expression",
          code: "D2.2",
          label: "Gene expression (HL only)",
          slug: "ib-biology-new-d22-gene-expression-hl",
          misconceptions: [
            "Every gene in a cell is being transcribed all the time (only a small fraction of genes is expressed in any one cell at any one time).",
            "Epigenetic changes alter the base sequence of the gene (methylation and histone modification change accessibility, not the sequence).",
            "Identical twins must be identical in every trait (differences in gene expression caused by environment and epigenetic marks produce differences).",
          ],
          objectives: [
            "Explain how transcription factors control which genes are expressed",
            "Describe how methylation and histone modification affect gene expression",
            "Explain how the environment can change a phenotype without changing the genes",
          ],
          criteria: {
            "Explain how transcription factors control which genes are expressed": ["a transcription factor is a protein that binds to a specific sequence of DNA", "binding at a promoter or a regulatory sequence helps or prevents RNA polymerase starting transcription", "the factors present depend on the cell type and on signals such as hormones", "this is why cells with identical genomes make different sets of proteins"],
            "Describe how methylation and histone modification affect gene expression": ["adding methyl groups to cytosine bases in a promoter usually switches the gene off", "the DNA is wound around histones, and chemical changes to the histone tails alter how tightly it is packed", "acetylation loosens the packing, so the DNA is accessible and transcription can occur", "these marks can be retained when the cell divides and are potentially reversible"],
            "Explain how the environment can change a phenotype without changing the genes": ["environmental factors such as diet, temperature, stress or light can change which genes are expressed", "the base sequence stays the same, but epigenetic marks or transcription factors change", "the result is a different phenotype from the same genotype", "one example, such as coat colour in Siamese cats with temperature or the caste of a honeybee larva with diet"],
          },
        },
        {
          id: "d2-3-water-potential",
          code: "D2.3",
          label: "Water potential",
          slug: "ib-biology-new-d23-water-potential",
          misconceptions: [
            "Water moves from low water potential to high water potential (it moves down the gradient, from high to low).",
            "Adding solute raises the water potential of a solution (solutes lower it, so pure water at atmospheric pressure has the highest value of zero).",
            "A turgid plant cell keeps taking in water until it bursts (the cell wall generates pressure potential that stops net entry).",
          ],
          objectives: [
            "Explain how solute potential and pressure potential combine to give water potential",
            "Describe what happens to a plant cell placed in a hypotonic solution",
            "Explain why an animal cell bursts in pure water but a plant cell does not",
          ],
          criteria: {
            "Explain how solute potential and pressure potential combine to give water potential": ["water potential is the sum of the solute potential and the pressure potential", "adding solute lowers the solute potential, making it negative, so pure water has the highest water potential", "pressure exerted by a cell wall on the contents gives a positive pressure potential", "water moves by osmosis from a higher water potential to a lower water potential"],
            "Describe what happens to a plant cell placed in a hypotonic solution": ["the solution has a higher water potential than the cell contents", "water enters the cell by osmosis across the partially permeable membrane", "the vacuole and cytoplasm swell and push the membrane against the cell wall", "the wall resists, pressure potential rises until net entry stops and the cell is turgid"],
            "Explain why an animal cell bursts in pure water but a plant cell does not": ["in both cases water enters by osmosis because the outside water potential is higher", "the animal cell has only a plasma membrane, which cannot resist the increase in volume, so it lyses", "the plant cell wall is strong and inelastic, so it exerts an opposing pressure", "that pressure raises the water potential of the cell until it equals the outside and net entry stops"],
          },
        },
        {
          id: "d3-1-reproduction",
          code: "D3.1",
          label: "Reproduction",
          slug: "ib-biology-new-d31-reproduction",
          misconceptions: [
            "Pollination and fertilisation are the same event (pollination is the transfer of pollen; fertilisation is the later fusion of gametes).",
            "Asexual reproduction produces no variation at all (mutation can still occur, though there is no mixing of parental genes).",
            "Oestrogen and progesterone only act on the uterus (they also feed back to the pituitary gland to control FSH and LH).",
          ],
          objectives: [
            "Compare sexual and asexual reproduction",
            "Explain how hormones control the menstrual cycle",
            "Describe pollination, fertilisation and seed dispersal in flowering plants",
          ],
          criteria: {
            "Compare sexual and asexual reproduction": ["sexual reproduction involves the fusion of two haploid gametes, usually from two parents", "asexual reproduction involves one parent and mitosis, so offspring are genetically identical clones", "sexual reproduction produces variation, which helps a population adapt to a changing environment", "asexual reproduction is faster and needs no mate, which suits a stable environment"],
            "Explain how hormones control the menstrual cycle": ["FSH from the pituitary gland stimulates a follicle to develop and to secrete oestrogen", "rising oestrogen thickens the uterus lining and triggers a surge of LH", "the LH surge causes ovulation and the follicle becomes a corpus luteum secreting progesterone", "progesterone maintains the lining and inhibits FSH and LH; if no embryo implants it falls and menstruation follows"],
            "Describe pollination, fertilisation and seed dispersal in flowering plants": ["pollination is the transfer of pollen from an anther to a stigma, by wind or by an animal", "a pollen tube grows down the style so that a male gamete reaches the ovule and fuses with the egg", "the fertilised ovule becomes a seed and the ovary becomes a fruit", "dispersal carries the seed away from the parent, reducing competition and spreading the species"],
          },
        },
        {
          id: "d3-2-inheritance",
          code: "D3.2",
          label: "Inheritance",
          slug: "ib-biology-new-d32-inheritance",
          misconceptions: [
            "A dominant allele is always the most common allele in a population (dominance describes how an allele is expressed, not how frequent it is).",
            "Carriers of a recessive condition show mild symptoms (a heterozygote has one working allele and is normally unaffected).",
            "A father passes his haemophilia allele to his sons (the allele is on the X chromosome, so his sons receive his Y and his daughters become carriers).",
          ],
          objectives: [
            "Distinguish genotype from phenotype using dominant and recessive alleles",
            "Explain why sex-linked recessive conditions are more common in males",
            "Explain how codominance differs from complete dominance",
          ],
          criteria: {
            "Distinguish genotype from phenotype using dominant and recessive alleles": ["the genotype is the pair of alleles an organism carries for a gene", "the phenotype is the observable characteristic that results", "a dominant allele is expressed in the phenotype whenever it is present", "a recessive allele is only expressed when both alleles are recessive, so two different genotypes can give the same phenotype"],
            "Explain why sex-linked recessive conditions are more common in males": ["the gene is carried on the X chromosome and has no equivalent on the shorter Y chromosome", "a male has only one X, so a single recessive allele is expressed in his phenotype", "a female needs two copies of the recessive allele to be affected, which is much less likely", "a heterozygous female is an unaffected carrier who can pass the allele to her children"],
            "Explain how codominance differs from complete dominance": ["with complete dominance the heterozygote looks the same as the homozygous dominant", "with codominance both alleles are expressed, so the heterozygote shows both characteristics", "codominant alleles are usually written as superscripts on a common capital letter", "one example, such as the AB blood group or roan coat colour in cattle"],
          },
        },
        {
          id: "d3-3-homeostasis",
          code: "D3.3",
          label: "Homeostasis",
          slug: "ib-biology-new-d33-homeostasis",
          misconceptions: [
            "Insulin converts glucose into energy (it lowers blood glucose by making cells take glucose up and store it as glycogen).",
            "Shivering and sweating are controlled by the skin itself (the hypothalamus detects the change in blood temperature and directs the response).",
            "Drinking a lot of water means the kidneys work harder to make more ADH (a dilute blood plasma means less ADH is released, not more).",
          ],
          objectives: [
            "Explain how insulin and glucagon control blood glucose concentration",
            "Describe how the body responds to a fall in core body temperature",
            "Explain how ADH regulates the water content of the blood",
          ],
          criteria: {
            "Explain how insulin and glucagon control blood glucose concentration": ["cells in the pancreas detect the concentration of glucose in the blood", "when glucose is high, insulin is secreted and makes liver and muscle cells take up glucose and store it as glycogen", "when glucose is low, glucagon is secreted and makes the liver break glycogen down and release glucose", "the two hormones have opposite effects and act by negative feedback to keep the level near a set point"],
            "Describe how the body responds to a fall in core body temperature": ["the hypothalamus detects the fall in the temperature of the blood", "vasoconstriction of skin arterioles reduces blood flow near the surface, so less heat is lost", "shivering makes muscles contract and release heat from respiration", "hairs are raised and metabolic rate increases, and behavioural responses add insulation"],
            "Explain how ADH regulates the water content of the blood": ["osmoreceptors in the hypothalamus detect a rise in the solute concentration of the blood", "the pituitary gland releases more ADH into the blood", "ADH makes the collecting duct of the nephron more permeable, so more water is reabsorbed", "a small volume of concentrated urine is produced, and when the blood is dilute less ADH is released"],
          },
        },
        {
          id: "d4-1-natural-selection",
          code: "D4.1",
          label: "Natural selection",
          slug: "ib-biology-new-d41-natural-selection",
          misconceptions: [
            "Bacteria become resistant because they are exposed to the antibiotic (resistant mutants already exist and the antibiotic selects them).",
            "Fitness means being the strongest or fastest (in biology fitness means leaving the most offspring that survive to reproduce).",
            "Natural selection always makes organisms better (it favours whatever suits current conditions, which may change).",
          ],
          objectives: [
            "Outline the conditions needed for natural selection to occur",
            "Explain how antibiotic resistance spreads in a bacterial population",
            "Distinguish natural selection from sexual selection",
          ],
          criteria: {
            "Outline the conditions needed for natural selection to occur": ["there must be variation between individuals in the population", "some of that variation must be heritable, caused by differences in alleles", "more offspring are produced than the environment can support, so there is competition", "individuals with advantageous variations survive and reproduce more, so those alleles become more frequent"],
            "Explain how antibiotic resistance spreads in a bacterial population": ["random mutation produces a few bacteria with resistance before the antibiotic is used", "the antibiotic is a selection pressure that kills the non resistant bacteria", "the resistant bacteria survive, reproduce rapidly and pass the allele to their offspring", "resistance genes can also be transferred between bacteria on plasmids, so it spreads between species"],
            "Distinguish natural selection from sexual selection": ["natural selection favours traits that improve survival and reproduction in the environment", "sexual selection favours traits that improve the chance of obtaining a mate", "a sexually selected trait can reduce survival, such as a peacock's tail, yet still spread", "sexual selection often produces differences in appearance between males and females"],
          },
        },
        {
          id: "d4-2-sustainability-change",
          code: "D4.2",
          label: "Sustainability and change",
          slug: "ib-biology-new-d42-sustainability-and-change",
          misconceptions: [
            "Adding fertiliser to a lake makes it healthier because plants grow (eutrophication leads to algal blooms, decomposition and oxygen depletion that kill fish).",
            "A pollutant at a safe concentration in water is safe for top predators (persistent pollutants accumulate and are magnified along the food chain).",
            "Sustainable use means never using a resource (it means using it no faster than it is replaced).",
          ],
          objectives: [
            "Explain what makes the use of a resource sustainable",
            "Explain how eutrophication damages an aquatic ecosystem",
            "Describe how a persistent pollutant becomes concentrated along a food chain",
          ],
          criteria: {
            "Explain what makes the use of a resource sustainable": ["the resource is harvested no faster than it is naturally replaced", "waste is produced no faster than the ecosystem can absorb or break it down", "the habitat and the species that depend on it are not damaged, so use can continue indefinitely", "one example, such as fishing quotas and net size limits or replanting harvested forest"],
            "Explain how eutrophication damages an aquatic ecosystem": ["nitrates and phosphates run off from fertilised land into the water", "the extra nutrients cause algae to grow rapidly and form a bloom at the surface", "the bloom blocks light, so plants below die, and dead material is decomposed by bacteria", "the bacteria respire aerobically and use up the dissolved oxygen, so fish and invertebrates suffocate"],
            "Describe how a persistent pollutant becomes concentrated along a food chain": ["the pollutant is not broken down or excreted, so it builds up in the tissues of an organism", "a consumer eats many prey organisms and takes in all of the pollutant they contained", "the concentration therefore increases at each trophic level, which is biomagnification", "top predators can reach harmful concentrations even where the water concentration is very low"],
          },
        },
        {
          id: "d4-3-climate-change",
          code: "D4.3",
          label: "Climate change",
          slug: "ib-biology-new-d43-climate-change",
          misconceptions: [
            "The greenhouse effect is itself harmful (the natural greenhouse effect keeps the Earth warm enough for life; the problem is its enhancement).",
            "The hole in the ozone layer is the cause of global warming (ozone depletion and the enhanced greenhouse effect are separate problems).",
            "Extra carbon dioxide is simply good for plants, so warming is harmless (other factors limit growth, and rapid warming disrupts ecosystems).",
          ],
          objectives: [
            "Explain the greenhouse effect in terms of radiation in the atmosphere",
            "Describe the evidence that human activity is causing recent warming",
            "Explain two consequences of climate change for living organisms",
          ],
          criteria: {
            "Explain the greenhouse effect in terms of radiation in the atmosphere": ["short wave radiation from the sun passes through the atmosphere and warms the Earth's surface", "the warmed surface re-emits energy as longer wave infrared radiation", "greenhouse gases such as carbon dioxide, methane and water vapour absorb this infrared radiation and re-radiate it", "more greenhouse gas means more energy retained, so the average surface temperature rises"],
            "Describe the evidence that human activity is causing recent warming": ["measured carbon dioxide concentrations have risen steadily since industrialisation", "ice cores show that current concentrations are far above the range of the last several hundred thousand years", "the rise matches the amount of fossil fuel burned and deforestation, and the carbon isotope signature points to fossil sources", "global mean temperatures have risen over the same period, in line with the physics of the greenhouse effect"],
            "Explain two consequences of climate change for living organisms": ["species ranges shift towards the poles or to higher altitudes as conditions change", "the timing of events such as flowering, breeding or migration shifts, so partners in a food chain fall out of step", "melting sea ice and permafrost destroy habitat for species such as polar bears", "warmer and more acidic oceans cause coral bleaching and make it harder for shelled organisms to build their shells"],
          },
        },
      ],
    },
  ],
};
