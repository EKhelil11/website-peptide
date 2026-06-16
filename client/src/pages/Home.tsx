// === ELITE LA PEPTIDES — Home Page ===
// Assembles: VideoIntro → Navbar → Hero → Products → About/Science → Footer
// Design: Midnight Clinic — dark navy + cyan + hot pink

import { useState, useEffect } from "react";
import VideoIntro from "@/components/VideoIntro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);

  const handleIntroComplete = () => {
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
      {/* Video intro splash — unmounts after completion */}
      {!introComplete && <VideoIntro onComplete={handleIntroComplete} />}

      {/* Main site — fades in after intro */}
      <div
        style={{
          opacity: mainVisible ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <Navbar />
        <main>
          <HeroSection />
          <ProductsSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
