// === ELITE LA PEPTIDES — About & Science Section ===
// Split layout: text left, lab image right
// Dark navy background with cyan accent lines

import { useEffect, useRef } from "react";
import { FlaskConical, Shield, Zap, Award } from "lucide-react";

const LAB_IMG = "/manus-storage/lap-about-laboratory_2d9792ee.jpg";
const MOLECULE_IMG = "/manus-storage/lap-molecule-abstract_0d132707.jpg";

const pillars = [
  {
    icon: FlaskConical,
    title: "Pharmaceutical Grade",
    desc: "Every peptide is synthesized to the highest purity standards, with rigorous quality control at every stage of production.",
  },
  {
    icon: Shield,
    title: "Research Backed",
    desc: "Our formulations are grounded in peer-reviewed science, drawing from the latest clinical and preclinical research.",
  },
  {
    icon: Zap,
    title: "Formulation Precision",
    desc: "Precise concentrations formulated for reproducible research outcomes, ensuring each compound meets rigorous laboratory specifications.",
  },
  {
    icon: Award,
    title: "Elite Standards",
    desc: "Born in Los Angeles, built for the research-driven. We hold ourselves to the same standards as the institutions and laboratories we supply.",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const items = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* About Section */}
      <section
        id="about"
        ref={sectionRef}
        className="py-24 relative overflow-hidden"
        style={{ background: "oklch(0.15 0.055 255)" }}
      >
        {/* Decorative cyan line */}
        <div
          className="absolute left-0 top-0 w-1 h-full"
          style={{ background: "linear-gradient(to bottom, transparent, oklch(0.72 0.18 210), transparent)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-4 animate-on-scroll">
                <div className="h-px w-12 bg-[#00BFFF]" />
                <span
                  className="text-[#00BFFF] text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Who We Are
                </span>
              </div>

              <h2
                className="text-white mb-6 animate-on-scroll"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.05,
                }}
              >
                SCIENCE-BACKED.
                <br />
                <span style={{ color: "#00BFFF" }}>LA-TESTED.</span>
                <br />
                ELITE-APPROVED.
              </h2>

              <p
                className="text-white/65 mb-6 leading-relaxed animate-on-scroll"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "1rem" }}
              >
                LA Elite Peptides was founded on a singular conviction: that the most advanced research compounds should be accessible to qualified researchers who are serious about advancing scientific understanding. We are not a supplement company — we are a precision peptide supplier operating at the intersection of cutting-edge science and rigorous quality standards. All products are strictly for research use only.
              </p>

              <p
                className="text-white/65 mb-8 leading-relaxed animate-on-scroll"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "1rem" }}
              >
                Based in Los Angeles, our team curates and sources compounds that represent the frontier of peptide science — from metabolic pathway research and cellular biology to longevity studies and tissue repair mechanisms. Every product in our catalog has been selected for its research depth, documented purity, and scientific relevance.
              </p>

              <div className="flex items-center gap-4 animate-on-scroll">
                <div
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(to right, oklch(0.72 0.18 210 / 50%), transparent)" }}
                />
                <span
                  className="text-[#FF2D78] text-sm italic"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  Trusted. Tested. United States Of America.
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative animate-on-scroll">
              <div
                className="rounded-lg overflow-hidden group"
                style={{
                  boxShadow: "0 20px 80px oklch(0.72 0.18 210 / 15%), 0 0 0 1px oklch(0.72 0.18 210 / 15%)",
                }}
              >
                <img
                  src={LAB_IMG}
                  alt="Modern peptide research laboratory"
                  className="w-full h-80 lg:h-[420px] object-cover object-center transition-transform duration-700"
                  style={{
                    objectPosition: "center 20%",
                    transform: "scale(1)",
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              {/* Floating accent card */}
              <div
                className="absolute -bottom-6 -left-6 p-4 rounded-lg"
                style={{
                  background: "oklch(0.12 0.05 255 / 90%)",
                  border: "1px solid oklch(0.72 0.18 210 / 25%)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="text-[#00BFFF]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem" }}
                >
                  100%
                </div>
                <div
                  className="text-white/60 text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  Research Grade
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Science / Pillars Section */}
      <section
        id="science"
        className="py-24 relative overflow-hidden"
        style={{ background: "oklch(0.12 0.05 255)" }}
      >
        {/* Background molecule */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url(${MOLECULE_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#00BFFF]" />
              <span
                className="text-[#00BFFF] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                Our Standards
              </span>
              <div className="h-px w-12 bg-[#00BFFF]" />
            </div>
            <h2
              className="text-white"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                letterSpacing: "0.04em",
              }}
            >
              THE ELITE DIFFERENCE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="animate-on-scroll p-6 rounded-lg border border-white/8 transition-all duration-200 hover:border-[#00BFFF]/30 hover:bg-white/3"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center mb-4"
                    style={{ background: "oklch(0.72 0.18 210 / 12%)", border: "1px solid oklch(0.72 0.18 210 / 25%)" }}
                  >
                    <Icon size={20} style={{ color: "#00BFFF" }} />
                  </div>
                  <h4
                    className="text-white mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.05em" }}
                  >
                    {pillar.title}
                  </h4>
                  <p
                    className="text-white/55 text-sm leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
