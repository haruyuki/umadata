export interface Race {
  id: number;
  name: string;
  name_jp: string;
  name_en: string;
  name_ko?: string;
  name_tw?: string;
  grade: 'G1' | 'G2' | 'G3' | 'OP' | 'Pre-OP' | 'Maiden';
  distance: number;
  direction: 'Right' | 'Left' | 'Right (Outer)' | 'Straight';
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
