import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/client';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      username: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        if (!username || !password) {
          set({ error: 'Username and password are required.' });
          return false;
        }
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(username, password);
          const { token, username: loggedInUser } = response.data;
          set({ token, username: loggedInUser, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } catch (err) {
          set({ isLoading: false, error: err.message || 'Login failed. Please try again.' });
          return false;
        }
      },

      logout: () => {
        set({ token: null, username: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),

      isTokenValid: () => {
        const { token } = get();
        if (!token) return false;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp * 1000 > Date.now();
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'daadi-auth',
      partialize: (state) => ({
        token: state.token,
        username: state.username,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Listen for 401 expiry events from the axios interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('daadi-auth-expired', () => {
    useAuthStore.getState().logout();
  });
}

export default useAuthStore;
