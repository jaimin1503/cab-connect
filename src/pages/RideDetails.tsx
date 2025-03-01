import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Car, Phone, MessageSquare, Star } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { mockRides, mockDrivers } from '../data/mockData';
import { Ride, Driver } from '../types';

const RideDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    // Simulate API call to fetch ride details
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        
        // Find ride in mock data
        const foundRide = mockRides.find(r => r.id === id);
        
        if (!foundRide) {
          setError('Ride not found');
          return;
        }
        
        setRide(foundRide);
        
        // If ride has a driver, fetch driver details
        if (foundRide.driverId) {
          const foundDriver = mockDrivers.find(d => d.id === foundRide.driverId);
          if (foundDriver) {
            setDriver(foundDriver);
          }
        }
      } catch (err) {
        console.error('Error fetching ride details:', err);
        setError('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRideDetails();
  }, [id]);
  
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };
  
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card>
                <div className="p-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !ride) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card>
                <div className="p-8">
                  <Alert 
                    type="error" 
                    message={error || 'Ride not found'} 
                    description="Please check the ride ID and try again."
                  />
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Ride Status Card */}
              <Card className="mb-8">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(ride.status)}`}>
                          {ride.status.replace('_', ' ').charAt(0).toUpperCase() + ride.status.replace('_', ' ').slice(1)}
                        </span>
                        {ride.scheduledTime && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Scheduled for {formatDate(ride.scheduledTime)}
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Ride #{ride.id}
                      </h1>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${ride.fare.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {ride.paymentMethod.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Pickup Location</div>
                        <div className="text-gray-900 dark:text-white">{ride.pickupLocation.address}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Drop Location</div>
                        <div className="text-gray-900 dark:text-white">{ride.dropLocation.address}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Car className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Cab Type</div>
                        <div className="text-gray-900 dark:text-white capitalize">{ride.cabType}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Trip Details</div>
                        <div className="text-gray-900 dark:text-white">
                          {ride.distance} km • Approx. {ride.duration} mins
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Driver Details Card */}
              {driver && (
                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Driver Details
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden">
                        <img 
                          src={driver.profilePic || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'} 
                          alt={driver.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
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
                            >
                              Call
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              icon={<MessageSquare className="h-4 w-4" />}
                              onClick={() => alert(`Messaging ${driver.name}`)}
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
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RideDetails;
