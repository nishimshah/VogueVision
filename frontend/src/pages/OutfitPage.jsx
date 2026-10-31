import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, ArrowRight, Shirt, ShoppingBag, Palette, CheckCircle2, ChevronRight, Sliders } from 'lucide-react';
import { getOutfitRecommendations, getProducts } from '../services/api';
import ProductModal from '../components/ProductModal';

export default function OutfitPage({ currentAnalysis, selectedOutfitLook }) {
  const [catalogItems, setCatalogItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  // Initialize with current analyzed item or default to first catalog top
  useEffect(() => {
    async function init() {
      try {
        const prodData = await getProducts();
        if (prodData && prodData.products) {
          setCatalogItems(prodData.products);

          // If we already have an analyzed item from Explore page
          if (currentAnalysis && currentAnalysis.uploaded_image) {
            const initialItem = {
              id: 'uploaded',
              name: 'Analyzed Clothing Piece',
              category: currentAnalysis.uploaded_image.detected_category || 'tops',
              primary_color: currentAnalysis.uploaded_image.primary_color || 'pink',
              imageUrl: currentAnalysis.uploaded_image.url,
              dominant_colors: currentAnalysis.dominant_colors || []
            };
            setSelectedItem(initialItem);
            loadOutfit(initialItem);
          } else {
            // Default to first pink floral top
            const defaultItem = prodData.products[0];
            setSelectedItem(defaultItem);
            loadOutfit(defaultItem);
          }
        }
      } catch (err) {
        console.error('Failed to initialize outfit page', err);
      }
    }
    init();
  }, [currentAnalysis]);

  const loadOutfit = async (item) => {
    setLoading(true);
    try {
      const data = await getOutfitRecommendations(
        item.id === 'uploaded' ? undefined : item.id,
        item.category,
        item.primary_color
      );
      if (data && data.success) {
        setRecommendations(data);
      }
    } catch (err) {
      console.error('Error fetching outfit recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    loadOutfit(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-widest bg-[#EDE3F4] px-3.5 py-1.5 rounded-full inline-block">
          Fashion Styling Studio
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#211827]">
          Complete Your Look
        </h1>
        <p className="text-sm sm:text-base text-[#211827]/70 font-normal">
          Harmonious, color-coordinated outfits curated from our catalog using fashion color theory rules.
        </p>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Selected Clothing Item & Dominant Color Palette */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#EDE3F4] fashion-card-shadow space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7950A3]">
                Selected Item
              </span>
              <span className="text-xs text-[#211827]/50 capitalize">
                {selectedItem?.category || 'Tops'}
              </span>
            </div>

            {/* Main Item Image */}
            <div className="aspect-3/4 rounded-2xl overflow-hidden bg-[#FAF8F7] relative border border-[#EDE3F4]">
              <img
                src={selectedItem?.imageUrl || `/catalog/${selectedItem?.image}`}
                alt={selectedItem?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/samples/sample_pink_floral_top.jpg';
                }}
              />
              {selectedItem?.price && (
                <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#211827]">
                  {selectedItem.price}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-serif text-xl font-semibold text-[#211827]">
                {selectedItem?.name || 'Selected Piece'}
              </h3>
              <p className="text-xs text-[#211827]/60 mt-1">
                {selectedItem?.description || 'Main focal piece used to derive complementary silhouettes and color tones.'}
              </p>
            </div>

            {/* Dominant Color Palette */}
            <div className="pt-4 border-t border-[#EDE3F4] space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#211827]/70 block">
                Dominant Color Palette
              </span>
              <div className="flex items-center gap-2">
                {selectedItem?.dominant_colors && selectedItem.dominant_colors.length > 0 ? (
                  selectedItem.dominant_colors.map((c, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.hex} (${c.percentage || ''}%)`}
                      />
                      <span className="text-[9px] font-mono text-[#211827]/60 mt-1">
                        {c.hex}
                      </span>
                    </div>
                  ))
                ) : (
                  ['#E8B5C4', '#F5EEF5', '#7950A3', '#211827'].map((hex, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                  ))
                )}
              </div>
            </div>

            {/* Switch Item Picker */}
            <div className="pt-4 border-t border-[#EDE3F4] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#211827]/70 block">
                Or Pick Another Catalog Piece:
              </span>
              <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                {catalogItems.slice(0, 8).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectItem(p)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedItem?.id === p.id ? 'border-[#7950A3] ring-2 ring-[#EDE3F4]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Complementary Pieces by Category */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Group 1: Bottoms */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE3F4] fashion-card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7950A3]" />
                <h3 className="font-serif text-lg font-semibold text-[#211827]">
                  Complementary Bottoms
                </h3>
              </div>
              <span className="text-xs text-[#7950A3] font-medium">Jeans, Trousers & Skirts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations?.complementary_pieces?.bottoms?.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setModalProduct(prod)}
                  className="group cursor-pointer p-2.5 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] hover:border-[#7950A3] transition-all"
                >
                  <div className="aspect-3/4 rounded-xl overflow-hidden bg-[#F5EEF5] mb-2">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="text-xs font-serif font-semibold text-[#211827] truncate">{prod.name}</h4>
                  <div className="flex justify-between items-center text-[11px] text-[#7950A3] mt-0.5">
                    <span>{prod.price}</span>
                    <span className="text-[#211827]/50 capitalize">{prod.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: Shoes */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE3F4] fashion-card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8B5C4]" />
                <h3 className="font-serif text-lg font-semibold text-[#211827]">
                  Complementary Footwear
                </h3>
              </div>
              <span className="text-xs text-[#7950A3] font-medium">Sneakers, Heels & Slides</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations?.complementary_pieces?.shoes?.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setModalProduct(prod)}
                  className="group cursor-pointer p-2.5 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] hover:border-[#7950A3] transition-all"
                >
                  <div className="aspect-3/4 rounded-xl overflow-hidden bg-[#F5EEF5] mb-2">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="text-xs font-serif font-semibold text-[#211827] truncate">{prod.name}</h4>
                  <div className="flex justify-between items-center text-[11px] text-[#7950A3] mt-0.5">
                    <span>{prod.price}</span>
                    <span className="text-[#211827]/50 capitalize">{prod.subCategory || 'Shoes'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: Accessories & Handbags */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE3F4] fashion-card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7950A3]" />
                <h3 className="font-serif text-lg font-semibold text-[#211827]">
                  Complementary Handbags & Bags
                </h3>
              </div>
              <span className="text-xs text-[#7950A3] font-medium">Bags & Totes</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations?.complementary_pieces?.accessories?.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setModalProduct(prod)}
                  className="group cursor-pointer p-2.5 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] hover:border-[#7950A3] transition-all"
                >
                  <div className="aspect-3/4 rounded-xl overflow-hidden bg-[#F5EEF5] mb-2">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="text-xs font-serif font-semibold text-[#211827] truncate">{prod.name}</h4>
                  <div className="flex justify-between items-center text-[11px] text-[#7950A3] mt-0.5">
                    <span>{prod.price}</span>
                    <span className="text-[#211827]/50 capitalize">{prod.subCategory || 'Bag'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CURATED OUTFIT COMBINATIONS SECTION (Section 10 Requirement) */}
      <section className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-widest bg-[#EDE3F4] px-3.5 py-1.5 rounded-full inline-block">
            Styled Ensembles
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#211827]">
            Curated Outfit Combinations
          </h2>
          <p className="text-sm text-[#211827]/70 max-w-xl mx-auto">
            Complete head-to-toe fashion combinations matching the selected piece with verified catalog items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations?.curated_outfits?.map((outfit) => (
            <div
              key={outfit.id}
              className="bg-white rounded-3xl p-6 border border-[#EDE3F4] fashion-card-shadow fashion-card-hover flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#7950A3] uppercase tracking-wider">
                    {outfit.style}
                  </span>
                  <div className="flex items-center gap-1">
                    {outfit.palette?.map((hex, idx) => (
                      <div
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#211827]">
                  {outfit.title}
                </h3>
                <p className="text-xs text-[#211827]/70 leading-relaxed">
                  {outfit.description}
                </p>

                {/* Composite Ensemble Preview Grid */}
                <div className="pt-2 grid grid-cols-2 gap-2.5">
                  {/* Item 1: Main piece */}
                  <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-[#FAF8F7] border border-[#EDE3F4]">
                    <img
                      src={selectedItem?.imageUrl || outfit.main_item?.imageUrl}
                      alt="Main piece"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      Main Piece
                    </span>
                  </div>

                  {/* Item 2: Bottom */}
                  {outfit.bottom && (
                    <div 
                      onClick={() => setModalProduct(outfit.bottom)}
                      className="relative cursor-pointer aspect-3/4 rounded-xl overflow-hidden bg-[#FAF8F7] border border-[#EDE3F4] hover:border-[#7950A3]"
                    >
                      <img
                        src={outfit.bottom.imageUrl}
                        alt={outfit.bottom.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                        Bottom
                      </span>
                    </div>
                  )}

                  {/* Item 3: Shoes */}
                  {outfit.shoes && (
                    <div 
                      onClick={() => setModalProduct(outfit.shoes)}
                      className="relative cursor-pointer aspect-3/4 rounded-xl overflow-hidden bg-[#FAF8F7] border border-[#EDE3F4] hover:border-[#7950A3]"
                    >
                      <img
                        src={outfit.shoes.imageUrl}
                        alt={outfit.shoes.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                        Shoes
                      </span>
                    </div>
                  )}

                  {/* Item 4: Accessory */}
                  {outfit.accessory && (
                    <div 
                      onClick={() => setModalProduct(outfit.accessory)}
                      className="relative cursor-pointer aspect-3/4 rounded-xl overflow-hidden bg-[#FAF8F7] border border-[#EDE3F4] hover:border-[#7950A3]"
                    >
                      <img
                        src={outfit.accessory.imageUrl}
                        alt={outfit.accessory.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                        Accessory
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Outfit details button */}
              <div className="pt-2">
                <button
                  onClick={() => setModalProduct(outfit.bottom || outfit.shoes)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-medium text-[#7950A3] bg-[#F5EEF5] hover:bg-[#EDE3F4] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect Ensemble Pieces</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for item inspection */}
      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
      />

    </div>
  );
}
