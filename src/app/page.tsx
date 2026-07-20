import Image from "next/image";
import Navbar from "./components/Navbar";
import StatusIndicator from './components/StatusIndicator';
import HeroSection from './components/HeroSection';
import LiveBotActivity from './components/LiveBotActivity';
import WhyApexAI from './components/WhyApexAI';
import StrategyEngine from './components/StrategyEngine';
import TestimonialsPricing from './components/TestimonialsPricing';
import Footer from './components/Footer';


export default function Home() {
  return (
 <main>
   <div className="container mx-auto px-4">
<Navbar />
<StatusIndicator/>
 <HeroSection />
  <LiveBotActivity />
  <WhyApexAI />
  <StrategyEngine />
  <TestimonialsPricing />
  <Footer/>
    </div>
 </main>
  );
}
