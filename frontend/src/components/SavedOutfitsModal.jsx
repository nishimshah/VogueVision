import React from 'react';
import { X, Trash2, ArrowRight, Shirt } from 'lucide-react';

export default function SavedOutfitsModal({ isOpen, onClose, savedOutfits, onLoadOutfit, onDeleteOutfit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#211E2B]/95 backdrop-blur-2xl border border-white/[0.16] rounded-3xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)] max-h-[85vh] overflow-y-auto text-[#F5F1F8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center text-[#F5F1F8] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49AF4]">
            Curated Wardrobe
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#F5F1F8] mt-0.5">
            Saved Outfits ({savedOutfits.length})
          </h2>
          <p className="text-xs text-[#AAA5B5] mt-1">
            Revisit and apply your favorite styled combinations.
          </p>
        </div>

        {savedOutfits.length === 0 ? (
          <div className="py-10 text-center text-[#AAA5B5] flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#B49AF4]/10 border border-[#B49AF4]/20 flex items-center justify-center mb-2.5 text-[#B49AF4]">
              <Shirt className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-[#F5F1F8]">No saved outfits yet</p>
            <p className="text-xs mt-0.5">Click "Save" on the outfit toolbar below the mannequin to save a combination.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedOutfits.map((outfit, idx) => (
              <div 
                key={outfit.id || idx}
                className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-xs flex items-center justify-between gap-4 hover:border-[#B49AF4]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5 overflow-hidden p-0.5">
                    {outfit.top && (
                      <img 
                        src={`/catalog/${outfit.top.image}`} 
                        alt={outfit.top.name} 
                        className="inline-block h-11 w-11 rounded-full object-cover ring-2 ring-[#211E2B] shadow-xs" 
                      />
                    )}
                    {outfit.bottom && (
                      <img 
                        src={`/catalog/${outfit.bottom.image}`} 
                        alt={outfit.bottom.name} 
                        className="inline-block h-11 w-11 rounded-full object-cover ring-2 ring-[#211E2B] shadow-xs" 
                      />
                    )}
                    {outfit.dress && (
                      <img 
                        src={`/catalog/${outfit.dress.image}`} 
                        alt={outfit.dress.name} 
                        className="inline-block h-11 w-11 rounded-full object-cover ring-2 ring-[#211E2B] shadow-xs" 
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F1F8]">
                      {outfit.name || 'Custom Ensemble'}
                    </h4>
                    <p className="text-[11px] text-[#AAA5B5]">
                      {[outfit.top?.name, outfit.bottom?.name, outfit.dress?.name].filter(Boolean).join(' + ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onLoadOutfit(outfit);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-btn-primary flex items-center gap-1 cursor-pointer"
                  >
                    Equip
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-1.5 rounded-xl text-[#AAA5B5] hover:text-red-400 hover:bg-white/[0.08] transition-all cursor-pointer"
                    title="Delete Outfit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/[0.10] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] text-[#F5F1F8] hover:bg-white/[0.12] transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
