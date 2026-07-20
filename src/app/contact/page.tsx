import Navbar from './components/Navbar';
import ContactHero from './components/ContactHero';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer'



export default function Home() {
  return (
 <main>
   <div className="container mx-auto px-4">
<Navbar/>
<ContactHero/>
<ContactForm/>
<Footer/>
    </div>
 </main>
  );
}