import React from 'react';
import { X, Trash2, ArrowRight, Shirt } from 'lucide-react';

export default function SavedOutfitsModal({ isOpen, onClose, savedOutfits, onLoadOutfit, onDeleteOutfit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#191C22] border border-white/15 rounded-3xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[85vh] overflow-y-auto text-[#F5F5F7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A78BFA]">
            Curated Wardrobe
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Saved Outfits ({savedOutfits.length})
          </h2>
          <p className="text-xs text-[#A8ADB8] mt-1">
            Revisit and apply your favorite styled combinations.
          </p>
        </div>

        {savedOutfits.length === 0 ? (
          <div className="py-12 text-center text-[#A8ADB8] flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-[#A78BFA]">
              <Shirt className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-white">No saved outfits yet</p>
            <p className="text-xs mt-1">Click "Save Outfit" under the central mannequin to save a combination.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {savedOutfits.map((outfit, idx) => (
              <div 
                key={outfit.id || idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xs flex items-center justify-between gap-4 hover:border-[#A78BFA]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3 overflow-hidden p-1">
                    {outfit.top && (
                      <img 
                        src={`/catalog/${outfit.top.image}`} 
                        alt={outfit.top.name} 
                        className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-[#191C22] shadow-xs" 
                      />
                    )}
                    {outfit.bottom && (
                      <img 
                        src={`/catalog/${outfit.bottom.image}`} 
                        alt={outfit.bottom.name} 
                        className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-[#191C22] shadow-xs" 
                      />
                    )}
                    {outfit.shoes && (
                      <img 
                        src={`/catalog/${outfit.shoes.image}`} 
                        alt={outfit.shoes.name} 
                        className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-[#191C22] shadow-xs" 
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {outfit.name || `Custom Look #${idx + 1}`}
                    </h4>
                    <p className="text-[11px] text-[#A8ADB8]">
                      {outfit.top?.name || outfit.dress?.name || 'Top'} + {outfit.bottom?.name || 'Separates'}
                    </p>
                    <span className="text-[10px] text-[#A78BFA] font-medium">
                      Saved {new Date(outfit.savedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onLoadOutfit(outfit);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#A78BFA] text-[#111318] hover:bg-[#BFA5FB] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id || idx)}
                    className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all cursor-pointer"
                    title="Delete outfit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
