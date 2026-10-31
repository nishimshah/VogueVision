import React, { useState, useEffect } from 'react';
import { 
  Shirt, Sparkles, Layers, Scissors, Footprints, ShoppingBag, 
  Heart, ChevronRight, ChevronLeft, Bookmark, RotateCcw, 
  ExternalLink, Check, Info, Eye
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

  // Category and Catalog State
  const [activeCategory, setActiveCategory] = useState('tops');
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // Single Shared Outfit State (Required by Part 3 & 5)
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
  const [activeTab, setActiveTab] = useState('bottoms'); // 'bottoms', 'shoes', 'bags', 'dresses'
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

  // Category Definitions for Left Panel
  const categories = [
    { id: 'tops', label: 'Tops & Blouses', icon: <Shirt className="w-4 h-4" /> },
    { id: 'dresses', label: 'Dresses', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'jeans_trousers', label: 'Jeans & Trousers', icon: <Layers className="w-4 h-4" /> },
    { id: 'skirts', label: 'Skirts', icon: <Scissors className="w-4 h-4" /> },
    { id: 'shoes', label: 'Shoes', icon: <Footprints className="w-4 h-4" /> },
    { id: 'bags', label: 'Bags & Accessories', icon: <ShoppingBag className="w-4 h-4" /> },
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // 1. Initial Load: Fetch catalog and load default initial outfit (Look 1)
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
        // Shoes: ID 12 (Minimalist White Tennis Sneakers)
        // Bag: ID 16 (Structured Tan Leather Tote)
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

  // Central Unified Garment Selection (Required by Parts 3 & 5)
  const selectGarment = (item) => {
    if (!item) return;
    const cat = item.category;

    if (cat === 'tops') {
      setSelectedOutfit(prev => ({
        ...prev,
        top: item,
        dress: null // Clear dress when choosing a top
      }));
      triggerCVSimilarity(item.id);
      showToast(`Selected top: ${item.name}`);
    } else if (cat === 'jeans' || cat === 'trousers' || cat === 'skirts') {
      setSelectedOutfit(prev => ({
        ...prev,
        bottom: item,
        dress: null // Clear dress when choosing a bottom
      }));
      showToast(`Selected bottom: ${item.name}`);
    } else if (cat === 'dresses') {
      setSelectedOutfit(prev => ({
        ...prev,
        dress: item
      }));
      triggerCVSimilarity(item.id);
      showToast(`Selected dress: ${item.name}`);
    } else if (cat === 'shoes') {
      setSelectedOutfit(prev => ({
        ...prev,
        shoes: item
      }));
      showToast(`Selected shoes: ${item.name}`);
    } else if (cat === 'handbags') {
      setSelectedOutfit(prev => ({
        ...prev,
        bag: item
      }));
      showToast(`Selected bag: ${item.name}`);
    }
  };

  // Remove a garment piece from the shared outfit state
  const handleRemoveItem = (slot) => {
    setSelectedOutfit(prev => ({
      ...prev,
      [slot]: null
    }));
    showToast(`Removed ${slot} from mannequin`);
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
    showToast(`Equipped ${preset.name}`);
  };

  const handlePrevLook = () => {
    const nextIdx = (activeLookIndex - 1 + PREDEFINED_OUTFITS.length) % PREDEFINED_OUTFITS.length;
    applyPreset(PREDEFINED_OUTFITS[nextIdx].id);
  };

  const handleNextLook = () => {
    const nextIdx = (activeLookIndex + 1) % PREDEFINED_OUTFITS.length;
    applyPreset(PREDEFINED_OUTFITS[nextIdx].id);
  };

  // Reset entire outfit to default separates (Part 6)
  const handleResetOutfit = () => {
    applyPreset(1);
    showToast(`Outfit reset to default ensemble.`);
  };

  // Filter left catalog products based on active category
  const filteredCatalog = catalogProducts.filter(p => {
    if (activeCategory === 'tops') return p.category === 'tops';
    if (activeCategory === 'dresses') return p.category === 'dresses';
    if (activeCategory === 'jeans_trousers') return p.category === 'jeans' || p.category === 'trousers';
    if (activeCategory === 'skirts') return p.category === 'skirts';
    if (activeCategory === 'shoes') return p.category === 'shoes';
    if (activeCategory === 'bags') return p.category === 'handbags';
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
      showToast(`Added ${product.name} to Wishlist!`);
    }
    setWishlist(updated);
    localStorage.setItem('voguevision_wishlist', JSON.stringify(updated));
  };

  // Save Current Outfit to LocalStorage (Part 6)
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
      productIds: {
        top: selectedOutfit.top?.id || null,
        bottom: selectedOutfit.bottom?.id || null,
        dress: selectedOutfit.dress?.id || null,
        shoes: selectedOutfit.shoes?.id || null,
        bag: selectedOutfit.bag?.id || null,
      },
      savedAt: new Date().toISOString()
    };
    const updated = [newOutfit, ...savedOutfits];
    setSavedOutfits(updated);
    localStorage.setItem('voguevision_saved_outfits', JSON.stringify(updated));
    showToast(`Outfit successfully saved to your wardrobe!`);
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

  // Delete a Saved Outfit
  const handleDeleteSavedOutfit = (outfitId) => {
    const updated = savedOutfits.filter(o => o.id !== outfitId);
    setSavedOutfits(updated);
    localStorage.setItem('voguevision_saved_outfits', JSON.stringify(updated));
    showToast(`Outfit removed.`);
  };

  // Retailer Search links (Part 7)
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

  // Determine if a product is currently active in the selected outfit
  const isProductSelected = (product) => {
    if (!product) return false;
    return (
      selectedOutfit.top?.id === product.id ||
      selectedOutfit.bottom?.id === product.id ||
      selectedOutfit.dress?.id === product.id ||
      selectedOutfit.shoes?.id === product.id ||
      selectedOutfit.bag?.id === product.id
    );
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans select-none overflow-x-hidden bg-[#111318] text-[#F5F5F7]">
      {/* Header */}
      <Navbar 
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenSaved={() => setSavedModalOpen(true)}
        savedCount={savedOutfits.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#191C22]/95 border border-[#A78BFA]/40 text-white text-xs font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN 3-COLUMN STUDIO LAYOUT */}
      <main className="relative z-20 flex-1 px-4 lg:px-7 pb-8 pt-2 max-w-[1720px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: 01 — Choose Your Style (Span 3) */}
        {/* ========================================================= */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="dark-glass-panel rounded-3xl p-5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            {/* Section Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#A78BFA] text-[#111318] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                1
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-white leading-tight">
                  Choose Your Style
                </h2>
                <p className="text-[11.5px] text-[#A8ADB8] mt-0.5">
                  Pick an item from our curated minimal wardrobe
                </p>
              </div>
            </div>

            {/* Category Pill List */}
            <div className="flex flex-col gap-1.5 mb-5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#A78BFA] text-[#111318] shadow-[0_4px_16px_rgba(167,139,250,0.35)] font-bold' 
                        : 'bg-white/5 text-[#A8ADB8] hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#111318]' : 'text-[#A78BFA]'}>
                        {cat.icon}
                      </span>
                      <span>{cat.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#111318]' : 'text-[#A8ADB8]/50'}`} />
                  </button>
                );
              })}
            </div>

            {/* Compact 3-Column Product Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {catalogLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                ))
              ) : (
                filteredCatalog.map((product) => {
                  const isSelected = isProductSelected(product);
                  const isFav = wishlist.some(w => w.id === product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => selectGarment(product)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer p-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'bg-white/15 border-2 border-[#A78BFA] shadow-[0_0_18px_rgba(167,139,250,0.45)] scale-[1.02]' 
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:shadow-lg'
                      }`}
                      title={`${product.name} — ${product.price}`}
                    >
                      <img 
                        src={`/catalog/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Heart Wishlist Icon */}
                      <button
                        onClick={(e) => toggleWishlist(product, e)}
                        className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isFav 
                            ? 'bg-[#A78BFA] text-[#111318]' 
                            : 'bg-black/60 text-white/70 hover:text-white opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Heart className="w-3 h-3 fill-current" />
                      </button>

                      {/* Tooltip on hover with name & price */}
                      <div className="absolute inset-x-1 bottom-1 bg-[#111318]/90 backdrop-blur-xs text-white text-[9.5px] px-1.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity truncate text-center border border-white/10">
                        {product.name}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Info Pill */}
            <div className="mt-4 pt-2">
              <div className="w-full py-2 px-3 rounded-full text-[10.5px] text-[#A8ADB8] bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 text-center">
                <span>Minimalist Curated Collection (17 items)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CENTER COLUMN: Realistic Virtual Mannequin Display (Span 5) */}
        {/* ========================================================= */}
        <section className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full relative flex flex-col items-center">
            
            {/* Dedicated Realistic OutfitPreview Component (Part 1, 4 & 5) */}
            <OutfitPreview
              selectedOutfit={selectedOutfit}
              onRemoveItem={handleRemoveItem}
              onApplyPreset={applyPreset}
              catalogProducts={catalogProducts}
            />

            {/* Below Mannequin: Curated Look Switcher & Outfit Controls */}
            <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-[440px]">
              
              {/* Curated Looks Selector Strip */}
              <div className="flex items-center justify-between w-full px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                <button 
                  onClick={handlePrevLook}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#A8ADB8] hover:text-white flex items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <div className="text-center">
                  <span className="text-xs font-bold text-[#A78BFA] tracking-wide">
                    Curated Look {activeLookIndex + 1}/7
                  </span>
                  <p className="text-[10px] text-[#A8ADB8]">
                    {PREDEFINED_OUTFITS[activeLookIndex]?.name}
                  </p>
                </div>

                <button 
                  onClick={handleNextLook}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#A8ADB8] hover:text-white flex items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons: Save Outfit and Reset Outfit */}
              <div className="flex items-center gap-2.5 w-full">
                <button
                  onClick={handleSaveOutfit}
                  className="flex-1 py-2.5 rounded-full text-xs font-bold tracking-wide bg-[#A78BFA] text-[#111318] hover:bg-[#BFA5FB] shadow-[0_6px_20px_rgba(167,139,250,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span>Save Outfit</span>
                </button>

                <button
                  onClick={handleResetOutfit}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#A8ADB8] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Reset outfit to default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 02, 03, 04 Panels (Span 4) */}
        {/* ========================================================= */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          
          {/* --------------------------------------------------------- */}
          {/* SECTION 02: Similar Styles (cv2.compareHist Real Scores) */}
          {/* --------------------------------------------------------- */}
          <div className="dark-glass-panel rounded-3xl p-5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#A78BFA] text-[#111318] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  2
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white leading-tight">
                    Similar Styles
                  </h3>
                  <p className="text-[11px] text-[#A8ADB8] mt-0.5">
                    Explore visually similar {selectedOutfit.top?.category || selectedOutfit.dress?.category || 'tops'} using Computer Vision
                  </p>
                </div>
              </div>
            </div>

            {/* Horizontal Product Cards Row */}
            <div className="grid grid-cols-4 gap-2">
              {similarStyles.slice(0, 4).map((sim) => {
                const isFav = wishlist.some(w => w.id === sim.id);
                const isSelected = isProductSelected(sim);
                const matchVal = Math.round(sim.similarity_score || (sim.match_percentage ? sim.match_percentage : 85));

                return (
                  <div
                    key={sim.id}
                    onClick={() => selectGarment(sim)}
                    className={`group relative rounded-2xl p-1.5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/15 border-2 border-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.4)]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#A78BFA]/30'
                    }`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-1.5">
                      <img 
                        src={`/catalog/${sim.image}`} 
                        alt={sim.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={(e) => toggleWishlist(sim, e)}
                        className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isFav ? 'bg-[#A78BFA] text-[#111318]' : 'bg-black/60 text-white/70 hover:text-white'
                        }`}
                      >
                        <Heart className="w-2.5 h-2.5 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-semibold text-white leading-snug line-clamp-2">
                        {sim.name}
                      </h4>
                      <p className="text-[9.5px] font-medium text-[#A8ADB8] mt-0.5">
                        {sim.price}
                      </p>
                    </div>

                    {/* OpenCV Correlation % Match Badge */}
                    <div className="mt-1.5 pt-1 border-t border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {matchVal}% match
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------------- */}
          {/* SECTION 03: Complete the Look (Color Harmony Rules) */}
          {/* --------------------------------------------------------- */}
          <div className="dark-glass-panel rounded-3xl p-5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#A78BFA] text-[#111318] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  3
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white leading-tight">
                    Complete the Look
                  </h3>
                  <p className="text-[11px] text-[#A8ADB8] mt-0.5">
                    Recommended items based on colour harmony
                  </p>
                </div>
              </div>
            </div>

            {/* Category Sub-tabs: Bottoms, Shoes, Bags */}
            <div className="flex items-center gap-1.5 mb-3 bg-white/5 p-1 rounded-full border border-white/10">
              {[
                { id: 'bottoms', label: 'Bottoms' },
                { id: 'shoes', label: 'Shoes' },
                { id: 'bags', label: 'Bags' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1 px-2 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer text-center ${
                      isActive
                        ? 'bg-[#A78BFA] text-[#111318] font-bold shadow-xs'
                        : 'text-[#A8ADB8] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Horizontally Scrollable Complementary Items Row */}
            <div className="flex gap-2.5 overflow-x-auto pb-1.5">
              {(complementaryPieces[activeTab] || complementaryPieces.bottoms || []).slice(0, 5).map((item) => {
                const isFav = wishlist.some(w => w.id === item.id);
                const isEquipped = isProductSelected(item);

                return (
                  <div
                    key={item.id}
                    onClick={() => selectGarment(item)}
                    className={`flex-shrink-0 w-24 p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isEquipped 
                        ? 'bg-white/15 border-2 border-[#A78BFA] shadow-xs' 
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#A78BFA]/30'
                    }`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-1">
                      <img 
                        src={`/catalog/${item.image}`} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => toggleWishlist(item, e)}
                        className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isFav ? 'bg-[#A78BFA] text-[#111318]' : 'bg-black/60 text-white/70 hover:text-white'
                        }`}
                      >
                        <Heart className="w-2.5 h-2.5 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[9.5px] font-semibold text-white leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[9px] font-medium text-[#A8ADB8] mt-0.5">
                        {item.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------------- */}
          {/* SECTION 04: Find Similar Online (Myntra, AJIO, H&M, ZARA) */}
          {/* --------------------------------------------------------- */}
          <div className="dark-glass-panel rounded-3xl p-5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#A78BFA] text-[#111318] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                4
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-serif font-bold text-white leading-tight">
                    Find Similar Online
                  </h3>
                  <Info className="w-3.5 h-3.5 text-[#A78BFA]" />
                </div>
                <p className="text-[11px] text-[#A8ADB8] mt-0.5">
                  Explore more styles from top fashion websites
                </p>
              </div>
            </div>

            {/* 4 Branded Retailer Cards */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Myntra', badgeColor: '#FF3F6C', label: 'Myntra' },
                { name: 'AJIO', badgeColor: '#2C4152', label: 'AJIO' },
                { name: 'H&M', badgeColor: '#E50010', label: 'H&M' },
                { name: 'ZARA', badgeColor: '#FFFFFF', label: 'ZARA' },
              ].map((retailer) => (
                <div 
                  key={retailer.name}
                  className="bg-white/5 hover:bg-white/10 rounded-2xl p-2.5 border border-white/10 hover:border-[#A78BFA]/30 transition-all flex flex-col items-center justify-between text-center gap-2"
                >
                  <div className="h-7 flex items-center justify-center">
                    <span 
                      className="text-xs font-serif font-extrabold tracking-wider"
                      style={{ color: retailer.badgeColor }}
                    >
                      {retailer.label}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRetailerSearch(retailer.name)}
                    className="w-full py-1.5 px-1 rounded-full text-[9px] font-bold text-white bg-white/10 hover:bg-[#A78BFA] hover:text-[#111318] border border-white/10 transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                  >
                    <span>Search</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                  </button>
                </div>
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
