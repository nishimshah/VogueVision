import React, { useState } from 'react';
import { Shirt, Layers, Sparkles, Footprints, ShoppingBag, X, Eye, Grid } from 'lucide-react';

export default function OutfitPreview({ selectedOutfit, onRemoveItem, onSelectCategory }) {
  const [viewMode, setViewMode] = useState('mannequin'); // 'mannequin' | 'board'

  const top = selectedOutfit?.top;
  const bottom = selectedOutfit?.bottom;
  const dress = selectedOutfit?.dress;
  const shoes = selectedOutfit?.shoes;
  const bag = selectedOutfit?.bag;

  // Helper to get garment SVG definition by catalog product ID and category
  const renderTopSVG = (item) => {
    if (!item) return null;
    const id = item.id;

    // ID 1: Blush Floral Puff-Sleeve Top
    if (id === 1) {
      return (
        <g id="top-blush-floral-puff" className="transition-all duration-300">
          {/* Sweetheart bodice */}
          <path
            d="M 172 155 Q 185 178 200 172 Q 215 178 228 155 Q 235 200 230 252 Q 200 258 170 252 Q 165 200 172 155 Z"
            fill="#F7B2C7"
            stroke="#E08EA5"
            strokeWidth="1.5"
          />
          {/* Left puff sleeve */}
          <ellipse cx="152" cy="172" rx="18" ry="22" fill="#F7B2C7" stroke="#E08EA5" strokeWidth="1.5" />
          {/* Right puff sleeve */}
          <ellipse cx="248" cy="172" rx="18" ry="22" fill="#F7B2C7" stroke="#E08EA5" strokeWidth="1.5" />
          {/* Ruched center & floral detail lines */}
          <path d="M 200 172 L 200 255" stroke="#E08EA5" strokeWidth="1" strokeDasharray="2,2" />
          <path d="M 180 200 Q 200 210 220 200" stroke="#E08EA5" strokeWidth="1" fill="none" />
          <circle cx="186" cy="190" r="2.5" fill="#FFFFFF" opacity="0.8" />
          <circle cx="214" cy="220" r="2.5" fill="#FFFFFF" opacity="0.8" />
          {/* Ruffled hem */}
          <path d="M 170 252 Q 185 258 200 254 Q 215 258 230 252" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        </g>
      );
    }

    // ID 2: Cream Botanical Ruffled Blouse
    if (id === 2) {
      return (
        <g id="top-cream-botanical" className="transition-all duration-300">
          {/* Blouse bodice */}
          <path
            d="M 168 150 Q 200 170 232 150 L 235 258 L 165 258 Z"
            fill="#FDF8EE"
            stroke="#D8CCB8"
            strokeWidth="1.5"
          />
          {/* Flowy bishop sleeves */}
          <path d="M 168 150 Q 140 220 148 310 L 158 310 Q 155 220 172 175 Z" fill="#FDF8EE" stroke="#D8CCB8" strokeWidth="1" />
          <path d="M 232 150 Q 260 220 252 310 L 242 310 Q 245 220 228 175 Z" fill="#FDF8EE" stroke="#D8CCB8" strokeWidth="1" />
          {/* Ruffle neck collar */}
          <path d="M 180 150 Q 200 185 220 150" stroke="#C4B49C" strokeWidth="2" fill="none" />
          <circle cx="200" cy="195" r="2" fill="#C4B49C" />
          <circle cx="200" cy="215" r="2" fill="#C4B49C" />
          <circle cx="200" cy="235" r="2" fill="#C4B49C" />
        </g>
      );
    }

    // ID 3: Dusty Rose Sweetheart Ruched Top
    if (id === 3) {
      return (
        <g id="top-dusty-rose-ruched" className="transition-all duration-300">
          <path
            d="M 174 156 Q 187 175 200 170 Q 213 175 226 156 Q 232 205 228 254 Q 200 256 172 254 Q 168 205 174 156 Z"
            fill="#CD8D9B"
            stroke="#A86776"
            strokeWidth="1.5"
          />
          <ellipse cx="156" cy="165" rx="14" ry="12" fill="#CD8D9B" stroke="#A86776" strokeWidth="1.5" />
          <ellipse cx="244" cy="165" rx="14" ry="12" fill="#CD8D9B" stroke="#A86776" strokeWidth="1.5" />
          <path d="M 178 190 Q 200 198 222 190" stroke="#B87383" strokeWidth="1.5" fill="none" />
          <path d="M 176 215 Q 200 223 224 215" stroke="#B87383" strokeWidth="1.5" fill="none" />
        </g>
      );
    }

    // ID 4: Crimson Floral Peasant Blouse
    if (id === 4) {
      return (
        <g id="top-crimson-peasant" className="transition-all duration-300">
          <path
            d="M 160 162 Q 200 175 240 162 L 235 258 Q 200 262 165 258 Z"
            fill="#A82835"
            stroke="#801C26"
            strokeWidth="1.5"
          />
          {/* Billowy sleeves */}
          <ellipse cx="145" cy="205" rx="18" ry="34" fill="#A82835" stroke="#801C26" strokeWidth="1.5" />
          <ellipse cx="255" cy="205" rx="18" ry="34" fill="#A82835" stroke="#801C26" strokeWidth="1.5" />
          <path d="M 165 162 Q 200 172 235 162" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3,2" fill="none" />
        </g>
      );
    }

    // ID 5: White Broderie Anglaise Top
    if (id === 5) {
      return (
        <g id="top-white-broderie" className="transition-all duration-300">
          <path
            d="M 170 148 L 230 148 L 232 255 L 168 255 Z"
            fill="#FFFFFF"
            stroke="#D0D5DD"
            strokeWidth="1.5"
          />
          <path d="M 170 148 Q 148 165 152 195 L 168 185 Z" fill="#FFFFFF" stroke="#D0D5DD" strokeWidth="1" />
          <path d="M 230 148 Q 252 165 248 195 L 232 185 Z" fill="#FFFFFF" stroke="#D0D5DD" strokeWidth="1" />
          {/* Eyelet embroidery holes */}
          <circle cx="185" cy="190" r="2.5" fill="#E5E7EB" />
          <circle cx="215" cy="190" r="2.5" fill="#E5E7EB" />
          <circle cx="200" cy="210" r="2.5" fill="#E5E7EB" />
          <circle cx="185" cy="230" r="2.5" fill="#E5E7EB" />
          <circle cx="215" cy="230" r="2.5" fill="#E5E7EB" />
        </g>
      );
    }

    // ID 6: Lavender Ribbed Knit Sweetheart Top
    if (id === 6) {
      return (
        <g id="top-lavender-ribbed" className="transition-all duration-300">
          <path
            d="M 174 154 Q 187 172 200 168 Q 213 172 226 154 L 228 255 L 172 255 Z"
            fill="#B8A1D9"
            stroke="#9A80BE"
            strokeWidth="1.5"
          />
          {/* Vertical rib lines */}
          <line x1="182" y1="170" x2="182" y2="255" stroke="#9A80BE" strokeWidth="1" />
          <line x1="191" y1="170" x2="191" y2="255" stroke="#9A80BE" strokeWidth="1" />
          <line x1="200" y1="170" x2="200" y2="255" stroke="#9A80BE" strokeWidth="1" />
          <line x1="209" y1="170" x2="209" y2="255" stroke="#9A80BE" strokeWidth="1" />
          <line x1="218" y1="170" x2="218" y2="255" stroke="#9A80BE" strokeWidth="1" />
          <ellipse cx="158" cy="165" rx="12" ry="10" fill="#B8A1D9" stroke="#9A80BE" strokeWidth="1.5" />
          <ellipse cx="242" cy="165" rx="12" ry="10" fill="#B8A1D9" stroke="#9A80BE" strokeWidth="1.5" />
        </g>
      );
    }

    // ID 7: Classic Black Silk Camisole
    if (id === 7) {
      return (
        <g id="top-black-silk-cami" className="transition-all duration-300">
          {/* Spaghetti straps */}
          <line x1="182" y1="145" x2="182" y2="168" stroke="#181A1F" strokeWidth="2" />
          <line x1="218" y1="145" x2="218" y2="168" stroke="#181A1F" strokeWidth="2" />
          {/* Silk bodice with subtle sheen */}
          <path
            d="M 175 168 L 200 184 L 225 168 L 228 256 Q 200 260 172 256 Z"
            fill="#181A1F"
            stroke="#343844"
            strokeWidth="1.5"
          />
          {/* Subtle silk highlight */}
          <path d="M 185 188 Q 192 230 188 252" stroke="#484E5E" strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>
      );
    }

    // ID 8: Sage Green Linen Button Blouse
    if (id === 8) {
      return (
        <g id="top-sage-linen" className="transition-all duration-300">
          <path
            d="M 166 148 L 234 148 L 232 258 L 168 258 Z"
            fill="#8A9E82"
            stroke="#6C8064"
            strokeWidth="1.5"
          />
          {/* Collar */}
          <polygon points="185,148 200,165 200,148" fill="#75886D" />
          <polygon points="215,148 200,165 200,148" fill="#75886D" />
          {/* Center placket and buttons */}
          <line x1="200" y1="165" x2="200" y2="258" stroke="#6C8064" strokeWidth="2" />
          <circle cx="200" cy="185" r="2" fill="#E8EDE4" />
          <circle cx="200" cy="210" r="2" fill="#E8EDE4" />
          <circle cx="200" cy="235" r="2" fill="#E8EDE4" />
          {/* Rolled cuffs */}
          <rect x="150" y="165" width="16" height="20" rx="3" fill="#8A9E82" stroke="#6C8064" strokeWidth="1" />
          <rect x="234" y="165" width="16" height="20" rx="3" fill="#8A9E82" stroke="#6C8064" strokeWidth="1" />
        </g>
      );
    }

    // ID 9: Sky Blue Ruffled Poplin Top (or default fallback)
    return (
      <g id="top-sky-blue" className="transition-all duration-300">
        <path
          d="M 170 152 Q 200 168 230 152 L 232 256 L 168 256 Z"
          fill="#9AC2E8"
          stroke="#7BA6CE"
          strokeWidth="1.5"
        />
        <path d="M 168 155 Q 146 175 160 200" stroke="#7BA6CE" strokeWidth="3" fill="none" />
        <path d="M 232 155 Q 254 175 240 200" stroke="#7BA6CE" strokeWidth="3" fill="none" />
      </g>
    );
  };

  // Helper for Bottom Garment SVG
  const renderBottomSVG = (item) => {
    if (!item) return null;
    const id = item.id;

    // ID 10: Light Wash Straight Wide-Leg Jeans
    if (id === 10) {
      return (
        <g id="bottom-light-blue-jeans" className="transition-all duration-300">
          {/* Waistband */}
          <path d="M 168 250 L 232 250 L 236 270 L 164 270 Z" fill="#8FB8DE" stroke="#6E97C2" strokeWidth="1.5" />
          <circle cx="200" cy="260" r="2.5" fill="#C59B27" /> {/* Copper button */}
          {/* Left leg wide denim */}
          <path
            d="M 164 270 L 198 285 L 194 675 L 152 675 L 158 350 Z"
            fill="#8FB8DE"
            stroke="#6E97C2"
            strokeWidth="1.5"
          />
          {/* Right leg wide denim */}
          <path
            d="M 236 270 L 202 285 L 206 675 L 248 675 L 242 350 Z"
            fill="#8FB8DE"
            stroke="#6E97C2"
            strokeWidth="1.5"
          />
          {/* Crotch inseam & fly */}
          <line x1="200" y1="264" x2="200" y2="288" stroke="#6E97C2" strokeWidth="1.5" />
          {/* Denim fade highlights */}
          <path d="M 175 320 Q 170 480 173 600" stroke="#B8D7F5" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
          <path d="M 225 320 Q 230 480 227 600" stroke="#B8D7F5" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
        </g>
      );
    }

    // ID 11: Ecru High-Waist Pleated Trousers
    if (id === 11) {
      return (
        <g id="bottom-ecru-pleated-trousers" className="transition-all duration-300">
          <path d="M 170 244 L 230 244 L 235 266 L 165 266 Z" fill="#F3EFE6" stroke="#D1C7B4" strokeWidth="1.5" />
          {/* Left trouser leg with crisp pleat */}
          <path
            d="M 165 266 L 198 280 L 194 675 L 154 675 L 160 340 Z"
            fill="#F3EFE6"
            stroke="#D1C7B4"
            strokeWidth="1.5"
          />
          {/* Right trouser leg with crisp pleat */}
          <path
            d="M 235 266 L 202 280 L 206 675 L 246 675 L 240 340 Z"
            fill="#F3EFE6"
            stroke="#D1C7B4"
            strokeWidth="1.5"
          />
          {/* Center pleat lines */}
          <line x1="174" y1="266" x2="174" y2="670" stroke="#C4B7A0" strokeWidth="1" />
          <line x1="226" y1="266" x2="226" y2="670" stroke="#C4B7A0" strokeWidth="1" />
        </g>
      );
    }

    // ID 12: Classic Dark Indigo Flare Denim
    if (id === 12) {
      return (
        <g id="bottom-dark-indigo-denim" className="transition-all duration-300">
          <path d="M 168 250 L 232 250 L 236 270 L 164 270 Z" fill="#233857" stroke="#16253C" strokeWidth="1.5" />
          {/* Flare left leg */}
          <path
            d="M 164 270 L 198 285 L 192 480 L 188 675 L 142 675 L 166 480 L 160 340 Z"
            fill="#233857"
            stroke="#16253C"
            strokeWidth="1.5"
          />
          {/* Flare right leg */}
          <path
            d="M 236 270 L 202 285 L 208 480 L 212 675 L 258 675 L 234 480 L 240 340 Z"
            fill="#233857"
            stroke="#16253C"
            strokeWidth="1.5"
          />
          <line x1="200" y1="264" x2="200" y2="288" stroke="#3D567A" strokeWidth="1.5" />
        </g>
      );
    }

    // ID 13: Ivory Sunray Pleated Midi Skirt
    if (id === 13) {
      return (
        <g id="bottom-ivory-pleated-skirt" className="transition-all duration-300">
          <path d="M 172 250 L 228 250 L 230 265 L 170 265 Z" fill="#F8F6F0" stroke="#DCD5C6" strokeWidth="1.5" />
          {/* Flared accordian pleated skirt */}
          <path
            d="M 170 265 L 230 265 L 265 540 Q 200 550 135 540 Z"
            fill="#F8F6F0"
            stroke="#DCD5C6"
            strokeWidth="1.5"
          />
          {/* Accordion pleat shadow lines */}
          <line x1="180" y1="265" x2="155" y2="540" stroke="#DCD5C6" strokeWidth="1" />
          <line x1="190" y1="265" x2="175" y2="542" stroke="#DCD5C6" strokeWidth="1" />
          <line x1="200" y1="265" x2="200" y2="545" stroke="#DCD5C6" strokeWidth="1" />
          <line x1="210" y1="265" x2="225" y2="542" stroke="#DCD5C6" strokeWidth="1" />
          <line x1="220" y1="265" x2="245" y2="540" stroke="#DCD5C6" strokeWidth="1" />
        </g>
      );
    }

    // ID 14: Camel Tailored Fluid Trousers
    if (id === 14) {
      return (
        <g id="bottom-camel-fluid-trousers" className="transition-all duration-300">
          <path d="M 170 248 L 230 248 L 235 268 L 165 268 Z" fill="#C49A6C" stroke="#A37849" strokeWidth="1.5" />
          <path
            d="M 165 268 L 198 282 L 194 675 L 154 675 L 160 340 Z"
            fill="#C49A6C"
            stroke="#A37849"
            strokeWidth="1.5"
          />
          <path
            d="M 235 268 L 202 282 L 206 675 L 246 675 L 240 340 Z"
            fill="#C49A6C"
            stroke="#A37849"
            strokeWidth="1.5"
          />
        </g>
      );
    }

    // ID 15: Dusty Rose Bias-Cut Satin Slip Skirt
    if (id === 15) {
      return (
        <g id="bottom-rose-satin-skirt" className="transition-all duration-300">
          <path
            d="M 172 250 L 228 250 L 245 545 Q 200 552 155 545 Z"
            fill="#D9A5B3"
            stroke="#BA8292"
            strokeWidth="1.5"
          />
          {/* Silky satin sheen highlight */}
          <path d="M 190 270 Q 205 380 195 530" stroke="#FCE7ED" strokeWidth="3" opacity="0.4" fill="none" />
        </g>
      );
    }

    // ID 16: Charcoal Grey Slim Cigarette Pants
    if (id === 16) {
      return (
        <g id="bottom-charcoal-cigarette" className="transition-all duration-300">
          <path d="M 170 250 L 230 250 L 234 268 L 166 268 Z" fill="#252830" stroke="#16181D" strokeWidth="1.5" />
          {/* Slim tapered leg left */}
          <path
            d="M 166 268 L 198 282 L 190 670 L 166 670 L 162 340 Z"
            fill="#252830"
            stroke="#16181D"
            strokeWidth="1.5"
          />
          {/* Slim tapered leg right */}
          <path
            d="M 234 268 L 202 282 L 210 670 L 234 670 L 238 340 Z"
            fill="#252830"
            stroke="#16181D"
            strokeWidth="1.5"
          />
        </g>
      );
    }

    // ID 17: Olive Green High-Rise Cargo Trousers
    return (
      <g id="bottom-olive-cargo" className="transition-all duration-300">
        <path d="M 168 246 L 232 246 L 235 268 L 165 268 Z" fill="#5C684E" stroke="#46513A" strokeWidth="1.5" />
        <path
          d="M 165 268 L 198 282 L 194 675 L 155 675 L 160 340 Z"
          fill="#5C684E"
          stroke="#46513A"
          strokeWidth="1.5"
        />
        <path
          d="M 235 268 L 202 282 L 206 675 L 245 675 L 240 340 Z"
          fill="#5C684E"
          stroke="#46513A"
          strokeWidth="1.5"
        />
        {/* Cargo pockets */}
        <rect x="153" y="370" width="12" height="18" rx="2" fill="#4B563F" stroke="#3D4733" strokeWidth="1" />
        <rect x="235" y="370" width="12" height="18" rx="2" fill="#4B563F" stroke="#3D4733" strokeWidth="1" />
      </g>
    );
  };

  // Helper for Dress Garment SVG (Hides Top and Bottom)
  const renderDressSVG = (item) => {
    if (!item) return null;
    const id = item.id;

    // ID 18: Blush Pink Floral Tiered Midi Dress
    if (id === 18) {
      return (
        <g id="dress-blush-floral" className="transition-all duration-300">
          {/* Bodice */}
          <path d="M 170 150 Q 200 170 230 150 L 232 260 L 168 260 Z" fill="#F3BDCB" stroke="#D89AA9" strokeWidth="1.5" />
          {/* Sleeves */}
          <ellipse cx="154" cy="165" rx="14" ry="14" fill="#F3BDCB" stroke="#D89AA9" strokeWidth="1" />
          <ellipse cx="246" cy="165" rx="14" ry="14" fill="#F3BDCB" stroke="#D89AA9" strokeWidth="1" />
          {/* Tiered midi skirt */}
          <path d="M 168 260 L 232 260 L 248 370 L 152 370 Z" fill="#F3BDCB" stroke="#D89AA9" strokeWidth="1.5" />
          <path d="M 152 370 L 248 370 L 265 570 Q 200 580 135 570 Z" fill="#F3BDCB" stroke="#D89AA9" strokeWidth="1.5" />
          <circle cx="185" cy="310" r="3" fill="#FFFFFF" opacity="0.6" />
          <circle cx="215" cy="450" r="3" fill="#FFFFFF" opacity="0.6" />
        </g>
      );
    }

    // ID 19: Emerald Green Satin Slip Dress
    if (id === 19) {
      return (
        <g id="dress-emerald-satin" className="transition-all duration-300">
          <line x1="184" y1="145" x2="184" y2="168" stroke="#1F6B4F" strokeWidth="2" />
          <line x1="216" y1="145" x2="216" y2="168" stroke="#1F6B4F" strokeWidth="2" />
          <path
            d="M 175 168 Q 200 185 225 168 L 238 340 L 255 580 Q 200 590 145 580 L 162 340 Z"
            fill="#1F6B4F"
            stroke="#154E39"
            strokeWidth="1.5"
          />
          {/* Silky satin sheen */}
          <path d="M 188 220 Q 205 380 190 560" stroke="#4FEBB2" strokeWidth="3.5" opacity="0.3" fill="none" />
        </g>
      );
    }

    // Default dress (White Boho / Black Velvet / Lavender)
    const color = id === 21 ? '#181A20' : id === 22 ? '#C1B0DE' : '#F8F9FA';
    const border = id === 21 ? '#343844' : id === 22 ? '#A18FBE' : '#D0D5DD';

    return (
      <g id="dress-generic" className="transition-all duration-300">
        <path
          d="M 170 148 L 230 148 L 236 260 L 258 575 Q 200 585 142 575 L 164 260 Z"
          fill={color}
          stroke={border}
          strokeWidth="1.5"
        />
      </g>
    );
  };

  // Helper for Shoes SVG
  const renderShoesSVG = (item) => {
    if (!item) return null;
    const id = item.id;

    // ID 29: Minimalist White Leather Tennis Sneakers
    if (id === 29) {
      return (
        <g id="shoes-white-sneakers" className="transition-all duration-300">
          {/* Left sneaker */}
          <path d="M 166 670 L 188 670 L 192 710 L 155 710 Q 155 690 166 670 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
          <rect x="153" y="706" width="41" height="6" rx="2" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
          <line x1="172" y1="680" x2="184" y2="680" stroke="#9CA3AF" strokeWidth="1.5" />
          <line x1="173" y1="688" x2="185" y2="688" stroke="#9CA3AF" strokeWidth="1.5" />

          {/* Right sneaker */}
          <path d="M 234 670 L 212 670 L 208 710 L 245 710 Q 245 690 234 670 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
          <rect x="206" y="706" width="41" height="6" rx="2" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
          <line x1="228" y1="680" x2="216" y2="680" stroke="#9CA3AF" strokeWidth="1.5" />
          <line x1="227" y1="688" x2="215" y2="688" stroke="#9CA3AF" strokeWidth="1.5" />
        </g>
      );
    }

    // ID 32: Classic Black Leather Ankle Booties
    if (id === 32) {
      return (
        <g id="shoes-black-boots" className="transition-all duration-300">
          <path d="M 168 640 L 188 640 L 192 712 L 152 712 Q 152 680 168 640 Z" fill="#181A1F" stroke="#343844" strokeWidth="1.5" />
          <rect x="150" y="708" width="44" height="6" fill="#0C0D10" />
          <path d="M 232 640 L 212 640 L 208 712 L 248 712 Q 248 680 232 640 Z" fill="#181A1F" stroke="#343844" strokeWidth="1.5" />
          <rect x="206" y="708" width="44" height="6" fill="#0C0D10" />
        </g>
      );
    }

    // Neutral / Strappy Heels / Slide Sandals (ID 30, 31, 33, 34)
    const shoeColor = id === 30 || id === 31 ? '#DFD3C3' : id === 33 ? '#B88756' : '#C4B5E0';
    const shoeBorder = id === 30 || id === 31 ? '#B8A894' : id === 33 ? '#8A5D32' : '#9E8CBD';

    return (
      <g id="shoes-sandals" className="transition-all duration-300">
        {/* Left heel/sandal */}
        <path d="M 172 670 L 185 670 L 188 712 L 158 712 Z" fill={shoeColor} stroke={shoeBorder} strokeWidth="1.5" />
        <rect x="182" y="705" width="5" height="12" fill={shoeBorder} />
        {/* Right heel/sandal */}
        <path d="M 228 670 L 215 670 L 212 712 L 242 712 Z" fill={shoeColor} stroke={shoeBorder} strokeWidth="1.5" />
        <rect x="213" y="705" width="5" height="12" fill={shoeBorder} />
      </g>
    );
  };

  // Helper for Handbag SVG
  const renderBagSVG = (item) => {
    if (!item) return null;
    const id = item.id;

    // ID 24: Blush Rose Leather Crossbody Bag
    if (id === 24) {
      return (
        <g id="bag-blush-crossbody" className="transition-all duration-300">
          {/* Diagonal shoulder strap from left shoulder to right hip */}
          <path d="M 160 152 Q 185 240 248 350" stroke="#C47E95" strokeWidth="3" fill="none" />
          {/* Crossbody camera bag at right hip */}
          <rect x="240" y="340" width="44" height="34" rx="8" fill="#E8A4B8" stroke="#C47E95" strokeWidth="2" />
          {/* Gold turnlock clasp */}
          <circle cx="262" cy="357" r="3" fill="#D4AF37" stroke="#A6831A" strokeWidth="1" />
          <line x1="240" y1="350" x2="284" y2="350" stroke="#C47E95" strokeWidth="1.5" />
        </g>
      );
    }

    // ID 27: Black Quilted Chain Flap Bag
    if (id === 27) {
      return (
        <g id="bag-black-quilted" className="transition-all duration-300">
          {/* Gold chain strap */}
          <path d="M 160 152 Q 185 240 248 350" stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="3,2" fill="none" />
          <rect x="238" y="340" width="46" height="34" rx="6" fill="#181A20" stroke="#343844" strokeWidth="2" />
          {/* Diamond quilt stitching */}
          <line x1="242" y1="344" x2="280" y2="370" stroke="#343844" strokeWidth="1" />
          <line x1="242" y1="370" x2="280" y2="344" stroke="#343844" strokeWidth="1" />
          <circle cx="261" cy="358" r="3.5" fill="#D4AF37" />
        </g>
      );
    }

    // ID 23: Ivory Structured / ID 25 Raffia / ID 26 Cognac / ID 28 Plum
    const bagColor = id === 23 ? '#F8F5EE' : id === 25 ? '#D4B37F' : id === 26 ? '#A05A2C' : '#5E2744';
    const bagBorder = id === 23 ? '#CFC7B4' : id === 25 ? '#AA864F' : id === 26 ? '#783E1A' : '#3E132B';

    return (
      <g id="bag-generic" className="transition-all duration-300">
        <path d="M 160 152 Q 185 240 248 350" stroke={bagBorder} strokeWidth="3" fill="none" />
        <rect x="238" y="340" width="46" height="34" rx="8" fill={bagColor} stroke={bagBorder} strokeWidth="2" />
        <circle cx="261" cy="357" r="3" fill="#D4AF37" />
      </g>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* View Mode Toggle: [Virtual Mannequin Display] | [Curated Outfit Board] */}
      <div className="mb-3 flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setViewMode('mannequin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            viewMode === 'mannequin'
              ? 'bg-[#A78BFA] text-[#111318] shadow-xs'
              : 'text-[#A8ADB8] hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Virtual Mannequin Display</span>
        </button>
        <button
          onClick={() => setViewMode('board')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            viewMode === 'board'
              ? 'bg-[#A78BFA] text-[#111318] shadow-xs'
              : 'text-[#A8ADB8] hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Curated Outfit Board</span>
        </button>
      </div>

      {/* VIEW 1: Interactive Layered Mannequin Chamber */}
      {viewMode === 'mannequin' ? (
        <div className="relative w-full max-w-[440px] aspect-[440/640] rounded-[36px] p-2 flex items-center justify-center overflow-hidden mannequin-chamber">
          
          {/* Glass Chamber Ambient Lighting (Brighter than surroundings) */}
          <div className="absolute inset-x-12 top-6 h-32 rounded-full bg-[#A78BFA]/10 blur-3xl pointer-events-none" />
          <div className="absolute inset-x-8 bottom-8 h-28 rounded-full bg-[#A78BFA]/20 blur-2xl pointer-events-none" />
          
          {/* Vertical Glass Reflection Strips */}
          <div className="absolute inset-y-6 left-4 w-1.5 rounded-full bg-gradient-to-b from-white/25 via-white/5 to-white/20 pointer-events-none" />
          <div className="absolute inset-y-6 right-4 w-1.5 rounded-full bg-gradient-to-b from-white/25 via-white/5 to-white/20 pointer-events-none" />

          {/* SVG LAYERED MANNEQUIN CANVAS (Unified 400x760 Coordinate Space) */}
          <svg
            viewBox="0 0 400 760"
            className="w-full h-full max-h-[95%] object-contain select-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
          >
            {/* 1. Showroom Pedestal Platform Base */}
            <g id="chamber-pedestal">
              {/* Outer platform glow */}
              <ellipse cx="200" cy="725" rx="140" ry="24" fill="#A78BFA" opacity="0.15" />
              {/* Metallic pedestal base */}
              <ellipse cx="200" cy="722" rx="120" ry="18" fill="#1E222B" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              {/* Circular light rim */}
              <ellipse cx="200" cy="720" rx="105" ry="14" fill="#252A36" stroke="#A78BFA" strokeWidth="2" strokeDasharray="6,4" />
              <ellipse cx="200" cy="718" rx="85" ry="10" fill="#2A303E" />
            </g>

            {/* 2. LAYER 1: Neutral Faceless Mannequin Base (Porcelain / Metallic Finish) */}
            <g id="mannequin-base">
              {/* Head - Faceless Egg Silhouette */}
              <ellipse cx="200" cy="85" rx="22" ry="32" fill="url(#mannequin-metallic)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              
              {/* Elegant Neck */}
              <path d="M 193 115 L 191 148 L 209 148 L 207 115 Z" fill="url(#mannequin-metallic)" />
              
              {/* Shoulders & Collarbone */}
              <path
                d="M 191 148 Q 148 152 144 165 L 142 190 L 168 190 L 172 165 Q 200 162 209 148 Z"
                fill="url(#mannequin-metallic)"
              />
              <path
                d="M 209 148 Q 252 152 256 165 L 258 190 L 232 190 L 228 165 Q 200 162 191 148 Z"
                fill="url(#mannequin-metallic)"
              />

              {/* Torso & Bust */}
              <path
                d="M 172 165 L 228 165 Q 235 210 226 260 Q 200 264 174 260 Q 165 210 172 165 Z"
                fill="url(#mannequin-metallic)"
              />

              {/* Hips & Pelvis */}
              <path
                d="M 174 260 Q 200 264 226 260 L 238 335 Q 200 345 162 335 Z"
                fill="url(#mannequin-metallic)"
              />

              {/* Left Leg: Thigh to Ankle */}
              <path
                d="M 166 335 Q 160 480 170 520 Q 166 610 174 685 L 188 685 Q 186 610 188 520 Q 198 480 196 340 Z"
                fill="url(#mannequin-metallic)"
              />

              {/* Right Leg: Thigh to Ankle */}
              <path
                d="M 234 335 Q 240 480 230 520 Q 234 610 226 685 L 212 685 Q 214 610 212 520 Q 202 480 204 340 Z"
                fill="url(#mannequin-metallic)"
              />

              {/* Left Foot */}
              <polygon points="172,685 188,685 192,715 158,715" fill="url(#mannequin-metallic)" />

              {/* Right Foot */}
              <polygon points="228,685 212,685 208,715 242,715" fill="url(#mannequin-metallic)" />

              {/* Left Arm: Shoulder to Hand */}
              <path
                d="M 144 165 Q 138 240 142 340 L 138 375 L 146 375 L 152 340 Q 150 240 156 185 Z"
                fill="url(#mannequin-metallic)"
              />

              {/* Right Arm: Shoulder to Hand */}
              <path
                d="M 256 165 Q 262 240 258 340 L 262 375 L 254 375 L 248 340 Q 250 240 244 185 Z"
                fill="url(#mannequin-metallic)"
              />
            </g>

            {/* 3. LAYER 2: Bottom Clothing (Jeans, Trousers, Skirt) - Suppressed if Dress */}
            {!dress && renderBottomSVG(bottom)}

            {/* 4. LAYER 3: Dress (Suppresses Top & Bottom) OR Top Blouse */}
            {dress ? renderDressSVG(dress) : renderTopSVG(top)}

            {/* 5. LAYER 4: Shoes */}
            {renderShoesSVG(shoes)}

            {/* 6. LAYER 5: Handbag / Crossbody */}
            {renderBagSVG(bag)}

            {/* Gradient Definition for Metallic Mannequin Finish */}
            <defs>
              <linearGradient id="mannequin-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E5E9F0" />
                <stop offset="40%" stopColor="#D8DEE9" />
                <stop offset="75%" stopColor="#B0B8C8" />
                <stop offset="100%" stopColor="#96A0B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ) : (
        /* VIEW 2: Functional Curated Outfit Board */
        <div className="w-full max-w-[440px] aspect-[440/640] rounded-[36px] p-5 flex flex-col justify-between mannequin-chamber">
          <div className="text-center mb-2">
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
