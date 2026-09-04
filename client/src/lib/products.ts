// All catalog materials are supplied strictly for qualified in-vitro laboratory research.
// They are not intended for human or animal use, consumption, diagnosis, or treatment.

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

export interface ResearchReference {
  title: string;
  url: string;
}

export interface CoaRecord {
  status: "verified";
  laboratory: string;
  laboratoryLocation: string;
  accreditation: string;
  reportId: string;
  lotBatch: string;
  sampleName: string;
  labeledStrength: string;
  receivedDate: string;
  completedDate: string;
  testedDate: string;
  method: string;
  identityResult: string;
  contentResult: string;
  specification: string;
  purityResult: string;
  signedBy: string;
  documentUrl: string;
  scopeNote: string;
}

export interface Product {
  id: string;
  legacyIds?: string[];
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
  researchClassification: string;
  handling: string;
  references: ResearchReference[];
  coa?: CoaRecord;
  disclaimer?: string;
  images?: string[];
}

const STANDARD_HANDLING =
  "Keep the sealed research material protected from light and moisture, minimize temperature cycling, and use appropriate laboratory PPE. Exact storage, handling, stability, and analytical conditions must follow the product-specific matched Certificate of Analysis (COA) and Safety Data Sheet (SDS). This catalog does not provide reconstitution or administration instructions.";

const STANDARD_DISCLAIMER =
  "This material is sold strictly for qualified in-vitro laboratory research and analytical use. It is not a drug, food, cosmetic, or dietary supplement and is not intended for human or animal use, consumption, diagnosis, treatment, or prevention of disease. Biological mechanisms are presented only as scientific context for controlled research.";

const ETHOS_LABORATORY = "Ethos Analytics Laboratory";
const ETHOS_LOCATION = "3020 E Camelback Rd STE 397, Phoenix, AZ 85016";
const ETHOS_ACCREDITATION = "ISO/IEC 17025:2017; accreditation no. 117798";
const COA_IDENTITY_RESULT =
  "Identity confirmed by retention-time concordance with a certified reference standard under USP <621>.";
const COA_PURITY_RESULT = ">99% chromatographic purity";

const verifiedCoa = (
  record: Omit<
    CoaRecord,
    | "status"
    | "laboratory"
    | "laboratoryLocation"
    | "accreditation"
    | "method"
    | "identityResult"
    | "purityResult"
    | "signedBy"
    | "scopeNote"
  >,
): CoaRecord => ({
  status: "verified",
  laboratory: ETHOS_LABORATORY,
  laboratoryLocation: ETHOS_LOCATION,
  accreditation: ETHOS_ACCREDITATION,
  method: "HPLC",
  identityResult: COA_IDENTITY_RESULT,
  purityResult: COA_PURITY_RESULT,
  signedBy: "Noel Samsum, Laboratory Director",
  scopeNote: `This result applies only to lot ${record.lotBatch} identified in Ethos report ${record.reportId}.`,
  ...record,
});

