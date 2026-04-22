/**
 * routes/moderationRoutes.js
 * POST /api/moderate
 *
 * 3-layer content moderation pipeline:
 *   Layer 1 → Regex (zero-latency, runs first)
 *   Layer 2 → AWS Comprehend PII detection  } run in
 *   Layer 3 → OpenAI Moderation API         } parallel
 *
 * Response (200 always):
 *   { "status": "approved" }
 *   { "status": "rejected", "reason": "email_detected" | "phone_detected" | "url_detected" | "pii_detected" | "toxic_content" }
 *
 * Error responses (4xx/5xx) are only for malformed requests or infra failures.
 */

const express = require("express");
const rateLimit = require("express-rate-limit");
const { runRegexFilters } = require("../utils/regexFilters");
const { detectPii } = require("../services/comprehendService");
const { moderateContent } = require("../services/openaiModerationService");

const router = express.Router();

// ── Rate limiter: max 30 requests per minute per IP ──────────────────────────
const moderationLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 30,                    // limit each IP to 30 requests per window
  standardHeaders: true,      // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    status: "rejected",
    reason: "rate_limit_exceeded",
  },
  skipSuccessfulRequests: false,
});

// ── Timeout wrapper (2 s hard limit for each external call) ──────────────────
function withTimeout(promise, ms = 2000, label = "operation") {
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    )
  );
  return Promise.race([promise, timeout]);
}

// ── POST /api/moderate ────────────────────────────────────────────────────────
router.post("/", moderationLimiter, async (req, res) => {
  const { text } = req.body;

  // ── Input validation ──────────────────────────────────────────────────────
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({
      status: "rejected",
      reason: "invalid_input",
      message: "Request body must contain a non-empty 'text' field.",
    });
  }

  const clean = text.trim();

  // ── LAYER 1: Regex (synchronous, instant) ────────────────────────────────
  const regexResult = runRegexFilters(clean);
  if (regexResult.flagged) {
    return res.status(200).json({
      status: "rejected",
      reason: regexResult.reason,
      layer: 1,
    });
  }

  // ── LAYERS 2 & 3: Run in parallel with 2 s timeout each ──────────────────
  const awsEnabled = !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  );
  const openaiEnabled = !!process.env.OPENAI_API_KEY;

  try {
    const tasks = [];

    if (awsEnabled) {
      tasks.push(
        withTimeout(detectPii(clean), 2000, "AWS Comprehend").catch((err) => {
          console.warn("⚠️  AWS Comprehend error (skipped):", err.message);
          return { flagged: false, reason: null }; // graceful degrade
        })
      );
    } else {
      tasks.push(Promise.resolve({ flagged: false, reason: null }));
    }

    if (openaiEnabled) {
      tasks.push(
        withTimeout(moderateContent(clean), 2000, "OpenAI Moderation").catch((err) => {
          console.warn("⚠️  OpenAI Moderation error (skipped):", err.message);
          return { flagged: false, reason: null }; // graceful degrade
        })
      );
    } else {
      tasks.push(Promise.resolve({ flagged: false, reason: null }));
    }

    const [comprehendResult, openaiResult] = await Promise.all(tasks);

    // Layer 2: PII check
    if (comprehendResult.flagged) {
      return res.status(200).json({
        status: "rejected",
        reason: comprehendResult.reason, // "pii_detected"
        layer: 2,
      });
    }

    // Layer 3: Toxic content check
    if (openaiResult.flagged) {
      return res.status(200).json({
        status: "rejected",
        reason: openaiResult.reason, // "toxic_content"
        layer: 3,
      });
    }

    // ── All layers passed ───────────────────────────────────────────────────
    return res.status(200).json({ status: "approved" });

  } catch (err) {
    console.error("❌ Moderation pipeline error:", err.message);
    // On unexpected infra failure → approve rather than block valid sellers
    return res.status(200).json({
      status: "approved",
      warning: "moderation_unavailable",
    });
  }
});

module.exports = router;
