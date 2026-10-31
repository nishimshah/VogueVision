import React from 'react';
import { X, Check } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const steps = [
    {
      num: "01",
      title: "SELECT",
      description: "Choose a clothing item from the wardrobe."
    },
    {
      num: "02",
      title: "MATCH",
      description: "OpenCV compares HSV color histograms to find visually similar products. Rule-based styling logic recommends compatible garments."
    },
    {
      num: "03",
      title: "PREVIEW",
      description: "View verified mannequin outfits or create custom combinations using the Mix & Match board."
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#191723]/95 backdrop-blur-2xl border border-white/[0.16] rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)] text-[#F5F1F8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.10] flex items-center justify-center text-[#AAA5B5] hover:text-[#F5F1F8] transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49AF4]">
            System Architecture
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F5F1F8] mt-0.5">
            How It Works
          </h2>
        </div>

        {/* 3 Concise Steps */}
        <div className="space-y-2.5">
          {steps.map((s) => (
            <div 
              key={s.num}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold text-[#B49AF4] px-1.5 py-0.5 rounded-md bg-[#B49AF4]/10 border border-[#B49AF4]/20">
                  {s.num}
                </span>
                <h3 className="text-xs font-bold text-[#F5F1F8] tracking-wide font-mono">
                  {s.title}
                </h3>
              </div>
              <p className="text-xs text-[#AAA5B5] leading-relaxed pl-7">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#AAA5B5]">
            OpenCV HSV Histograms • Rule-Based Styling
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#B49AF4]/20 hover:bg-[#B49AF4]/30 border border-[#B49AF4]/40 text-[#F5F1F8] text-xs font-medium transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

