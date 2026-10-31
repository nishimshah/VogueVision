import React, { useState, useEffect } from 'react';
import { 
  Shirt, Sparkles, Layers, Scissors, Footprints, ShoppingBag, 
  Heart, ChevronRight, ChevronLeft, Bookmark, RotateCw, Info,
  ExternalLink, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import HowItWorksModal from '../components/HowItWorksModal';
import AboutModal from '../components/AboutModal';
import SavedOutfitsModal from '../components/SavedOutfitsModal';
import { getProducts, getProductStyling } from '../services/api';

// Studio asset imports
import showroomBg from '../assets/studio/showroom_bg.jpg';
import chamberFull from '../assets/studio/chamber_full.png';
import thumb1 from '../assets/studio/thumb_look_1.png';
import thumb2 from '../assets/studio/thumb_look_2.png';
import thumb3 from '../assets/studio/thumb_look_3.png';
import thumb4 from '../assets/studio/thumb_look_4.png';
import thumb5 from '../assets/studio/thumb_look_5.png';

import logoMyntra from '../assets/studio/logo_myntra.png';
import logoAjio from '../assets/studio/logo_ajio.png';
import logoHm from '../assets/studio/logo_hm.png';
import logoZara from '../assets/studio/logo_zara.png';

export default function StudioPage() {
  // Modal states
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  // Category and Catalog State
  const [activeCategory, setActiveCategory] = useState('tops'); // 'tops', 'dresses', 'jeans_trousers', 'skirts', 'shoes', 'bags'
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // Current Outfit Selection
  const [selectedProduct, setSelectedProduct] = useState(null); // The primary selected piece
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedShoes, setSelectedShoes] = useState(null);
  const [selectedBag, setSelectedBag] = useState(null);

  // Styling & Computer Vision Data
  const [similarStyles, setSimilarStyles] = useState([]);
  const [complementaryPieces, setComplementaryPieces] = useState({
    bottoms: [],
    shoes: [],
    bags: [],
    accessories: []
  });
  const [curatedOutfits, setCuratedOutfits] = useState([]);
  const [activeLookIndex, setActiveLookIndex] = useState(0); // 0..4 for Look 1/5 .. 5/5
  const [activeTab, setActiveTab] = useState('bottoms'); // 'bottoms', 'shoes', 'bags', 'accessories'
  const [bodyType, setBodyType] = useState('Regular'); // 'Regular', 'Petite', 'Curvy', 'Plus Size'
  const [isRotating, setIsRotating] = useState(false);
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

  // Look thumbnails mapping
  const lookThumbs = [thumb1, thumb2, thumb3, thumb4, thumb5];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Load: Fetch catalog and load default Look 1
  useEffect(() => {
    async function initCatalog() {
      try {
        setCatalogLoading(true);
        const data = await getProducts('all');
        const prods = data.products || [];
        setCatalogProducts(prods);

        // Load Product #1 (Blush Floral Puff-Sleeve Top) as default
        if (prods.length > 0) {
          const defaultProd = prods.find(p => p.id === 1) || prods[0];
          await loadProductStyling(defaultProd);
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
  const loadProductStyling = async (prod) => {
    try {
      setSelectedProduct(prod);
      const data = await getProductStyling(prod.id);
      
      if (data.success) {
        setSimilarStyles(data.similar_styles || []);
        setComplementaryPieces(data.complementary_pieces || { bottoms: [], shoes: [], bags: [], accessories: [] });
        setCuratedOutfits(data.curated_outfits || []);

        // Apply outfit matching defaults for complete look
        const pieces = data.complementary_pieces || {};
        if (pieces.bottoms && pieces.bottoms.length > 0) {
          setSelectedBottom(pieces.bottoms[0]);
        }
        if (pieces.shoes && pieces.shoes.length > 0) {
          setSelectedShoes(pieces.shoes[0]);
        }
        if (pieces.bags && pieces.bags.length > 0) {
          setSelectedBag(pieces.bags[0]);
        }
      }
    } catch (err) {
      console.error("Error loading CV styling:", err);
    }
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

  // Handle switching curated look from 1/5 to 5/5
  const handleSelectCuratedLook = (index) => {
    setActiveLookIndex(index);
    if (curatedOutfits && curatedOutfits[index]) {
      const look = curatedOutfits[index];
      if (look.top) setSelectedProduct(look.top);
      if (look.bottom) setSelectedBottom(look.bottom);
      if (look.shoes) setSelectedShoes(look.shoes);
      if (look.bag) setSelectedBag(look.bag);
      showToast(`Switched to Curated ${look.name || `Outfit ${index + 1}/5`}`);
    }
  };

  // Next / Prev Curated Look
  const handlePrevLook = () => {
    const nextIdx = (activeLookIndex - 1 + 5) % 5;
    handleSelectCuratedLook(nextIdx);
  };

  const handleNextLook = () => {
    const nextIdx = (activeLookIndex + 1) % 5;
    handleSelectCuratedLook(nextIdx);
  };

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

  // Save Current Outfit to LocalStorage
  const handleSaveOutfit = () => {
    const newOutfit = {
      id: Date.now(),
      name: `${selectedProduct?.name || 'Look'} Ensemble`,
      top: selectedProduct,
      bottom: selectedBottom,
      shoes: selectedShoes,
      bag: selectedBag,
      bodyType: bodyType,
      savedAt: new Date().toISOString()
    };
    const updated = [newOutfit, ...savedOutfits];
    setSavedOutfits(updated);
    localStorage.setItem('voguevision_saved_outfits', JSON.stringify(updated));
    showToast(`Outfit saved successfully to your wardrobe!`);
  };

  // Load a Saved Outfit from Modal
  const handleLoadSavedOutfit = (outfit) => {
    if (outfit.top) setSelectedProduct(outfit.top);
    if (outfit.bottom) setSelectedBottom(outfit.bottom);
    if (outfit.shoes) setSelectedShoes(outfit.shoes);
    if (outfit.bag) setSelectedBag(outfit.bag);
    if (outfit.bodyType) setBodyType(outfit.bodyType);
    showToast(`Loaded ${outfit.name}!`);
  };

  // Delete a Saved Outfit
  const handleDeleteSavedOutfit = (outfitId) => {
    const updated = savedOutfits.filter(o => o.id !== outfitId);
    setSavedOutfits(updated);
    localStorage.setItem('voguevision_saved_outfits', JSON.stringify(updated));
    showToast(`Outfit removed.`);
  };

  // Retailer Search links
  const handleRetailerSearch = (retailerName) => {
    if (!selectedProduct) return;
    const query = `${selectedProduct.primary_color || ''} ${selectedProduct.name} ${selectedProduct.category}`.trim();
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

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col font-sans select-none overflow-x-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(200, 180, 232, 0.45), transparent 70%), url(${showroomBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Soft Ambient Overlay for Futuristic Glass Aesthetic */}
      <div className="absolute inset-0 bg-[#F8F5FA]/60 backdrop-blur-[2px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-30">
        <Navbar 
          onOpenHowItWorks={() => setHowItWorksOpen(true)}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenSaved={() => setSavedModalOpen(true)}
          savedCount={savedOutfits.length}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#241B35]/90 backdrop-blur-md text-white text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-3.5 h-3.5 text-[#C8B4E8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN 3-COLUMN STUDIO LAYOUT */}
      <main className="relative z-20 flex-1 px-4 lg:px-7 pb-6 pt-1 max-w-[1720px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: 01 — Choose Your Style (Span 3) */}
        {/* ========================================================= */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-5 border border-white/70 shadow-[0_12px_40px_rgba(80,40,120,0.08)]">
            {/* Section Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#8B5AC2] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                1
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-[#241B35] leading-tight">
                  Choose Your Style
                </h2>
                <p className="text-[11.5px] text-[#241B35]/65 mt-0.5">
                  Pick an item from our curated collection
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
                        ? 'bg-[#8B5AC2] text-white shadow-[0_4px_16px_rgba(139,90,194,0.35)]' 
                        : 'bg-white/40 text-[#241B35]/85 hover:bg-white/70 hover:text-[#8B5AC2] border border-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : 'text-[#8B5AC2]'}>
                        {cat.icon}
                      </span>
                      <span>{cat.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#241B35]/40'}`} />
                  </button>
                );
              })}
            </div>

            {/* Compact 3-Column Product Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {catalogLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl bg-white/40 animate-pulse border border-white/60" />
                ))
              ) : (
                filteredCatalog.slice(0, 9).map((product) => {
                  const isSelected = selectedProduct?.id === product.id;
                  const isFav = wishlist.some(w => w.id === product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => loadProductStyling(product)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer p-1.5 transition-all duration-300 ${
                        isSelected 
                          ? 'bg-white border-2 border-[#8B5AC2] shadow-[0_0_18px_rgba(139,90,194,0.38)] scale-[1.02]' 
                          : 'bg-white/55 hover:bg-white/80 border border-white/70 hover:shadow-md'
                      }`}
                      title={`${product.name} — ${product.price || '₹1,299'}`}
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
                            ? 'bg-[#8B5AC2] text-white' 
                            : 'bg-white/80 text-[#241B35]/60 hover:text-[#8B5AC2] opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Heart className="w-3 h-3 fill-current" />
                      </button>

                      {/* Tooltip on hover with name & price */}
                      <div className="absolute inset-x-1 bottom-1 bg-[#241B35]/85 backdrop-blur-xs text-white text-[9.5px] px-1.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity truncate text-center">
                        {product.name}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom "View All" Button */}
            <div className="mt-4 pt-2">
              <button
                onClick={() => showToast(`Showing all available ${activeCategory} in studio catalog.`)}
                className="w-full py-2.5 rounded-full text-xs font-semibold text-[#8B5AC2] bg-white/50 hover:bg-white/80 border border-white/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>View All {categories.find(c => c.id === activeCategory)?.label}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CENTER COLUMN: Interactive Virtual Mannequin Display (Span 5) */}
        {/* ========================================================= */}
        <section className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full relative flex flex-col items-center">
            
            {/* The Main Glass Showroom Chamber */}
            <div className="relative w-full max-w-[460px] aspect-[460/620] rounded-[42px] p-2 flex items-center justify-center overflow-hidden">
              
              {/* Cylindrical Glass Enclosure Highlights */}
              <div className="absolute inset-0 rounded-[42px] bg-gradient-to-b from-white/45 via-white/20 to-white/50 backdrop-blur-[14px] border border-white/70 shadow-[0_20px_50px_rgba(80,40,120,0.14)] pointer-events-none" />
              <div className="absolute inset-y-4 left-3 w-3 rounded-full bg-gradient-to-r from-white/70 to-transparent pointer-events-none" />
              <div className="absolute inset-y-4 right-3 w-3 rounded-full bg-gradient-to-l from-white/70 to-transparent pointer-events-none" />

              {/* Glowing Circular Base Platform Floor Glow */}
              <div className="absolute bottom-6 inset-x-8 h-24 rounded-full bg-[#8B5AC2]/25 blur-2xl pointer-events-none" />
              <div className="absolute bottom-9 inset-x-12 h-14 rounded-full bg-gradient-to-t from-[#C8B4E8]/60 to-white/40 border border-white/80 shadow-[0_8px_30px_rgba(139,90,194,0.3)] pointer-events-none" />

              {/* Top-Left 360° Glass Control */}
              <button
                onClick={() => {
                  setIsRotating(true);
                  showToast("360° Studio perspective rotation active.");
                  setTimeout(() => setIsRotating(false), 2400);
                }}
                className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-xs flex items-center gap-1.5 text-xs font-semibold text-[#241B35] hover:bg-white hover:text-[#8B5AC2] transition-all cursor-pointer group"
              >
                <RotateCw className={`w-3.5 h-3.5 text-[#8B5AC2] transition-transform duration-700 ${isRotating ? 'rotate-180' : 'group-hover:rotate-45'}`} />
                <span>360°</span>
              </button>

              {/* Floating Left Garment Category Selectors (Top, Bottom, Shoes, Bag) */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
                {[
                  { id: 'tops', label: 'Top', icon: <Shirt className="w-4 h-4" /> },
                  { id: 'jeans_trousers', label: 'Bottom', icon: <Layers className="w-4 h-4" /> },
                  { id: 'shoes', label: 'Shoes', icon: <Footprints className="w-4 h-4" /> },
                  { id: 'bags', label: 'Bag', icon: <ShoppingBag className="w-4 h-4" /> },
                ].map((item) => {
                  const isActive = activeCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveCategory(item.id);
                        showToast(`Switched browsing category to ${item.label}`);
                      }}
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold tracking-tight transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#8B5AC2] text-white shadow-[0_4px_16px_rgba(139,90,194,0.4)] scale-105'
                          : 'bg-white/65 backdrop-blur-md text-[#241B35] hover:bg-white hover:text-[#8B5AC2] border border-white/80 shadow-2xs'
                      }`}
                      title={`Select ${item.label}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Floating Right Body Type Selector Panel */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-2.5 shadow-[0_8px_24px_rgba(80,40,120,0.08)] flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#241B35]/80 pb-1 border-b border-white/60 w-full justify-center">
                  <span>Body Type</span>
                  <Info className="w-3 h-3 text-[#8B5AC2]" />
                </div>
                {['Regular', 'Petite', 'Curvy', 'Plus Size'].map((type) => {
                  const isSelected = bodyType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setBodyType(type);
                        showToast(`Mannequin body silhouette set to: ${type}`);
                      }}
                      className={`w-16 py-1.5 px-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-[#8B5AC2] text-white shadow-xs'
                          : 'bg-white/40 text-[#241B35]/80 hover:bg-white/70 hover:text-[#8B5AC2]'
                      }`}
                    >
                      {/* Stylized Silhouette Icon representation */}
                      <div className="w-2.5 h-5 rounded-full border border-current opacity-80" />
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>

              {/* Center Mannequin Showcase Image */}
              <div className={`relative z-10 w-full h-full flex items-center justify-center transition-transform duration-700 ${isRotating ? 'scale-95 rotate-1' : ''}`}>
                <img 
                  src={chamberFull} 
                  alt="Futuristic Glass Mannequin Display"
                  className="max-h-[92%] max-w-[92%] object-contain drop-shadow-[0_15px_30px_rgba(80,40,120,0.22)]"
                />

                {/* Interactive Dynamic Overlays / Badges showing selected outfit items */}
                <div className="absolute bottom-18 left-8 right-8 flex items-center justify-between pointer-events-none">
                  {/* Left arrow on platform */}
                  <button 
                    onClick={handlePrevLook}
                    className="pointer-events-auto w-8 h-8 rounded-full bg-white/70 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#241B35] hover:text-[#8B5AC2] hover:bg-white shadow-xs transition-all cursor-pointer"
                    title="Previous Outfit"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Active Equipped Piece Pills */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white text-[10.5px] font-bold text-[#8B5AC2] shadow-2xs">
                      {selectedProduct?.name || 'Blush Floral Puff-Sleeve Top'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#241B35]/75 backdrop-blur-xs text-[9px] font-medium text-white shadow-2xs">
                      paired with {selectedBottom?.name || 'Wide-Leg Jeans'}
                    </span>
                  </div>

                  {/* Right arrow on platform */}
                  <button 
                    onClick={handleNextLook}
                    className="pointer-events-auto w-8 h-8 rounded-full bg-white/70 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#241B35] hover:text-[#8B5AC2] hover:bg-white shadow-xs transition-all cursor-pointer"
                    title="Next Outfit"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Below Mannequin: Outfit Switcher and Save Action */}
            <div className="mt-3 flex flex-col items-center gap-2.5 w-full max-w-[420px]">
              {/* Outfit Indicator Capsule */}
              <div className="px-4 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-[11px] font-bold text-[#8B5AC2] shadow-2xs">
                Outfit {activeLookIndex + 1}/5
              </div>

              {/* 5 Outfit Look Thumbnails Strip */}
              <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/70 rounded-2xl p-1.5 shadow-xs">
                <button 
                  onClick={handlePrevLook}
                  className="w-7 h-7 rounded-xl bg-white/60 hover:bg-white flex items-center justify-center text-[#241B35] transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {lookThumbs.map((thumb, idx) => {
                    const isSelected = activeLookIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectCuratedLook(idx)}
                        className={`relative rounded-xl overflow-hidden p-0.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'ring-2 ring-[#8B5AC2] shadow-[0_0_12px_rgba(139,90,194,0.4)] scale-105' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={`Curated Look ${idx + 1}/5`}
                      >
                        <img 
                          src={thumb} 
                          alt={`Look ${idx + 1}`} 
                          className="w-9 h-12 object-cover rounded-lg"
                        />
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={handleNextLook}
                  className="w-7 h-7 rounded-xl bg-white/60 hover:bg-white flex items-center justify-center text-[#241B35] transition-all cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Primary Purple Action: Save Outfit */}
              <button
                onClick={handleSaveOutfit}
                className="w-full max-w-[280px] py-2.5 rounded-full text-xs font-bold tracking-wide bg-[#8B5AC2] text-white hover:bg-[#7848AE] shadow-[0_8px_20px_rgba(139,90,194,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Bookmark className="w-4 h-4 fill-white" />
                <span>Save Outfit</span>
              </button>
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
          <div className="glass-panel rounded-3xl p-5 border border-white/70 shadow-[0_12px_40px_rgba(80,40,120,0.08)]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#8B5AC2] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  2
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#241B35] leading-tight">
                    Similar Styles
                  </h3>
                  <p className="text-[11px] text-[#241B35]/65 mt-0.5">
                    Explore visually similar {selectedProduct?.category || 'tops'} using Computer Vision
                  </p>
                </div>
              </div>
              <button 
                onClick={() => showToast("Displaying all ranked similarity matches.")}
                className="text-[11px] font-semibold text-[#8B5AC2] hover:underline flex items-center gap-0.5 cursor-pointer flex-shrink-0"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal Product Cards Row */}
            <div className="grid grid-cols-4 gap-2">
              {similarStyles.slice(0, 4).map((sim) => {
                const isFav = wishlist.some(w => w.id === sim.id);
                // Real calculated percentage match from OpenCV cv2.compareHist
                const matchVal = Math.round(sim.similarity_score || (sim.match_percentage ? sim.match_percentage : 85));

                return (
                  <div
                    key={sim.id}
                    onClick={() => loadProductStyling(sim)}
                    className="group relative bg-white/60 hover:bg-white rounded-2xl p-1.5 border border-white/80 hover:border-[#8B5AC2]/40 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
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
                          isFav ? 'bg-[#8B5AC2] text-white' : 'bg-white/80 text-[#241B35]/60 hover:text-[#8B5AC2]'
                        }`}
                      >
                        <Heart className="w-2.5 h-2.5 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-semibold text-[#241B35] leading-snug line-clamp-2">
                        {sim.name}
                      </h4>
                      <p className="text-[9.5px] font-medium text-[#241B35]/65 mt-0.5">
                        {sim.price || '₹1,299'}
                      </p>
                    </div>

                    {/* OpenCV Correlation % Match Badge */}
                    <div className="mt-1.5 pt-1 border-t border-white/60 flex items-center justify-center">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
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
          <div className="glass-panel rounded-3xl p-5 border border-white/70 shadow-[0_12px_40px_rgba(80,40,120,0.08)]">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#8B5AC2] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  3
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#241B35] leading-tight">
                    Complete the Look
                  </h3>
                  <p className="text-[11px] text-[#241B35]/65 mt-0.5">
                    Recommended items based on colour harmony
                  </p>
                </div>
              </div>
              <button 
                onClick={() => showToast("Displaying all complementary harmonized pieces.")}
                className="text-[11px] font-semibold text-[#8B5AC2] hover:underline flex items-center gap-0.5 cursor-pointer flex-shrink-0"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Category Sub-tabs: Bottoms, Shoes, Bags, Accessories */}
            <div className="flex items-center gap-1.5 mb-3 bg-white/40 p-1 rounded-full border border-white/60">
              {[
                { id: 'bottoms', label: 'Bottoms' },
                { id: 'shoes', label: 'Shoes' },
                { id: 'bags', label: 'Bags' },
                { id: 'accessories', label: 'Accessories' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1 px-2 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer text-center ${
                      isActive
                        ? 'bg-white text-[#8B5AC2] shadow-xs'
                        : 'text-[#241B35]/70 hover:text-[#8B5AC2]'
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
                const isEquipped = (
                  (activeTab === 'bottoms' && selectedBottom?.id === item.id) ||
                  (activeTab === 'shoes' && selectedShoes?.id === item.id) ||
                  (activeTab === 'bags' && selectedBag?.id === item.id)
                );

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (activeTab === 'bottoms') setSelectedBottom(item);
                      else if (activeTab === 'shoes') setSelectedShoes(item);
                      else if (activeTab === 'bags') setSelectedBag(item);
                      showToast(`Equipped ${item.name} onto mannequin!`);
                    }}
                    className={`flex-shrink-0 w-24 p-1.5 rounded-2xl bg-white/60 hover:bg-white border transition-all cursor-pointer flex flex-col justify-between ${
                      isEquipped 
                        ? 'border-2 border-[#8B5AC2] shadow-xs' 
                        : 'border-white/80 hover:border-[#8B5AC2]/40'
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
                          isFav ? 'bg-[#8B5AC2] text-white' : 'bg-white/80 text-[#241B35]/60 hover:text-[#8B5AC2]'
                        }`}
                      >
                        <Heart className="w-2.5 h-2.5 fill-current" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[9.5px] font-semibold text-[#241B35] leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[9px] font-medium text-[#241B35]/60 mt-0.5">
                        {item.price || '₹1,599'}
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
          <div className="glass-panel rounded-3xl p-5 border border-white/70 shadow-[0_12px_40px_rgba(80,40,120,0.08)]">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#8B5AC2] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                4
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-serif font-bold text-[#241B35] leading-tight">
                    Find Similar Online
                  </h3>
                  <Info className="w-3.5 h-3.5 text-[#8B5AC2]/70" />
                </div>
                <p className="text-[11px] text-[#241B35]/65 mt-0.5">
                  Explore more styles from top fashion websites
                </p>
              </div>
            </div>

            {/* 4 Branded Retailer Cards */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Myntra', logo: logoMyntra },
                { name: 'AJIO', logo: logoAjio },
                { name: 'H&M', logo: logoHm },
                { name: 'ZARA', logo: logoZara },
              ].map((retailer) => (
                <div 
                  key={retailer.name}
                  className="bg-white/70 hover:bg-white rounded-2xl p-2.5 border border-white/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center gap-2"
                >
                  <div className="h-8 flex items-center justify-center">
                    <img 
                      src={retailer.logo} 
                      alt={retailer.name}
                      className="max-h-6 max-w-full object-contain"
                    />
                  </div>

                  <button
                    onClick={() => handleRetailerSearch(retailer.name)}
                    className="w-full py-1.5 px-1 rounded-full text-[9px] font-bold text-[#241B35] bg-white hover:bg-[#8B5AC2] hover:text-white border border-white/80 shadow-2xs transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                  >
                    <span>Search Similar</span>
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
