import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, Camera, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Ride } from '../../types';

interface ActiveRideProps {
  ride: Ride;
  onStart?: () => void;
  onComplete?: () => void;
  onUploadOdometer?: (reading: string) => void;
}

const ActiveRide: React.FC<ActiveRideProps> = ({ 
  ride, 
  onStart, 
  onComplete,
  onUploadOdometer
}) => {
  const [odometerReading, setOdometerReading] = useState<string>('');
  const [showOdometerUpload, setShowOdometerUpload] = useState<boolean>(false);
  
  const handleOdometerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUploadOdometer) {
      onUploadOdometer(odometerReading);
    }
    setShowOdometerUpload(false);
  };
  
  const getStatusColor = () => {
    switch (ride.status) {
      case 'driver_assigned':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'arrived':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'in_progress':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const getStatusText = () => {
    switch (ride.status) {
      case 'driver_assigned':
        return 'Assigned';
      case 'arrived':
        return 'Arrived';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };
  
  const renderActionButton = () => {
    switch (ride.status) {
      case 'driver_assigned':
        return (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => setShowOdometerUpload(true)}
          >
            I've Arrived
          </Button>
        );
      case 'arrived':
        return (
          <Button 
            variant="success" 
            fullWidth 
            onClick={onStart}
          >
            Start Ride
          </Button>
        );
      case 'in_progress':
        return (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => setShowOdometerUpload(true)}
          >
            Complete Ride
          </Button>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
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
      
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mt-1">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">Pickup</div>
              <div className="text-gray-800 dark:text-white font-medium">{ride.pickupLocation.address}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mt-1">
              <MapPin className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">Destination</div>
              <div className="text-gray-800 dark:text-white font-medium">{ride.dropLocation.address}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Distance</div>
              <div className="text-gray-800 dark:text-white font-medium">{ride.distance} km</div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
              <div className="text-gray-800 dark:text-white font-medium">{ride.duration} min</div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Fare</div>
              <div className="text-gray-800 dark:text-white font-medium">${ride.fare.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <Button 
              variant="outline" 
              fullWidth 
              icon={<Navigation className="h-5 w-5" />}
              onClick={() => window.open(`https://maps.google.com/?q=${ride.pickupLocation.lat},${ride.pickupLocation.lng}`, '_blank')}
            >
              Navigate
            </Button>
            <Button 
              variant="warning" 
              fullWidth 
              icon={<AlertTriangle className="h-5 w-5" />}
              onClick={() => alert('Issue reported')}
            >
              Report Issue
            </Button>
          </div>
          
          {showOdometerUpload ? (
            <form onSubmit={handleOdometerSubmit} className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Odometer Reading
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={odometerReading}
                    onChange={(e) => setOdometerReading(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter reading (km)"
                    required
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r-md border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                    onClick={() => alert('Camera opened')}
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => setShowOdometerUpload(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth
                  disabled={!odometerReading}
                  icon={<CheckCircle className="h-5 w-5" />}
                >
                  Submit
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-4">
              {renderActionButton()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ActiveRide;