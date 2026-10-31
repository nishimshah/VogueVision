import React from 'react';
import { X, Sparkles, Tag, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductModal({ product, onClose, onSelectForOutfit }) {
  const navigate = useNavigate();

  if (!product) return null;

  const handleCoordinate = () => {
    if (onSelectForOutfit) {
      onSelectForOutfit(product);
    }
    onClose();
    navigate('/outfits');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#FAF8F7] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EDE3F4] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE3F4] bg-[#F5EEF5]/40">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#7950A3] bg-[#EDE3F4] px-2.5 py-1 rounded-full">
              {product.category || 'Fashion Item'}
            </span>
            {product.similarity_score && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {product.similarity_score}% Match
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#211827]/60 hover:text-[#211827] hover:bg-[#EDE3F4]/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-[#F5EEF5] aspect-3/4 shadow-sm border border-[#EDE3F4]">
            <img
              src={product.imageUrl || `/catalog/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/samples/sample_pink_floral_top.jpg';
              }}
            />
            {product.price && (
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold text-[#211827] shadow-sm">
                {product.price}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-serif text-[#211827] leading-snug">
                {product.name}
              </h3>
              <p className="text-xs text-[#7950A3] font-medium uppercase tracking-wider mt-1">
                {product.subCategory || product.category}
              </p>
            </div>

            <p className="text-sm text-[#211827]/70 leading-relaxed">
              {product.description || 'Curated fashion piece with distinct color distribution analyzed via OpenCV HSV histogram matching.'}
            </p>

            {/* Dominant color swatches if present */}
            {product.dominant_colors && product.dominant_colors.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-[#211827]/70 block mb-2">
                  Extracted Dominant Colors (K-Means)
                </span>
                <div className="flex items-center gap-2">
                  {product.dominant_colors.map((c, i) => (
                    <div
                      key={i}
                      className="group relative flex flex-col items-center"
                    >
                      <div
                        className="w-7 h-7 rounded-full border border-black/10 shadow-xs transition-transform group-hover:scale-110"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.hex} (${c.percentage}%)`}
                      />
                      <span className="text-[10px] text-[#211827]/60 mt-1 font-mono">
                        {c.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Computer Vision Metrics */}
            {product.raw_correlation !== undefined && (
              <div className="p-3 rounded-xl bg-[#F5EEF5]/70 border border-[#EDE3F4] text-xs space-y-1">
                <div className="flex justify-between text-[#211827]/80">
                  <span>Histogram Correlation (r):</span>
                  <span className="font-mono font-medium">{product.raw_correlation}</span>
                </div>
                <div className="flex justify-between text-[#211827]/80">
                  <span>Histogram Intersection:</span>
                  <span className="font-mono font-medium">{product.intersection}</span>
                </div>
                <div className="flex justify-between text-[#7950A3] font-medium pt-1 border-t border-[#EDE3F4]">
                  <span>Normalized Similarity:</span>
                  <span>{product.similarity_score}%</span>
                </div>
              </div>
            )}

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={handleCoordinate}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#7950A3] to-[#9165BF] hover:from-[#6A4392] hover:to-[#7950A3] shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-[#EDE3F4]" />
                <span>Coordinate Complete Outfit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
