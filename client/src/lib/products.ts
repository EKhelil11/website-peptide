// === ELITE LA PEPTIDES — Product Data ===
// All 7 products with synopses. Prices are placeholders — update when ready.

export interface Product {
  id: string;
  name: string;
  dose: string;
  category: string;
  isStack: boolean;
  stackName?: string;
  tagline: string;
  synopsis: string;
  benefits: string[];
  price: string | null; // null = "Coming Soon"
  badge?: string;
}

export const products: Product[] = [
  {
    id: "retatrutide-30mg",
    name: "Retatrutide",
    dose: "30mg",
    category: "Metabolic",
    isStack: false,
    tagline: "Triple-receptor metabolic powerhouse",
    synopsis:
      "Retatrutide is a next-generation triple agonist targeting GIP, GLP-1, and glucagon receptors simultaneously — making it one of the most advanced metabolic peptides available. Originally developed for obesity and metabolic syndrome, it has demonstrated remarkable results in clinical research for weight reduction, improved insulin sensitivity, and lipid regulation. Its tri-receptor mechanism provides a synergistic effect that surpasses dual-agonist compounds, positioning Retatrutide at the forefront of metabolic optimization science.",
    benefits: [
      "Significant body weight reduction",
      "Improved insulin sensitivity",
      "Enhanced lipid metabolism",
      "Appetite regulation via GLP-1 pathway",
      "Glucagon-mediated energy expenditure",
    ],
    price: null,
    badge: "Advanced",
  },
  {
    id: "nad-500mg",
    name: "NAD+",
    dose: "500mg",
    category: "Longevity",
    isStack: false,
    tagline: "The cellular energy currency of longevity",
    synopsis:
      "Nicotinamide Adenine Dinucleotide (NAD+) is a coenzyme found in every living cell and is fundamental to mitochondrial energy production, DNA repair, and the activation of sirtuins — proteins closely linked to longevity and cellular resilience. NAD+ levels naturally decline with age, and supplementation has been shown in research to restore mitochondrial function, enhance cognitive clarity, support neuroprotection, and accelerate recovery. At 500mg, this formulation is designed for those seeking meaningful cellular rejuvenation and sustained vitality.",
    benefits: [
      "Mitochondrial energy optimization",
      "DNA repair and cellular resilience",
      "Sirtuin pathway activation",
      "Cognitive clarity and neuroprotection",
      "Anti-aging and longevity support",
    ],
    price: null,
    badge: "Longevity",
  },
  {
    id: "bpc157-tb500-wolverine",
    name: "BPC-157 + TB-500",
    dose: "Wolverine Stack",
    category: "Recovery",
    isStack: true,
    stackName: "Wolverine Stack",
    tagline: "Accelerated healing. Wolverine-grade recovery.",
    synopsis:
      "The Wolverine Stack combines two of the most researched healing peptides in existence. BPC-157 (Body Protection Compound-157) is a 15-amino-acid peptide derived from a human gastric protein, renowned for its ability to accelerate tissue repair, reduce inflammation, and protect the gut lining. TB-500 (Thymosin Beta-4) is a naturally occurring peptide that promotes angiogenesis, cell migration, and systemic tissue regeneration. Together, they create a synergistic healing cascade that targets muscle, tendon, ligament, and joint recovery with a speed and depth that neither peptide achieves alone.",
    benefits: [
      "Accelerated muscle and tendon repair",
      "Systemic tissue regeneration via TB-500",
      "Anti-inflammatory and gut protection via BPC-157",
      "Enhanced angiogenesis and blood flow",
      "Joint and ligament recovery support",
    ],
    price: null,
    badge: "Stack",
  },
  {
    id: "ghk-cu-50mg",
    name: "GHK-CU",
    dose: "50mg",
    category: "Regeneration",
    isStack: false,
    tagline: "Copper peptide for skin, hair, and cellular renewal",
    synopsis:
      "GHK-Cu (Copper Peptide GHK-Cu) is a naturally occurring copper complex with a profound ability to stimulate collagen and elastin synthesis, activate stem cells, and modulate over 4,000 human genes. Extensively studied for its role in wound healing, skin regeneration, and anti-aging, GHK-Cu promotes the production of glycosaminoglycans, reduces oxidative stress, and supports hair follicle health. Its systemic regenerative properties make it a cornerstone peptide for those pursuing both aesthetic rejuvenation and deeper cellular repair.",
    benefits: [
      "Collagen and elastin synthesis stimulation",
      "Skin tightening and anti-aging effects",
      "Hair follicle activation and growth support",
      "Wound healing and tissue remodeling",
      "Antioxidant and anti-inflammatory activity",
    ],
    price: null,
    badge: "Regenerative",
  },
  {
    id: "cjc1295-ipamorelin-10mg",
    name: "CJC-1295 + Ipamorelin",
    dose: "10mg",
    category: "Growth",
    isStack: true,
    stackName: "GH Synergy",
    tagline: "Precision growth hormone optimization",
    synopsis:
      "This synergistic combination pairs CJC-1295, a GHRH analogue that extends the half-life of growth hormone-releasing hormone, with Ipamorelin, a selective growth hormone secretagogue that mimics ghrelin without the cortisol or prolactin spikes associated with other GH peptides. The result is a clean, pulsatile release of growth hormone that mirrors the body's natural rhythm. Research indicates benefits including enhanced lean muscle development, accelerated fat metabolism, improved sleep quality, and faster recovery — all without suppressing the body's endogenous GH production.",
    benefits: [
      "Pulsatile, natural-pattern GH release",
      "Lean muscle development and retention",
      "Accelerated fat metabolism",
      "Improved deep sleep and recovery",
      "No cortisol or prolactin elevation",
    ],
    price: null,
    badge: "Stack",
  },
  {
    id: "ghk-cu-bpc157-tb500-glow",
    name: "GHK-CU + BPC-157 + TB-500",
    dose: "Glow Stack",
    category: "Beauty & Recovery",
    isStack: true,
    stackName: "Glow Stack",
    tagline: "Radiance engineered from the inside out",
    synopsis:
      "The Glow Stack is the ultimate convergence of regeneration and beauty science. GHK-Cu drives collagen synthesis and skin renewal at the cellular level, while BPC-157 provides powerful anti-inflammatory protection and gut-skin axis support. TB-500 completes the triad by promoting systemic tissue regeneration and angiogenesis, ensuring nutrients and oxygen reach skin cells efficiently. The combined effect is a comprehensive inside-out approach to radiant skin, accelerated healing, and whole-body rejuvenation — making this stack the definitive choice for those who demand both performance and aesthetics.",
    benefits: [
      "Comprehensive skin collagen and elastin boost",
      "Gut-skin axis optimization via BPC-157",
      "Systemic angiogenesis and nutrient delivery",
      "Accelerated wound healing and scar reduction",
      "Full-body regenerative synergy",
    ],
    price: null,
    badge: "Signature Stack",
  },
  {
    id: "mots-c-10mg",
    name: "MOTS-C",
    dose: "10mg",
    category: "Metabolic & Longevity",
    isStack: false,
    tagline: "Mitochondrial-encoded longevity peptide",
    synopsis:
      "MOTS-C is a mitochondria-derived peptide encoded within the mitochondrial genome — a discovery that fundamentally changed our understanding of mitochondrial biology. It acts as a metabolic regulator that activates AMPK pathways, improves insulin sensitivity, and enhances the body's ability to utilize fatty acids for fuel. Research has demonstrated its potential in combating age-related metabolic decline, improving exercise capacity, and extending healthspan. MOTS-C represents the cutting edge of longevity science, bridging mitochondrial health with systemic metabolic optimization.",
    benefits: [
      "AMPK pathway activation for metabolic regulation",
      "Enhanced insulin sensitivity and glucose control",
      "Improved fatty acid oxidation and energy",
      "Exercise performance and endurance support",
      "Longevity and healthspan extension research",
    ],
    price: null,
    badge: "Longevity",
  },
];

export const categories = [
  "All",
  "Metabolic",
  "Longevity",
  "Recovery",
  "Regeneration",
  "Growth",
  "Beauty & Recovery",
  "Metabolic & Longevity",
];
