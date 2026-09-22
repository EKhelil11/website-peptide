import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CircleHelp, X } from "lucide-react";
import * as React from "react";

type GlossaryEntry = {
  id: string;
  term: string;
  definition: string;
  phrases: readonly string[];
};

export const RESEARCH_GLOSSARY: readonly GlossaryEntry[] = [
  {
    id: "multi-receptor-agonist",
    term: "Multi-receptor agonist",
    definition:
      "A research design intended to activate more than one receptor pathway in the same experimental model.",
    phrases: [
      "triple GLP-1/GIP/glucagon receptor agonist",
      "dual GIP/GLP-1 receptor agonist",
      "triple-agonist profile",
      "dual-receptor profile",
      "multi-receptor peptide",
    ],
  },
  {
    id: "receptor-agonist",
    term: "Receptor agonist",
    definition:
      "A research compound used to activate a receptor response in an experimental model.",
    phrases: ["receptor agonist", "receptor activation"],
  },
  {
    id: "receptor-pharmacology",
    term: "Receptor pharmacology",
    definition:
      "Laboratory study of how research compounds bind to and influence receptor signaling.",
    phrases: ["receptor pharmacology", "receptor affinity"],
  },
  {
    id: "receptor-ligand",
    term: "Receptor ligand",
    definition:
      "A molecule used in research because it can bind to a specific cellular receptor.",
    phrases: ["receptor-ligand interactions", "receptor ligand"],
  },
  {
    id: "camp",
    term: "cAMP",
    definition:
      "A small intracellular messenger researchers measure to compare how receptor signals are relayed inside cells.",
    phrases: ["cAMP signaling", "cAMP"],
  },
  {
    id: "second-messenger-assay",
    term: "Second-messenger assay",
    definition:
      "A laboratory test that measures signaling molecules produced inside cells after receptor activation.",
    phrases: ["second-messenger assays", "second-messenger assay"],
  },
  {
    id: "structure-activity-relationship",
    term: "Structure–activity relationship",
    definition:
      "A comparison of how changes in molecular structure relate to measured activity in a research series.",
    phrases: [
      "structure-activity relationships",
      "structure-activity relationship",
      "structure-activity research",
    ],
  },
  {
    id: "metabolic-signaling",
    term: "Metabolic signaling",
    definition:
      "Laboratory study of signaling pathways involved in how experimental systems process and regulate energy-related inputs.",
    phrases: ["metabolic-pathway research", "metabolic signaling"],
  },
  {
    id: "lipid-handling",
    term: "Lipid handling",
    definition:
      "Laboratory study of how experimental cells or tissues process, transport, store, or use lipids.",
    phrases: ["lipid handling"],
  },
  {
    id: "energy-regulation-pathway",
    term: "Energy-regulation pathway",
    definition:
      "A signaling network studied for its role in how experimental systems manage energy-related processes.",
    phrases: ["energy-regulation pathways", "energy-regulation pathway"],
  },
  {
    id: "peptide-analogue",
    term: "Peptide analogue",
    definition:
      "A laboratory-made peptide designed with a sequence or structure related to a reference peptide.",
    phrases: ["GHRH(1-29) analogue", "GHRH analogue", "analogue of human growth hormone-releasing hormone"],
  },
  {
    id: "extracellular-matrix",
    term: "Extracellular matrix",
    definition:
      "The network of proteins and other materials surrounding cells that researchers study for structure and signaling.",
    phrases: ["extracellular-matrix", "extracellular matrix"],
  },
  {
    id: "cell-migration",
    term: "Cell migration",
    definition:
      "The movement of cells within a controlled experimental system.",
    phrases: ["cell-migration", "cell migration", "cellular migration"],
  },
  {
    id: "redox-signaling",
    term: "Redox signaling",
    definition:
      "Laboratory study of cellular signals linked to electron-transfer and oxidation–reduction chemistry.",
    phrases: ["redox signaling", "redox balance"],
  },
  {
    id: "coenzyme",
    term: "Coenzyme",
    definition:
      "A non-protein molecule that helps an enzyme carry out a biochemical reaction in a laboratory model.",
    phrases: ["dinucleotide coenzyme", "cellular coenzyme", "coenzyme"],
  },
  {
    id: "mitochondrial-derived-peptide",
    term: "Mitochondrial-derived peptide",
    definition:
      "A peptide encoded within mitochondrial genetic material and studied in mitochondrial signaling models.",
    phrases: ["mitochondrial-derived peptide"],
  },
  {
    id: "cellular-bioenergetics",
    term: "Cellular bioenergetics",
    definition:
      "Laboratory study of how cells transform and use energy.",
    phrases: ["cellular bioenergetics"],
  },
  {
    id: "neuroendocrine-signaling",
    term: "Neuroendocrine signaling",
    definition:
      "Laboratory study of signaling links between nervous-system and hormone-related pathways.",
    phrases: ["neuroendocrine signaling"],
  },
  {
    id: "neurotrophin-signaling",
    term: "Neurotrophin-associated signaling",
    definition:
      "Laboratory study of signaling pathways associated with proteins that support neural-cell growth and function.",
    phrases: ["neurotrophin-associated signaling", "BDNF-associated signaling"],
  },
] as const;

