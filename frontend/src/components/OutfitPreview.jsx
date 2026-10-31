import React from 'react';
import { 
  Sparkles, ArrowRight, ChevronLeft, ChevronRight, 
  Heart, RotateCcw, Check, Layers 
} from 'lucide-react';

import { PREDEFINED_OUTFITS } from '../data/outfits';

export default function OutfitPreview({ 
  selectedOutfit, 
  onPrevLook,
  onNextLook,
  onSaveOutfit,
  onResetOutfit,
  activeLookIndex,
  onApplyPreset,
  stylingMode = 'auto',
  onModeChange
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
            • {isDirectMatch ? 'Realistic Studio Mannequin' : 'Mix & Match Board'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Styling Mode Toggle: Auto Style vs Mix & Match */}
          <div className="flex items-center bg-white/[0.05] p-0.5 rounded-full border border-white/[0.12] shadow-xs">
            <button
              id="mode-auto-btn"
              onClick={() => onModeChange?.('auto')}
              className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold transition-all cursor-pointer ${
                stylingMode === 'auto'
                  ? 'bg-[#B49AF4] text-[#191723] font-bold shadow-xs'
                  : 'text-[#AAA5B5] hover:text-[#F5F1F8]'
              }`}
              title="Auto Style: Selecting a top automatically equips its verified matching bottom"
            >
              Auto Style
            </button>
            <button
              id="mode-mix-btn"
              onClick={() => onModeChange?.('mix_match')}
              className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold transition-all cursor-pointer ${
                stylingMode === 'mix_match'
                  ? 'bg-[#B49AF4] text-[#191723] font-bold shadow-xs'
                  : 'text-[#AAA5B5] hover:text-[#F5F1F8]'
              }`}
              title="Mix & Match: Freely select tops and bottoms independently (preserves current bottom)"
            >
              Mix & Match
            </button>
          </div>

          <div className="flex items-center">
            {isDirectMatch ? (
              <span className="px-2 py-0.5 rounded-full bg-[#B49AF4]/15 border border-[#B49AF4]/30 text-[9.5px] text-[#B49AF4] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-[#B49AF4]" />
                Verified Look
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#B49AF4]/15 border border-[#B49AF4]/30 text-[9.5px] text-[#E0D5F7] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#B49AF4]" />
                Outfit Board
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CENTER MANNEQUIN DISPLAY / MIX & MATCH OUTFIT BOARD CHAMBER */}
      <div className="relative w-full flex-1 min-h-0 rounded-2xl overflow-hidden mannequin-chamber border border-white/[0.14] shadow-[0_16px_48px_rgba(0,0,0,0.5)] flex items-center justify-center p-2">
        {isDirectMatch ? (
          /* ======================================================== */
          /* 1. REALISTIC STUDIO MANNEQUIN (When verified look exists) */
          /* ======================================================== */
          <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-200">
            <img
              src={matchedPreset.image}
              alt={matchedPreset.name}
              className="w-full h-full object-contain rounded-xl"
            />

            {/* Verified Studio Look Badge */}
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#191723]/80 backdrop-blur-md border border-[#B49AF4]/40 text-[9.5px] font-bold text-[#B49AF4] shadow-xs pointer-events-none flex items-center gap-1">
              <Check className="w-3 h-3 text-[#B49AF4]" />
              Verified Studio Look
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* 2. MIX & MATCH OUTFIT BOARD (Side-by-Side Studio Styling) */
          /* ======================================================== */
          <div className="w-full h-full flex flex-col justify-between items-center p-3 relative animate-in fade-in duration-300 overflow-hidden">
            
            {/* Subtle Circular Lavender Studio Glow Backdrop */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[320px] h-[320px] rounded-full bg-[#B49AF4]/10 blur-3xl" />
            </div>

            {/* Refined Elliptical Platform / Studio Podium beneath garments */}
            <div className="absolute bottom-16 w-[88%] max-w-[420px] h-7 rounded-[100%] bg-gradient-to-r from-transparent via-[#B49AF4]/25 to-transparent blur-md pointer-events-none" />
            <div className="absolute bottom-18 w-[72%] max-w-[360px] h-[1px] bg-gradient-to-r from-transparent via-[#B49AF4]/40 to-transparent pointer-events-none" />

            {/* Top Board Label Badge */}
            <div className="w-full flex items-center justify-between z-10 flex-shrink-0">
              <span className="px-2.5 py-0.5 rounded-full bg-[#B49AF4]/15 border border-[#B49AF4]/30 text-[9.5px] font-semibold text-[#B49AF4] flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-[#B49AF4]" />
                Mix & Match Studio Board
              </span>
              <span className="text-[9px] font-mono text-[#AAA5B5]">
                Custom Editorial Styling
              </span>
            </div>

            {/* Main Garment Composition Stage */}
            {dress ? (
              /* Standalone Dress Presentation */
              <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center py-2">
                <div className="relative max-h-full max-w-[280px] sm:max-w-[320px] h-full flex items-center justify-center group">
                  <img
                    src={`/catalog/${dress.image}`}
                    alt={dress.name}
                    className="max-h-full max-w-full object-contain rounded-xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            ) : (
              /* Side-by-Side Top and Bottom Composition */
              <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center gap-3 sm:gap-6 px-1 py-1">
                
                {/* Selected Top Garment */}
                <div className="flex-1 h-full min-h-0 max-h-[340px] flex flex-col items-center justify-center group">
                  <div className="relative w-full h-full flex items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xs shadow-md transition-all group-hover:border-[#B49AF4]/40">
                    {top?.image ? (
                      <img
                        src={`/catalog/${top.image}`}
                        alt={top.name}
                        className="w-full h-full max-h-[290px] object-contain rounded-lg drop-shadow-[0_16px_30px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-[10px] text-[#AAA5B5]">No Top Selected</span>
                    )}
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-[#191723]/80 border border-white/[0.10] text-[8.5px] font-mono uppercase text-[#AAA5B5]">
                      Top
                    </span>
                  </div>
                </div>

                {/* Elegant Plus Symbol Connector */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-[#191723]/90 border border-[#B49AF4]/40 flex items-center justify-center text-[#B49AF4] text-sm font-semibold shadow-[0_0_12px_rgba(180,154,244,0.3)] select-none">
                    +
                  </div>
                </div>

                {/* Selected Bottom Garment */}
                <div className="flex-1 h-full min-h-0 max-h-[340px] flex flex-col items-center justify-center group">
                  <div className="relative w-full h-full flex items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xs shadow-md transition-all group-hover:border-[#B49AF4]/40">
                    {bottom?.image ? (
                      <img
                        src={`/catalog/${bottom.image}`}
                        alt={bottom.name}
                        className="w-full h-full max-h-[290px] object-contain rounded-lg drop-shadow-[0_16px_30px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-[10px] text-[#AAA5B5]">No Bottom Selected</span>
                    )}
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-[#191723]/80 border border-white/[0.10] text-[8.5px] font-mono uppercase text-[#AAA5B5]">
                      Bottom
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Compact, Elegant Information Bar */}
            <div className="relative z-10 w-full mt-1.5 px-3.5 py-2 rounded-xl bg-[#191723]/90 border border-white/[0.12] backdrop-blur-md shadow-lg flex items-center justify-between gap-3 flex-shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[11.5px] font-semibold text-[#F5F1F8] truncate leading-tight">
                    {displayedLookTitle}
                  </h4>
                </div>
                <p className="text-[9.5px] text-[#AAA5B5] truncate mt-0.5">
                  {dress 
                    ? `${dress.price} • Standalone Dress` 
                    : `${top?.name || 'Top'} (${top?.price || '—'}) • ${bottom?.name || 'Bottom'} (${bottom?.price || '—'})`}
                </p>
              </div>

              {(dress?.occasion || top?.occasion || bottom?.occasion) && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.10] text-[9px] font-mono text-[#E0D5F7]">
                  {dress?.occasion || (top?.occasion === bottom?.occasion ? top?.occasion : (top?.occasion || bottom?.occasion))}
                </span>
              )}
            </div>

          </div>
        )}
      </div>

      {/* COMPACT GLASS TOOLBAR DIRECTLY BELOW THE MANNEQUIN */}
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
