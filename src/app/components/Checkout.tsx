import { useState } from 'react';
import { X, CreditCard, Mail, User, Phone, CheckCircle } from 'lucide-react';
import type { BookingData } from './BookingFlow';

interface CheckoutProps {
  booking: BookingData;
  onClose: () => void;
  onComplete: () => void;
}

export function Checkout({ booking, onClose, onComplete }: CheckoutProps) {
  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingZip: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      setStep('confirmation');
    }, 1500);
  };

  const isFormValid = 
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.cardNumber.length >= 16 &&
    formData.expiryDate &&
    formData.cvv.length >= 3 &&
    formData.billingZip;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  if (step === 'confirmation') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your tickets have been sent to {formData.email}
            </p>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event:</span>
                  <span className="font-medium text-gray-900">{booking.event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium text-gray-900">
                    {booking.showTime.date} at {booking.showTime.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-medium text-gray-900">{booking.event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium text-gray-900">
                    {booking.seats.map(s => `${s.section} ${s.row}${s.number}`).join(', ')}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-semibold text-gray-900">Total Paid:</span>
                  <span className="text-xl font-semibold text-gray-900">
                    ${booking.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-left">
              <p className="text-blue-900">
                <strong>Note:</strong> This is a demo booking system. No actual payment has been processed.
                In a real application, tickets would be sent via email and available in your account.
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Checkout</h2>
            <p className="text-gray-600 mt-1">Complete your booking</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 divide-x divide-gray-200">
          {/* Order Summary */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">{booking.event.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{booking.event.artist}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">{booking.showTime.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="text-gray-900">{booking.showTime.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="text-gray-900">{booking.event.venue}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Selected Seats</h4>
              <div className="space-y-2">
                {booking.seats.map((seat) => (
                  <div key={seat.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {seat.section} - Row {seat.row}, Seat {seat.number}
                    </span>
                    <span className="font-medium text-gray-900">${seat.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${booking.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="text-gray-900">${(booking.total * 0.1).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-semibold text-gray-900">
                  ${(booking.total * 1.1).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Contact Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Card Information */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Card Details</h4>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').slice(0, 16);
                        handleInputChange('cardNumber', formatCardNumber(value));
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleInputChange('expiryDate', formatExpiryDate(value));
                      }}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleInputChange('cvv', value);
                      }}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Billing ZIP Code</label>
                  <input
                    type="text"
                    value={formData.billingZip}
                    onChange={(e) => handleInputChange('billingZip', e.target.value)}
                    placeholder="12345"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Complete Purchase - ${(booking.total * 1.1).toFixed(2)}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  This is a demo - no real payment will be processed
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
