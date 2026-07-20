'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FooterLink {
  label: string;
  href: string;
  isHash?: boolean;
  isScrollTop?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const footerSections: FooterSection[] = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact Us', href: '/contact' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#', isScrollTop: true },
        { label: 'Blog', href: '#', isScrollTop: true },
        { label: 'API', href: '#', isScrollTop: true },
        { label: 'Trading Plans', href: '/#trading-plans', isHash: true }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#', isScrollTop: true },
        { label: 'Terms of Service', href: '#', isScrollTop: true },
        { label: 'Cookie Policy', href: '#', isScrollTop: true },
        { label: 'Support', href: '#', isScrollTop: true }
      ]
    }
  ];

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      // If we're not on the home page, navigate to home first
      if (pathname !== '/' && path !== '') {
        router.push('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 500);
        return;
      }

      // If we're already on home page, scroll directly
      const element = document.getElementById(hash);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      router.push(href);
    }
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <footer className="border-t border-teal-500/20 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Footer Grid */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div>
              <div className="font-bold text-lg mb-4 tracking-wider">
                <span className="text-white">APE</span>
                <span className="text-teal-400 text-xl">X</span>
                <span className="text-white"> CAPITA</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced AI-powered trading that works 24/7 to generate profits.
              </p>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-sm">
                  {section.title}
                </h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.isScrollTop ? (
                        <a
                          href={link.href}
                          onClick={scrollToTop}
                          className="hover:text-teal-400 transition-colors duration-200 cursor-pointer"
                        >
                          {link.label}
                        </a>
                      ) : link.isHash ? (
                        <Link 
                          href={link.href}
                          onClick={(e) => handleSmoothScroll(e, link.href)}
                          className="hover:text-teal-400 transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <Link 
                          href={link.href}
                          className="hover:text-teal-400 transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-teal-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Apex Capita. All rights reserved. Trading carries risk.
            </p>
            <div className="flex gap-6 text-gray-400 text-xs">
              <a href="#" onClick={scrollToTop} className="hover:text-teal-400 transition-colors duration-200 cursor-pointer">
                Privacy
              </a>
              <a href="#" onClick={scrollToTop} className="hover:text-teal-400 transition-colors duration-200 cursor-pointer">
                Terms
              </a>
              <a href="#" onClick={scrollToTop} className="hover:text-teal-400 transition-colors duration-200 cursor-pointer">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 bg-teal-500 hover:bg-teal-600 text-slate-950 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </>
  );
};

export default Footer;