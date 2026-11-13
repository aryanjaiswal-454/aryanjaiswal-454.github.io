import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CommandPalette } from "./components/layout/CommandPalette";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { NetworkBackdrop } from "./components/layout/NetworkBackdrop";
import { PageIntro } from "./components/layout/PageIntro";
import { PortfolioMediaPreloader } from "./components/layout/PortfolioMediaPreloader";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { Seo } from "./components/layout/Seo";
import { Contact } from "./components/sections/Contact";
import { Certifications } from "./components/sections/Certifications";
import { Home } from "./components/sections/Home";
import { Hero } from "./components/sections/Hero";
import { Projects } from "./components/sections/Projects";
import { Recognition } from "./components/sections/Recognition";
import { Resume } from "./components/sections/Resume";
import { Skills } from "./components/sections/Skills";
import { Timeline } from "./components/sections/Timeline";
import { useMotionPreference } from "./hooks/useMotionPreference";
import { SiteMotionContext } from "./hooks/useSiteMotion";

const AdminPage = lazy(() => import("./pages/AdminPage").then((module) => ({ default: module.AdminPage })));

function PortfolioPage() {
  const { enabled, toggle } = useMotionPreference();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <SiteMotionContext.Provider value={enabled}>
      <div className={`portfolio-app${enabled ? "" : " motion-off"}`}>
        <NetworkBackdrop active={enabled} />
        <PortfolioMediaPreloader />
        <Seo />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <ScrollProgress />
        <PageIntro />
        <Navbar
          motionEnabled={enabled}
          onToggleMotion={toggle}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <main id="main-content">
          <Hero motionEnabled={enabled} />
          <Home />
          <Projects />
          <Skills />
          <Timeline />
          <Recognition />
          <Certifications />
          <Resume />
          <Contact />
        </main>
        <Footer />
        {paletteOpen && <CommandPalette onClose={closePalette} />}
      </div>
    </SiteMotionContext.Provider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin" element={<Suspense fallback={<main className="admin-page"><p className="admin-empty">Loading admin…</p></main>}><AdminPage /></Suspense>} />
      <Route path="*" element={<PortfolioPage />} />
    </Routes>
  );
}
