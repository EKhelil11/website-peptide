// === LA ELITE PEPTIDES — Product Catalog ===
// All products are for research use only. Not for human or animal consumption.

export interface ProductVariant {
  label: string;
  price: string;
  content: string;
}

export interface MolecularData {
  molecularFormula?: string;
  molecularWeight?: string;
  casNumber?: string;
  pubchemCid?: string;
  sequence?: string;
  purity?: string;
  storage?: string;
  form?: string;
}

export interface Product {
  id: string;
  name: string;
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
  variants?: ProductVariant[];
  molecularData?: MolecularData;
  disclaimer?: string;
  images?: string[];
}

export const products: Product[] = [
  {
    id: "retatrutide-10mg",
    name: "Retatrutide",
    content: "10 mg per vial",
    category: "GLP",
    isStack: false,
    tagline: "Multi-receptor peptide studied for activity across GLP-1, GIP, and glucagon pathways",
    synopsis:
      "Retatrutide is a tri-agonist research peptide whose unique profile makes it particularly relevant in experimental models focused on integrated pathway interactions, system-wide metabolic coordination, and multi-pathway metabolism.",
    plainEnglish:
      "Retatrutide is a multi-receptor peptide studied in research for its activity across GLP-1, GIP, and glucagon pathways simultaneously. While single-receptor GLP-1 peptides have been widely studied, Retatrutide extends this research by engaging all three pathways concurrently. This tri-agonist profile makes it particularly relevant in experimental models focused on integrated pathway interactions, coordinated metabolic signaling, and system-wide energy regulation. Overlapping receptor activation influences signaling efficiency, pathway balance, and downstream biological responses — making it a subject of considerable scientific interest.",
    howItWorks:
      "Retatrutide engages three hormone receptor pathways simultaneously: GLP-1 (which modulates nutrient handling and gastric motility via peptide-mediated endocrine communication), GIP (which influences insulin response and lipid metabolism), and glucagon (which drives energy expenditure and fatty acid oxidation). This combination produces a multifaceted metabolic signaling effect studied in the context of metabolic syndrome research, glycemic pathway models, and system-wide metabolic coordination.",
    whoIsItFor:
      "Research applications include metabolic syndrome studies, multi-receptor agonism pharmacology, glycemic pathway research, and investigations into coordinated metabolic signaling across GLP-1, GIP, and glucagon receptor systems. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "Tri-agonist receptor engagement — GLP-1, GIP, and glucagon pathways",
      "Coordinated metabolic signaling and system-wide energy regulation research",
      "Nutrient handling and gastric motility modulation via peptide-mediated endocrine communication",
      "Glycemic control and insulin response research",
      "Energy balance and lipolysis pathway investigation",
      "Overlapping receptor activation and pathway balance studies",
    ],
    price: "$150",
    badge: "Advanced",
    images: ["/manus-storage/vial_retatrutide_10mg_v2_e89e5a8e.png"],
    variants: [
      { label: "10mg", price: "$150", content: "10 mg per vial" },
    ],
    molecularData: {
      molecularFormula: "C₂₅₇H₄₀₇N₆₅O₇₂",
      molecularWeight: "5765.5 Da",
      casNumber: "2381090-08-8",
      pubchemCid: "485663353",
      sequence: "Tri-agonist GLP-1/GIP/Glucagon receptor peptide",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
    disclaimer:
      "Retatrutide is sold strictly for in-vitro laboratory research use only. It is not a drug, food additive, cosmetic, or dietary supplement. This material is not approved by the FDA or any regulatory authority for human or veterinary use, and any discussion of clinical application is for scientific context only — not product endorsement. For research use by qualified scientists only.",
  },
  {
    id: "retatrutide-30mg",
    name: "Retatrutide",
    content: "30 mg per vial",
    category: "GLP",
    isStack: false,
    tagline: "Multi-receptor peptide studied for activity across GLP-1, GIP, and glucagon pathways",
    synopsis:
      "Retatrutide is a tri-agonist research peptide whose unique profile makes it particularly relevant in experimental models focused on integrated pathway interactions, system-wide metabolic coordination, and multi-pathway metabolism.",
    plainEnglish:
      "Retatrutide is a multi-receptor peptide studied in research for its activity across GLP-1, GIP, and glucagon pathways simultaneously. While single-receptor GLP-1 peptides have been widely studied, Retatrutide extends this research by engaging all three pathways concurrently. This tri-agonist profile makes it particularly relevant in experimental models focused on integrated pathway interactions, coordinated metabolic signaling, and system-wide energy regulation. Overlapping receptor activation influences signaling efficiency, pathway balance, and downstream biological responses — making it a subject of considerable scientific interest.",
    howItWorks:
      "Retatrutide engages three hormone receptor pathways simultaneously: GLP-1 (which modulates nutrient handling and gastric motility via peptide-mediated endocrine communication), GIP (which influences insulin response and lipid metabolism), and glucagon (which drives energy expenditure and fatty acid oxidation). This combination produces a multifaceted metabolic signaling effect studied in the context of metabolic syndrome research, glycemic pathway models, and system-wide metabolic coordination.",
    whoIsItFor:
      "Research applications include metabolic syndrome studies, multi-receptor agonism pharmacology, glycemic pathway research, and investigations into coordinated metabolic signaling across GLP-1, GIP, and glucagon receptor systems. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "Tri-agonist receptor engagement — GLP-1, GIP, and glucagon pathways",
      "Coordinated metabolic signaling and system-wide energy regulation research",
      "Nutrient handling and gastric motility modulation via peptide-mediated endocrine communication",
      "Glycemic control and insulin response research",
      "Energy balance and lipolysis pathway investigation",
      "Overlapping receptor activation and pathway balance studies",
    ],
    price: "$200",
    badge: "Advanced",
    images: ["/manus-storage/vial_v7_retatrutide_6f7ad8ad.png"],
    variants: [
      { label: "30mg", price: "$200", content: "30 mg per vial" },
    ],
    molecularData: {
      molecularFormula: "C₂₅₇H₄₀₇N₆₅O₇₂",
      molecularWeight: "5765.5 Da",
      casNumber: "2381090-08-8",
      pubchemCid: "485663353",
      sequence: "Tri-agonist GLP-1/GIP/Glucagon receptor peptide",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
    disclaimer:
      "Retatrutide is sold strictly for in-vitro laboratory research use only. It is not a drug, food additive, cosmetic, or dietary supplement. This material is not approved by the FDA or any regulatory authority for human or veterinary use, and any discussion of clinical application is for scientific context only — not product endorsement. For research use by qualified scientists only.",
  },
  {
    id: "nad-500mg",
    name: "NAD+",
    content: "500 mg per vial",
    category: "Metabolics",
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
    images: ["/manus-storage/norm_nad_cf62c8f8.png"],
    molecularData: {
      molecularFormula: "C21H27N7O14P2",
      molecularWeight: "663.4 g/mol",
      casNumber: "53-84-9",
      pubchemCid: "5892",
      sequence: "N/A — coenzyme (non-peptide)",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
  {
    id: "bpc157-tb500-wolverine",
    name: "BPC-157 / TB-500 Blend",
    content: "20 mg per vial",
    detailContent: "10 mg BPC-157 / 10 mg TB-500",
    category: "Blends",
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
    images: ["https://d2xsxph8kpxj0f.cloudfront.net/310519663765469010/KeqNR4QdNviNNDWK3S7923/vial_v9_bpc_tb-58nL9wRAVRag95tehuGDWx.webp"],
    molecularData: {
      molecularFormula: "C62H98N16O22",
      molecularWeight: "1419.5 g/mol",
      casNumber: "137525-51-0",
      pubchemCid: "9941957",
      sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
  {
    id: "ghk-cu-50mg",
    name: "GHK-CU",
    content: "100 mg per vial",
    category: "Peptides",
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
    images: ["/manus-storage/norm_ghk_cu_c5ceb71c.png"],
    molecularData: {
      molecularFormula: "C28H48CuN12O8",
      molecularWeight: "744.3 g/mol",
      casNumber: "300801-03-0",
      pubchemCid: "133697840",
      sequence: "Glycyl-L-Histidyl-L-Lysine",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
  {
    id: "cjc1295-ipamorelin-10mg",
    name: "CJC-1295 + Ipamorelin",
    content: "10 mg per vial",
    category: "Blends",
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
    images: ["/manus-storage/norm_cjc_ipa_ba568088.png"],
    molecularData: {
      molecularFormula: "CJC-1295: C165H269N47O46 / Ipamorelin: C38H49N9O5",
      molecularWeight: "CJC-1295: 3647.2 Da / Ipamorelin: 711.9 g/mol",
      casNumber: "CJC-1295: 446262-90-4 / Ipamorelin: 170851-70-4",
      pubchemCid: "CJC-1295: 91971820 / Ipamorelin: 9831659",
      sequence: "Ipamorelin: Aib-His-D-2-Nal-D-Phe-Lys-NH2",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
  {
    id: "ghk-cu-bpc157-tb500-glow",
    name: "GHK-CU + BPC-157 + TB-500",
    content: "100 mg per vial",
    detailContent: "~72 mg GHK-Cu / ~14 mg BPC-157 / ~14 mg TB-500",
    category: "Blends",
    isStack: true,
    stackName: "Glow Stack",
    tagline: "Triple-compound regenerative research protocol",
    synopsis:
      "Triple-peptide research stack combining GHK-Cu, BPC-157, and TB-500 for comprehensive investigation of skin biology, collagen synthesis, angiogenesis, and tissue repair signaling.",
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
    images: ["/manus-storage/norm_glow_ca53ca40.png"],
    molecularData: {
      sequence: "BPC-157: H-Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val-OH | TB-500: Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Glu-Lys-Asp-Lys-OH | GHK-Cu: Gly-His-Lys complexed with Cu²⁺",
      molecularFormula: "C₂₂₂H₃₇₉N₆₉O₁₂₄S₁Cu₁ (combined range)",
      molecularWeight: "~5800–6000 Da",
      pubchemCid: "BPC-157: 9941957 | TB-500: 16132393 | GHK-Cu: 378611",
      casNumber: "BPC-157: 137525-51-0 | TB-500: 77591-33-4 | GHK-Cu: 89030-95-5",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
  {
    id: "mots-c-10mg",
    name: "MOTS-C",
    content: "10 mg per vial",
    category: "Metabolics",
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
    images: ["/manus-storage/norm_mots_c_f5c08507.png"],
    molecularData: {
      molecularFormula: "C101H152N28O22S2",
      molecularWeight: "2174.6 g/mol",
      casNumber: "1627580-64-6",
      pubchemCid: "146675088",
      sequence: "MRWQEMGYIFYPRKLR",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
  {
    id: "kisspeptin-10mg",
    name: "Kisspeptin",
    content: "10 mg per vial",
    category: "Peptides",
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
    images: ["/manus-storage/norm_kisspeptin_9672534c.png"],
    molecularData: {
      molecularFormula: "C63H83N17O14",
      molecularWeight: "1302.4 g/mol",
      casNumber: "374675-21-5",
      pubchemCid: "25240297",
      sequence: "YNWNSFGLRF",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
  {
    id: "semax-10mg",
    name: "Semax",
    content: "10 mg per vial",
    category: "Peptides",
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
    images: ["/manus-storage/norm_semax_97d7478e.png"],
    molecularData: {
      molecularFormula: "C37H51N9O10S",
      molecularWeight: "813.9 g/mol",
      casNumber: "80714-61-0",
      pubchemCid: "9811102",
      sequence: "Met-Glu-His-Phe-Pro-Gly-Pro (MEHFPGP)",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
  {
    id: "sermorelin-10mg",
    name: "Sermorelin",
    content: "10 mg per vial",
    category: "Peptides",
    isStack: false,
    tagline: "GHRH analogue for growth hormone axis research",
    synopsis:
      "Synthetic analogue of endogenous GHRH(1-29) studied for pituitary GH secretion stimulation, somatotropic axis regulation, and IGF-1 pathway research.",
    plainEnglish:
      "Sermorelin is a synthetic 29-amino acid analogue of endogenous Growth Hormone-Releasing Hormone (GHRH), representing the biologically active N-terminal fragment responsible for GH secretagogue activity. Unlike exogenous recombinant HGH, Sermorelin acts upstream at the pituitary level, stimulating the somatotroph cells to produce and secrete growth hormone through the body's own regulatory feedback mechanisms. This makes it a valuable research tool for studying the somatotropic axis, pituitary function, and the downstream IGF-1 signaling cascade in a physiologically relevant model.",
    howItWorks:
      "Sermorelin binds to the GHRH receptor (GHRHR) on pituitary somatotroph cells, activating adenylyl cyclase and increasing intracellular cAMP. This triggers GH synthesis and pulsatile secretion into circulation. Released GH then stimulates hepatic IGF-1 production, which mediates many of the downstream anabolic and metabolic effects studied in growth hormone research. Because Sermorelin preserves the natural negative feedback loop via somatostatin, it provides a more physiologically controlled model for somatotropic axis research compared to direct GH administration.",
    whoIsItFor:
      "Research applications include somatotropic axis studies, pituitary function research, GH secretagogue pharmacology, IGF-1 signaling pathway investigations, body composition biology, and age-related GH decline models. For use by qualified researchers in laboratory settings only.",
    benefits: [
      "GHRH receptor (GHRHR) binding and pituitary signaling research",
      "Pulsatile GH secretion modeling via somatotroph stimulation",
      "IGF-1 pathway activation and downstream signaling studies",
      "Somatotropic axis regulation and feedback loop research",
      "Age-related GH decline and longevity biology investigations",
      "Body composition and lean tissue metabolism research",
      "Pituitary function and cAMP signaling pathway studies",
    ],
    price: "$75",
    badge: "Hormone",
    images: ["/manus-storage/norm_sermorelin_78d13590.png"],
    molecularData: {
      sequence: "Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH₂",
      molecularFormula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
      molecularWeight: "~3357.9 Da",
      pubchemCid: "16132413",
      casNumber: "86168-78-7",
      storage: "Lyophilized: −20°C. Reconstituted: 2–8°C, use within 28 days.",
      form: "Lyophilized powder",
    },
  },
];

export const categories = [
  "All",
  "GLP",
  "Metabolics",
  "Peptides",
  "Blends",
];
