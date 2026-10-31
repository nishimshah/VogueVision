import React from 'react';
import { X, Layers, Cpu, Palette, Sliders, CheckCircle2 } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      num: "01",
      icon: <Layers className="w-4 h-4 text-[#9271BF]" />,
      title: "Color Space Conversion & 3D HSV Representation",
      description: "Fashion images are loaded and converted from BGR to the HSV (Hue, Saturation, Value) color cylinder. Unlike RGB where brightness corrupts chrominance, HSV decouples pure chromatic tone (Hue) from lighting variations and shadows."
    },
    {
      num: "02",
      icon: <Cpu className="w-4 h-4 text-[#9271BF]" />,
      title: "512-Dimensional Color Histogram Extraction",
      description: "We compute a multi-dimensional histogram using cv2.calcHist with 8 bins each across Hue, Saturation, and Value (8 × 8 × 8 = 512 bins). The histogram is normalized (L1/L2) so that variations in image resolution do not bias color distribution."
    },
    {
      num: "03",
      icon: <Sliders className="w-4 h-4 text-[#9271BF]" />,
      title: "Correlation Metric (cv2.compareHist)",
      description: "Similarity between catalog garments is calculated using Pearson correlation (HISTCMP_CORREL). This produces a genuine mathematical similarity score in [-1.0, +1.0], normalized to an intuitive percentage match without generative AI hallucinations."
    },
    {
      num: "04",
      icon: <Palette className="w-4 h-4 text-[#9271BF]" />,
      title: "K-Means Dominant Color Extraction",
      description: "Garment pixels are clustered using cv2.kmeans with k=4. Cluster centers reveal primary and secondary color palettes, filtering out studio background illumination and identifying true garment tones."
    },
    {
      num: "05",
      icon: <CheckCircle2 className="w-4 h-4 text-[#9271BF]" />,
      title: "Color Harmony Outfit Coordination",
      description: "Complementary, analogous, and monochromatic color harmony matrices match the selected piece with trousers, skirts, footwear, and bags. High-harmony candidates are automatically ranked and rendered in the virtual glass studio."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292331]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_20px_50px_rgba(41,35,49,0.18)] max-h-[90vh] overflow-y-auto text-[#292331]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#292331] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9271BF]">
            Computer Vision Architecture
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#292331] mt-0.5">
            How VogueVision Works
          </h2>
          <p className="text-xs text-[#6D6574] mt-1">
            An end-to-end explainable Computer Vision pipeline for fashion retrieval and coordination.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-3">
          {steps.map((s) => (
            <div 
              key={s.num}
              className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-xs hover:border-[#9271BF]/30 transition-all"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#9271BF]/10 border border-[#9271BF]/20 flex items-center justify-center">
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#9271BF]">{s.num}</span>
                  <h3 className="text-sm font-semibold text-[#292331]">{s.title}</h3>
                </div>
                <p className="text-xs text-[#6D6574] leading-relaxed mt-0.5">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Viva Callout */}
        <div className="mt-5 p-3.5 rounded-2xl bg-[#E5DEE8]/60 border border-white/60">
          <p className="text-xs text-[#292331] leading-relaxed font-mono">
            <strong className="text-[#9271BF]">Key Formula:</strong> Pearson Correlation Coefficient<br/>
            <code>d(H1, H2) = Σ (H1'(I)·H2'(I)) / √[ Σ (H1'(I)²·Σ (H2'(I)²) ]</code><br/>
            Evaluated across 512 normalized bins using OpenCV <code>cv2.compareHist(HISTCMP_CORREL)</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
