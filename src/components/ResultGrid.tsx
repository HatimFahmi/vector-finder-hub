
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
        <div key={index} className="space-y-2">
          <div className="relative rounded-xl overflow-hidden shadow-sm">
            <img
              src={imageUrl}
              alt={`Similar image ${index + 1}`}
              className="w-full h-48 object-cover"
            />
          </div>
          <Button 
            onClick={() => onDownload(imageUrl)}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ResultGrid;
