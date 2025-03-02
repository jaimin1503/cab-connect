import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Clock,
  MapPin,
  CreditCard,
  History,
  Settings,
  User as UserIcon,
} from "lucide-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useAppSelector } from '../store/hooks';
import { mockRides } from "../data/mockData";
import { Ride } from "../types";

const UserDashboard: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming"
  );

  // Filter rides for the current user
  const userRides = mockRides.filter((ride) => ride.userId === currentUser?.id);

  // Split rides into upcoming and past
  const upcomingRides = userRides.filter((ride) =>
    [
      "pending",
      "confirmed",
      "driver_assigned",
      "arrived",
      "in_progress",
    ].includes(ride.status)
  );

  const pastRides = userRides.filter((ride) =>
    ["completed", "cancelled"].includes(ride.status)
  );

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "driver_assigned":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "arrived":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "in_progress":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const renderRideCard = (ride: Ride) => (
    <Card key={ride.id} className="mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                  ride.status
                )}`}
              >
                {ride.status.replace("_", " ").charAt(0).toUpperCase() +
                  ride.status.replace("_", " ").slice(1)}
              </span>
              {ride.scheduledTime && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(ride.scheduledTime)}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    From
                  </div>
                  <div className="text-sm text-gray-800 dark:text-white">
                    {ride.pickupLocation.address}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    To
                  </div>
                  <div className="text-sm text-gray-800 dark:text-white">
                    {ride.dropLocation.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              ${ride.fare.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {ride.distance} km
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="capitalize">{ride.cabType}</span> •{" "}
            {ride.paymentMethod.toUpperCase()}
          </div>

          <Link to={`/rides/${ride.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* User Profile Section */}
            <div className="mb-8">
              <Card>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      {currentUser?.profilePic ? (
                        <img
                          src={currentUser.profilePic}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <UserIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentUser?.name || "User"}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentUser?.email || "user@example.com"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentUser?.phone || "123-456-7890"}
                      </p>

                      <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<Settings className="h-4 w-4" />}
                          onClick={() => alert("Profile settings")}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<CreditCard className="h-4 w-4" />}
                          onClick={() => alert("Payment methods")}
                        >
                          Payment Methods
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/book">
                  <Card interactive className="p-6 text-center">
                    <Car className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Book a Ride
                    </h3>
                  </Card>
                </Link>

                <Card
                  interactive
                  className="p-6 text-center"
                  onClick={() => setActiveTab("upcoming")}
                >
                  <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Upcoming Rides
                  </h3>
                </Card>

                <Card
                  interactive
                  className="p-6 text-center"
                  onClick={() => setActiveTab("history")}
                >
                  <History className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Ride History
                  </h3>
                </Card>
              </div>
            </div>

            {/* Rides Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeTab === "upcoming" ? "Upcoming Rides" : "Ride History"}
                </h2>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={activeTab === "upcoming" ? "primary" : "outline"}
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Upcoming
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTab === "history" ? "primary" : "outline"}
                    onClick={() => setActiveTab("history")}
                  >
                    History
                  </Button>
                </div>
              </div>

              {activeTab === "upcoming" ? (
                upcomingRides.length > 0 ? (
                  <div>{upcomingRides.map(renderRideCard)}</div>
                ) : (
                  <Card className="p-8 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Upcoming Rides
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      You don't have any upcoming rides scheduled.
                    </p>
                    <Link to="/book">
                      <Button variant="primary">Book a Ride</Button>
                    </Link>
                  </Card>
                )
              ) : pastRides.length > 0 ? (
                <div>{pastRides.map(renderRideCard)}</div>
              ) : (
                <Card className="p-8 text-center">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Ride History
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't taken any rides yet.
                  </p>
                  <Link to="/book">
                    <Button variant="primary">Book Your First Ride</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