export const VERIFIED_COAS: Record<string, CoaRecord> = {
  "retatrutide-10mg": verifiedCoa({
    reportId: "26EA0701-028", lotBatch: "A110001", sampleName: "RETA 10 MG", labeledStrength: "10 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "Retatrutide: 10.17 mg/vial", specification: "10 mg/vial",
    documentUrl: "/manus-storage/coa-retatrutide-10mg-lot-a110001_a01788db.pdf",
  }),
  "retatrutide-30mg": verifiedCoa({
    reportId: "26EA0701-027", lotBatch: "A100001", sampleName: "RETA 30 MG", labeledStrength: "30 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "Retatrutide: 30.64 mg/vial", specification: "30 mg/vial",
    documentUrl: "/manus-storage/coa-retatrutide-30mg-lot-a100001_6e590ff9.pdf",
  }),
  "tirzepatide-20mg": verifiedCoa({
    reportId: "26EA0729-039", lotBatch: "N100001", sampleName: "TIRZEPATIDE 20 MG", labeledStrength: "20 mg/vial",
    receivedDate: "2026-07-30", completedDate: "2026-08-04", testedDate: "2026-08-04",
    contentResult: "Tirzepatide: 20.42 mg/vial", specification: "20 mg/vial",
    documentUrl: "/manus-storage/coa-tirzepatide-20mg-lot-n100001_627e3fcd.pdf",
  }),
  "tirzepatide-40mg": verifiedCoa({
    reportId: "26EA0729-040", lotBatch: "P100001", sampleName: "TIRZEPATIDE 40 MG", labeledStrength: "40 mg/vial",
    receivedDate: "2026-07-30", completedDate: "2026-08-04", testedDate: "2026-08-04",
    contentResult: "Tirzepatide: 40.69 mg/vial", specification: "40 mg/vial",
    documentUrl: "/manus-storage/coa-tirzepatide-40mg-lot-p100001_2a7595b1.pdf",
  }),
  "cjc1295-ipamorelin-10mg": verifiedCoa({
    reportId: "26EA0701-034", lotBatch: "E100001", sampleName: "CJC-1295 / IPAMORELIN W/O DAC 10 MG", labeledStrength: "5/5 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "CJC-1295 (No DAC) / Ipamorelin: 5.19 / 5.12 mg/vial", specification: "5/5 mg/vial",
    documentUrl: "/manus-storage/coa-cjc1295-ipamorelin-5-5mg-lot-e100001_beb4b0e6.pdf",
  }),
  "sermorelin-10mg": verifiedCoa({
    reportId: "26EA0701-040", lotBatch: "K100001", sampleName: "SEMORELIN 10 MG", labeledStrength: "10 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "Sermorelin: 10.25 mg/vial", specification: "10 mg/vial",
    documentUrl: "/manus-storage/coa-sermorelin-10mg-lot-k100001_4a396cad.pdf",
  }),
  "tesamorelin-10mg": verifiedCoa({
    reportId: "26EA0729-042", lotBatch: "T100001", sampleName: "TESAMORELIN", labeledStrength: "10 mg/vial",
    receivedDate: "2026-07-30", completedDate: "2026-08-04", testedDate: "2026-08-04",
    contentResult: "Tesamorelin: 10.04 mg/vial", specification: "10 mg/vial",
    documentUrl: "/manus-storage/coa-tesamorelin-10mg-lot-t100001_876b6e00.pdf",
  }),
  "bpc157-tb500-wolverine": verifiedCoa({
    reportId: "26EA0701-032", lotBatch: "C1000001", sampleName: "BPC-157 / TB-500 10/10 MG", labeledStrength: "10/10 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "BPC-157 / TB-500 (TB4): 10.14 / 10.21 mg/vial", specification: "10/10 mg/vial",
    documentUrl: "/manus-storage/coa-bpc157-tb500-10-10mg-lot-c1000001_94f96d97.pdf",
  }),
  "ghk-cu-bpc157-tb500-glow": verifiedCoa({
    reportId: "26EA0701-035", lotBatch: "F100001", sampleName: "GLOW 70 MG", labeledStrength: "50/10/10 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "GHK-Cu / BPC-157 / TB-500 (TB4): 51.16 / 10.14 / 10.26 mg/vial", specification: "50/10/10 mg/vial",
    documentUrl: "/manus-storage/coa-glow-70mg-lot-f100001_016de57d.pdf",
  }),
  "ghk-cu-tb500-bpc157-kpv-klow": verifiedCoa({
    reportId: "26EA0729-043", lotBatch: "M100001", sampleName: "KLOW 80 MG", labeledStrength: "50/10/10/10 mg/vial",
    receivedDate: "2026-07-30", completedDate: "2026-08-04", testedDate: "2026-08-04",
    contentResult: "GHK-Cu / BPC-157 / TB4 / KPV: 51.26 / 9.94 / 10.15 / 10.02 mg/vial", specification: "50/10/10/10 mg/vial",
    documentUrl: "/manus-storage/coa-klow-80mg-lot-m100001_cb138e83.pdf",
  }),
  "nad-500mg": verifiedCoa({
    reportId: "26EA0701-029", lotBatch: "B100001", sampleName: "NAD+ 500 MG", labeledStrength: "500 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "NAD+: 536.29 mg/vial", specification: "500 mg/vial",
    documentUrl: "/manus-storage/coa-nad-plus-500mg-lot-b100001_5aeb0a2d.pdf",
  }),
  "mots-c-10mg": verifiedCoa({
    reportId: "26EA0701-036", lotBatch: "G100001", sampleName: "MOTS-C 10 MG", labeledStrength: "10 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "MOTS-C: 10.09 mg/vial", specification: "10 mg/vial",
    documentUrl: "/manus-storage/coa-mots-c-10mg-lot-g100001_b1cf08cd.pdf",
  }),
  "ss-31-50mg": verifiedCoa({
    reportId: "26EA0729-041", lotBatch: "S10001", sampleName: "SS-31 50 MG", labeledStrength: "50 mg/vial",
    receivedDate: "2026-07-30", completedDate: "2026-08-04", testedDate: "2026-08-04",
    contentResult: "SS-31: 51.22 mg/vial", specification: "50 mg/vial",
    documentUrl: "/manus-storage/coa-ss31-50mg-lot-s10001_f5ec592d.pdf",
  }),
  "ghk-cu-100mg": verifiedCoa({
    reportId: "26EA0701-033", lotBatch: "D100001", sampleName: "GHK-CU 100 MG", labeledStrength: "100 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "GHK-Cu: 110.89 mg/vial", specification: "100 mg/vial",
    documentUrl: "/manus-storage/coa-ghk-cu-100mg-lot-d100001_acdd597c.pdf",
  }),
  "kisspeptin-10mg": verifiedCoa({
    reportId: "26EA0701-037", lotBatch: "H100001", sampleName: "KISSPEPTIN 10 MG", labeledStrength: "10 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "Kisspeptin: 10.27 mg/vial", specification: "10 mg/vial",
    documentUrl: "/manus-storage/coa-kisspeptin-10mg-lot-h100001_490872d6.pdf",
  }),
  "semax-10mg": verifiedCoa({
    reportId: "26EA0701-039", lotBatch: "J1000001", sampleName: "SEMAX 10 MG", labeledStrength: "10 mg/vial",
    receivedDate: "2026-07-01", completedDate: "2026-07-10", testedDate: "2026-07-10",
    contentResult: "Semax: 10.18 mg/vial", specification: "10 mg/vial",
    documentUrl: "/manus-storage/coa-semax-10mg-lot-j1000001_2aed3954.pdf",
  }),
};

const retatrutideResearch = {
  tagline:
    "Triple-receptor research peptide for integrated GLP-1, GIP, and glucagon signaling models",
  synopsis:
    "An engineered multi-receptor peptide studied as a laboratory tool for coordinated metabolic signaling, receptor pharmacology, and energy-regulation pathway research.",
  plainEnglish:
    "Retatrutide is an engineered peptide investigated for simultaneous activity at the GLP-1, GIP, and glucagon receptors. Its triple-agonist profile allows qualified researchers to examine how three related endocrine signaling systems interact in a single experimental model. The compound is relevant to receptor-binding studies, second-messenger assays, structure-activity research, and controlled investigations of cellular nutrient sensing, lipid handling, and energy-regulation pathways. The 10 mg and 30 mg products contain the same research compound at different labeled vial strengths.",
  howItWorks:
    "In receptor and cell-based models, retatrutide engages GLP-1R, GIPR, and GCGR. These G-protein-coupled receptors influence cAMP-dependent signaling and downstream pathways involved in nutrient-responsive endocrine communication and energy regulation. The scientific interest lies in the combined signaling profile: GLP-1 and GIP receptor activation can be compared with concurrent glucagon-receptor activity to study receptor balance, pathway cross-talk, potency, and biased signaling. Exact analytical identity and compound form should be confirmed against the matched product COA.",
  whoIsItFor:
    "Appropriate laboratory investigation areas include multi-receptor agonism, GLP-1/GIP/glucagon receptor pharmacology, cAMP signaling, peptide structure-activity relationships, metabolic signaling, lipid-oxidation pathways, and analytical comparison of incretin-based research compounds. For qualified in-vitro laboratory research only.",
  benefits: [
    "Triple GLP-1, GIP, and glucagon receptor-pathway research",
    "Multi-receptor binding and signaling comparisons",
    "cAMP and downstream second-messenger assays",
    "Metabolic signaling and cellular energy-regulation models",
    "Peptide structure-activity and stability investigations",
    "Cross-pathway interaction and receptor-balance studies",
  ],
  researchClassification: "Engineered triple GLP-1/GIP/glucagon receptor agonist research peptide",
  references: [
    {
      title: "Structural insights into retatrutide triple agonism",
      url: "https://www.nature.com/articles/s41421-024-00700-0",
    },
    {
      title: "PubChem retatrutide search",
      url: "https://pubchem.ncbi.nlm.nih.gov/#query=retatrutide",
    },
  ],
};

