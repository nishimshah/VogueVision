import React from 'react';
import { X, Layers, Cpu, Palette, Sliders, CheckCircle2 } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      num: "01",
      icon: <Layers className="w-5 h-5 text-[#A78BFA]" />,
      title: "Color Space Conversion & 3D HSV Representation",
      description: "Fashion images are loaded and converted from BGR to the HSV (Hue, Saturation, Value) color cylinder. Unlike RGB where brightness corrupts chrominance, HSV decouples pure chromatic tone (Hue) from lighting variations and shadows."
    },
    {
      num: "02",
      icon: <Cpu className="w-5 h-5 text-[#A78BFA]" />,
      title: "512-Dimensional Color Histogram Extraction",
      description: "We compute a multi-dimensional histogram using cv2.calcHist with 8 bins each across Hue, Saturation, and Value (8 × 8 × 8 = 512 bins). The histogram is normalized (L1/L2) so that variations in image resolution do not bias color distribution."
    },
    {
      num: "03",
      icon: <Sliders className="w-5 h-5 text-[#A78BFA]" />,
      title: "Correlation Metric (cv2.compareHist)",
      description: "Similarity between catalog garments is calculated using Pearson correlation (HISTCMP_CORREL). This produces a genuine mathematical similarity score in [-1.0, +1.0], normalized to an intuitive percentage match without generative AI hallucinations."
    },
    {
      num: "04",
      icon: <Palette className="w-5 h-5 text-[#A78BFA]" />,
      title: "K-Means Dominant Color Extraction",
      description: "Garment pixels are clustered using cv2.kmeans with k=4. Cluster centers reveal primary and secondary color palettes, filtering out studio background illumination and identifying true garment tones."
    },
    {
      num: "05",
      icon: <CheckCircle2 className="w-5 h-5 text-[#A78BFA]" />,
      title: "Color Harmony Outfit Coordination",
      description: "Complementary, analogous, and monochromatic color harmony matrices match the selected piece with trousers, skirts, footwear, and bags. High-harmony candidates are automatically ranked and rendered in the virtual glass studio."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#191C22] border border-white/15 rounded-3xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto text-[#F5F5F7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A78BFA]">
            Computer Vision Architecture
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            How VogueVision Works
          </h2>
          <p className="text-xs text-[#A8ADB8] mt-1">
            An end-to-end explainable Computer Vision pipeline for fashion retrieval and coordination.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-3.5">
          {steps.map((s) => (
            <div 
              key={s.num}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xs hover:border-[#A78BFA]/30 transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center">
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#A78BFA]">{s.num}</span>
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                </div>
                <p className="text-xs text-[#A8ADB8] leading-relaxed mt-1">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Viva Callout */}
        <div className="mt-6 p-4 rounded-2xl bg-[#111318] border border-white/10">
          <p className="text-xs text-[#A8ADB8] leading-relaxed font-mono">
            <strong className="text-[#A78BFA]">Key Formula:</strong> Pearson Correlation Coefficient<br/>
            <code>d(H1, H2) = Σ (H1'(I)·H2'(I)) / √[ Σ (H1'(I)²·Σ (H2'(I)²) ]</code><br/>
            Evaluated across 512 normalized bins using OpenCV <code>cv2.compareHist(HISTCMP_CORREL)</code>.
          </p>
        </div>

        {/* Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#A8ADB8]/70 italic">
            Illustrative outfit preview designed for styling visualization; garment fit predictions are out of scope.
          </p>
        </div>
      </div>
    </div>
  );
}
