import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, Phone, MessageSquare, Star } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Ride, Driver } from '../../types';
import { mockDrivers } from '../../data/mockData';

interface RideStatusProps {
  ride: Ride;
  onComplete?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const RideStatus: React.FC<RideStatusProps> = ({ ride, onComplete, onCancel, isLoading = false }) => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showRatingForm, setShowRatingForm] = useState<boolean>(false);
  
  useEffect(() => {
    if (ride.driverId) {
      const foundDriver = mockDrivers.find(d => d.id === ride.driverId);
      if (foundDriver) {
        setDriver(foundDriver);
      }
    }
  }, [ride]);
  
  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onComplete) {
      onComplete();
    }
  };
  
  const getStatusColor = () => {
    switch (ride.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'driver_assigned':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'arrived':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'in_progress':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const getStatusText = () => {
    switch (ride.status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'driver_assigned':
        return 'Driver Assigned';
      case 'arrived':
        return 'Driver Arrived';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };
  
  const renderStatusContent = () => {
    switch (ride.status) {
      case 'pending':
        return (
          <div className="text-center py-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Waiting for confirmation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your ride request is being processed. Please wait.
            </p>
            {onCancel && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={onCancel}
                loading={isLoading}
                disabled={isLoading}
              >
                Cancel Request
              </Button>
            )}
          </div>
        );
        
      case 'confirmed':
        return (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Ride Confirmed
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your ride has been confirmed. Looking for a driver.
            </p>
            {onCancel && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={onCancel}
                loading={isLoading}
                disabled={isLoading}
              >
                Cancel Ride
              </Button>
            )}
          </div>
        );
        
      case 'driver_assigned':
      case 'arrived':
      case 'in_progress':
        return (
          <div className="py-4">
            {driver && (
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img 
                    src={driver.profilePic || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'} 
                    alt={driver.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        {driver.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(driver.rating) 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`} 
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                          {driver.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3 md:mt-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        icon={<Phone className="h-4 w-4" />}
                        onClick={() => alert(`Calling ${driver.phone}`)}
                        disabled={isLoading}
                      >
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        icon={<MessageSquare className="h-4 w-4" />}
                        onClick={() => alert(`Messaging ${driver.name}`)}
                        disabled={isLoading}
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium mr-2">Vehicle:</span>
                      <span>{driver.vehicleDetails.model} • {driver.vehicleDetails.color}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium mr-2">Plate Number:</span>
                      <span>{driver.vehicleDetails.plateNumber}</span>
                    </div>
                  </div>
                  
                  {ride.status === 'in_progress' && (
                    <div className="mt-4">
                      <Button 
                        variant="danger" 
                        size="sm" 
                        icon={<AlertTriangle className="h-4 w-4" />}
                        onClick={() => alert('Emergency services contacted')}
                        className="w-full"
                      >
                        SOS Emergency
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <div className="mt-1">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Pickup</div>
                  <div className="text-gray-800 dark:text-white">{ride.pickupLocation.address}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Destination</div>
                  <div className="text-gray-800 dark:text-white">{ride.dropLocation.address}</div>
                </div>
              </div>
            </div>
            
            {ride.status === 'in_progress' && onComplete && (
              <div className="mt-6">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => setShowRatingForm(true)}
                >
                  Complete Ride
                </Button>
              </div>
            )}
            
            {ride.status !== 'in_progress' && onCancel && (
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={onCancel}
                >
                  Cancel Ride
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'completed':
        return (
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                Ride Completed
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for riding with us!
              </p>
            </div>
            
            {showRatingForm ? (
              <form onSubmit={handleRatingSubmit} className="mt-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rate your experience
                  </label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`h-8 w-8 ${
                            star <= rating 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feedback (Optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Share your experience..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  disabled={rating === 0}
                >
                  Submit Rating
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pickup</div>
                    <div className="text-gray-800 dark:text-white">{ride.pickupLocation.address}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Destination</div>
                    <div className="text-gray-800 dark:text-white">{ride.dropLocation.address}</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fare</span>
                    <span className="text-gray-800 dark:text-white font-medium">${ride.fare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Distance</span>
                    <span className="text-gray-800 dark:text-white">{ride.distance} km</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="text-gray-800 dark:text-white">{ride.duration} min</span>
                  </div>
                </div>
                
                {ride.rating && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Rating</div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${
                            i < ride.rating! 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`} 
                        />
                      ))}
                    </div>
                    {ride.feedback && (
                      <div className="mt-2 text-gray-700 dark:text-gray-300 italic">
                        "{ride.feedback}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 'cancelled':
        return (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Ride Cancelled
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This ride has been cancelled.
            </p>
            <Button 
              variant="primary" 
              className="mt-4" 
              onClick={() => window.location.href = '/book'}
            >
              Book New Ride
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      <div className={`px-4 py-3 ${getStatusColor()}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <div className="text-sm">
            Ride #{ride.id}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {renderStatusContent()}
      </div>
    </Card>
  );
};

// Import at the top
import { CheckCircle, X } from 'lucide-react';

export default RideStatus;