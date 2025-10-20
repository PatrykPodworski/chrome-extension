import { describe, it, expect, beforeAll } from 'vitest';
import { getDatabase } from './database';

// Mock IndexedDB for Node.js test environment
import 'fake-indexeddb/auto';

beforeAll(() => {
  // Set up IndexedDB globals for testing
  globalThis.indexedDB = indexedDB;
});

describe('database', () => {
  it('should create database with correct schema', async () => {
    const db = await getDatabase();

    expect(db.name).toBe('TimeTrackingDB');
    expect(db.version).toBe(1);
    expect(db.objectStoreNames.contains('sessions')).toBe(true);

    db.close();
  });

  it('should have required indexes', async () => {
    const db = await getDatabase();
    const tx = db.transaction('sessions', 'readonly');
    const store = tx.objectStore('sessions');

    expect(store.indexNames.contains('by_date')).toBe(true);
    expect(store.indexNames.contains('by_domain')).toBe(true);
    expect(store.indexNames.contains('by_startTime')).toBe(true);

    db.close();
  });
});
