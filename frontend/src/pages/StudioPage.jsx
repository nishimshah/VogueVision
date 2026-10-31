import React, { useState, useEffect } from 'react';
import { 
  Shirt, Sparkles, Layers, Scissors, Heart, ChevronRight, 
  ExternalLink, Info, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import OutfitPreview from '../components/OutfitPreview';
import { PREDEFINED_OUTFITS } from '../data/outfits';
import HowItWorksModal from '../components/HowItWorksModal';
import SavedOutfitsModal from '../components/SavedOutfitsModal';
import { getProducts, getProductStyling } from '../services/api';

export default function StudioPage() {
  // Modal states
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  // Category & Filter State (Tops, Bottoms, Skirts, Dresses)
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

  // Computer Vision Data
  const [similarStyles, setSimilarStyles] = useState([]);
  const [complementaryPieces, setComplementaryPieces] = useState({
    bottoms: [],
    shoes: [],
    bags: [],
    accessories: [],
    tops: []
  });
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [stylingMode, setStylingMode] = useState('auto'); // 'auto' | 'mix_match'
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

  // 4 Core Garment Categories
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

  // 1. Initial Load: Fetch catalog and initialize default Look 1
  useEffect(() => {
    async function initCatalog() {
      try {
        setCatalogLoading(true);
        const data = await getProducts('all');
        const prods = data.products || [];
        setCatalogProducts(prods);

        // Pre-equip Look 1 (Casual: White Tee + Blue Jeans)
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
        setComplementaryPieces(data.complementary_pieces || { bottoms: [], shoes: [], bags: [], accessories: [], tops: [] });
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

      if (stylingMode === 'mix_match') {
        // Manual Mix & Match mode: Preserve user's chosen bottom
        const currentBottom = selectedOutfit.bottom;
        const matched = PREDEFINED_OUTFITS.find(p => p.topId === item.id && p.bottomId === currentBottom?.id);
        let nextShoes = selectedOutfit.shoes;
        let nextBag = selectedOutfit.bag;
        if (matched) {
          const idx = PREDEFINED_OUTFITS.findIndex(p => p.id === matched.id);
          if (idx !== -1) setActiveLookIndex(idx);
          if (matched.shoesId) nextShoes = catalogProducts.find(p => p.id === matched.shoesId) || nextShoes;
          if (matched.bagId) nextBag = catalogProducts.find(p => p.id === matched.bagId) || nextBag;
        }
        setSelectedOutfit(prev => ({
          ...prev,
          top: item,
          dress: null,
          shoes: nextShoes,
          bag: nextBag
        }));
      } else {
        // Automatic styling mode: continue selecting a verified compatible outfit as currently implemented
        // 1. Find all verified outfits containing this top's product ID
        const verifiedOutfits = PREDEFINED_OUTFITS.filter(p => p.topId === item.id);

        // 2. Check if the currently equipped bottom already forms a verified outfit with this top
        let targetPreset = verifiedOutfits.find(p => p.bottomId === selectedOutfit.bottom?.id);

        // 3. If not, automatically select the matching verified bottom:
        if (!targetPreset && verifiedOutfits.length > 0) {
          // Special case for Black Fitted Top (ID 2):
          // Prioritize Look 11 (Cream Mini Skirt ID 22 + Boots)
          if (item.id === 2) {
            targetPreset = verifiedOutfits.find(p => p.id === 11) || verifiedOutfits[0];
          } else if (activeOccasion !== 'All') {
            targetPreset = verifiedOutfits.find(p => p.occasion === activeOccasion) || verifiedOutfits[0];
          } else {
            targetPreset = verifiedOutfits[0];
          }
        }

        if (targetPreset) {
          const companionBottom = catalogProducts.find(p => p.id === targetPreset.bottomId);
          const companionShoes = targetPreset.shoesId ? catalogProducts.find(p => p.id === targetPreset.shoesId) : selectedOutfit.shoes;
          const companionBag = targetPreset.bagId ? catalogProducts.find(p => p.id === targetPreset.bagId) : selectedOutfit.bag;

          setSelectedOutfit({
            top: item,
            bottom: companionBottom || null,
            dress: null,
            shoes: companionShoes || null,
            bag: companionBag || null
          });

          const idx = PREDEFINED_OUTFITS.findIndex(p => p.id === targetPreset.id);
          if (idx !== -1) setActiveLookIndex(idx);
        } else {
          // No verified outfit exists for this top: keep selected bottom, display outfit board
          setSelectedOutfit(prev => ({
            ...prev,
            top: item,
            dress: null
          }));
        }
      }

      triggerCVSimilarity(item.id);
      showToast(`Selected top: ${item.name}`);
    } else if (cat === 'jeans' || cat === 'trousers' || cat === 'skirts') {
      setLastSelectedCategory('bottoms');

      const currentTop = selectedOutfit.top;
      // Check whether this new bottom forms a verified preset with the currently selected top
      const matched = PREDEFINED_OUTFITS.find(p => p.topId === currentTop?.id && p.bottomId === item.id);

      let nextShoes = selectedOutfit.shoes;
      let nextBag = selectedOutfit.bag;
      if (matched) {
        const idx = PREDEFINED_OUTFITS.findIndex(p => p.id === matched.id);
        if (idx !== -1) setActiveLookIndex(idx);
        if (matched.shoesId) nextShoes = catalogProducts.find(p => p.id === matched.shoesId) || nextShoes;
        if (matched.bagId) nextBag = catalogProducts.find(p => p.id === matched.bagId) || nextBag;
      }

      // Preserve the user's selected top and deliberately selected bottom
      setSelectedOutfit(prev => ({
        ...prev,
        bottom: item,
        dress: null,
        shoes: nextShoes,
        bag: nextBag
      }));

      triggerCVSimilarity(item.id);
      showToast(`Selected bottom: ${item.name}`);
    } else if (cat === 'dresses') {
      setLastSelectedCategory('dresses');
      const matched = PREDEFINED_OUTFITS.find(p => p.dressId === item.id);
      let nextShoes = selectedOutfit.shoes;
      let nextBag = selectedOutfit.bag;
      if (matched) {
        const idx = PREDEFINED_OUTFITS.findIndex(p => p.id === matched.id);
        if (idx !== -1) setActiveLookIndex(idx);
        if (matched.shoesId) nextShoes = catalogProducts.find(p => p.id === matched.shoesId) || nextShoes;
        if (matched.bagId) nextBag = catalogProducts.find(p => p.id === matched.bagId) || nextBag;
      }
      setSelectedOutfit({
        top: null,
        bottom: null,
        dress: item,
        shoes: nextShoes,
        bag: nextBag
      });
      triggerCVSimilarity(item.id);
      showToast(`Selected dress: ${item.name}`);
    }
  };

  // Apply a verified Curated Preset Look (1..7)
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
    const currentMatched = PREDEFINED_OUTFITS.find(p => p.matches(selectedOutfit));
    const baseIdx = currentMatched 
      ? PREDEFINED_OUTFITS.findIndex(p => p.id === currentMatched.id) 
      : activeLookIndex;
    const nextIdx = (baseIdx - 1 + PREDEFINED_OUTFITS.length) % PREDEFINED_OUTFITS.length;
    applyPreset(PREDEFINED_OUTFITS[nextIdx].id);
  };

  const handleNextLook = () => {
    const currentMatched = PREDEFINED_OUTFITS.find(p => p.matches(selectedOutfit));
    const baseIdx = currentMatched 
      ? PREDEFINED_OUTFITS.findIndex(p => p.id === currentMatched.id) 
      : activeLookIndex;
    const nextIdx = (baseIdx + 1) % PREDEFINED_OUTFITS.length;
    applyPreset(PREDEFINED_OUTFITS[nextIdx].id);
  };

  // Reset entire outfit to default Look 1
  const handleResetOutfit = () => {
    setStylingMode('auto');
    applyPreset(1);
    showToast(`Outfit reset to default ensemble.`);
  };

  // Handle Occasion Switching (Casual, Formal, Party, All)
  const handleOccasionChange = (occ) => {
    setActiveOccasion(occ);
    if (occ === 'Casual') {
      // Check if current outfit matches casual, else switch to Look 1
      const isCasual = selectedOutfit.top?.occasions?.includes('Casual') || selectedOutfit.dress?.occasions?.includes('Casual');
      if (!isCasual) applyPreset(1);
    } else if (occ === 'Formal') {
      // Check if current outfit matches formal, else switch to Look 3
      const isFormal = selectedOutfit.top?.occasions?.includes('Formal') || selectedOutfit.dress?.occasions?.includes('Formal');
      if (!isFormal) applyPreset(3);
    } else if (occ === 'Party') {
      // Switch to Look 6 (Black Cocktail Dress) or Party corset
      applyPreset(6);
    }
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

    return p.occasions && p.occasions.includes(activeOccasion);
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

  // Save Current Outfit to LocalStorage
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
      occasion: activeOccasion,
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

  // Determine complementary pieces for "Style It With"
  // Top selected -> recommend bottoms; Bottom selected -> recommend tops; Dress selected -> recommend alternative dresses
  const getStyleItWithItems = () => {
    if (selectedOutfit.dress) {
      // For dresses, offer other compatible dresses
      return catalogProducts.filter(p => p.category === 'dresses' && p.id !== selectedOutfit.dress.id);
    }
    if (lastSelectedCategory === 'bottoms') {
      // Bottom is selected: show compatible tops
      return complementaryPieces.tops?.length > 0
        ? complementaryPieces.tops
        : catalogProducts.filter(p => p.category === 'tops');
    }
    // Top is selected: show compatible bottoms
    return complementaryPieces.bottoms?.length > 0 
      ? complementaryPieces.bottoms 
      : catalogProducts.filter(p => p.category === 'jeans' || p.category === 'trousers' || p.category === 'skirts');
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans select-none overflow-hidden bg-[#191723] text-[#F5F1F8]">
      {/* Compact Transparent Glass Header */}
      <Navbar 
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        onOpenSaved={() => setSavedModalOpen(true)}
        savedCount={savedOutfits.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-[#211E2B]/95 border border-[#B49AF4]/40 text-[#F5F1F8] text-xs font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-[#B49AF4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN 3-COLUMN STUDIO LAYOUT — Fixed Single-Screen Shell */}
      <main className="flex-1 min-h-0 px-4 lg:px-6 py-2.5 max-w-[1720px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: 01 — Choose Your Style (Span 3.5) */}
        {/* ========================================================= */}
        <section className="lg:col-span-3 h-full min-h-0 flex flex-col">
          <div className="glass-panel rounded-2xl p-3 h-full flex flex-col min-h-0 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
            
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#B49AF4] text-[#191723] font-bold text-[10px] flex items-center justify-center flex-shrink-0 shadow-xs">
                1
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-[#F5F1F8] leading-tight">
                  Choose Your Style
                </h2>
                <p className="text-[10px] text-[#AAA5B5]">
                  Curated Solid Wardrobe
                </p>
              </div>
            </div>

            {/* Occasion Filter Tabs */}
            <div className="flex items-center gap-1 mb-2 bg-white/[0.04] p-0.5 rounded-full border border-white/[0.10] flex-shrink-0">
              {occasions.map((occ) => {
                const isActive = activeOccasion === occ;
                return (
                  <button
                    key={occ}
                    onClick={() => handleOccasionChange(occ)}
                    className={`flex-1 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer text-center ${
                      isActive 
                        ? 'bg-[#B49AF4]/25 border border-[#B49AF4]/50 text-[#F5F1F8] shadow-xs font-bold' 
                        : 'text-[#AAA5B5] hover:text-[#F5F1F8]'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>

            {/* Category Pills (Tops, Trousers, Skirts, Dresses) */}
            <div className="grid grid-cols-2 gap-1 mb-2 flex-shrink-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10.5px] font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#B49AF4]/25 border border-[#B49AF4]/60 text-[#F5F1F8] shadow-xs' 
                        : 'bg-white/[0.04] text-[#AAA5B5] hover:bg-white/[0.08] hover:text-[#F5F1F8] border border-white/[0.08]'
                    }`}
                  >
                    <span className={isActive ? 'text-[#B49AF4]' : 'text-[#AAA5B5]'}>
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
                    <div key={idx} className="aspect-square rounded-xl bg-white/[0.04] animate-pulse border border-white/[0.08]" />
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
                            ? 'bg-[#B49AF4]/15 border-2 border-[#B49AF4] shadow-[0_0_16px_rgba(180,154,244,0.3)] scale-[1.01]' 
                            : 'bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] hover:shadow-xs'
                        }`}
                        title={`${product.name} — ${product.price}`}
                      >
                        <div className="relative flex-1 rounded-lg overflow-hidden mb-1 bg-white/[0.02]">
                          <img 
                            src={`/catalog/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Studio Look Available Badge */}
                          {product.has_studio_look && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-[#191723]/80 backdrop-blur-md border border-[#B49AF4]/40 text-[7.5px] font-bold text-[#B49AF4] flex items-center gap-0.5 pointer-events-none">
                              <Check className="w-2 h-2 text-[#B49AF4]" /> Studio
                            </span>
                          )}

                          {/* Heart Wishlist Icon */}
                          <button
                            onClick={(e) => toggleWishlist(product, e)}
                            className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isFav 
                                ? 'bg-[#B49AF4] text-[#191723]' 
                                : 'bg-[#191723]/70 text-[#AAA5B5] hover:text-[#B49AF4] opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <Heart className="w-2.5 h-2.5 fill-current" />
                          </button>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-semibold text-[#F5F1F8] leading-tight line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="text-[9.5px] font-medium text-[#B49AF4] font-mono">
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
            stylingMode={stylingMode}
            onModeChange={setStylingMode}
          />
        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 02 Similar Pieces, 03 Style It With, 04 Online (Span 4) */}
        {/* ========================================================= */}
        <section className="lg:col-span-4 h-full min-h-0 flex flex-col gap-2 justify-between">
          
          {/* SECTION 02: Similar Pieces (cv2.compareHist Real Pearson Scores) */}
          <div className="glass-panel rounded-2xl p-2.5 flex-1 min-h-0 flex flex-col justify-between shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 mb-1 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#B49AF4] text-[#191723] font-bold text-[10px] flex items-center justify-center shadow-xs">
                2
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-[#F5F1F8] leading-tight">
                  Similar Pieces
                </h3>
                <p className="text-[9.5px] text-[#AAA5B5]">
                  OpenCV 512-Bin HSV Histogram Correlation
                </p>
              </div>
            </div>

            {/* Horizontal Product Cards Row */}
            <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-0 items-center">
              {similarStyles.length === 0 ? (
                <div className="col-span-4 py-4 text-center text-[10.5px] text-[#AAA5B5]">
                  Calculating OpenCV color distribution matches...
                </div>
              ) : (
                similarStyles.slice(0, 4).map((sim) => {
                  const isFav = wishlist.some(w => w.id === sim.id);
                  const isSelected = isProductSelected(sim);
                  const corrVal = sim.raw_correlation !== undefined ? sim.raw_correlation : 0.75;
                  const pctVal = sim.similarity_score !== undefined ? sim.similarity_score : Math.round(corrVal * 100);

                  return (
                    <div
                      key={sim.id}
                      onClick={() => selectGarment(sim)}
                      className={`group relative rounded-xl p-1 border transition-all cursor-pointer flex flex-col justify-between h-full max-h-[140px] ${
                        isSelected
                          ? 'bg-[#B49AF4]/20 border-2 border-[#B49AF4] shadow-xs'
                          : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/[0.12]'
                      }`}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-1 bg-white/[0.02]">
                        <img 
                          src={`/catalog/${sim.image}`} 
                          alt={sim.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                          onClick={(e) => toggleWishlist(sim, e)}
                          className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                            isFav ? 'bg-[#B49AF4] text-[#191723]' : 'bg-[#191723]/70 text-[#AAA5B5] hover:text-[#B49AF4]'
                          }`}
                        >
                          <Heart className="w-2 h-2 fill-current" />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-[9px] font-semibold text-[#F5F1F8] leading-tight line-clamp-1">
                          {sim.name}
                        </h4>
                        <p className="text-[8.5px] text-[#AAA5B5] font-mono">
                          {sim.price}
                        </p>
                      </div>

                      <div className="mt-0.5 pt-0.5 border-t border-white/[0.08] text-center">
                        <span className="text-[8px] font-mono font-semibold px-1 py-0.5 rounded-full bg-[#B49AF4]/15 text-[#B49AF4] border border-[#B49AF4]/30 block truncate" title={`Pearson Correlation: ${corrVal >= 0 ? '+' : ''}${corrVal.toFixed(3)}`}>
                          r: {corrVal >= 0 ? '+' : ''}{corrVal.toFixed(2)} ({pctVal}%)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SECTION 03: Style It With (Color Harmony & Category Matching) */}
          <div className="glass-panel rounded-2xl p-2.5 flex-1 min-h-0 flex flex-col justify-between shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 mb-1 flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#B49AF4] text-[#191723] font-bold text-[10px] flex items-center justify-center shadow-xs">
                3
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-[#F5F1F8] leading-tight">
                  Style It With
                </h3>
                <p className="text-[9.5px] text-[#AAA5B5]">
                  {selectedOutfit.dress 
                    ? 'Complementary Dresses & Evening Ensembles' 
                    : (lastSelectedCategory === 'bottoms' ? 'Compatible Tops & Blouses' : 'Compatible Bottoms & Trousers')}
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
                        ? 'bg-[#B49AF4]/20 border-2 border-[#B49AF4] shadow-xs' 
                        : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/[0.12]'
                    }`}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-1 bg-white/[0.02]">
                      <img 
                        src={`/catalog/${item.image}`} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.is_verified_companion && (
                        <span className="absolute top-0.5 left-0.5 px-1 py-0.5 rounded bg-[#B49AF4] text-[#191723] text-[6.5px] font-extrabold shadow-xs pointer-events-none tracking-tight">
                          ★ Studio Look
                        </span>
                      )}
                      <button
                        onClick={(e) => toggleWishlist(item, e)}
                        className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          isFav ? 'bg-[#B49AF4] text-[#191723]' : 'bg-[#191723]/70 text-[#AAA5B5] hover:text-[#B49AF4]'
                        }`}
                      >
                        <Heart className="w-2 h-2 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-semibold text-[#F5F1F8] leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[8.5px] text-[#AAA5B5] font-mono">
                        {item.price}
                      </p>
                    </div>

                    <div className="mt-0.5 pt-0.5 border-t border-white/[0.08] text-center">
                      <span className={`text-[8px] font-semibold ${item.is_verified_companion ? 'text-[#B49AF4] font-bold' : 'text-[#AAA5B5]'}`}>
                        {isEquipped ? 'Equipped' : (item.is_verified_companion ? '★ Equip Look' : '+ Pair')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 04: Find Similar Online (Compact Shopping Links) */}
          <div className="glass-panel rounded-2xl p-2.5 flex-shrink-0 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] font-bold text-[#AAA5B5] uppercase tracking-wider">
                Find Similar Online
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { name: 'Myntra', badgeColor: '#FF3F6C' },
                { name: 'AJIO', badgeColor: '#3BB0E6' },
                { name: 'H&M', badgeColor: '#E50010' },
                { name: 'ZARA', badgeColor: '#F5F1F8' },
              ].map((retailer) => (
                <button
                  key={retailer.name}
                  onClick={() => handleRetailerSearch(retailer.name)}
                  className="py-1 px-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[10px] font-bold border border-white/[0.12] transition-all flex items-center justify-center gap-0.5 cursor-pointer shadow-xs hover:border-[#B49AF4]/40"
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
