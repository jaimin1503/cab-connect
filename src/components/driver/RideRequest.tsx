import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Check, X } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Ride } from '../../types';

interface RideRequestProps {
  ride: Ride;
  onAccept: () => void;
  onReject: () => void;
}

const RideRequest: React.FC<RideRequestProps> = ({ ride, onAccept, onReject }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto overflow-hidden border-2 border-blue-500">
        <div className="bg-blue-500 text-white px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">New Ride Request</h3>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">Expires in 30s</span>
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
                <div className="text-gray-800 dark:text-white font-medium flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                  <span>{ride.fare.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button 
                variant="danger" 
                fullWidth 
                onClick={onReject}
                icon={<X className="h-5 w-5" />}
              >
                Reject
              </Button>
              <Button 
                variant="success" 
                fullWidth 
                onClick={onAccept}
                icon={<Check className="h-5 w-5" />}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RideRequest;