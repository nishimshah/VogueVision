import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Shirt, Eye } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Outfit Match', path: '/outfits' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 fashion-glass border-b border-[#EDE3F4]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7950A3] to-[#E8B5C4] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif tracking-tight text-[#211827]">
                Vogue<span className="text-[#7950A3] font-normal italic">Vision</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#7950A3]/80 -mt-1 font-medium">
                CV Fashion Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-[#EDE3F4] text-[#7950A3] shadow-xs'
                    : 'text-[#211827]/80 hover:text-[#7950A3] hover:bg-[#F5EEF5]/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action / CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#7950A3] to-[#9165BF] hover:from-[#6A4392] hover:to-[#7950A3] shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-[#EDE3F4]" />
              <span>Discover Your Style</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#211827] hover:bg-[#EDE3F4]/50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EDE3F4] bg-[#FAF8F7] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'bg-[#EDE3F4] text-[#7950A3]'
                  : 'text-[#211827] hover:bg-[#F5EEF5]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-[#7950A3] hover:bg-[#6A4392]"
            >
              <Sparkles className="w-4 h-4 text-[#EDE3F4]" />
              <span>Discover Your Style</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
