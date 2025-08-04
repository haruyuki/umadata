'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import FilterBar from './components/FilterBar';
import TimelineList from './components/TimelineList';
import PlanSidebar from './components/PlanSidebar';
import RacePreview from './components/RacePreview';
import { Race, SelectedRace, Filters, PlanState } from './types';
import { loadRaceData } from './data';

export default function Home() {
  const [raceData, setRaceData] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [planState, setPlanState] = useState<PlanState>({
    selectedRaces: [],
    filters: {
      distance: 'All',
      grade: 'All',
      surface: 'All',
      careerPhase: 'All',
      searchTerm: ''
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredRace, setHoveredRace] = useState<Race | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Load plan from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('umamusume-race-plan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlanState(parsed);
      } catch (error) {
        console.error('Error loading saved plan:', error);
      }
    }

    // Load plan from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const sharedPlan = urlParams.get('plan');
    if (sharedPlan) {
      try {
        const decoded = JSON.parse(atob(sharedPlan));
        setPlanState(decoded);
      } catch (error) {
        console.error('Error loading shared plan:', error);
      }
    }
  }, []);

  // Save plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('umamusume-race-plan', JSON.stringify(planState));
  }, [planState]);

  const handleFiltersChange = (newFilters: Filters) => {
    setPlanState(prev => ({ ...prev, filters: newFilters }));
  };

  const handleRaceToggle = (race: Race) => {
    setPlanState(prev => {
      const isSelected = prev.selectedRaces.some(selected => selected.id === race.id);

      if (isSelected) {
        const newSelected = prev.selectedRaces
          .filter(selected => selected.id !== race.id)
          .map((race, index) => ({ ...race, sequenceNumber: index + 1 }));

        return { ...prev, selectedRaces: newSelected };
      } else {
        const newSelected = [...prev.selectedRaces, {
          ...race,
          sequenceNumber: prev.selectedRaces.length + 1
        }];

        return { ...prev, selectedRaces: newSelected };
      }
    });
  };

  const handleRemoveRace = (raceId: string) => {
    setPlanState(prev => {
      const newSelected = prev.selectedRaces
        .filter(race => race.id !== raceId)
        .map((race, index) => ({ ...race, sequenceNumber: index + 1 }));

      return { ...prev, selectedRaces: newSelected };
    });
  };

  const handleReorderRaces = (newRaces: SelectedRace[]) => {
    setPlanState(prev => ({ ...prev, selectedRaces: newRaces }));
  };

  const handleSavePlan = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-success text-white px-6 py-3 rounded-xl shadow-lg';
    toast.textContent = '✅ Plan saved successfully!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleClearPlan = () => {
    if (confirm('Are you sure you want to clear your entire race plan?')) {
      setPlanState(prev => ({ ...prev, selectedRaces: [] }));
    }
  };

  const handleSharePlan = () => {
    const encoded = btoa(JSON.stringify(planState));
    const url = `${window.location.origin}${window.location.pathname}?plan=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 z-50 bg-accent text-white px-6 py-3 rounded-xl shadow-lg';
      toast.textContent = '🔗 Plan URL copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Plan URL copied to clipboard!');
    });
  };

  const handleRaceHover = useCallback((race: Race | null) => {
    setHoveredRace(race);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-border border-t-primary"></div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Loading Race Data</h2>
          <p className="text-text-secondary">Preparing your racing calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-secondary to-background flex flex-col" onMouseMove={handleMouseMove}>
      {/* Updated Header to match reference design */}
      <header className="border-b border-slate-700 bg-slate-900 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:py-3 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-3 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Uma Race Planner</h1>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden btn-modern px-6 py-3 gradient-primary text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <div className="w-6 h-6 gradient-secondary rounded-full flex items-center justify-center text-xs font-bold">
                {planState.selectedRaces.length}
              </div>
              Plan
            </button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar
        filters={planState.filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Timeline List */}
        <TimelineList
          races={raceData}
          selectedRaces={planState.selectedRaces}
          filters={planState.filters}
          onRaceToggle={handleRaceToggle}
          onRaceHover={handleRaceHover}
        />

        {/* Plan Sidebar */}
        <PlanSidebar
          selectedRaces={planState.selectedRaces}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onRemoveRace={handleRemoveRace}
          onReorderRaces={handleReorderRaces}
          onSavePlan={handleSavePlan}
          onClearPlan={handleClearPlan}
          onSharePlan={handleSharePlan}
        />
      </div>

      {/* Race Preview */}
      <RacePreview race={hoveredRace} position={mousePosition} />
    </div>
  );
}
