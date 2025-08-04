'use client';

import { Race, SelectedRace, Filters } from '../types';
import { monthNames } from '../data';

interface TimelineListProps {
  races: Race[];
  selectedRaces: SelectedRace[];
  filters: Filters;
  onRaceToggle: (race: Race) => void;
  onRaceHover: (race: Race | null) => void;
}

export default function TimelineList({
  races,
  selectedRaces,
  filters,
  onRaceToggle,
  onRaceHover
}: TimelineListProps) {
  // Filter races based on current filters
  const filteredRaces = races.filter(race => {
    const matchesSearch = filters.searchTerm === '' ||
      race.name.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesGrade = filters.grade === 'All' || race.grade === filters.grade;
    const matchesSurface = filters.surface === 'All' || race.surface === filters.surface;
    const matchesPhase = filters.careerPhase === 'All' || race.careerPhase === filters.careerPhase;

    const matchesDistance = filters.distance === 'All' || (() => {
      switch (filters.distance) {
        case 'Sprint (1000-1400m)': return race.distance <= 1400;
        case 'Mile (1500-1700m)': return race.distance >= 1500 && race.distance <= 1700;
        case 'Middle (1800-2200m)': return race.distance >= 1800 && race.distance <= 2200;
        case 'Long (2300m+)': return race.distance >= 2300;
        default: return true;
      }
    })();

    return matchesSearch && matchesGrade && matchesSurface && matchesPhase && matchesDistance;
  });

  // Check if any filters are active
  const hasActiveFilters = filters.searchTerm !== '' ||
    filters.grade !== 'All' ||
    filters.surface !== 'All' ||
    filters.careerPhase !== 'All' ||
    filters.distance !== 'All';

  // Generate all possible time slots
  const generateAllTimeSlots = () => {
    const allSlots: { careerPhase: string; month: number; half: string; races: Race[] }[] = [];
    const careerPhases = ['Junior', 'Classic', 'Senior'];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const halves = ['Early', 'Late'];

    careerPhases.forEach(phase => {
      months.forEach(month => {
        halves.forEach(half => {
          const racesInSlot = filteredRaces.filter(race =>
            race.careerPhase === phase &&
            race.month === month &&
            race.half === half
          );

          allSlots.push({
            careerPhase: phase,
            month,
            half,
            races: racesInSlot
          });
        });
      });
    });

    return allSlots;
  };

  // Group races by career phase, month, and half
  const groupedRaces = filteredRaces.reduce((acc, race) => {
    const key = `${race.careerPhase}-${race.month}-${race.half}`;
    if (!acc[key]) {
      acc[key] = {
        careerPhase: race.careerPhase,
        month: race.month,
        half: race.half,
        races: []
      };
    }
    acc[key].races.push(race);
    return acc;
  }, {} as Record<string, { careerPhase: string; month: number; half: string; races: Race[] }>);

  // Use either all time slots or filtered groups based on filter state
  const timeSlots = hasActiveFilters ? Object.values(groupedRaces) : generateAllTimeSlots();

  // Sort the groups chronologically
  const sortedGroups = timeSlots.sort((a, b) => {
    const phaseOrder = { Junior: 0, Classic: 1, Senior: 2 };
    const halfOrder = { Early: 0, Late: 1 };

    if (a.careerPhase !== b.careerPhase) {
      return phaseOrder[a.careerPhase as keyof typeof phaseOrder] - phaseOrder[b.careerPhase as keyof typeof phaseOrder];
    }
    if (a.month !== b.month) {
      return a.month - b.month;
    }
    return halfOrder[a.half as keyof typeof halfOrder] - halfOrder[b.half as keyof typeof halfOrder];
  });

  const isRaceSelected = (race: Race) => {
    return selectedRaces.some(selected => selected.id === race.id);
  };

  const getSelectedRaceNumber = (race: Race) => {
    const selected = selectedRaces.find(selected => selected.id === race.id);
    return selected?.sequenceNumber;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'G1': return 'bg-[#3785e4] text-white';
      case 'G2': return 'bg-[#f45a86] text-white';
      case 'G3': return 'bg-[#58c470] text-white';
      case 'OP': return 'bg-[#ffad0b] text-white';
      case 'Listed': return 'from-gray-400 to-slate-500 text-white';
      case 'Maiden': return 'from-pink-400 to-rose-500 text-white';
      default: return 'from-gray-400 to-slate-500 text-white';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Junior': return 'from-green-500 to-emerald-600';
      case 'Classic': return 'from-blue-500 to-indigo-600';
      case 'Senior': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin bg-gradient-to-br from-surface-secondary to-background">
      <div className="max-w-7xl mx-auto">
        {sortedGroups.map((group) => (
          <div key={`${group.careerPhase}-${group.month}-${group.half}`} className="border-b border-border-light last:border-b-0">
            <div className="flex bg-surface/50 backdrop-blur-sm">
              {/* Modern sticky left columns */}
              <div className="sticky left-0 z-20 bg-surface/90 backdrop-blur-md border-r border-border flex shadow-lg">
                <div className={`w-28 px-4 py-6 text-sm font-bold text-white bg-gradient-to-br ${getPhaseColor(group.careerPhase)} flex items-center justify-center`}>
                  <span className="transform -rotate-0 text-center leading-tight">
                    {group.careerPhase}
                  </span>
                </div>
                <div className="w-36 px-4 py-6 text-sm font-semibold text-text-primary bg-surface/95 flex items-center">
                  <div>
                    <div className="font-bold text-base">{monthNames[group.month - 1]}</div>
                    <div className="text-text-secondary text-xs">{group.half}</div>
                  </div>
                </div>
              </div>

              {/* Modern race cards */}
              <div className="flex-1 p-6">
                <div className="flex flex-wrap gap-4">
                  {group.races.map((race) => {
                    const selected = isRaceSelected(race);
                    const sequenceNumber = getSelectedRaceNumber(race);

                    return (
                      <div
                        key={race.id}
                        onClick={() => onRaceToggle(race)}
                        onMouseEnter={() => onRaceHover(race)}
                        onMouseLeave={() => onRaceHover(null)}
                        className={`
                          relative cursor-pointer rounded-2xl p-4 min-w-[240px] max-w-[320px] group
                          transition-all duration-300 hover:scale-105 hover:-translate-y-1
                          ${selected 
                            ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary shadow-xl card-shadow-lg' 
                            : 'bg-surface border border-border hover:border-primary/50 card-shadow hover:card-shadow-lg'
                          }
                        `}
                      >
                        {/* Sequence number badge */}
                        {selected && (
                          <div className="absolute -top-3 -right-3 w-8 h-8 gradient-secondary rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                            {sequenceNumber}
                          </div>
                        )}

                        {/* Selection indicator */}
                        {selected && (
                          <div className="absolute top-3 left-3 w-3 h-3 bg-success rounded-full shadow-md"></div>
                        )}

                        {/* Race content */}
                        <div className="space-y-3">
                          <div className="font-bold text-text-primary text-base leading-tight line-clamp-2">
                            {race.name}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getGradeColor(race.grade)} shadow-sm`}>
                              {race.grade}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-secondary text-text-secondary border border-border">
                              {race.distance}m
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              race.surface === 'Turf' 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {race.surface}
                            </span>
                          </div>

                          {race.location && (
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {race.location}
                            </div>
                          )}
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 rounded-2xl transition-all duration-300"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
