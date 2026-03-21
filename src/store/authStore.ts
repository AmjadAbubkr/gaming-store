/**
 * Authentication state management using Zustand.
 * 
 * Stores the current user profile, loading state, and handles auth actions.
 * Centralizing this state prevents prop drilling and makes the user profile
 * available anywhere in the app (e.g., for navigation guards).
 */

import { create } from 'zustand';
import { User, LoginData, RegisterData } from '../types';
import * as authService from '../services/firebase/auth';

interface AuthState {
  user: User | null;
  isBootstrapping: boolean;
  isLoading: boolean;
  isGuest: boolean;
  error: string | null;

  // Actions
  login: (data: LoginData) => Promise<void>;
  loginAsAdmin: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setGuestMode: (isGuest: boolean) => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isBootstrapping: true,
  isLoading: false,
  isGuest: false,
  error: null,

  login: async (data: LoginData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(data);
      set({ user, isGuest: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  loginAsAdmin: async (data: LoginData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(data);

      if (user.role !== 'admin') {
        await authService.logout();
        throw new Error('This account does not have admin access.');
      }

      set({ user, isGuest: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(data);
      set({ user, isGuest: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, isGuest: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setGuestMode: (isGuest: boolean) => {
    set((state) => ({
      isGuest,
      user: isGuest ? null : state.user,
      error: null,
      isBootstrapping: false,
    }));
  },

  setUser: (user: User | null) => {
    set({ user, isLoading: false, isBootstrapping: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));