type PhraseMatch = {
  entry: GlossaryEntry;
  index: number;
  phrase: string;
};

const findNextGlossaryMatch = (
  text: string,
  cursor: number,
  usedTermIds: ReadonlySet<string>,
): PhraseMatch | null => {
  const lowerText = text.toLocaleLowerCase();
  let bestMatch: PhraseMatch | null = null;

  for (const entry of RESEARCH_GLOSSARY) {
    if (usedTermIds.has(entry.id)) continue;

    for (const phrase of entry.phrases) {
      const index = lowerText.indexOf(phrase.toLocaleLowerCase(), cursor);
      if (index === -1) continue;

      if (
        bestMatch === null ||
        index < bestMatch.index ||
        (index === bestMatch.index && phrase.length > bestMatch.phrase.length)
      ) {
        bestMatch = { entry, index, phrase };
      }
    }
  }

  return bestMatch;
};

export function ResearchGlossaryTooltip({
  entry,
  children,
}: {
  entry: GlossaryEntry;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressNextFocusOpen = React.useRef(false);

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [clearCloseTimer]);

  React.useEffect(() => clearCloseTimer, [clearCloseTimer]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-research-term={entry.id}
          aria-label={`Explain ${entry.term}`}
          className="research-glossary-trigger group mx-0.5 inline-flex min-h-7 items-center gap-1 rounded-sm border-b border-dotted border-[#B9C0CA] px-0.5 align-baseline font-[inherit] leading-[inherit] text-inherit decoration-clone underline-offset-4 transition-colors duration-150 hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8DDE5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152F] motion-reduce:transition-none"
          onPointerEnter={event => {
            if (event.pointerType === "touch") return;
            clearCloseTimer();
            setOpen(true);
          }}
          onPointerLeave={event => {
            if (event.pointerType === "touch") return;
            scheduleClose();
          }}
          onFocus={() => {
            if (suppressNextFocusOpen.current) {
              suppressNextFocusOpen.current = false;
              return;
            }
            clearCloseTimer();
            setOpen(true);
          }}
        >
          <span>{children}</span>
          <CircleHelp
            aria-hidden="true"
            className="size-3.5 shrink-0 text-[#D8DDE5] transition-colors duration-150 group-hover:text-white group-focus-visible:text-white motion-reduce:transition-none"
            strokeWidth={1.8}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        role="dialog"
        aria-label={`${entry.term} research definition`}
        data-research-definition={entry.id}
        side="top"
        sideOffset={9}
        collisionPadding={16}
        onOpenAutoFocus={event => event.preventDefault()}
        className="research-glossary-content z-[70] w-[min(20rem,calc(100vw-2rem))] rounded-md border border-white/20 bg-[#0B1D3D] p-0 text-white shadow-[0_24px_64px_-24px_rgba(0,0,0,0.88)] motion-reduce:animate-none"
        onPointerEnter={clearCloseTimer}
        onPointerLeave={scheduleClose}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/12 px-4 py-3">
          <p
            className="text-[1.15rem] leading-tight text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            {entry.term}
          </p>
          <button
            type="button"
            aria-label={`Close ${entry.term} definition`}
            onClick={() => {
              suppressNextFocusOpen.current = true;
              setOpen(false);
            }}
            className="-mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8DDE5] motion-reduce:transition-none"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <div className="space-y-3 px-4 py-3.5">
          <p
            className="text-sm leading-[1.65] text-white/92"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          >
            {entry.definition}
          </p>
          <p
            className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#D8DDE5]"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Research terminology only
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function renderResearchGlossaryText(
  text: string,
  usedTermIds: Set<string>,
  maxTerms = 3,
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let matchCount = 0;

  while (cursor < text.length && matchCount < maxTerms) {
    const match = findNextGlossaryMatch(text, cursor, usedTermIds);
    if (!match) break;

    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    const matchedText = text.slice(match.index, match.index + match.phrase.length);
    parts.push(
      <ResearchGlossaryTooltip key={`${match.entry.id}-${match.index}`} entry={match.entry}>
        {matchedText}
      </ResearchGlossaryTooltip>,
    );

    usedTermIds.add(match.entry.id);
    matchCount += 1;
    cursor = match.index + match.phrase.length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}
