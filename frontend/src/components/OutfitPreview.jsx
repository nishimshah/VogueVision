import React, { useState } from 'react';
import { 
  Eye, Grid, Shirt, Layers, Sparkles, ArrowRight, 
  ChevronLeft, ChevronRight, Heart, RotateCcw, Check
} from 'lucide-react';

import outfit1Img from '../assets/mannequin/outfit_1.jpg';
import outfit2Img from '../assets/mannequin/outfit_2.jpg';
import outfit3Img from '../assets/mannequin/outfit_3.jpg';
import outfit4Img from '../assets/mannequin/outfit_4.jpg';
import outfit5Img from '../assets/mannequin/outfit_5.jpg';
import outfit6Img from '../assets/mannequin/outfit_6.jpg';
import outfit7Img from '../assets/mannequin/outfit_7.jpg';

export const PREDEFINED_OUTFITS = [
  {
    id: 1,
    name: "Look 1 / 7 — White Tee + Blue Jeans",
    shortName: "White Tee + Blue Jeans",
    occasion: "Casual",
    image: outfit1Img,
    topId: 1,
    bottomId: 6,
    shoesId: 12,
    bagId: 16,
    dressId: null,
    matches: (o) => o.top?.id === 1 && o.bottom?.id === 6
  },
  {
    id: 2,
    name: "Look 2 / 7 — Black Top + Beige Trousers",
    shortName: "Black Top + Beige Trousers",
    occasion: "Formal",
    image: outfit2Img,
    topId: 2,
    bottomId: 8,
    shoesId: 13,
    bagId: 15,
    dressId: null,
    matches: (o) => o.top?.id === 2 && o.bottom?.id === 8
  },
  {
    id: 3,
    name: "Look 3 / 7 — Beige Blouse + Black Trousers",
    shortName: "Beige Blouse + Black Trousers",
    occasion: "Formal",
    image: outfit3Img,
    topId: 3,
    bottomId: 7,
    shoesId: 14,
    bagId: 17,
    dressId: null,
    matches: (o) => o.top?.id === 3 && o.bottom?.id === 7
  },
  {
    id: 4,
    name: "Look 4 / 7 — White Shirt + Blue Jeans",
    shortName: "White Shirt + Blue Jeans",
    occasion: "Casual",
    image: outfit4Img,
    topId: 4,
    bottomId: 6,
    shoesId: 12,
    bagId: 15,
    dressId: null,
    matches: (o) => o.top?.id === 4 && o.bottom?.id === 6
  },
  {
    id: 5,
    name: "Look 5 / 7 — Grey Tank + Cream Skirt",
    shortName: "Grey Tank + Cream Skirt",
    occasion: "Casual",
    image: outfit5Img,
    topId: 5,
    bottomId: 9,
    shoesId: 14,
    bagId: 17,
    dressId: null,
    matches: (o) => o.top?.id === 5 && o.bottom?.id === 9
  },
  {
    id: 6,
    name: "Look 6 / 7 — Black Tailored Midi Dress",
    shortName: "Black Cocktail Dress",
    occasion: "Party",
    image: outfit6Img,
    topId: null,
    bottomId: null,
    shoesId: 14,
    bagId: 15,
    dressId: 10,
    matches: (o) => o.dress?.id === 10
  },
  {
    id: 7,
    name: "Look 7 / 7 — Beige Sleeveless Midi Dress",
    shortName: "Beige Sleeveless Dress",
    occasion: "Casual",
    image: outfit7Img,
    topId: null,
    bottomId: null,
    shoesId: 13,
    bagId: 16,
    dressId: 11,
    matches: (o) => o.dress?.id === 11
  }
];

