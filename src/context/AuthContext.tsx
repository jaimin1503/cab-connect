import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  const db = getFirestore();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser) as User;
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserRole(user.role);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Here you would typically fetch additional user data from your backend
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'user' as UserRole, // Default role, adjust based on your needs
        photoURL: firebaseUser.photoURL || ''
      };
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserRole(user.role);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Here you would typically fetch additional user data from your backend
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'user' as UserRole, // Default role, adjust based on your needs
        photoURL: firebaseUser.photoURL || ''
      };
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserRole(user.role);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone: string; role: UserRole }): Promise<boolean> => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // Update user profile with name
      await updateProfile(firebaseUser, {
        displayName: data.name
      });

      // Create user document in Firestore
      const userDoc = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDoc, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Update local state
      const user: User = {
        id: firebaseUser.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        photoURL: firebaseUser.photoURL || ''
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      setUserRole(data.role);
      localStorage.setItem('currentUser', JSON.stringify(user));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, loginWithGoogle, register, logout, isAuthenticated, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};