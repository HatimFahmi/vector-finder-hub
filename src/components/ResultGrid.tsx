
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultGridProps {
  images: string[];
  onDownload: (imageUrl: string) => void;
}

const ResultGrid = ({ images, onDownload }: ResultGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <div className="relative rounded-xl overflow-hidden shadow-sm">
            <img
              src={imageUrl}
              alt={`Similar image ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button 
                onClick={() => onDownload(imageUrl)}
                variant="secondary"
                className="transform translate-y-4 group-hover:translate-y-0 transition-transform"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultGrid;
