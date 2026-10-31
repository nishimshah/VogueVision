import React, { useState } from 'react';
import { 
  Eye, Grid, Shirt, Layers, AlertCircle, ArrowRight, 
  ChevronLeft, ChevronRight, Heart, RotateCcw, Sparkles 
} from 'lucide-react';

import outfit1Img from '../assets/mannequin/outfit_1.jpg';
import outfit2Img from '../assets/mannequin/outfit_2.jpg';
import outfit3Img from '../assets/mannequin/outfit_3.jpg';
import outfit4Img from '../assets/mannequin/outfit_4.jpg';
import outfit5Img from '../assets/mannequin/outfit_5.jpg';
import outfit6Img from '../assets/mannequin/outfit_6.jpg';
import outfit7Img from '../assets/mannequin/outfit_7.jpg';
import neutralMannequinImg from '../assets/mannequin/neutral_base.jpg';

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
    name: "Look 6 / 7 — Black Midi Dress",
    shortName: "Black Midi Dress",
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
    name: "Look 7 / 7 — Beige Sleeveless Dress",
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
  const [viewMode, setViewMode] = useState('mannequin'); // 'mannequin' | 'board'

  const top = selectedOutfit?.top;
  const bottom = selectedOutfit?.bottom;
  const dress = selectedOutfit?.dress;

  // Find exact matching predefined realistic outfit
  const matchedPreset = PREDEFINED_OUTFITS.find(preset => preset.matches(selectedOutfit));

  // Find closest suggestion if current combination is unsupported
  const suggestedPreset = PREDEFINED_OUTFITS.find(p => {
    if (dress && p.dressId === dress.id) return true;
    if (top && p.topId === top.id) return true;
    if (bottom && p.bottomId === bottom.id) return true;
    return false;
  }) || PREDEFINED_OUTFITS[0];

  const currentLook = PREDEFINED_OUTFITS[activeLookIndex] || PREDEFINED_OUTFITS[0];

  return (
    <div className="w-full h-full flex flex-col justify-between items-center min-h-0 select-none">
      
      {/* View Toggle Bar (Extremely Minimal) */}
      <div className="w-full flex items-center justify-between px-2 mb-1.5 flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#9271BF]" />
          <span className="text-[11px] font-semibold text-[#292331] uppercase tracking-wider">
            Virtual Showroom
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-full bg-white/45 border border-white/60">
          <button
            onClick={() => setViewMode('mannequin')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
              viewMode === 'mannequin'
                ? 'bg-white text-[#292331] shadow-2xs'
                : 'text-[#6D6574] hover:text-[#292331]'
            }`}
          >
            Mannequin
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
              viewMode === 'board'
                ? 'bg-white text-[#292331] shadow-2xs'
                : 'text-[#6D6574] hover:text-[#292331]'
            }`}
          >
            Outfit Board
          </button>
        </div>
      </div>

      {/* CENTER MANNEQUIN DISPLAY CHAMBER */}
      <div className="relative w-full flex-1 min-h-0 rounded-2xl overflow-hidden mannequin-chamber border border-white/70 shadow-[0_10px_30px_rgba(41,35,49,0.06)] flex items-center justify-center p-1.5">
        
        {viewMode === 'mannequin' ? (
          matchedPreset ? (
            /* A. Verified Realistic Predefined Outfit Image */
            <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-200">
              <img
                src={matchedPreset.image}
                alt={matchedPreset.name}
                className="w-full h-full object-contain rounded-xl"
              />

              {/* Minimal Verified Tag */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[9px] font-bold text-[#9271BF] shadow-2xs pointer-events-none">
                Verified Look
              </div>
            </div>
          ) : (
            /* B. Realistic Preview Unavailable State */
            <div className="relative w-full h-full flex flex-col items-center justify-between p-5 text-center">
              <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                <img
                  src={neutralMannequinImg}
                  alt="Neutral Mannequin"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative z-10 w-full pt-3">
                <div className="w-9 h-9 rounded-full bg-[#9271BF]/10 border border-[#9271BF]/20 flex items-center justify-center mx-auto mb-2 text-[#9271BF]">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-serif font-bold text-[#292331]">
                  Realistic preview unavailable for this combination
                </h4>
                <p className="text-[10px] text-[#6D6574] max-w-[260px] mx-auto mt-0.5 leading-snug">
                  Only verified combinations are presented on the showroom mannequin.
                </p>
              </div>

              {/* Suggestion Card */}
              <div className="relative z-10 w-full max-w-[280px] p-3 rounded-xl bg-white/60 border border-white/80 text-left shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#9271BF] block">
                  Recommended Alternative
                </span>
                <p className="text-[11px] font-semibold text-[#292331] truncate">
                  {suggestedPreset.name}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <button
                    onClick={() => onApplyPreset(suggestedPreset.id)}
                    className="flex-1 py-1 px-2.5 rounded-full text-[10.5px] font-bold bg-[#9271BF] text-white hover:bg-[#815EAE] transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Equip Look</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setViewMode('board')}
                    className="py-1 px-2.5 rounded-full text-[10.5px] font-medium text-[#6D6574] hover:text-[#292331] bg-white/70 hover:bg-white transition-all cursor-pointer"
                  >
                    Outfit Board
                  </button>
                </div>
              </div>

              <div className="relative z-10 text-[9.5px] text-[#6D6574]/80 pb-1">
                Select a verified outfit or switch to the Outfit Board view.
              </div>
            </div>
          )
        ) : (
          /* C. Curated Outfit Board View */
          <div className="w-full h-full p-3.5 flex flex-col justify-between">
            <div className="text-center mb-1">
              <span className="text-[9.5px] uppercase font-bold tracking-widest text-[#9271BF]">
                Curated Outfit Board
              </span>
              <p className="text-xs font-serif font-bold text-[#292331]">
                Active Selected Pieces
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 items-center max-w-[340px] mx-auto w-full">
              {/* Top / Dress */}
              <div className="bg-white/55 border border-white/70 rounded-xl p-2 flex flex-col items-center text-center shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#9271BF] mb-0.5">
                  {dress ? 'Dress' : 'Top'}
                </span>
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/80 border border-white/70 mb-1">
                  {(dress || top) ? (
                    <img
                      src={`/catalog/${(dress || top).image}`}
                      alt={(dress || top).name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6D6574]">
                      <Shirt className="w-5 h-5 opacity-40" />
                    </div>
                  )}
                </div>
                <p className="text-[9.5px] font-semibold text-[#292331] line-clamp-1">
                  {(dress || top)?.name || 'None'}
                </p>
                <p className="text-[9px] text-[#6D6574]">
                  {(dress || top)?.price || '—'}
                </p>
              </div>

              {/* Bottom (Hidden if dress) */}
              <div className={`bg-white/55 border border-white/70 rounded-xl p-2 flex flex-col items-center text-center shadow-2xs ${dress ? 'opacity-40' : ''}`}>
                <span className="text-[9px] uppercase font-bold text-[#9271BF] mb-0.5">
                  {dress ? 'Covered' : 'Bottom'}
                </span>
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/80 border border-white/70 mb-1">
                  {!dress && bottom ? (
                    <img
                      src={`/catalog/${bottom.image}`}
                      alt={bottom.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6D6574]">
                      <Layers className="w-5 h-5 opacity-40" />
                    </div>
                  )}
                </div>
                <p className="text-[9.5px] font-semibold text-[#292331] line-clamp-1">
                  {dress ? 'Dress active' : (bottom?.name || 'None')}
                </p>
                <p className="text-[9px] text-[#6D6574]">
                  {dress ? '—' : (bottom?.price || '—')}
                </p>
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => setViewMode('mannequin')}
                className="text-[10px] text-[#9271BF] font-semibold hover:underline"
              >
                Back to Mannequin Display →
              </button>
            </div>
          </div>
        )}

      </div>

      {/* COMPACT GLASS TOOLBAR (Directly Below Mannequin - Part 3) */}
      <div className="w-full mt-2 flex items-center justify-between px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-md border border-white/70 shadow-xs flex-shrink-0">
        
        {/* Navigation arrows & Outfit label */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <button 
            onClick={onPrevLook}
            className="w-6 h-6 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-[#292331] shadow-2xs transition-all cursor-pointer flex-shrink-0"
            title="Previous Curated Look"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-semibold text-[#292331] truncate px-1">
            {currentLook.name}
          </span>

          <button 
            onClick={onNextLook}
            className="w-6 h-6 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-[#292331] shadow-2xs transition-all cursor-pointer flex-shrink-0"
            title="Next Curated Look"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action buttons: Save & Reset */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <button
            onClick={onSaveOutfit}
            className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-[#9271BF] text-white hover:bg-[#815EAE] shadow-xs flex items-center gap-1 transition-all cursor-pointer"
            title="Save current look to wardrobe"
          >
            <Heart className="w-3 h-3 fill-white" />
            <span>Save</span>
          </button>

          <button
            onClick={onResetOutfit}
            className="w-6 h-6 rounded-full bg-white/60 hover:bg-white text-[#6D6574] hover:text-[#292331] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Reset to default outfit"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
}
