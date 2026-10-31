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
          /* 2. MIX & MATCH OUTFIT BOARD (For custom pairings)       */
          /* ======================================================== */
          <div className="w-full h-full flex flex-col justify-between p-2.5 relative animate-in fade-in duration-200 overflow-y-auto">
            {/* Board Header Bar */}
            <div className="w-full flex items-center justify-between pb-1.5 border-b border-white/[0.08] flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#B49AF4]/20 border border-[#B49AF4]/40 text-[9.5px] font-bold text-[#B49AF4] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#B49AF4]" />
                  Mix & Match Outfit Board
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#AAA5B5]">
                Custom Styled Look
              </span>
            </div>

            {/* Main Content Area */}
            {dress ? (
              /* Standalone Dress Card */
              <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 my-1.5 rounded-xl bg-white/[0.03] border border-white/[0.10] backdrop-blur-md relative overflow-hidden group">
                <div className="relative h-full max-h-[340px] w-full flex items-center justify-center">
                  <img
                    src={`/catalog/${dress.image}`}
                    alt={dress.name}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#191723]/80 border border-white/[0.12] text-[8.5px] font-mono text-[#B49AF4] uppercase">
                    One-Piece Dress
                  </div>
                </div>
                <div className="w-full mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between flex-shrink-0">
                  <span className="text-xs font-semibold text-[#F5F1F8] truncate">{dress.name}</span>
                  <span className="text-[11px] font-mono text-[#B49AF4] font-medium">{dress.price}</span>
                </div>
              </div>
            ) : (
              /* Top + Bottom Editorial Pair */
              <div className="flex-1 min-h-0 flex flex-col justify-between py-1 gap-1.5">
                {/* Top Garment Card */}
                <div className="flex-1 min-h-0 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.10] backdrop-blur-md p-2 flex items-center gap-3 transition-all group shadow-xs">
                  <div className="w-24 sm:w-28 h-full rounded-lg overflow-hidden bg-black/20 flex items-center justify-center flex-shrink-0 border border-white/[0.06]">
                    {top?.image ? (
                      <img
                        src={`/catalog/${top.image}`}
                        alt={top.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-[10px] text-[#AAA5B5]">No Top Selected</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#B49AF4] font-semibold">
                          Selected Top
                        </span>
                        {top?.occasion && (
                          <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-white/[0.06] text-[#AAA5B5] font-mono">
                            {top.occasion}
                          </span>
                        )}
                      </div>
                      <h4 className="text-[11px] font-semibold text-[#F5F1F8] leading-tight line-clamp-1">
                        {top?.name || 'Choose a Top'}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-[9px] text-[#AAA5B5]">Catalog Piece</span>
                      <span className="font-mono font-medium text-[#B49AF4]">{top?.price || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Elegant Styling Divider */}
                <div className="relative flex items-center justify-center my-0 flex-shrink-0">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B49AF4]/30 to-transparent" />
                  <span className="absolute px-2 py-0.2 rounded-full bg-[#191723] border border-[#B49AF4]/40 text-[8.5px] font-mono font-bold text-[#B49AF4] tracking-widest uppercase">
                    + Paired With +
                  </span>
                </div>

                {/* Bottom Garment Card */}
                <div className="flex-1 min-h-0 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.10] backdrop-blur-md p-2 flex items-center gap-3 transition-all group shadow-xs">
                  <div className="w-24 sm:w-28 h-full rounded-lg overflow-hidden bg-black/20 flex items-center justify-center flex-shrink-0 border border-white/[0.06]">
                    {bottom?.image ? (
                      <img
                        src={`/catalog/${bottom.image}`}
                        alt={bottom.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-[10px] text-[#AAA5B5]">No Bottom Selected</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#B49AF4] font-semibold">
                          Selected Bottom
                        </span>
                        {bottom?.occasion && (
                          <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-white/[0.06] text-[#AAA5B5] font-mono">
                            {bottom.occasion}
                          </span>
                        )}
                      </div>
                      <h4 className="text-[11px] font-semibold text-[#F5F1F8] leading-tight line-clamp-1">
                        {bottom?.name || 'Choose a Bottom'}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-[9px] text-[#AAA5B5]">Catalog Piece</span>
                      <span className="font-mono font-medium text-[#B49AF4]">{bottom?.price || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Board Footer Notice & Quick-Link */}
            <div className="w-full mt-1 pt-1.5 border-t border-white/[0.08] flex items-center justify-between flex-shrink-0 text-[10px]">
              <div className="flex items-center gap-1 text-[#AAA5B5] truncate">
                <span className="text-[#F5F1F8] font-medium truncate">{displayedLookTitle}</span>
              </div>
              {suggestedPreset && (
                <button
                  onClick={() => onApplyPreset(suggestedPreset.id)}
                  className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-[#B49AF4]/15 hover:bg-[#B49AF4]/25 border border-[#B49AF4]/30 text-[#B49AF4] text-[9.5px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                  title={`View verified studio look: ${suggestedPreset.shortName}`}
                >
                  View Studio Look
                  <ArrowRight className="w-2.5 h-2.5 text-[#B49AF4]" />
                </button>
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
