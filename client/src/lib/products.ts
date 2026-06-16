// === ELITE LA PEPTIDES — Product Data ===
// Enriched with detailed subpage content. Prices set.

export interface Product {
  id: string;
  name: string;
  dose: string;
  cycle: string;
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
    dose: "30mg",
    cycle: "6–7 week cycle",
    category: "Weight Loss",
    isStack: false,
    tagline: "Triple-receptor metabolic powerhouse",
    synopsis:
      "Triple-hormone receptor agonist for significant weight loss, appetite control, and improved metabolic health.",
    plainEnglish:
      "Retatrutide is one of the most advanced weight management peptides available, designed to mimic three natural hormones in your body simultaneously. While you may have heard of GLP-1 drugs like Ozempic or Wegovy, Retatrutide takes it a step further by also activating GIP and glucagon receptors. This triple-action approach makes it significantly more powerful for weight loss and metabolic improvement than single-hormone options.",
    howItWorks:
      "Retatrutide works by activating three hormone receptors at once: GLP-1 (which reduces appetite and slows digestion), GIP (which improves insulin response and fat metabolism), and glucagon (which increases fat burning and energy expenditure). This combination creates a powerful metabolic effect — you feel fuller faster, eat less, burn more fat, and your body processes blood sugar more efficiently.",
    whoIsItFor:
      "Adults with obesity or those dealing with metabolic challenges who are looking for significant, sustained weight loss and improved metabolic health. Best used as part of a comprehensive health plan.",
    benefits: [
      "Significant weight loss via triple-receptor action",
      "Appetite control — feel fuller faster, eat less",
      "Improved metabolic health and energy processing",
      "Blood sugar regulation and insulin response",
      "Increased fat burning and glycemic control",
    ],
    price: "$140",
    badge: "Advanced",
  },
  {
    id: "nad-500mg",
    name: "NAD+",
    dose: "500mg",
    cycle: "1 month cycle",
    category: "Cellular Health",
    isStack: false,
    tagline: "The cellular energy currency of longevity",
    synopsis:
      "Coenzyme essential for cellular energy, DNA repair, and healthy aging — supports metabolism, focus, and recovery.",
    plainEnglish:
      "NAD+ (Nicotinamide Adenine Dinucleotide) is a molecule found in every single cell of your body, and it's absolutely essential for life. Think of it as the fuel that powers your cellular machinery. It's involved in hundreds of biological processes — from converting food into energy to repairing damaged DNA. The problem is that NAD+ levels naturally decline with age, which is one reason why we feel less energetic and recover more slowly as we get older.",
    howItWorks:
      "NAD+ works like a molecular shuttle inside your cells, carrying electrons during the process of turning food into usable energy. It also activates a family of proteins called sirtuins — often called 'longevity proteins' — that regulate aging, inflammation, and DNA repair. When NAD+ levels are high, your cells run efficiently; when they drop, cellular function deteriorates.",
    whoIsItFor:
      "Anyone looking to support overall cellular health, boost energy levels, sharpen mental focus, and potentially slow age-related decline in bodily functions. Particularly valuable for those over 35 as natural NAD+ levels begin to drop.",
    benefits: [
      "DNA repair — keeps cells healthy and functioning properly",
      "Improved metabolism and nutrient-to-energy conversion",
      "Cell protection from stress and aging byproducts",
      "Increased energy and stamina — reduced fatigue",
      "Cognitive function — improved thinking and memory",
      "Organ function support for muscles, brain, and heart",
    ],
    price: "$100",
    badge: "Longevity",
  },
  {
    id: "bpc157-tb500-wolverine",
    name: "BPC-157 + TB-500",
    dose: "20mg",
    cycle: "3–4 week cycle",
    category: "Recovery",
    isStack: true,
    stackName: "Wolverine Stack",
    tagline: "Accelerated healing. Wolverine-grade recovery.",
    synopsis:
      "Recovery-focused peptide stack for tissue repair, reducing inflammation, and speeding recovery from injuries.",
    plainEnglish:
      "The Wolverine Stack is a combination of two powerful peptides — BPC-157 and TB-500 — designed to supercharge your body's natural healing. Think of it like giving your body a turbo boost for repairing damaged muscles, tendons, and ligaments. BPC-157 comes from a protein naturally found in your stomach, while TB-500 mimics a protein your body already uses to repair cells. Together, they make a formidable recovery duo.",
    howItWorks:
      "BPC-157 acts like a repair signal, telling your body to fix damaged tissues and calm down inflammation. TB-500 helps cells move to where they're needed most and encourages the growth of new blood vessels — essentially building new highways to rush repair crews to the injury site. Together, they work on multiple levels to get you healing faster than your body could on its own.",
    whoIsItFor:
      "Athletes, active individuals, or anyone recovering from soft-tissue injuries, surgery, or chronic inflammation who wants to heal faster and get back to peak performance.",
    benefits: [
      "Faster muscle and tendon healing after strain or injury",
      "Reduces inflammation and swelling — less pain",
      "Speeds up injury recovery and post-surgery healing",
      "Tissue regeneration — grows new, healthy tissue",
      "Improved flexibility and range of motion via TB-500",
      "Gut health support — BPC-157 repairs gut lining",
    ],
    price: "$100",
    badge: "Stack",
  },
  {
    id: "ghk-cu-50mg",
    name: "GHK-CU",
    dose: "50mg",
    cycle: "2 month cycle",
    category: "Anti-Aging",
    isStack: false,
    tagline: "Copper peptide for skin, hair, and cellular renewal",
    synopsis:
      "Supports skin repair, collagen production, wound healing, and hair health — popular in anti-aging and cosmetic wellness.",
    plainEnglish:
      "GHK-Cu is a naturally occurring peptide that your body actually produces on its own — but its levels drop significantly as you age. It's a copper-binding peptide, meaning it carries copper (an essential mineral) directly to your cells where it's needed most. Think of it as your body's built-in skin repair and anti-aging signal. It's been used in high-end skincare for decades, and now it's available in a more potent lab-synthesized form.",
    howItWorks:
      "GHK-Cu works by acting as a messenger that tells your body to ramp up collagen and elastin production — the two proteins responsible for keeping your skin firm, smooth, and elastic. It also activates genes involved in tissue repair, wound healing, and even hair follicle stimulation. Essentially, it flips the switch on your body's own regenerative machinery.",
    whoIsItFor:
      "Anyone looking to improve skin health, reduce visible signs of aging, speed up wound healing, or support hair growth. Particularly popular for cosmetic and anti-aging wellness protocols.",
    benefits: [
      "Skin repair — signals skin cells to heal and regenerate",
      "Collagen production — keeps skin firm and plump",
      "Wound healing — accelerates scar and damage repair",
      "Elastin synthesis — gives skin its bounce-back flexibility",
      "Hair health — supports follicle function for thicker hair",
      "Anti-aging — reduces fine lines and wrinkles",
      "Antioxidant protection from free radical damage",
    ],
    price: "$80",
    badge: "Regenerative",
  },
  {
    id: "cjc1295-ipamorelin-10mg",
    name: "CJC-1295 + Ipamorelin",
    dose: "10mg",
    cycle: "8–12 week cycle",
    category: "Hormone Support",
    isStack: true,
    stackName: "GH Synergy",
    tagline: "Precision growth hormone optimization",
    synopsis:
      "Synergistic growth hormone stack for lean muscle, fat metabolism, improved sleep, and natural GH optimization.",
    plainEnglish:
      "This synergistic combination pairs CJC-1295, a GHRH analogue that extends the half-life of growth hormone-releasing hormone, with Ipamorelin, a selective growth hormone secretagogue that mimics ghrelin without the cortisol or prolactin spikes associated with other GH peptides. The result is a clean, pulsatile release of growth hormone that mirrors the body's natural rhythm.",
    howItWorks:
      "CJC-1295 extends the window during which your pituitary gland releases growth hormone, while Ipamorelin selectively triggers GH pulses without disturbing cortisol or prolactin levels. Together they create a sustained, natural-pattern GH elevation that drives lean muscle development, fat metabolism, and deep sleep quality — all without suppressing your body's own GH production.",
    whoIsItFor:
      "Those seeking lean body composition, improved recovery, better sleep quality, and natural GH optimization without the side effects of synthetic growth hormone. Ideal for athletes and those focused on body recomposition.",
    benefits: [
      "Pulsatile, natural-pattern GH release",
      "Lean muscle development and retention",
      "Accelerated fat metabolism",
      "Improved deep sleep and recovery",
      "No cortisol or prolactin elevation",
      "Preserves endogenous GH production",
    ],
    price: "$80",
    badge: "Stack",
  },
  {
    id: "ghk-cu-bpc157-tb500-glow",
    name: "GHK-CU + BPC-157 + TB-500",
    dose: "70mg",
    cycle: "2 month cycle",
    category: "Beauty & Wellness",
    isStack: true,
    stackName: "Glow Stack",
    tagline: "Radiance engineered from the inside out",
    synopsis:
      "Beauty and wellness combo for skin repair, collagen production, hydration, hair quality, and overall radiance with recovery.",
    plainEnglish:
      "The Glow Stack combines three powerhouse peptides into one beauty and wellness protocol. GHK-Cu is a naturally occurring copper peptide that your body already produces — it's like a repair signal for your skin and hair. Add in BPC-157 and TB-500 for their tissue-healing and anti-inflammatory properties, and you have a comprehensive stack that works from the inside out to give you healthier skin, stronger hair, and a more radiant appearance.",
    howItWorks:
      "GHK-Cu tells your skin cells to produce more collagen and elastin — the proteins that keep skin firm, smooth, and youthful. BPC-157 and TB-500 then add their healing power to the mix, reducing inflammation, promoting new blood vessel growth (which feeds your skin and hair follicles), and accelerating tissue repair throughout the body. The result is a comprehensive beauty and recovery protocol.",
    whoIsItFor:
      "Anyone looking to improve their skin's appearance, boost hair quality, accelerate recovery from injuries, and reduce inflammation for a comprehensive wellness and beauty upgrade.",
    benefits: [
      "Skin repair and regeneration — healthier, more youthful appearance",
      "Collagen and elastin boost — firm, plump, wrinkle-free skin",
      "Accelerated healing of skin, muscles, and tendons",
      "Reduced inflammation — improved skin clarity and less redness",
      "Improved hair quality — thicker, stronger hair growth",
      "Gut health support via BPC-157",
      "Overall radiance — vibrant, glowing appearance",
    ],
    price: "$120",
    badge: "Signature Stack",
  },
  {
    id: "mots-c-10mg",
    name: "MOTS-C",
    dose: "10mg",
    cycle: "20 day cycle",
    category: "Metabolic",
    isStack: false,
    tagline: "Mitochondrial-encoded longevity peptide",
    synopsis:
      "Mitochondrial-derived peptide for energy production, metabolic health, insulin sensitivity, and exercise performance.",
    plainEnglish:
      "MOTS-c is a fascinating peptide because it comes directly from your mitochondria — the tiny power plants inside every cell that generate your body's energy. Unlike most peptides that come from other parts of the body, this one is made by the very structures responsible for keeping you energized. It acts as a metabolic regulator, helping your body burn fat more efficiently, manage blood sugar better, and perform at a higher level during exercise.",
    howItWorks:
      "MOTS-c activates a key energy sensor in your cells called AMPK — think of it as the master switch for your metabolism. When AMPK is activated, your body shifts into an efficient energy mode: it burns fat for fuel, improves how cells absorb sugar from the blood, and even stimulates the growth of more mitochondria so you have more power-generating capacity overall.",
    whoIsItFor:
      "Individuals looking to improve metabolic health, enhance athletic performance and endurance, or support healthy aging. Particularly beneficial for those with insulin resistance or aiming for fat loss while maintaining muscle.",
    benefits: [
      "Improved insulin sensitivity — better blood sugar control",
      "Supports fat loss while preserving muscle",
      "Enhanced endurance — burns fat more efficiently as fuel",
      "Anti-aging properties — protects cells from damage",
      "Better metabolic function and nutrient processing",
      "Reduced inflammation for better cellular health",
    ],
    price: "$70",
    badge: "Longevity",
  },
  {
    id: "kisspeptin-10mg",
    name: "Kisspeptin",
    dose: "10mg",
    cycle: "4–6 week cycle",
    category: "Hormone Support",
    isStack: false,
    tagline: "The master switch of reproductive hormones",
    synopsis:
      "A naturally occurring neuropeptide that regulates reproductive hormones, boosts libido, supports fertility, and enhances natural testosterone and estrogen production.",
    plainEnglish:
      "Kisspeptin is a naturally occurring neuropeptide — a small protein your brain already produces — that acts as the master switch for your entire reproductive hormone system. Think of it as the conductor of an orchestra: without it, the hormones responsible for libido, fertility, testosterone, and estrogen simply don't get the signal to perform. Scientists discovered it relatively recently, and research has exploded because of its remarkable ability to reawaken hormonal pathways that have become sluggish or suppressed — whether from age, stress, or hormonal imbalance.",
    howItWorks:
      "Kisspeptin binds to a receptor called GPR54 in the hypothalamus — the brain region that controls your hormonal thermostat. When it activates this receptor, it triggers the release of GnRH (Gonadotropin-Releasing Hormone), which then signals the pituitary gland to release LH and FSH — the hormones that drive testosterone production in men and estrogen/ovulation in women. In plain terms: Kisspeptin turns on the upstream signal that tells your body to produce its own sex hormones naturally, without replacing them artificially.",
    whoIsItFor:
      "Men and women experiencing low libido, hormonal imbalances, or declining reproductive health. Particularly valuable for those with low testosterone or estrogen, fertility challenges, or anyone looking to restore natural hormone signaling. Also studied for its role in mood, attraction, and sexual brain processing.",
    benefits: [
      "Stimulates natural testosterone and estrogen production",
      "Enhances libido and sexual function in men and women",
      "Supports fertility and reproductive hormone balance",
      "Prevents testicular atrophy during hormone therapy",
      "Improves mood and emotional well-being",
      "Activates GnRH pathway — the root of hormonal health",
    ],
    price: "$80",
    badge: "Hormone",
  },
  {
    id: "semax-10mg",
    name: "Semax",
    dose: "10mg",
    cycle: "2–4 week cycle",
    category: "Cellular Health",
    isStack: false,
    tagline: "The brain's performance peptide",
    synopsis:
      "A synthetic nootropic neuropeptide that enhances BDNF expression, sharpens focus and memory, reduces brain fog, and provides powerful neuroprotective effects.",
    plainEnglish:
      "Semax is a synthetic peptide derived from a fragment of ACTH — a hormone your body naturally produces. Originally developed in Russia and used clinically for stroke recovery and cognitive disorders, it has gained global attention as one of the most effective nootropic peptides available. Think of it as a precision upgrade for your brain: it doesn't just stimulate you like caffeine, it actually supports the biological machinery that makes your brain work better — sharper thinking, stronger memory, faster processing, and a more resilient nervous system.",
    howItWorks:
      "Semax works primarily by boosting BDNF (Brain-Derived Neurotrophic Factor) — often called \"Miracle-Gro for the brain.\" BDNF promotes the growth, maintenance, and survival of neurons, and higher levels are associated with better learning, memory, and mood. Semax also modulates dopamine and serotonin pathways in the prefrontal cortex, the brain region responsible for focus, decision-making, and working memory. Additionally, it inhibits enzymes that break down key neuropeptides, extending their beneficial effects and providing antioxidant protection against neuronal damage.",
    whoIsItFor:
      "Anyone looking to sharpen cognitive performance, combat brain fog, improve focus and memory, or support long-term brain health. Particularly valuable for professionals, students, athletes seeking mental edge, or individuals recovering from neurological stress. Also researched for mood support and anxiety reduction.",
    benefits: [
      "Enhanced focus, clarity, and mental sharpness",
      "Improved memory formation and recall",
      "Boosts BDNF — the brain's growth and repair factor",
      "Neuroprotective — shields neurons from oxidative stress",
      "Modulates dopamine and serotonin for mood support",
      "Reduces brain fog and mental fatigue",
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
