import React from 'react';
import { Heart, ShoppingBag, User } from 'lucide-react';

export default function Navbar({ onOpenHowItWorks, onOpenAbout, onOpenSaved, savedCount = 0 }) {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between z-30 select-none bg-[#111318]/80 backdrop-blur-md border-b border-white/10">
      {/* Brand Logo & Subtitle */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#F5F5F7]">
          Vogue<span className="font-serif italic font-normal text-[#A78BFA]">Vision</span>
        </h1>
        <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#A78BFA] mt-0.5">
          Computer Vision Fashion Studio
        </span>
      </div>

      {/* Center/Right Pill Navigation */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <button
            className="px-5 py-2 rounded-full text-xs font-bold tracking-wide bg-[#A78BFA] text-[#111318] shadow-xs transition-all cursor-pointer"
          >
            Style Studio
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#A8ADB8] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={onOpenAbout}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#A8ADB8] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right utility buttons (Favorites / Bag / User) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSaved}
            className="relative w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#A8ADB8] hover:text-[#A78BFA] hover:bg-white/10 transition-all cursor-pointer group"
            title="Saved Outfits"
          >
            <Heart className="w-4 h-4 transition-transform group-hover:scale-110" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A78BFA] text-[#111318] text-[10px] font-bold flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          <button
            className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#A8ADB8] hover:text-[#A78BFA] hover:bg-white/10 transition-all cursor-pointer group"
            title="Wardrobe Bag"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>

          <button
            className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#A8ADB8] hover:text-[#A78BFA] hover:bg-white/10 transition-all cursor-pointer group"
            title="Stylist Profile"
          >
            <User className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>
    </header>
  );
}
