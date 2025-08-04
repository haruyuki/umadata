'use client';

import { SelectedRace } from '../types';
import { monthNames } from '../data';

interface PlanSidebarProps {
  selectedRaces: SelectedRace[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveRace: (raceId: string) => void;
  onReorderRaces: (races: SelectedRace[]) => void;
  onSavePlan: () => void;
  onClearPlan: () => void;
  onSharePlan: () => void;
}

export default function PlanSidebar({
  selectedRaces,
  isOpen,
  onClose,
  onRemoveRace,
  onReorderRaces,
  onSavePlan,
  onClearPlan,
  onSharePlan
}: PlanSidebarProps) {
  // Check for time slot conflicts
  const getConflicts = () => {
    const conflicts: Record<string, SelectedRace[]> = {};
    selectedRaces.forEach(race => {
      const key = `${race.careerPhase}-${race.month}-${race.half}`;
      if (!conflicts[key]) conflicts[key] = [];
      conflicts[key].push(race);
    });

    return Object.entries(conflicts).filter(([_, races]) => races.length > 1);
  };

  const conflicts = getConflicts();

  const moveRace = (fromIndex: number, toIndex: number) => {
    const newRaces = [...selectedRaces];
    const [movedRace] = newRaces.splice(fromIndex, 1);
    newRaces.splice(toIndex, 0, movedRace);

    // Update sequence numbers
    const updatedRaces = newRaces.map((race, index) => ({
      ...race,
      sequenceNumber: index + 1
    }));

    onReorderRaces(updatedRaces);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Modern Sidebar */}
      <div className={`
        fixed right-0 top-0 h-full w-96 glass-dark z-50 transform transition-all duration-500 ease-out
        lg:relative lg:translate-x-0 lg:glass lg:border-l lg:border-border lg:w-80
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Modern Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                🏇
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Race Plan</h2>
                <p className="text-sm text-text-secondary">Your racing strategy</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-hover transition-colors text-text-muted hover:text-text-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto scrollbar-thin">
            <div className="p-6">
              {/* Enhanced Conflicts warning */}
              {conflicts.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-error/10 to-warning/10 border border-error/30 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-error rounded-full flex items-center justify-center text-white text-sm">
                      ⚠️
                    </div>
                    <div className="font-semibold text-error">Schedule Conflicts</div>
                  </div>
                  <div className="space-y-1">
                    {conflicts.map(([timeSlot, races]) => (
                      <div key={timeSlot} className="text-sm text-error/80 flex items-center gap-2">
                        <div className="w-2 h-2 bg-error rounded-full"></div>
                        {races.length} races in {races[0].careerPhase} {monthNames[races[0].month - 1]} {races[0].half}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Race list */}
              {selectedRaces.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-surface-secondary to-surface-hover rounded-full flex items-center justify-center">
                    <div className="text-3xl">🏁</div>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No races selected</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Click on races in the timeline to build your racing strategy
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedRaces.map((race, index) => (
                    <div
                      key={race.id}
                      className="group bg-surface/80 backdrop-blur-sm border border-border rounded-2xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-surface"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                              {race.sequenceNumber}
                            </div>
                            <div className="font-bold text-text-primary text-sm leading-tight">
                              {race.name}
                            </div>
                          </div>

                          <div className="text-xs text-text-secondary mb-3 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-accent rounded-full"></div>
                              {race.careerPhase}
                            </div>
                            <span>•</span>
                            <span>{monthNames[race.month - 1]} {race.half}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2 py-1 bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-lg text-xs font-medium border border-primary/20">
                              {race.grade}
                            </span>
                            <span className="px-2 py-1 bg-surface-secondary text-text-secondary rounded-lg text-xs font-medium">
                              {race.distance}m
                            </span>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              race.surface === 'Turf'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {race.surface}
                            </span>
                          </div>
                        </div>

                        {/* Enhanced Action buttons */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveRace(index, index - 1)}
                              className="p-2 text-xs bg-surface-secondary hover:bg-accent hover:text-white rounded-lg transition-all duration-200 hover:scale-110"
                              title="Move up"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                          )}
                          {index < selectedRaces.length - 1 && (
                            <button
                              onClick={() => moveRace(index, index + 1)}
                              className="p-2 text-xs bg-surface-secondary hover:bg-accent hover:text-white rounded-lg transition-all duration-200 hover:scale-110"
                              title="Move down"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => onRemoveRace(race.id)}
                            className="p-2 text-xs bg-error/10 hover:bg-error hover:text-white text-error rounded-lg transition-all duration-200 hover:scale-110"
                            title="Remove"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modern Actions */}
          <div className="p-6 border-t border-border/50 bg-gradient-to-t from-surface-secondary/50 to-transparent space-y-4">
            <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
              <span className="font-medium">
                {selectedRaces.length} race{selectedRaces.length !== 1 ? 's' : ''} selected
              </span>
              {selectedRaces.length > 0 && (
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              )}
            </div>

            <button
              onClick={onSavePlan}
              className="btn-modern w-full px-4 py-3 gradient-primary text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Save Plan
            </button>

            <button
              onClick={onSharePlan}
              className="btn-modern w-full px-4 py-3 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Plan
            </button>

            <button
              onClick={onClearPlan}
              className="btn-modern w-full px-4 py-3 bg-surface-secondary hover:bg-surface-hover text-text-secondary rounded-xl transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
