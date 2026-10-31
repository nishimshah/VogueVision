import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Camera, RefreshCw, Sparkles, CheckCircle2, AlertCircle, 
  Layers, ArrowRight, Eye, Heart, Info, Shirt, ShoppingBag, Sliders, ChevronRight
} from 'lucide-react';
import { analyzeImageFile, analyzeImageDataUrl, analyzeSampleImage } from '../services/api';
import ProductModal from '../components/ProductModal';
import CameraCaptureModal from '../components/CameraCaptureModal';

export default function ExplorePage({ currentAnalysis, setCurrentAnalysis, onSelectForOutfit }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState('tops');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [sidebarTab, setSidebarTab] = useState('search');

  const fileInputRef = useRef(null);

  // If there's already an active analysis from home page or previous navigation, restore preview
  useEffect(() => {
    if (currentAnalysis && currentAnalysis.uploaded_image) {
      setPreviewUrl(currentAnalysis.uploaded_image.url);
    }
  }, [currentAnalysis]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'tops', label: "Tops & Blouses" },
    { id: 'dresses', label: 'Dresses' },
    { id: 'jeans', label: 'Denim & Jeans' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'skirts', label: 'Skirts' },
    { id: 'handbags', label: 'Bags & Totes' },
    { id: 'shoes', label: 'Footwear' },
  ];

  const quickSamples = [
    { name: 'Pink Floral Puff Top', file: 'top_pink_floral_puff.jpg', cat: 'tops', img: '/catalog/top_pink_floral_puff.jpg' },
    { name: 'Light Blue Jeans', file: 'bottom_light_blue_jeans.jpg', cat: 'jeans', img: '/catalog/bottom_light_blue_jeans.jpg' },
    { name: 'Emerald Slip Dress', file: 'dress_emerald_satin_slip.jpg', cat: 'dresses', img: '/catalog/dress_emerald_satin_slip.jpg' },
    { name: 'Ivory Structured Bag', file: 'bag_ivory_structured.jpg', cat: 'handbags', img: '/catalog/bag_ivory_structured.jpg' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      setError('Please upload a valid image file (JPG, JPEG, or PNG).');
      return;
    }
    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const triggerAnalyze = async (overrideFile = null, overrideSample = null, overrideDataUrl = null) => {
    setError(null);
    setLoading(true);
    setLoadingStep(1);

    // Simulate step progress for user feedback as backend computes
    const timer1 = setTimeout(() => setLoadingStep(2), 350);
    const timer2 = setTimeout(() => setLoadingStep(3), 750);
    const timer3 = setTimeout(() => setLoadingStep(4), 1150);

    try {
      let data;
      if (overrideSample) {
        data = await analyzeSampleImage(overrideSample, category);
      } else if (overrideDataUrl) {
        data = await analyzeImageDataUrl(overrideDataUrl, category);
      } else {
        const fileToUpload = overrideFile || selectedFile;
        if (!fileToUpload) {
          throw new Error('Please select or capture an image first.');
        }
        data = await analyzeImageFile(fileToUpload, category);
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setLoadingStep(4);

      if (data && data.success) {
        setCurrentAnalysis(data);
        if (data.uploaded_image?.url) {
          setPreviewUrl(data.uploaded_image.url);
        }
      } else {
        throw new Error(data.error || 'Computer Vision analysis could not be completed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Image processing failed.');
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  const handleSampleClick = (sample) => {
    setCategory(sample.cat);
    setPreviewUrl(sample.img);
    setSelectedFile(null);
    triggerAnalyze(null, sample.file, null);
  };

  const handleCameraCapture = (dataUrl) => {
    setPreviewUrl(dataUrl);
    setSelectedFile(null);
    triggerAnalyze(null, null, dataUrl);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-widest bg-[#EDE3F4] px-3.5 py-1.5 rounded-full inline-block">
          OpenCV Feature Matching
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#211827]">
          Discover Similar Styles
        </h1>
        <p className="text-sm sm:text-base text-[#211827]/70 font-normal">
          Upload a fashion image and let computer vision find your closest matches and coordinated outfits.
        </p>
      </div>

      {/* Main Analysis Controls & Upload Box (if no analysis or user wants to re-upload) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE3F4] fashion-card-shadow text-left">
        
        {/* Category Filter Pills */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#211827]/70 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#7950A3]" />
              Select Item Category:
            </span>
            <span className="text-xs text-[#7950A3]">
              Helps OpenCV prioritize catalog matches
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  category === c.id
                    ? 'bg-[#7950A3] text-white shadow-xs'
                    : 'bg-[#F5EEF5] text-[#211827]/80 hover:bg-[#EDE3F4]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                isDragOver 
                  ? 'border-[#7950A3] bg-[#EDE3F4]/30' 
                  : 'border-[#EDE3F4] hover:border-[#7950A3]/50 bg-[#FAF8F7]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="max-w-sm mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EDE3F4] text-[#7950A3] flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#211827]">
                    Drag & Drop your fashion photo here
                  </h3>
                  <p className="text-xs text-[#211827]/60 mt-1">
                    Supports JPG, JPEG, and PNG files up to 10MB
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-full text-xs font-medium text-white bg-[#7950A3] hover:bg-[#6A4392] shadow-xs transition-colors"
                  >
                    Browse Files
                  </button>

                  <button
                    onClick={() => setCameraOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-[#211827] bg-[#F5EEF5] hover:bg-[#EDE3F4] transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#7950A3]" />
                    <span>Use Camera</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preview or Samples Column */}
          <div className="lg:col-span-4 space-y-4">
            {previewUrl ? (
              <div className="bg-[#FAF8F7] p-4 rounded-3xl border border-[#EDE3F4] text-center space-y-3">
                <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-wider block">
                  Selected Image Preview
                </span>
                <div className="aspect-3/4 rounded-2xl overflow-hidden bg-black/5 relative max-h-56 mx-auto">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => triggerAnalyze()}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-medium text-white bg-gradient-to-r from-[#7950A3] to-[#9165BF] hover:from-[#6A4392] hover:to-[#7950A3] shadow-sm disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{loading ? 'Analyzing...' : 'Analyze Image'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="px-3 py-2.5 rounded-full text-xs font-medium text-[#211827]/70 bg-[#F5EEF5] hover:bg-[#EDE3F4]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#F5EEF5]/60 p-5 rounded-3xl border border-[#EDE3F4] space-y-3">
                <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-wider block">
                  Quick Test Queries (1-Click)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {quickSamples.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSampleClick(s)}
                      className="group flex flex-col items-center p-2 rounded-2xl bg-white border border-[#EDE3F4] hover:border-[#7950A3] transition-all text-left"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF8F7] mb-1.5">
                        <img
                          src={s.img}
                          alt={s.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-[#211827] truncate w-full text-center">
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Real-time Computer Vision Processing Status Overlay/Card */}
        {loading && (
          <div className="mt-6 p-6 rounded-3xl bg-[#FAF8F7] border border-[#EDE3F4] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-serif font-semibold text-[#211827] flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#7950A3] animate-spin" />
                Analyzing Image with OpenCV...
              </span>
              <span className="text-xs font-semibold text-[#7950A3]">
                Step {loadingStep} of 4
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#EDE3F4] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#7950A3] to-[#E8B5C4] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(loadingStep / 4) * 100}%` }}
              />
            </div>

            {/* 4 Steps check list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
              {[
                { title: 'Preprocessing image', sub: 'cv2.resize, BGR to HSV' },
                { title: 'Extracting dominant colors', sub: 'cv2.kmeans clustering' },
                { title: 'Finding similar items', sub: 'cv2.compareHist correlation' },
                { title: 'Generating outfit matches', sub: 'Color harmony rules' },
              ].map((step, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-2 p-2.5 rounded-xl border transition-colors ${
                    loadingStep > idx
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : loadingStep === idx + 1
                      ? 'bg-[#EDE3F4] border-[#7950A3]/30 text-[#7950A3] font-medium'
                      : 'bg-white/50 border-[#EDE3F4] text-[#211827]/40'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    loadingStep > idx ? 'text-emerald-600' : 'text-current opacity-40'
                  }`} />
                  <div>
                    <span className="block leading-tight">{step.title}</span>
                    <span className="text-[10px] opacity-70">{step.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FINAL RESULTS DASHBOARD (Matches Section 11 & Attached Diagram) */}
      {currentAnalysis && currentAnalysis.similar_products && (
        <section className="space-y-6 pt-4 text-left">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-wider block">
                Analysis Dashboard
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#211827]">
                Similar Styles, Just for You
              </h2>
            </div>
            <span className="text-xs text-[#211827]/60 hidden sm:inline-block">
              Ranked by OpenCV HSV Histogram Correlation
            </span>
          </div>

          {/* 3-Column Studio Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Column 1: Uploaded Image & Controls (3 cols on lg) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#EDE3F4] fashion-card-shadow space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#211827]/70 block">
                  Uploaded Image
                </span>
                <div className="aspect-3/4 rounded-2xl overflow-hidden bg-[#FAF8F7] relative border border-[#EDE3F4]">
                  <img
                    src={previewUrl || currentAnalysis.uploaded_image?.url}
                    alt="Uploaded Clothing"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/samples/sample_pink_floral_top.jpg';
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-medium text-[#211827] bg-[#F5EEF5] hover:bg-[#EDE3F4] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#7950A3]" />
                    <span>Change Image</span>
                  </button>
                  <button
                    onClick={() => setCameraOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-medium text-[#211827] bg-[#F5EEF5] hover:bg-[#EDE3F4] transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#7950A3]" />
                    <span>Use Camera</span>
                  </button>
                </div>
              </div>

              {/* Detected Category Card with fashion icon */}
              <div className="bg-white rounded-3xl p-5 border border-[#EDE3F4] fashion-card-shadow space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#211827]/70 block">
                  Detected Category
                </span>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F5EEF5] border border-[#EDE3F4]">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE3F4] text-[#7950A3] flex items-center justify-center">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#211827] capitalize">
                      {currentAnalysis.uploaded_image?.detected_category || 'Fashion Item'}
                    </h4>
                    <span className="text-[11px] text-[#7950A3]">
                      Primary: {currentAnalysis.uploaded_image?.primary_color || 'Pink'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dominant Color Palette */}
              <div className="bg-white rounded-3xl p-5 border border-[#EDE3F4] fashion-card-shadow space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#211827]/70 block">
                  Dominant Colors (K-Means)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {currentAnalysis.dominant_colors?.map((col, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className="w-9 h-9 rounded-full border border-black/10 shadow-xs transition-transform hover:scale-110"
                        style={{ backgroundColor: col.hex }}
                        title={`${col.hex} (${col.percentage}%)`}
                      />
                      <span className="text-[9px] font-mono text-[#211827]/70 mt-1">
                        {col.hex}
                      </span>
                      <span className="text-[9px] text-[#7950A3]">
                        {col.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Similar Clothing Items (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#EDE3F4] fashion-card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-semibold text-[#211827]">
                    Similar Clothing Items
                  </h3>
                  <span className="text-xs font-medium text-[#7950A3] hover:underline cursor-pointer">
                    Top 5 Ranked Matches
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {currentAnalysis.similar_products?.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setModalProduct(product)}
                      className="group relative cursor-pointer rounded-2xl p-2.5 border border-[#EDE3F4] hover:border-[#7950A3] bg-[#FAF8F7] transition-all hover:shadow-md text-left"
                    >
                      {/* Image container */}
                      <div className="aspect-3/4 rounded-xl overflow-hidden bg-[#F5EEF5] relative mb-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/samples/sample_pink_floral_top.jpg';
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-[#211827] hover:text-[#7950A3]"
                        >
                          <Heart className={`w-3.5 h-3.5 ${favorites[product.id] ? 'fill-[#7950A3] text-[#7950A3]' : ''}`} />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-emerald-600/90 text-white backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-medium">
                          {product.similarity_score}% Match
                        </span>
                      </div>

                      <h4 className="text-xs font-serif font-semibold text-[#211827] truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-[#7950A3] font-medium">{product.price}</span>
                        <span className="text-[#211827]/50 capitalize">{product.category}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5th matching item banner */}
                {currentAnalysis.similar_products?.[4] && (
                  <div
                    onClick={() => setModalProduct(currentAnalysis.similar_products[4])}
                    className="mt-3 p-3 rounded-2xl border border-[#EDE3F4] bg-[#FAF8F7] hover:border-[#7950A3] cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={currentAnalysis.similar_products[4].imageUrl}
                        alt="5th item"
                        className="w-12 h-14 object-cover rounded-xl"
                      />
                      <div>
                        <h5 className="font-serif text-xs font-semibold text-[#211827]">
                          {currentAnalysis.similar_products[4].name}
                        </h5>
                        <span className="text-[11px] text-[#7950A3]">
                          {currentAnalysis.similar_products[4].similarity_score}% Similarity
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#7950A3] hover:underline">
                      View Details →
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Recommended Outfits (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#EDE3F4] fashion-card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-semibold text-[#211827]">
                    Recommended Outfits
                  </h3>
                  <span className="text-xs text-[#7950A3] font-medium">
                    Rule-Based Harmony
                  </span>
                </div>

                <div className="space-y-4">
                  {currentAnalysis.curated_outfits?.map((outfit) => (
                    <div
                      key={outfit.id}
                      className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EDE3F4] hover:border-[#7950A3] transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#211827]">
                            {outfit.title}
                          </h4>
                          <span className="text-[10px] text-[#7950A3] font-medium uppercase tracking-wider">
                            {outfit.style}
                          </span>
                        </div>
                      </div>

                      {/* Composite visual thumbnail row */}
                      <div className="grid grid-cols-4 gap-2">
                        {/* Main item */}
                        <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#EDE3F4]" title="Query Item">
                          <img
                            src={previewUrl || outfit.main_item?.imageUrl}
                            alt="Main Item"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Bottom */}
                        {outfit.bottom && (
                          <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#EDE3F4]" title={outfit.bottom.name}>
                            <img
                              src={outfit.bottom.imageUrl}
                              alt={outfit.bottom.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {/* Shoes */}
                        {outfit.shoes && (
                          <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#EDE3F4]" title={outfit.shoes.name}>
                            <img
                              src={outfit.shoes.imageUrl}
                              alt={outfit.shoes.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {/* Accessory */}
                        {outfit.accessory && (
                          <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#EDE3F4]" title={outfit.accessory.name}>
                            <img
                              src={outfit.accessory.imageUrl}
                              alt={outfit.accessory.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Coordinated Palette */}
                        <div className="flex items-center gap-1">
                          {outfit.palette?.map((hex, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-black/10"
                              style={{ backgroundColor: hex }}
                              title={hex}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            if (onSelectForOutfit) {
                              onSelectForOutfit(outfit);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white bg-[#7950A3] hover:bg-[#6A4392] transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Academic Viva Verification Strip */}
          <div className="p-4 rounded-2xl bg-[#EDE3F4]/50 border border-[#EDE3F4] flex flex-wrap items-center justify-between text-xs text-[#211827]/80 gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#7950A3]" />
              <span>
                <strong>Academic Verification:</strong> Real OpenCV 3D HSV histogram normalized with <code className="font-mono text-[#7950A3]">cv2.NORM_MINMAX</code> and compared via <code className="font-mono text-[#7950A3]">cv2.HISTCMP_CORREL</code>.
              </span>
            </div>
            <span className="text-[#7950A3] font-medium">
              Correlation Range: -1.0 to +1.0
            </span>
          </div>

        </section>
      )}

      {/* Product Detail Modal */}
      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onSelectForOutfit={onSelectForOutfit}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

    </div>
  );
}
