import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  clearStorage,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
} from '../storage';
import { STORAGE_KEYS } from '@/config/constants';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('setStorageItem', () => {
    it('stores item in localStorage', () => {
      setStorageItem('test-key', { data: 'value' });
      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify({ data: 'value' }));
    });
  });

  describe('getStorageItem', () => {
    it('retrieves item from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify({ data: 'value' }));
      const result = getStorageItem('test-key');
      expect(result).toEqual({ data: 'value' });
    });

    it('returns null for non-existent key', () => {
      const result = getStorageItem('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('removeStorageItem', () => {
    it('removes item from localStorage', () => {
      localStorage.setItem('test-key', 'value');
      removeStorageItem('test-key');
      expect(localStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('clearStorage', () => {
    it('clears all localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      clearStorage();
      expect(localStorage.length).toBe(0);
    });
  });

  describe('Auth Token Management', () => {
    it('sets auth token', () => {
      setAuthToken('test-token');
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      expect(stored).toBe(JSON.stringify('test-token'));
    });

    it('gets auth token', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify('test-token'));
      expect(getAuthToken()).toBe('test-token');
    });

    it('removes auth token', () => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify('test-token'));
      removeAuthToken();
      expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
    });
  });
});
