import React from 'react';
import { X, Sparkles, BookOpen, Code2 } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
            Academic Mini-Project
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            VogueVision
          </h2>
          <p className="text-xs text-[#A8ADB8] mt-1">
            Fashion Image Similarity Search and Outfit Matching Using Computer Vision
          </p>
          <p className="text-xs font-semibold text-[#A78BFA] mt-0.5">
            Semester 7 Computer Vision Mini-Project
          </p>
        </div>

        {/* Project Overview */}
        <div className="space-y-4 text-xs text-[#A8ADB8] leading-relaxed">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xs">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#A78BFA]" />
              Project Objective
            </h3>
            <p>
              VogueVision solves the e-commerce challenge of visual discovery and color harmony in apparel styling. Rather than relying on generative AI hallucinations or complex black-box neural networks, VogueVision applies classical, explainable Computer Vision algorithms (OpenCV HSV 512-bin histogram correlation and K-Means dominant color clustering) to compute visual similarity and generate harmonized outfit ensembles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xs">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-[#A78BFA]" />
              Technical Stack
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="p-3 rounded-xl bg-[#111318] border border-white/5">
                <strong className="block text-[#A78BFA] font-semibold mb-1">Backend Engine</strong>
                <span>Python 3.13, Flask, OpenCV (cv2), NumPy, Pillow</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111318] border border-white/5">
                <strong className="block text-[#A78BFA] font-semibold mb-1">Frontend & Studio</strong>
                <span>React 19, Vite, Tailwind CSS, Lucide React, SVG Layered Canvas</span>
              </div>
            </div>
          </div>

          {/* FUTURE SCOPE SECTION */}
          <div className="p-5 rounded-2xl bg-[#111318] border border-[#A78BFA]/30">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#A78BFA]" />
              Future Scope & Planned Advancements
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-[#A8ADB8]">
              <li><strong>Wardrobe Image Upload:</strong> Direct user image upload with automated foreground segmentation using SAM (Segment Anything Model).</li>
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
