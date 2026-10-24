/**
 * Example interface and in-memory implementation for demonstration only.
 * An in-memory map is not shared across instances and is lost on restart.
 * Production systems need an appropriate shared, durable store with atomic operations.
 */

export interface ReplayStore {
  hasSeen(assertionId: string): Promise<boolean>;
  markSeen(assertionId: string, expiresAtEpochSeconds: number): Promise<void>;
}

export class InMemoryReplayStore implements ReplayStore {
  private readonly seen = new Map<string, number>();

  async hasSeen(assertionId: string): Promise<boolean> {
    const expiry = this.seen.get(assertionId);
    if (expiry === undefined) return false;

    if (expiry <= Math.floor(Date.now() / 1000)) {
      this.seen.delete(assertionId);
      return false;
    }

    return true;
  }

  async markSeen(assertionId: string, expiresAtEpochSeconds: number): Promise<void> {
    this.seen.set(assertionId, expiresAtEpochSeconds);
  }
}
