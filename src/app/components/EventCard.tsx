import { Calendar, MapPin, Clock } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export interface Event {
  id: string;
  title: string;
  artist: string;
  category: 'concert' | 'musical' | 'opera' | 'theater';
  venue: string;
  imageUrl: string;
  dates: string[];
  price: {
    min: number;
    max: number;
  };
  description: string;
}

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  return (
    <div 
      onClick={() => onSelect(event)}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="relative aspect-[7/9] overflow-hidden">
        <ImageWithFallback
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-900">
            {event.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{event.artist}</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
