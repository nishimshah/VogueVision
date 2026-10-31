import React from 'react';
import { X, Sparkles, BookOpen, Code2, ArrowUpRight } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241B35]/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white/85 backdrop-blur-2xl border border-white rounded-3xl p-7 shadow-[0_20px_60px_rgba(80,40,120,0.25)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#8B5AC2]/10 hover:bg-[#8B5AC2]/20 flex items-center justify-center text-[#241B35] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B5AC2]">
            Academic Mini-Project
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#241B35] mt-1">
            VogueVision
          </h2>
          <p className="text-xs text-[#241B35]/70 mt-1">
            Fashion Image Similarity Search and Outfit Matching Using Computer Vision
          </p>
          <p className="text-xs font-semibold text-[#8B5AC2] mt-0.5">
            Semester 7 Computer Vision Mini-Project
          </p>
        </div>

        {/* Project Overview */}
        <div className="space-y-4 text-xs text-[#241B35]/85 leading-relaxed">
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 shadow-xs">
            <h3 className="text-sm font-semibold text-[#241B35] flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#8B5AC2]" />
              Project Objective
            </h3>
            <p>
              VogueVision solves the e-commerce challenge of visual discovery and color harmony in apparel styling. Rather than relying on textual tags or expensive black-box generative AI models, VogueVision applies classical, explainable Computer Vision algorithms (OpenCV HSV histogram correlation and K-Means clustering) to compute visual similarity and generate harmonized outfit ensembles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 shadow-xs">
            <h3 className="text-sm font-semibold text-[#241B35] flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-[#8B5AC2]" />
              Technical Stack
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="p-2.5 rounded-xl bg-[#F8F5FA]">
                <strong className="block text-[#8B5AC2] font-semibold">Backend Engine</strong>
                <span>Python 3.13, Flask, OpenCV (cv2), NumPy, Pillow</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F5FA]">
                <strong className="block text-[#8B5AC2] font-semibold">Frontend & UI</strong>
                <span>React 19, Vite, Tailwind CSS v4, Lucide React, Glassmorphism</span>
              </div>
            </div>
          </div>

          {/* FUTURE SCOPE SECTION */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#8B5AC2]/10 to-[#F1C6D8]/20 border border-[#8B5AC2]/20">
            <h3 className="text-sm font-bold text-[#241B35] flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#8B5AC2]" />
              Future Scope & Planned Advancements
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-[#241B35]/80">
              <li><strong>Wardrobe Image Upload:</strong> Direct user image upload with automated foreground segmentation using SAM (Segment Anything Model).</li>
              <li><strong>Automatic Garment Category Recognition:</strong> Multi-class classification using YOLOv11 and Vision Transformers.</li>
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
