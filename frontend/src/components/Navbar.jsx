import React from 'react';
import { Heart, ShoppingBag, User, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenHowItWorks, onOpenAbout, onOpenSaved, savedCount = 0 }) {
  return (
    <header className="w-full px-6 py-2.5 flex items-center justify-between z-30 select-none bg-white/[0.035] backdrop-blur-2xl border-b border-white/[0.10] shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex-shrink-0">
      {/* Brand Logo & Subtitle */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-[#F5F1F8]">
          Vogue<span className="font-serif italic font-normal text-[#B49AF4]">Vision</span>
        </h1>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B49AF4]/10 border border-[#B49AF4]/25">
          <Sparkles className="w-2.5 h-2.5 text-[#B49AF4]" />
          <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#B49AF4]">
            CV Styling Studio
          </span>
        </div>
      </div>

      {/* Center/Right Pill Navigation */}
      <div className="flex items-center gap-3">
        <nav className="flex items-center bg-white/[0.05] backdrop-blur-md border border-white/[0.12] rounded-full p-0.5 shadow-inner">
          <button
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#B49AF4]/20 border border-[#B49AF4]/50 text-[#F5F1F8] shadow-xs cursor-pointer"
          >
            Style Studio
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#AAA5B5] hover:text-[#F5F1F8] hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={onOpenAbout}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#AAA5B5] hover:text-[#F5F1F8] hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSaved}
            className="relative w-8 h-8 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.14] flex items-center justify-center text-[#AAA5B5] hover:text-[#B49AF4] hover:bg-white/[0.12] transition-all cursor-pointer group"
            title="Saved Outfits"
          >
            <Heart className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B49AF4] text-[#191723] text-[9.5px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          <button
            className="w-8 h-8 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.14] flex items-center justify-center text-[#AAA5B5] hover:text-[#B49AF4] hover:bg-white/[0.12] transition-all cursor-pointer group"
            title="Wardrobe Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.14] flex items-center justify-center text-[#AAA5B5] hover:text-[#B49AF4] hover:bg-white/[0.12] transition-all cursor-pointer group"
            title="Stylist Profile"
          >
            <User className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>
    </header>
  );
}
