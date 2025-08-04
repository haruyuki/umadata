import { Race } from './types';

export const raceData: Race[] = [
  // Junior Year
  {
    id: 'hopeful-stakes',
    name: 'Hopeful Stakes',
    distance: 2000,
    grade: 'G1',
    surface: 'Turf',
    month: 4,
    half: 'Early',
    careerPhase: 'Junior',
    location: 'Nakayama',
    notes: 'Important early G1 for juniors'
  },
  {
    id: 'artemis-stakes',
    name: 'Artemis Stakes',
    distance: 1600,
    grade: 'G3',
    surface: 'Turf',
    month: 4,
    half: 'Late',
    careerPhase: 'Junior',
    location: 'Tokyo',
  },
  {
    id: 'fantasy-stakes',
    name: 'Fantasy Stakes',
    distance: 1400,
    grade: 'G3',
    surface: 'Turf',
    month: 6,
    half: 'Early',
    careerPhase: 'Junior',
    location: 'Kyoto',
  },
  {
    id: 'kokura-2yo-stakes',
    name: 'Kokura 2-Year-Old Stakes',
    distance: 1200,
    grade: 'G3',
    surface: 'Turf',
    month: 8,
    half: 'Late',
    careerPhase: 'Junior',
    location: 'Kokura',
  },
  {
    id: 'junior-maiden-1',
    name: 'Rookie Maiden',
    distance: 1400,
    grade: 'Maiden',
    surface: 'Turf',
    month: 4,
    half: 'Early',
    careerPhase: 'Junior',
    location: 'Tokyo',
  },
  {
    id: 'satsuki-sho',
    name: 'Satsuki Sho (Japanese 2000 Guineas)',
    distance: 2000,
    grade: 'G1',
    surface: 'Turf',
    month: 4,
    half: 'Late',
    careerPhase: 'Classic',
    location: 'Nakayama',
    notes: 'First leg of Triple Crown'
  },
  {
    id: 'tokyo-yushun',
    name: 'Tokyo Yushun (Japanese Derby)',
    distance: 2400,
    grade: 'G1',
    surface: 'Turf',
    month: 5,
    half: 'Late',
    careerPhase: 'Classic',
    location: 'Tokyo',
    notes: 'Second leg of Triple Crown'
  },
  {
    id: 'kikuka-sho',
    name: 'Kikuka Sho (St. Leger)',
    distance: 3000,
    grade: 'G1',
    surface: 'Turf',
    month: 10,
    half: 'Late',
    careerPhase: 'Classic',
    location: 'Kyoto',
    notes: 'Final leg of Triple Crown'
  },
  {
    id: 'oka-sho',
    name: 'Oka Sho (Japanese 1000 Guineas)',
    distance: 1600,
    grade: 'G1',
    surface: 'Turf',
    month: 4,
    half: 'Early',
    careerPhase: 'Classic',
    location: 'Hanshin',
    notes: 'First leg of Fillies Triple Crown'
  },
  {
    id: 'yushun-himba',
    name: 'Yushun Himba (Japanese Oaks)',
    distance: 2400,
    grade: 'G1',
    surface: 'Turf',
    month: 5,
    half: 'Late',
    careerPhase: 'Classic',
    location: 'Tokyo',
    notes: 'Second leg of Fillies Triple Crown'
  },
  {
    id: 'shuka-sho',
    name: 'Shuka Sho',
    distance: 2000,
    grade: 'G1',
    surface: 'Turf',
    month: 10,
    half: 'Early',
    careerPhase: 'Classic',
    location: 'Kyoto',
    notes: 'Final leg of Fillies Triple Crown'
  },
  // Senior Year
  {
    id: 'takarazuka-kinen',
    name: 'Takarazuka Kinen',
    distance: 2200,
    grade: 'G1',
    surface: 'Turf',
    month: 6,
    half: 'Late',
    careerPhase: 'Senior',
    location: 'Hanshin',
    notes: 'Mid-year championship'
  },
  {
    id: 'tenno-sho-spring',
    name: 'Tenno Sho (Spring)',
    distance: 3200,
    grade: 'G1',
    surface: 'Turf',
    month: 4,
    half: 'Late',
    careerPhase: 'Senior',
    location: 'Kyoto',
    notes: 'Long distance championship'
  },
  {
    id: 'tenno-sho-autumn',
    name: 'Tenno Sho (Autumn)',
    distance: 2000,
    grade: 'G1',
    surface: 'Turf',
    month: 10,
    half: 'Late',
    careerPhase: 'Senior',
    location: 'Tokyo',
    notes: 'Autumn championship'
  },
  {
    id: 'japan-cup',
    name: 'Japan Cup',
    distance: 2400,
    grade: 'G1',
    surface: 'Turf',
    month: 11,
    half: 'Late',
    careerPhase: 'Senior',
    location: 'Tokyo',
    notes: 'International championship'
  },
  {
    id: 'arima-kinen',
    name: 'Arima Kinen',
    distance: 2500,
    grade: 'G1',
    surface: 'Turf',
    month: 12,
    half: 'Late',
    careerPhase: 'Senior',
    location: 'Nakayama',
    notes: 'Year-end grand prix'
  },
  {
    id: 'yasuda-kinen',
    name: 'Yasuda Kinen',
    distance: 1600,
    grade: 'G1',
    surface: 'Turf',
    month: 6,
    half: 'Early',
    careerPhase: 'Senior',
    location: 'Tokyo',
    notes: 'Mile championship'
  },
  {
    id: 'mile-championship',
    name: 'Mile Championship',
    distance: 1600,
    grade: 'G1',
    surface: 'Turf',
    month: 11,
    half: 'Early',
    careerPhase: 'Senior',
    location: 'Kyoto',
    notes: 'Autumn mile championship'
  },
  {
    id: 'sprint-stakes',
    name: 'Sprinters Stakes',
    distance: 1200,
    grade: 'G1',
    surface: 'Turf',
    month: 9,
    half: 'Late',
    careerPhase: 'Senior',
    location: 'Nakayama',
    notes: 'Sprint championship'
  },
  // Some G2/G3 races across phases
  {
    id: 'kyoto-kinen',
    name: 'Kyoto Kinen',
    distance: 2200,
    grade: 'G2',
    surface: 'Turf',
    month: 2,
    half: 'Early',
    careerPhase: 'Senior',
    location: 'Kyoto',
  },
  {
    id: 'hanshin-daishoten',
    name: 'Hanshin Daishoten',
    distance: 3000,
    grade: 'G2',
    surface: 'Turf',
    month: 3,
    half: 'Late',
    careerPhase: 'Senior',
    location: 'Hanshin',
  },
  // Dirt races
  {
    id: 'february-stakes',
    name: 'February Stakes',
    distance: 1600,
    grade: 'G1',
    surface: 'Dirt',
    month: 2,
    half: 'Late',
    careerPhase: 'Senior',
    location: 'Tokyo',
    notes: 'Major dirt race'
  },
  {
    id: 'champions-cup',
    name: 'Champions Cup',
    distance: 1800,
    grade: 'G1',
    surface: 'Dirt',
    month: 12,
    half: 'Early',
    careerPhase: 'Senior',
    location: 'Chukyo',
    notes: 'Year-end dirt championship'
  }
];

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const careerPhases = ['Junior', 'Classic', 'Senior'] as const;
export const gradeOptions = ['All', 'G1', 'G2', 'G3', 'OP', 'Listed', 'Maiden'] as const;
export const surfaceOptions = ['All', 'Turf', 'Dirt'] as const;
export const distanceRanges = [
  'All',
  'Sprint (1000-1400m)',
  'Mile (1500-1700m)',
  'Middle (1800-2200m)',
  'Long (2300m+)'
] as const;
