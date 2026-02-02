import { useState } from 'react';
import { X } from 'lucide-react';

export interface Seat {
  id: string;
  row: string;
  number: number;
  section: string;
  price: number;
  status: 'available' | 'selected' | 'reserved';
}

interface SeatSelectionProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatToggle: (seat: Seat) => void;
}

export function SeatSelection({ seats, selectedSeats, onSeatToggle }: SeatSelectionProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  // Group seats by section and row
  const sections = ['Orchestra', 'Mezzanine', 'Balcony'];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;

  const getSeatStatus = (seatId: string): 'available' | 'selected' | 'reserved' => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return 'available';
    if (selectedSeats.find(s => s.id === seatId)) return 'selected';
    return seat.status;
  };

  const getSeat = (section: string, row: string, number: number): Seat | undefined => {
    return seats.find(s => s.section === section && s.row === row && s.number === number);
  };

  const getSeatColor = (status: 'available' | 'selected' | 'reserved', isHovered: boolean) => {
    if (status === 'reserved') return 'bg-gray-300 cursor-not-allowed';
    if (status === 'selected') return 'bg-blue-600 text-white cursor-pointer';
    if (isHovered) return 'bg-blue-200 cursor-pointer';
    return 'bg-green-100 hover:bg-green-200 cursor-pointer';
  };

  const handleSeatClick = (seat: Seat | undefined) => {
    if (!seat || seat.status === 'reserved') return;
    onSeatToggle(seat);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Stage */}
      <div className="mb-8">
        <div className="bg-gradient-to-b from-gray-800 to-gray-600 text-white text-center py-4 rounded-lg shadow-lg">
          <div className="text-lg font-medium">STAGE</div>
        </div>
      </div>

      {/* Seating Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
              {section}
            </h3>
            
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={`${section}-${row}`} className="flex items-center gap-2">
                  {/* Row Label */}
                  <div className="w-6 text-center text-sm font-medium text-gray-600">
                    {row}
                  </div>

                  {/* Seats */}
                  <div className="flex-1 flex justify-center gap-1">
                    {Array.from({ length: seatsPerRow }, (_, i) => {
                      const seatNumber = i + 1;
                      const seat = getSeat(section, row, seatNumber);
                      const seatId = seat?.id || `${section}-${row}-${seatNumber}`;
                      const status = getSeatStatus(seatId);
                      const isHovered = hoveredSeat === seatId;

                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(seat)}
                          onMouseEnter={() => setHoveredSeat(seatId)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          disabled={status === 'reserved'}
                          className={`w-8 h-8 text-xs rounded transition-colors ${getSeatColor(status, isHovered)}`}
                          title={seat ? `${seat.section} - Row ${seat.row}, Seat ${seat.number} - $${seat.price}` : 'Not available'}
                        >
                          {seatNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row Label (right side) */}
                  <div className="w-6 text-center text-sm font-medium text-gray-600">
                    {row}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border border-green-200 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Reserved</span>
        </div>
      </div>
    </div>
  );
}
