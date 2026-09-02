import { ArrowLeft, Clock3, FileCheck2, FileText, ShieldCheck } from "lucide-react";
import { Link, useParams } from "wouter";
import { PRIMARY_LOGO_URL } from "@/lib/brandAssets";
import { products } from "@/lib/products";

export default function CertificateOfAnalysis() {
  const { id } = useParams<{ id: string }>();
  const product = products.find(item => item.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[oklch(0.1_0.04_255)] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <FileText size={44} className="text-[#00BFFF] mx-auto mb-4" />
          <h1 className="text-4xl mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
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
    <div className="min-h-screen bg-[oklch(0.1_0.04_255)] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b border-white/8 bg-[oklch(0.12_0.045_255/0.96)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-24 flex items-center justify-between gap-5">
          <Link href={`/product/${product.id}`}>
            <span
              className="inline-flex items-center gap-2 text-white/55 hover:text-[#00BFFF] transition-colors text-xs sm:text-sm uppercase tracking-[0.12em] cursor-pointer"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              <ArrowLeft size={15} /> Back to Product
            </span>
          </Link>
          <Link href="/">
            <img src={PRIMARY_LOGO_URL} alt="LA Elite Peptides — Trusted. Tested." className="w-[190px] sm:w-[250px] h-auto max-h-16 object-contain cursor-pointer" />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-8 lg:gap-12 items-start">
          <aside className="rounded-2xl border border-white/10 bg-[oklch(0.15_0.055_255)] p-6">
            <div className="aspect-square rounded-xl bg-[oklch(0.18_0.07_240)] border border-[#00BFFF]/15 flex items-center justify-center p-5 mb-5">
              <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-contain drop-shadow-[0_0_22px_rgba(0,191,255,0.28)]" />
            </div>
            <p className="text-[#00BFFF] text-xs uppercase tracking-[0.18em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
              {product.category}
            </p>
            <h2 className="text-white text-3xl mt-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
              {product.name}
            </h2>
            <p className="text-white/48 text-sm mt-1">{product.content}</p>
            <p className="text-white/30 text-xs mt-5 break-all">Product ID: {product.id}</p>
          </aside>

          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00BFFF]/25 bg-[#00BFFF]/8 px-4 py-2 mb-6">
              <Clock3 size={14} className="text-[#00BFFF]" />
              <span className="text-[#9BDFFF] text-xs uppercase tracking-[0.18em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                Pending verified document upload
              </span>
            </div>

            <h1 className="text-white leading-[0.95] text-5xl sm:text-6xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.035em" }}>
              CERTIFICATE OF
              <span className="block text-[#00BFFF]">ANALYSIS</span>
            </h1>
            <p className="text-white/58 leading-relaxed mt-6 max-w-2xl">
              This page reserves a product-specific location for an authentic Certificate of Analysis. A verified report has not yet been uploaded for this catalog item.
            </p>

            <div className="mt-8 rounded-2xl border border-[#00BFFF]/20 bg-[#00BFFF]/[0.045] p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <ShieldCheck size={22} className="text-[#00BFFF] flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-white text-xl" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                    Verification standard
                  </h2>
                  <p className="text-white/55 text-sm leading-relaxed mt-2">
                    LA Elite Peptides will publish a document here only after the corresponding report has been received and matched to this product. Until then, no laboratory, lot, date, purity, identity, or analytical result is represented on this page.
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
                <div className="rounded-xl border border-white/8 bg-[oklch(0.12_0.045_255)] px-4 py-3">
                  <span className="block text-white/35 text-xs uppercase tracking-[0.12em] mb-1">Verified file</span>
                  <span className="text-white/68">Not yet available</span>
                </div>
                <div className="rounded-xl border border-white/8 bg-[oklch(0.12_0.045_255)] px-4 py-3">
                  <span className="block text-white/35 text-xs uppercase tracking-[0.12em] mb-1">Download</span>
                  <span className="text-white/68">Unavailable until verification</span>
                </div>
              </div>
            </div>

            <p className="text-white/32 text-xs leading-relaxed mt-6">
              Products are supplied strictly for in-vitro laboratory and scientific research only and are not intended for human or animal consumption.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
