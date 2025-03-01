export type UserRole = 'user' | 'driver' | 'admin';

export type CabType = 'economy' | 'standard' | 'luxury';

export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'upi';

export type RideStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'driver_assigned' 
  | 'arrived' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePic?: string;
}

export interface Driver extends User {
  vehicleDetails: {
    model: string;
    color: string;
    plateNumber: string;
    type: CabType;
  };
  rating: number;
  isAvailable: boolean;
  currentLocation?: Location;
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  pickupLocation: Location;
  dropLocation: Location;
  cabType: CabType;
  fare: number;
  distance: number;
  duration: number;
  status: RideStatus;
  paymentMethod: PaymentMethod;
  scheduledTime?: Date;
  startTime?: Date;
  endTime?: Date;
  rating?: number;
  feedback?: string;
  routeDeviation?: boolean;
}