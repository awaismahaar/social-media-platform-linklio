"use client";
import { X } from 'lucide-react';
import React, { useEffect } from 'react'

const ImageModal = ({ image, onClose }) => {
    useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (image) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [image, onClose]);

  if (!image) return null;
  return (
     <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 z-40 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={32} />
        </button>
        <img
          src={image}
          alt="Full size"
          className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}

export default ImageModal