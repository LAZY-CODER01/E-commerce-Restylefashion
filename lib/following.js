/**
 * Per-account followed stores (localStorage). Keyed by logged-in user id.
 * Dispatches `restyle-following-changed` on updates for UI sync.
 */

export const FOLLOWING_EVENT = "restyle-following-changed";

const STORAGE_KEY = "restyle_following_by_user_v1";

function readMap() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMap(map) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(FOLLOWING_EVENT));
}

function accountKey(userId) {
  return userId != null && String(userId).trim() !== "" ? String(userId) : "guest";
}

/** @returns {Array<{ sellerId: string, name: string, avatar: string | null, followersLabel: string, listings: number }>} */
export function readFollowed(userId) {
  const map = readMap();
  const key = accountKey(userId);
  const arr = map[key];
  return Array.isArray(arr) ? arr : [];
}

export function isFollowing(userId, sellerId) {
  if (!sellerId) return false;
  return readFollowed(userId).some((s) => s.sellerId === String(sellerId));
}

/**
 * Add or remove follow. Returns true if now following, false if removed.
 */
export function toggleFollowSeller(userId, entry) {
  const sid = entry?.sellerId != null ? String(entry.sellerId) : "";
  if (!sid) return false;

  const map = readMap();
  const key = accountKey(userId);
  const prev = readFollowed(userId);
  const idx = prev.findIndex((s) => s.sellerId === sid);

  let next;
  if (idx >= 0) {
    next = prev.filter((s) => s.sellerId !== sid);
    map[key] = next;
    writeMap(map);
    return false;
  }

  const row = {
    sellerId: sid,
    name: String(entry.name || "Store").trim() || "Store",
    avatar: entry.avatar || null,
    followersLabel: String(entry.followersLabel ?? "0"),
    listings: Number(entry.listings) || 0,
  };
  next = [row, ...prev.filter((s) => s.sellerId !== sid)];
  map[key] = next;
  writeMap(map);
  return true;
}

export function unfollowSeller(userId, sellerId) {
  if (!sellerId) return;
  const map = readMap();
  const key = accountKey(userId);
  const prev = readFollowed(userId);
  map[key] = prev.filter((s) => s.sellerId !== String(sellerId));
  writeMap(map);
}
