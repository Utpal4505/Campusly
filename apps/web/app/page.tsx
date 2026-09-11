import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import ProblemSection from "@/components/ProblemSection";
import FinalCTA from "@/components/FinalCTA";

export const metadata: Metadata = {
  title: "Campusly – Discover your people and opportunities",
  description: "Find clubs, events, projects, and peers that match your interests on campus.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <ValueProps />
      <ProblemSection />
      <FinalCTA />
      
      {/* Simple, clean student-product footer */}
      <footer className="border-t border-border/40 py-8 bg-muted/20 text-center text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
              C
            </span>
            <span>Campusly</span>
          </div>
          <p>© 2026 Campusly. Empowering campus builders, leaders, and communities.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-foreground transition-colors">Terms</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
