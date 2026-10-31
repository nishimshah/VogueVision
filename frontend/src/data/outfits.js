import outfit1Img from '../assets/mannequin/outfit_1.jpg';
import outfit2Img from '../assets/mannequin/outfit_2.jpg';
import outfit3Img from '../assets/mannequin/outfit_3.jpg';
import outfit4Img from '../assets/mannequin/outfit_4.jpg';
import outfit5Img from '../assets/mannequin/outfit_5.jpg';
import outfit6Img from '../assets/mannequin/outfit_6.jpg';
import outfit7Img from '../assets/mannequin/outfit_7.jpg';

// 4 Verified Evening & Special Showroom Previews:
import blackCorsetSatinSkirtImg from '../assets/mannequin/black_corset_black_satin_skirt.png';
import burgundyTopBlackTrousersImg from '../assets/mannequin/burgundy_top_black_trousers.png';
import champagneCamiSatinSkirtImg from '../assets/mannequin/champagne_cami_black_satin_skirt.png';
import blackTopCreamMiniBootsImg from '../assets/mannequin/black_top_cream_mini_knee_boots.png';

export const PREDEFINED_OUTFITS = [
  {
    id: 1,
    name: "Look 1 / 11 — White Tee + Blue Jeans",
    shortName: "White Tee + Blue Jeans",
    occasion: "Casual",
    image: outfit1Img,
    topId: 1,
    bottomId: 6,
    shoesId: 12,
    bagId: 16,
    dressId: null,
    matches: (o) => o?.top?.id === 1 && o?.bottom?.id === 6
  },
  {
    id: 2,
    name: "Look 2 / 11 — Black Top + Beige Trousers",
    shortName: "Black Top + Beige Trousers",
    occasion: "Formal",
    image: outfit2Img,
    topId: 2,
    bottomId: 8,
    shoesId: 13,
    bagId: 15,
    dressId: null,
    matches: (o) => o?.top?.id === 2 && o?.bottom?.id === 8
  },
  {
    id: 3,
    name: "Look 3 / 11 — Beige Blouse + Black Trousers",
    shortName: "Beige Blouse + Black Trousers",
    occasion: "Formal",
    image: outfit3Img,
    topId: 3,
    bottomId: 7,
    shoesId: 14,
    bagId: 17,
    dressId: null,
    matches: (o) => o?.top?.id === 3 && o?.bottom?.id === 7
  },
  {
    id: 4,
    name: "Look 4 / 11 — White Shirt + Blue Jeans",
    shortName: "White Shirt + Blue Jeans",
    occasion: "Casual",
    image: outfit4Img,
    topId: 4,
    bottomId: 6,
    shoesId: 12,
    bagId: 15,
    dressId: null,
    matches: (o) => o?.top?.id === 4 && o?.bottom?.id === 6
  },
  {
    id: 5,
    name: "Look 5 / 11 — Grey Tank + Cream Skirt",
    shortName: "Grey Tank + Cream Skirt",
    occasion: "Casual",
    image: outfit5Img,
    topId: 5,
    bottomId: 9,
    shoesId: 14,
    bagId: 17,
    dressId: null,
    matches: (o) => o?.top?.id === 5 && o?.bottom?.id === 9
  },
  {
    id: 6,
    name: "Look 6 / 11 — Black Cocktail Dress",
    shortName: "Black Cocktail Dress",
    occasion: "Party",
    image: outfit6Img,
    topId: null,
    bottomId: null,
    shoesId: 14,
    bagId: 15,
    dressId: 10,
    matches: (o) => o?.dress?.id === 10
  },
  {
    id: 7,
    name: "Look 7 / 11 — Beige Sleeveless Midi Dress",
    shortName: "Beige Sleeveless Dress",
    occasion: "Casual",
    image: outfit7Img,
    topId: null,
    bottomId: null,
    shoesId: 13,
    bagId: 16,
    dressId: 11,
    matches: (o) => o?.dress?.id === 11
  },
  {
    id: 8,
    name: "Look 8 / 11 — Black Corset + Satin Maxi Skirt",
    shortName: "Black Corset + Satin Maxi Skirt",
    occasion: "Party",
    image: blackCorsetSatinSkirtImg,
    topId: 18,
    bottomId: 19,
    shoesId: 14,
    bagId: 15,
    dressId: null,
    matches: (o) => o?.top?.id === 18 && o?.bottom?.id === 19
  },
  {
    id: 9,
    name: "Look 9 / 11 — Burgundy Top + Black Trousers",
    shortName: "Burgundy Top + Black Trousers",
    occasion: "Party",
    image: burgundyTopBlackTrousersImg,
    topId: 20,
    bottomId: 7,
    shoesId: 14,
    bagId: 15,
    dressId: null,
    matches: (o) => o?.top?.id === 20 && o?.bottom?.id === 7
  },
  {
    id: 10,
    name: "Look 10 / 11 — Champagne Cami + Satin Maxi Skirt",
    shortName: "Champagne Cami + Satin Maxi Skirt",
    occasion: "Party",
    image: champagneCamiSatinSkirtImg,
    topId: 21,
    bottomId: 19,
    shoesId: 14,
    bagId: 17,
    dressId: null,
    matches: (o) => o?.top?.id === 21 && o?.bottom?.id === 19
  },
  {
    id: 11,
    name: "Look 11 / 11 — Black Top + Cream Mini + Boots",
    shortName: "Black Top + Cream Mini + Boots",
    occasion: "Party",
    image: blackTopCreamMiniBootsImg,
    topId: 2,
    bottomId: 22,
    shoesId: 27,
    bagId: 15,
    dressId: null,
    matches: (o) => o?.top?.id === 2 && o?.bottom?.id === 22
  }
];
