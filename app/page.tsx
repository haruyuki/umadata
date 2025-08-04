'use client';

import { useState, useEffect, useCallback } from 'react';
import FilterBar from './components/FilterBar';
import TimelineList from './components/TimelineList';
import PlanSidebar from './components/PlanSidebar';
import RacePreview from './components/RacePreview';
import { Race, SelectedRace, Filters, PlanState } from './types';
import { raceData } from './data';

export default function Home() {
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
        // Remove race and update sequence numbers
        const newSelected = prev.selectedRaces
          .filter(selected => selected.id !== race.id)
          .map((race, index) => ({ ...race, sequenceNumber: index + 1 }));

        return { ...prev, selectedRaces: newSelected };
      } else {
        // Add race with next sequence number
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
    // Already auto-saved to localStorage
    alert('Plan saved successfully!');
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
      alert('Plan URL copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
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

  return (
    <div className="min-h-screen bg-background flex flex-col" onMouseMove={handleMouseMove}>
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏇</div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Umamusume Race Planner</h1>
                <p className="text-sm text-gray-600">Plan your 3-year racing career</p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Plan ({planState.selectedRaces.length})
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
