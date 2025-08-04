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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed right-0 top-0 h-full w-80 bg-surface shadow-2xl z-50 transform transition-transform duration-300
        lg:relative lg:translate-x-0 lg:shadow-lg lg:border-l lg:border-gray-200
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-surface-secondary">
            <h2 className="text-lg font-bold text-text-primary">Race Plan</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto scrollbar-thin">
            <div className="p-4">
              {/* Conflicts warning */}
              {conflicts.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm font-medium text-red-800 mb-2">
                    ⚠️ Schedule Conflicts
                  </div>
                  {conflicts.map(([timeSlot, races]) => (
                    <div key={timeSlot} className="text-xs text-red-700">
                      {races.length} races in {races[0].careerPhase} {monthNames[races[0].month - 1]} {races[0].half}
                    </div>
                  ))}
                </div>
              )}

              {/* Race list */}
              {selectedRaces.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">🏇</div>
                  <p>No races selected</p>
                  <p className="text-sm">Click races in the timeline to add them</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedRaces.map((race, index) => (
                    <div
                      key={race.id}
                      className="bg-surface-secondary border border-gray-200 rounded-lg p-3 group hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {race.sequenceNumber}
                            </span>
                            <span className="font-semibold text-sm text-text-primary">
                              {race.name}
                            </span>
                          </div>

                          <div className="text-xs text-gray-600 mb-2">
                            {race.careerPhase} • {monthNames[race.month - 1]} {race.half}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                              {race.grade}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                              {race.distance}m
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                              {race.surface}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <button
                              onClick={() => moveRace(index, index - 1)}
                              className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          {index < selectedRaces.length - 1 && (
                            <button
                              onClick={() => moveRace(index, index + 1)}
                              className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            onClick={() => onRemoveRace(race.id)}
                            className="p-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 bg-surface-secondary space-y-2">
            <div className="text-sm text-gray-600 mb-3">
              {selectedRaces.length} race{selectedRaces.length !== 1 ? 's' : ''} selected
            </div>

            <button
              onClick={onSavePlan}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              💾 Save Plan
            </button>

            <button
              onClick={onSharePlan}
              className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              🔗 Share Plan
            </button>

            <button
              onClick={onClearPlan}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
