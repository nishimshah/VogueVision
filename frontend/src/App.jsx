import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StudioPage from './pages/StudioPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudioPage />} />
        <Route path="/studio" element={<StudioPage />} />
        {/* Legacy routes redirect directly to the futuristic styling studio */}
        <Route path="/explore" element={<Navigate to="/" replace />} />
        <Route path="/outfits" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
