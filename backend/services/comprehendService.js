/**
 * services/comprehendService.js
 * Layer 2 — AWS Comprehend PII entity detection.
 *
 * Uses DetectPiiEntities to find NAME, EMAIL, PHONE, ADDRESS, etc.
 * Runs in parallel with OpenAI moderation (Promise.all in the route).
 */

const { ComprehendClient, DetectPiiEntitiesCommand } = require("@aws-sdk/client-comprehend");

// PII entity types we care about blocking
const BLOCKED_PII_TYPES = new Set([
  "EMAIL",
  "PHONE",
  "ADDRESS",
  "NAME",
  "URL",
  "CREDIT_DEBIT_NUMBER",
  "CREDIT_DEBIT_CVV",
  "CREDIT_DEBIT_EXPIRY",
  "PIN",
  "SSN",
  "BANK_ACCOUNT_NUMBER",
  "BANK_ROUTING",
  "IP_ADDRESS",
  "PASSPORT_NUMBER",
  "DRIVER_ID",
]);

let client = null;

function getComprehendClient() {
  if (!client) {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "AWS Comprehend credentials not configured. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in .env"
      );
    }

    client = new ComprehendClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

/**
 * Detect PII entities in text using AWS Comprehend.
 * @param {string} text
 * @returns {Promise<{ flagged: boolean, reason: string|null, entities: Array }>}
 */
async function detectPii(text) {
  // Comprehend requires at least 3 chars and max 5000 bytes
  const trimmed = (text || "").trim();
  if (trimmed.length < 3) {
    return { flagged: false, reason: null, entities: [] };
  }

  const truncated = trimmed.slice(0, 4900); // safety margin under 5000 byte limit

  const command = new DetectPiiEntitiesCommand({
    Text: truncated,
    LanguageCode: "en",
  });

  const response = await getComprehendClient().send(command);
  const entities = response.Entities || [];

  // Filter to only blocked types with a meaningful confidence score
  const flaggedEntities = entities.filter(
    (e) => BLOCKED_PII_TYPES.has(e.Type) && e.Score >= 0.7
  );

  if (flaggedEntities.length > 0) {
    return {
      flagged: true,
      reason: "pii_detected",
      entities: flaggedEntities.map((e) => ({ type: e.Type, score: e.Score })),
    };
  }

  return { flagged: false, reason: null, entities: [] };
}

module.exports = { detectPii };
