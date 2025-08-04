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
    <div className="bg-surface border-b border-gray-200 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search races..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Career Phase Filter */}
          <select
            value={filters.careerPhase}
            onChange={(e) => updateFilter('careerPhase', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="All">All Phases</option>
            {careerPhases.map(phase => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={filters.grade}
            onChange={(e) => updateFilter('grade', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>{grade === 'All' ? 'All Grades' : grade}</option>
            ))}
          </select>

          {/* Surface Filter */}
          <select
            value={filters.surface}
            onChange={(e) => updateFilter('surface', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {surfaceOptions.map(surface => (
              <option key={surface} value={surface}>{surface === 'All' ? 'All Surfaces' : surface}</option>
            ))}
          </select>

          {/* Distance Filter */}
          <select
            value={filters.distance}
            onChange={(e) => updateFilter('distance', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {distanceRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>

          {/* Clear Button */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
