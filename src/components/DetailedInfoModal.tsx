import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, BookOpen, Droplets, Sun, ThermometerSun, Bug, Leaf, Clock, Shield } from 'lucide-react';
import { DetailedPlantInfo } from '../types';

interface DetailedInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantName: string;
  scientificName: string;
  hasDisease: boolean;
}

const API_KEY = 'AIzaSyD2AUHZzqdbwhDFKnTXJIZCsIPvR3nyJDM';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const DetailedInfoModal: React.FC<DetailedInfoModalProps> = ({
  isOpen,
  onClose,
  plantName,
  scientificName,
  hasDisease
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<DetailedPlantInfo | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    generalInfo: true,
    growingGuide: true,
    maintenance: true,
    harvesting: true,
    diseaseManagement: true
  });

  useEffect(() => {
    if (isOpen) {
      fetchDetailedInfo();
    }
  }, [isOpen, plantName]);

  const fetchDetailedInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `Provide detailed information about ${plantName} (${scientificName}). 
      Focus on comprehensive growing and care instructions. ${hasDisease ? 'Include detailed disease management information.' : ''}
      
      Return the information in this exact JSON format:
      {
        "generalInfo": {
          "description": "detailed description of the plant",
          "origin": "origin and history",
          "growthHabit": "growth habit and characteristics",
          "lifeCycle": "life cycle information"
        },
        "growingGuide": {
          "soilRequirements": "detailed soil requirements",
          "plantingInstructions": "step by step planting guide",
          "wateringSchedule": "detailed watering schedule",
          "sunlightRequirements": "specific sunlight needs",
          "temperatureRange": "optimal temperature range",
          "humidityNeeds": "humidity requirements"
        },
        "maintenance": {
          "pruning": "pruning instructions",
          "fertilizing": "fertilizing schedule and methods",
          "pestControl": "pest control measures",
          "commonProblems": ["problem1", "problem2", "problem3"]
        },
        "harvesting": {
          "whenToHarvest": "harvest timing",
          "howToHarvest": "harvesting techniques",
          "storage": "storage instructions"
        },
        "diseaseManagement": {
          "commonDiseases": [
            {
              "name": "disease name",
              "symptoms": ["symptom1", "symptom2"],
              "causes": ["cause1", "cause2"],
              "prevention": ["prevention1", "prevention2"],
              "treatment": ["treatment1", "treatment2"]
            }
          ],
          "preventiveMeasures": ["measure1", "measure2"],
          "organicControl": ["control1", "control2"]
        }
      }`;

      const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
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
        throw new Error('Failed to fetch detailed information');
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const info = JSON.parse(jsonMatch[0]) as DetailedPlantInfo;
      setPlantInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Detailed Information: {plantName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center p-4">
              {error}
            </div>
          ) : plantInfo ? (
            <div className="space-y-6">
              {/* General Info Section */}
              <section>
                <button
                  onClick={() => toggleSection('generalInfo')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-medium text-gray-800">General Information</h3>
                  </div>
                  {expandedSections.generalInfo ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.generalInfo && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-600 mb-4">{plantInfo.generalInfo.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Origin</h4>
                        <p className="text-gray-600">{plantInfo.generalInfo.origin}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Growth Habit</h4>
                        <p className="text-gray-600">{plantInfo.generalInfo.growthHabit}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Life Cycle</h4>
                        <p className="text-gray-600">{plantInfo.generalInfo.lifeCycle}</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Growing Guide Section */}
              <section>
                <button
                  onClick={() => toggleSection('growingGuide')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-medium text-gray-800">Growing Guide</h3>
                  </div>
                  {expandedSections.growingGuide ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.growingGuide && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Soil Requirements</h4>
                        <p className="text-gray-600">{plantInfo.growingGuide.soilRequirements}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Planting Instructions</h4>
                        <p className="text-gray-600">{plantInfo.growingGuide.plantingInstructions}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Watering Schedule</h4>
                        <p className="text-gray-600">{plantInfo.growingGuide.wateringSchedule}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Sunlight Requirements</h4>
                        <p className="text-gray-600">{plantInfo.growingGuide.sunlightRequirements}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Temperature Range</h4>
                        <p className="text-gray-600">{plantInfo.growingGuide.temperatureRange}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Humidity Needs</h4>
                        <p className="text-gray-600">{plantInfo.growingGuide.humidityNeeds}</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Maintenance Section */}
              <section>
                <button
                  onClick={() => toggleSection('maintenance')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-medium text-gray-800">Maintenance</h3>
                  </div>
                  {expandedSections.maintenance ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.maintenance && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Pruning</h4>
                        <p className="text-gray-600">{plantInfo.maintenance.pruning}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Fertilizing</h4>
                        <p className="text-gray-600">{plantInfo.maintenance.fertilizing}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Pest Control</h4>
                        <p className="text-gray-600">{plantInfo.maintenance.pestControl}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Common Problems</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {plantInfo.maintenance.commonProblems.map((problem, index) => (
                            <li key={index}>{problem}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Harvesting Section */}
              <section>
                <button
                  onClick={() => toggleSection('harvesting')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-medium text-gray-800">Harvesting</h3>
                  </div>
                  {expandedSections.harvesting ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.harvesting && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">When to Harvest</h4>
                        <p className="text-gray-600">{plantInfo.harvesting.whenToHarvest}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">How to Harvest</h4>
                        <p className="text-gray-600">{plantInfo.harvesting.howToHarvest}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Storage</h4>
                        <p className="text-gray-600">{plantInfo.harvesting.storage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Disease Management Section */}
              {hasDisease && plantInfo.diseaseManagement && (
                <section>
                  <button
                    onClick={() => toggleSection('diseaseManagement')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Bug className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-medium text-gray-800">Disease Management</h3>
                    </div>
                    {expandedSections.diseaseManagement ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedSections.diseaseManagement && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="space-y-6">
                        {plantInfo.diseaseManagement.commonDiseases.map((disease, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                            <h4 className="font-medium text-gray-800 mb-2">{disease.name}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-1">Symptoms</h5>
                                <ul className="list-disc list-inside text-gray-600">
                                  {disease.symptoms.map((symptom, i) => (
                                    <li key={i}>{symptom}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-1">Causes</h5>
                                <ul className="list-disc list-inside text-gray-600">
                                  {disease.causes.map((cause, i) => (
                                    <li key={i}>{cause}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-1">Prevention</h5>
                                <ul className="list-disc list-inside text-gray-600">
                                  {disease.prevention.map((prevention, i) => (
                                    <li key={i}>{prevention}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-1">Treatment</h5>
                                <ul className="list-disc list-inside text-gray-600">
                                  {disease.treatment.map((treatment, i) => (
                                    <li key={i}>{treatment}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Preventive Measures</h4>
                          <ul className="list-disc list-inside text-gray-600">
                            {plantInfo.diseaseManagement.preventiveMeasures.map((measure, index) => (
                              <li key={index}>{measure}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Organic Control</h4>
                          <ul className="list-disc list-inside text-gray-600">
                            {plantInfo.diseaseManagement.organicControl.map((control, index) => (
                              <li key={index}>{control}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DetailedInfoModal; 