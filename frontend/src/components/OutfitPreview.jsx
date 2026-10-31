import React from 'react';
import { 
  Sparkles, ArrowRight, ChevronLeft, ChevronRight, 
  Heart, RotateCcw, Check, AlertCircle 
} from 'lucide-react';

import neutralBaseImg from '../assets/mannequin/neutral_base.jpg';
import { PREDEFINED_OUTFITS } from '../data/outfits';

export default function OutfitPreview({ 
  selectedOutfit, 
  onPrevLook,
  onNextLook,
  onSaveOutfit,
  onResetOutfit,
  activeLookIndex,
  onApplyPreset
}) {
  const top = selectedOutfit?.top;
  const bottom = selectedOutfit?.bottom;
  const dress = selectedOutfit?.dress;

  // Find exact matching predefined realistic outfit
  const matchedPreset = PREDEFINED_OUTFITS.find(preset => preset.matches(selectedOutfit));
  const isDirectMatch = Boolean(matchedPreset);

  // Find closest verified studio suggestion if current combination is mix & match
  const suggestedPreset = PREDEFINED_OUTFITS.find(p => {
    if (dress && p.dressId === dress.id) return true;
    if (top && p.topId === top.id) return true;
    if (bottom && p.bottomId === bottom.id) return true;
    return false;
  }) || PREDEFINED_OUTFITS[0];

  const currentLook = isDirectMatch ? matchedPreset : (PREDEFINED_OUTFITS[activeLookIndex] || PREDEFINED_OUTFITS[0]);

  // Dynamic look title
  const displayedLookTitle = isDirectMatch 
    ? matchedPreset.shortName 
    : (dress ? dress.name : `${top?.name || 'Selected Top'} + ${bottom?.name || 'Selected Bottom'}`);

  const activeDisplayImage = isDirectMatch ? matchedPreset.image : neutralBaseImg;

  return (
    <div className="w-full h-full flex flex-col justify-between items-center min-h-0 select-none">
      
      {/* Top Header & Status Indicator */}
      <div className="w-full flex items-center justify-between px-2 mb-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B49AF4] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#F5F1F8] uppercase tracking-wider">
            Virtual Showroom
          </span>
          <span className="text-[10px] text-[#AAA5B5] hidden sm:inline">
            • Realistic Studio Mannequin
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isDirectMatch ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#B49AF4]/15 border border-[#B49AF4]/30 text-[10px] text-[#B49AF4] font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 text-[#B49AF4]" />
              Verified Studio Look
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] text-amber-300 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Unsupported Pairing
            </span>
          )}
        </div>
      </div>

      {/* CENTER MANNEQUIN DISPLAY CHAMBER */}
      <div className="relative w-full flex-1 min-h-0 rounded-2xl overflow-hidden mannequin-chamber border border-white/[0.14] shadow-[0_16px_48px_rgba(0,0,0,0.5)] flex items-center justify-center p-2">
        <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-200">
          <img
            src={activeDisplayImage}
            alt={isDirectMatch ? matchedPreset.name : "Studio Showroom Mannequin"}
            className="w-full h-full object-contain rounded-xl"
          />

          {isDirectMatch ? (
            /* Verified Studio Look Badge */
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#191723]/80 backdrop-blur-md border border-[#B49AF4]/40 text-[9.5px] font-bold text-[#B49AF4] shadow-xs pointer-events-none flex items-center gap-1">
              <Check className="w-3 h-3 text-[#B49AF4]" />
              Verified Studio Look
            </div>
          ) : (
            /* Compact Floating Glass Notice for Unsupported Combinations */
            <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-[#191723]/92 backdrop-blur-md border border-white/[0.16] shadow-2xl flex flex-col gap-1.5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span>Unsupported Preview Combination</span>
                </div>
                <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium">
                  Studio Image Pending
                </span>
              </div>
              <p className="text-[10.5px] text-[#AAA5B5] leading-relaxed">
                Selected: <span className="text-[#F5F1F8] font-medium">{displayedLookTitle}</span>. A realistic studio mannequin photograph is currently not available for this exact combination.
              </p>
              {suggestedPreset && (
                <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[10px] text-[#AAA5B5]">
                    Recommended Studio Look: <span className="text-[#B49AF4] font-medium">{suggestedPreset.shortName}</span>
                  </span>
                  <button
                    onClick={() => onApplyPreset(suggestedPreset.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#B49AF4]/20 hover:bg-[#B49AF4]/30 border border-[#B49AF4]/40 text-[#F5F1F8] text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    Equip Verified Look
                    <ArrowRight className="w-3 h-3 text-[#B49AF4]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* COMPACT GLASS TOOLBAR DIRECTLY BELOW THE MANNEQUIN */}
      {/* Layout: [←] Look X / 7 — [Look Title] [→] [♡ Save] [↺ Reset] */}
      <div className="w-full mt-2 flex items-center justify-between px-3 py-1.5 rounded-xl glass-toolbar border border-white/[0.14] flex-shrink-0 shadow-lg">
        {/* Navigation Arrows & Current Look Name */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            id="prev-look-btn"
            onClick={onPrevLook}
            className="w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.12] flex items-center justify-center text-[#F5F1F8] hover:text-[#B49AF4] transition-all cursor-pointer flex-shrink-0"
            title="Previous Look"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-medium text-[#F5F1F8] truncate max-w-[260px] tracking-wide">
            {isDirectMatch ? currentLook.name : `Mix & Match — ${displayedLookTitle}`}
          </span>

          <button
            id="next-look-btn"
            onClick={onNextLook}
            className="w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.12] flex items-center justify-center text-[#F5F1F8] hover:text-[#B49AF4] transition-all cursor-pointer flex-shrink-0"
            title="Next Look"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons: Save & Reset */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onSaveOutfit}
            className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.12] text-[10.5px] font-medium text-[#F5F1F8] hover:text-[#B49AF4] transition-all flex items-center gap-1 cursor-pointer"
            title="Save Outfit"
          >
            <Heart className="w-3 h-3 text-[#B49AF4]" />
            Save
          </button>

          <button
            onClick={onResetOutfit}
            className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.12] text-[10.5px] font-medium text-[#AAA5B5] hover:text-[#F5F1F8] transition-all flex items-center gap-1 cursor-pointer"
            title="Reset Outfit"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

    </div>
  );
}