const tirzepatideResearch = {
  tagline: "Dual GIP and GLP-1 receptor agonist for incretin-pathway research",
  synopsis:
    "A 39-amino-acid synthetic peptide used in laboratory models of dual incretin receptor pharmacology, biased signaling, and coordinated metabolic-pathway research.",
  plainEnglish:
    "Tirzepatide is a synthetic 39-amino-acid peptide engineered to activate both the glucose-dependent insulinotropic polypeptide receptor (GIPR) and glucagon-like peptide-1 receptor (GLP-1R). The dual-receptor profile makes it a useful reference compound for comparing receptor affinity, cAMP signaling, beta-arrestin recruitment, and structure-activity relationships across incretin pathways. The 20 mg and 40 mg products contain the same research compound at different labeled vial strengths.",
  howItWorks:
    "Tirzepatide binds GIPR and GLP-1R, activating Gs-coupled signaling and intracellular cAMP generation. Published receptor studies describe an imbalanced dual-agonist profile and biased signaling at GLP-1R, which supports controlled investigation of how receptor affinity and signaling preference affect downstream cellular responses. Its lipidated structure includes a C20 fatty diacid moiety associated with albumin binding and extended stability in biological systems; laboratory studies can examine receptor kinetics, pathway selectivity, and peptide design.",
  whoIsItFor:
    "Appropriate laboratory investigation areas include GIPR/GLP-1R binding, incretin receptor cross-talk, cAMP signaling, beta-arrestin recruitment, cellular nutrient-response pathways, peptide lipidation, albumin-binding models, and comparative structure-activity research. For qualified in-vitro laboratory research only.",
  benefits: [
    "Dual GIP and GLP-1 receptor-pathway research",
    "Receptor binding-affinity and kinetic assays",
    "cAMP and beta-arrestin signaling comparisons",
    "Incretin-pathway cross-talk investigations",
    "Lipidated peptide structure-activity studies",
    "Cellular metabolic-signaling research models",
  ],
  researchClassification: "Synthetic 39-amino-acid dual GIP/GLP-1 receptor agonist",
  molecularData: {
    molecularFormula: "C225H348N48O68",
    molecularWeight: "4813 g/mol",
    casNumber: "2023788-19-2",
    pubchemCid: "156588324",
    sequence: "39-amino-acid GIP-derived peptide with modified residues and a C20 fatty-diacid moiety",
    storage: STANDARD_HANDLING,
    form: "Lyophilized research material",
  },
  references: [
    {
      title: "PubChem: Tirzepatide",
      url: "https://pubchem.ncbi.nlm.nih.gov/compound/156588324",
    },
    {
      title: "Tirzepatide dual-receptor and biased-signaling study",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7526454/",
    },
  ],
};

