import Navbar from './components/Navbar';
import AboutHero from './components/AboutHero';
import AboutImage from './components/AboutImage';
import AboutTimeline from './components/AboutTimeline';
import AboutStats from './components/AboutStats';
import AboutValues from './components/AboutValues';
import AboutCTA from './components/AboutCTA'; 
import Footer from './components/Footer'



export default function Home() {
  return (
 <main>
   <div className="container mx-auto px-4">
<Navbar/>
<AboutHero/>
<AboutImage/>
 <AboutTimeline />
 <AboutStats />
 <AboutValues />
   <AboutCTA />
   <Footer/>
    </div>
 </main>
  );
}