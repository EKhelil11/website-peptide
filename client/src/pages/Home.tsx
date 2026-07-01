// === ELITE LA PEPTIDES — Home Page ===
// Assembles: VideoIntro → Navbar → Hero → Products → About/Science → Footer
// Design: Midnight Clinic — dark navy + cyan + hot pink

import { useState, useEffect } from "react";
import SplashIntro from "@/components/SplashIntro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import ShippingSection from "@/components/ShippingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

const INTRO_SEEN_KEY = "elitela_intro_seen";

export default function Home() {
  // Skip intro on mobile (< 768px) or if already seen this session
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const alreadySeen = typeof sessionStorage !== "undefined" && sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  const skipIntro = isMobile || alreadySeen;
  const [introComplete, setIntroComplete] = useState(skipIntro);
  const [mainVisible, setMainVisible] = useState(skipIntro);

  const handleIntroComplete = () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    }
    setIntroComplete(true);
    // Slight delay before fading in main content for a polished transition
    setTimeout(() => setMainVisible(true), 50);
  };

  // Scroll animation observer for the whole page
  useEffect(() => {
    if (!mainVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const items = document.querySelectorAll(".animate-on-scroll");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [mainVisible]);

  return (
    <>
      {/* Cinematic splash intro — desktop only, unmounts after completion */}
      {!introComplete && <SplashIntro onComplete={handleIntroComplete} />}

      {/* Main site — fades in after intro */}
      <div
        style={{
          opacity: mainVisible ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <Navbar />
        <AnnouncementBar />
        <main>
          <HeroSection />
          <ProductsSection />
          <ShippingSection />
          <AboutSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
