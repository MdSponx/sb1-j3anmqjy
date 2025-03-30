import { useState, useCallback } from 'react';

export function useImageViewer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = useCallback((url: string) => {
    setSelectedImage(url);
  }, []);

  const handleCloseImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return {
    selectedImage,
    handleImageSelect,
    handleCloseImage
  };
}