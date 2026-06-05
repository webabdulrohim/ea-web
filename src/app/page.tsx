import Hero from "@/components/landing/Hero";
import ProgramGrid from "@/components/landing/ProgramGrid";
import LeadCapture from "@/components/landing/LeadCapture";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import OwnerWelcome from "@/components/landing/OwnerWelcome";
import TestimonialSlider from "@/components/landing/TestimonialSlider";
import Gallery from "@/components/landing/Gallery";
import MapsSection from "@/components/landing/MapsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors">
      <Navbar />
      <Hero />
      <OwnerWelcome />
      <div id="program">
        <ProgramGrid />
      </div>
      <Gallery />
      <TestimonialSlider />
      <MapsSection />
      <LeadCapture />
      <Footer />
    </main>
  );
}
