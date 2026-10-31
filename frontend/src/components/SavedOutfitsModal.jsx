import React from 'react';
import { X, Trash2, ArrowRight, Shirt } from 'lucide-react';

export default function SavedOutfitsModal({ isOpen, onClose, savedOutfits, onLoadOutfit, onDeleteOutfit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292331]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_20px_50px_rgba(41,35,49,0.18)] max-h-[85vh] overflow-y-auto text-[#292331]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#292331] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9271BF]">
            Curated Wardrobe
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#292331] mt-0.5">
            Saved Outfits ({savedOutfits.length})
          </h2>
          <p className="text-xs text-[#6D6574] mt-1">
            Revisit and apply your favorite styled combinations.
          </p>
        </div>

        {savedOutfits.length === 0 ? (
          <div className="py-10 text-center text-[#6D6574] flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#9271BF]/10 border border-[#9271BF]/20 flex items-center justify-center mb-2.5 text-[#9271BF]">
              <Shirt className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-[#292331]">No saved outfits yet</p>
            <p className="text-xs mt-0.5">Click "Save" on the outfit toolbar below the mannequin to save a combination.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedOutfits.map((outfit, idx) => (
              <div 
                key={outfit.id || idx}
                className="p-3.5 rounded-2xl bg-white/70 border border-white/80 shadow-xs flex items-center justify-between gap-4 hover:border-[#9271BF]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5 overflow-hidden p-0.5">
                    {outfit.top && (
                      <img 
                        src={`/catalog/${outfit.top.image}`} 
                        alt={outfit.top.name} 
                        className="inline-block h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs" 
                      />
                    )}
                    {outfit.bottom && (
                      <img 
                        src={`/catalog/${outfit.bottom.image}`} 
                        alt={outfit.bottom.name} 
                        className="inline-block h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs" 
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#292331]">
                      {outfit.name || `Custom Look #${idx + 1}`}
                    </h4>
                    <p className="text-[11px] text-[#6D6574]">
                      {outfit.top?.name || outfit.dress?.name || 'Top'} + {outfit.bottom?.name || 'Separates'}
                    </p>
                    <span className="text-[10px] text-[#9271BF] font-medium">
                      Saved {new Date(outfit.savedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onLoadOutfit(outfit);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#9271BF] text-white hover:bg-[#815EAE] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id || idx)}
                    className="w-7 h-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer"
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
