import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  userRole: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.userRole = action.payload?.role || null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.userRole = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
