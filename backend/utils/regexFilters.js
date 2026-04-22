/**
 * utils/regexFilters.js
 * Layer 1 — Regex-based PII and spam detection.
 * Fast, zero-latency, runs before any external API calls.
 */

/** Email addresses (RFC 5322 simplified) */
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/gi;

/**
 * Phone numbers:
 *  - Indian mobile: optional +91 / 0 prefix, then 10 digits starting 6-9
 *  - Generic international: +<country> then 7-15 digits (with spaces/dashes)
 *  - Generic domestic US-style: (XXX) XXX-XXXX or XXX-XXX-XXXX
 */
const PHONE_REGEX =
  /(?:(?:\+?91[\s\-.]?)?)(?:[6-9]\d{9})|(?:\+\d{1,3}[\s\-.]?\d[\d\s\-.(]{6,15}\d)|(?:\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4})/g;

/**
 * URLs: http/https/ftp with optional www, plus bare www. domains.
 * Intentionally broad — sellers must not embed external links.
 */
const URL_REGEX =
  /(?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"']{2,}|(?:[a-zA-Z0-9\-]+\.(?:com|in|org|net|io|co|shop|store|xyz|info|biz|me)(?:\/[^\s<>"']*)?)/gi;

/**
 * Run all regex checks against the supplied text.
 * @param {string} text
 * @returns {{ flagged: boolean, reason: string|null, matches: object }}
 */
function runRegexFilters(text) {
  if (typeof text !== "string" || !text.trim()) {
    return { flagged: false, reason: null, matches: {} };
  }

  const emailMatches = text.match(EMAIL_REGEX) || [];
  if (emailMatches.length > 0) {
    return {
      flagged: true,
      reason: "email_detected",
      matches: { emails: emailMatches },
    };
  }

  const phoneMatches = text.match(PHONE_REGEX) || [];
  if (phoneMatches.length > 0) {
    return {
      flagged: true,
      reason: "phone_detected",
      matches: { phones: phoneMatches },
    };
  }

  const urlMatches = text.match(URL_REGEX) || [];
  if (urlMatches.length > 0) {
    return {
      flagged: true,
      reason: "url_detected",
      matches: { urls: urlMatches },
    };
  }

  return { flagged: false, reason: null, matches: {} };
}

module.exports = { runRegexFilters, EMAIL_REGEX, PHONE_REGEX, URL_REGEX };