export default function OutfitPreview({ 
  selectedOutfit, 
  onPrevLook,
  onNextLook,
  onSaveOutfit,
  onResetOutfit,
  activeLookIndex,
  onApplyPreset
}) {
  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'mannequin' | 'board'

  const top = selectedOutfit?.top;
  const bottom = selectedOutfit?.bottom;
  const dress = selectedOutfit?.dress;

  // Find exact matching predefined realistic outfit
  const matchedPreset = PREDEFINED_OUTFITS.find(preset => preset.matches(selectedOutfit));

  // Determine effective view: if no exact matched preset and auto mode -> render Outfit Board fallback
  const isDirectMatch = Boolean(matchedPreset);
  const effectiveView = viewMode === 'auto' ? (isDirectMatch ? 'mannequin' : 'board') : viewMode;

  // Find closest suggestion if current combination is mix & match
  const suggestedPreset = PREDEFINED_OUTFITS.find(p => {
    if (dress && p.dressId === dress.id) return true;
    if (top && p.topId === top.id) return true;
    if (bottom && p.bottomId === bottom.id) return true;
    return false;
  }) || PREDEFINED_OUTFITS[0];

  const currentLook = PREDEFINED_OUTFITS[activeLookIndex] || PREDEFINED_OUTFITS[0];

  // Dynamic look title
  const displayedLookTitle = isDirectMatch 
    ? matchedPreset.shortName 
    : (dress ? dress.name : `${top?.name || 'Selected Top'} + ${bottom?.name || 'Selected Bottom'}`);

  return (
    <div className="w-full h-full flex flex-col justify-between items-center min-h-0 select-none">
      
      {/* Top Header & View Toggle Bar */}
      <div className="w-full flex items-center justify-between px-2 mb-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B49AF4] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#F5F1F8] uppercase tracking-wider">
            Virtual Showroom
          </span>
          <span className="text-[10px] text-[#AAA5B5] hidden sm:inline">
            • {isDirectMatch ? 'Studio Mannequin' : 'Outfit Composition'}
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-full bg-white/[0.05] border border-white/[0.12]">
          <button
            onClick={() => setViewMode('mannequin')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
              effectiveView === 'mannequin'
                ? 'bg-[#B49AF4]/25 border border-[#B49AF4]/50 text-[#F5F1F8] shadow-xs'
                : 'text-[#AAA5B5] hover:text-[#F5F1F8]'
            }`}
          >
            Mannequin
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
              effectiveView === 'board'
                ? 'bg-[#B49AF4]/25 border border-[#B49AF4]/50 text-[#F5F1F8] shadow-xs'
                : 'text-[#AAA5B5] hover:text-[#F5F1F8]'
            }`}
          >
            Outfit Board
          </button>
        </div>
      </div>

      {/* CENTER MANNEQUIN DISPLAY CHAMBER */}
      <div className="relative w-full flex-1 min-h-0 rounded-2xl overflow-hidden mannequin-chamber border border-white/[0.14] shadow-[0_16px_48px_rgba(0,0,0,0.5)] flex items-center justify-center p-2">
        
        {effectiveView === 'mannequin' && matchedPreset ? (
          /* A. Verified Realistic Predefined Outfit Image */
          <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-200">
            <img
              src={matchedPreset.image}
              alt={matchedPreset.name}
              className="w-full h-full object-contain rounded-xl"
            />

            {/* Verified Badge */}
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#191723]/80 backdrop-blur-md border border-[#B49AF4]/40 text-[9.5px] font-bold text-[#B49AF4] shadow-xs pointer-events-none flex items-center gap-1">
              <Check className="w-3 h-3 text-[#B49AF4]" />
              Verified Studio Look
            </div>
          </div>
        ) : (
          /* B. Polished Fallback: Curated Outfit Composition Board */
          <div className="relative w-full h-full flex flex-col justify-between p-4 animate-in fade-in duration-200 overflow-y-auto">
            {/* Top Composition Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="px-2.5 py-1 rounded-full bg-[#B49AF4]/15 border border-[#B49AF4]/30 text-[9.5px] font-semibold text-[#B49AF4]">
                Outfit Composition Preview • Mix & Match
              </div>
              <span className="text-[10px] text-[#AAA5B5]">
                {dress ? '1/1 Piece' : '2/2 Separates'}
              </span>
            </div>

            {/* Visual Item Layout */}
            {dress ? (
              /* Single Dress View */
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-48 h-64 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.14] p-2 shadow-lg group">
                  <img
                    src={`/catalog/${dress.image}`}
                    alt={dress.name}
                    className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-semibold text-[#F5F1F8]">{dress.name}</span>
                  <span className="text-[11px] text-[#B49AF4] block font-mono">{dress.price}</span>
                </div>
              </div>
            ) : (
              /* Top + Bottom Separates Grid */
              <div className="flex-1 flex items-center justify-center gap-4">
                {/* Top Garment */}
                <div className="flex flex-col items-center">
                  <div className="w-36 h-48 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.14] p-2 shadow-lg group">
                    {top ? (
                      <img
                        src={`/catalog/${top.image}`}
                        alt={top.name}
                        className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#AAA5B5]">
                        <Shirt className="w-6 h-6 mb-1 text-[#AAA5B5]" />
                        <span className="text-[10px]">Select Top</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-1.5 text-center max-w-[140px]">
                    <span className="text-[11px] font-semibold text-[#F5F1F8] line-clamp-1">{top?.name || 'Top'}</span>
                    <span className="text-[10px] text-[#B49AF4] font-mono">{top?.price}</span>
                  </div>
                </div>

                <div className="text-xl font-light text-[#B49AF4]/40">+</div>

                {/* Bottom Garment */}
                <div className="flex flex-col items-center">
                  <div className="w-36 h-48 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.14] p-2 shadow-lg group">
                    {bottom ? (
                      <img
                        src={`/catalog/${bottom.image}`}
                        alt={bottom.name}
                        className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#AAA5B5]">
                        <Layers className="w-6 h-6 mb-1 text-[#AAA5B5]" />
                        <span className="text-[10px]">Select Bottom</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-1.5 text-center max-w-[140px]">
                    <span className="text-[11px] font-semibold text-[#F5F1F8] line-clamp-1">{bottom?.name || 'Bottom'}</span>
                    <span className="text-[10px] text-[#B49AF4] font-mono">{bottom?.price}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Link to Closest Verified Mannequin Look */}
            {suggestedPreset && (
              <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10.5px]">
                <span className="text-[#AAA5B5]">
                  Matching Predefined Look available:
                </span>
                <button
                  onClick={() => onApplyPreset(suggestedPreset.id)}
                  className="text-[#B49AF4] hover:text-[#C4ADFA] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  View {suggestedPreset.shortName}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* COMPACT GLASS TOOLBAR DIRECTLY BELOW THE MANNEQUIN */}
      {/* Layout: [←] Look X / 7 — [Look Title] [→] [♡ Save] [↺ Reset] */}
      <div className="w-full mt-2 flex items-center justify-between px-3 py-1.5 rounded-xl glass-toolbar border border-white/[0.14] flex-shrink-0 shadow-lg">
        {/* Navigation Arrows & Current Look Name */}
        <div className="flex items-center gap-2 min-w-0">
          <button
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
