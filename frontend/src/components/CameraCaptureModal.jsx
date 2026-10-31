import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

export default function CameraCaptureModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please allow camera permissions or upload an image file.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#FAF8F7] w-full max-w-lg rounded-3xl shadow-2xl border border-[#EDE3F4] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE3F4] bg-[#F5EEF5]/50">
          <div className="flex items-center gap-2 text-[#211827]">
            <Camera className="w-5 h-5 text-[#7950A3]" />
            <h3 className="font-serif text-lg font-medium">Capture Clothing Item</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#211827]/60 hover:text-[#211827] hover:bg-[#EDE3F4]/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview */}
        <div className="p-6">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center shadow-inner">
            {error ? (
              <div className="p-6 text-center text-white/80 space-y-3">
                <p className="text-sm">{error}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-full text-xs font-medium bg-[#7950A3] text-white hover:bg-[#6A4392]"
                >
                  Retry Camera
                </button>
              </div>
            ) : capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured fashion item"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Target guide frame */}
            {!capturedImage && !error && (
              <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] text-white/70 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  Center clothing item inside frame
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {capturedImage ? (
              <>
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-[#EDE3F4] text-[#211827] hover:bg-[#F5EEF5]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake</span>
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white bg-[#7950A3] hover:bg-[#6A4392] shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Photo</span>
                </button>
              </>
            ) : (
              <button
                onClick={takeSnapshot}
                disabled={!!error}
                className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#7950A3] to-[#9165BF] hover:from-[#6A4392] hover:to-[#7950A3] shadow-md transition-all transform hover:scale-105 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Snapshot</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
