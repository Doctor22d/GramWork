import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { Role } from '@/types';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('initializes with empty state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('sets auth correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      phoneNumber: '9876543210',
      role: Role.Worker,
      isVerified: true,
    };
    const mockToken = 'test-token';

    useAuthStore.getState().setAuth(mockUser, mockToken);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
  });

  it('clears auth correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      phoneNumber: '9876543210',
      role: Role.Worker,
      isVerified: true,
    };

    useAuthStore.getState().setAuth(mockUser, 'token');
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('updates user correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      phoneNumber: '9876543210',
      role: Role.Worker,
      isVerified: false,
    };

    useAuthStore.getState().setAuth(mockUser, 'token');
    useAuthStore.getState().updateUser({ isVerified: true });

    const state = useAuthStore.getState();
    expect(state.user?.isVerified).toBe(true);
  });
});