export const products: Product[] = [
  // GLP products appear first by owner request.
  {
    id: "retatrutide-10mg",
    name: "Retatrutide",
    content: "10 mg per vial",
    category: "GLP",
    isStack: false,
    ...retatrutideResearch,
    price: "$150",
    badge: "Triple Agonist",
    variants: [{ label: "10 mg", price: "$150", content: "10 mg per vial" }],
    molecularData: {
      sequence: "Engineered GLP-1/GIP/glucagon receptor peptide; exact compound form per matched COA",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    handling: STANDARD_HANDLING,
    coa: VERIFIED_COAS["retatrutide-10mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/Reta10Mg_c8429e02-optimized_a621611b.webp"],
  },
  {
    id: "retatrutide-30mg",
    name: "Retatrutide",
    content: "30 mg per vial",
    category: "GLP",
    isStack: false,
    ...retatrutideResearch,
    price: "$200",
    badge: "Triple Agonist",
    variants: [{ label: "30 mg", price: "$200", content: "30 mg per vial" }],
    molecularData: {
      sequence: "Engineered GLP-1/GIP/glucagon receptor peptide; exact compound form per matched COA",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    handling: STANDARD_HANDLING,
    coa: VERIFIED_COAS["retatrutide-30mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/Reta30BlueFinal_a4815d6f-optimized_40b4c2a1.webp"],
  },
  {
    id: "tirzepatide-20mg",
    name: "Tirzepatide",
    content: "20 mg per vial",
    category: "GLP",
    isStack: false,
    ...tirzepatideResearch,
    price: "$175",
    badge: "Dual Agonist",
    variants: [{ label: "20 mg", price: "$175", content: "20 mg per vial" }],
    handling: STANDARD_HANDLING,
    coa: VERIFIED_COAS["tirzepatide-20mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/Tirzepatide20mg_6cd95bb5-optimized_47994734.webp"],
  },
  {
    id: "tirzepatide-40mg",
    name: "Tirzepatide",
    content: "40 mg per vial",
    category: "GLP",
    isStack: false,
    ...tirzepatideResearch,
    price: "$200",
    badge: "Dual Agonist",
    variants: [{ label: "40 mg", price: "$200", content: "40 mg per vial" }],
    handling: STANDARD_HANDLING,
    coa: VERIFIED_COAS["tirzepatide-40mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/Tirzepatide40mg_7e16f7e2-optimized_7ee57055.webp"],
  },

  // HGH activators appear second by owner request.
  {
    id: "cjc1295-ipamorelin-10mg",
    name: "CJC-1295 + Ipamorelin",
    content: "10 mg per vial",
    detailContent: "5 mg CJC-1295 / 5 mg Ipamorelin",
    category: "HGH Activators",
    isStack: true,
    stackName: "GH Synergy",
    tagline: "Dual-pathway GHRH and ghrelin-receptor research blend",
    synopsis:
      "A 5/5 mg peptide blend for controlled investigation of complementary GHRH-receptor and growth-hormone-secretagogue-receptor signaling.",
    plainEnglish:
      "This research blend combines CJC-1295, a growth hormone-releasing hormone analogue, with Ipamorelin, a selective growth hormone secretagogue receptor ligand. The pairing gives researchers a single formulation for comparing two upstream pathways associated with somatotroph signaling. Because CJC-1295 materials can differ by modification and affinity-complex status, the exact CJC form must be confirmed against the matched COA rather than assumed from the product name alone.",
    howItWorks:
      "CJC-1295 is studied at the GHRH receptor, where receptor activation can increase cAMP-dependent signaling in somatotroph models. Ipamorelin is studied at GHSR-1a, a ghrelin-family receptor linked to phospholipase-C and calcium-mobilization pathways. In combination, the components support experiments comparing parallel receptor activation, pathway cross-talk, secretagogue selectivity, and downstream GH/IGF-1-axis signaling. A blend does not have a single valid molecular formula, CAS number, molecular weight, or PubChem CID.",
    whoIsItFor:
      "Appropriate investigation areas include GHRH-receptor pharmacology, GHSR-1a signaling, cAMP and calcium-mobilization assays, pituitary cell models, receptor cross-talk, and comparative secretagogue research. For qualified in-vitro laboratory research only.",
    benefits: [
      "Complementary GHRH and GHSR-1a pathway research",
      "Somatotroph receptor-signaling models",
      "cAMP and calcium-mobilization assay design",
      "Growth-hormone secretagogue selectivity studies",
      "GH/IGF-1-axis pathway investigations",
      "Multi-component receptor cross-talk research",
    ],
    price: "$80",
    badge: "Signature Blend",
    molecularData: {
      sequence: "Two-component peptide blend; component identity and exact CJC form per matched COA",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research blend",
    },
    researchClassification: "GHRH analogue and selective GHSR-1a ligand research blend",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: CJC-1295", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Cjc-1295" },
      { title: "PubChem: Ipamorelin", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Ipamorelin" },
      { title: "Ipamorelin selectivity study", url: "https://pubmed.ncbi.nlm.nih.gov/9849822/" },
    ],
    coa: VERIFIED_COAS["cjc1295-ipamorelin-10mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/CJCIpamoreline10Mg_5d73519c-optimized_0bd8d7ec.webp"],
  },
  {
    id: "sermorelin-10mg",
    name: "Sermorelin",
    content: "10 mg per vial",
    category: "HGH Activators",
    isStack: false,
    tagline: "GHRH(1-29) analogue for somatotropic-axis research",
    synopsis:
      "A synthetic 29-amino-acid GHRH fragment used to investigate GHRH-receptor signaling, pituitary cell responses, and GH/IGF-1-axis regulation.",
    plainEnglish:
      "Sermorelin corresponds to the biologically active N-terminal 1-29 fragment of human growth hormone-releasing hormone. In controlled laboratory systems it is used as a defined receptor ligand for studying the somatotropic axis, GHRH-receptor binding, pituitary-cell signaling, and transcriptional responses associated with growth-hormone synthesis. Its defined sequence makes it useful for comparative work involving other GHRH analogues and secretagogue classes.",
    howItWorks:
      "Sermorelin binds the GHRH receptor on somatotroph models and activates adenylyl cyclase, increasing intracellular cAMP and downstream protein-kinase signaling. Laboratory studies use this pathway to examine receptor activation, gene transcription, secretory dynamics, and feedback interactions within the GH/IGF-1 axis. Mechanistic descriptions are provided for research context only and do not constitute human-use guidance.",
    whoIsItFor:
      "Appropriate investigation areas include GHRH-receptor pharmacology, cAMP signaling, somatotroph cell biology, GH/IGF-1-axis models, peptide sequence-function comparisons, and neuroendocrine feedback research. For qualified in-vitro laboratory research only.",
    benefits: [
      "Defined GHRH(1-29) receptor-ligand research",
      "Pituitary somatotroph signaling models",
      "cAMP and downstream kinase assays",
      "GH/IGF-1-axis pathway investigations",
      "Neuroendocrine feedback research",
      "Comparative GHRH-analogue studies",
    ],
    price: "$75",
    badge: "GHRH Analogue",
    molecularData: {
      molecularFormula: "C149H246N44O42S",
      molecularWeight: "3357.9 g/mol",
      casNumber: "86168-78-7",
      pubchemCid: "16132413",
      sequence: "YADAIFTNSYRKVLGQLSARKLLQDIMSR",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    researchClassification: "Synthetic 29-amino-acid GHRH(1-29) analogue",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: Sermorelin", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Sermorelin" },
      { title: "NCBI review of sermorelin and the GH axis", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2699646/" },
    ],
    coa: VERIFIED_COAS["sermorelin-10mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/semerelin10_648172ea-optimized_5d70044e.webp"],
  },
  {
    id: "tesamorelin-10mg",
    name: "Tesamorelin",
    content: "10 mg per vial",
    category: "HGH Activators",
    isStack: false,
    tagline: "Stabilized GHRH analogue for receptor and peptide-stability research",
    synopsis:
      "A stabilized 44-amino-acid GHRH analogue studied in laboratory models of GHRH-receptor activation, cAMP signaling, and peptide stability.",
    plainEnglish:
      "Tesamorelin is a synthetic 44-amino-acid analogue of human growth hormone-releasing hormone. An N-terminal trans-3-hexenoyl modification distinguishes it from the native sequence and supports laboratory comparison of peptide stability and receptor interaction. Researchers use tesamorelin as a defined GHRH-receptor ligand in cellular assays involving anterior pituitary signaling and downstream GH/IGF-1-axis pathways.",
    howItWorks:
      "Tesamorelin acts as an agonist at the GHRH receptor, a G-protein-coupled receptor associated with adenylyl-cyclase activation and increased intracellular cAMP. Downstream protein-kinase signaling can be studied in pituitary-cell models alongside transcriptional and secretory responses. Its stabilized N-terminal structure also supports structure-activity and proteolytic-stability comparisons with native GHRH and shorter analogues such as sermorelin.",
    whoIsItFor:
      "Appropriate investigation areas include GHRH-receptor binding, cAMP signaling, peptide stability, anterior-pituitary cell models, GH/IGF-1-axis pathway research, and comparative structure-activity studies. For qualified in-vitro laboratory research only.",
    benefits: [
      "Defined GHRH-receptor agonist research",
      "44-amino-acid peptide structure studies",
      "N-terminal stabilization comparisons",
      "cAMP and protein-kinase pathway assays",
      "Pituitary-cell signaling investigations",
      "Comparative GHRH-analogue research",
    ],
    price: "$70",
    badge: "GHRH Analogue",
    molecularData: {
      molecularFormula: "C221H366N72O67S",
      molecularWeight: "5136 g/mol",
      casNumber: "218949-48-5",
      pubchemCid: "16137828",
      sequence: "YADAIFTNSYRKVLGQLSARKLLQDIMSRQQGESNQERGARARL",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    researchClassification: "Stabilized synthetic 44-amino-acid GHRH analogue",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: Tesamorelin", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Tesamorelin" },
      { title: "NCBI LiverTox: Tesamorelin", url: "https://www.ncbi.nlm.nih.gov/books/NBK548730/" },
    ],
    coa: VERIFIED_COAS["tesamorelin-10mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/Tesamorelin10Mg_9758abb9-optimized_047809a9.webp"],
  },

  // Signature blends.
  {
    id: "bpc157-tb500-wolverine",
    name: "BPC-157 / TB-500 Blend",
    content: "20 mg per vial",
    detailContent: "10 mg BPC-157 / 10 mg TB-500",
    category: "Signature Blends",
    isStack: true,
    stackName: "Wolverine Stack",
    tagline: "Dual-peptide blend for tissue-signaling and cell-migration research",
    synopsis:
      "A 10/10 mg research blend designed for controlled investigation of complementary BPC-157 and TB-500 pathways in cellular repair models.",
    plainEnglish:
      "The Wolverine Stack combines two distinct research peptides in one labeled 20 mg vial: 10 mg BPC-157 and 10 mg TB-500. BPC-157 is a synthetic pentadecapeptide investigated in cellular protection, growth-factor signaling, and endothelial models. TB-500 is a synthetic thymosin-beta-4-related research peptide associated with actin dynamics and cell migration. The formulation allows researchers to study component interactions in a controlled multi-peptide system.",
    howItWorks:
      "BPC-157 is investigated in relation to nitric-oxide signaling, endothelial responses, and growth-factor pathways such as VEGF. TB-500-related research focuses on actin sequestration, cytoskeletal dynamics, and cellular migration. The blend can support multi-pathway experiments involving angiogenic signaling, fibroblast behavior, extracellular-matrix responses, and inflammatory markers. Because it is a mixture, a single combined formula, CAS number, molecular weight, or PubChem CID is not scientifically appropriate.",
    whoIsItFor:
      "Appropriate investigation areas include cell migration, actin dynamics, endothelial signaling, fibroblast models, extracellular-matrix biology, angiogenic pathways, and multi-component peptide interaction studies. For qualified in-vitro laboratory research only.",
    benefits: [
      "Defined 10/10 mg dual-component research blend",
      "Cell migration and actin-dynamics studies",
      "Endothelial and angiogenic signaling models",
      "Fibroblast and extracellular-matrix investigations",
      "Nitric-oxide and growth-factor pathway research",
      "Multi-peptide interaction assays",
    ],
    price: "$100",
    badge: "Signature Blend",
    molecularData: {
      sequence: "BPC-157 and TB-500 research blend; component identifiers per matched COA",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research blend",
    },
    researchClassification: "Two-component BPC-157 and TB-500 research blend",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: BPC-157", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Bpc-157" },
      { title: "Thymosin beta-4 research review", url: "https://pubmed.ncbi.nlm.nih.gov/22074294/" },
    ],
    coa: VERIFIED_COAS["bpc157-tb500-wolverine"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/Wolverine1010_55ef84ca-optimized_1961bbb6.webp"],
  },
  {
    id: "ghk-cu-bpc157-tb500-glow",
    name: "GHK-Cu + BPC-157 + TB-500",
    content: "70 mg total blend per vial",
    detailContent: "GHK-Cu / BPC-157 / TB-500; component allocation per matched COA",
    category: "Signature Blends",
    isStack: true,
    stackName: "Glow Stack",
    tagline: "Three-component blend for extracellular-matrix and cell-migration research",
    synopsis:
      "A 70 mg total research blend combining GHK-Cu, BPC-157, and TB-500 for controlled multi-pathway cellular investigations.",
    plainEnglish:
      "The GLOW Blend combines GHK-Cu, BPC-157, and TB-500 in one 70 mg total vial. GHK-Cu is a copper-binding tripeptide complex studied in extracellular-matrix and redox biology. BPC-157 is investigated in cytoprotective and endothelial-signaling models, while TB-500-related research centers on actin dynamics and cellular migration. Exact component allocation and analytical identity must be taken from the matched COA rather than inferred from total vial content.",
    howItWorks:
      "The formulation brings together three distinct research pathways: GHK-Cu-associated copper transport and matrix regulation, BPC-157-associated endothelial and growth-factor signaling, and TB-500-associated actin and cell-migration dynamics. In-vitro systems can examine whether combined exposure changes fibroblast behavior, collagen-associated signaling, oxidative-stress responses, or endothelial migration. A blend does not have a single valid molecular formula or identifier.",
    whoIsItFor:
      "Appropriate investigation areas include extracellular-matrix biology, fibroblast migration, collagen-associated signaling, cellular redox responses, endothelial models, actin dynamics, and multi-component interaction assays. For qualified in-vitro laboratory research only.",
    benefits: [
      "Three-component multi-pathway research blend",
      "Extracellular-matrix and fibroblast studies",
      "Copper-transport and redox-pathway research",
      "Endothelial and cell-migration models",
      "Actin-dynamics investigations",
      "Controlled blend-interaction assays",
    ],
    price: "$120",
    badge: "Signature Blend",
    molecularData: {
      sequence: "GHK-Cu, BPC-157, and TB-500 blend; component allocation per matched COA",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research blend",
    },
    researchClassification: "Three-component GHK-Cu, BPC-157, and TB-500 research blend",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: GHK-Cu", url: "https://pubchem.ncbi.nlm.nih.gov/compound/GHK-Cu" },
      { title: "PubChem: BPC-157", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Bpc-157" },
      { title: "PubChem: TB-500 salt", url: "https://pubchem.ncbi.nlm.nih.gov/compound/TB-500-Trifluoroacetic-Salt" },
    ],
    coa: VERIFIED_COAS["ghk-cu-bpc157-tb500-glow"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/GLOW70MG_ffa067ff-optimized_decb6517.webp"],
  },
  {
    id: "ghk-cu-tb500-bpc157-kpv-klow",
    name: "GHK-Cu + TB-500 + BPC-157 + KPV",
    content: "80 mg total blend per vial",
    detailContent: "GHK-Cu / TB-500 / BPC-157 / KPV; component allocation per matched COA",
    category: "Signature Blends",
    isStack: true,
    stackName: "KLOW Blend",
    tagline: "Four-component blend for matrix, migration, and inflammatory-signaling research",
    synopsis:
      "An 80 mg total research blend combining GHK-Cu, TB-500, BPC-157, and the KPV tripeptide for multi-pathway cellular models.",
    plainEnglish:
      "The KLOW Blend combines four research components in one 80 mg total vial. GHK-Cu is studied in copper transport and extracellular-matrix regulation; TB-500-related research addresses actin dynamics and cell migration; BPC-157 is investigated in endothelial and cytoprotective signaling; and KPV is the Lys-Pro-Val tripeptide corresponding to alpha-MSH residues 11-13 and studied in inflammatory-signaling models. Exact component allocation must be confirmed against the matched COA.",
    howItWorks:
      "The components provide distinct experimental targets. GHK-Cu can influence matrix-associated and redox pathways; TB-500 supports actin and migration research; BPC-157 is investigated in nitric-oxide, endothelial, and growth-factor models; and KPV has been studied in relation to inflammatory mediators and melanocortin-derived signaling. The combined formulation can be used to explore pathway interaction in controlled cellular systems. A single combined molecular formula or PubChem identifier is not appropriate for this blend.",
    whoIsItFor:
      "Appropriate investigation areas include extracellular-matrix remodeling, cell migration, endothelial signaling, inflammatory-marker assays, barrier-model research, redox biology, and multi-peptide interaction studies. For qualified in-vitro laboratory research only.",
    benefits: [
      "Four-component multi-pathway research blend",
      "Extracellular-matrix and collagen-associated studies",
      "Actin and cellular-migration investigations",
      "Endothelial and growth-factor signaling models",
      "KPV inflammatory-pathway research",
      "Controlled multi-component interaction assays",
    ],
    price: "$130",
    badge: "Signature Blend",
    molecularData: {
      sequence: "GHK-Cu / TB-500 / BPC-157 / KPV multi-component blend; allocation per matched COA",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research blend",
    },
    researchClassification: "Four-component GHK-Cu, TB-500, BPC-157, and KPV research blend",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: GHK-Cu", url: "https://pubchem.ncbi.nlm.nih.gov/compound/GHK-Cu" },
      { title: "PubChem: BPC-157", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Bpc-157" },
      { title: "PubMed: KPV research", url: "https://pubmed.ncbi.nlm.nih.gov/18092346/" },
    ],
    coa: VERIFIED_COAS["ghk-cu-tb500-bpc157-kpv-klow"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/Klow80MG_329db60a-optimized_e152532d.webp"],
  },

  // Mitochondrial and metabolic research compounds.
  {
    id: "nad-500mg",
    name: "NAD+",
    content: "500 mg per vial",
    category: "Mitochondrial",
    isStack: false,
    tagline: "Dinucleotide coenzyme for redox and cellular-energy research",
    synopsis:
      "A central cellular coenzyme used in laboratory studies of redox chemistry, mitochondrial metabolism, DNA-repair enzymes, and NAD+-dependent signaling.",
    plainEnglish:
      "Nicotinamide adenine dinucleotide (NAD+) is a dinucleotide coenzyme present across living systems. In biochemical research it is studied in its oxidized and reduced forms as an electron carrier in cellular metabolism. NAD+ is also a substrate for enzymes including sirtuins, poly(ADP-ribose) polymerases, and CD38-family enzymes, making it relevant to controlled investigations of mitochondrial function, redox balance, DNA-repair signaling, and cellular stress responses.",
    howItWorks:
      "NAD+ accepts and transfers electrons in metabolic reactions and is reduced to NADH during redox cycling. It also participates as a consumed substrate in sirtuin deacetylation, PARP-dependent ADP-ribosylation, and cyclic ADP-ribose signaling. Laboratory systems can measure how NAD+ availability affects enzyme activity, mitochondrial respiration, oxidative stress, and gene-regulatory pathways. NAD+ is a coenzyme rather than a peptide.",
    whoIsItFor:
      "Appropriate investigation areas include redox biochemistry, mitochondrial respiration, sirtuin and PARP enzyme assays, DNA-repair signaling, cellular stress models, and NAD+-metabolism research. For qualified in-vitro laboratory research only.",
    benefits: [
      "Oxidized/reduced coenzyme cycling research",
      "Mitochondrial respiration and bioenergetics assays",
      "Sirtuin and PARP substrate investigations",
      "DNA-repair signaling research",
      "Cellular redox-balance models",
      "NAD+-metabolism pathway studies",
    ],
    price: "$100",
    badge: "Coenzyme",
    molecularData: {
      molecularFormula: "C21H27N7O14P2",
      molecularWeight: "663.4 g/mol",
      casNumber: "53-84-9",
      pubchemCid: "5892",
      sequence: "Dinucleotide coenzyme; not a peptide",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    researchClassification: "Oxidized nicotinamide adenine dinucleotide coenzyme",
    handling: STANDARD_HANDLING,
    references: [{ title: "PubChem: NAD+", url: "https://pubchem.ncbi.nlm.nih.gov/compound/5892" }],
    coa: VERIFIED_COAS["nad-500mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/NAD-Plus-500mg_96c2d34f-optimized_4c0dc5da.webp"],
  },
  {
    id: "mots-c-10mg",
    name: "MOTS-C",
    content: "10 mg per vial",
    category: "Mitochondrial",
    isStack: false,
    tagline: "Mitochondrial-derived peptide for AMPK and stress-response research",
    synopsis:
      "A 16-amino-acid mitochondrial-derived peptide investigated in cellular energy sensing, AMPK signaling, and mitochondria-to-nucleus communication.",
    plainEnglish:
      "MOTS-C is a 16-amino-acid mitochondrial-derived peptide encoded within the mitochondrial 12S rRNA region. It is used in laboratory research to study how mitochondria communicate with the nucleus during metabolic stress. Cellular models investigate its relationship to energy sensing, glucose-utilization pathways, stress-response transcription, and mitochondrial adaptation.",
    howItWorks:
      "Research describes MOTS-C as an AMPK-associated signaling peptide capable of nuclear translocation during metabolic stress. In the nucleus it has been investigated for interactions with transcriptional programs involved in antioxidant defense, cellular homeostasis, and metabolic adaptation. Laboratory work can examine AMPK activation, mitochondrial-nuclear signaling, glucose-uptake pathways, and changes in stress-responsive gene expression.",
    whoIsItFor:
      "Appropriate investigation areas include AMPK signaling, mitochondrial biology, cellular energy homeostasis, metabolic-stress models, mitochondria-to-nucleus communication, and stress-responsive gene-expression research. For qualified in-vitro laboratory research only.",
    benefits: [
      "Mitochondrial-derived peptide research",
      "AMPK pathway investigations",
      "Mitochondria-to-nucleus signaling studies",
      "Cellular energy-sensing models",
      "Metabolic-stress response assays",
      "Stress-responsive transcription research",
    ],
    price: "$70",
    badge: "Mitochondrial",
    molecularData: {
      molecularFormula: "C101H152N28O22S2",
      molecularWeight: "2174.6 g/mol",
      casNumber: "1627580-64-6",
      pubchemCid: "155885767",
      sequence: "MRWQEMGYIFYPRKLR",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    researchClassification: "16-amino-acid mitochondrial-derived peptide",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: MOTS-C", url: "https://pubchem.ncbi.nlm.nih.gov/compound/MOTS-c-_human" },
      { title: "NCBI review of MOTS-C", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9905433/" },
    ],
    coa: VERIFIED_COAS["mots-c-10mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/MOTSC10_eb4d383a-optimized_53fa8b2f.webp"],
  },
  {
    id: "ss-31-50mg",
    name: "SS-31",
    content: "50 mg per vial",
    detailContent: "50 mg Elamipretide (SS-31) per vial",
    category: "Mitochondrial",
    isStack: false,
    tagline: "Cardiolipin-binding tetrapeptide for mitochondrial research",
    synopsis:
      "A mitochondria-targeted aromatic-cationic tetrapeptide used to investigate cardiolipin interactions, inner-membrane structure, and cellular bioenergetics.",
    plainEnglish:
      "SS-31, also known as elamipretide, is a synthetic tetrapeptide designed to localize at the inner mitochondrial membrane. Its small aromatic-cationic structure and affinity for cardiolipin make it a defined research tool for examining mitochondrial membrane organization, cristae morphology, electron-transport efficiency, reactive-oxygen-species generation, and cellular bioenergetics under controlled conditions.",
    howItWorks:
      "SS-31 is studied for binding to cardiolipin, a phospholipid concentrated in the inner mitochondrial membrane. This interaction is investigated in relation to cristae organization, electron-transport-chain efficiency, ATP-production pathways, and reactive-oxygen-species handling. Cell-based research can examine mitochondrial membrane potential, oxidative-stress responses, cytochrome-c behavior, and apoptosis-associated signaling without treating the compound as a clinical product.",
    whoIsItFor:
      "Appropriate investigation areas include cardiolipin binding, mitochondrial membrane structure, cristae morphology, electron-transport-chain function, ATP-pathway assays, oxidative-stress models, and apoptosis-associated signaling. For qualified in-vitro laboratory research only.",
    benefits: [
      "Mitochondria-targeted tetrapeptide research",
      "Cardiolipin-binding investigations",
      "Inner-membrane and cristae-structure models",
      "Electron-transport and ATP-pathway assays",
      "Reactive-oxygen-species research",
      "Mitochondrial stress-response studies",
    ],
    price: "$70",
    badge: "Mitochondrial",
    molecularData: {
      molecularFormula: "C32H49N9O5",
      molecularWeight: "639.8 g/mol",
      casNumber: "736992-21-5",
      pubchemCid: "11764719",
      sequence: "D-Arg-Dmt-Lys-Phe-NH2",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    researchClassification: "Mitochondria-targeted aromatic-cationic tetrapeptide",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: Elamipretide (SS-31)", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Elamipretide" },
      { title: "NCBI review of elamipretide", url: "https://pubmed.ncbi.nlm.nih.gov/39940712/" },
    ],
    coa: VERIFIED_COAS["ss-31-50mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/ss-3150Mg_e5197e43-optimized_98b362f8.webp"],
  },

  // Remaining focused research categories.
  {
    id: "ghk-cu-100mg",
    legacyIds: ["ghk-cu-50mg"],
    name: "GHK-Cu",
    content: "100 mg per vial",
    category: "Regenerative",
    isStack: false,
    tagline: "Copper-binding tripeptide complex for matrix and redox research",
    synopsis:
      "A copper complex of glycyl-L-histidyl-L-lysine used in laboratory investigations of extracellular-matrix regulation, copper transport, and cellular redox signaling.",
    plainEnglish:
      "GHK-Cu is the copper(II) complex of the tripeptide glycyl-L-histidyl-L-lysine. In controlled research it is used to examine copper transport, extracellular-matrix regulation, fibroblast responses, collagen-associated signaling, metalloproteinase activity, and cellular redox balance. Because commercial materials may differ by salt, hydration state, and complex form, exact molecular identifiers should follow the matched COA.",
    howItWorks:
      "GHK-Cu binds copper ions and is investigated as a biochemical signal affecting matrix-associated gene expression, collagen and glycosaminoglycan turnover, metalloproteinases, antioxidant enzymes, and cellular migration. Laboratory models can examine copper-dependent enzyme pathways, reactive-oxygen-species responses, fibroblast behavior, and extracellular-matrix remodeling. These mechanisms are presented as research context rather than product efficacy claims.",
    whoIsItFor:
      "Appropriate investigation areas include copper transport, extracellular-matrix biology, fibroblast models, collagen-associated signaling, metalloproteinase activity, redox biology, and cellular migration. For qualified in-vitro laboratory research only.",
    benefits: [
      "Copper-binding tripeptide-complex research",
      "Extracellular-matrix regulation studies",
      "Fibroblast and collagen-associated models",
      "Metalloproteinase activity investigations",
      "Cellular redox and antioxidant-pathway research",
      "Copper-dependent enzyme studies",
    ],
    price: "$80",
    badge: "Regenerative",
    molecularData: {
      sequence: "Glycyl-L-histidyl-L-lysine copper complex; exact complex form per matched COA",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    researchClassification: "Copper(II) complex of glycyl-L-histidyl-L-lysine",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem GHK-Cu search", url: "https://pubchem.ncbi.nlm.nih.gov/#query=GHK-Cu" },
      { title: "GHK-Cu research review", url: "https://www.mdpi.com/1422-0067/19/7/1987" },
    ],
    coa: VERIFIED_COAS["ghk-cu-100mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/GHKCU_6ed5c2e6-optimized_70147f0b.webp"],
  },
  {
    id: "kisspeptin-10mg",
    name: "Kisspeptin-10",
    content: "10 mg per vial",
    category: "Neuroendocrine",
    isStack: false,
    tagline: "KISS1R/GPR54 ligand for neuroendocrine signaling research",
    synopsis:
      "A 10-amino-acid kisspeptin fragment used to study KISS1R activation, calcium signaling, MAPK pathways, and hypothalamic-pituitary-gonadal-axis biology.",
    plainEnglish:
      "Kisspeptin-10 is the conserved 10-amino-acid C-terminal fragment of the KISS1 peptide family and is sufficient for activation of the KISS1R/GPR54 receptor. It is used in laboratory systems to investigate neuroendocrine signaling, receptor-ligand interactions, gonadotropin-releasing-hormone pathway biology, intracellular calcium mobilization, MAPK activation, and KISS1-associated cell-migration research.",
    howItWorks:
      "Kisspeptin-10 binds KISS1R, a Gq/11-coupled receptor. Activation can stimulate phospholipase C, generating IP3 and DAG, increasing intracellular calcium, and activating protein-kinase and MAPK pathways. Neuroendocrine models use this signaling cascade to study upstream regulation of GnRH neurons and HPG-axis communication. Additional cellular research examines KISS1-related migration and angiogenic signaling.",
    whoIsItFor:
      "Appropriate investigation areas include KISS1R pharmacology, Gq/11 signaling, calcium-mobilization assays, MAPK pathways, GnRH-neuron models, HPG-axis biology, and KISS1-associated cell-migration research. For qualified in-vitro laboratory research only.",
    benefits: [
      "Defined KISS1R/GPR54 ligand research",
      "Gq/11 and phospholipase-C pathway assays",
      "Intracellular calcium-mobilization studies",
      "MAPK and ERK signaling investigations",
      "GnRH and HPG-axis research models",
      "KISS1-associated cell-migration studies",
    ],
    price: "$80",
    badge: "Neuroendocrine",
    molecularData: {
      molecularFormula: "C63H83N17O14",
      molecularWeight: "1302.4 g/mol",
      casNumber: "374675-21-5",
      pubchemCid: "25240297",
      sequence: "Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH2",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    researchClassification: "10-amino-acid KISS1R/GPR54 receptor ligand",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: Kisspeptin-10", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Kisspeptin-10" },
      { title: "NCBI review of kisspeptin signaling", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4678402/" },
    ],
    coa: VERIFIED_COAS["kisspeptin-10mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/kisspeptin10mg_39626528-optimized_dc695724.webp"],
  },
  {
    id: "semax-10mg",
    name: "Semax",
    content: "10 mg per vial",
    category: "Cognitive",
    isStack: false,
    tagline: "ACTH-derived heptapeptide for neurotrophin-pathway research",
    synopsis:
      "A synthetic heptapeptide used in controlled studies of BDNF-associated signaling, neuroplasticity, neurotransmitter pathways, and cellular stress responses.",
    plainEnglish:
      "Semax is the synthetic heptapeptide Met-Glu-His-Phe-Pro-Gly-Pro, derived from an ACTH fragment and extended with a Pro-Gly-Pro sequence. Laboratory research uses Semax to examine neurotrophin-associated signaling, including BDNF and NGF expression, as well as cellular responses to oxidative, hypoxic, and ischemic stress. It is also studied in relation to dopaminergic and serotonergic signaling in controlled experimental models.",
    howItWorks:
      "Research models investigate Semax-associated changes in BDNF/TrkB and NGF-related signaling, neuroglial responses, and neurotransmitter-pathway activity. Studies have also examined peptide interactions with copper ions and cellular oxidative-stress systems. The mechanistic literature is heterogeneous, so the catalog presents Semax as a research probe rather than asserting a clinical effect.",
    whoIsItFor:
      "Appropriate investigation areas include BDNF and NGF signaling, neural cell stress models, neuroplasticity, dopaminergic and serotonergic pathways, neuroglial responses, peptide-copper interactions, and oxidative-stress research. For qualified in-vitro laboratory research only.",
    benefits: [
      "Defined ACTH-derived heptapeptide research",
      "BDNF and TrkB pathway investigations",
      "NGF-associated signaling studies",
      "Neural cellular-stress models",
      "Dopaminergic and serotonergic pathway research",
      "Neuroglial and peptide-copper interaction studies",
    ],
    price: "$60",
    badge: "Cognitive",
    molecularData: {
      molecularFormula: "C37H51N9O10S",
      molecularWeight: "813.9 g/mol",
      casNumber: "80714-61-0",
      pubchemCid: "9811102",
      sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
      storage: STANDARD_HANDLING,
      form: "Lyophilized research material",
    },
    researchClassification: "Synthetic ACTH-derived heptapeptide",
    handling: STANDARD_HANDLING,
    references: [
      { title: "PubChem: Semax", url: "https://pubchem.ncbi.nlm.nih.gov/compound/9811102" },
      { title: "Semax and BDNF research", url: "https://pubmed.ncbi.nlm.nih.gov/16635254/" },
    ],
    coa: VERIFIED_COAS["semax-10mg"],
    disclaimer: STANDARD_DISCLAIMER,
    images: ["/manus-storage/Semax10_cb70da9c-optimized_f11efad4.webp"],
  },
];

export const categories = [
  "All",
  "GLP",
  "HGH Activators",
  "Signature Blends",
  "Mitochondrial",
  "Regenerative",
  "Neuroendocrine",
  "Cognitive",
];

export const catalogCounts = {
  compounds: products.length,
  signatureBlends: products.filter((product) => product.isStack).length,
};

export const findProductById = (id?: string) =>
  products.find(product => product.id === id || product.legacyIds?.includes(id ?? ""));
