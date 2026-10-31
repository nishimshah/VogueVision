import React from 'react';
import { X, Sparkles, BookOpen, Code2 } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
            Academic Mini-Project
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#F5F1F8] mt-0.5">
            VogueVision
          </h2>
          <p className="text-xs text-[#AAA5B5] mt-1">
            Fashion Image Similarity Search and Outfit Matching Using Computer Vision
          </p>
          <p className="text-xs font-semibold text-[#B49AF4] mt-0.5">
            Semester 7 Computer Vision Mini-Project
          </p>
        </div>

        {/* Project Overview */}
        <div className="space-y-3.5 text-xs text-[#F5F1F8] leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <h3 className="text-sm font-semibold text-[#F5F1F8] flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-[#B49AF4]" />
              Project Objective
            </h3>
            <p className="text-[#AAA5B5]">
              VogueVision solves the e-commerce challenge of visual discovery and color harmony in apparel styling. Rather than relying on cloud black-box neural networks, VogueVision applies classical, explainable Computer Vision algorithms (OpenCV HSV 512-bin histogram correlation and K-Means dominant color clustering) to compute visual similarity and generate harmonized outfit ensembles.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <h3 className="text-sm font-semibold text-[#F5F1F8] flex items-center gap-2 mb-1.5">
              <Code2 className="w-4 h-4 text-[#B49AF4]" />
              Technical Stack
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="block text-[#B49AF4] font-semibold mb-0.5">Backend Engine</strong>
                <span className="text-[#AAA5B5]">Python 3.13, Flask, OpenCV (cv2), NumPy, Pillow</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="block text-[#B49AF4] font-semibold mb-0.5">Frontend & Studio</strong>
                <span className="text-[#AAA5B5]">React, Vite, Tailwind CSS, Lucide Icons</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <h3 className="text-sm font-semibold text-[#F5F1F8] flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#B49AF4]" />
              Key Features
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[#AAA5B5]">
              <li>Normalized 512-dimensional HSV color histogram indexing.</li>
              <li>Genuine Pearson correlation scoring with cv2.compareHist(HISTCMP_CORREL).</li>
              <li>Unsupervised dominant color palette clustering using cv2.kmeans.</li>
              <li>Rule-based color harmony matrices for tops, bottoms, shoes, and handbags.</li>
              <li>High-resolution realistic fashion mannequin presentation chamber.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.10] flex items-center justify-between">
          <span className="text-[11px] text-[#AAA5B5]">
            Designed for Academic Evaluation & Viva Voce
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold glass-btn-primary cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
