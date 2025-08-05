'use client';

import { Race, Filters } from '../types';
import { monthNames } from '../data';
import RaceCard from './RaceCard';

interface TimelineListProps {
  races: Race[];
  filters: Filters;
}

export default function TimelineList({ races, filters }: TimelineListProps) {
  // Filter races based on current filters
  const filteredRaces = races.filter((race) => {
    const matchesSearch =
      filters.searchTerm === '' ||
      race.name.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesGrade = filters.grade === 'All' || race.grade === filters.grade;
    const matchesSurface = filters.track === 'All' || race.track === filters.track;
    const matchesPhase = filters.careerPhase === 'All' || race.careerPhase === filters.careerPhase;

    const matchesDistance =
      filters.distance === 'All' ||
      (() => {
        switch (filters.distance) {
          case 'Sprint (1000-1400m)':
            return race.distance <= 1400;
          case 'Mile (1500-1700m)':
            return race.distance >= 1500 && race.distance <= 1700;
          case 'Middle (1800-2200m)':
            return race.distance >= 1800 && race.distance <= 2200;
          case 'Long (2300m+)':
            return race.distance >= 2300;
          default:
            return true;
        }
      })();

    return matchesSearch && matchesGrade && matchesSurface && matchesPhase && matchesDistance;
  });

  // Check if any filters are active
  const hasActiveFilters =
    filters.searchTerm !== '' ||
    filters.grade !== 'All' ||
    filters.track !== 'All' ||
    filters.careerPhase !== 'All' ||
    filters.distance !== 'All';

  // Generate all possible time slots
  const generateAllTimeSlots = () => {
    const allSlots: { careerPhase: string; month: number; half: string; races: Race[] }[] = [];
    const careerPhases = ['Junior', 'Classic', 'Senior'];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const halves = ['Early', 'Late'];

    careerPhases.forEach((phase) => {
      months.forEach((month) => {
        halves.forEach((half) => {
          if (phase === 'Junior' && (month < 7 || (month === 7 && half === 'Early'))) {
            return;
          }
          const racesInSlot = filteredRaces.filter(
            (race) => race.careerPhase === phase && race.month === month && race.half === half,
          );

          allSlots.push({
            careerPhase: phase,
            month,
            half,
            races: racesInSlot,
          });
        });
      });
    });

    return allSlots;
  };

  // Group races by career phase, month, and half
  const groupedRaces = filteredRaces.reduce(
    (acc, race) => {
      const key = `${race.careerPhase}-${race.month}-${race.half}`;
      if (!acc[key]) {
        acc[key] = {
          careerPhase: race.careerPhase,
          month: race.month,
          half: race.half,
          races: [],
        };
      }
      acc[key].races.push(race);
      return acc;
    },
    {} as Record<string, { careerPhase: string; month: number; half: string; races: Race[] }>,
  );

  // Use either all time slots or filtered groups based on filter state
  const timeSlots = hasActiveFilters ? Object.values(groupedRaces) : generateAllTimeSlots();

  // Sort the groups chronologically
  const sortedGroups = timeSlots.sort((a, b) => {
    const phaseOrder = { Junior: 0, Classic: 1, Senior: 2 };
    const halfOrder = { Early: 0, Late: 1 };

    if (a.careerPhase !== b.careerPhase) {
      return (
        phaseOrder[a.careerPhase as keyof typeof phaseOrder] -
        phaseOrder[b.careerPhase as keyof typeof phaseOrder]
      );
    }
    if (a.month !== b.month) {
      return a.month - b.month;
    }
    return (
      halfOrder[a.half as keyof typeof halfOrder] - halfOrder[b.half as keyof typeof halfOrder]
    );
  });

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-full">
        {sortedGroups.map((group) => (
          <div
            key={`${group.careerPhase}-${group.month}-${group.half}`}
            className="border-border-light border-b last:border-b-0"
          >
            <div className="bg-surface/50 flex">
              <div
                className={`flex w-20 items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-6 text-sm font-bold text-white`}
              >
                <span>{group.careerPhase}</span>
              </div>
              <div className="bg-surface/95 flex w-30 items-center px-4 py-6 text-sm font-semibold">
                <div>
                  <div className="text-base font-bold">{monthNames[group.month - 1]}</div>
                  <div className="text-text-secondary text-xs">{group.half}</div>
                </div>
              </div>

              {/* Modern race cards */}
              <div className="flex-1 p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.races.length > 0 ? (
                    group.races.map((race) => <RaceCard key={race.id} race={race} />)
                  ) : (
                    <div className="bg-surface border-border col-span-full rounded-xl border-2 border-dashed py-10 text-center">
                      No races found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
