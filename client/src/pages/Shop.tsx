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
    <div className="min-h-screen bg-[#F6F1E9] text-[#202833]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28 border-b border-[#B9C0CA]/30 text-white">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 78% 35%, rgba(185,192,202,0.22), transparent 34%), radial-gradient(circle at 14% 10%, rgba(36,95,193,0.26), transparent 30%), linear-gradient(135deg, #07152F, #10295E)",
            }}
          />
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

          <div className="relative z-10 max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div className="min-w-0 max-w-full">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#B9C0CA]/40 bg-white/[0.06] px-3 sm:px-4 py-2 mb-6 sm:mb-7">
                <ShieldCheck size={15} className="text-[#B9C0CA]" />
                <span
                  className="min-w-0 text-[#E9DCCB] text-[0.66rem] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.22em] leading-relaxed"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Qualified laboratory research only
                </span>
              </div>

              <p
                className="max-w-full text-[#B9C0CA] text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.28em] mb-3"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                LA Elite Peptides Research Catalog
              </p>
              <h1
                className="max-w-full text-white leading-[0.92] mb-5 sm:mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.45rem, 13vw, 7rem)",
                  letterSpacing: "0.025em",
                  overflowWrap: "normal",
                }}
              >
                SHOP RESEARCH
                <span className="block whitespace-nowrap text-[#B9C0CA]">COMPOUNDS</span>
              </h1>
              <p className="max-w-xl text-white/72 text-base sm:text-lg leading-relaxed mb-7 sm:mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Browse the complete current catalog, compare research categories and formats, then continue through the existing secure account and checkout flow.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={scrollToCatalog} className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded">
                  Browse the Catalog
                  <ArrowDown size={16} />
                </button>
                <a
                  href="/#science"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded border border-[#B9C0CA]/45 text-white/80 hover:border-white/70 hover:text-white transition-colors text-xs uppercase tracking-[0.16em]"
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
              <div className="absolute inset-8 rounded-[2rem] border border-[#B9C0CA]/25 bg-white/[0.035] backdrop-blur-sm shadow-[0_30px_90px_rgba(0,0,0,0.45)]" />
              {products.slice(0, 3).map((product, index) => (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={`absolute group rounded-2xl border border-[#B9C0CA]/25 bg-[#10295E]/90 overflow-hidden shadow-2xl transition-transform duration-200 hover:-translate-y-1 ${
                    index === 0
                      ? "left-[8%] top-[18%] w-[38%] rotate-[-4deg]"
                      : index === 1
                        ? "left-[33%] top-[7%] w-[40%] z-10"
                        : "right-[4%] top-[22%] w-[36%] rotate-[4deg]"
                  }`}
                >
                  <div className="h-72 bg-[radial-gradient(circle_at_50%_52%,rgba(185,192,202,0.28),transparent_56%)] flex items-center justify-center p-4">
                    <img src={product.images?.[0]} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#07152F] via-[#07152F]/90 to-transparent pt-12">
                    <span className="text-white text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}>
                      {product.name}
                    </span>
                    <span className="block text-[#E9DCCB] text-xs mt-0.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      {product.content}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#B9C0CA]/65 bg-[linear-gradient(135deg,#F6F1E9_0%,#E9DCCB_48%,#DDD2C5_100%)] py-5 sm:py-7">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {confidenceItems.map(({ icon: Icon, value, label }, index) => (
              <div
                key={label}
                className="relative min-w-0 overflow-hidden rounded-2xl border border-[#B9C0CA]/65 bg-white/60 px-3 py-4 sm:px-5 sm:py-5 shadow-[0_14px_34px_rgba(7,21,47,0.10)]"
              >
                <span
                  className="absolute right-3 top-2 text-xl italic tracking-[0.04em] text-[#B9C0CA]/65 sm:text-2xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
                <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B9C0CA] bg-[linear-gradient(145deg,#245FC1,#10295E)] shadow-[0_8px_18px_rgba(16,41,94,0.24)]">
                    <Icon size={18} className="text-[#F6F1E9]" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <div
                      className="text-[#10295E] text-[1.85rem] sm:text-[2.15rem] leading-[0.88]"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 680, letterSpacing: "0.02em" }}
                    >
                      {value}
                    </div>
                    <div
                      className="mt-2.5 text-[#465161] text-[0.82rem] sm:text-[0.9rem] uppercase tracking-[0.07em] leading-[1.18]"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
                    >
                      {label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section ref={catalogRef} className="relative py-20 lg:py-28 scroll-mt-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(36,95,193,0.10),transparent_34%)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[#7C8693] text-xs uppercase tracking-[0.28em] mb-3" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                  Current inventory
                </p>
                <h2 className="text-[#10295E] text-5xl sm:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.035em" }}>
                  RESEARCH CATALOG
                </h2>
                <p className="text-[#4B5563] mt-3 max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Search by compound or research area, narrow by category, and compare current catalog pricing before opening full product details.
                </p>
              </div>
              <div className="text-left lg:text-right">
                <span className="text-[#10295E] text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{visibleProducts.length}</span>
                <span className="text-[#7C8693] text-xs uppercase tracking-[0.16em] ml-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  product{visibleProducts.length === 1 ? "" : "s"} shown
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#B9C0CA]/60 bg-white/65 backdrop-blur-sm p-4 sm:p-5 mb-8 shadow-[0_18px_50px_rgba(7,21,47,0.12)]">
              <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-center">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#174A9B] pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search compounds or research areas"
                    aria-label="Search the research catalog"
                    className="w-full rounded-xl border border-[#B9C0CA]/65 bg-[#F6F1E9] text-[#202833] placeholder-[#7C8693] py-3.5 pl-12 pr-11 outline-none focus:border-[#174A9B]/55 focus:ring-2 focus:ring-[#174A9B]/10 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8693] hover:text-[#174A9B] p-1"
                      aria-label="Clear catalog search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <label className="flex min-w-0 flex-col gap-2 min-[360px]:flex-row min-[360px]:items-center min-[360px]:gap-3 text-[#5F6977] text-xs uppercase tracking-[0.14em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                  Sort
                  <select
                    value={sortOrder}
                    onChange={event => setSortOrder(event.target.value as SortOrder)}
                    className="w-full min-w-0 min-[360px]:w-auto min-[360px]:min-w-[190px] rounded-xl border border-[#B9C0CA]/65 bg-[#F6F1E9] text-[#202833] py-3.5 px-4 outline-none focus:border-[#174A9B]/55"
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
                        ? "bg-[#174A9B] border-[#174A9B] text-white"
                        : "border-[#B9C0CA] text-[#4B5563] hover:border-[#174A9B]/50 hover:text-[#174A9B]"
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
              <div className="rounded-2xl border border-[#B9C0CA]/60 bg-white/60 text-center py-20 px-6">
                <Search size={42} className="text-[#B9C0CA] mx-auto mb-4" />
                <h3 className="text-[#10295E] text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}>
                  No matching compounds
                </h3>
                <p className="text-[#7C8693] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Try another search term or reset the catalog controls.
                </p>
                <button onClick={resetCatalog} className="mt-6 px-5 py-2.5 rounded-lg border border-[#174A9B]/40 text-[#174A9B] hover:bg-[#174A9B]/10 transition-colors text-xs uppercase tracking-[0.16em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                  Reset Catalog
                </button>
              </div>
            )}

            <div className="mt-12 rounded-2xl border border-[#B9C0CA]/65 bg-[#E9DCCB]/65 px-5 sm:px-8 py-7 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[#174A9B] text-xs uppercase tracking-[0.22em] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                  Research-use safeguard
                </p>
                <p className="text-[#374151] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  All compounds are supplied strictly for in-vitro laboratory and scientific research. They are not intended for human or animal consumption, clinical use, diagnosis, treatment, or prevention of disease.
                </p>
              </div>
              <a href="/#faq" className="flex-shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#174A9B]/35 text-[#174A9B] hover:bg-[#174A9B]/8 transition-colors text-xs uppercase tracking-[0.16em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                Read Research FAQ
              </a>
            </div>
          </div>
        </section>

        <section className="border-y border-[#B9C0CA]/25 bg-[#10295E] py-14 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div>
              <p className="text-[#B9C0CA] text-xs uppercase tracking-[0.24em] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                Need help locating a product?
              </p>
              <h2 className="text-white text-4xl sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.04em" }}>
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
