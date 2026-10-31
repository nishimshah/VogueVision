import React from 'react';
import { Heart, ShoppingBag, User } from 'lucide-react';

export default function Navbar({ onOpenHowItWorks, onOpenAbout, onOpenSaved, savedCount = 0 }) {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between z-30 select-none">
      {/* Brand Logo & Subtitle */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#241B35]">
          Vogue<span className="font-serif italic font-normal text-[#8B5AC2]">Vision</span>
        </h1>
        <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#8B5AC2]/90 mt-0.5">
          Computer Vision Fashion Studio
        </span>
      </div>

      {/* Center/Right Pill Navigation */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center bg-white/40 backdrop-blur-xl border border-white/60 rounded-full p-1 shadow-[0_4px_20px_rgba(139,90,194,0.06)]">
          <button
            className="px-5 py-2 rounded-full text-xs font-semibold tracking-wide bg-white text-[#241B35] shadow-[0_2px_8px_rgba(139,90,194,0.12)] transition-all cursor-pointer"
          >
            Style Studio
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#241B35]/75 hover:text-[#8B5AC2] hover:bg-white/50 transition-all cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={onOpenAbout}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#241B35]/75 hover:text-[#8B5AC2] hover:bg-white/50 transition-all cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right utility buttons (Favorites / Bag / User) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSaved}
            className="relative w-9 h-9 rounded-full bg-white/45 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#241B35] hover:text-[#8B5AC2] hover:bg-white transition-all shadow-xs cursor-pointer group"
            title="Saved Outfits"
          >
            <Heart className="w-4 h-4 transition-transform group-hover:scale-110" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B5AC2] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          <button
            className="w-9 h-9 rounded-full bg-white/45 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#241B35] hover:text-[#8B5AC2] hover:bg-white transition-all shadow-xs cursor-pointer group"
            title="Wardrobe Bag"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>

          <button
            className="w-9 h-9 rounded-full bg-white/45 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#241B35] hover:text-[#8B5AC2] hover:bg-white transition-all shadow-xs cursor-pointer group"
            title="Stylist Profile"
          >
            <User className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>
    </header>
  );
}
