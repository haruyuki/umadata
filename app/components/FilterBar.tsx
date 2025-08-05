'use client';

import { Filters } from '../types';
import { gradeOptions, trackOptions, distanceRanges, careerPhases } from '../data';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: {
    distance: string;
    grade: string;
    track: string;
    careerPhase: string;
    searchTerm: string;
  }) => void;
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      distance: 'All',
      grade: 'All',
      track: 'All',
      careerPhase: 'All',
      searchTerm: '',
    });
  };

  return (
    <div className="card-shadow-lg border-0">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="text-text-muted h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search races..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="bg-surface border-border focus-modern text-text-primary placeholder-text-muted w-full rounded-xl border py-3 pr-4 pl-10 font-medium"
            />
          </div>

          {/* Career Phase Filter */}
          <div className="relative">
            <select
              value={filters.careerPhase}
              onChange={(e) => updateFilter('careerPhase', e.target.value)}
              className="bg-surface border-border focus-modern text-text-primary hover:bg-surface-hover w-full cursor-pointer appearance-none rounded-xl border px-4 py-3 pr-10 font-medium"
            >
              <option value="All">All Phases</option>
              {careerPhases.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg
                className="text-text-muted h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Grade Filter */}
          <div className="relative">
            <select
              value={filters.grade}
              onChange={(e) => updateFilter('grade', e.target.value)}
              className="bg-surface border-border focus-modern text-text-primary hover:bg-surface-hover w-full cursor-pointer appearance-none rounded-xl border px-4 py-3 pr-10 font-medium"
            >
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade === 'All' ? 'All Grades' : grade}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg
                className="text-text-muted h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Surface Filter */}
          <div className="relative">
            <select
              value={filters.track}
              onChange={(e) => updateFilter('track', e.target.value)}
              className="bg-surface border-border focus-modern text-text-primary hover:bg-surface-hover w-full cursor-pointer appearance-none rounded-xl border px-4 py-3 pr-10 font-medium"
            >
              {trackOptions.map((track) => (
                <option key={track} value={track}>
                  {track === 'All' ? 'All Tracks' : track}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg
                className="text-text-muted h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Distance Filter */}
          <div className="relative">
            <select
              value={filters.distance}
              onChange={(e) => updateFilter('distance', e.target.value)}
              className="bg-surface border-border focus-modern text-text-primary hover:bg-surface-hover w-full cursor-pointer appearance-none rounded-xl border px-4 py-3 pr-10 font-medium"
            >
              {distanceRanges.map((distance) => (
                <option key={distance} value={distance}>
                  {distance}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg
                className="text-text-muted h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-modern w-full rounded-xl px-4 py-3 font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
