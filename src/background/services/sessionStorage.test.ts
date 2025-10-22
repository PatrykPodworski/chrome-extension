import { describe, it, expect, beforeEach } from "vitest";
import { saveSession, saveSessions, getTodaySessions } from "./sessionStorage";
import { getDatabase, closeDatabase } from "./database";
import { TimeSession } from "../../types/timeTracking";
import "fake-indexeddb/auto";

describe("sessionStorage", () => {
  beforeEach(async () => {
    // Close database to get a fresh instance, then clear data
    await closeDatabase();
    const db = await getDatabase();
    await db.clear("sessions");
  });

  it("should save and retrieve a single session", async () => {
    const session: TimeSession = {
      id: crypto.randomUUID(),
      url: "https://example.com",
      title: "Example",
      domain: "example.com",
      startTime: Date.now(),
      endTime: Date.now() + 5000,
      duration: 5000,
      tabId: 1,
    };

    await saveSession(session);
    const sessions = await getTodaySessions();

    expect(sessions).toHaveLength(1);
    expect(sessions[0]!.id).toBe(session.id);
    expect(sessions[0]!.domain).toBe("example.com");
  });

  it("should save multiple sessions in batch", async () => {
    const sessions: TimeSession[] = [
      {
        id: crypto.randomUUID(),
        url: "https://example.com",
        title: "Example",
        domain: "example.com",
        startTime: Date.now(),
        endTime: Date.now() + 5000,
        duration: 5000,
        tabId: 1,
      },
      {
        id: crypto.randomUUID(),
        url: "https://test.com",
        title: "Test",
        domain: "test.com",
        startTime: Date.now(),
        endTime: Date.now() + 3000,
        duration: 3000,
        tabId: 2,
      },
    ];

    await saveSessions(sessions);
    const todaySessions = await getTodaySessions();

    expect(todaySessions).toHaveLength(2);
  });

  it("should only return today's sessions using IDBKeyRange", async () => {
    const now = Date.now();
    const yesterday = now - 24 * 60 * 60 * 1000; // 24 hours ago
    const tomorrow = now + 24 * 60 * 60 * 1000; // 24 hours from now

    const sessions: TimeSession[] = [
      {
        id: crypto.randomUUID(),
        url: "https://yesterday.com",
        title: "Yesterday",
        domain: "yesterday.com",
        startTime: yesterday,
        endTime: yesterday + 5000,
        duration: 5000,
        tabId: 1,
      },
      {
        id: crypto.randomUUID(),
        url: "https://today1.com",
        title: "Today 1",
        domain: "today1.com",
        startTime: now,
        endTime: now + 5000,
        duration: 5000,
        tabId: 2,
      },
      {
        id: crypto.randomUUID(),
        url: "https://today2.com",
        title: "Today 2",
        domain: "today2.com",
        startTime: now + 1000,
        endTime: now + 6000,
        duration: 5000,
        tabId: 3,
      },
      {
        id: crypto.randomUUID(),
        url: "https://tomorrow.com",
        title: "Tomorrow",
        domain: "tomorrow.com",
        startTime: tomorrow,
        endTime: tomorrow + 5000,
        duration: 5000,
        tabId: 4,
      },
    ];

    await saveSessions(sessions);
    const todaySessions = await getTodaySessions();

    // Should only return the 2 sessions from today
    expect(todaySessions).toHaveLength(2);
    expect(todaySessions.every(s => s.domain.includes("today"))).toBe(true);
    expect(todaySessions.find(s => s.domain === "yesterday.com")).toBeUndefined();
    expect(todaySessions.find(s => s.domain === "tomorrow.com")).toBeUndefined();
  });
});
