'use client';

import { useState, useEffect, useCallback } from 'react';
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
    // Show modern toast notification
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
      // Show modern toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 z-50 bg-accent text-white px-6 py-3 rounded-xl shadow-lg';
      toast.textContent = '🔗 Plan URL copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
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
      {/* Modern Header */}
      <header className="glass card-shadow-lg border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                🏇
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Uma Race Planner
                </h1>
                <p className="text-text-secondary font-medium">Plan your 3-year racing career with style</p>
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
