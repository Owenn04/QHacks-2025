import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import Anthropic from '@anthropic-ai/sdk';
import Header from '../components/Header';

const CameraPage = () => {
  const [imageData, setImageData] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [servings, setServings] = useState(1);

  const analyzeImage = async () => {
    try {
      const anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageData.split(',')[1]
              }
            },
            {
              type: "text",
              text: `Please analyze this nutrition label. Extract all nutritional information and calculate values for ${servings} servings. Return only the adjusted values with no additional text.`
            }
          ]
        }]
      });

      setAnalysis(response.content[0].text);
    } catch (error) {
      setAnalysis(`Error: ${error.message || 'Failed to analyze image'}`);
    }
  };

  const captureImage = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const pngData = canvas.toDataURL('image/png');
            setImageData(pngData);
            setShowUpload(true);
            setTimeout(() => setShowUpload(false), 1000);
            setTimeout(() => analyzeImage(), 100); // Add delay to ensure state is updated
          };
          img.src = event.target.result;
        };
        
        reader.readAsDataURL(file);
      };
      
      input.click();
    } catch (err) {
      console.error('Error capturing image:', err);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Scan Label</h1>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Servings
              </label>
              <input
                type="text"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button 
              onClick={captureImage}
              className="w-full bg-orange-400 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center"
            >
              <Camera className="mr-2" size={24} />
              Take Photo
            </button>
            {showUpload && 
              <p className="text-sm text-gray-500 mt-2 text-center">Image uploaded!</p>
            }
          </div>

          {analysis && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-gray-600 whitespace-pre-wrap">{analysis}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraPage;



