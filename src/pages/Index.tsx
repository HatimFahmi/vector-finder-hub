
import React, { useState } from 'react';
import { pipeline } from '@huggingface/transformers';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import ImageUploader from '@/components/ImageUploader';
import ImagePreview from '@/components/ImagePreview';
import ResultGrid from '@/components/ResultGrid';
import { uploadImage, getSimilarImages, supabase } from '@/lib/supabase';

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
      
      // Upload image to Supabase Storage
      const imagePath = await uploadImage(file);
      setProgress(30);

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(imagePath);
      
      setSelectedImage(publicUrl);
      setProgress(50);

      // Initialize the image classification pipeline
      const classifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k'
      );
      setProgress(70);

      // Get similar images
      const similarResults = await getSimilarImages(publicUrl);
      setSimilarImages(similarResults.map((result: any) => result.url));
      setProgress(100);

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
      }, 500);
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
                  {progress >= 30 && progress < 50 && "Processing upload..."}
                  {progress >= 50 && progress < 70 && "Loading model..."}
                  {progress >= 70 && progress < 100 && "Finding similar images..."}
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
