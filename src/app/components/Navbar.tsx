'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import Translator from './Translator';

interface NavLink {
  href: string;
  label: string;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { handleNavigation } = useSmoothScroll();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks: NavLink[] = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT' },
    { href: '/#trading-plans', label: 'TRADING PLANS' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'CONTACT' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path.includes('#')) {
      const [basePath] = path.split('#');
      return pathname === basePath || pathname === '/';
    }
    return pathname === path;
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className={`border-b border-teal-500/20 sticky top-0 bg-slate-950/95 backdrop-blur-sm z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg shadow-teal-500/5' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white text-2xl hover:text-teal-400 transition-colors"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Logo */}
        <Link href="/admin" className="text-xl lg:text-2xl font-bold tracking-wider">
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
              onClick={(e) => handleNavigation(link.href, e)}
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

        {/* Mobile Profile Icon with Dropdown */}
        <div className="md:hidden relative" ref={dropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors focus:outline-none"
            aria-label="Profile menu"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-12 w-44 bg-slate-800 border border-teal-500/30 rounded-xl py-2 z-40 shadow-xl">
              <Link
                href="/login"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-200 hover:text-teal-400 hover:bg-teal-500/10 text-sm font-semibold transition"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-slate-200 hover:text-amber-400 hover:bg-amber-500/10 text-sm font-semibold transition"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex gap-3 items-center">
          <Translator />
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
                  handleNavigation(link.href, e);
                  setIsMobileMenuOpen(false);
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
              <div className="px-3">
                <Translator />
              </div>
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