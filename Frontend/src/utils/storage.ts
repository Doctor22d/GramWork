import { STORAGE_KEYS } from '@/config/constants';

/**
 * Set item in localStorage with JSON stringification
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
};

/**
 * Get item from localStorage with JSON parsing
 */
export const getStorageItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
};

/**
 * Clear all localStorage items
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Get auth token from storage
 */
export const getAuthToken = (): string | null => {
  return getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Set auth token in storage
 */
export const setAuthToken = (token: string): void => {
  setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Remove auth token from storage
 */
export const removeAuthToken = (): void => {
  removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
};
