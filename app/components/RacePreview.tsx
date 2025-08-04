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
      case 'G1': return 'from-amber-400 to-yellow-500 border-yellow-400';
      case 'G2': return 'from-blue-400 to-indigo-500 border-blue-400';
      case 'G3': return 'from-emerald-400 to-green-500 border-green-400';
      case 'OP': return 'from-purple-400 to-violet-500 border-purple-400';
      case 'Listed': return 'from-gray-400 to-slate-500 border-gray-400';
      case 'Maiden': return 'from-pink-400 to-rose-500 border-pink-400';
      default: return 'from-gray-400 to-slate-500 border-gray-400';
    }
  };

  return (
    <div
      className="fixed z-50 pointer-events-none animate-in fade-in zoom-in duration-200"
      style={{
        left: Math.min(position.x + 15, window.innerWidth - 350),
        top: Math.max(position.y - 15, 10),
        transform: 'translateY(-100%)'
      }}
    >
      <div className="glass card-shadow-lg rounded-2xl p-5 max-w-sm border border-border/50">
        {/* Header with race name */}
        <div className="mb-4">
          <h3 className="font-bold text-text-primary text-lg mb-1 leading-tight">{race.name}</h3>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              {race.careerPhase}
            </div>
            <span>•</span>
            <span>{monthNames[race.month - 1]} {race.half}</span>
          </div>
        </div>

        {/* Race details with modern layout */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface-secondary/50 rounded-xl p-3">
            <div className="text-xs text-text-muted mb-1">Grade</div>
            <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${getGradeColor(race.grade).split(' ')[0]} ${getGradeColor(race.grade).split(' ')[1]}`}>
              {race.grade}
            </div>
          </div>

          <div className="bg-surface-secondary/50 rounded-xl p-3">
            <div className="text-xs text-text-muted mb-1">Distance</div>
            <div className="font-semibold text-text-primary">{race.distance}m</div>
          </div>

          <div className="bg-surface-secondary/50 rounded-xl p-3">
            <div className="text-xs text-text-muted mb-1">Surface</div>
            <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
              race.surface === 'Turf' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {race.surface}
            </div>
          </div>

          {race.location && (
            <div className="bg-surface-secondary/50 rounded-xl p-3">
              <div className="text-xs text-text-muted mb-1">Track</div>
              <div className="font-semibold text-text-primary flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {race.location}
              </div>
            </div>
          )}
        </div>

        {/* Notes section */}
        {race.notes && (
          <div className="pt-3 border-t border-border/30">
            <div className="text-xs text-text-muted mb-1">Notes</div>
            <p className="text-sm text-text-secondary italic leading-relaxed">{race.notes}</p>
          </div>
        )}

        {/* Decorative bottom accent */}
        <div className="mt-4 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full opacity-50"></div>
      </div>
    </div>
  );
}
