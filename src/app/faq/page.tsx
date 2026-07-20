import Navbar from './components/Navbar';
import FAQHero from './components/FAQHero';
import FAQList from './components/FAQList';
import FAQContact from './components/FAQContact';
import Footer from './components/Footer'



export default function Home() {
  return (
 <main>
   <div className="container mx-auto px-4">
<Navbar/>
<FAQHero/>
<FAQList/>
<FAQContact/>
<Footer/>
    </div>
 </main>
  );
}