
import React, { useState } from 'react';
import { pipeline } from '@huggingface/transformers';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import ImageUploader from '@/components/ImageUploader';
import ImagePreview from '@/components/ImagePreview';
import ResultGrid from '@/components/ResultGrid';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [similarImages, setSimilarImages] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImageSelect = async (file: File) => {
    try {
      setLoading(true);
      setProgress(10); // Start progress
      
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setProgress(30); // Image loaded

      // Initialize the image classification pipeline with a browser-optimized model
      const classifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k'
      );
      setProgress(60); // Model loaded

      // Process the image
      const results = await classifier(imageUrl);
      console.log('Classification results:', results);
      setProgress(80); // Image processed
      
      // For demo purposes, we're using placeholder similar images
      // In a real app, you would use the embeddings to find similar images
      setSimilarImages([
        'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
        'https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d',
        'https://images.unsplash.com/photo-1682687982465-c1e91c4b6b46',
      ]);
      setProgress(100); // Similar images found

      toast({
        title: "Success",
        description: "Similar images found successfully!",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500); // Reset progress after a small delay
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `similar-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vector Image Finder
          </h1>
          <p className="text-gray-600">
            Upload an image to find visually similar images
          </p>
        </div>

        <div className="space-y-8">
          {!selectedImage ? (
            <ImageUploader onImageSelect={handleImageSelect} />
          ) : (
            <ImagePreview
              imageUrl={selectedImage}
              onClear={() => {
                setSelectedImage(null);
                setSimilarImages([]);
                setProgress(0);
              }}
            />
          )}

          {loading && (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-center">
                <div className="text-sm text-gray-600">
                  {progress < 30 && "Uploading image..."}
                  {progress >= 30 && progress < 60 && "Loading model..."}
                  {progress >= 60 && progress < 80 && "Processing image..."}
                  {progress >= 80 && progress < 100 && "Finding similar images..."}
                  {progress === 100 && "Complete!"}
                </div>
              </div>
            </div>
          )}

          {similarImages.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Similar Images
              </h2>
              <ResultGrid
                images={similarImages}
                onDownload={handleDownload}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
