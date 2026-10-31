import React, { useState } from 'react';
import { Eye, Grid, Shirt, Layers, Footprints, ShoppingBag, X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

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
    name: "Look 1: White Tee + Blue Jeans",
    subtitle: "White fitted t-shirt, blue straight-leg jeans, white sneakers, tan tote",
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
    name: "Look 2: Black Fitted Top + Beige Trousers",
    subtitle: "Black fitted top, beige tailored trousers, black loafers, black shoulder bag",
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
    name: "Look 3: Beige Blouse + Black Trousers",
    subtitle: "Beige silky blouse, black wide-leg trousers, nude heels, cream handbag",
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
    name: "Look 4: White Shirt + Blue Jeans",
    subtitle: "White button-down shirt, blue straight-leg jeans, white sneakers, black bag",
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
    name: "Look 5: Grey Tank + Cream Midi Skirt",
    subtitle: "Grey scoop tank top, cream pleated midi skirt, nude heels, cream handbag",
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
    name: "Look 6: Black Midi Dress",
    subtitle: "Black tailored midi dress, nude heels, black shoulder bag",
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
    name: "Look 7: Beige Sleeveless Midi Dress",
    subtitle: "Beige sleeveless dress, black loafers, tan tote",
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
  onRemoveItem, 
  onApplyPreset,
  catalogProducts = [] 
}) {
  const [activeTab, setActiveTab] = useState('mannequin'); // 'mannequin' | 'board'

  const top = selectedOutfit?.top;
  const bottom = selectedOutfit?.bottom;
  const dress = selectedOutfit?.dress;
  const shoes = selectedOutfit?.shoes;
  const bag = selectedOutfit?.bag;

  // Find exact matching predefined realistic outfit
  const matchedPreset = PREDEFINED_OUTFITS.find(preset => preset.matches(selectedOutfit));

  // Find closest suggestion if current combination is unsupported
  const suggestedPreset = PREDEFINED_OUTFITS.find(p => {
    if (dress && p.dressId === dress.id) return true;
    if (top && p.topId === top.id) return true;
    if (bottom && p.bottomId === bottom.id) return true;
    return false;
  }) || PREDEFINED_OUTFITS[0];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* View Switcher: [Realistic Mannequin Display] | [Curated Outfit Board] */}
      <div className="mb-3 flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('mannequin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            activeTab === 'mannequin'
              ? 'bg-[#A78BFA] text-[#111318] shadow-xs'
              : 'text-[#A8ADB8] hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Realistic Mannequin Display</span>
        </button>
        <button
          onClick={() => setActiveTab('board')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            activeTab === 'board'
              ? 'bg-[#A78BFA] text-[#111318] shadow-xs'
              : 'text-[#A8ADB8] hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Curated Outfit Board</span>
        </button>
      </div>

      {/* VIEW 1: Realistic Mannequin Display */}
      {activeTab === 'mannequin' ? (
        <div className="relative w-full max-w-[440px] aspect-[440/620] rounded-[36px] overflow-hidden mannequin-chamber flex items-center justify-center border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
          
          {matchedPreset ? (
            /* 1A. Exact Realistic Predefined Outfit Match */
            <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-300">
              <img
                src={matchedPreset.image}
                alt={matchedPreset.name}
                className="w-full h-full object-cover select-none"
              />

              {/* Verified Realistic Preview Pill */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-[#111318]/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-[#A78BFA] flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                  <span>Realistic Studio Preview</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9.5px] font-semibold text-emerald-400">
                  Verified Look
                </span>
              </div>

              {/* Title & Description Overlay */}
              <div className="absolute bottom-4 inset-x-4 p-3 rounded-2xl bg-[#111318]/85 backdrop-blur-md border border-white/10 text-center">
                <h4 className="text-xs font-serif font-bold text-white">
                  {matchedPreset.name}
                </h4>
                <p className="text-[10px] text-[#A8ADB8] mt-0.5">
                  {matchedPreset.subtitle}
                </p>
              </div>
            </div>
          ) : (
            /* 1B. Realistic Preview Unavailable Notice (Part 5) */
            <div className="relative w-full h-full flex flex-col items-center justify-between p-6 bg-[#16181F]/90 backdrop-blur-md text-center">
              {/* Standalone neutral mannequin backdrop */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <img
                  src={neutralMannequinImg}
                  alt="Neutral Store Mannequin"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10 w-full pt-4">
                <div className="w-12 h-12 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center mx-auto mb-2.5 text-[#A78BFA]">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-serif font-bold text-white">
                  Realistic preview unavailable for this combination
                </h3>
                <p className="text-[11px] text-[#A8ADB8] max-w-[320px] mx-auto mt-1 leading-relaxed">
                  To ensure genuine photographic realism, only verified fashion combinations are shown on the store mannequin.
                </p>
              </div>

              {/* Suggestion Card */}
              <div className="relative z-10 w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                <span className="text-[9.5px] uppercase font-bold text-[#A78BFA] tracking-wider block mb-1">
                  Recommended Compatible Alternative
                </span>
                <p className="text-xs font-semibold text-white">
                  {suggestedPreset.name}
                </p>
                <p className="text-[10px] text-[#A8ADB8] mt-0.5 line-clamp-2">
                  {suggestedPreset.subtitle}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onApplyPreset(suggestedPreset.id)}
                    className="flex-1 py-1.5 px-3 rounded-full text-xs font-bold bg-[#A78BFA] text-[#111318] hover:bg-[#BFA5FB] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Equip This Look</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setActiveTab('board')}
                    className="py-1.5 px-3 rounded-full text-xs font-semibold text-[#A8ADB8] hover:text-white bg-white/10 hover:bg-white/15 transition-all cursor-pointer"
                  >
                    View Outfit Board
                  </button>
                </div>
              </div>

              <div className="relative z-10 pb-2">
                <span className="text-[10px] text-[#A8ADB8]/70">
                  Select a verified outfit combination or switch to the Outfit Board view.
                </span>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* VIEW 2: Premium Curated Outfit Board Fallback */
        <div className="w-full max-w-[440px] aspect-[440/620] rounded-[36px] p-5 flex flex-col justify-between mannequin-chamber border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
          <div className="text-center mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#A78BFA]">
              Curated Outfit Ensembles
            </span>
            <h4 className="text-sm font-serif font-bold text-white">
              Selected Pieces Breakdown
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 items-center">
            {/* Top or Dress Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="text-[9.5px] uppercase font-bold text-[#A78BFA] mb-1">
                {dress ? 'Equipped Dress' : 'Equipped Top'}
              </span>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-1.5">
                {(dress || top) ? (
                  <img
                    src={`/catalog/${(dress || top).image}`}
                    alt={(dress || top).name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#A8ADB8]">
                    <Shirt className="w-6 h-6 opacity-40" />
                  </div>
                )}
              </div>
              <p className="text-[10px] font-semibold text-white line-clamp-1">
                {(dress || top)?.name || 'No Top Selected'}
              </p>
              <p className="text-[9px] text-[#A8ADB8]">
                {(dress || top)?.price || 'Select a top'}
              </p>
            </div>

            {/* Bottom Box (Hidden if dress) */}
            <div className={`bg-white/5 border border-white/10 rounded-2xl p-2.5 flex flex-col items-center text-center ${dress ? 'opacity-40' : ''}`}>
              <span className="text-[9.5px] uppercase font-bold text-[#A78BFA] mb-1">
                {dress ? 'Covered by Dress' : 'Equipped Bottom'}
              </span>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-1.5">
                {!dress && bottom ? (
                  <img
                    src={`/catalog/${bottom.image}`}
                    alt={bottom.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#A8ADB8]">
                    <Layers className="w-6 h-6 opacity-40" />
                  </div>
                )}
              </div>
              <p className="text-[10px] font-semibold text-white line-clamp-1">
                {dress ? 'Dress active' : (bottom?.name || 'No Bottom Selected')}
              </p>
              <p className="text-[9px] text-[#A8ADB8]">
                {dress ? '—' : (bottom?.price || 'Select a bottom')}
              </p>
            </div>

            {/* Shoes Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="text-[9.5px] uppercase font-bold text-[#A78BFA] mb-1">
                Equipped Shoes
              </span>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-1.5">
                {shoes ? (
                  <img
                    src={`/catalog/${shoes.image}`}
                    alt={shoes.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#A8ADB8]">
                    <Footprints className="w-6 h-6 opacity-40" />
                  </div>
                )}
              </div>
              <p className="text-[10px] font-semibold text-white line-clamp-1">
                {shoes?.name || 'No Shoes Selected'}
              </p>
              <p className="text-[9px] text-[#A8ADB8]">
                {shoes?.price || 'Select shoes'}
              </p>
            </div>

            {/* Handbag Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="text-[9.5px] uppercase font-bold text-[#A78BFA] mb-1">
                Equipped Handbag
              </span>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-1.5">
                {bag ? (
                  <img
                    src={`/catalog/${bag.image}`}
                    alt={bag.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#A8ADB8]">
                    <ShoppingBag className="w-6 h-6 opacity-40" />
                  </div>
                )}
              </div>
              <p className="text-[10px] font-semibold text-white line-clamp-1">
                {bag?.name || 'No Bag Selected'}
              </p>
              <p className="text-[9px] text-[#A8ADB8]">
                {bag?.price || 'Select a bag'}
              </p>
            </div>
          </div>

          <div className="mt-2 text-center">
            <button
              onClick={() => setActiveTab('mannequin')}
              className="text-[10.5px] text-[#A78BFA] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>Back to Mannequin Display</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Equipped Garment Badges HUD */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-[440px]">
        {dress ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] text-white">
            <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
            <span className="font-semibold">{dress.name}</span>
            <button
              onClick={() => onRemoveItem('dress')}
              className="text-[#A8ADB8] hover:text-white cursor-pointer ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <>
            {top && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] text-white">
                <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
                <span className="font-semibold">{top.name}</span>
                <button
                  onClick={() => onRemoveItem('top')}
                  className="text-[#A8ADB8] hover:text-white cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {bottom && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] text-white">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="font-semibold">{bottom.name}</span>
                <button
                  onClick={() => onRemoveItem('bottom')}
                  className="text-[#A8ADB8] hover:text-white cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </>
        )}
        {shoes && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold">{shoes.name}</span>
            <button
              onClick={() => onRemoveItem('shoes')}
              className="text-[#A8ADB8] hover:text-white cursor-pointer ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {bag && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] text-white">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold">{bag.name}</span>
            <button
              onClick={() => onRemoveItem('bag')}
              className="text-[#A8ADB8] hover:text-white cursor-pointer ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
