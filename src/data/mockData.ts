import { faker } from '@faker-js/faker';
import { User, Driver, Ride, CabType, Location, PaymentMethod, RideStatus } from '../types';

// Generate mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    phone: '1234567890',
    role: 'user',
    profilePic: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'driver@example.com',
    phone: '0987654321',
    role: 'driver',
    profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '5555555555',
    role: 'admin',
    profilePic: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
  },
];

// Generate mock drivers
export const mockDrivers: Driver[] = [
  {
    id: '2',
    name: 'Jane Smith',
    email: 'driver@example.com',
    phone: '0987654321',
    role: 'driver',
    profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80',
    vehicleDetails: {
      model: 'Toyota Camry',
      color: 'Black',
      plateNumber: 'ABC123',
      type: 'standard',
    },
    rating: 4.8,
    isAvailable: true,
    currentLocation: {
      address: '123 Main St, City',
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  ...Array(5).fill(null).map((_, index) => ({
    id: `d${index + 1}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: 'driver' as const,
    profilePic: faker.image.avatar(),
    vehicleDetails: {
      model: faker.vehicle.model(),
      color: faker.color.human(),
      plateNumber: faker.vehicle.vrm(),
      type: faker.helpers.arrayElement(['economy', 'standard', 'luxury']) as CabType,
    },
    rating: parseFloat(faker.number.float({ min: 3.5, max: 5, precision: 0.1 }).toFixed(1)),
    isAvailable: faker.datatype.boolean(),
    currentLocation: {
      address: faker.location.streetAddress(),
      lat: parseFloat(faker.location.latitude()),
      lng: parseFloat(faker.location.longitude()),
    },
  })),
];

// Generate mock locations
const generateLocation = (): Location => ({
  address: faker.location.streetAddress(),
  lat: parseFloat(faker.location.latitude()),
  lng: parseFloat(faker.location.longitude()),
});

// Generate mock rides
export const mockRides: Ride[] = [
  {
    id: '1',
    userId: '1',
    driverId: '2',
    pickupLocation: {
      address: '123 Main St, San Francisco, CA',
      lat: 37.7749,
      lng: -122.4194,
    },
    dropLocation: {
      address: '456 Market St, San Francisco, CA',
      lat: 37.7922,
      lng: -122.3964,
    },
    cabType: 'standard',
    fare: 2550,
    distance: 3.2,
    duration: 15,
    status: 'completed',
    paymentMethod: 'card',
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(),
    rating: 5,
    feedback: 'Great ride!',
  },
  ...Array(10).fill(null).map((_, index) => {
    const pickupLocation = generateLocation();
    const dropLocation = generateLocation();
    const cabType = faker.helpers.arrayElement(['economy', 'standard', 'luxury']) as CabType;
    const status = faker.helpers.arrayElement([
      'pending', 'confirmed', 'driver_assigned', 'arrived', 'in_progress', 'completed', 'cancelled'
    ]) as RideStatus;
    const paymentMethod = faker.helpers.arrayElement(['cash', 'card', 'wallet', 'upi']) as PaymentMethod;
    
    const ride: Ride = {
      id: `r${index + 1}`,
      userId: '1',
      pickupLocation,
      dropLocation,
      cabType,
      fare: parseFloat(faker.finance.amount(1000, 10000, 2)),
      distance: parseFloat(faker.number.float({ min: 1, max: 20, precision: 0.1 }).toFixed(1)),
      duration: faker.number.int({ min: 5, max: 60 }),
      status,
      paymentMethod,
    };
    
    if (['driver_assigned', 'arrived', 'in_progress', 'completed'].includes(status)) {
      ride.driverId = mockDrivers[faker.number.int({ min: 0, max: mockDrivers.length - 1 })].id;
    }
    
    if (status === 'completed') {
      ride.startTime = new Date(Date.now() - faker.number.int({ min: 3600000, max: 86400000 }));
      ride.endTime = new Date(ride.startTime.getTime() + ride.duration * 60000);
      ride.rating = faker.number.int({ min: 1, max: 5 });
      ride.feedback = faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 });
    }
    
    if (['pending', 'confirmed', 'driver_assigned'].includes(status)) {
      // For future rides
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + faker.number.int({ min: 1, max: 24 }));
      ride.scheduledTime = futureTime;
    }
    
    if (status === 'in_progress') {
      ride.startTime = new Date(Date.now() - faker.number.int({ min: 600000, max: 1800000 }));
      ride.routeDeviation = faker.helpers.maybe(() => true, { probability: 0.2 });
    }
    
    return ride;
  }),
];

// Calculate fare based on cab type and distance
export const calculateFare = (cabType: CabType, distance: number): number => {
  const baseRates = {
    economy: 500,
    standard: 800,
    luxury: 1200,
  };
  
  const perKmRates = {
    economy: 150,
    standard: 250,
    luxury: 400,
  };
  
  return baseRates[cabType] + (perKmRates[cabType] * distance);
};