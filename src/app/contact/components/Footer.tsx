'use client';

import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-teal-500/20 bg-slate-950 py-10 px-6 text-center">
      <div className="text-xl font-bold tracking-wider mb-3">
        <span className="text-white">APE</span>
        <span className="text-teal-400 text-2xl">X</span>
        <span className="text-white"> CAPITA</span>
      </div>
      <p className="text-gray-500 text-xs">
        &copy; {currentYear} Apex Capita. All rights reserved. Trading carries risk.
      </p>
    </footer>
  );
};

export default Footer;