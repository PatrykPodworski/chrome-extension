import { describe, it, expect, beforeEach } from "vitest";
import { saveSession, saveSessions, getTodaySessions } from "./sessionStorage";
import { getDatabase } from "./database";
import { TimeSession } from "../../types/timeTracking";
import "fake-indexeddb/auto";

describe("sessionStorage", () => {
  beforeEach(async () => {
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
});
