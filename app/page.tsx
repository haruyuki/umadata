'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import FilterBar from './components/FilterBar';
import TimelineList from './components/TimelineList';
import { Race, Filters } from './types';
import { loadRaceData } from './data';

export default function Home() {
  const [raceData, setRaceData] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    distance: 'All',
    grade: 'All',
    track: 'All',
    careerPhase: 'All',
    searchTerm: '',
  });

  // Load race data from JSON file
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const races = await loadRaceData();
        setRaceData(races);
      } catch (error) {
        console.error('Failed to load race data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Calendar className="text-primary mx-auto mb-4 h-12 w-12" />
          <div className="text-lg font-semibold">Loading race data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Updated Header to match reference design */}
      <header className="flex-shrink-0 border-b border-slate-700 bg-slate-900 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:py-3 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-3 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">UmaData</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          <div className="lg:col-span-5">
            <TimelineList races={raceData} filters={filters} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
