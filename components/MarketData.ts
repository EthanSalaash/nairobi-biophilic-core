import { Activity, Droplets, Trees, CloudLightning } from 'lucide-react';

export const ECO_MATERIALS = [
  { 
    id: 'algae-facade', 
    name: 'Microalgae Bioreactor Façades', 
    category: 'Façade Integration', 
    description: 'Glass panels holding living microalgae that capture carbon dioxide gas through active photosynthesis.', 
    recommendedFor: ['Commercial', 'Hospital'], 
    impactType: 'CO2 Reduction', 
    impactValuePerM2: 12, 
    costPerM2: 18500, 
    icon: Activity, 
    suitabilityNote: 'Ideal for high-traffic zones like Mombasa Road.',
    imgSrc: '/algae.png',
    pros: ['Produces clean oxygen at 10x the rate of standard trees.', 'Generates organic biomass for biofuel.', 'Provides dynamic natural shading to lower cooling bills.'],
    cons: ['Requires active water pumps which demand steady power.', 'Initial installation costs for glass bioreactor tubes are premium.']
  },
  { 
    id: 'green-roof', 
    name: 'Intensive Stormwater Green Roofs', 
    category: 'Roof Infrastructure', 
    description: 'Deep structural engineered soil beds planted with native flora to sponge up heavy equatorial downpours.', 
    recommendedFor: ['Commercial', 'Public School', 'Hospital'], 
    impactType: 'Stormwater Diverted', 
    impactValuePerM2: 45, 
    costPerM2: 12000, 
    icon: Droplets, 
    suitabilityNote: 'Relieves flash flooding strains on Nairobi County drainage.',
    imgSrc: '/roof.png',
    pros: ['Acts as a structural sponge, retaining up to 70% of heavy precipitation.', 'Significantly reduces urban heat island impact.', 'Creates a peaceful urban biodiversity sanctuary.'],
    cons: ['Adds considerable dead weight load to concrete supports.', 'Needs structural waterproofing protection layers during design.']
  },
  { 
    id: 'mass-timber', 
    name: 'Structural Cross-Laminated Mass Timber', 
    category: 'Core Structural', 
    description: 'Engineered sustainable wood structures replacing high-emission concrete skeletons to sequester carbon permanently.', 
    recommendedFor: ['Commercial', 'Public School'], 
    impactType: 'Carbon Embodied', 
    impactValuePerM2: 80, 
    costPerM2: 24500, 
    icon: Trees, 
    suitabilityNote: 'Perfect for sustainable housing estates across Nairobi.',
    imgSrc: '/timber.png',
    pros: ['Traps carbon within the wooden structure for decades.', 'Enables lightning-fast pre-fabricated modular assembly speeds.', 'Exquisite natural indoor aesthetic improves wellness scores.'],
    cons: ['Demands strictly managed, certified plantation forestry sources.', 'Susceptible to moisture damage if structural flashing fails.']
  },
  { 
    id: 'photocatalytic-stucco', 
    name: 'Photocatalytic TiO₂ Surface Smog Plaster', 
    category: 'Surface Coating', 
    description: 'Special titanium mineral plaster activated by sunlight to break down vehicle exhaust toxins into benign nitrates.', 
    recommendedFor: ['Infrastructure Bypass'], 
    impactType: 'Smog Neutralization', 
    impactValuePerM2: 8, 
    costPerM2: 4200, 
    icon: CloudLightning, 
    suitabilityNote: 'Engineered for concrete highway flyovers and bypasses.',
    imgSrc: '/coat.png',
    pros: ['Decomposes harmful nitrogen oxide (NOx) gases from exhaust directly.', 'Self-cleaning coating keeps roadside walls free of gray soot.', 'Highly economical to spray onto existing concrete overpasses.'],
    cons: ['Requires direct exposure to ultraviolet sunlight to function actively.', 'Chemical breakdown cycle resets during long, cloudy rainy seasons.']
  }
];
