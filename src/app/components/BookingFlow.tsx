import { useState } from 'react';
import { X, Calendar, Clock, ChevronRight, Ticket, Users } from 'lucide-react';
import type { Event } from './EventCard';
import type { Seat } from './SeatSelection';
import { SeatSelection } from './SeatSelection';

interface ShowTime {
  id: string;
  date: string;
  time: string;
  availableSeats: number;
}

interface BookingFlowProps {
  event: Event;
  onClose: () => void;
  onProceedToCheckout: (booking: BookingData) => void;
}

export interface BookingData {
  event: Event;
  showTime: ShowTime;
  seats: Seat[];
  total: number;
}

export function BookingFlow({ event, onClose, onProceedToCheckout }: BookingFlowProps) {
  const [step, setStep] = useState<'datetime' | 'quantity' | 'seats'>('datetime');
  const [selectedShowTime, setSelectedShowTime] = useState<ShowTime | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Mock show times
  const showTimes: ShowTime[] = event.dates.map((date, index) => ({
    id: `show-${index}`,
    date: date,
    time: index % 2 === 0 ? '7:00 PM' : '2:00 PM',
    availableSeats: Math.floor(Math.random() * 50) + 20,
  }));

  // Mock seats - Generate seats for the selected show
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const sections = ['Orchestra', 'Mezzanine', 'Balcony'];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    sections.forEach((section, sectionIndex) => {
      const basePrice = section === 'Orchestra' ? 150 : section === 'Mezzanine' ? 100 : 75;
      
      rows.forEach((row, rowIndex) => {
        for (let num = 1; num <= seatsPerRow; num++) {
          const isReserved = Math.random() > 0.7; // 30% reserved
          seats.push({
            id: `${section}-${row}-${num}`,
            row,
            number: num,
            section,
            price: basePrice - (rowIndex * 5),
            status: isReserved ? 'reserved' : 'available',
          });
        }
      });
    });

    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const handleShowTimeSelect = (showTime: ShowTime) => {
    setSelectedShowTime(showTime);
    setStep('quantity');
  };

  const handleQuantityConfirm = () => {
    setStep('seats');
  };

  const handleSeatToggle = (seat: Seat) => {
    if (seat.status === 'reserved') return;

    const isSelected = selectedSeats.find(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= ticketQuantity) {
        alert(`Please select exactly ${ticketQuantity} ${ticketQuantity === 1 ? 'seat' : 'seats'}`);
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceedToCheckout = () => {
    if (!selectedShowTime || selectedSeats.length === 0) return;

    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    onProceedToCheckout({
      event,
      showTime: selectedShowTime,
      seats: selectedSeats,
      total,
    });
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{event.title}</h2>
            <p className="text-gray-600 mt-1">{event.artist} • {event.venue}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'datetime' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'datetime' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {step === 'quantity' || step === 'seats' ? '✓' : '1'}
              </div>
              <span className="font-medium">Select Date & Time</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className={`flex items-center gap-2 ${step === 'quantity' ? 'text-blue-600' : step === 'seats' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'quantity' ? 'bg-blue-600 text-white' : step === 'seats' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}>
                {step === 'seats' ? '✓' : '2'}
              </div>
              <span className="font-medium">Select Quantity</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className={`flex items-center gap-2 ${step === 'seats' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'seats' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="font-medium">Select Seats</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 'datetime' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {showTimes.map((showTime) => (
                  <button
                    key={showTime.id}
                    onClick={() => handleShowTimeSelect(showTime)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedShowTime?.id === showTime.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{showTime.date}</div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {showTime.time}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {showTime.availableSeats} seats available
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'quantity' && selectedShowTime && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">How many tickets do you need?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedShowTime.date} at {selectedShowTime.time}
                  </p>
                </div>
                <button
                  onClick={() => setStep('datetime')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Change Date/Time
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-center gap-8">
                  <button
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-2xl font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    −
                  </button>
                  
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900 mb-2">{ticketQuantity}</div>
                    <div className="text-sm text-gray-600">
                      {ticketQuantity === 1 ? 'Ticket' : 'Tickets'}
                    </div>
                  </div>

                  <button
                    onClick={() => setTicketQuantity(Math.min(8, ticketQuantity + 1))}
                    className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-2xl font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[1, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTicketQuantity(num)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      ticketQuantity === num
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <div className="font-semibold text-gray-900">{num}</div>
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-semibold">!</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">Please Note:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Maximum 8 tickets per booking</li>
                      <li>Seats will be selected on the next page</li>
                      <li>Price varies by seat location</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleQuantityConfirm}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center justify-center gap-2"
              >
                Continue to Seat Selection
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'seats' && selectedShowTime && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Select Your Seats</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedShowTime.date} at {selectedShowTime.time} • {ticketQuantity} {ticketQuantity === 1 ? 'ticket' : 'tickets'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStep('quantity');
                    setSelectedSeats([]);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Change Quantity
                </button>
              </div>

              {selectedSeats.length < ticketQuantity && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    Please select {ticketQuantity - selectedSeats.length} more {ticketQuantity - selectedSeats.length === 1 ? 'seat' : 'seats'}
                  </p>
                </div>
              )}

              <SeatSelection
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              {selectedSeats.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    {selectedSeats.length} / {ticketQuantity} {ticketQuantity === 1 ? 'seat' : 'seats'} selected
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              
              {step === 'seats' && (
                <button
                  onClick={handleProceedToCheckout}
                  disabled={selectedSeats.length !== ticketQuantity}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Ticket className="w-5 h-5" />
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}