const STORAGE_KEY = "save-any-pets:favorites";
export const FAVORITES_CHANGED_EVENT = "favorites-changed";

// getFavoriteIds() must return the same array reference when the underlying
// storage hasn't changed, useSyncExternalStore compares snapshots with
// Object.is and treats a new reference as a change.
let cachedRaw: string | null = null;
let cachedIds: string[] = [];

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getFavoriteIds(): string[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedIds;

  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedIds = Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    cachedIds = [];
  }
  return cachedIds;
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id);
}

/** Toggles a pet in favourites and returns whether it is now favourited. */
export function toggleFavorite(id: string): boolean {
  const ids = getFavoriteIds();
  const isCurrentlyFavorited = ids.includes(id);
  const next = isCurrentlyFavorited ? ids.filter((existing) => existing !== id) : [...ids, id];

  try {
    const raw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedIds = next;
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  } catch {
    // localStorage unavailable (private browsing, disabled storage). The UI
    // state still updates for this render, it just will not persist.
  }

  return !isCurrentlyFavorited;
}
