import type { Subject } from "../types";

/** IB Physics: guide for first assessment 2025, organised into themes A to E. Topic codes, labels and library slugs match RevisionDojo's resource library (read 13 Sep 2026). */
export const PHYSICS: Subject = {
  id: "ib-physics",
  name: "Physics",
  short: "Phys",
  slug: "ib-physics-new",
  tint: "purple",
  units: [
    {
      id: "a-space-time-motion",
      label: "A - Space, time and motion",
      topics: [
        {
          id: "a1-kinematics",
          code: "A.1",
          label: "Kinematics",
          slug: "ib-physics-new-a1-kinematics",
          misconceptions: [
            "An object with zero velocity has zero acceleration (a ball at the top of its flight has zero velocity and acceleration g).",
            "Speed and velocity are the same (velocity has direction).",
            "Heavier objects fall faster in the absence of air resistance.",
          ],
          objectives: [
            "Distinguish distance from displacement and speed from velocity",
            "Explain what the gradient and area under a velocity-time graph represent",
          ],
          criteria: {
            "Distinguish distance from displacement and speed from velocity": ["distance is a scalar, the total path length", "displacement is a vector from start to finish with a direction", "speed is distance over time; velocity is displacement over time, so it has a direction"],
            "Explain what the gradient and area under a velocity-time graph represent": ["the gradient is the acceleration", "the area under the graph is the displacement", "a negative gradient means negative acceleration; the object only slows down if that acceleration opposes its velocity"],
          },
        },
        {
          id: "a2-forces",
          code: "A.2",
          label: "Forces and momentum",
          slug: "ib-physics-new-a2-forces-and-momentum",
          misconceptions: [
            "A moving object must have a force acting on it in the direction of motion (Newton's first law says no net force is needed).",
            "Momentum and kinetic energy are the same, or kinetic energy is always conserved in collisions (momentum is conserved; kinetic energy only in elastic collisions).",
            "The action and reaction forces of Newton's third law act on the same object and cancel.",
          ],
          objectives: [
            "Explain Newton's first law in terms of balanced forces",
            "Explain why momentum is conserved in a collision",
            "Describe the difference between mass and weight",
          ],
          criteria: {
            "Explain Newton's first law in terms of balanced forces": ["an object keeps its velocity unless a resultant force acts", "balanced forces mean zero resultant force", "so rest or constant velocity continues"],
            "Explain why momentum is conserved in a collision": ["the objects exert equal and opposite forces on each other for the same time (Newton's third law)", "so their changes in momentum (impulses) are equal and opposite", "momentum lost by one equals momentum gained by the other when no external force acts"],
            "Describe the difference between mass and weight": ["mass is the amount of matter, a scalar in kilograms, the same everywhere", "weight is the gravitational force on a mass, a vector in newtons", "weight equals mass times gravitational field strength, so it changes with g"],
          },
        },
        {
          id: "a3-work-energy-power",
          code: "A.3",
          label: "Work, energy and power",
          slug: "ib-physics-new-a3-work-energy-and-power",
          misconceptions: [
            "Carrying a heavy bag horizontally does work on it (the force is vertical and the displacement horizontal, so the work done by that force is zero).",
            "Energy is used up or destroyed by friction (it is transferred to the internal energy of the surroundings, which is harder to use).",
            "A machine with a large power output must be more efficient (power is energy transferred per second; efficiency is the useful fraction of the input).",
          ],
          objectives: [
            "Explain what is meant by the work done by a force",
            "Explain the principle of conservation of energy for a falling object",
            "Distinguish power from efficiency in an energy transfer",
          ],
          criteria: {
            "Explain what is meant by the work done by a force": ["work is energy transferred when a force moves its point of application", "only the component of the force along the displacement does work", "a force perpendicular to the motion does no work, such as the tension in a string for circular motion"],
            "Explain the principle of conservation of energy for a falling object": ["energy cannot be created or destroyed, only transferred between stores", "gravitational potential energy is transferred to kinetic energy as the object falls", "with no resistive forces the total of the two stays constant, so the speed depends on the height dropped, not the mass"],
            "Distinguish power from efficiency in an energy transfer": ["power is the rate of energy transfer, energy transferred per unit time, measured in watts", "efficiency is the useful output energy or power divided by the total input", "efficiency is always less than one because some energy is transferred to the surroundings as internal energy"],
          },
        },
        {
          id: "a4-rigid-body",
          code: "A.4",
          label: "Rigid body mechanics (HL only)",
          slug: "ib-physics-new-a4-rigid-body-mechanics",
          misconceptions: [
            "A body in translational equilibrium cannot be rotating (zero resultant force still allows a couple, which gives a resultant torque).",
            "Moment of inertia is a fixed property of an object like mass (it depends on the axis chosen and on how the mass is distributed about it).",
            "Angular velocity and linear velocity are the same for all points on a rotating body (every point shares the angular velocity, but linear speed grows with distance from the axis).",
          ],
          objectives: [
            "Explain what the torque of a force about an axis depends on",
            "Explain the conditions for a rigid body to be in equilibrium",
            "Explain why angular momentum is conserved when no external torque acts",
          ],
          criteria: {
            "Explain what the torque of a force about an axis depends on": ["torque is the turning effect of a force about an axis", "it is the force multiplied by the perpendicular distance from the axis to the line of action", "a force whose line of action passes through the axis gives zero torque", "a couple is two equal antiparallel forces giving torque but no resultant force"],
            "Explain the conditions for a rigid body to be in equilibrium": ["the resultant force must be zero, so there is no linear acceleration", "the resultant torque about any axis must be zero, so there is no angular acceleration", "in equilibrium the body is at rest or moves with constant linear and angular velocity"],
            "Explain why angular momentum is conserved when no external torque acts": ["angular momentum is the moment of inertia multiplied by the angular velocity", "a resultant external torque is needed to change angular momentum, so with none it stays constant", "pulling mass closer to the axis lowers the moment of inertia, so the angular velocity rises, as for a spinning skater"],
          },
        },
        {
          id: "a5-relativity",
          code: "A.5",
          label: "Galilean and special relativity (HL only)",
          slug: "ib-physics-new-a5-galilean-and-special-relativity",
          misconceptions: [
            "Light from a moving source travels faster than light from a stationary one (all inertial observers measure the same speed of light in a vacuum).",
            "Time dilation is an illusion of the measuring clocks (the dilation is real for the observers; each inertial observer sees the other's clock running slow).",
            "Events simultaneous for one observer are simultaneous for all (simultaneity of separated events depends on the frame of reference).",
          ],
          objectives: [
            "Outline the two postulates of special relativity",
            "Explain what is meant by time dilation and length contraction",
            "Explain why simultaneity is relative to the observer",
          ],
          criteria: {
            "Outline the two postulates of special relativity": ["the laws of physics are the same in all inertial (non-accelerating) frames of reference", "the speed of light in a vacuum is the same for all inertial observers, whatever the motion of the source", "velocity addition as in Galilean relativity therefore fails at speeds close to that of light"],
            "Explain what is meant by time dilation and length contraction": ["proper time is the time between two events measured in the frame where they happen at the same place", "a moving clock is measured to run slow relative to an observer who sees it move", "proper length is measured where the object is at rest, and a moving object is measured shorter along its motion", "the effects become significant only as the speed approaches that of light, as shown by muons reaching the ground"],
            "Explain why simultaneity is relative to the observer": ["two events at different places judged simultaneous in one frame are not simultaneous in a frame moving relative to it", "this follows from the light from the events travelling at the same speed for every observer", "only the order of causally connected events is the same for all observers"],
          },
        },
      ],
    },
    {
      id: "b-particulate",
      label: "B - The particulate nature of matter",
      topics: [
        {
          id: "b1-thermal",
          code: "B.1",
          label: "Thermal energy transfers",
          slug: "ib-physics-new-b1-thermal-energy-transfers",
          misconceptions: [
            "Temperature measures the total heat in an object (it relates to average kinetic energy per particle).",
            "Cold is transferred from a cold object to a hot one.",
            "Metal feels colder than wood at the same temperature because it IS colder (it conducts heat from your hand faster).",
          ],
          objectives: [
            "Explain the difference between temperature and internal energy",
            "Explain why specific latent heat involves no temperature change",
          ],
          criteria: {
            "Explain the difference between temperature and internal energy": ["temperature measures the average kinetic energy of the particles", "internal energy is the total kinetic plus potential energy of all the particles", "so a large cold object can hold more internal energy than a small hot one"],
            "Explain why specific latent heat involves no temperature change": ["the energy goes into breaking or forming intermolecular bonds, potential energy", "the average kinetic energy, and so the temperature, stays constant", "specific latent heat is the energy per kilogram for the change of state"],
          },
        },
        {
          id: "b2-greenhouse",
          code: "B.2",
          label: "Greenhouse effect",
          slug: "ib-physics-new-b2-greenhouse-effect",
          misconceptions: [
            "The greenhouse effect is the same thing as the hole in the ozone layer (ozone depletion is a separate problem caused by other gases).",
            "Greenhouse gases block incoming sunlight (they are largely transparent to short wavelength solar radiation and absorb the longer wavelength infrared leaving the Earth).",
            "The greenhouse effect is entirely harmful (the natural effect keeps the Earth about 30 degrees warmer than it would otherwise be; the concern is the enhanced effect).",
          ],
          objectives: [
            "Explain how the greenhouse effect keeps the Earth's surface warm",
            "Describe how albedo and emissivity affect the energy balance of a planet",
            "Explain what is meant by the solar constant and the intensity reaching a surface",
          ],
          criteria: {
            "Explain how the greenhouse effect keeps the Earth's surface warm": ["the Sun is hot, so its radiation arrives mostly at short wavelengths that pass through the atmosphere", "the cooler Earth re-radiates at longer infrared wavelengths", "greenhouse gases, such as carbon dioxide or methane, absorb that infrared and re-emit it, some back to the surface", "raising their concentration raises the surface temperature until the outgoing power again balances the incoming power"],
            "Describe how albedo and emissivity affect the energy balance of a planet": ["albedo is the fraction of incident radiation reflected by a surface, so a higher albedo means less energy absorbed", "emissivity compares the power a surface radiates with that of a perfect black body at the same temperature", "in equilibrium the power absorbed equals the power radiated, which fixes the average surface temperature", "ice and cloud raise albedo, so melting ice lowers it and increases absorption"],
            "Explain what is meant by the solar constant and the intensity reaching a surface": ["intensity is the radiation power received per unit area", "the solar constant is the intensity of solar radiation arriving at the top of the atmosphere, about 1360 watts per square metre", "the average over the whole Earth is about a quarter of this, since the intercepting disc is a quarter of the sphere's area", "intensity falls with distance from the source and with the angle at which the radiation strikes the surface"],
          },
        },
        {
          id: "b3-gas-laws",
          code: "B.3",
          label: "Gas laws",
          slug: "ib-physics-new-b3-gas-laws",
          misconceptions: [
            "Gas pressure is caused by the particles pushing each other apart (it comes from collisions of particles with the container walls).",
            "The gas laws work with temperature in degrees Celsius (absolute temperature in kelvin must be used).",
            "Real gases obey the ideal gas law under all conditions (they deviate at high pressure and low temperature, where particle volume and intermolecular forces matter).",
          ],
          objectives: [
            "Explain gas pressure in terms of the kinetic model of an ideal gas",
            "Explain how the pressure of a fixed mass of gas depends on volume and temperature",
            "Outline the assumptions made about an ideal gas and when real gases depart from them",
          ],
          criteria: {
            "Explain gas pressure in terms of the kinetic model of an ideal gas": ["particles move randomly at a range of speeds and collide with the container walls", "each collision changes a particle's momentum, so the wall experiences a force", "pressure is the total force from these collisions per unit area of wall"],
            "Explain how the pressure of a fixed mass of gas depends on volume and temperature": ["at constant temperature pressure is inversely proportional to volume, as a smaller volume means more wall collisions", "at constant volume pressure is proportional to absolute temperature, as hotter particles hit harder and more often", "absolute temperature in kelvin is proportional to the average kinetic energy of the particles", "together these give pressure times volume equal to moles times the gas constant times absolute temperature"],
            "Outline the assumptions made about an ideal gas and when real gases depart from them": ["the particles have negligible volume compared with the container and exert no forces on each other except during collisions", "collisions are elastic and the time of a collision is negligible compared with the time between collisions", "real gases depart from this at high pressure, where particle volume matters, and at low temperature, where attractions matter"],
          },
        },
        {
          id: "b4-thermodynamics",
          code: "B.4",
          label: "Thermodynamics (HL only)",
          slug: "ib-physics-new-b4-thermodynamics",
          misconceptions: [
            "Work done on a gas always raises its temperature (in an isothermal compression the energy is transferred out as heating and the temperature is unchanged).",
            "Entropy of a system can never decrease (a system can lose entropy if the surroundings gain more, so the total never decreases).",
            "A heat engine could be perfectly efficient if friction were removed (some energy must always be rejected to a cold reservoir, so efficiency is limited by the two temperatures).",
          ],
          objectives: [
            "Explain the first law of thermodynamics as a statement of energy conservation",
            "Distinguish isothermal, adiabatic, isobaric and isovolumetric changes",
            "Explain the second law of thermodynamics in terms of entropy",
          ],
          criteria: {
            "Explain the first law of thermodynamics as a statement of energy conservation": ["the energy transferred to a gas by heating equals the increase in its internal energy plus the work it does", "work is done by the gas when it expands and on the gas when it is compressed", "for an ideal gas the internal energy depends only on the absolute temperature", "on a pressure against volume graph the work done is the area under the curve"],
            "Distinguish isothermal, adiabatic, isobaric and isovolumetric changes": ["an isothermal change happens at constant temperature, so the internal energy is unchanged and the heating equals the work done", "an adiabatic change transfers no energy by heating, so work done on the gas raises its internal energy and temperature", "an isobaric change happens at constant pressure, so the work done is the pressure times the change in volume", "an isovolumetric change happens at constant volume, so no work is done and all the energy transferred changes the internal energy"],
            "Explain the second law of thermodynamics in terms of entropy": ["entropy is a measure of the number of ways the particles can be arranged, so of the disorder of a system", "in any real process the total entropy of system plus surroundings increases, staying constant only if reversible", "this gives a direction to time and explains why energy spreads from hot to cold on its own", "no heat engine can turn all of the energy it takes from a hot reservoir into work"],
          },
        },
        {
          id: "b5-circuits",
          code: "B.5",
          label: "Current and circuits",
          slug: "ib-physics-new-b5-current-and-circuits",
          misconceptions: [
            "Current is used up as it goes round a circuit (current is the same at every point in a series loop; it is energy that is transferred).",
            "A battery supplies a constant current (it provides a roughly constant emf, and the current depends on the resistance of the circuit).",
            "All conductors obey Ohm's law (an ohmic conductor has constant resistance only at constant temperature; a filament lamp and a diode do not).",
          ],
          objectives: [
            "Explain what electric current and potential difference mean in a circuit",
            "Explain how resistance depends on the dimensions and material of a wire",
            "Compare how current and potential difference behave in series and parallel circuits",
          ],
          criteria: {
            "Explain what electric current and potential difference mean in a circuit": ["current is the rate of flow of charge, one ampere being one coulomb per second", "potential difference is the energy transferred from the charge per unit charge between two points", "emf is the energy the source gives each unit of charge; terminal potential difference is lower due to internal resistance", "electrons drift slowly, but the field that sets them moving is established almost instantly all round the circuit"],
            "Explain how resistance depends on the dimensions and material of a wire": ["resistance is the potential difference across a component divided by the current through it", "resistance is proportional to length and inversely proportional to cross-sectional area", "the constant of proportionality is the resistivity of the material", "raising the temperature of a metal increases its resistance because the lattice ions vibrate more and impede the electrons"],
            "Compare how current and potential difference behave in series and parallel circuits": ["in series the current is the same through every component and the potential differences add to the supply emf", "in parallel each branch has the same potential difference and the branch currents add to the total", "total resistance adds in series, while in parallel it is less than the smallest single resistance", "these follow from conservation of charge at a junction and conservation of energy round a loop"],
          },
        },
      ],
    },
    {
      id: "c-waves",
      label: "C - Wave behaviour",
      topics: [
        {
          id: "c1-shm",
          code: "C.1",
          label: "Simple harmonic motion",
          slug: "ib-physics-new-c1-simple-harmonic-motion",
          misconceptions: [
            "The acceleration of an oscillator is greatest where its speed is greatest (acceleration is greatest at maximum displacement, where the speed is zero).",
            "Increasing the amplitude of a pendulum increases its period (for small oscillations the period is independent of amplitude).",
            "The restoring force points in the direction of motion (it always points back towards the equilibrium position).",
          ],
          objectives: [
            "Explain the conditions that define simple harmonic motion",
            "Describe how displacement, velocity and acceleration vary during an oscillation",
            "Explain how energy is exchanged in a simple harmonic oscillator",
          ],
          criteria: {
            "Explain the conditions that define simple harmonic motion": ["the acceleration is proportional to the displacement from the equilibrium position", "the acceleration is always directed towards that equilibrium position, so it opposes the displacement", "the motion is periodic with a period independent of amplitude, as for a mass on a spring or a pendulum at small angles"],
            "Describe how displacement, velocity and acceleration vary during an oscillation": ["displacement varies sinusoidally with time between plus and minus the amplitude", "velocity is greatest at the equilibrium position and zero at maximum displacement", "acceleration is greatest at maximum displacement and zero at the equilibrium position, and is opposite in sign to the displacement", "period is the time for one complete oscillation and frequency is the number of oscillations per second"],
            "Explain how energy is exchanged in a simple harmonic oscillator": ["kinetic energy is greatest at the equilibrium position where the speed is greatest", "potential energy is greatest at maximum displacement where the speed is zero", "the total energy stays constant when no damping acts, and it is proportional to the square of the amplitude"],
          },
        },
        {
          id: "c2-wave-model",
          code: "C.2",
          label: "Wave model",
          slug: "ib-physics-new-c2-wave-model",
          misconceptions: [
            "The particles of a medium travel along with the wave (they oscillate about fixed positions while energy is transferred).",
            "Sound can travel through a vacuum (a mechanical wave needs a medium, unlike electromagnetic waves).",
            "A wave slows down when it enters a denser medium because it loses energy (the speed changes because the medium changes; the frequency is set by the source and stays the same).",
          ],
          objectives: [
            "Distinguish transverse from longitudinal waves",
            "Explain how wave speed, frequency and wavelength are related",
            "Explain what happens to a wave when it moves from one medium to another",
          ],
          criteria: {
            "Distinguish transverse from longitudinal waves": ["in a transverse wave the oscillations are perpendicular to the direction of energy transfer, as for light or a wave on a string", "in a longitudinal wave the oscillations are parallel to that direction, giving compressions and rarefactions, as for sound", "only transverse waves can be polarised", "in both cases the medium is not transported, only energy"],
            "Explain how wave speed, frequency and wavelength are related": ["wavelength is the distance between two adjacent points in phase and frequency is the number of oscillations per second", "wave speed equals frequency multiplied by wavelength", "the source sets the frequency, so a change of speed in a new medium changes the wavelength"],
            "Explain what happens to a wave when it moves from one medium to another": ["the frequency stays the same because it is determined by the source", "the speed changes because it depends on the properties of the medium, so the wavelength changes with it", "the wave changes direction unless it meets the boundary along the normal, and part of it is reflected"],
          },
        },
        {
          id: "c3-wave-phenomena",
          code: "C.3",
          label: "Wave phenomena",
          slug: "ib-physics-new-c3-wave-phenomena",
          misconceptions: [
            "Two sources are coherent if they simply have the same frequency (they must also keep a constant phase difference).",
            "Dark fringes in an interference pattern mean the light has been destroyed (energy is redistributed to the bright fringes; no energy is lost).",
            "Diffraction only happens when the gap is smaller than the wavelength (it always occurs, but it is most noticeable when the gap is comparable to the wavelength).",
          ],
          objectives: [
            "Explain how reflection and refraction occur at a boundary",
            "Explain the conditions for constructive and destructive interference",
            "Describe how diffraction depends on the size of the gap or obstacle",
          ],
          criteria: {
            "Explain how reflection and refraction occur at a boundary": ["in reflection the angle of incidence equals the angle of reflection, both measured from the normal", "in refraction the change of speed bends the wave towards the normal when it slows and away when it speeds up", "the ratio of the sines of the angles equals the ratio of the speeds in the two media (Snell's law)", "beyond a critical angle the light is totally internally reflected when it travels towards a faster medium"],
            "Explain the conditions for constructive and destructive interference": ["the sources must be coherent, keeping a constant phase difference, and of similar amplitude", "the resultant displacement at a point is the sum of the individual displacements (superposition)", "constructive interference needs a path difference of a whole number of wavelengths", "destructive interference needs a path difference of an odd number of half wavelengths"],
            "Describe how diffraction depends on the size of the gap or obstacle": ["diffraction is the spreading of a wave as it passes an edge or through a gap", "the spreading is greatest when the gap is about the same size as the wavelength", "the wavelength and frequency are unchanged by diffraction, so longer wavelengths spread more through a given gap"],
          },
        },
        {
          id: "c4-standing-waves",
          code: "C.4",
          label: "Standing waves and resonance",
          slug: "ib-physics-new-c4-standing-waves-and-resonance",
          misconceptions: [
            "A standing wave transfers energy along the string (energy is stored and exchanged within each loop, not transferred along the wave).",
            "All points on a standing wave oscillate with the same amplitude (amplitude varies from zero at a node to a maximum at an antinode).",
            "Resonance happens at any driving frequency if the amplitude is large enough (it occurs when the driving frequency matches a natural frequency of the system).",
          ],
          objectives: [
            "Explain how a standing wave is formed on a string",
            "Describe the difference between nodes and antinodes",
            "Explain resonance and the effect of damping on it",
          ],
          criteria: {
            "Explain how a standing wave is formed on a string": ["two waves of the same frequency and similar amplitude travel in opposite directions, usually because of reflection at a boundary", "they superpose, so the displacements add at every point", "the pattern does not move along the string and no energy is transferred along it", "only frequencies that fit a whole number of half wavelengths between the fixed ends persist, giving the harmonics"],
            "Describe the difference between nodes and antinodes": ["a node is a point of permanently zero amplitude, where the two waves always cancel", "an antinode is a point of maximum amplitude, where the two waves always reinforce", "adjacent nodes are half a wavelength apart, and points between neighbouring nodes oscillate in phase"],
            "Explain resonance and the effect of damping on it": ["every system has one or more natural frequencies at which it oscillates freely", "resonance is the large amplitude response when the driving frequency equals a natural frequency, transferring energy best", "heavier damping lowers the peak amplitude and broadens the response, shifting the peak slightly below the natural frequency", "one example, such as a bridge driven by wind or a wine glass driven by sound"],
          },
        },
        {
          id: "c5-doppler",
          code: "C.5",
          label: "Doppler effect",
          slug: "ib-physics-new-c5-doppler-effect",
          misconceptions: [
            "The pitch of a passing siren falls steadily as it approaches (it is steady and raised while approaching, then drops as it passes).",
            "The source emits a different frequency when it moves (the emitted frequency is unchanged; the observed frequency changes).",
            "A redshifted galaxy must be moving away through space faster than light if the shift is large (cosmological redshift comes from the expansion of space itself).",
          ],
          objectives: [
            "Explain why the observed frequency changes when a source moves relative to an observer",
            "Describe how the Doppler effect is used in astronomy and in medicine",
          ],
          criteria: {
            "Explain why the observed frequency changes when a source moves relative to an observer": ["a source moving towards an observer emits each wavefront closer to the previous one, shortening the observed wavelength", "the observed frequency is therefore higher on approach and lower on recession", "the frequency emitted by the source is unchanged; only the frequency received alters", "the shift is larger the greater the relative speed along the line joining source and observer"],
            "Describe how the Doppler effect is used in astronomy and in medicine": ["light from a receding source is shifted to longer wavelengths, a redshift, and from an approaching source to shorter ones", "the shift of known spectral lines gives the speed of a star or galaxy along the line of sight", "reflected ultrasound shifted by moving blood cells gives the speed of blood flow", "one example, such as radar speed guns or the rotation of a galaxy measured from its spectrum"],
          },
        },
      ],
    },
    {
      id: "d-fields",
      label: "D - Fields",
      topics: [
        {
          id: "d1-gravitational",
          code: "D.1",
          label: "Gravitational fields",
          slug: "ib-physics-new-d1-gravitational-fields",
          misconceptions: [
            "There is no gravity in orbit, which is why astronauts float (gravity provides the centripetal force; they are in continuous free fall).",
            "Gravitational field strength is the same everywhere on and around the Earth (it falls off with the square of the distance from the centre).",
            "A satellite needs a forward engine thrust to stay in orbit (no resultant force along the motion is needed, only the centripetal force from gravity).",
          ],
          objectives: [
            "Explain what is meant by a gravitational field and its field strength",
            "Explain how Newton's law of gravitation describes the force between two masses",
            "Explain why a satellite in a circular orbit is accelerating",
          ],
          criteria: {
            "Explain what is meant by a gravitational field and its field strength": ["a gravitational field is a region in which a mass experiences a force", "field strength is the force per unit mass at a point, a vector pointing towards the mass creating the field", "field lines point towards the mass and their spacing shows how strong the field is", "field strength at the surface has the same value as the free fall acceleration"],
            "Explain how Newton's law of gravitation describes the force between two masses": ["the force is attractive and acts along the line joining the two masses", "it is proportional to the product of the two masses", "it is inversely proportional to the square of the distance between their centres, so doubling the separation quarters the force", "the law applies to point masses and to spheres treated as if all their mass were at the centre"],
            "Explain why a satellite in a circular orbit is accelerating": ["the direction of its velocity is continually changing, so it has an acceleration even at constant speed", "gravity provides the centripetal force, directed towards the centre of the orbit", "everything in the satellite falls at the same rate, so objects inside appear weightless", "a larger orbital radius gives a smaller speed and a longer period"],
          },
        },
        {
          id: "d2-electric-magnetic",
          code: "D.2",
          label: "Electric and magnetic fields",
          slug: "ib-physics-new-d2-electric-and-magnetic-fields",
          misconceptions: [
            "Electric field lines show the path a charge would follow (they show the direction of the force on a positive charge at that point).",
            "Magnetic field lines start on north poles and stop (magnetic field lines form closed loops and there are no magnetic monopoles).",
            "A magnetic field exerts a force on any charge inside it (a force acts only on a moving charge, and only when its velocity has a component perpendicular to the field).",
          ],
          objectives: [
            "Compare the electric force between charges with the gravitational force between masses",
            "Explain what is meant by electric field strength and electric potential",
            "Describe the magnetic field produced by a current and by a permanent magnet",
          ],
          criteria: {
            "Compare the electric force between charges with the gravitational force between masses": ["both obey an inverse square law with distance between point objects", "the electric force can attract or repel because charge has two signs, while gravity is always attractive", "the electric force between two charged particles is vastly stronger than the gravitational force between them", "the electric force depends on the product of the charges and gravity on the product of the masses"],
            "Explain what is meant by electric field strength and electric potential": ["field strength is the force per unit positive charge at a point, a vector", "electric potential is the work done per unit positive charge in bringing it from infinity to that point, a scalar", "field lines run from positive to negative charge and are perpendicular to lines of equal potential", "between parallel plates the field is uniform, equal to the potential difference divided by the plate separation"],
            "Describe the magnetic field produced by a current and by a permanent magnet": ["a moving charge or a current creates a magnetic field around it", "the field round a straight wire is made of concentric circles whose direction is given by the right hand grip rule", "a solenoid produces a field like that of a bar magnet, running from its north to its south pole outside it", "field lines are closed loops and never cross, and they are closer together where the field is stronger"],
          },
        },
        {
          id: "d3-motion-em-fields",
          code: "D.3",
          label: "Motion in electromagnetic fields",
          slug: "ib-physics-new-d3-motion-in-electromagnetic-fields",
          misconceptions: [
            "A magnetic field does work on a moving charge and speeds it up (the force is perpendicular to the velocity, so it changes direction only).",
            "The force on a current carrying wire is along the field lines (it is perpendicular to both the current and the field).",
            "A charged particle moving parallel to a magnetic field experiences a maximum force (it experiences no force at all).",
          ],
          objectives: [
            "Explain the force on a current carrying conductor in a magnetic field",
            "Explain why a charged particle moving across a magnetic field follows a circular path",
            "Compare the motion of a charge in a uniform electric field with that in a magnetic field",
          ],
          criteria: {
            "Explain the force on a current carrying conductor in a magnetic field": ["the force arises because the moving charges in the wire experience magnetic forces", "the force is perpendicular to both the current and the field, with its direction given by Fleming's left hand rule", "the force is greatest when the wire is perpendicular to the field and zero when it is parallel", "the size of the force depends on the field strength, the current and the length of wire in the field"],
            "Explain why a charged particle moving across a magnetic field follows a circular path": ["the magnetic force is always perpendicular to the velocity, so it acts as a centripetal force", "the speed and kinetic energy are unchanged because no work is done on the particle", "the radius of the path grows with momentum and falls as the field strength or the charge increases", "a velocity component along the field is unaffected, giving a helical path"],
            "Compare the motion of a charge in a uniform electric field with that in a magnetic field": ["an electric field exerts a force parallel to the field on a charge whether it is moving or at rest", "a magnetic field exerts a force only on a moving charge and only perpendicular to its velocity", "the electric force does work and changes the kinetic energy, while the magnetic force does not", "a charge fired across a uniform electric field follows a parabola, like projectile motion"],
          },
        },
        {
          id: "d4-induction",
          code: "D.4",
          label: "Induction (HL only)",
          slug: "ib-physics-new-d4-induction",
          misconceptions: [
            "A steady magnetic flux through a coil induces a steady emf (only a changing flux linkage induces an emf).",
            "Lenz's law is a separate rule from energy conservation (the opposing direction is required so that work must be done, conserving energy).",
            "A transformer can step up voltage and power together (in an ideal transformer the power out equals the power in, so stepping up voltage steps down current).",
          ],
          objectives: [
            "Explain how an emf is induced in a conductor moving through a magnetic field",
            "Explain Faraday's law and Lenz's law in terms of flux linkage",
            "Describe how alternating current is generated and transformed",
          ],
          criteria: {
            "Explain how an emf is induced in a conductor moving through a magnetic field": ["the free charges in the moving conductor experience a magnetic force along it", "charge separates until the electric field it creates balances that force, giving a potential difference across the ends", "the induced emf depends on the field strength, the length of the conductor and its speed across the field", "no emf is induced when the conductor moves along the field lines and cuts none of them"],
            "Explain Faraday's law and Lenz's law in terms of flux linkage": ["magnetic flux is the field strength multiplied by the perpendicular area, and flux linkage also counts the number of turns", "the induced emf equals the rate of change of flux linkage, so a faster change gives a larger emf", "the induced current opposes the change producing it, so work must be done against the opposing force", "this opposition follows from conservation of energy, since otherwise energy would be created from nothing"],
            "Describe how alternating current is generated and transformed": ["rotating a coil in a magnetic field changes the flux linkage sinusoidally, so the induced emf alternates", "the emf is greatest when the coil lies in the plane of the field, cutting flux fastest, and zero a quarter turn later", "a transformer uses a changing flux in a shared core so the voltage ratio matches the ratio of the numbers of turns", "transmitting power at high voltage and low current reduces the energy lost by heating in the cables"],
          },
        },
      ],
    },
    {
      id: "e-nuclear-quantum",
      label: "E - Nuclear and quantum physics",
      topics: [
        {
          id: "e1-atom",
          code: "E.1",
          label: "Structure of the atom",
          slug: "ib-physics-new-e1-structure-of-the-atom",
          misconceptions: [
            "Electrons orbit the nucleus like planets round the Sun at any radius (only certain discrete energy levels are allowed).",
            "The mass of a nucleus is simply the sum of the masses of its nucleons (it is less, the difference being the mass defect that corresponds to the binding energy).",
            "Emission and absorption spectra of an element show unrelated wavelengths (they show the same wavelengths, because the same energy level differences are involved).",
          ],
          objectives: [
            "Describe the evidence from the Geiger and Marsden experiment for a nuclear atom",
            "Explain how atomic emission spectra provide evidence for discrete energy levels",
            "Explain what is meant by mass defect and nuclear binding energy",
          ],
          criteria: {
            "Describe the evidence from the Geiger and Marsden experiment for a nuclear atom": ["alpha particles were fired at a thin gold foil and their deflections recorded", "most passed almost straight through, so the atom is mostly empty space", "a very small fraction were deflected through large angles, so the positive charge and nearly all the mass sit in a tiny nucleus"],
            "Explain how atomic emission spectra provide evidence for discrete energy levels": ["an excited electron falling to a lower level emits a photon", "the photon energy equals the difference between the two levels, and that energy fixes its frequency and wavelength", "only certain wavelengths appear, giving sharp lines rather than a continuous spectrum, so the electron energies must be discrete", "each element has its own line pattern, and absorption gives dark lines at the same wavelengths"],
            "Explain what is meant by mass defect and nuclear binding energy": ["the mass of a nucleus is less than the total mass of its separate nucleons, and the difference is the mass defect", "binding energy is the energy needed to separate a nucleus into its nucleons, equivalent to the mass defect", "binding energy per nucleon measures nuclear stability and peaks around iron", "nuclei become more stable, releasing energy, when reactions move them towards that peak"],
          },
        },
        {
          id: "e2-quantum",
          code: "E.2",
          label: "Quantum physics (HL only)",
          slug: "ib-physics-new-e2-quantum-physics",
          misconceptions: [
            "Brighter light will always eject electrons from a metal eventually (below the threshold frequency no electron is emitted however intense or prolonged the light).",
            "A photon is a tiny particle of matter (it is a quantum of electromagnetic energy with no rest mass).",
            "Electron diffraction shows that electrons are really waves rather than particles (both matter and radiation show wave and particle behaviour depending on the experiment).",
          ],
          objectives: [
            "Explain how the photoelectric effect supports a photon model of light",
            "Explain what the de Broglie hypothesis says about matter",
            "Describe the evidence for wave particle duality",
          ],
          criteria: {
            "Explain how the photoelectric effect supports a photon model of light": ["light of a frequency below a threshold ejects no electrons however intense it is", "electrons are emitted with no measurable delay, which a continuous wave model cannot explain", "one photon transfers all its energy, proportional to its frequency, to one electron", "the photon energy equals the work function plus the maximum kinetic energy of the electron, and intensity only alters the number"],
            "Explain what the de Broglie hypothesis says about matter": ["any particle with momentum has an associated wavelength", "that wavelength is the Planck constant divided by the momentum, so it shrinks as momentum grows", "the wavelength of everyday objects is far too small to observe, while electrons give measurable effects", "electrons accelerated through a potential difference diffract through crystals, confirming the prediction"],
            "Describe the evidence for wave particle duality": ["interference and diffraction of light show wave behaviour", "the photoelectric effect and the Compton effect show light behaving as discrete quanta", "electron diffraction shows particles of matter behaving as waves", "the behaviour observed depends on the experiment, and no single classical picture covers both"],
          },
        },
        {
          id: "e3-radioactive-decay",
          code: "E.3",
          label: "Radioactive decay",
          slug: "ib-physics-new-e3-radioactive-decay",
          misconceptions: [
            "Irradiating an object with gamma rays makes it radioactive (irradiation is not contamination; only contamination leaves radioactive material behind).",
            "After two half lives no radioactive nuclei are left (a quarter of the original nuclei remain).",
            "Radioactive decay can be sped up by heating or chemical reaction (it is a random nuclear process unaffected by physical or chemical conditions).",
          ],
          objectives: [
            "Compare the properties of alpha, beta and gamma radiation",
            "Explain what half life means for a random decay process",
            "Explain how nuclear equations show the conservation of charge and nucleon number",
          ],
          criteria: {
            "Compare the properties of alpha, beta and gamma radiation": ["alpha is a helium nucleus, beta is an electron or positron, and gamma is a high energy photon", "alpha is the most ionising and least penetrating, stopped by paper, while gamma is the least ionising and most penetrating", "alpha and beta are deflected in opposite directions by electric and magnetic fields, while gamma is undeflected", "beta is stopped by a few millimetres of aluminium and gamma is only reduced by thick lead or concrete"],
            "Explain what half life means for a random decay process": ["half life is the time for half the radioactive nuclei in a sample to decay", "decay is random and spontaneous, so only the probability of decay per nucleus per second is fixed", "the activity falls by the same fraction in equal times, giving an exponential decrease", "the half life of a nuclide is constant and unaffected by temperature, pressure or chemical state"],
            "Explain how nuclear equations show the conservation of charge and nucleon number": ["nucleon number and proton number must each balance on the two sides of the equation", "alpha decay reduces the nucleon number by four and the proton number by two, so the element changes", "beta minus decay turns a neutron into a proton, raising the proton number by one with the nucleon number unchanged", "gamma emission removes energy from an excited nucleus without changing either number"],
          },
        },
        {
          id: "e4-fission",
          code: "E.4",
          label: "Fission",
          slug: "ib-physics-new-e4-fission",
          misconceptions: [
            "A nuclear reactor can explode like a nuclear bomb (a reactor's fuel is not enriched enough and the chain reaction is controlled).",
            "The energy released in fission comes from breaking chemical bonds (it comes from the increase in binding energy per nucleon of the products).",
            "Control rods slow the neutrons down to control the reaction (the moderator slows neutrons; control rods absorb them).",
          ],
          objectives: [
            "Explain how a chain reaction is sustained in nuclear fission",
            "Explain the roles of the moderator, control rods and coolant in a reactor",
            "Explain why fission of a heavy nucleus releases energy",
          ],
          criteria: {
            "Explain how a chain reaction is sustained in nuclear fission": ["a heavy nucleus such as uranium-235 absorbs a neutron and splits into two lighter nuclei", "each fission releases two or three further neutrons that can cause more fissions", "a critical mass of sufficiently enriched fuel is needed so that on average one neutron from each fission causes another", "the reaction is controlled when that average is held at one, and it grows when it exceeds one"],
            "Explain the roles of the moderator, control rods and coolant in a reactor": ["the moderator, such as graphite or water, slows fast neutrons so they are more likely to be absorbed and cause fission", "control rods, such as boron or cadmium, absorb neutrons and are inserted further to slow the reaction", "the coolant carries the energy away as internal energy to raise steam and drive a turbine", "shielding and the handling of long lived radioactive waste are further safety requirements"],
            "Explain why fission of a heavy nucleus releases energy": ["the products have a higher binding energy per nucleon than the original heavy nucleus", "the total mass of the products is less than that of the reactants, and this mass defect appears as energy", "the energy released per nucleon is far greater than in any chemical reaction", "most of the energy appears as kinetic energy of the fission fragments"],
          },
        },
        {
          id: "e5-fusion-stars",
          code: "E.5",
          label: "Fusion and stars",
          slug: "ib-physics-new-e5-fusion-and-stars",
          misconceptions: [
            "Stars are burning in the chemical sense (they release energy by nuclear fusion, not combustion).",
            "Fusion of any two nuclei releases energy (fusion releases energy only for light nuclei, up to around iron).",
            "A star's colour tells you its size (colour indicates surface temperature, with blue stars hotter than red ones).",
          ],
          objectives: [
            "Explain why nuclear fusion requires very high temperatures and pressures",
            "Explain how a main sequence star remains stable",
            "Describe how luminosity, surface temperature and colour are related for stars",
          ],
          criteria: {
            "Explain why nuclear fusion requires very high temperatures and pressures": ["two nuclei must come close enough for the strong nuclear force to act", "both nuclei are positive, so they repel electrostatically and must have very large kinetic energy to approach", "high temperature provides that kinetic energy and high pressure gives a high enough collision rate", "fusing light nuclei increases the binding energy per nucleon, so energy is released"],
            "Explain how a main sequence star remains stable": ["a star forms when gravity collapses a cloud of gas and dust until fusion begins in the core", "hydrogen fuses to helium in the core throughout the main sequence", "the outward radiation and gas pressure balances the inward gravitational force, an equilibrium that can last billions of years", "a more massive star fuses faster, so it is more luminous and stays on the main sequence for less time"],
            "Describe how luminosity, surface temperature and colour are related for stars": ["luminosity is the total power a star radiates, while apparent brightness also depends on its distance", "luminosity depends on the surface area and on the fourth power of the surface temperature", "a hotter star peaks at a shorter wavelength, so it looks blue, while a cooler star looks red", "a red giant is luminous despite a low surface temperature because it is very large"],
          },
        },
      ],
    },
  ],
};
