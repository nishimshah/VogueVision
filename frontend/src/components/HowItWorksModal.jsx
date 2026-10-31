import React from 'react';
import { X, Layers, Cpu, Palette, Sliders, CheckCircle2 } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      num: "01",
      icon: <Layers className="w-4 h-4 text-[#B49AF4]" />,
      title: "Color Space Conversion & 3D HSV Representation",
      description: "Fashion images are loaded and converted from BGR to the HSV (Hue, Saturation, Value) color cylinder. Unlike RGB where brightness corrupts chrominance, HSV decouples pure chromatic tone (Hue) from lighting variations and shadows."
    },
    {
      num: "02",
      icon: <Cpu className="w-4 h-4 text-[#B49AF4]" />,
      title: "512-Dimensional Color Histogram Extraction",
      description: "We compute a multi-dimensional histogram using cv2.calcHist with 8 bins each across Hue, Saturation, and Value (8 × 8 × 8 = 512 bins). The histogram is normalized (L1/L2) so that variations in image resolution do not bias color distribution."
    },
    {
      num: "03",
      icon: <Sliders className="w-4 h-4 text-[#B49AF4]" />,
      title: "Correlation Metric (cv2.compareHist)",
      description: "Similarity between catalog garments is calculated using Pearson correlation (HISTCMP_CORREL). This produces a genuine mathematical similarity score in [-1.0, +1.0], normalized to an intuitive percentage match without generative AI hallucinations."
    },
    {
      num: "04",
      icon: <Palette className="w-4 h-4 text-[#B49AF4]" />,
      title: "K-Means Dominant Color Extraction",
      description: "Garment pixels are clustered using cv2.kmeans with k=4. Cluster centers reveal primary and secondary color palettes, filtering out studio background illumination and identifying true garment tones."
    },
    {
      num: "05",
      icon: <CheckCircle2 className="w-4 h-4 text-[#B49AF4]" />,
      title: "Color Harmony Outfit Coordination",
      description: "Complementary, analogous, and monochromatic color harmony matrices match the selected piece with trousers, skirts, footwear, and bags. High-harmony candidates are automatically ranked and rendered in the virtual glass studio."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#211E2B]/95 backdrop-blur-2xl border border-white/[0.16] rounded-3xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-y-auto text-[#F5F1F8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center text-[#F5F1F8] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49AF4]">
            Computer Vision Architecture
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#F5F1F8] mt-0.5">
            How VogueVision Works
          </h2>
          <p className="text-xs text-[#AAA5B5] mt-1">
            Genuine OpenCV image processing pipelines without cloud black-box generative models.
          </p>
        </div>

        {/* Algorithm Steps */}
        <div className="space-y-3">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#B49AF4]/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs font-mono font-bold text-[#B49AF4] px-2 py-0.5 rounded-full bg-[#B49AF4]/10 border border-[#B49AF4]/20">
                  {s.num}
                </span>
                <div className="p-1.5 rounded-lg bg-white/[0.05]">
                  {s.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#F5F1F8]">
                  {s.title}
                </h3>
              </div>
              <p className="text-xs text-[#AAA5B5] leading-relaxed pl-10">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.10] flex items-center justify-between">
          <span className="text-[11px] text-[#AAA5B5]">
            OpenCV 4.10.0 • Python Flask • Vite React
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold glass-btn-primary cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
