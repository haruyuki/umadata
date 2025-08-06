import { Race } from './types';

// Load race data from JSON file
export const loadRaceData = async (): Promise<Race[]> => {
  try {
    const response = await fetch('/umamusume/data/races.json');
    if (!response.ok) {
      console.error('Failed to fetch race data');
      return [];
    }
    const data = await response.json();
    return data.races;
  } catch (error) {
    console.error('Error loading race data:', error);
    return [];
  }
};

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const careerPhases = ['Junior', 'Classic', 'Senior'] as const;
export const gradeOptions = ['All', 'G1', 'G2', 'G3', 'OP', 'Listed', 'Maiden'] as const;
export const trackOptions = ['All', 'Turf', 'Dirt'] as const;
export const distanceRanges = [
  'All',
  'Sprint (1000-1400m)',
  'Mile (1500-1700m)',
  'Middle (1800-2200m)',
  'Long (2300m+)',
] as const;
