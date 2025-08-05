export interface Race {
  id: string;
  name: string;
  distance: number;
  grade: 'G1' | 'G2' | 'G3' | 'OP' | 'Listed' | 'Maiden';
  track: 'Turf' | 'Dirt';
  month: number; // 1-12
  half: 'Early' | 'Late';
  careerPhase: 'Junior' | 'Classic' | 'Senior';
  location?: string;
  notes?: string;
}
export interface Filters {
  distance: string;
  grade: string;
  track: string;
  careerPhase: string;
  searchTerm: string;
}
