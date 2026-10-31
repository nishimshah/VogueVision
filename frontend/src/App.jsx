import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import OutfitPage from './pages/OutfitPage';
import AboutPage from './pages/AboutPage';

function AppContent() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [selectedOutfitLook, setSelectedOutfitLook] = useState(null);
  const navigate = useNavigate();

  const handleSelectSample = (sampleFile, category) => {
    // Navigate to explore and trigger analysis
    navigate('/explore');
  };

  const handleSelectForOutfit = (productOrOutfit) => {
    setSelectedOutfitLook(productOrOutfit);
    navigate('/outfits');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F7] text-[#211827]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage onSelectSample={handleSelectSample} />} 
          />
          <Route 
            path="/explore" 
            element={
              <ExplorePage 
                currentAnalysis={currentAnalysis}
                setCurrentAnalysis={setCurrentAnalysis}
                onSelectForOutfit={handleSelectForOutfit}
              />
            } 
          />
          <Route 
            path="/outfits" 
            element={
              <OutfitPage 
                currentAnalysis={currentAnalysis}
                selectedOutfitLook={selectedOutfitLook}
              />
            } 
          />
          <Route 
            path="/about" 
            element={<AboutPage />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
