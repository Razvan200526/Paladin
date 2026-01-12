import { describe, expect, test } from 'bun:test';
import { formatDate, formatRelativeNumber, random } from '@common/utils';

describe('formats relative number', () => {
  test('should format small numbers', () => {
    expect(formatRelativeNumber(999)).toBe('999');
  });
  test('should format thousands', () => {
    expect(formatRelativeNumber(1000)).toBe('1K');
  });
  test('should format millions', () => {
    expect(formatRelativeNumber(1000000)).toBe('1M');
  });
  test('should respect precision', () => {
    expect(formatRelativeNumber(1234, 2)).toBe('1.23K');
  });

  describe('formats date ', () => {
    test("should return 'now' for recent dates", () => {
      const now = new Date();
      expect(formatDate(now)).toBe('now');
    });

    test('should format minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatDate(date)).toBe('5m ago');
    });

    test('should format hours ago', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatDate(date)).toBe('2h ago');
    });
  });

  describe('generates random id(nanoid)', () => {
    test('should generate ID with default lenght', () => {
      const id = random.nanoid();
      expect(id).toHaveLength(21);
    });
    test('should generate ID with custom length', () => {
      const id = random.nanoid(10);
      expect(id).toHaveLength(10);
    });

    test('should generate unique IDs', () => {
      const id1 = random.nanoid(15);
      const id2 = random.nanoid(15);
      expect(id1).not.toBe(id2);
    });
    test('should throw error for invalid lenght', () => {
      expect(() => random.nanoid(0)).toThrow();
      expect(() => random.nanoid(-1)).toThrow();
    });
  });
});
