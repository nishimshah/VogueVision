import React, { useState, useEffect } from 'react';
import { 
  Cpu, Layers, Sparkles, CheckCircle2, ArrowRight, Code2, 
  Terminal, Server, FileText, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { checkHealth } from '../services/api';

export default function AboutPage() {
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const data = await checkHealth();
        setHealthData(data);
      } catch (err) {
        console.error('Health check failed', err);
      } finally {
        setLoadingHealth(false);
      }
    }
    fetchHealth();
  }, []);

  const cvTechniques = [
    {
      title: '1. Image Preprocessing',
      method: 'cv2.imdecode & cv2.resize',
      desc: 'Raw image byte buffer is decoded into OpenCV 3-channel BGR format, validated against corruption, and standardized to a uniform 256x256 resolution using area interpolation (cv2.INTER_AREA) to balance fine texture with computational efficiency.',
      formula: 'I_{std} = \\text{resize}(I_{raw}, (256, 256))'
    },
    {
      title: '2. HSV Color Space Conversion',
      method: 'cv2.cvtColor(BGR2HSV)',
      desc: 'Standard RGB/BGR mixes color chromaticity with lighting luminance. Converting to HSV (Hue, Saturation, Value) decouples illumination variations from actual garment pigment, ensuring similarity matches focus on color identity rather than camera exposure.',
      formula: 'H \\in [0, 180], \\quad S \\in [0, 255], \\quad V \\in [0, 255]'
    },
    {
      title: '3. 3D Color Histogram Extraction',
      method: 'cv2.calcHist & cv2.normalize',
      desc: 'A joint 3D histogram is computed across 8 Hue bins, 8 Saturation bins, and 8 Value bins (512 total feature dimensions). The resulting frequency tensor is normalized with cv2.NORM_MINMAX to yield scale-invariant color distribution representations.',
      formula: 'H(h, s, v) = \\sum_{x, y} \\mathbf{1}_{\\{I_{HSV}(x,y) \\in \\text{bin}(h,s,v)\\}}'
    },
    {
      title: '4. Histogram Similarity Matching',
      method: 'cv2.compareHist(HISTCMP_CORREL)',
      desc: 'Compares the query histogram against catalog feature vectors using Pearson correlation coefficient (HISTCMP_CORREL). Values range from -1.0 (anti-correlated) to +1.0 (identical distribution), smoothly converted to human-interpretable percentage scores.',
      formula: 'r(H_1, H_2) = \\frac{\\sum_k (H_1(k) - \\bar{H}_1)(H_2(k) - \\bar{H}_2)}{\\sqrt{\\sum_k (H_1(k) - \\bar{H}_1)^2 \\sum_k (H_2(k) - \\bar{H}_2)^2}}'
    },
    {
      title: '5. Dominant Color Clustering',
      method: 'cv2.kmeans (K=4, RGB Pixels)',
      desc: 'Extracts the 4 primary palette swatches of each garment by running OpenCV K-Means vector quantization over pixel coordinates, determining dominant hex codes and surface coverage percentages.',
      formula: '\\min \\sum_{i=1}^k \\sum_{x \\in S_i} \\| x - \\mu_i \\|^2'
    },
    {
      title: '6. Rule-Based Outfit Compatibility',
      method: 'Harmonious Color Pairing Engine',
      desc: 'Fashion color theory rules pair detected pigments (e.g., Pink with Denim Blue, Cream, White, and Camel) and silhouette rules connect Tops with Bottoms, Footwear, and Handbags from the catalog.',
      formula: '\\text{Outfit}(T, B, S, A) = \\text{CompatibilityMatrix}(Color_T, Color_B, Color_S, Color_A)'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 text-left">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-widest bg-[#EDE3F4] px-3.5 py-1.5 rounded-full inline-block">
          Semester 7 Computer Vision Project
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#211827]">
          About VogueVision
        </h1>
        <p className="text-base text-[#211827]/75 leading-relaxed font-normal">
          VogueVision is a Computer Vision-based fashion discovery application that analyzes clothing images to identify visually similar products and recommend complementary outfit combinations.
        </p>
      </div>

      {/* Live System & CV Engine Status */}
      <div className="bg-white rounded-3xl p-6 border border-[#EDE3F4] fashion-card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE3F4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-[#211827]">
                Backend Computer Vision Engine Status
              </h3>
              <p className="text-xs text-[#211827]/60">
                Connected to local Flask microservice on port 5001
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {healthData?.status === 'healthy' ? 'OpenCV Active & Verified' : 'Checking Status...'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-3 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4]">
            <span className="text-[#211827]/60 block mb-0.5">OpenCV Version</span>
            <strong className="text-sm font-serif text-[#211827]">{healthData?.opencv_version || '4.10.0'}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4]">
            <span className="text-[#211827]/60 block mb-0.5">Catalog Size</span>
            <strong className="text-sm font-serif text-[#7950A3]">{healthData?.catalog_size || '34'} local pieces</strong>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4]">
            <span className="text-[#211827]/60 block mb-0.5">Histogram Dimension</span>
            <strong className="text-sm font-serif text-[#211827]">512-D Normalized</strong>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4]">
            <span className="text-[#211827]/60 block mb-0.5">Comparison Metric</span>
            <strong className="text-sm font-serif text-[#7950A3]">cv2.HISTCMP_CORREL</strong>
          </div>
        </div>
      </div>

      {/* Visual Workflow Pipeline Diagram */}
      <div className="bg-white rounded-3xl p-8 border border-[#EDE3F4] fashion-card-shadow space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-wider">
            System Workflow
          </span>
          <h2 className="text-2xl font-serif text-[#211827]">
            Computer Vision Architecture Diagram
          </h2>
        </div>

        {/* 5-Step Process Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {[
            { num: '1', title: 'Image Upload', desc: 'File / Camera BGR bytes buffer' },
            { num: '2', title: 'Preprocessing', desc: 'cv2.resize (256x256) & HSV conversion' },
            { num: '3', title: 'Feature Extraction', desc: '3D HSV histogram & K-Means colors' },
            { num: '4', title: 'Similarity Match', desc: 'cv2.compareHist Pearson correlation' },
            { num: '5', title: 'Recommendations', desc: 'Rule-based outfit coordination' },
          ].map((step, idx) => (
            <div key={idx} className="relative p-4 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] text-center space-y-1.5">
              <span className="w-6 h-6 rounded-full bg-[#7950A3] text-white text-xs font-bold flex items-center justify-center mx-auto">
                {step.num}
              </span>
              <h4 className="font-serif text-xs font-semibold text-[#211827]">
                {step.title}
              </h4>
              <p className="text-[10px] text-[#211827]/60">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[#F5EEF5]/60 text-xs text-[#211827]/80 text-center font-mono">
          Image Upload → Preprocessing → Feature Extraction → Similarity Comparison → Fashion Recommendations
        </div>
      </div>

      {/* Detailed Computer Vision Techniques */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-wider">
            Technical Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#211827]">
            Computer Vision Algorithms & Mathematical Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cvTechniques.map((tech, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#EDE3F4] fashion-card-shadow space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-[#211827]">
                  {tech.title}
                </h3>
                <span className="font-mono text-[11px] text-[#7950A3] bg-[#EDE3F4] px-2.5 py-0.5 rounded-full">
                  {tech.method}
                </span>
              </div>
              <p className="text-xs text-[#211827]/70 leading-relaxed">
                {tech.desc}
              </p>
              <div className="pt-2 border-t border-[#EDE3F4] text-[11px] font-mono text-[#7950A3]/90 bg-[#FAF8F7] p-2 rounded-xl">
                {tech.formula}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white rounded-3xl p-8 border border-[#EDE3F4] fashion-card-shadow space-y-6">
        <h2 className="text-2xl font-serif text-[#211827]">
          Technology Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] space-y-1">
            <span className="font-semibold text-[#7950A3] block">Frontend</span>
            <p className="text-[#211827]">React 19, Vite, Tailwind CSS v4, Lucide React, Axios</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] space-y-1">
            <span className="font-semibold text-[#7950A3] block">Backend</span>
            <p className="text-[#211827]">Python 3.13, Flask 3.1, Flask-CORS</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] space-y-1">
            <span className="font-semibold text-[#7950A3] block">Computer Vision</span>
            <p className="text-[#211827]">OpenCV 4.10, NumPy 2.5, Pillow</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] space-y-1">
            <span className="font-semibold text-[#7950A3] block">Dataset</span>
            <p className="text-[#211827]">34 Local Fashion Catalog Items, 0 External APIs</p>
          </div>
        </div>
      </div>

    </div>
  );
}
