import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL, UTILITY_LOGO_SIZE_CLASS } from "@/lib/brandAssets";
import { findProductById, type CoaRecord } from "@/lib/products";

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-[oklch(0.20_0.06_255)] px-4 py-3.5">
      <span className="block text-white/35 text-[0.68rem] uppercase tracking-[0.14em] mb-1.5">{label}</span>
      <span className="text-white/78 text-sm leading-relaxed break-words">{value}</span>
    </div>
  );
}

function VerifiedReport({ coa }: { coa: CoaRecord }) {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#76B8FF]/35 bg-[#174A9B]/25 px-4 py-2 mb-6">
        <CheckCircle2 size={14} className="text-[#C8D0DB]" />
        <span
          className="text-[#F7F1E8] text-xs uppercase tracking-[0.18em]"
          style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
        >
          Batch-matched report available
        </span>
      </div>

      <h1
        className="text-white leading-[0.95] text-5xl sm:text-6xl"
        style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.035em" }}
      >
        CERTIFICATE OF
        <span className="block text-[#C8D0DB]">ANALYSIS</span>
      </h1>
      <p className="text-white/64 leading-relaxed mt-6 max-w-2xl">
        This owner-supplied laboratory report has been matched to the product and lot shown below. Analytical values are transcribed from the signed PDF and apply only to the identified sample.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        <MetaCard label="Lot / Batch" value={coa.lotBatch} />
        <MetaCard label="Ethos Report ID" value={coa.reportId} />
        <MetaCard label="Sample name" value={coa.sampleName} />
        <MetaCard label="Labeled strength" value={coa.labeledStrength} />
        <MetaCard label="Method" value={coa.method} />
        <MetaCard label="Date tested" value={coa.testedDate} />
      </div>

      <div className="mt-5 rounded-2xl border border-[#C8D0DB]/25 bg-[#C8D0DB]/[0.055] p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <FlaskConical size={22} className="text-[#C8D0DB] flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h2 className="text-white text-xl" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
              Reported analytical results
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed">
              <div>
                <span className="block text-white/38 text-xs uppercase tracking-[0.12em] mb-1">Identity</span>
                <span className="text-white/75">{coa.identityResult}</span>
              </div>
              <div>
                <span className="block text-white/38 text-xs uppercase tracking-[0.12em] mb-1">Measured content</span>
                <span className="text-white/88">{coa.contentResult}</span>
                <span className="block text-white/42 mt-1">Label specification: {coa.specification}</span>
              </div>
              <div>
                <span className="block text-white/38 text-xs uppercase tracking-[0.12em] mb-1">Chromatographic purity</span>
                <span className="text-[#F7F1E8] text-lg font-semibold">{coa.purityResult}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <ShieldCheck size={21} className="text-[#C8D0DB] flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-white text-lg" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
              Laboratory and scope
            </h2>
            <p className="text-white/65 text-sm leading-relaxed mt-2">{coa.laboratory}</p>
            <p className="text-white/45 text-xs leading-relaxed mt-1">{coa.laboratoryLocation}</p>
            <p className="text-white/45 text-xs leading-relaxed mt-1">{coa.accreditation}</p>
            <p className="text-white/58 text-sm leading-relaxed mt-4">{coa.scopeNote}</p>
            <p className="text-white/40 text-xs leading-relaxed mt-2">
              Received {coa.receivedDate}; completed {coa.completedDate}; signed by {coa.signedBy}.
            </p>
          </div>
        </div>
      </div>

      <a
        href={coa.documentUrl}
        target="_blank"
        rel="noreferrer"
        className="btn-primary mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm uppercase tracking-[0.12em]"
        style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
      >
        <Download size={17} /> View signed COA PDF
      </a>
    </>
  );
}

