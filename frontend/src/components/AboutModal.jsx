import React from 'react';
import { X, Sparkles, BookOpen, Code2 } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
            Academic Mini-Project
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#292331] mt-0.5">
            VogueVision
          </h2>
          <p className="text-xs text-[#6D6574] mt-1">
            Fashion Image Similarity Search and Outfit Matching Using Computer Vision
          </p>
          <p className="text-xs font-semibold text-[#9271BF] mt-0.5">
            Semester 7 Computer Vision Mini-Project
          </p>
        </div>

        {/* Project Overview */}
        <div className="space-y-3.5 text-xs text-[#292331] leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-xs">
            <h3 className="text-sm font-semibold text-[#292331] flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-[#9271BF]" />
              Project Objective
            </h3>
            <p className="text-[#6D6574]">
              VogueVision solves the e-commerce challenge of visual discovery and color harmony in apparel styling. Rather than relying on generative AI hallucinations or complex black-box neural networks, VogueVision applies classical, explainable Computer Vision algorithms (OpenCV HSV 512-bin histogram correlation and K-Means dominant color clustering) to compute visual similarity and generate harmonized outfit ensembles.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-xs">
            <h3 className="text-sm font-semibold text-[#292331] flex items-center gap-2 mb-1.5">
              <Code2 className="w-4 h-4 text-[#9271BF]" />
              Technical Stack
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              <div className="p-2.5 rounded-xl bg-[#E5DEE8]/60 border border-white/60">
                <strong className="block text-[#9271BF] font-semibold mb-0.5">Backend Engine</strong>
                <span className="text-[#6D6574]">Python 3.13, Flask, OpenCV (cv2), NumPy, Pillow</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E5DEE8]/60 border border-white/60">
                <strong className="block text-[#9271BF] font-semibold mb-0.5">Frontend & Studio</strong>
                <span className="text-[#6D6574]">React 19, Vite, Tailwind CSS, Smoky Mauve Glass</span>
              </div>
            </div>
          </div>

          {/* FUTURE SCOPE SECTION */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#9271BF]/10 to-white/60 border border-[#9271BF]/20">
            <h3 className="text-sm font-bold text-[#292331] flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#9271BF]" />
              Future Scope & Planned Advancements
            </h3>
            <ul className="space-y-1 list-disc list-inside text-[#6D6574]">
              <li><strong>Wardrobe Image Upload:</strong> Direct user image upload with automated foreground segmentation.</li>
              <li><strong>Automatic Garment Category Recognition:</strong> Multi-class garment categorization using YOLOv11 and Vision Transformers.</li>
              <li><strong>Personalized Recommendation Engine:</strong> Deep feature embeddings (ResNet/CLIP) combined with user history.</li>
              <li><strong>3D Parametric Body Fitting:</strong> SMPL-based body shape morphing and 360° cloth drape physics simulation.</li>
              <li><strong>Live Retailer API Integration:</strong> Real-time product availability and price synchronization across partner stores.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
