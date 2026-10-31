import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Sparkles, ArrowRight, Layers, Eye, Palette, CheckCircle2, Sliders, Shirt } from 'lucide-react';
import { getProducts } from '../services/api';

export default function HomePage({ onSelectSample }) {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await getProducts();
        if (data && data.products) {
          setFeaturedProducts(data.products.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      }
    }
    loadCatalog();
  }, []);

  const workflowSteps = [
    {
      step: '01',
      title: 'Upload',
      desc: 'Upload an image of a clothing item or capture directly using your webcam.',
      icon: Upload,
      color: 'from-[#7950A3]/10 to-[#EDE3F4]'
    },
    {
      step: '02',
      title: 'Analyze',
      desc: 'Computer Vision extracts 3D HSV color histograms and dominant colors via K-Means.',
      icon: Palette,
      color: 'from-[#E8B5C4]/20 to-[#FAF8F7]'
    },
    {
      step: '03',
      title: 'Discover',
      desc: 'Explore visually similar pieces ranked using OpenCV histogram correlation (cv2.compareHist).',
      icon: Eye,
      color: 'from-[#7950A3]/10 to-[#F5EEF5]'
    },
    {
      step: '04',
      title: 'Style',
      desc: 'Find rule-based complementary clothing and accessories to complete the entire look.',
      icon: Sparkles,
      color: 'from-[#E8B5C4]/20 to-[#EDE3F4]'
    }
  ];

  const handleSampleClick = (samplePath, category) => {
    if (onSelectSample) {
      onSelectSample(samplePath, category);
    }
    navigate('/explore');
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE3F4] text-[#7950A3] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Semester 7 Computer Vision Project</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#211827] leading-[1.08] tracking-tight">
                  Find Your <br />
                  <span className="italic font-normal text-[#7950A3]">Perfect Look.</span>
                </h1>
                <p className="text-lg md:text-xl text-[#211827]/70 max-w-xl font-normal leading-relaxed">
                  Discover visually similar fashion pieces and effortlessly coordinated outfits, powered by Computer Vision.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-medium text-white bg-gradient-to-r from-[#7950A3] to-[#9165BF] hover:from-[#6A4392] hover:to-[#7950A3] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Upload className="w-5 h-5 text-[#EDE3F4]" />
                  <span>Upload an Image</span>
                </Link>

                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-base font-medium text-[#211827] bg-[#F5EEF5] hover:bg-[#EDE3F4] transition-all duration-200"
                >
                  <span>Explore Fashion</span>
                  <ArrowRight className="w-4 h-4 text-[#7950A3]" />
                </Link>
              </div>

              {/* Quick CV stats badge */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#EDE3F4] max-w-lg">
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#7950A3]">512</span>
                  <span className="text-xs text-[#211827]/60">HSV Histogram Bins</span>
                </div>
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#7950A3]">34+</span>
                  <span className="text-xs text-[#211827]/60">Local Catalog Pieces</span>
                </div>
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#7950A3]">100%</span>
                  <span className="text-xs text-[#211827]/60">OpenCV Powered</span>
                </div>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background aura */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#EDE3F4] via-[#E8B5C4]/30 to-[#F5EEF5] rounded-3xl blur-2xl opacity-70 -z-10" />

                {/* Main Hero Fashion Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 bg-[#F5EEF5]">
                  <img
                    src="/catalog/top_pink_floral_puff.jpg"
                    alt="VogueVision Editorial Fashion"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/samples/sample_pink_floral_top.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Floating badge inside image */}
                  <div className="absolute bottom-5 left-5 right-5 fashion-glass p-4 rounded-2xl border border-white/40 shadow-lg text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-[#7950A3] uppercase tracking-wider block">
                          Detected Look
                        </span>
                        <h4 className="text-sm font-serif font-semibold text-[#211827]">
                          Pink Sweetheart Puff Top
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full">
                        99.4% Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Card Top Right */}
                <div className="absolute -top-4 -right-4 fashion-glass px-4 py-2.5 rounded-2xl border border-white shadow-lg hidden sm:flex items-center gap-2.5 text-xs text-[#211827]">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">OpenCV 4.10 Active</span>
                </div>

                {/* Floating Decorative Palette Card Bottom Left */}
                <div className="absolute -bottom-6 -left-6 fashion-glass p-3 rounded-2xl border border-white shadow-xl hidden sm:flex items-center gap-2">
                  <span className="text-[11px] font-medium text-[#211827]/70 mr-1">Palette:</span>
                  <div className="w-5 h-5 rounded-full bg-[#E8B5C4] border border-white shadow-xs" title="#E8B5C4" />
                  <div className="w-5 h-5 rounded-full bg-[#7950A3] border border-white shadow-xs" title="#7950A3" />
                  <div className="w-5 h-5 rounded-full bg-[#F5EEF5] border border-white shadow-xs" title="#F5EEF5" />
                  <div className="w-5 h-5 rounded-full bg-[#211827] border border-white shadow-xs" title="#211827" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How VogueVision Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-widest bg-[#EDE3F4] px-3.5 py-1.5 rounded-full">
            Pipeline Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#211827]">
            How VogueVision Works
          </h2>
          <p className="text-sm sm:text-base text-[#211827]/70 max-w-xl mx-auto">
            From raw clothing pixels to coordinated designer ensembles in four seamless computer vision steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-3xl p-7 border border-[#EDE3F4] fashion-card-shadow fashion-card-hover text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-serif font-bold text-[#7950A3]/50 group-hover:text-[#7950A3] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#F5EEF5] text-[#7950A3] flex items-center justify-center transition-colors group-hover:bg-[#7950A3] group-hover:text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#211827] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#211827]/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#EDE3F4]/50 flex items-center text-xs font-medium text-[#7950A3]">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instant Demo Sandbox / Quick Samples */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F5EEF5] via-[#FAF8F7] to-[#EDE3F4]/50 rounded-3xl p-8 md:p-12 border border-[#EDE3F4] text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-wider">
                Instant Academic Demo
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#211827]">
                Try With 1-Click Fashion Queries
              </h2>
              <p className="text-sm text-[#211827]/70 max-w-lg">
                Click any of these sample items to launch the full OpenCV similarity search and outfit matching pipeline immediately.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#7950A3] hover:text-[#6A4392]"
            >
              <span>Or upload your own image</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                title: "Pink Floral Puff Top",
                category: "tops",
                img: "/catalog/top_pink_floral_puff.jpg",
                sample: "top_pink_floral_puff.jpg",
                badge: "Primary Demo"
              },
              {
                title: "Light Wash Wide Jeans",
                category: "jeans",
                img: "/catalog/bottom_light_blue_jeans.jpg",
                sample: "bottom_light_blue_jeans.jpg",
                badge: "Denim"
              },
              {
                title: "Emerald Satin Slip Dress",
                category: "dresses",
                img: "/catalog/dress_emerald_satin_slip.jpg",
                sample: "dress_emerald_satin_slip.jpg",
                badge: "Evening"
              },
              {
                title: "Ivory Structured Handbag",
                category: "handbags",
                img: "/catalog/bag_ivory_structured.jpg",
                sample: "bag_ivory_structured.jpg",
                badge: "Accessory"
              }
            ].map((demo, i) => (
              <div
                key={i}
                onClick={() => handleSampleClick(demo.sample, demo.category)}
                className="group cursor-pointer bg-white rounded-2xl p-3 border border-[#EDE3F4] fashion-card-hover transition-all text-left"
              >
                <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-[#FAF8F7] mb-3">
                  <img
                    src={demo.img}
                    alt={demo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-medium bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[#7950A3]">
                    {demo.badge}
                  </span>
                </div>
                <h4 className="text-xs font-serif font-semibold text-[#211827] truncate">
                  {demo.title}
                </h4>
                <p className="text-[11px] text-[#7950A3] capitalize mt-0.5">
                  Analyze this {demo.category} →
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Catalog Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-left">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#7950A3] uppercase tracking-wider">
              Local Catalog
            </span>
            <h2 className="text-3xl font-serif text-[#211827]">
              Curated Fashion Collection
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7950A3] hover:underline"
          >
            <span>View All Catalog Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSampleClick(product.image, product.category)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#EDE3F4] fashion-card-shadow fashion-card-hover text-left"
            >
              <div className="aspect-3/4 overflow-hidden bg-[#F5EEF5] relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/samples/sample_pink_floral_top.jpg';
                  }}
                />
                <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-[#211827]">
                  {product.price}
                </span>
                <span className="absolute top-3 left-3 bg-[#EDE3F4]/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold text-[#7950A3]">
                  {product.category}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-serif text-sm font-semibold text-[#211827] truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-[#211827]/60 line-clamp-1">
                  {product.description}
                </p>
                <div className="flex items-center gap-1.5 pt-2">
                  {product.dominant_colors && product.dominant_colors.slice(0, 3).map((col, idx) => (
                    <div
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: col.hex }}
                      title={col.hex}
                    />
                  ))}
                  <span className="text-[10px] text-[#7950A3] ml-auto font-medium">
                    Analyze →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
