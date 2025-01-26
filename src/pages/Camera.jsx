import React, { useState, useContext, useEffect } from 'react';
import { Camera } from 'lucide-react';
import Anthropic from '@anthropic-ai/sdk';
import Header from '../components/Header';
import { UserContext } from '../App';
import NutritionLogger from '../components/NutritionLogger';

const CameraPage = () => {
  const user = useContext(UserContext);
  const [imageData, setImageData] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [parsedNutrition, setParsedNutrition] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [servings, setServings] = useState(1);
  const [shouldAnalyze, setShouldAnalyze] = useState(false);
  
  const handleServingsChange = (e) => {
    const { value } = e.target;
    
    // If the value is empty, allow it (so user can clear the input)
    if (value === '') {
      setServings('');
      return;
    }

    // Only update if the input is a valid number
    const numValue = value.replace(/[^0-9]/g, '');
    if (numValue) {
      const number = Number(numValue);
      // Ensure at least 1 serving
      setServings(number === 0 ? 1 : number);
    }
  };

  const parseNutritionResponse = (text) => {
    const lines = text.toLowerCase().split('\n');
    const nutritionData = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(':').map(item => item.trim());
      if (key && value) {
        nutritionData[key] = value;
      }
    });
    
    return nutritionData;
  };

  const handleLogSuccess = (docId) => {
    console.log('Successfully logged nutrition data with ID:', docId);
    // Clear the analysis and parsed nutrition after successful save
    setAnalysis('');
    setParsedNutrition(null);
  };

  const handleLogError = (error) => {
    console.error('Failed to log nutrition data:', error);
    // You could show an error message here
  };

  useEffect(() => {
    if (imageData && shouldAnalyze) {
      analyzeImage();
      setShouldAnalyze(false);
    }
  }, [imageData, shouldAnalyze]);

  const analyzeImage = async () => {
    console.log('Starting analysis...');
    console.log('Image data exists:', !!imageData);
    
    if (!imageData) {
      console.log('No image data available');
      setAnalysis('Error: No image data available');
      return;
    }

    try {
      const base64Data = imageData.split(',')[1];
      const anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true
      });

      console.log('Sending request to API...');
      
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
                media_type: "image/jpeg",
                data: base64Data
              }
            },
            {
              type: "text",
              text: `Analyze this nutrition label and return ONLY these values for ${servings} servings in exactly this format with no additional text or explanations:
name: [product name]
calories: [number]
fat: [number]
carbs: [number]
protein: [number]`
            }
          ]
        }]
      });

      console.log('Received API response');
      const analysisText = response.content[0].text;
      setAnalysis(analysisText);
      
      // Parse nutrition data
      const nutritionData = parseNutritionResponse(analysisText);
      setParsedNutrition(nutritionData);

    } catch (error) {
      console.error('Analysis error:', error);
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
        console.log('File selected');
        const file = e.target.files[0];
        if (!file) {
          console.log('No file selected');
          return;
        }
        
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        const reader = new FileReader();
        reader.onload = (event) => {
          console.log('FileReader completed');
          setImageData(event.target.result);
          setShowUpload(true);
          setShouldAnalyze(true);
          setTimeout(() => setShowUpload(false), 1000);
        };

        reader.onerror = (error) => {
          console.error('FileReader error:', error);
        };

        console.log('Starting FileReader...');
        reader.readAsDataURL(file);
      };
      
      input.click();
    } catch (err) {
      console.error('Error capturing image:', err);
      setAnalysis('Error capturing image');
    }
  };

  return (
    <div className="min-h-screen bg-offwhite overflow-hidden relative">
      {/* Abstract Shapes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-50 sm:w-80 sm:h-80"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full transform translate-x-1/2 translate-y-1/2 opacity-50 sm:w-64 sm:h-64"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
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
                  value={servings}
                  onChange={handleServingsChange}
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
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-gray-600 whitespace-pre-wrap">{analysis}</div>
                </div>
                
                {parsedNutrition && user && (
                  <NutritionLogger
                    nutritionData={parsedNutrition}
                    userId={user.user.uid}
                    onSuccess={handleLogSuccess}
                    onError={handleLogError}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;