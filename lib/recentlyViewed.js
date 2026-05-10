/**
 * Persist recently viewed PDP items for buyers (localStorage).
 * Dispatches `restyle-recently-viewed-updated` on change for live UI refresh.
 */

const STORAGE_KEY_PREFIX = "restyle_recently_viewed_v1";
const MAX_ITEMS = 50;

function storageKey(userKey) {
  const k = userKey ? String(userKey).trim().slice(0, 128) : "guest";
  return `${STORAGE_KEY_PREFIX}_${k}`;
}

export const RECENTLY_VIEWED_UPDATED_EVENT = "restyle-recently-viewed-updated";

function safeParse(raw) {
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

/**
 * @param {{
 *   id: string | number,
 *   title: string,
 *   imageUrl?: string | null,
 *   price?: number,
 *   displaySize?: string | null,
 *   displayColor?: string | null,
 * }} entry
 * @param {string | undefined} [userKey] – e.g. user email/id for per-account history
 */
export function recordRecentlyViewed(entry, userKey) {
  if (typeof window === "undefined" || entry == null) return;
  const idStr = entry.id != null ? String(entry.id).trim() : "";
  if (!idStr || !entry.title) return;

  const key = storageKey(userKey);

  try {
    const list = safeParse(window.localStorage.getItem(key));
    const rest = list.filter((e) => String(e?.id) !== idStr);
    const row = {
      id: idStr,
      title: String(entry.title).slice(0, 200),
      imageUrl: entry.imageUrl || "",
      price: Number(entry.price) || 0,
      displaySize:
        entry.displaySize != null && String(entry.displaySize).trim()
          ? String(entry.displaySize).trim()
          : null,
      displayColor:
        entry.displayColor != null && String(entry.displayColor).trim()
          ? String(entry.displayColor).trim()
          : null,
      viewedAt: Date.now(),
    };
    const next = [row, ...rest].slice(0, MAX_ITEMS);
    window.localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(RECENTLY_VIEWED_UPDATED_EVENT));
  } catch {
    /* quota / privacy mode */
  }
}

/** @param {string | undefined} [userKey] */
export function readRecentlyViewed(userKey) {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(storageKey(userKey)));
  } catch {
    return [];
  }
}
