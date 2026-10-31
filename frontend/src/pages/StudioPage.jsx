import React, { useState, useEffect } from 'react';
import { 
  Shirt, Sparkles, Layers, Scissors, Heart, ChevronRight, 
  ExternalLink, Info
} from 'lucide-react';
import Navbar from '../components/Navbar';
import OutfitPreview, { PREDEFINED_OUTFITS } from '../components/OutfitPreview';
import HowItWorksModal from '../components/HowItWorksModal';
import AboutModal from '../components/AboutModal';
import SavedOutfitsModal from '../components/SavedOutfitsModal';
import { getProducts, getProductStyling } from '../services/api';

export default function StudioPage() {
  // Modal states
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  // Category & Filter State (Prioritizing Tops, Bottoms, Skirts, Dresses)
  const [activeCategory, setActiveCategory] = useState('tops');
  const [activeOccasion, setActiveOccasion] = useState('All'); // 'All' | 'Casual' | 'Formal' | 'Party'
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // Single Shared Outfit State
  const [selectedOutfit, setSelectedOutfit] = useState({
    top: null,
    bottom: null,
    dress: null,
    shoes: null,
    bag: null
  });

  // CV Data
  const [similarStyles, setSimilarStyles] = useState([]);
  const [complementaryPieces, setComplementaryPieces] = useState({
    bottoms: [],
    shoes: [],
    bags: [],
    accessories: []
  });
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [lastSelectedCategory, setLastSelectedCategory] = useState('tops'); // 'tops' | 'bottoms' | 'dresses'
  const [toastMessage, setToastMessage] = useState(null);

  // Wishlist and Saved Outfits (localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('voguevision_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedOutfits, setSavedOutfits] = useState(() => {
    try {
      const saved = localStorage.getItem('voguevision_saved_outfits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4 Core Garment Categories (Shoes & Bags are kept fixed in preset looks)
  const categories = [
    { id: 'tops', label: 'Tops & Blouses', icon: <Shirt className="w-3.5 h-3.5" /> },
    { id: 'jeans_trousers', label: 'Jeans & Trousers', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'skirts', label: 'Skirts', icon: <Scissors className="w-3.5 h-3.5" /> },
    { id: 'dresses', label: 'Dresses', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const occasions = ['All', 'Casual', 'Formal', 'Party'];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1. Initial Load: Fetch catalog and load default Look 1
  useEffect(() => {
    async function initCatalog() {
      try {
        setCatalogLoading(true);
        const data = await getProducts('all');
        const prods = data.products || [];
        setCatalogProducts(prods);

        // Pre-equip Look 1:
        // Top: ID 1 (White Fitted T-Shirt)
        // Bottom: ID 6 (Blue Straight-Leg Jeans)
        // Shoes: ID 12 (White Tennis Sneakers)
        // Bag: ID 16 (Tan Leather Tote)
        const defaultTop = prods.find(p => p.id === 1) || prods[0];
        const defaultBottom = prods.find(p => p.id === 6);
        const defaultShoes = prods.find(p => p.id === 12);
        const defaultBag = prods.find(p => p.id === 16);

        setSelectedOutfit({
          top: defaultTop || null,
          bottom: defaultBottom || null,
          dress: null,
          shoes: defaultShoes || null,
          bag: defaultBag || null
        });

        if (defaultTop) {
          await triggerCVSimilarity(defaultTop.id);
        }
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setCatalogLoading(false);
      }
    }
    initCatalog();
  }, []);

  // 2. Fetch Computer Vision styling for a product
  const triggerCVSimilarity = async (productId) => {
    try {
      const data = await getProductStyling(productId);
      if (data.success) {
        setSimilarStyles(data.similar_styles || []);
        setComplementaryPieces(data.complementary_pieces || { bottoms: [], shoes: [], bags: [], accessories: [] });
      }
    } catch (err) {
      console.error("Error loading CV styling:", err);
    }
  };

  // Central Unified Garment Selection
  const selectGarment = (item) => {
    if (!item) return;
    const cat = item.category;

    if (cat === 'tops') {
      setLastSelectedCategory('tops');
      setSelectedOutfit(prev => ({
        ...prev,
        top: item,
        dress: null // Clear dress when choosing separates
      }));
      triggerCVSimilarity(item.id);
      showToast(`Selected top: ${item.name}`);
    } else if (cat === 'jeans' || cat === 'trousers' || cat === 'skirts') {
      setLastSelectedCategory('bottoms');
      setSelectedOutfit(prev => ({
        ...prev,
        bottom: item,
        dress: null // Clear dress when choosing separates
      }));
      triggerCVSimilarity(item.id);
      showToast(`Selected bottom: ${item.name}`);
    } else if (cat === 'dresses') {
      setLastSelectedCategory('dresses');
      setSelectedOutfit(prev => ({
        ...prev,
        dress: item,
        top: null, // Clear separates when choosing a dress
        bottom: null
      }));
      triggerCVSimilarity(item.id);
      showToast(`Selected dress: ${item.name}`);
    }
  };

  // Apply a verified Curated Preset (1..7)
  const applyPreset = (presetId) => {
    const preset = PREDEFINED_OUTFITS.find(p => p.id === presetId);
    if (!preset) return;

    const idx = PREDEFINED_OUTFITS.findIndex(p => p.id === presetId);
    if (idx !== -1) setActiveLookIndex(idx);

    const newTop = catalogProducts.find(p => p.id === preset.topId);
    const newBottom = catalogProducts.find(p => p.id === preset.bottomId);
    const newShoes = catalogProducts.find(p => p.id === preset.shoesId);
    const newBag = catalogProducts.find(p => p.id === preset.bagId);
    const newDress = preset.dressId ? catalogProducts.find(p => p.id === preset.dressId) : null;

    setSelectedOutfit({
      top: newTop || null,
      bottom: newBottom || null,
      dress: newDress || null,
      shoes: newShoes || null,
      bag: newBag || null
    });

    const triggerId = newDress ? newDress.id : (newTop ? newTop.id : null);
    if (triggerId) triggerCVSimilarity(triggerId);
    showToast(`Equipped ${preset.shortName}`);
  };

  const handlePrevLook = () => {
    const nextIdx = (activeLookIndex - 1 + PREDEFINED_OUTFITS.length) % PREDEFINED_OUTFITS.length;
    applyPreset(PREDEFINED_OUTFITS[nextIdx].id);
  };

  const handleNextLook = () => {
    const nextIdx = (activeLookIndex + 1) % PREDEFINED_OUTFITS.length;
    applyPreset(PREDEFINED_OUTFITS[nextIdx].id);
  };

  // Reset entire outfit to default separates (Part 3)
  const handleResetOutfit = () => {
    applyPreset(1);
    showToast(`Outfit reset to default ensemble.`);
  };

  // Filter left catalog products based on active category & occasion
  const filteredCatalog = catalogProducts.filter(p => {
    let catMatch = false;
    if (activeCategory === 'tops') catMatch = p.category === 'tops';
    else if (activeCategory === 'jeans_trousers') catMatch = p.category === 'jeans' || p.category === 'trousers';
    else if (activeCategory === 'skirts') catMatch = p.category === 'skirts';
    else if (activeCategory === 'dresses') catMatch = p.category === 'dresses';

    if (!catMatch) return false;
    if (activeOccasion === 'All') return true;

    // Filter by occasion keywords if applicable
    if (activeOccasion === 'Casual') {
      return p.name.includes('T-Shirt') || p.name.includes('Jeans') || p.name.includes('Tank') || p.name.includes('Sleeveless') || p.name.includes('Shirt');
    }
    if (activeOccasion === 'Formal') {
      return p.name.includes('Trousers') || p.name.includes('Blouse') || p.name.includes('Shirt') || p.name.includes('Black Fitted');
    }
    if (activeOccasion === 'Party') {
      return p.name.includes('Dress') || p.name.includes('Skirt') || p.name.includes('Silky');
    }
    return true;
  });

  // Toggle Item in Wishlist
  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    let updated;
    if (wishlist.some(p => p.id === product.id)) {
      updated = wishlist.filter(p => p.id !== product.id);
      showToast(`Removed from Wishlist`);
    } else {
      updated = [...wishlist, product];
      showToast(`Added to Wishlist!`);
    }
    setWishlist(updated);
    localStorage.setItem('voguevision_wishlist', JSON.stringify(updated));
  };

  // Save Current Outfit to LocalStorage (Part 3)
  const handleSaveOutfit = () => {
    const activeMain = selectedOutfit.dress || selectedOutfit.top;
    const newOutfit = {
      id: Date.now(),
      name: `${activeMain?.name || 'Curated'} Ensemble`,
      top: selectedOutfit.top,
      bottom: selectedOutfit.bottom,
      dress: selectedOutfit.dress,
      shoes: selectedOutfit.shoes,
      bag: selectedOutfit.bag,
      savedAt: new Date().toISOString()
    };
    const updated = [newOutfit, ...savedOutfits];
    setSavedOutfits(updated);
    localStorage.setItem('voguevision_saved_outfits', JSON.stringify(updated));
    showToast(`Outfit saved to your wardrobe!`);
  };

  // Load a Saved Outfit from Modal
  const handleLoadSavedOutfit = (outfit) => {
    setSelectedOutfit({
      top: outfit.top || null,
      bottom: outfit.bottom || null,
      dress: outfit.dress || null,
      shoes: outfit.shoes || null,
      bag: outfit.bag || null
    });
    if (outfit.top) triggerCVSimilarity(outfit.top.id);
    else if (outfit.dress) triggerCVSimilarity(outfit.dress.id);
    showToast(`Loaded ${outfit.name}!`);
  };

  const handleDeleteSavedOutfit = (outfitId) => {
    const updated = savedOutfits.filter(o => o.id !== outfitId);
    setSavedOutfits(updated);
    localStorage.setItem('voguevision_saved_outfits', JSON.stringify(updated));
    showToast(`Outfit removed.`);
  };

  // Retailer Search links
  const handleRetailerSearch = (retailerName) => {
    const activeItem = selectedOutfit.dress || selectedOutfit.top || selectedOutfit.bottom;
    if (!activeItem) return;
    const query = `${activeItem.primary_color || ''} ${activeItem.name} ${activeItem.category}`.trim();
    let url = '';
    
    switch (retailerName) {
      case 'Myntra':
        url = `https://www.myntra.com/${encodeURIComponent(query)}`;
        break;
      case 'AJIO':
        url = `https://www.ajio.com/search/?text=${encodeURIComponent(query)}`;
        break;
      case 'H&M':
        url = `https://www2.hm.com/en_in/search-results.html?q=${encodeURIComponent(query)}`;
        break;
      case 'ZARA':
        url = `https://www.zara.com/in/en/search?searchTerm=${encodeURIComponent(query)}`;
        break;
      default:
        url = `https://www.google.com/search?q=${encodeURIComponent(query + ' buy online')}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isProductSelected = (product) => {
    if (!product) return false;
    return (
      selectedOutfit.top?.id === product.id ||
      selectedOutfit.bottom?.id === product.id ||
      selectedOutfit.dress?.id === product.id
    );
  };

  // Determine complementary pieces for "Style It With" based on active item
  const getStyleItWithItems = () => {
    if (selectedOutfit.dress) {
      // For dresses, offer other compatible pieces or alternate dresses
      return catalogProducts.filter(p => p.category === 'dresses' && p.id !== selectedOutfit.dress.id);
    }
    if (lastSelectedCategory === 'bottoms') {
      // Bottom is selected: show compatible tops
      return catalogProducts.filter(p => p.category === 'tops');
    }
    // Top is selected: show compatible bottoms
    return complementaryPieces.bottoms?.length > 0 
      ? complementaryPieces.bottoms 
      : catalogProducts.filter(p => p.category === 'jeans' || p.category === 'trousers' || p.category === 'skirts');
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans select-none overflow-hidden bg-[#D8D0DC] text-[#292331]">
      {/* Compact Transparent Glass Header */}
      <Navbar 
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenSaved={() => setSavedModalOpen(true)}
        savedCount={savedOutfits.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-white/95 border border-[#9271BF]/40 text-[#292331] text-xs font-semibold shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-[#9271BF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN 3-COLUMN STUDIO LAYOUT — Fixed Single-Screen Shell */}
      <main className="flex-1 min-h-0 px-4 lg:px-6 py-2.5 max-w-[1720px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: 01 — Choose Your Style (Span 3.5) */}
        {/* ========================================================= */}
        <section className="lg:col-span-3 h-full min-h-0 flex flex-col">
          <div className="mauve-glass-panel rounded-2xl p-3.5 h-full flex flex-col min-h-0 shadow-[0_8px_24px_rgba(41,35,49,0.05)]">
            
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2.5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#9271BF] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 shadow-2xs">
                1
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-[#292331] leading-tight">
                  Choose Your Style
                </h2>
                <p className="text-[10px] text-[#6D6574]">
                  Minimal Curated Wardrobe
                </p>
              </div>
            </div>

            {/* Occasion Filter Tabs (Part 7) */}
            <div className="flex items-center gap-1 mb-2 bg-white/45 p-0.5 rounded-full border border-white/60 flex-shrink-0">
              {occasions.map((occ) => {
                const isActive = activeOccasion === occ;
                return (
                  <button
                    key={occ}
                    onClick={() => setActiveOccasion(occ)}
                    className={`flex-1 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer text-center ${
                      isActive 
                        ? 'bg-white text-[#9271BF] shadow-2xs font-bold' 
                        : 'text-[#6D6574] hover:text-[#292331]'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>

            {/* Category Pills (Tops, Trousers, Skirts, Dresses) */}
            <div className="grid grid-cols-2 gap-1 mb-2.5 flex-shrink-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10.5px] font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#9271BF] text-white shadow-2xs' 
                        : 'bg-white/40 text-[#6D6574] hover:bg-white/60 hover:text-[#292331] border border-white/60'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-[#9271BF]'}>
                      {cat.icon}
                    </span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Product Card Grid (Constrained to Panel) */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                {catalogLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="aspect-square rounded-xl bg-white/30 animate-pulse border border-white/40" />
                  ))
                ) : (
                  filteredCatalog.map((product) => {
                    const isSelected = isProductSelected(product);
                    const isFav = wishlist.some(w => w.id === product.id);

                    return (
                      <div
                        key={product.id}
                        onClick={() => selectGarment(product)}
                        className={`group relative aspect-[4/4.5] rounded-xl overflow-hidden cursor-pointer p-1.5 transition-all duration-200 flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-white/80 border-2 border-[#9271BF] shadow-[0_0_12px_rgba(146,113,191,0.3)] scale-[1.01]' 
                            : 'bg-white/45 hover:bg-white/70 border border-white/60 hover:shadow-xs'
                        }`}
                        title={`${product.name} — ${product.price}`}
                      >
                        <div className="relative flex-1 rounded-lg overflow-hidden mb-1">
                          <img 
                            src={`/catalog/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Heart Wishlist Icon */}
                          <button
                            onClick={(e) => toggleWishlist(product, e)}
                            className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isFav 
                                ? 'bg-[#9271BF] text-white' 
                                : 'bg-white/75 text-[#292331]/60 hover:text-[#9271BF] opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <Heart className="w-2.5 h-2.5 fill-current" />
                          </button>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-semibold text-[#292331] leading-tight line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="text-[9.5px] font-medium text-[#6D6574]">
                            {product.price}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* CENTER COLUMN: Realistic Virtual Mannequin Display (Span 5) */}
        {/* ========================================================= */}
        <section className="lg:col-span-5 h-full min-h-0 flex flex-col justify-between items-center">
          <OutfitPreview
            selectedOutfit={selectedOutfit}
            onPrevLook={handlePrevLook}
            onNextLook={handleNextLook}
            onSaveOutfit={handleSaveOutfit}
            onResetOutfit={handleResetOutfit}
            activeLookIndex={activeLookIndex}
            onApplyPreset={applyPreset}
          />
        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 02 Similar Pieces, 03 Style It With, 04 Online (Span 4) */}
        {/* ========================================================= */}
        <section className="lg:col-span-4 h-full min-h-0 flex flex-col gap-2.5 justify-between">
          
          {/* SECTION 02: Similar Pieces (cv2.compareHist Real Scores) */}
          <div className="mauve-glass-panel rounded-2xl p-3 flex-1 min-h-0 flex flex-col justify-between shadow-[0_8px_24px_rgba(41,35,49,0.05)]">
            <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#9271BF] text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
                2
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-[#292331] leading-tight">
                  Similar Pieces
                </h3>
                <p className="text-[9.5px] text-[#6D6574]">
                  Computer Vision Visual Similarity
                </p>
              </div>
            </div>

            {/* Horizontal Product Cards Row */}
            <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-0 items-center">
              {similarStyles.slice(0, 4).map((sim) => {
                const isFav = wishlist.some(w => w.id === sim.id);
                const isSelected = isProductSelected(sim);
                const matchVal = Math.round(sim.similarity_score || (sim.match_percentage ? sim.match_percentage : 85));

                return (
                  <div
                    key={sim.id}
                    onClick={() => selectGarment(sim)}
                    className={`group relative rounded-xl p-1 border transition-all cursor-pointer flex flex-col justify-between h-full max-h-[140px] ${
                      isSelected
                        ? 'bg-white/85 border-2 border-[#9271BF] shadow-xs'
                        : 'bg-white/45 hover:bg-white/70 border-white/60'
                    }`}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-1">
                      <img 
                        src={`/catalog/${sim.image}`} 
                        alt={sim.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={(e) => toggleWishlist(sim, e)}
                        className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          isFav ? 'bg-[#9271BF] text-white' : 'bg-white/80 text-[#292331]/60 hover:text-[#9271BF]'
                        }`}
                      >
                        <Heart className="w-2 h-2 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-semibold text-[#292331] leading-tight line-clamp-1">
                        {sim.name}
                      </h4>
                      <p className="text-[8.5px] text-[#6D6574]">
                        {sim.price}
                      </p>
                    </div>

                    <div className="mt-0.5 pt-0.5 border-t border-white/60 text-center">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {matchVal}% match
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 03: Style It With (Color Harmony & Category Matching) */}
          <div className="mauve-glass-panel rounded-2xl p-3 flex-1 min-h-0 flex flex-col justify-between shadow-[0_8px_24px_rgba(41,35,49,0.05)]">
            <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#9271BF] text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
                3
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-[#292331] leading-tight">
                  Style It With
                </h3>
                <p className="text-[9.5px] text-[#6D6574]">
                  Complementary Outfit Pieces
                </p>
              </div>
            </div>

            {/* Horizontal Product Cards Row */}
            <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-0 items-center">
              {getStyleItWithItems().slice(0, 4).map((item) => {
                const isFav = wishlist.some(w => w.id === item.id);
                const isEquipped = isProductSelected(item);

                return (
                  <div
                    key={item.id}
                    onClick={() => selectGarment(item)}
                    className={`group relative rounded-xl p-1 border transition-all cursor-pointer flex flex-col justify-between h-full max-h-[140px] ${
                      isEquipped 
                        ? 'bg-white/85 border-2 border-[#9271BF] shadow-xs' 
                        : 'bg-white/45 hover:bg-white/70 border-white/60'
                    }`}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-1">
                      <img 
                        src={`/catalog/${item.image}`} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => toggleWishlist(item, e)}
                        className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          isFav ? 'bg-[#9271BF] text-white' : 'bg-white/80 text-[#292331]/60 hover:text-[#9271BF]'
                        }`}
                      >
                        <Heart className="w-2 h-2 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-semibold text-[#292331] leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[8.5px] text-[#6D6574]">
                        {item.price}
                      </p>
                    </div>

                    <div className="mt-0.5 pt-0.5 border-t border-white/60 text-center">
                      <span className="text-[8px] font-semibold text-[#9271BF]">
                        {isEquipped ? 'Equipped' : '+ Pair'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 04: Find Similar Online (Compact Shopping Links) */}
          <div className="mauve-glass-panel rounded-2xl p-2.5 flex-shrink-0 shadow-[0_8px_24px_rgba(41,35,49,0.05)]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] font-bold text-[#6D6574] uppercase tracking-wider">
                Find Similar Online
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { name: 'Myntra', badgeColor: '#D1286B' },
                { name: 'AJIO', badgeColor: '#2C4152' },
                { name: 'H&M', badgeColor: '#B80010' },
                { name: 'ZARA', badgeColor: '#1A181C' },
              ].map((retailer) => (
                <button
                  key={retailer.name}
                  onClick={() => handleRetailerSearch(retailer.name)}
                  className="py-1 px-1.5 rounded-lg bg-white/50 hover:bg-white text-[10px] font-bold border border-white/70 transition-all flex items-center justify-center gap-0.5 cursor-pointer shadow-2xs hover:shadow-xs"
                  style={{ color: retailer.badgeColor }}
                >
                  <span>{retailer.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                </button>
              ))}
            </div>
          </div>

        </section>
      </main>

      {/* MODALS */}
      <HowItWorksModal 
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />

      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      <SavedOutfitsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedOutfits={savedOutfits}
        onLoadOutfit={handleLoadSavedOutfit}
        onDeleteOutfit={handleDeleteSavedOutfit}
      />
    </div>
  );
}
