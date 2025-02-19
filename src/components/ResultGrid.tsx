
import React from 'react';
import { Download } from 'lucide-react';

interface ResultGridProps {
  images: string[];
  onDownload: (imageUrl: string) => void;
}

const ResultGrid = ({ images, onDownload }: ResultGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((imageUrl, index) => (
        <div key={index} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <img
            src={imageUrl}
            alt={`Similar image ${index + 1}`}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={() => onDownload(imageUrl)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Download className="h-6 w-6 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ResultGrid;
