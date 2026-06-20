// === LA ELITE PEPTIDES — Product Catalog ===
// All products are for research use only. Not for human or animal consumption.

export interface Product {
  id: string;
  name: string;
  dose: string;
  cycle: string;
  content: string;
  detailContent?: string;
  category: string;
  isStack: boolean;
  stackName?: string;
  tagline: string;
  synopsis: string;
  plainEnglish: string;
  howItWorks: string;
  whoIsItFor: string;
  benefits: string[];
  price: string | null;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "retatrutide-30mg",
    name: "Retatrutide",
    dose: "20–40 units/week",
    cycle: "6–7 week cycle",
    content: "30 mg per vial",
    category: "Weight Loss",
    isStack: false,
    tagline: "Triple-receptor metabolic research compound",
    synopsis:
      "Triple-hormone receptor agonist studied for metabolic regulation, adipose tissue reduction, and glycemic control in research models.",
    plainEnglish:
      "Retatrutide is one of the most advanced metabolic research peptides available, designed to simultaneously engage three hormone receptor pathways. While GLP-1 agonists have been widely studied, Retatrutide extends this research by also targeting GIP and glucagon receptors. This triple-receptor approach makes it a significant subject of investigation for metabolic research, adipose regulation, and energy homeostasis studies.",
    howItWorks:
      "Retatrutide activates three hormone receptors simultaneously: GLP-1 (which modulates appetite signaling and gastric motility), GIP (which influences insulin response and lipid metabolism), and glucagon (which drives lipolysis and energy expenditure). This combination produces a multifaceted metabolic effect studied in the context of obesity research, type 2 diabetes models, and energy balance regulation.",
    whoIsItFor:
      "Research applications include metabolic syndrome studies, obesity pharmacology, glycemic control research, and investigations into multi-receptor agonism for adipose tissue regulation. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "Triple-receptor agonism — GLP-1, GIP, and glucagon pathways",
      "Studied for adipose tissue reduction in research models",
      "Appetite signaling modulation in preclinical studies",
      "Glycemic control and insulin response research",
      "Energy expenditure and lipolysis pathway investigation",
    ],
    price: "$140",
    badge: "Advanced",
  },
  {
    id: "nad-500mg",
    name: "NAD+",
    dose: "500mg",
    cycle: "1 month cycle",
    content: "500 mg per vial",
    category: "Cellular Health",
    isStack: false,
    tagline: "Cellular energy coenzyme for longevity research",
    synopsis:
      "Coenzyme essential for cellular energy metabolism, DNA repair signaling, and sirtuin activation — a key subject in aging and longevity research.",
    plainEnglish:
      "NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme present in every cell and is essential for numerous biological processes. It functions as an electron carrier in metabolic reactions and is a critical substrate for sirtuins and PARP enzymes involved in DNA repair and gene expression regulation. NAD+ levels are known to decline with cellular aging, making it a primary focus of longevity and cellular biology research.",
    howItWorks:
      "NAD+ serves as a molecular electron shuttle in cellular respiration, facilitating the conversion of metabolic substrates into ATP. It also activates sirtuin deacetylases — proteins associated with aging regulation, inflammation modulation, and DNA repair mechanisms. Research in this area investigates the relationship between NAD+ bioavailability and cellular senescence, mitochondrial function, and age-related metabolic decline.",
    whoIsItFor:
      "Research applications include cellular aging studies, mitochondrial function research, sirtuin pathway investigations, DNA repair mechanism studies, and metabolic biology research. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "Sirtuin pathway activation — longevity protein research",
      "DNA repair mechanism studies via PARP substrate activity",
      "Mitochondrial function and cellular respiration research",
      "Cellular senescence and aging biology investigations",
      "Metabolic enzyme cofactor in energy pathway studies",
      "Neurological function research via NAD+-dependent pathways",
    ],
    price: "$100",
    badge: "Longevity",
  },
  {
    id: "bpc157-tb500-wolverine",
    name: "BPC-157 / TB-500 Blend",
    dose: "20mg",
    cycle: "3–4 week cycle",
    content: "20 mg per vial",
    detailContent: "10 mg BPC-157 / 10 mg TB-500",
    category: "Recovery",
    isStack: true,
    stackName: "Wolverine Stack",
    tagline: "Dual-peptide tissue repair research stack",
    synopsis:
      "Research stack combining BPC-157 and TB-500 for investigation of tissue repair signaling, angiogenesis, and inflammatory pathway modulation.",
    plainEnglish:
      "The Wolverine Stack is a precision-blended research compound containing 10mg BPC-157 and 10mg TB-500 per vial — a 1:1 ratio dual-peptide protocol for tissue repair and regeneration research. BPC-157 is a partial sequence of Body Protection Compound found in gastric juice, while TB-500 is a synthetic fragment of Thymosin Beta-4, a ubiquitous actin-sequestering protein. Together in a single vial, they represent a comprehensive research tool for studying multiple aspects of tissue healing and repair signaling.",
    howItWorks:
      "BPC-157 modulates growth factor signaling (including VEGF and EGF pathways) and exerts cytoprotective effects on gastrointestinal and musculoskeletal tissue in research models. TB-500 promotes actin polymerization, cell migration, and angiogenesis — the formation of new blood vessels essential for tissue repair. Combined, they engage complementary repair pathways studied in the context of musculoskeletal injury, inflammation, and wound healing research.",
    whoIsItFor:
      "Research applications include musculoskeletal repair studies, angiogenesis research, inflammatory pathway modulation, wound healing biology, and gastrointestinal tissue protection research. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "Musculoskeletal tissue repair signaling research",
      "Angiogenesis and vascular remodeling studies via TB-500",
      "Anti-inflammatory pathway modulation in research models",
      "Wound healing and scar tissue biology investigations",
      "Gastrointestinal cytoprotection research via BPC-157",
      "Cell migration and actin dynamics research",
    ],
    price: "$100",
    badge: "Stack",
  },
  {
    id: "ghk-cu-50mg",
    name: "GHK-CU",
    dose: "50mg",
    cycle: "2 month cycle",
    content: "100 mg per vial",
    category: "Anti-Aging",
    isStack: false,
    tagline: "Copper-binding peptide for regenerative research",
    synopsis:
      "Naturally occurring copper-binding tripeptide studied for collagen synthesis signaling, wound healing biology, and gene expression regulation in aging research.",
    plainEnglish:
      "GHK-Cu is a naturally occurring copper-binding tripeptide (Glycyl-L-Histidyl-L-Lysine) found in human plasma, saliva, and urine. Its plasma concentration declines significantly with age, making it a subject of considerable interest in aging and regenerative biology research. It functions as a biological signal that modulates gene expression, promotes tissue remodeling, and facilitates copper transport to enzymatic sites — all key areas of investigation in dermatological and longevity research.",
    howItWorks:
      "GHK-Cu activates genes involved in collagen and elastin synthesis, tissue remodeling, and antioxidant defense. It modulates TGF-β signaling pathways associated with wound healing and fibrosis regulation. Research also demonstrates its ability to upregulate over 30 genes involved in tissue repair while downregulating genes associated with inflammatory and cancer-related pathways. Its copper-chelating properties facilitate delivery of copper to copper-dependent enzymes critical for connective tissue synthesis.",
    whoIsItFor:
      "Research applications include dermatological biology, collagen synthesis studies, wound healing research, anti-aging gene expression investigations, and copper-dependent enzyme pathway studies. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "Collagen and elastin synthesis gene upregulation research",
      "TGF-β pathway modulation in wound healing studies",
      "Antioxidant gene expression and free radical research",
      "Copper transport and metalloenzyme activity studies",
      "Hair follicle biology and dermal repair research",
      "Anti-aging gene expression profiling investigations",
      "Tissue remodeling and fibrosis regulation research",
    ],
    price: "$80",
    badge: "Regenerative",
  },
  {
    id: "cjc1295-ipamorelin-10mg",
    name: "CJC-1295 + Ipamorelin",
    dose: "10 units/day",
    cycle: "8–12 week cycle",
    content: "10 mg per vial",
    category: "Hormone Support",
    isStack: true,
    stackName: "GH Synergy",
    tagline: "Dual-pathway growth hormone secretagogue research",
    synopsis:
      "Synergistic research stack combining a GHRH analogue with a selective GH secretagogue for investigation of pulsatile growth hormone release and somatotropic axis research.",
    plainEnglish:
      "This research stack pairs CJC-1295, a GHRH (Growth Hormone-Releasing Hormone) analogue with an extended half-life via DAC (Drug Affinity Complex) technology, with Ipamorelin, a selective GH secretagogue that mimics ghrelin without significant cortisol or prolactin elevation. Together, they provide a dual-pathway tool for studying the somatotropic axis and pulsatile GH release patterns in research models.",
    howItWorks:
      "CJC-1295 extends the duration of GHRH signaling at the pituitary, prolonging the window of GH release. Ipamorelin selectively activates ghrelin receptors (GHS-R1a) to trigger discrete GH pulses without the cortisol or prolactin side effects associated with other secretagogues. Combined, they produce a sustained, pulsatile GH release pattern that closely mirrors physiological secretion — a valuable model for somatotropic axis research and GH pathway investigation.",
    whoIsItFor:
      "Research applications include somatotropic axis studies, pulsatile GH release modeling, ghrelin receptor pharmacology, body composition research, and investigations into GH secretagogue selectivity. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "Pulsatile, physiological-pattern GH release modeling",
      "Somatotropic axis and pituitary signaling research",
      "Ghrelin receptor (GHS-R1a) pharmacology studies",
      "GH secretagogue selectivity and cortisol-sparing research",
      "Body composition and lean tissue biology investigations",
      "Endogenous GH production pathway preservation studies",
    ],
    price: "$80",
    badge: "Stack",
  },
  {
    id: "ghk-cu-bpc157-tb500-glow",
    name: "GHK-CU + BPC-157 + TB-500",
    dose: "100mg",
    cycle: "2 month cycle",
    content: "~71 mg GHK-Cu + ~14 mg BPC-157 + ~14 mg TB-500 per vial",
    category: "Beauty & Wellness",
    isStack: true,
    stackName: "Glow Stack",
    tagline: "~71mg GHK-Cu / ~14mg BPC-157 / ~14mg TB-500 — triple-peptide research blend",
    synopsis:
      "Triple-peptide research blend — ~71mg GHK-Cu, ~14mg BPC-157, and ~14mg TB-500 per vial — for comprehensive investigation of skin biology, collagen synthesis, angiogenesis, and tissue repair signaling.",
    plainEnglish:
      "The Glow Stack is a precision-formulated triple-compound research protocol delivering ~71mg GHK-Cu, ~14mg BPC-157, and ~14mg TB-500 in a single 100mg vial. GHK-Cu, the dominant compound at ~71%, is a naturally occurring copper-binding tripeptide with well-documented gene expression modulation properties. BPC-157 (~14%) is a cytoprotective peptide derived from gastric juice with broad tissue repair signaling activity. TB-500 (~14%) is a synthetic Thymosin Beta-4 fragment studied for angiogenesis and cell migration. Together, they form a comprehensive research tool for multi-pathway tissue biology investigations.",
    howItWorks:
      "GHK-Cu modulates collagen and elastin synthesis genes while activating antioxidant defense pathways. BPC-157 engages growth factor signaling cascades (VEGF, EGF) and exerts cytoprotective effects across multiple tissue types. TB-500 promotes actin dynamics, cell migration, and new blood vessel formation. The combined protocol allows researchers to investigate multiple intersecting repair and regeneration pathways simultaneously — making it a valuable multi-target research tool.",
    whoIsItFor:
      "Research applications include multi-pathway tissue repair studies, dermatological biology, angiogenesis and vascular remodeling research, collagen synthesis investigations, and comprehensive regenerative biology protocols. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "Multi-pathway tissue repair and regeneration research",
      "Collagen and elastin synthesis gene expression studies",
      "Angiogenesis and vascular remodeling investigations",
      "Anti-inflammatory signaling pathway modulation research",
      "Dermal biology and wound healing mechanism studies",
      "Gastrointestinal cytoprotection research via BPC-157",
      "Comprehensive multi-target regenerative biology protocols",
    ],
    price: "$120",
    badge: "Signature Stack",
  },
  {
    id: "mots-c-10mg",
    name: "MOTS-C",
    dose: "1.0 units — 30 min pre-workout",
    cycle: "20 day cycle",
    content: "10 mg per vial",
    category: "Metabolic",
    isStack: false,
    tagline: "Mitochondrial-encoded metabolic research peptide",
    synopsis:
      "Mitochondria-derived peptide studied for AMPK pathway activation, insulin sensitization, metabolic regulation, and mitochondrial biogenesis research.",
    plainEnglish:
      "MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA Type-c) is a mitochondria-derived peptide encoded within the 12S rRNA gene of the mitochondrial genome. Its discovery represented a paradigm shift in understanding mitochondrial biology, as it demonstrated that mitochondria encode bioactive peptides that function as systemic metabolic regulators. It is a primary subject of investigation in metabolic disease research, exercise biology, and longevity science.",
    howItWorks:
      "MOTS-c activates AMPK (AMP-activated protein kinase), the master regulator of cellular energy homeostasis. AMPK activation promotes fatty acid oxidation, glucose uptake, and mitochondrial biogenesis while inhibiting anabolic processes that consume ATP. Research also demonstrates MOTS-c's ability to translocate to the nucleus under metabolic stress, where it modulates gene expression related to antioxidant response and metabolic adaptation — a novel mitochondria-to-nucleus signaling pathway.",
    whoIsItFor:
      "Research applications include AMPK pathway studies, mitochondrial biology, insulin resistance and metabolic syndrome research, exercise physiology investigations, and longevity biology. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "AMPK pathway activation and metabolic regulation research",
      "Insulin sensitivity and glucose uptake mechanism studies",
      "Mitochondrial biogenesis and energy homeostasis research",
      "Mitochondria-to-nucleus signaling pathway investigations",
      "Fatty acid oxidation and lipid metabolism studies",
      "Cellular stress response and antioxidant gene expression research",
    ],
    price: "$70",
    badge: "Longevity",
  },
  {
    id: "kisspeptin-10mg",
    name: "Kisspeptin",
    dose: "10mg",
    cycle: "4–6 week cycle",
    content: "10 mg per vial",
    category: "Hormone Support",
    isStack: false,
    tagline: "GPR54 agonist for reproductive axis research",
    synopsis:
      "Naturally occurring neuropeptide studied for its role in GnRH regulation, reproductive hormone axis activation, and neuroendocrine signaling research.",
    plainEnglish:
      "Kisspeptin is a naturally occurring neuropeptide encoded by the KISS1 gene, functioning as the primary activator of the hypothalamic-pituitary-gonadal (HPG) axis. It was identified as a metastasis suppressor gene product before its critical role in reproductive neuroendocrinology was discovered. Its function as the gatekeeper of GnRH secretion has made it a central subject in reproductive biology, neuroendocrinology, and hormonal regulation research.",
    howItWorks:
      "Kisspeptin binds to its cognate receptor GPR54 (KISS1R) on GnRH neurons in the hypothalamus, triggering pulsatile GnRH release. This initiates the downstream HPG axis cascade: GnRH stimulates pituitary LH and FSH secretion, which in turn drives gonadal steroidogenesis (testosterone in males, estradiol and progesterone in females). Research investigates this pathway in the context of hypogonadism, fertility biology, puberty onset, and neuroendocrine feedback mechanisms.",
    whoIsItFor:
      "Research applications include HPG axis regulation studies, GnRH pulse physiology, reproductive neuroendocrinology, hypogonadism models, fertility biology research, and investigations into KISS1R pharmacology. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "GPR54 receptor pharmacology and HPG axis research",
      "GnRH pulsatility and neuroendocrine signaling studies",
      "Reproductive hormone axis activation mechanism research",
      "Hypogonadism model and testosterone pathway investigations",
      "Fertility biology and ovulation signaling research",
      "KISS1 gene expression and metastasis suppressor studies",
    ],
    price: "$80",
    badge: "Hormone",
  },
  {
    id: "semax-10mg",
    name: "Semax",
    dose: "1.0 units / Morning",
    cycle: "2–4 week cycle",
    content: "10 mg per vial",
    category: "Cellular Health",
    isStack: false,
    tagline: "ACTH-derived neuropeptide for cognitive research",
    synopsis:
      "Synthetic ACTH(4-7) analogue studied for BDNF upregulation, neuroprotection, dopaminergic pathway modulation, and cognitive function research.",
    plainEnglish:
      "Semax is a synthetic heptapeptide analogue of ACTH(4-7) (Met-Glu-His-Phe-Pro-Gly-Pro), originally developed at the Institute of Molecular Genetics in Russia. It was designed to retain the neurotropic properties of ACTH without the adrenocortical effects. Clinically investigated in Russia for stroke recovery and cognitive disorders, it has become a significant subject of international neuroscience research for its BDNF-modulating and neuroprotective properties.",
    howItWorks:
      "Semax upregulates BDNF (Brain-Derived Neurotrophic Factor) expression, a key neurotrophin involved in neuronal survival, synaptic plasticity, and learning and memory consolidation. It also modulates dopaminergic and serotonergic neurotransmission in the prefrontal cortex and inhibits enkephalin-degrading enzymes, extending neuropeptide activity. Additionally, it demonstrates antioxidant properties that protect neurons from oxidative stress — making it a multi-target neuroprotective research compound.",
    whoIsItFor:
      "Research applications include BDNF pathway studies, neuroprotection research, dopaminergic and serotonergic neurotransmission investigations, cognitive function biology, stroke recovery models, and neuroplasticity research. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "BDNF upregulation and neurotrophin pathway research",
      "Neuroprotective mechanism and oxidative stress studies",
      "Dopaminergic and serotonergic modulation investigations",
      "Synaptic plasticity and memory consolidation research",
      "Enkephalin-degrading enzyme inhibition studies",
      "Stroke recovery and neurological repair model research",
    ],
    price: "$60",
    badge: "Nootropic",
  },
];

export const categories = [
  "All",
  "Weight Loss",
  "Cellular Health",
  "Recovery",
  "Anti-Aging",
  "Hormone Support",
  "Beauty & Wellness",
  "Metabolic",
];
