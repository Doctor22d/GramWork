import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPhoneNumber,
  formatAadhaar,
  calculateDistance,
  formatDistance,
  getInitials,
  truncateText,
} from '../formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(50000)).toBe('₹50,000');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('₹0');
    });

    it('removes decimal places', () => {
      expect(formatCurrency(1000.50)).toBe('₹1,001');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats 10-digit phone number', () => {
      expect(formatPhoneNumber('9876543210')).toBe('+91 98765 43210');
    });

    it('returns original if not 10 digits', () => {
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });

  describe('formatAadhaar', () => {
    it('formats 12-digit Aadhaar number', () => {
      expect(formatAadhaar('123456789012')).toBe('1234 5678 9012');
    });

    it('returns original if not 12 digits', () => {
      expect(formatAadhaar('123')).toBe('123');
    });
  });

  describe('calculateDistance', () => {
    it('calculates distance between two coordinates', () => {
      const distance = calculateDistance(28.6139, 77.209, 28.7041, 77.1025);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(15);
    });

    it('returns 0 for same coordinates', () => {
      const distance = calculateDistance(28.6139, 77.209, 28.6139, 77.209);
      expect(distance).toBe(0);
    });
  });

  describe('formatDistance', () => {
    it('formats distance in meters for less than 1 km', () => {
      expect(formatDistance(0.5)).toBe('500 m');
    });

    it('formats distance in kilometers for 1 km or more', () => {
      expect(formatDistance(5.5)).toBe('5.5 km');
    });
  });

  describe('getInitials', () => {
    it('returns initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('returns first letter for single word', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('returns empty string for empty input', () => {
      expect(getInitials('')).toBe('');
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a ...');
    });

    it('returns original text if shorter than max length', () => {
      expect(truncateText('Short', 10)).toBe('Short');
    });
  });
});
