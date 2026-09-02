import { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  FlaskConical,
  LockKeyhole,
  PackageCheck,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories, products, type Product } from "@/lib/products";

type SortOrder = "catalog" | "name-asc" | "price-asc" | "price-desc";

const parseProductPrice = (product: Product) => {
  if (!product.price) return Number.POSITIVE_INFINITY;
  const value = Number.parseFloat(product.price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
};

const confidenceItems = [
  {
    icon: FlaskConical,
    value: `${products.length}`,
    label: "Current research compounds",
  },
  {
    icon: SlidersHorizontal,
    value: `${categories.length - 1}`,
    label: "Catalog categories",
  },
  {
    icon: LockKeyhole,
    value: "Secure",
    label: "Account-protected checkout",
  },
  {
    icon: PackageCheck,
    value: "Tracked",
    label: "Order status workflow",
  },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("catalog");
  const catalogRef = useRef<HTMLDivElement>(null);

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map(category => [
          category,
          category === "All"
            ? products.length
            : products.filter(product => product.category === category).length,
        ]),
      ),
    [],
  );

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = products.filter(product => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory;
      const searchMatch =
        query.length === 0 ||
        [
          product.name,
          product.content,
          product.category,
          product.tagline,
          product.synopsis,
          ...product.benefits,
        ].some(value => value.toLowerCase().includes(query));

      return categoryMatch && searchMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
      if (sortOrder === "price-asc") return parseProductPrice(a) - parseProductPrice(b);
      if (sortOrder === "price-desc") return parseProductPrice(b) - parseProductPrice(a);
      return 0;
    });
  }, [activeCategory, searchQuery, sortOrder]);

  const resetCatalog = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setSortOrder("catalog");
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.1_0.05_255)] text-white">
      <Navbar />

      <main>
        <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28 border-b border-white/10">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 78% 35%, rgba(0,191,255,0.2), transparent 34%), radial-gradient(circle at 14% 10%, rgba(36,87,167,0.26), transparent 30%), linear-gradient(135deg, oklch(0.09 0.045 255), oklch(0.15 0.08 245))",
            }}
          />
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00BFFF]/30 bg-[#00BFFF]/8 px-4 py-2 mb-7">
                <ShieldCheck size={15} className="text-[#00BFFF]" />
                <span
                  className="text-[#9BDFFF] text-xs uppercase tracking-[0.22em]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Qualified laboratory research only
                </span>
              </div>

              <p
                className="text-[#B8C7DD] text-sm uppercase tracking-[0.28em] mb-3"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                LA Elite Peptides Research Catalog
              </p>
              <h1
                className="text-white leading-[0.92] mb-6"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(3.6rem, 8vw, 7rem)",
                  letterSpacing: "0.025em",
                }}
              >
                SHOP RESEARCH
                <span className="block text-[#00BFFF]">COMPOUNDS</span>
              </h1>
              <p className="max-w-xl text-white/68 text-lg leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Browse the complete current catalog, compare research categories and formats, then continue through the existing secure account and checkout flow.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={scrollToCatalog} className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded">
                  Browse the Catalog
                  <ArrowDown size={16} />
                </button>
                <a
                  href="/#science"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded border border-white/20 text-white/80 hover:border-[#00BFFF]/50 hover:text-[#00BFFF] transition-colors text-xs uppercase tracking-[0.16em]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Review Our Standards
                </a>
              </div>

              <p className="text-white/38 text-xs leading-relaxed mt-6 max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                For in-vitro laboratory and scientific research only. Not for human or animal consumption.
              </p>
            </div>

            <div className="relative min-h-[420px] hidden md:block" aria-label="Selected products from the current catalog">
              <div className="absolute inset-8 rounded-[2rem] border border-[#00BFFF]/20 bg-white/[0.035] backdrop-blur-sm shadow-[0_30px_90px_rgba(0,0,0,0.45)]" />
              {products.slice(0, 3).map((product, index) => (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={`absolute group rounded-2xl border border-white/10 bg-[oklch(0.14_0.055_255/0.88)] overflow-hidden shadow-2xl transition-transform duration-200 hover:-translate-y-1 ${
                    index === 0
                      ? "left-[8%] top-[18%] w-[38%] rotate-[-4deg]"
                      : index === 1
                        ? "left-[33%] top-[7%] w-[40%] z-10"
                        : "right-[4%] top-[22%] w-[36%] rotate-[4deg]"
                  }`}
                >
                  <div className="h-72 bg-[radial-gradient(circle_at_50%_52%,rgba(0,191,255,0.18),transparent_56%)] flex items-center justify-center p-4">
                    <img src={product.images?.[0]} alt={product.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[oklch(0.09_0.045_255)] via-[oklch(0.09_0.045_255/0.92)] to-transparent pt-12">
                    <span className="text-white text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                      {product.name}
                    </span>
                    <span className="block text-[#9BDFFF] text-xs mt-0.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      {product.content}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[oklch(0.125_0.052_255)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4">
            {confidenceItems.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 px-3 sm:px-6 py-6 border-r border-white/8 last:border-r-0 even:border-r-0 lg:even:border-r lg:last:border-r-0">
                <Icon size={20} className="text-[#00BFFF] flex-shrink-0" />
                <div>
                  <div className="text-white text-xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                    {value}
                  </div>
                  <div className="text-white/45 text-[0.68rem] uppercase tracking-[0.12em] mt-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section ref={catalogRef} className="relative py-20 lg:py-28 scroll-mt-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(36,87,167,0.16),transparent_34%)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[#00BFFF] text-xs uppercase tracking-[0.28em] mb-3" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                  Current inventory
                </p>
                <h2 className="text-white text-5xl sm:text-6xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.035em" }}>
                  RESEARCH CATALOG
                </h2>
                <p className="text-white/52 mt-3 max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Search by compound or research area, narrow by category, and compare current catalog pricing before opening full product details.
                </p>
              </div>
              <div className="text-left lg:text-right">
                <span className="text-white text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{visibleProducts.length}</span>
                <span className="text-white/45 text-xs uppercase tracking-[0.16em] ml-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  product{visibleProducts.length === 1 ? "" : "s"} shown
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[oklch(0.14_0.055_255/0.78)] backdrop-blur-sm p-4 sm:p-5 mb-8 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-center">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00BFFF] pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search compounds or research areas"
                    aria-label="Search the research catalog"
                    className="w-full rounded-xl border border-white/12 bg-[oklch(0.1_0.045_255/0.75)] text-white placeholder-white/28 py-3.5 pl-12 pr-11 outline-none focus:border-[#00BFFF]/55 focus:ring-2 focus:ring-[#00BFFF]/10 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                      aria-label="Clear catalog search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <label className="flex items-center gap-3 text-white/45 text-xs uppercase tracking-[0.14em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                  Sort
                  <select
                    value={sortOrder}
                    onChange={event => setSortOrder(event.target.value as SortOrder)}
                    className="min-w-[190px] rounded-xl border border-white/12 bg-[oklch(0.1_0.045_255)] text-white py-3.5 px-4 outline-none focus:border-[#00BFFF]/55"
                    aria-label="Sort research products"
                  >
                    <option value="catalog">Catalog order</option>
                    <option value="name-asc">Name A–Z</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-lg text-xs uppercase tracking-[0.14em] border transition-colors ${
                      activeCategory === category
                        ? "bg-[#00BFFF] border-[#00BFFF] text-[oklch(0.1_0.05_255)]"
                        : "border-white/12 text-white/58 hover:border-[#00BFFF]/45 hover:text-[#00BFFF]"
                    }`}
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                  >
                    {category} <span className="opacity-65 ml-1">{categoryCounts[category]}</span>
                  </button>
                ))}
              </div>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} showPublicPrice />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] text-center py-20 px-6">
                <Search size={42} className="text-white/18 mx-auto mb-4" />
                <h3 className="text-white text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                  No matching compounds
                </h3>
                <p className="text-white/45 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Try another search term or reset the catalog controls.
                </p>
                <button onClick={resetCatalog} className="mt-6 px-5 py-2.5 rounded-lg border border-[#00BFFF]/40 text-[#00BFFF] hover:bg-[#00BFFF]/10 transition-colors text-xs uppercase tracking-[0.16em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                  Reset Catalog
                </button>
              </div>
            )}

            <div className="mt-12 rounded-2xl border border-[#00BFFF]/20 bg-[#00BFFF]/[0.045] px-5 sm:px-8 py-7 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[#9BDFFF] text-xs uppercase tracking-[0.22em] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                  Research-use safeguard
                </p>
                <p className="text-white/68 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  All compounds are supplied strictly for in-vitro laboratory and scientific research. They are not intended for human or animal consumption, clinical use, diagnosis, treatment, or prevention of disease.
                </p>
              </div>
              <a href="/#faq" className="flex-shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/18 text-white/75 hover:text-[#00BFFF] hover:border-[#00BFFF]/45 transition-colors text-xs uppercase tracking-[0.16em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                Read Research FAQ
              </a>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[oklch(0.135_0.06_255)] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div>
              <p className="text-[#00BFFF] text-xs uppercase tracking-[0.24em] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                Need help locating a product?
              </p>
              <h2 className="text-white text-4xl sm:text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
                RESEARCH CATALOG SUPPORT
              </h2>
              <p className="text-white/52 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Contact the LA Elite Peptides team for product specifications or ordering assistance.
              </p>
            </div>
            <a href="/#contact" className="btn-primary inline-flex items-center justify-center px-7 py-3.5 rounded flex-shrink-0">
              Contact Research Support
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
