import About from "../components/landing/About";
import CallToAction from "../components/landing/CallToAction";
import CityTicker from "../components/landing/CityTicker";
import Features from "../components/landing/Features";
import FeaturesCore from "../components/landing/FeaturesCore";
import Footer from "../components/landing/Footer";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Navbar from "../components/landing/Navbar";
import OverviewSection from "../components/landing/OverviewSection";

const Landing = () => {
  return (
    /* Replace dynamic theme variables with hardcoded slate colors */
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <Hero />
    
      <CityTicker />
      <div id="about"><About /></div>
      <div id="features"><Features /></div>
      <FeaturesCore />
      <OverviewSection />
      <div id="how-it-works"><HowItWorks /></div>
      <CallToAction />
      <Footer />
    </main>
  );
};

export default Landing;