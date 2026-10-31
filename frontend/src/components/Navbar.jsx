import React from 'react';
import { Heart, ShoppingBag, User } from 'lucide-react';

export default function Navbar({ onOpenHowItWorks, onOpenAbout, onOpenSaved, savedCount = 0 }) {
  return (
    <header className="w-full px-6 py-2.5 flex items-center justify-between z-30 select-none bg-white/35 backdrop-blur-xl border-b border-white/60 shadow-[0_2px_12px_rgba(41,35,49,0.03)]">
      {/* Brand Logo & Subtitle */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-[#292331]">
          Vogue<span className="font-serif italic font-normal text-[#9271BF]">Vision</span>
        </h1>
        <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#9271BF]">
          Computer Vision Fashion Studio
        </span>
      </div>

      {/* Center/Right Pill Navigation */}
      <div className="flex items-center gap-3">
        <nav className="flex items-center bg-white/45 backdrop-blur-md border border-white/70 rounded-full p-0.5 shadow-xs">
          <button
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-white text-[#292331] shadow-xs cursor-pointer"
          >
            Style Studio
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#6D6574] hover:text-[#292331] hover:bg-white/40 transition-all cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={onOpenAbout}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#6D6574] hover:text-[#292331] hover:bg-white/40 transition-all cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSaved}
            className="relative w-8 h-8 rounded-full bg-white/45 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#292331] hover:text-[#9271BF] hover:bg-white transition-all shadow-2xs cursor-pointer group"
            title="Saved Outfits"
          >
            <Heart className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9271BF] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          <button
            className="w-8 h-8 rounded-full bg-white/45 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#292331] hover:text-[#9271BF] hover:bg-white transition-all shadow-2xs cursor-pointer group"
            title="Wardrobe Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-white/45 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#292331] hover:text-[#9271BF] hover:bg-white transition-all shadow-2xs cursor-pointer group"
            title="Stylist Profile"
          >
            <User className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>
    </header>
  );
}
