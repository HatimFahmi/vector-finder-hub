
import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  onClear: () => void;
}

const ImagePreview = ({ imageUrl, onClear }: ImagePreviewProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden">
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-64 object-cover rounded-xl"
      />
      <button
        onClick={onClear}
        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
};

export default ImagePreview;
