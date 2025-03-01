import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, DollarSign, CreditCard, Car } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Card from '../common/Card';
import { CabType, PaymentMethod } from '../../types';
import { calculateFare } from '../../data/mockData';

interface BookingFormData {
  pickupLocation: string;
  dropLocation: string;
  cabType: CabType;
  rideTime: 'now' | 'schedule';
  scheduledDate: string;
  scheduledTime: string;
  paymentMethod: PaymentMethod;
  distance: number;
  duration: number;
  fare: number;
}

interface BookingFormProps {
  onSubmit: (bookingData: BookingFormData) => void;
  isLoading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, isLoading = false }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: '',
    dropLocation: '',
    cabType: 'standard' as CabType,
    rideTime: 'now',
    scheduledDate: '',
    scheduledTime: '',
    paymentMethod: 'card' as PaymentMethod,
    distance: 0,
    duration: 0,
    fare: 0,
  });
  
  // Calculate distance and fare when locations or cab type change
  useEffect(() => {
    const calculateDistance = async () => {
      if (formData.pickupLocation && formData.dropLocation) {
        try {
          // In a real app, this would call a Maps API
          const mockDistance = Math.floor(Math.random() * 15) + 2; // 2-17 km
          const mockDuration = mockDistance * 2 + Math.floor(Math.random() * 10); // Rough estimate
          
          setFormData(prev => ({
            ...prev,
            distance: mockDistance,
            duration: mockDuration,
            fare: calculateFare(prev.cabType, mockDistance),
          }));
        } catch (error) {
          console.error('Error calculating distance:', error);
          setErrors(prev => ({
            ...prev,
            pickupLocation: 'Error calculating distance. Please try again.',
          }));
        }
      }
    };

    calculateDistance();
  }, [formData.pickupLocation, formData.dropLocation, formData.cabType]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Recalculate fare when cab type changes
    if (name === 'cabType') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        fare: calculateFare(value as CabType, prev.distance),
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.pickupLocation) {
      newErrors.pickupLocation = 'Pickup location is required';
    }
    if (!formData.dropLocation) {
      newErrors.dropLocation = 'Drop location is required';
    }
    if (formData.rideTime === 'schedule') {
      const now = new Date();
      const scheduled = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      if (!formData.scheduledDate) {
        newErrors.scheduledDate = 'Date is required for scheduled rides';
      }
      if (!formData.scheduledTime) {
        newErrors.scheduledTime = 'Time is required for scheduled rides';
      }
      if (scheduled < now) {
        newErrors.scheduledDate = 'Scheduled time must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit booking. Please try again.',
      }));
    }
  };
  
  const nextStep = () => {
    if (step === 1 && (!formData.pickupLocation || !formData.dropLocation)) {
      setErrors({
        ...errors,
        pickupLocation: !formData.pickupLocation ? 'Pickup location is required' : undefined,
        dropLocation: !formData.dropLocation ? 'Drop location is required' : undefined,
      });
      return;
    }

    if (step === 1 && formData.rideTime === 'schedule') {
      const now = new Date();
      const scheduled = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      if (scheduled < now) {
        setErrors({
          ...errors,
          scheduledDate: 'Scheduled time must be in the future',
        });
        return;
      }
    }

    setErrors({});
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };
  
  const cabOptions = [
    { value: 'economy', label: 'Economy' },
    { value: 'standard', label: 'Standard' },
    { value: 'luxury', label: 'Luxury' },
  ];
  
  const paymentOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'wallet', label: 'Wallet' },
    { value: 'upi', label: 'UPI' },
  ];
  
  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Book a Ride</h2>
      
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNumber 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Cab Type</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Payment</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <Input
                label="Pickup Location"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Enter pickup address"
                required
                error={errors.pickupLocation}
                disabled={isLoading}
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
              />
              
              <Input
                label="Drop Location"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleChange}
                placeholder="Enter destination address"
                required
                error={errors.dropLocation}
                disabled={isLoading}
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
              />
              
              <div className="flex items-center space-x-4 mt-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ride Time
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rideTime"
                        value="now"
                        checked={formData.rideTime === 'now'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Now</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rideTime"
                        value="schedule"
                        checked={formData.rideTime === 'schedule'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Schedule</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {formData.rideTime === 'schedule' && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date"
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    required={formData.rideTime === 'schedule'}
                    icon={<Calendar className="h-5 w-5 text-gray-400" />}
                  />
                  
                  <Input
                    label="Time"
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    required={formData.rideTime === 'schedule'}
                    icon={<Clock className="h-5 w-5 text-gray-400" />}
                  />
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={nextStep} 
                disabled={isLoading || !formData.pickupLocation || !formData.dropLocation}
                loading={isLoading}
              >
                {isLoading ? 'Loading...' : 'Next'}
              </Button>
            </div>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <Select
                label="Cab Type"
                name="cabType"
                value={formData.cabType}
                onChange={handleChange}
                options={cabOptions}
                required
                icon={<Car className="h-5 w-5 text-gray-400" />}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Distance</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formData.distance} km
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formData.duration} min
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Fare Estimate</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    ${formData.fare.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Cab Features</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  {formData.cabType === 'economy' && (
                    <>
                      <li>• Basic comfortable ride</li>
                      <li>• Up to 4 passengers</li>
                      <li>• Air conditioning</li>
                      <li>• Budget-friendly option</li>
                    </>
                  )}
                  {formData.cabType === 'standard' && (
                    <>
                      <li>• Spacious and comfortable</li>
                      <li>• Up to 4 passengers</li>
                      <li>• Air conditioning</li>
                      <li>• Bottled water</li>
                      <li>• Phone charging</li>
                    </>
                  )}
                  {formData.cabType === 'luxury' && (
                    <>
                      <li>• Premium luxury vehicle</li>
                      <li>• Up to 4 passengers</li>
                      <li>• Climate control</li>
                      <li>• Bottled water & refreshments</li>
                      <li>• Phone charging & Wi-Fi</li>
                      <li>• Professional chauffeur</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>
                Next
              </Button>
            </div>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <Select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                options={paymentOptions}
                required
                icon={<CreditCard className="h-5 w-5 text-gray-400" />}
              />
              
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-white mb-4">Ride Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pickup</span>
                    <span className="text-gray-800 dark:text-white font-medium">{formData.pickupLocation}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Destination</span>
                    <span className="text-gray-800 dark:text-white font-medium">{formData.dropLocation}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cab Type</span>
                    <span className="text-gray-800 dark:text-white font-medium capitalize">{formData.cabType}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {formData.rideTime === 'now' 
                        ? 'Now' 
                        : `${formData.scheduledDate} at ${formData.scheduledTime}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment</span>
                    <span className="text-gray-800 dark:text-white font-medium capitalize">{formData.paymentMethod}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-800 dark:text-white">Total Fare</span>
                      <span className="text-gray-800 dark:text-white">${formData.fare.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              {errors.submit && (
                <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                  {errors.submit}
                </div>
              )}
              <Button 
                type="submit" 
                variant="primary" 
                icon={<DollarSign className="h-4 w-4" />}
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </Card>
  );
};

export default BookingForm;