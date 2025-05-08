import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LeafAnalysisResult } from '../types';

const API_KEY = 'AIzaSyDgMq_XN04HPlT-G-skttYMtT0XnTg02CI';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface LeafAnalysisContextType {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  isAnalyzing: boolean;
  analysisResult: LeafAnalysisResult | null;
  startAnalysis: () => Promise<void>;
  resetAnalysis: () => void;
  error: string | null;
}

const LeafAnalysisContext = createContext<LeafAnalysisContextType | undefined>(undefined);

export const useLeafAnalysis = () => {
  const context = useContext(LeafAnalysisContext);
  if (!context) {
    throw new Error('useLeafAnalysis must be used within a LeafAnalysisProvider');
  }
  return context;
};

interface LeafAnalysisProviderProps {
  children: ReactNode;
}

export const LeafAnalysisProvider: React.FC<LeafAnalysisProviderProps> = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LeafAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Remove the data URL prefix to get the base64 image data
      const base64Image = selectedImage.split(',')[1];

      const prompt = `You are a plant expert specializing in vegetable identification. Analyze this leaf image and identify the exact vegetable plant it belongs to. 
      Common vegetables to identify include: Tomato, Brinjal (Eggplant), Ladies Finger (Okra), Chili, Capsicum, etc.
      
      Look for specific leaf characteristics:
      - Leaf shape and size
      - Leaf margin (edges)
      - Leaf venation pattern
      - Leaf color and texture
      - Any distinctive features
      
      Return the analysis in this exact JSON format:
      {
        "name": "exact vegetable name (e.g., 'Tomato', 'Brinjal', 'Ladies Finger')",
        "scientificName": "scientific name of the vegetable",
        "type": "vegetable type (e.g., 'Solanaceous Vegetable' for tomato/brinjal, 'Malvaceous Vegetable' for okra)",
        "health": "Healthy or Diseased",
        "waterNeeds": "specific watering requirements for this vegetable",
        "sunlight": "specific sunlight requirements for this vegetable",
        "temperature": "optimal temperature range for this vegetable",
        "careInstructions": "specific care instructions for this vegetable",
        "disease": {
          "name": "disease name if any",
          "description": "disease description",
          "remedies": ["remedy1", "remedy2", "remedy3"],
          "fertilizers": [
            {
              "name": "fertilizer name",
              "composition": "chemical composition",
              "application": "application instructions"
            }
          ]
        }
      }

      Be very specific about the vegetable identification. If you're not completely certain, indicate that in the name field.`;

      const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to analyze image');
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from API');
      }

      // Extract the JSON response from Gemini's text output
      const responseText = data.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Could not parse API response');
      }

      try {
        const result = JSON.parse(jsonMatch[0]) as LeafAnalysisResult;
        
        // Validate the result structure
        if (!result.name || !result.type || !result.health) {
          throw new Error('Invalid analysis result structure');
        }

        setAnalysisResult(result);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Failed to parse analysis results');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setError(null);
  };

  const value = {
    selectedImage,
    setSelectedImage,
    isAnalyzing,
    analysisResult,
    startAnalysis,
    resetAnalysis,
    error
  };

  return (
    <LeafAnalysisContext.Provider value={value}>
      {children}
    </LeafAnalysisContext.Provider>
  );
};