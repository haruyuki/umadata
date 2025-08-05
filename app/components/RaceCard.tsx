import { Race } from '@/app/types';
import { MapPin } from 'lucide-react';

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'G1':
      return 'bg-[#3785e4] text-white';
    case 'G2':
      return 'bg-[#f45a86] text-white';
    case 'G3':
      return 'bg-[#58c470] text-white';
    case 'OP':
      return 'bg-[#ffad0b] text-white';
    case 'Pre-OP':
      return 'bg-[#ffad0b] text-white';
    default:
      return 'from-gray-500 to-gray-600 text-white';
  }
};

interface RaceCardProps {
  race: Race;
}

export default function RaceCard({ race }: RaceCardProps) {
  return (
    <div className="bg-card hover:bg-surface-hover card-shadow border-border rounded-xl border p-4 transition-colors duration-200 ease-in-out">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold ${getGradeColor(race.grade)} shadow-sm`}
          >
            {race.grade}
          </span>
          <div className="text-text-primary line-clamp-2 text-base leading-tight font-bold">
            {race.name}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="bg-surface-secondary text-text-secondary border-border inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
            {race.distance}m
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              race.track === 'Turf'
                ? 'border border-green-300 bg-green-100 text-green-800'
                : 'border border-amber-300 bg-amber-100 text-amber-800'
            }`}
          >
            {race.track}
          </span>
        </div>

        {race.location && (
          <div className="text-text-muted flex items-center gap-2 text-xs">
            <MapPin className="h-3 w-3" />
            <span>{race.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
