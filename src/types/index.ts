export interface LeafAnalysisResult {
  name: string;
  scientificName: string;
  type: string;
  health: 'Healthy' | 'Diseased';
  waterNeeds: string;
  sunlight: string;
  temperature: string;
  careInstructions: string;
  accuracy: number;
  disease?: {
    name: string;
    description: string;
    remedies: string[];
    fertilizers: {
      name: string;
      composition: string;
      application: string;
    }[];
  };
}

export interface DetailedPlantInfo {
  generalInfo: {
    description: string;
    origin: string;
    growthHabit: string;
    lifeCycle: string;
  };
  growingGuide: {
    soilRequirements: string;
    plantingInstructions: string;
    wateringSchedule: string;
    sunlightRequirements: string;
    temperatureRange: string;
    humidityNeeds: string;
  };
  maintenance: {
    pruning: string;
    fertilizing: string;
    pestControl: string;
    commonProblems: string[];
  };
  harvesting: {
    whenToHarvest: string;
    howToHarvest: string;
    storage: string;
  };
  diseaseManagement?: {
    commonDiseases: Array<{
      name: string;
      symptoms: string[];
      causes: string[];
      prevention: string[];
      treatment: string[];
    }>;
    preventiveMeasures: string[];
    organicControl: string[];
  };
}