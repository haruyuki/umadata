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

  // Sort the groups chronologically
  const sortedGroups = Object.values(groupedRaces).sort((a, b) => {
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
      case 'G1': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'G2': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'G3': return 'bg-green-100 text-green-800 border-green-300';
      case 'OP': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Listed': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Maiden': return 'bg-pink-100 text-pink-800 border-pink-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto">
        {sortedGroups.map((group) => (
          <div key={`${group.careerPhase}-${group.month}-${group.half}`} className="border-b border-gray-200">
            <div className="flex bg-surface-secondary">
              {/* Sticky left columns */}
              <div className="sticky left-0 z-10 bg-surface-secondary border-r border-gray-300 flex">
                <div className="w-24 px-3 py-4 text-sm font-semibold text-text-primary border-r border-gray-200">
                  {group.careerPhase}
                </div>
                <div className="w-32 px-3 py-4 text-sm font-medium text-text-primary">
                  {monthNames[group.month - 1]} {group.half}
                </div>
              </div>

              {/* Race cards */}
              <div className="flex-1 p-4">
                <div className="flex flex-wrap gap-2">
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
                          relative cursor-pointer rounded-lg border p-3 min-w-[200px] max-w-[280px]
                          transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                          ${selected 
                            ? 'bg-primary/10 border-primary shadow-md' 
                            : 'bg-surface border-gray-200 hover:border-accent'
                          }
                        `}
                      >
                        {/* Sequence number badge */}
                        {selected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-white shadow">
                            {sequenceNumber}
                          </div>
                        )}

                        {/* Race info */}
                        <div className="space-y-2">
                          <div className="font-semibold text-text-primary text-sm leading-tight">
                            {race.name}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getGradeColor(race.grade)}`}>
                              {race.grade}
                            </span>
                            <span className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                              {race.distance}m
                            </span>
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              race.surface === 'Turf' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {race.surface}
                            </span>
                          </div>

                          {race.location && (
                            <div className="text-xs text-gray-600">
                              📍 {race.location}
                            </div>
                          )}
                        </div>
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
