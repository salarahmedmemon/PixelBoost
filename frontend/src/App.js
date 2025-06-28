import { useState } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { ImageUpload } from './components/ImageUpload';
import { ImagePreview } from './components/ImagePreview';
import { DownloadButton } from './components/DownloadButton';
import dotenv from 'dotenv';
dotenv.config();

export const App = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (file, url) => {
    setOriginalImage(url);
    setSelectedFile(file);
    setEnhancedImage(null);
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleEnhance = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const base64Image = await toBase64(selectedFile);

    try {
      const response = await axios.post(`${process.env.API_URL}`, { imageUrl: base64Image });

      // ✅ Updated response key
      const enhancedUrl = response.data.enhancedImageUrl;

      setEnhancedImage(enhancedUrl);
    } catch (error) {
      console.error('Error enhancing image', error);
    } finally {
      setLoading(false);
    }
};


  return (
    <div className="min-h-screen bg-zinc-800 position-relative">
      <Navbar />
      <ImageUpload onImageSelect={handleImageSelect} />
      {originalImage && <ImagePreview title="Original Image" image={originalImage} />}
      {originalImage && (
        <div className="flex justify-center mt-6">
          <button onClick={handleEnhance} className="bg-blue-600 absolute top-63 right-20 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        </div>
      )}
      {enhancedImage && <ImagePreview title="Enhanced Image" image={enhancedImage} />}
      {enhancedImage && <DownloadButton image={enhancedImage} />}
    </div>
  );
}