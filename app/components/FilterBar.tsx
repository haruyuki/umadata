'use client';

import { Filters } from '../types';
import { gradeOptions, surfaceOptions, distanceRanges, careerPhases } from '../data';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      distance: 'All',
      grade: 'All',
      surface: 'All',
      careerPhase: 'All',
      searchTerm: ''
    });
  };

  return (
    <div className="glass card-shadow-lg border-0 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[250px] relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search races..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus-modern text-text-primary placeholder-text-muted font-medium"
            />
          </div>

          {/* Career Phase Filter */}
          <div className="relative">
            <select
              value={filters.careerPhase}
              onChange={(e) => updateFilter('careerPhase', e.target.value)}
              className="appearance-none bg-surface border border-border rounded-xl px-4 py-3 pr-10 focus-modern text-text-primary font-medium cursor-pointer hover:bg-surface-hover"
            >
              <option value="All">All Phases</option>
              {careerPhases.map(phase => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Grade Filter */}
          <div className="relative">
            <select
              value={filters.grade}
              onChange={(e) => updateFilter('grade', e.target.value)}
              className="appearance-none bg-surface border border-border rounded-xl px-4 py-3 pr-10 focus-modern text-text-primary font-medium cursor-pointer hover:bg-surface-hover"
            >
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade === 'All' ? 'All Grades' : grade}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Surface Filter */}
          <div className="relative">
            <select
              value={filters.surface}
              onChange={(e) => updateFilter('surface', e.target.value)}
              className="appearance-none bg-surface border border-border rounded-xl px-4 py-3 pr-10 focus-modern text-text-primary font-medium cursor-pointer hover:bg-surface-hover"
            >
              {surfaceOptions.map(surface => (
                <option key={surface} value={surface}>{surface === 'All' ? 'All Surfaces' : surface}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Distance Filter */}
          <div className="relative">
            <select
              value={filters.distance}
              onChange={(e) => updateFilter('distance', e.target.value)}
              className="appearance-none bg-surface border border-border rounded-xl px-4 py-3 pr-10 focus-modern text-text-primary font-medium cursor-pointer hover:bg-surface-hover"
            >
              {distanceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={clearFilters}
            className="btn-modern px-6 py-3 text-sm bg-surface-secondary hover:bg-surface-hover text-text-secondary rounded-xl transition-all duration-200 font-medium border border-border-light hover:border-border"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