function PendingReport() {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#C8D0DB]/25 bg-[#C8D0DB]/8 px-4 py-2 mb-6">
        <FileText size={14} className="text-[#C8D0DB]" />
        <span
          className="text-[#F7F1E8] text-xs uppercase tracking-[0.18em]"
          style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
        >
          Pending verified document upload
        </span>
      </div>

      <h1
        className="text-white leading-[0.95] text-5xl sm:text-6xl"
        style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.035em" }}
      >
        CERTIFICATE OF
        <span className="block text-[#C8D0DB]">ANALYSIS</span>
      </h1>
      <p className="text-white/58 leading-relaxed mt-6 max-w-2xl">
        This page reserves a product-specific location for an authentic Certificate of Analysis. A matching report has not yet been supplied for this catalog item.
      </p>

      <div className="mt-8 rounded-2xl border border-[#C8D0DB]/20 bg-[#C8D0DB]/[0.045] p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <ShieldCheck size={22} className="text-[#C8D0DB] flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-white text-xl" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
              Verification standard
            </h2>
            <p className="text-white/55 text-sm leading-relaxed mt-2">
              LA Elite Peptides will publish a report here only after the document has been received and matched to this product and lot. Until then, no laboratory, lot, date, purity, identity, or analytical result is represented for this item.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-4">
          <FileCheck2 size={19} className="text-white/45" />
          <h2 className="text-white text-lg" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
            Document status
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <MetaCard label="Verified file" value="Not yet available" />
          <MetaCard label="Download" value="Unavailable until verification" />
        </div>
      </div>
    </>
  );
}

export default function CertificateOfAnalysis() {
  const { id } = useParams<{ id: string }>();
  const product = findProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[oklch(0.18_0.055_255)] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <FileText size={44} className="text-[#C8D0DB] mx-auto mb-4" />
          <h1 className="text-4xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}>
            COA RECORD NOT FOUND
          </h1>
          <p className="text-white/55 mb-7">This product does not exist in the current LA Elite Peptides catalog.</p>
          <Link href="/shop">
            <span className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded cursor-pointer">
              <ArrowLeft size={15} /> Return to Shop
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.18_0.055_255)] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b border-white/8 bg-[oklch(0.20_0.06_255/0.96)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-24 flex items-center justify-between gap-5">
          <Link href={`/product/${product.id}`}>
            <span
              className="inline-flex items-center gap-2 text-white/55 hover:text-[#C8D0DB] transition-colors text-xs sm:text-sm uppercase tracking-[0.12em] cursor-pointer"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              <ArrowLeft size={15} /> Back to Product
            </span>
          </Link>
          <Link href="/">
            <img src={PRIMARY_LOGO_URL} alt={PRIMARY_LOGO_ALT} className={`${UTILITY_LOGO_SIZE_CLASS} cursor-pointer`} />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-8 lg:gap-12 items-start">
          <aside className="rounded-2xl border border-white/10 bg-[oklch(0.25_0.08_255)] p-6">
            <div className="aspect-square rounded-xl bg-[oklch(0.28_0.08_255)] border border-[#C8D0DB]/15 flex items-center justify-center p-5 mb-5">
              <img src={product.images?.[0]} alt={product.name} decoding="async" fetchPriority="high" className="w-full h-full object-contain drop-shadow-[0_0_22px_rgba(200,208,219,0.28)]" />
            </div>
            <p className="text-[#C8D0DB] text-xs uppercase tracking-[0.18em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
              {product.category}
            </p>
            <h2 className="text-white text-3xl mt-2" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.04em" }}>
              {product.name}
            </h2>
            <p className="text-white/48 text-sm mt-1">{product.content}</p>
            <p className="text-white/30 text-xs mt-5 break-all">Product ID: {product.id}</p>
          </aside>

          <section>
            {product.coa ? <VerifiedReport coa={product.coa} /> : <PendingReport />}
            <div className="mt-6 flex items-start gap-2 text-white/34 text-xs leading-relaxed">
              <CalendarDays size={14} className="mt-0.5 flex-shrink-0" />
              <p>
                Products are supplied strictly for qualified in-vitro laboratory and scientific research only and are not intended for human or animal consumption.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
