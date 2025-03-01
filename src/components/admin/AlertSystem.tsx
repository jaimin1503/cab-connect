import React, { useState } from 'react';
import { Bell, AlertTriangle, PhoneOff, MapPin, LocateFixed, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  type: 'call_failed' | 'route_deviation' | 'driver_offline' | 'sos';
  rideId: string;
  driverName: string;
  timestamp: Date;
  location?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'call_failed',
    rideId: 'r1',
    driverName: 'Jane Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    message: 'Failed to reach driver after 3 attempts',
    severity: 'medium',
    resolved: false,
  },
  {
    id: '2',
    type: 'route_deviation',
    rideId: 'r3',
    driverName: 'Michael Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    location: '123 Main St, City',
    message: 'Driver has deviated from the planned route by more than 1 km',
    severity: 'high',
    resolved: false,
  },
  {
    id: '3',
    type: 'driver_offline',
    rideId: 'r5',
    driverName: 'Robert Davis',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    message: 'Driver went offline during an active ride',
    severity: 'high',
    resolved: true,
  },
  {
    id: '4',
    type: 'sos',
    rideId: 'r2',
    driverName: 'Sarah Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    location: '456 Oak St, City',
    message: 'SOS button pressed by passenger',
    severity: 'high',
    resolved: false,
  },
];

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');
  
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'active') return !alert.resolved;
    if (filter === 'resolved') return alert.resolved;
    return true;
  });
  
  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'call_failed':
        return <PhoneOff className="h-5 w-5 text-orange-500" />;
      case 'route_deviation':
        return <MapPin className="h-5 w-5 text-red-500" />;
      case 'driver_offline':
        return <LocateFixed className="h-5 w-5 text-red-500" />;
      case 'sos':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const formatTime = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alert System</h2>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'active' ? 'primary' : 'outline'} 
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'resolved' ? 'primary' : 'outline'} 
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`border-l-4 ${
                  alert.resolved 
                    ? 'border-l-gray-400 dark:border-l-gray-600' 
                    : alert.severity === 'high' 
                      ? 'border-l-red-500' 
                      : alert.severity === 'medium' 
                        ? 'border-l-orange-500' 
                        : 'border-l-blue-500'
                }`}>
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {alert.type === 'call_failed' && 'Call Failed'}
                              {alert.type === 'route_deviation' && 'Route Deviation'}
                              {alert.type === 'driver_offline' && 'Driver Offline'}
                              {alert.type === 'sos' && 'SOS Emergency'}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityClass(alert.severity)}`}>
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </span>
                            {alert.resolved && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                Resolved
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {alert.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Ride:</span>
                              <span>#{alert.rideId}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Driver:</span>
                              <span>{alert.driverName}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatTime(alert.timestamp)}</span>
                            </div>
                          </div>
                          {alert.location && (
                            <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{alert.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => alert(`Viewing details for alert ${alert.id}`)}
                        >
                          View Details
                        </Button>
                        {!alert.resolved && (
                          <Button 
                            size="sm" 
                            variant="primary" 
                            onClick={() => handleResolve(alert.id)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No alerts found.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlertSystem;