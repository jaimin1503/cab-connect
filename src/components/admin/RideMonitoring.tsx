import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, MapPin, Phone, MessageSquare } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Ride } from '../../types';
import { mockRides, mockDrivers } from '../../data/mockData';

const RideMonitoring: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const filteredRides = mockRides.filter(ride => {
    // Filter by status
    if (filter !== 'all' && ride.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        ride.id.toLowerCase().includes(searchLower) ||
        ride.pickupLocation.address.toLowerCase().includes(searchLower) ||
        ride.dropLocation.address.toLowerCase().includes(searchLower) ||
        (ride.driverId && mockDrivers.find(d => d.id === ride.driverId)?.name.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
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
  
  const getStatusText = (status: string) => {
    switch (status) {
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
  
  const getDriverName = (driverId?: string) => {
    if (!driverId) return 'Not assigned';
    const driver = mockDrivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search rides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Rides</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="driver_assigned">Driver Assigned</option>
            <option value="arrived">Driver Arrived</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <Card key={ride.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Ride #{ride.id}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(ride.status)}`}>
                        {getStatusText(ride.status)}
                      </span>
                      {ride.routeDeviation && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Route Deviation
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-start space-x-6">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                          <span>From: {ride.pickupLocation.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="h-4 w-4 mr-1 text-red-500" />
                          <span>To: {ride.dropLocation.address}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Driver:</span> {getDriverName(ride.driverId)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Fare:</span> ${ride.fare.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      icon={<Phone className="h-4 w-4" />}
                      onClick={() => alert('Calling driver')}
                    >
                      Call
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      icon={<MessageSquare className="h-4 w-4" />}
                      onClick={() => alert('Messaging driver')}
                    >
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="primary"
                      onClick={() => alert('Viewing ride details')}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No rides found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideMonitoring;