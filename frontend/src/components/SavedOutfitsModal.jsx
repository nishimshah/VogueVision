import React from 'react';
import { X, Trash2, ArrowRight, Sparkles, Shirt } from 'lucide-react';

export default function SavedOutfitsModal({ isOpen, onClose, savedOutfits, onLoadOutfit, onDeleteOutfit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241B35]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl border border-white rounded-3xl p-7 shadow-[0_20px_60px_rgba(80,40,120,0.25)] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#8B5AC2]/10 hover:bg-[#8B5AC2]/20 flex items-center justify-center text-[#241B35] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B5AC2]">
            Curated Wardrobe
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#241B35] mt-1">
            Saved Outfits ({savedOutfits.length})
          </h2>
          <p className="text-xs text-[#241B35]/70 mt-1">
            Revisit and apply your favorite styled combinations.
          </p>
        </div>

        {savedOutfits.length === 0 ? (
          <div className="py-12 text-center text-[#241B35]/60 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#8B5AC2]/10 flex items-center justify-center mb-3 text-[#8B5AC2]">
              <Shirt className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium">No saved outfits yet</p>
            <p className="text-xs mt-1">Click "Save Outfit" under the central mannequin to save a combination.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedOutfits.map((outfit, idx) => (
              <div 
                key={outfit.id || idx}
                className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-xs flex items-center justify-between gap-4 hover:border-[#8B5AC2]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3 overflow-hidden p-1">
                    {outfit.top && (
                      <img 
                        src={`/catalog/${outfit.top.image}`} 
                        alt={outfit.top.name} 
                        className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-xs" 
                      />
                    )}
                    {outfit.bottom && (
                      <img 
                        src={`/catalog/${outfit.bottom.image}`} 
                        alt={outfit.bottom.name} 
                        className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-xs" 
                      />
                    )}
                    {outfit.shoes && (
                      <img 
                        src={`/catalog/${outfit.shoes.image}`} 
                        alt={outfit.shoes.name} 
                        className="inline-block h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-xs" 
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#241B35]">
                      {outfit.name || `Custom Look #${idx + 1}`}
                    </h4>
                    <p className="text-[11px] text-[#241B35]/65">
                      {outfit.top?.name || 'Top'} + {outfit.bottom?.name || 'Bottom'}
                    </p>
                    <span className="text-[10px] text-[#8B5AC2] font-medium">
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
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#8B5AC2] text-white hover:bg-[#7848AE] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id || idx)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer"
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
