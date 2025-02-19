
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const ImageUploader = ({ onImageSelect }: ImageUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`relative overflow-hidden rounded-xl border-2 border-dashed p-12 transition-all duration-300 ease-in-out
        ${isDragActive 
          ? 'border-primary bg-primary/5 scale-102'
          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            or click to browse (JPEG, PNG, WebP)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
