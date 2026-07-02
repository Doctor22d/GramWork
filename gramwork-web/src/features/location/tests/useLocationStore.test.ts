import { describe, it, expect, beforeEach } from 'vitest';
import { useLocationStore } from '../store/useLocationStore';

describe('useLocationStore (Store Tests)', () => {
  beforeEach(() => {
    // Reset state before each test
    useLocationStore.setState({
      latitude: null,
      longitude: null,
      accuracy: null,
      lastUpdated: null,
      permissionState: 'prompt',
      serviceRadiusKm: 5,
      autoUpdateEnabled: true
    });
  });

  it('initializes with default state safely avoiding server cache', () => {
    const state = useLocationStore.getState();
    expect(state.latitude).toBeNull();
    expect(state.longitude).toBeNull();
    expect(state.serviceRadiusKm).toBe(5);
    expect(state.permissionState).toBe('prompt');
  });

  it('updates location coordinates and timestamp natively', () => {
    const { setLocation } = useLocationStore.getState();
    setLocation(28.7041, 77.1025, 10);

    const state = useLocationStore.getState();
    expect(state.latitude).toBe(28.7041);
    expect(state.longitude).toBe(77.1025);
    expect(state.accuracy).toBe(10);
    expect(state.lastUpdated).not.toBeNull();
  });

  it('handles permission state updates accurately', () => {
    const { setPermissionState } = useLocationStore.getState();
    
    setPermissionState('granted');
    expect(useLocationStore.getState().permissionState).toBe('granted');

    setPermissionState('denied');
    expect(useLocationStore.getState().permissionState).toBe('denied');
  });

  it('persists service radius configurations explicitly', () => {
    const { setServiceRadius } = useLocationStore.getState();
    
    setServiceRadius(25);
    expect(useLocationStore.getState().serviceRadiusKm).toBe(25);
  });
});
