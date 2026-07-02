import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.stubEnv('VITE_AUTH_SERVICE_URL', 'http://localhost:8081');
vi.stubEnv('VITE_PROFILE_SERVICE_URL', 'http://localhost:8082');
vi.stubEnv('VITE_JOB_SERVICE_URL', 'http://localhost:8083');
vi.stubEnv('VITE_ASSIGNMENT_SERVICE_URL', 'http://localhost:8084');
vi.stubEnv('VITE_AI_MATCHING_SERVICE_URL', 'http://localhost:8085');
vi.stubEnv('VITE_ATTENDANCE_SERVICE_URL', 'http://localhost:8086');
vi.stubEnv('VITE_PAYMENT_SERVICE_URL', 'http://localhost:8087');
vi.stubEnv('VITE_NOTIFICATION_SERVICE_URL', 'http://localhost:8088');
vi.stubEnv('VITE_WS_URL', 'http://localhost:8088/ws-notifications');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
