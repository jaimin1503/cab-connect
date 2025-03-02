import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/common/Tabs";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import RideMonitoring from "../components/admin/RideMonitoring";
import AlertSystem from "../components/admin/AlertSystem";
import { BarChart, Users, Settings, Car, AlertTriangle } from "lucide-react";
import Card from "../components/common/Card";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Mock statistics for the dashboard
  const stats = [
    {
      label: "Total Rides",
      value: "1,248",
      icon: <Car className="h-8 w-8 text-blue-500" />,
      change: "+12%",
    },
    {
      label: "Active Drivers",
      value: "86",
      icon: <Users className="h-8 w-8 text-green-500" />,
      change: "+5%",
    },
    {
      label: "Alerts",
      value: "7",
      icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
      change: "-3%",
    },
    {
      label: "Revenue",
      value: "₹1,24,500",
      icon: <BarChart className="h-8 w-8 text-purple-500" />,
      change: "+8%",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              Admin Dashboard
            </h1>

            <button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => alert("Settings")}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </h3>
                  </div>
                  <div>{stat.icon}</div>
                </div>
                <div
                  className={`mt-2 text-sm ${
                    stat.change.startsWith("+")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat.change} from last month
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rides">Ride Monitoring</TabsTrigger>
              <TabsTrigger value="alerts">Alert System</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-gray-800 dark:text-white">
                            New ride request{" "}
                            <span className="font-medium">#{1000 + index}</span>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {index * 10 + 5} minutes ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    System Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Server Status
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Payment Gateway
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Maps API
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Notification Service
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-xs">
                        Degraded
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        Database
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                        Operational
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rides">
              <RideMonitoring />
            </TabsContent>

            <TabsContent value="alerts">
              <AlertSystem />
            </TabsContent>

            <TabsContent value="drivers">
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Driver Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  This section is under development. You'll be able to manage
                  drivers, view their profiles, and track performance metrics.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  User Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  This section is under development. You'll be able to manage
                  users, view their profiles, and handle support requests.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
