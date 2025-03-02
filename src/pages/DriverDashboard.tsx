import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  DollarSign,
  MapPin,
  Clock,
  Settings,
  User as UserIcon,
  Bell,
  Star,
} from "lucide-react";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import RideRequest from "../components/driver/RideRequest";
import ActiveRide from "../components/driver/ActiveRide";
import { useAppSelector } from '../store/hooks';
import { mockRides, mockDrivers } from "../data/mockData";
import { Ride } from "../types";

const DriverDashboard: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [showRideRequest, setShowRideRequest] = useState<boolean>(false);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [completedRides, setCompletedRides] = useState<Ride[]>([]);

  // Get driver details
  const driverDetails = mockDrivers.find(
    (driver) => driver.id === currentUser?.id
  );

  // Simulate a new ride request
  const pendingRide = mockRides.find((ride) => ride.status === "confirmed");

  // Handle accepting a ride
  const handleAcceptRide = () => {
    if (pendingRide) {
      const updatedRide = {
        ...pendingRide,
        driverId: currentUser?.id,
        status: "driver_assigned" as const,
      };
      setActiveRide(updatedRide);
      setShowRideRequest(false);
    }
  };

  // Handle rejecting a ride
  const handleRejectRide = () => {
    setShowRideRequest(false);
  };

  // Handle ride status updates
  const handleRideStart = () => {
    if (activeRide) {
      setActiveRide({
        ...activeRide,
        status: "in_progress",
        startTime: new Date(),
      });
    }
  };

  const handleRideComplete = () => {
    if (activeRide) {
      const completedRide = {
        ...activeRide,
        status: "completed" as const,
        endTime: new Date(),
      };
      setCompletedRides([completedRide, ...completedRides]);
      setActiveRide(null);
    }
  };

  // Toggle driver availability
  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);

    // If becoming available, simulate a ride request after a delay
    if (!isAvailable && !activeRide) {
      setTimeout(() => {
        setShowRideRequest(true);
      }, 3000);
    }
  };

  // Format earnings
  const formatEarnings = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate today's earnings
  const todayEarnings = completedRides.reduce((total, ride) => {
    const rideDate = ride.endTime ? new Date(ride.endTime) : null;
    const today = new Date();

    if (
      rideDate &&
      rideDate.getDate() === today.getDate() &&
      rideDate.getMonth() === today.getMonth() &&
      rideDate.getFullYear() === today.getFullYear()
    ) {
      return total + ride.fare;
    }

    return total;
  }, 0);

  // Calculate weekly earnings
  const weeklyEarnings = completedRides.reduce((total, ride) => {
    const rideDate = ride.endTime ? new Date(ride.endTime) : null;
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    if (rideDate && rideDate >= oneWeekAgo && rideDate <= today) {
      return total + ride.fare;
    }

    return total;
  }, 0);

  return (
    <div className="flex-grow bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Driver Profile Section */}
            <div className="mb-8">
              <Card>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      {driverDetails?.profilePic ? (
                        <img
                          src={driverDetails.profilePic}
                          alt={driverDetails.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <UserIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {driverDetails?.name ||
                              currentUser?.name ||
                              "Driver"}
                          </h1>
                          <div className="flex items-center justify-center md:justify-start mt-1">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(driverDetails?.rating || 0)
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                              {driverDetails?.rating?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0">
                          <Button
                            variant={isAvailable ? "success" : "outline"}
                            onClick={toggleAvailability}
                            disabled={!!activeRide}
                          >
                            {isAvailable ? "Available" : "Offline"}
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Today's Earnings
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatEarnings(todayEarnings)}
                          </div>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            This Week
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatEarnings(weeklyEarnings)}
                          </div>
                        </div>
                      </div>

                      {driverDetails?.vehicleDetails && (
                        <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Car className="h-4 w-4 mr-1" />
                            <span>
                              {driverDetails.vehicleDetails.model} •{" "}
                              {driverDetails.vehicleDetails.color} •{" "}
                              {driverDetails.vehicleDetails.plateNumber}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Active Ride or Ride Request */}
            <div className="mb-8">
              <AnimatePresence>
                {showRideRequest && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      New Ride Request
                    </h2>

                    {pendingRide && (
                      <RideRequest
                        ride={pendingRide}
                        onAccept={handleAcceptRide}
                        onReject={handleRejectRide}
                      />
                    )}
                  </motion.div>
                )}

                {activeRide && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Active Ride
                    </h2>

                    <ActiveRide
                      ride={activeRide}
                      onStart={handleRideStart}
                      onComplete={handleRideComplete}
                      onUploadOdometer={(reading) => {
                        console.log("Odometer reading:", reading);
                        if (activeRide.status === "driver_assigned") {
                          setActiveRide({
                            ...activeRide,
                            status: "arrived",
                          });
                        } else if (activeRide.status === "in_progress") {
                          handleRideComplete();
                        }
                      }}
                    />
                  </motion.div>
                )}

                {!showRideRequest && !activeRide && (
                  <Card className="p-8 text-center">
                    {isAvailable ? (
                      <>
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Waiting for Ride Requests
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          You'll be notified when a new ride request comes in.
                        </p>
                      </>
                    ) : (
                      <>
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          You're Currently Offline
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Go online to start receiving ride requests.
                        </p>
                        <Button variant="primary" onClick={toggleAvailability}>
                          Go Online
                        </Button>
                      </>
                    )}
                  </Card>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DriverDashboard;
