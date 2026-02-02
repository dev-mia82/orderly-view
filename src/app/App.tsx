import { useState } from 'react';
import { Ticket } from 'lucide-react';
import { EventBrowser } from './components/EventBrowser';
import { BookingFlow, type BookingData } from './components/BookingFlow';
import { Checkout } from './components/Checkout';
import type { Event } from './components/EventCard';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'The Symphony of Dreams',
    artist: 'Metropolitan Orchestra',
    category: 'concert',
    venue: 'Carnegie Hall, New York',
    imageUrl: 'https://images.unsplash.com/photo-1519683000900-034603c717b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmElMjBzeW1waG9ueSUyMGhhbGx8ZW58MXx8fHwxNzcwMDM5NzIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['March 15, 2026', 'March 16, 2026', 'March 22, 2026', 'March 23, 2026'],
    price: { min: 75, max: 150 },
    description: 'Experience the magic of classical music with our world-renowned orchestra performing timeless masterpieces.',
  },
  {
    id: '2',
    title: 'Hamilton',
    artist: 'Original Broadway Cast',
    category: 'musical',
    venue: 'Richard Rodgers Theatre, NYC',
    imageUrl: 'https://images.unsplash.com/photo-1767979400666-7e2721eb11b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2FsJTIwdGhlYXRlciUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3MDAzOTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['February 20, 2026', 'February 21, 2026', 'February 27, 2026', 'February 28, 2026', 'March 1, 2026'],
    price: { min: 120, max: 250 },
    description: 'The story of America\'s Founding Father Alexander Hamilton, an immigrant from the West Indies who became George Washington\'s right-hand man.',
  },
  {
    id: '3',
    title: 'Rock Legends Festival',
    artist: 'Various Artists',
    category: 'concert',
    venue: 'Madison Square Garden, NYC',
    imageUrl: 'https://images.unsplash.com/photo-1712763113004-e375adb253c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY29uY2VydCUyMGZlc3RpdmFsfGVufDF8fHx8MTc3MDAzOTc0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['April 5, 2026', 'April 6, 2026'],
    price: { min: 85, max: 200 },
    description: 'A night of incredible rock performances featuring the biggest names in rock music history.',
  },
  {
    id: '4',
    title: 'Jazz Night Live',
    artist: 'Blue Note Jazz Ensemble',
    category: 'concert',
    venue: 'Blue Note Jazz Club, NYC',
    imageUrl: 'https://images.unsplash.com/photo-1710951403141-353d4e5c7cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwYmFuZCUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc2OTk5MzQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['February 10, 2026', 'February 11, 2026', 'February 17, 2026', 'February 18, 2026'],
    price: { min: 50, max: 95 },
    description: 'An intimate evening of smooth jazz featuring renowned musicians in an iconic venue.',
  },
  {
    id: '5',
    title: 'The Phantom of the Opera',
    artist: 'Broadway Production',
    category: 'musical',
    venue: 'Majestic Theatre, NYC',
    imageUrl: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHMlMjBjcm93ZHxlbnwxfHx8fDE3Njk5ODMxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['March 8, 2026', 'March 9, 2026', 'March 15, 2026', 'March 16, 2026'],
    price: { min: 110, max: 225 },
    description: 'Andrew Lloyd Webber\'s timeless tale of romance, passion and obsession.',
  },
  {
    id: '6',
    title: 'La Traviata',
    artist: 'Metropolitan Opera',
    category: 'opera',
    venue: 'Metropolitan Opera House, NYC',
    imageUrl: 'https://images.unsplash.com/photo-1769327779917-f2154db01705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVyYSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2V8ZW58MXx8fHwxNzY5OTg1ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dates: ['February 25, 2026', 'February 26, 2026', 'March 4, 2026', 'March 5, 2026'],
    price: { min: 90, max: 180 },
    description: 'Verdi\'s beloved opera tells the story of Violetta, a courtesan who sacrifices everything for love.',
  },
];

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseBooking = () => {
    setSelectedEvent(null);
  };

  const handleProceedToCheckout = (booking: BookingData) => {
    setBookingData(booking);
    setSelectedEvent(null);
  };

  const handleCloseCheckout = () => {
    setBookingData(null);
  };

  const handleCompleteBooking = () => {
    setBookingData(null);
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">ORDERLY</h1>
              <p className="text-sm text-gray-500">If you want to experience something, you can always come to ORDERLY</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <EventBrowser events={mockEvents} onSelectEvent={handleSelectEvent} />
      </main>

      {/* Booking Flow Modal */}
      {selectedEvent && (
        <BookingFlow
          event={selectedEvent}
          onClose={handleCloseBooking}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* Checkout Modal */}
      {bookingData && (
        <Checkout
          booking={bookingData}
          onClose={handleCloseCheckout}
          onComplete={handleCompleteBooking}
        />
      )}
    </div>
  );
}
