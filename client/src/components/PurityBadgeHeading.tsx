type PurityBadgeHeadingProps = {
  className?: string;
  primary?: string;
  secondary?: string;
  fullLabel?: string;
};

export default function PurityBadgeHeading({
  className = "",
  primary = "COA-Reported",
  secondary = "Purity",
  fullLabel = "COA-Reported Purity",
}: PurityBadgeHeadingProps) {
  return (
    <span className={`purity-badge-heading ${className}`.trim()}>
      <span className="sr-only">{fullLabel}</span>
      <span
        aria-hidden="true"
        className="block text-[0.9rem] tracking-[0.045em] text-[#F7F2EA] sm:text-base"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}
      >
        {primary}
      </span>
      <span
        aria-hidden="true"
        className="mt-1 block text-[0.62rem] uppercase tracking-[0.2em] text-[#B9C0CA]"
        style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
      >
        {secondary}
      </span>
    </span>
  );
}
