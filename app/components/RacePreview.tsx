'use client';

import { Race } from '../types';
import { monthNames } from '../data';

interface RacePreviewProps {
  race: Race | null;
  position: { x: number; y: number };
}

export default function RacePreview({ race, position }: RacePreviewProps) {
  if (!race) return null;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'G1': return 'border-yellow-400 bg-yellow-50';
      case 'G2': return 'border-blue-400 bg-blue-50';
      case 'G3': return 'border-green-400 bg-green-50';
      case 'OP': return 'border-purple-400 bg-purple-50';
      case 'Listed': return 'border-gray-400 bg-gray-50';
      case 'Maiden': return 'border-pink-400 bg-pink-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className={`
        bg-surface border-2 rounded-lg shadow-lg p-4 max-w-xs
        ${getGradeColor(race.grade)}
      `}>
        <div className="space-y-3">
          {/* Race name and timing */}
          <div>
            <h3 className="font-bold text-text-primary mb-1">{race.name}</h3>
            <p className="text-sm text-gray-600">
              {race.careerPhase} • {monthNames[race.month - 1]} {race.half}
            </p>
          </div>

          {/* Race details grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Grade:</span>
              <span className="ml-2 font-medium">{race.grade}</span>
            </div>
            <div>
              <span className="text-gray-500">Distance:</span>
              <span className="ml-2 font-medium">{race.distance}m</span>
            </div>
            <div>
              <span className="text-gray-500">Surface:</span>
              <span className="ml-2 font-medium">{race.surface}</span>
            </div>
            {race.location && (
              <div>
                <span className="text-gray-500">Track:</span>
                <span className="ml-2 font-medium">{race.location}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {race.notes && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 italic">{race.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
