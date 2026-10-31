import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Heart, Cpu, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#211827] text-white/80 pt-16 pb-12 border-t border-[#7950A3]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7950A3] flex items-center justify-center text-white">
                <Shirt className="w-4 h-4" />
              </div>
              <span className="text-2xl font-serif tracking-tight text-white">
                Vogue<span className="text-[#E8B5C4] font-normal italic">Vision</span>
              </span>
            </div>
            <p className="text-sm text-white/70 max-w-md leading-relaxed">
              Fashion image similarity search and outfit matching powered by Computer Vision. 
              Designed and built as a Semester 7 Computer Vision mini-project utilizing OpenCV 
              color spaces, normalized HSV 3D histograms, and color harmony recommendation rules.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E8B5C4]">
              <Cpu className="w-4 h-4" />
              <span>Real OpenCV 4.10 Feature Extraction & Correlation</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#E8B5C4] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-[#E8B5C4] transition-colors">Fashion Image Search</Link>
              </li>
              <li>
                <Link to="/outfits" className="hover:text-[#E8B5C4] transition-colors">Outfit Match</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E8B5C4] transition-colors">About & CV Algorithms</Link>
              </li>
            </ul>
          </div>

          {/* Academic specs */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Academic Specs</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><strong className="text-white">Course:</strong> Semester 7 Computer Vision</li>
              <li><strong className="text-white">Core CV:</strong> cv2.calcHist, cv2.compareHist</li>
              <li><strong className="text-white">Color Space:</strong> 3D HSV (8x8x8 Bins)</li>
              <li><strong className="text-white">Clustering:</strong> cv2.kmeans (K=4)</li>
              <li><strong className="text-white">Stack:</strong> React, Vite, Python, Flask</li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} VogueVision — Academic Computer Vision Mini-Project.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-[#E8B5C4] fill-[#E8B5C4]" /> for Computer Vision Viva
          </p>
        </div>
      </div>
    </footer>
  );
}
