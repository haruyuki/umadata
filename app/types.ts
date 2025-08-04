export interface Race {
  id: string;
  name: string;
  distance: number;
  grade: 'G1' | 'G2' | 'G3' | 'OP' | 'Listed' | 'Maiden';
  surface: 'Turf' | 'Dirt';
  month: number; // 1-12
  half: 'Early' | 'Late';
  careerPhase: 'Junior' | 'Classic' | 'Senior';
  location?: string;
  notes?: string;
}

export interface SelectedRace extends Race {
  sequenceNumber: number;
}

export interface TimeSlot {
  careerPhase: 'Junior' | 'Classic' | 'Senior';
  month: number;
  half: 'Early' | 'Late';
  races: Race[];
}

export interface Filters {
  distance: string;
  grade: string;
  surface: string;
  careerPhase: string;
  searchTerm: string;
}

export interface PlanState {
  selectedRaces: SelectedRace[];
  filters: Filters;
}
