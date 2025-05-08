import React, { useState, useRef } from 'react';
import { Upload, X, Image, AlertCircle } from 'lucide-react';
import { useLeafAnalysis } from '../context/LeafAnalysisContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ImageUploader: React.FC = () => {
  const { selectedImage, setSelectedImage, resetAnalysis } = useLeafAnalysis();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounterRef.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, WEBP)');
      return;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
        resetAnalysis();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    resetAnalysis();
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {!selectedImage ? (
        <>
          <div
            className={`image-upload-area flex flex-col items-center justify-center ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            tabIndex={0}
            role="button"
            aria-label="Upload a leaf image"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                triggerFileInput();
              }
            }}
          >
            <div className={`transform transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
              <Upload className="w-12 h-12 text-primary-500 mb-4 group-hover:animate-bounce" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Upload a leaf image</h3>
            <p className="text-gray-500 text-center mb-4">
              Drag and drop your image here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports: JPG, PNG, WEBP (max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
              aria-label="Upload leaf image"
            />
          </div>
          
          {error && (
            <div className="mt-4 px-4 py-3 flex items-center gap-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </>
      ) : (
        <div className="relative group">
          <div className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl">
            <img 
              src={selectedImage} 
              alt="Selected leaf" 
              className="w-full h-auto max-h-[60vh] object-contain bg-black/5"
            />
          </div>
          
          {/* Overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          
          {/* Control buttons */}
          <button
            onClick={handleRemoveImage}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300
                      hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Remove image"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={triggerFileInput}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-all duration-300
                      hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Change image"
          >
            <Image className="w-5 h-5 text-primary-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;