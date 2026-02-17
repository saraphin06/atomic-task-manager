import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, toInputDateTimeLocal } from '../formatDate.ts';

describe('formatDate', () => {
  it('formats a valid date string', () => {
    const result = formatDate('2026-03-15T10:00:00');
    expect(result).toContain('Mar');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });

  it('returns dash for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns dash for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });
});

describe('formatDateTime', () => {
  it('formats a valid datetime string', () => {
    const result = formatDateTime('2026-03-15T10:30:00');
    expect(result).toContain('Mar');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });

  it('returns dash for null', () => {
    expect(formatDateTime(null)).toBe('—');
  });
});

describe('toInputDateTimeLocal', () => {
  it('converts ISO string to datetime-local format', () => {
    const result = toInputDateTimeLocal('2026-03-15T10:30:00');
    expect(result).toMatch(/2026-03-15T10:30/);
  });

  it('returns empty string for null', () => {
    expect(toInputDateTimeLocal(null)).toBe('');
  });

  it('returns empty string for invalid date', () => {
    expect(toInputDateTimeLocal('invalid')).toBe('');
  });
});
