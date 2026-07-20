'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
  isHash?: boolean;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks: NavLink[] = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT' },
    { href: '/#trading-plans', label: 'TRADING PLANS', isHash: true },
    { href: '/how-it-works', label: 'HOW IT WORKS' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'CONTACT' },
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scroll to section
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);

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
    }
  };

  // Handle regular navigation
  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path.includes('#')) {
      const [basePath] = path.split('#');
      return pathname === basePath || pathname === '/';
    }
    return pathname === path;
  };

  return (
    <nav className={`border-b border-teal-500/20 sticky top-0 bg-slate-950/95 backdrop-blur-sm z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg shadow-teal-500/5' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="text-xl lg:text-2xl font-bold tracking-wider">
          <span className="text-white">APE</span>
          <span className="text-teal-400 text-2xl lg:text-3xl">X</span>
          <span className="text-white"> CAPITA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (link.isHash) {
                  handleSmoothScroll(e, link.href);
                } else {
                  handleNavigation(link.href);
                }
              }}
              className={`text-sm font-semibold uppercase transition-colors ${
                isActive(link.href)
                  ? 'text-amber-500 hover:text-amber-400 border-b-2 border-amber-500'
                  : 'text-gray-300 hover:text-teal-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Profile Icon */}
        <div className="md:hidden relative">
          <Link 
            href="/" 
            className="h-10 text-teal-400 text-sm font-semibold items-center justify-center hover:bg-teal-600 transition-colors"
          >
           ← Home
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          <Link 
            href="/login" 
            className="text-gray-300 hover:text-teal-400 transition-colors px-3 py-2 text-sm font-semibold"
          >
            LOGIN
          </Link>
          <Link 
            href="/signup" 
            className="bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-md hover:bg-amber-600 transition-colors text-sm"
          >
            SIGN UP
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-sm border-t border-teal-500/20 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.isHash) {
                    handleSmoothScroll(e, link.href);
                  } else {
                    handleNavigation(link.href);
                  }
                }}
                className={`text-sm font-semibold uppercase transition-colors ${
                  isActive(link.href)
                    ? 'text-amber-500 hover:text-amber-400'
                    : 'text-gray-300 hover:text-teal-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-teal-500/20 flex flex-col space-y-3">
              <Link 
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-teal-400 transition-colors px-3 py-2 text-sm font-semibold text-center"
              >
                LOGIN
              </Link>
              <Link 
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-md hover:bg-amber-600 transition-colors text-sm text-center"
              >
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;