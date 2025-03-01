import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BookingForm from '../components/user/BookingForm';
import RideStatus from '../components/user/RideStatus';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Alert from '../components/common/Alert';
import { Ride } from '../types';
import { mockRides } from '../data/mockData';

const BookRide: React.FC = () => {
  const [bookingComplete, setBookingComplete] = useState<boolean>(false);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleBookingSubmit = async (bookingData: any) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to create a ride
      console.log('Booking data:', bookingData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock ride for demo purposes
      const newRide: Ride = {
        id: `r${Math.floor(Math.random() * 1000)}`,
        userId: '1', // Assuming user with ID 1
        pickupLocation: {
          address: bookingData.pickupLocation,
          lat: 37.7749,
          lng: -122.4194,
        },
        dropLocation: {
          address: bookingData.dropLocation,
          lat: 37.7922,
          lng: -122.3964,
        },
        cabType: bookingData.cabType,
        fare: bookingData.fare,
        distance: bookingData.distance,
        duration: bookingData.duration,
        status: 'confirmed',
        paymentMethod: bookingData.paymentMethod,
      };
      
      if (bookingData.rideTime === 'schedule') {
        newRide.scheduledTime = new Date(`${bookingData.scheduledDate}T${bookingData.scheduledTime}`);
      }
      
      setCurrentRide(newRide);
      setBookingComplete(true);
      setAlertType('success');
      setAlertMessage('Ride booked successfully! You can track its status below.');
      setShowAlert(true);
      
      // Auto-hide the alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      console.error('Error booking ride:', error);
      setAlertType('error');
      setAlertMessage('Failed to book ride. Please try again.');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelRide = async () => {
    if (!currentRide) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to cancel the ride
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      setCurrentRide({
        ...currentRide,
        status: 'cancelled',
      });
      
      setAlertType('success');
      setAlertMessage('Ride cancelled successfully.');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      console.error('Error cancelling ride:', error);
      setAlertType('error');
      setAlertMessage('Failed to cancel ride. Please try again.');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert 
                type={alertType}
                message={alertMessage}
                onClose={() => setShowAlert(false)}
              />
            </motion.div>
          )}
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {bookingComplete ? 'Your Ride Status' : 'Book a Ride'}
            </h1>
            
            {bookingComplete && currentRide ? (
              <RideStatus 
                ride={currentRide} 
                onCancel={handleCancelRide}
                isLoading={isLoading}
              />
            ) : (
              <BookingForm 
                onSubmit={handleBookingSubmit}
                isLoading={isLoading}
              />
            )}
            
            {bookingComplete && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setBookingComplete(false)}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Book Another Ride
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookRide;